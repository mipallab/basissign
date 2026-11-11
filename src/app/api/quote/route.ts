import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import {
  ALLOWED_MIME_BY_EXT,
  ALLOWED_UPLOAD_EXTENSIONS,
  MAX_UPLOAD_BYTES,
  MAX_UPLOAD_FILES,
  quotePayloadSchema,
} from "@/lib/quote-schema";

export const runtime = "nodejs";

const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 12;
const MAX_RATE_LOG_ENTRIES = 2000;

const MAX_TOTAL_UPLOAD_BYTES = MAX_UPLOAD_FILES * MAX_UPLOAD_BYTES;
const MAX_REQUEST_BYTES = MAX_TOTAL_UPLOAD_BYTES + 256 * 1024;
const MAX_JSON_PAYLOAD_CHARS = 32 * 1024;

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

function validateSvgBuffer(buffer: Buffer): { valid: boolean; reason?: string } {
  if (buffer.includes(0x00)) {
    return {
      valid: false,
      reason: "Invalid SVG encoding: NUL bytes are not permitted.",
    };
  }

  // Reject UTF-16 and UTF-32 BOMs before UTF-8 decoding to block parser differentials
  if (
    (buffer.length >= 2 &&
      ((buffer[0] === 0xff && buffer[1] === 0xfe) ||
        (buffer[0] === 0xfe && buffer[1] === 0xff))) ||
    (buffer.length >= 4 &&
      ((buffer[0] === 0x00 &&
        buffer[1] === 0x00 &&
        buffer[2] === 0xfe &&
        buffer[3] === 0xff) ||
        (buffer[0] === 0xff &&
          buffer[1] === 0xfe &&
          buffer[2] === 0x00 &&
          buffer[3] === 0x00)))
  ) {
    return {
      valid: false,
      reason: "Unsupported UTF-16/UTF-32 SVG BOM. Export as UTF-8 SVG or PDF.",
    };
  }

  let svgText = buffer.toString("utf8");
  if (svgText.startsWith("\uFEFF")) {
    svgText = svgText.slice(1);
  }

  // Strip leading whitespace, optional <?xml ...?> declaration, and XML comments
  let rootCursor = svgText.trimStart();
  if (/^<\?xml\b[\s\S]*?\?>/i.test(rootCursor)) {
    rootCursor = rootCursor.replace(/^<\?xml\b[\s\S]*?\?>/i, "").trimStart();
  }
  while (/^<!--[\s\S]*?-->/.test(rootCursor)) {
    rootCursor = rootCursor.replace(/^<!--[\s\S]*?-->/, "").trimStart();
  }

  if (!/^<svg(?:\s|>)/i.test(rootCursor)) {
    return {
      valid: false,
      reason: "SVG file must begin with a valid <svg> root element.",
    };
  }

  const dangerousConstructs = [
    /<!(?:DOCTYPE|ENTITY)\b/i,
    /<\?xml-stylesheet\b/i,
    /<\/?style\b/i,
    /@import\b/i,
    /expression\s*\(/i,
    /<(?:[a-z0-9_-]+:)?(?:script|foreignObject|iframe|object|embed|applet|frame|frameset|meta|link|base|audio|video|animate|set|animateMotion|animateTransform|handler|listener)\b/i,
    /(?:^|[\s/:])on[a-z]+\s*=/i,
    /<[^>]*=\s*(?:"[^"]*&#[^"]*"|'[^']*&#[^']*'|[^\s>]*&#[^\s>]*)/i,
    /(?:javascript|vbscript)\s*:|data\s*:\s*(?:text\/|application\/|image\/svg\+xml)/i,
  ];

  if (dangerousConstructs.some((pattern) => pattern.test(svgText))) {
    return {
      valid: false,
      reason:
        "SVG contains unsupported active content, DTDs, or scripts. Export as PDF or clean outlined SVG.",
    };
  }

  const urlMatches = svgText.matchAll(/url\s*\(([^)]*)\)/gi);
  for (const match of urlMatches) {
    const inner = (match[1] ?? "").trim().replace(/^["']|["']$/g, "").trim();
    if (!/^#[A-Za-z_][\w:.-]*$/.test(inner)) {
      return {
        valid: false,
        reason: "SVG contains external or non-fragment url() reference.",
      };
    }
  }

  const hrefMatches = svgText.matchAll(
    /(?:^|[\s:])(?:xlink:)?href\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi
  );
  for (const match of hrefMatches) {
    const target = (match[1] ?? match[2] ?? match[3] ?? "").trim();
    const isFragment = /^#[A-Za-z_][\w:.-]*$/.test(target);
    const isSafeRasterData =
      /^data:image\/(?:png|jpeg|jpg|webp|gif);base64,[A-Za-z0-9+/=]+$/i.test(
        target
      );
    if (!isFragment && !isSafeRasterData) {
      return {
        valid: false,
        reason: "SVG contains external or unsafe href reference.",
      };
    }
  }

  return { valid: true };
}

function validateMagicBytesAndContent(
  ext: string,
  buffer: Buffer
): { valid: boolean; reason?: string } {
  if (buffer.length === 0) {
    return { valid: false, reason: "Uploaded file is empty." };
  }

  switch (ext) {
    case ".pdf": {
      const header = buffer.subarray(0, 5).toString("ascii");
      return header === "%PDF-"
        ? { valid: true }
        : { valid: false, reason: "Invalid PDF signature." };
    }
    case ".png": {
      const pngMagic = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
      const matches =
        buffer.length >= pngMagic.length &&
        pngMagic.every((byte, idx) => buffer[idx] === byte);
      return matches
        ? { valid: true }
        : { valid: false, reason: "Invalid PNG image signature." };
    }
    case ".jpg":
    case ".jpeg": {
      const matches =
        buffer.length >= 3 &&
        buffer[0] === 0xff &&
        buffer[1] === 0xd8 &&
        buffer[2] === 0xff;
      return matches
        ? { valid: true }
        : { valid: false, reason: "Invalid JPEG image signature." };
    }
    case ".eps": {
      const textHead = buffer.subarray(0, 16).toString("ascii");
      const isAsciiEps = textHead.startsWith("%!PS-Adobe");
      const isDosEps =
        buffer.length >= 4 &&
        buffer[0] === 0xc5 &&
        buffer[1] === 0xd0 &&
        buffer[2] === 0xd3 &&
        buffer[3] === 0xc6;
      return isAsciiEps || isDosEps
        ? { valid: true }
        : { valid: false, reason: "Invalid EPS PostScript header." };
    }
    case ".ai": {
      const textHead = buffer.subarray(0, 16).toString("ascii");
      const validAi =
        textHead.startsWith("%PDF-") || textHead.startsWith("%!PS-Adobe");
      return validAi
        ? { valid: true }
        : { valid: false, reason: "Invalid Adobe Illustrator (.ai) file header." };
    }
    case ".svg":
      return validateSvgBuffer(buffer);
    default:
      return { valid: false, reason: "Unsupported file format." };
  }
}

function generateQuoteRefId(): string {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, "0");
  const d = String(now.getUTCDate()).padStart(2, "0");
  const token = crypto.randomUUID().slice(0, 8).toUpperCase();
  return `BS-${y}${m}${d}-${token}`;
}

export async function POST(request: NextRequest) {
  const clientIp = getClientIp(request);
  if (!checkRateLimit(clientIp)) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Too many quote submissions from this connection. Please wait a few minutes or call +1 (912) 304-4034.",
      },
      { status: 429 }
    );
  }

  // Upfront Content-Length guard before buffering multipart payload
  const contentLengthHeader = request.headers.get("content-length");
  if (contentLengthHeader) {
    const contentLength = Number(contentLengthHeader);
    if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
      return NextResponse.json(
        {
          ok: false,
          error: "Request size exceeds maximum allowed upload limit.",
        },
        { status: 413 }
      );
    }
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid multipart form request." },
      { status: 400 }
    );
  }

  let rawPayload: Record<string, unknown>;
  const jsonField = formData.get("payload");

  if (typeof jsonField === "string") {
    if (jsonField.length > MAX_JSON_PAYLOAD_CHARS) {
      return NextResponse.json(
        { ok: false, error: "Quote specification payload exceeds size limit." },
        { status: 413 }
      );
    }

    try {
      const parsedJson = JSON.parse(jsonField) as unknown;
      if (
        !parsedJson ||
        typeof parsedJson !== "object" ||
        Array.isArray(parsedJson)
      ) {
        return NextResponse.json(
          { ok: false, error: "Malformed quote specification payload." },
          { status: 400 }
        );
      }
      rawPayload = parsedJson as Record<string, unknown>;
    } catch {
      return NextResponse.json(
        { ok: false, error: "Invalid JSON payload." },
        { status: 400 }
      );
    }
  } else {
    rawPayload = {
      signType: formData.get("signType"),
      environment: formData.get("environment"),
      mounting: formData.get("mounting"),
      tradeBlindShipping: formData.get("tradeBlindShipping") === "true",
      signText: formData.get("signText"),
      letterHeight: formData.get("letterHeight"),
      totalWidthInches: formData.get("totalWidthInches") ?? "",
      ledFinish: formData.get("ledFinish"),
      free3dMockup: formData.get("free3dMockup") !== "false",
      fullName: formData.get("fullName"),
      companyName: formData.get("companyName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      zipCode: formData.get("zipCode"),
      targetTimeline: formData.get("targetTimeline"),
      notes: formData.get("notes") ?? "",
      consent: formData.get("consent") === "true",
      websiteUrl: formData.get("websiteUrl") ?? "",
    };
  }

  // Silent honeypot anti-spam trap
  if (
    typeof rawPayload.websiteUrl === "string" &&
    rawPayload.websiteUrl.trim().length > 0
  ) {
    return NextResponse.json(
      {
        ok: true,
        quoteRefId: "BS-RECEIVED",
        receivedAt: new Date().toISOString(),
      },
      { status: 200 }
    );
  }

  const parsedPayload = quotePayloadSchema.safeParse(rawPayload);
  if (!parsedPayload.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Please correct the highlighted quote fields and try again.",
        fieldErrors: z.flattenError(parsedPayload.error).fieldErrors,
      },
      { status: 400 }
    );
  }

  // Validate uploaded artwork / facade files
  const candidateEntries = formData
    .getAll("files")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  if (candidateEntries.length > MAX_UPLOAD_FILES) {
    return NextResponse.json(
      {
        ok: false,
        error: `Maximum ${MAX_UPLOAD_FILES} files allowed per quote request.`,
      },
      { status: 400 }
    );
  }

  const validatedFiles: Array<{
    storedFilename: string;
    originalExtension: string;
    sizeBytes: number;
    buffer: Buffer;
  }> = [];

  let cumulativeUploadBytes = 0;

  for (const file of candidateEntries) {
    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        {
          ok: false,
          error: "One or more files exceed the 15 MB per-file size limit.",
        },
        { status: 400 }
      );
    }

    cumulativeUploadBytes += file.size;
    if (cumulativeUploadBytes > MAX_TOTAL_UPLOAD_BYTES) {
      return NextResponse.json(
        {
          ok: false,
          error: "Combined upload size exceeds maximum allowed limit.",
        },
        { status: 413 }
      );
    }

    const safeExt = path.extname(file.name).toLowerCase();
    if (
      !ALLOWED_UPLOAD_EXTENSIONS.includes(
        safeExt as (typeof ALLOWED_UPLOAD_EXTENSIONS)[number]
      )
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: `Unsupported file extension. Allowed formats: ${ALLOWED_UPLOAD_EXTENSIONS.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const allowedMimes =
      ALLOWED_MIME_BY_EXT[safeExt as (typeof ALLOWED_UPLOAD_EXTENSIONS)[number]];
    const normalizedMime = (file.type || "").toLowerCase().trim();
    if (!allowedMimes.includes(normalizedMime)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Uploaded file MIME type does not match its file extension.",
        },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const signatureCheck = validateMagicBytesAndContent(safeExt, buffer);
    if (!signatureCheck.valid) {
      return NextResponse.json(
        {
          ok: false,
          error:
            signatureCheck.reason || "Uploaded file failed security verification.",
        },
        { status: 400 }
      );
    }

    validatedFiles.push({
      storedFilename: `${crypto.randomUUID()}${safeExt}`,
      originalExtension: safeExt,
      sizeBytes: buffer.length,
      buffer,
    });
  }

  const quoteRefId = generateQuoteRefId();
  const receivedAt = new Date().toISOString();

  // Persist sanitized record & attachments safely outside public/ with restricted permissions
  const quoteDir = path.join(process.cwd(), "data", "quotes", quoteRefId);

  try {
    await fs.mkdir(quoteDir, { recursive: true, mode: 0o700 });

    const savedAttachments: Array<{
      storedFilename: string;
      extension: string;
      sizeBytes: number;
    }> = [];

    for (const item of validatedFiles) {
      const targetPath = path.join(quoteDir, item.storedFilename);
      await fs.writeFile(targetPath, item.buffer, { mode: 0o600 });
      savedAttachments.push({
        storedFilename: item.storedFilename,
        extension: item.originalExtension,
        sizeBytes: item.sizeBytes,
      });
    }

    const record = {
      quoteRefId,
      receivedAt,
      payload: {
        ...parsedPayload.data,
        websiteUrl: undefined,
      },
      attachments: savedAttachments,
    };

    await fs.writeFile(
      path.join(quoteDir, "quote.json"),
      JSON.stringify(record, null, 2),
      { encoding: "utf8", mode: 0o600 }
    );
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Unable to save quote submission right now. Please retry or email support@basissign.com.",
      },
      { status: 500 }
    );
  }

  // Optional Webhook Notification (strictly validated URL, no redirects, non-blocking)
  const rawWebhook = process.env.QUOTE_WEBHOOK_URL?.trim();
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
            event: "basissign.quote.created",
            quoteRefId,
            receivedAt,
            signType: parsedPayload.data.signType,
            companyName: parsedPayload.data.companyName,
            fullName: parsedPayload.data.fullName,
            email: parsedPayload.data.email,
            tradeBlindShipping: parsedPayload.data.tradeBlindShipping,
            attachmentCount: validatedFiles.length,
          }),
        });
      } catch {
        // Do not fail user quote confirmation on optional webhook timeout
      }
    }
  }

  return NextResponse.json(
    {
      ok: true,
      quoteRefId,
      receivedAt,
      message: "Quote request received by BASISSIGN UL 48 engineering team.",
    },
    { status: 201 }
  );
}
