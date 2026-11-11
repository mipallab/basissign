import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { contactPayloadSchema } from "@/lib/contact-schema";

export const runtime = "nodejs";

const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 12;
const MAX_RATE_LOG_ENTRIES = 2000;
const MAX_REQUEST_BYTES = 24 * 1024; // 24 KB max JSON contact payload

const ipRequestLog = new Map<string, number[]>();

function checkRateLimit(clientIp: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_WINDOW_MS;

  if (ipRequestLog.size >= MAX_RATE_LOG_ENTRIES) {
    for (const [ip, timestamps] of ipRequestLog.entries()) {
      const fresh = timestamps.filter((t) => t > windowStart);
      if (fresh.length === 0) {
        ipRequestLog.delete(ip);
      } else {
        ipRequestLog.set(ip, fresh);
      }
    }

    while (ipRequestLog.size >= MAX_RATE_LOG_ENTRIES) {
      const oldestKey = ipRequestLog.keys().next().value;
      if (oldestKey === undefined) break;
      ipRequestLog.delete(oldestKey);
    }
  }

  const existing = ipRequestLog.get(clientIp) ?? [];
  const recent = existing.filter((t) => t > windowStart);

  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    ipRequestLog.delete(clientIp);
    ipRequestLog.set(clientIp, recent);
    return false;
  }

  recent.push(now);
  ipRequestLog.delete(clientIp);
  ipRequestLog.set(clientIp, recent);
  return true;
}

function getClientIp(request: NextRequest): string {
  const trustProxy = process.env.TRUST_PROXY?.trim().toLowerCase();
  if (trustProxy !== "cloudflare" && trustProxy !== "1") {
    return "direct";
  }

  const cfIp = request.headers.get("cf-connecting-ip")?.trim();
  if (cfIp) return cfIp;

  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const parts = forwarded
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
    if (parts.length > 0) {
      return parts[parts.length - 1];
    }
  }

  return request.headers.get("x-real-ip")?.trim() || "direct";
}

async function readRequestTextBounded(
  request: NextRequest,
  maxBytes: number
): Promise<string | "TOO_LARGE" | null> {
  if (!request.body) {
    return "";
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;

      totalBytes += value.byteLength;
      if (totalBytes > maxBytes) {
        await reader.cancel().catch(() => {});
        return "TOO_LARGE";
      }
      chunks.push(value);
    }
  } catch {
    return null;
  }

  const combined = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return new TextDecoder("utf-8", { fatal: false }).decode(combined);
}

function generateContactRefId(): string {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, "0");
  const d = String(now.getUTCDate()).padStart(2, "0");
  const token = crypto.randomUUID().slice(0, 8).toUpperCase();
  return `BSC-${y}${m}${d}-${token}`;
}

export async function POST(request: NextRequest) {
  const clientIp = getClientIp(request);
  if (!checkRateLimit(clientIp)) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Too many contact requests from this connection. Please wait a few minutes or call +1 (912) 304-4034.",
      },
      { status: 429 }
    );
  }

  const contentLengthHeader = request.headers.get("content-length");
  if (contentLengthHeader) {
    const contentLength = Number(contentLengthHeader);
    if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
      return NextResponse.json(
        {
          ok: false,
          error: "Inquiry payload exceeds maximum allowed size limit.",
        },
        { status: 413 }
      );
    }
  }

  const boundedBody = await readRequestTextBounded(request, MAX_REQUEST_BYTES);
  if (boundedBody === "TOO_LARGE") {
    return NextResponse.json(
      {
        ok: false,
        error: "Inquiry payload exceeds maximum allowed size limit.",
      },
      { status: 413 }
    );
  }
  if (boundedBody === null) {
    return NextResponse.json(
      { ok: false, error: "Unable to read inquiry request body." },
      { status: 400 }
    );
  }

  const rawBodyText = boundedBody;

  let rawPayload: Record<string, unknown>;
  try {
    const parsedJson = JSON.parse(rawBodyText) as unknown;
    if (
      !parsedJson ||
      typeof parsedJson !== "object" ||
      Array.isArray(parsedJson)
    ) {
      return NextResponse.json(
        { ok: false, error: "Malformed inquiry JSON payload." },
        { status: 400 }
      );
    }
    rawPayload = parsedJson as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON request body." },
      { status: 400 }
    );
  }

  // Silent honeypot anti-spam trap
  if (
    typeof rawPayload.websiteUrl === "string" &&
    rawPayload.websiteUrl.trim().length > 0
  ) {
    return NextResponse.json(
      {
        ok: true,
        contactRefId: "BSC-RECEIVED",
        receivedAt: new Date().toISOString(),
      },
      { status: 200 }
    );
  }

  const parsedPayload = contactPayloadSchema.safeParse(rawPayload);
  if (!parsedPayload.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Please correct the highlighted inquiry fields and try again.",
        fieldErrors: z.flattenError(parsedPayload.error).fieldErrors,
      },
      { status: 400 }
    );
  }

  const contactRefId = generateContactRefId();
  const receivedAt = new Date().toISOString();
  const contactDir = path.join(process.cwd(), "data", "contacts", contactRefId);

  try {
    await fs.mkdir(contactDir, { recursive: true, mode: 0o700 });
    const record = {
      contactRefId,
      receivedAt,
      payload: {
        ...parsedPayload.data,
        websiteUrl: undefined,
      },
    };
    await fs.writeFile(
      path.join(contactDir, "contact.json"),
      JSON.stringify(record, null, 2),
      { encoding: "utf8", mode: 0o600 }
    );
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Unable to save your message right now. Please email support@basissign.com directly.",
      },
      { status: 500 }
    );
  }

  // Optional Webhook Notification (strict HTTPS in production, no redirects)
  const rawWebhook = process.env.CONTACT_WEBHOOK_URL?.trim();
  if (rawWebhook) {
    let parsedWebhook: URL | null = null;
    try {
      parsedWebhook = new URL(rawWebhook);
    } catch {
      parsedWebhook = null;
    }

    const isAllowedProtocol =
      process.env.NODE_ENV === "production"
        ? parsedWebhook?.protocol === "https:"
        : parsedWebhook?.protocol === "https:" ||
          parsedWebhook?.protocol === "http:";

    if (parsedWebhook && isAllowedProtocol) {
      try {
        await fetch(parsedWebhook.toString(), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          redirect: "error",
          signal: AbortSignal.timeout(4000),
          body: JSON.stringify({
            event: "basissign.contact.created",
            contactRefId,
            receivedAt,
            inquiryTopic: parsedPayload.data.inquiryTopic,
            signSystem: parsedPayload.data.signSystem,
            placement: parsedPayload.data.placement,
            companyName: parsedPayload.data.companyName,
            fullName: parsedPayload.data.fullName,
            email: parsedPayload.data.email,
          }),
        });
      } catch {
        // Do not fail customer confirmation on optional webhook timeout
      }
    }
  }

  return NextResponse.json(
    {
      ok: true,
      contactRefId,
      receivedAt,
      message: "Message received by BASISSIGN US engineering and support desk.",
    },
    { status: 201 }
  );
}
