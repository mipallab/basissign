"use client";

import { useId, useState, type FormEvent } from "react";
import { BRAND_FACTS, PRODUCT_CATALOG } from "@/data/catalog";
import { contactPayloadSchema } from "@/lib/contact-schema";
import type { ProductQuoteTypeId } from "@/lib/quote-schema";
import {
  AlertCircleIcon,
  CheckIcon,
  ChevronDownIcon,
  PhoneIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "./Icons";
import { PillButton } from "./PillButton";

export interface ShortQueryFormProps {
  variant?: "top" | "bottom" | "modal";
  placement: string;
  defaultSignType?: ProductQuoteTypeId | string;
  articleTitle?: string;
  onSuccessSubmitted?: (refId: string) => void;
}

interface ShortFormState {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  signSystem: string;
  message: string;
  consent: boolean;
  websiteUrl: string;
}

type ShortFieldErrorMap = Partial<Record<keyof ShortFormState | "form", string>>;

interface SubmissionSuccess {
  contactRefId: string;
  receivedAt: string;
  signSystemLabel: string;
  email: string;
}

const SIGN_SYSTEM_OPTIONS: ReadonlyArray<{ value: string; label: string }> = [
  ...PRODUCT_CATALOG.map((item) => ({
    value: item.quoteTypeId,
    label: item.name,
  })),
  {
    value: "not-sure",
    label: "Not Sure / Permit Question",
  },
];

function resolveInitialSignSystem(defaultSignType?: string): string {
  if (!defaultSignType) return "front-lit";
  const normalized = defaultSignType.toLowerCase().trim();
  const aliasMap: Record<string, string> = {
    "front-lit": "front-lit",
    "full-lit": "front-lit",
    "front-lit-channel-letters": "front-lit",
    "halo-lit": "halo-lit",
    "back-lit": "halo-lit",
    "halo-lit-channel-letters": "halo-lit",
    "dual-lit": "dual-lit",
    "dual-lit-channel-letters": "dual-lit",
    "blade-sign": "blade-sign",
    "push-thru": "blade-sign",
    "blade-signs-light-boxes": "blade-sign",
    "led-neon": "led-neon",
    "commercial-led-neon": "led-neon",
    "metal-ada": "metal-ada",
    "metal-ada-signs": "metal-ada",
    "not-sure": "not-sure",
  };
  return aliasMap[normalized] ?? "not-sure";
}

export function ShortQueryForm({
  variant = "top",
  placement,
  defaultSignType,
  onSuccessSubmitted,
}: ShortQueryFormProps) {
  const uid = useId();
  const initialSignSystem = resolveInitialSignSystem(defaultSignType);

  const [form, setForm] = useState<ShortFormState>({
    fullName: "",
    companyName: "",
    email: "",
    phone: "",
    signSystem: initialSignSystem,
    message: "",
    consent: false,
    websiteUrl: "",
  });
  const [errors, setErrors] = useState<ShortFieldErrorMap>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<SubmissionSuccess | null>(null);

  const isCompact = variant === "top" || variant === "modal";
  const isModal = variant === "modal";

  const selectedSignOption =
    SIGN_SYSTEM_OPTIONS.find((opt) => opt.value === form.signSystem) ??
    SIGN_SYSTEM_OPTIONS[SIGN_SYSTEM_OPTIONS.length - 1];

  const updateField = <K extends keyof ShortFormState>(
    key: K,
    value: ShortFormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      delete next.form;
      return next;
    });
  };

  const resetForm = () => {
    setConfirmed(null);
    setErrors({});
    setForm({
      fullName: "",
      companyName: "",
      email: "",
      phone: "",
      signSystem: resolveInitialSignSystem(defaultSignType),
      message: "",
      consent: false,
      websiteUrl: "",
    });
  };

  const normalizedPlacement = placement.slice(0, 160);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const signLabel = selectedSignOption.label;

    // Validate user-entered fields directly with dedicated signSystem field
    const validationInput = {
      fullName: form.fullName,
      companyName: form.companyName,
      email: form.email,
      phone: form.phone,
      inquiryTopic: "Quick Sign Quote / Blog Inquiry" as const,
      signSystem: signLabel.slice(0, 80),
      message: form.message,
      consent: form.consent,
      placement: normalizedPlacement,
      websiteUrl: form.websiteUrl,
    };

    const parsed = contactPayloadSchema.safeParse(validationInput);
    if (!parsed.success) {
      const nextErrors: ShortFieldErrorMap = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof ShortFormState | undefined;
        if (key && !nextErrors[key]) {
          nextErrors[key] = issue.message;
        }
      }
      nextErrors.form =
        "Please review the highlighted fields before sending your request.";
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const data = (await response.json()) as {
        ok?: boolean;
        contactRefId?: string;
        receivedAt?: string;
        error?: string;
        fieldErrors?: Record<string, string[] | undefined>;
      };

      if (!response.ok || !data.ok) {
        const apiErrors: ShortFieldErrorMap = {
          form:
            data.error ||
            "Unable to submit right now. Please try again or email support@basissign.com.",
        };

        if (data.fieldErrors) {
          for (const [key, messages] of Object.entries(data.fieldErrors)) {
            if (messages && messages[0]) {
              apiErrors[key as keyof ShortFormState] = messages[0];
            }
          }
        }

        setErrors(apiErrors);
        setIsSubmitting(false);
        return;
      }

      const refId = data.contactRefId || "BSC-SUBMITTED";
      setConfirmed({
        contactRefId: refId,
        receivedAt: data.receivedAt || new Date().toISOString(),
        signSystemLabel: signLabel,
        email: parsed.data.email,
      });
      setIsSubmitting(false);
      onSuccessSubmitted?.(refId);
    } catch {
      setErrors({
        form: "Network error while sending request. Check your connection or call +1 (912) 304-4034.",
      });
      setIsSubmitting(false);
    }
  };

  const fullNameId = `${uid}-fullName`;
  const companyId = `${uid}-companyName`;
  const emailId = `${uid}-email`;
  const phoneId = `${uid}-phone`;
  const signSystemId = `${uid}-signSystem`;
  const messageId = `${uid}-message`;
  const consentId = `${uid}-consent`;
  const honeypotId = `${uid}-websiteUrl`;

  const errFullNameId = `${uid}-err-fullName`;
  const errCompanyId = `${uid}-err-companyName`;
  const errEmailId = `${uid}-err-email`;
  const errPhoneId = `${uid}-err-phone`;
  const errMessageId = `${uid}-err-message`;
  const errConsentId = `${uid}-err-consent`;

  const inputClass = isCompact ? "ui-input ui-input--compact" : "ui-input";
  const selectClass = isCompact ? "ui-select ui-select--compact" : "ui-select";
  const textareaClass = isCompact
    ? "ui-textarea ui-textarea--compact"
    : "ui-textarea";

  const wrapperClass = isModal
    ? ""
    : variant === "top"
      ? "rounded-[var(--radius-xs)] border border-[var(--border-strong)] bg-[var(--bg-elevated)] p-5 shadow-sm sm:p-6"
      : "rounded-[var(--radius-xs)] border border-[var(--border-strong)] bg-[var(--bg-elevated)] p-6 shadow-md sm:p-8";

  if (confirmed) {
    return (
      <div
        role="status"
        aria-live="polite"
        className={
          isModal
            ? "py-2"
            : "rounded-[var(--radius-xs)] border border-[var(--border-strong)] bg-[var(--bg-elevated)] p-6 shadow-sm sm:p-7"
        }
      >
        <div
          className="inline-flex h-11 w-11 items-center justify-center rounded-full"
          style={{
            backgroundColor: "var(--status-success-bg)",
            color: "var(--status-success-fg)",
          }}
        >
          <CheckIcon className="h-5 w-5" />
        </div>

        <p className="ui-eyebrow mt-4 text-[var(--accent-text)]">
          Quick Quote Request Logged
        </p>
        <h3 className="display-h3 mt-1.5 text-[var(--text-primary)]">
          Received by BASISSIGN Engineering Desk
        </h3>
        <p className="mt-2.5 text-[length:var(--text-2xl)] leading-relaxed text-[var(--text-secondary)]">
          We routed your{" "}
          <strong className="text-[var(--text-primary)]">
            {confirmed.signSystemLabel}
          </strong>{" "}
          inquiry and sent confirmation details to{" "}
          <strong className="text-[var(--text-primary)]">
            {confirmed.email}
          </strong>
          . Expect UL 48 pricing and your complimentary 3D Day/Night facade
          mockup within 1 business day.
        </p>

        <dl className="mt-5 grid grid-cols-1 gap-3 rounded-[20px] border border-[var(--border-subtle)] bg-[var(--bg-page)] p-4 sm:grid-cols-2">
          <div>
            <dt className="ui-eyebrow text-[var(--text-muted-theme)]">
              Reference ID
            </dt>
            <dd className="m-0 mt-1 text-[length:var(--text-3xl)] font-semibold text-[var(--text-primary)]">
              {confirmed.contactRefId}
            </dd>
          </div>
          <div>
            <dt className="ui-eyebrow text-[var(--text-muted-theme)]">
              Direct Engineering Line
            </dt>
            <dd className="m-0 mt-1 text-[length:var(--text-3xl)] font-semibold text-[var(--text-primary)]">
              <a
                href={BRAND_FACTS.phoneHref}
                className="text-[var(--text-primary)] no-underline hover:text-[var(--accent-text)]"
              >
                {BRAND_FACTS.phone}
              </a>
            </dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <PillButton href="/quote" variant="cta">
            Launch 5-Step Artwork Configurator
          </PillButton>
          <button
            type="button"
            onClick={resetForm}
            className="inline-flex min-h-[44px] cursor-pointer items-center rounded-[var(--radius-lg)] border border-[var(--border-strong)] bg-[var(--bg-page)] px-5 py-2 text-[length:var(--text-xl)] font-medium text-[var(--text-primary)] transition-colors duration-[var(--dur-fast)] hover:border-[var(--accent-cta)] hover:bg-[var(--bg-subtle)] active:scale-[0.98]"
          >
            Send Another Query
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={wrapperClass}>
      {!isModal && (
        <div className="flex flex-col justify-between gap-3 border-b border-[var(--border-subtle)] pb-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[length:var(--text-md)] font-semibold uppercase tracking-[0.08em] text-[var(--accent-text)]">
                <SparklesIcon className="h-3.5 w-3.5" />
                <span>
                  {variant === "top"
                    ? "Fast Project Quote & Permit Desk"
                    : "Factory-Direct UL 48 Quote & 3D Proof"}
                </span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-page)] px-2.5 py-0.5 text-[length:var(--text-sm)] font-medium text-[var(--text-secondary)]">
                <ShieldCheckIcon className="h-3 w-3 text-[var(--accent-text)]" />
                <span>UL 48 #{BRAND_FACTS.ulFileNumber}</span>
              </span>
            </div>
            <h2 className="display-h3 m-0 mt-1.5 text-[var(--text-primary)]">
              {variant === "top"
                ? "Need Pricing or Permit Specs for Your Sign?"
                : "Get Your Custom Quote & Free 24h 3D Mockup"}
            </h2>
            <p className="m-0 mt-1 text-[length:var(--text-xl)] text-[var(--text-secondary)]">
              Send brief project specs or permit questions—our US engineering team
              replies within 1 business day ({BRAND_FACTS.leadTimeDays}{" "}
              production).
            </p>
          </div>
        </div>
      )}

      {errors.form && (
        <div
          role="alert"
          className={`${isModal ? "" : "mt-4"} mb-4 flex items-start gap-2.5 rounded-[20px] border p-3.5 text-[length:var(--text-xl)]`}
          style={{
            backgroundColor: "var(--status-error-bg)",
            borderColor: "var(--status-error-border)",
            color: "var(--status-error-fg)",
          }}
        >
          <AlertCircleIcon className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{errors.form}</span>
        </div>
      )}

      <div
        className={`${isModal ? "" : "mt-4"} grid grid-cols-1 gap-3.5 sm:grid-cols-2`}
      >
        {/* Full Name */}
        <div>
          <label
            htmlFor={fullNameId}
            className="mb-1 block text-[length:var(--text-lg)] font-semibold text-[var(--text-primary)]"
          >
            Full Name <span className="text-[var(--accent-text)]">*</span>
          </label>
          <input
            id={fullNameId}
            type="text"
            autoComplete="name"
            maxLength={100}
            value={form.fullName}
            disabled={isSubmitting}
            aria-busy={isSubmitting || undefined}
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? errFullNameId : undefined}
            onChange={(e) => updateField("fullName", e.target.value)}
            placeholder="e.g. Jordan Ellis"
            className={inputClass}
          />
          {errors.fullName && (
            <p
              id={errFullNameId}
              role="alert"
              className="mt-1 text-[length:var(--text-md)] font-medium text-[var(--status-error-fg)]"
            >
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Company / Business */}
        <div>
          <label
            htmlFor={companyId}
            className="mb-1 block text-[length:var(--text-lg)] font-semibold text-[var(--text-primary)]"
          >
            Company / Business{" "}
            <span className="text-[var(--accent-text)]">*</span>
          </label>
          <input
            id={companyId}
            type="text"
            autoComplete="organization"
            maxLength={120}
            value={form.companyName}
            disabled={isSubmitting}
            aria-busy={isSubmitting || undefined}
            aria-invalid={Boolean(errors.companyName)}
            aria-describedby={errors.companyName ? errCompanyId : undefined}
            onChange={(e) => updateField("companyName", e.target.value)}
            placeholder="e.g. Apex Retail Group"
            className={inputClass}
          />
          {errors.companyName && (
            <p
              id={errCompanyId}
              role="alert"
              className="mt-1 text-[length:var(--text-md)] font-medium text-[var(--status-error-fg)]"
            >
              {errors.companyName}
            </p>
          )}
        </div>

        {/* Work Email */}
        <div>
          <label
            htmlFor={emailId}
            className="mb-1 block text-[length:var(--text-lg)] font-semibold text-[var(--text-primary)]"
          >
            Work Email <span className="text-[var(--accent-text)]">*</span>
          </label>
          <input
            id={emailId}
            type="email"
            autoComplete="email"
            maxLength={160}
            value={form.email}
            disabled={isSubmitting}
            aria-busy={isSubmitting || undefined}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? errEmailId : undefined}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="you@company.com"
            className={inputClass}
          />
          {errors.email && (
            <p
              id={errEmailId}
              role="alert"
              className="mt-1 text-[length:var(--text-md)] font-medium text-[var(--status-error-fg)]"
            >
              {errors.email}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor={phoneId}
            className="mb-1 block text-[length:var(--text-lg)] font-semibold text-[var(--text-primary)]"
          >
            Phone <span className="text-[var(--accent-text)]">*</span>
          </label>
          <input
            id={phoneId}
            type="tel"
            autoComplete="tel"
            maxLength={30}
            value={form.phone}
            disabled={isSubmitting}
            aria-busy={isSubmitting || undefined}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? errPhoneId : undefined}
            onChange={(e) => updateField("phone", e.target.value)}
            placeholder="(912) 555-0148"
            className={inputClass}
          />
          {errors.phone && (
            <p
              id={errPhoneId}
              role="alert"
              className="mt-1 text-[length:var(--text-md)] font-medium text-[var(--status-error-fg)]"
            >
              {errors.phone}
            </p>
          )}
        </div>

        {/* Sign System */}
        <div className="sm:col-span-2">
          <label
            htmlFor={signSystemId}
            className="mb-1 block text-[length:var(--text-lg)] font-semibold text-[var(--text-primary)]"
          >
            Sign System Interest
          </label>
          <div className="relative">
            <select
              id={signSystemId}
              value={form.signSystem}
              disabled={isSubmitting}
              aria-busy={isSubmitting || undefined}
              onChange={(e) => updateField("signSystem", e.target.value)}
              className={selectClass}
            >
              {SIGN_SYSTEM_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDownIcon
              aria-hidden="true"
              className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-secondary)]"
            />
          </div>
        </div>

        {/* Project / Question Details */}
        <div className="sm:col-span-2">
          <label
            htmlFor={messageId}
            className="mb-1 block text-[length:var(--text-lg)] font-semibold text-[var(--text-primary)]"
          >
            Project / Question Details{" "}
            <span className="text-[var(--accent-text)]">*</span>
          </label>
          <textarea
            id={messageId}
            maxLength={3000}
            value={form.message}
            disabled={isSubmitting}
            aria-busy={isSubmitting || undefined}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? errMessageId : undefined}
            onChange={(e) => updateField("message", e.target.value)}
            placeholder="Share your sign text, rough dimensions (e.g. 18&quot; letters), mounting wall type, or municipal permit question..."
            className={textareaClass}
          />
          {errors.message && (
            <p
              id={errMessageId}
              role="alert"
              className="mt-1 text-[length:var(--text-md)] font-medium text-[var(--status-error-fg)]"
            >
              {errors.message}
            </p>
          )}
        </div>
      </div>

      {/* Honeypot anti-spam trap */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor={honeypotId}>Website URL</label>
        <input
          id={honeypotId}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.websiteUrl}
          onChange={(e) => updateField("websiteUrl", e.target.value)}
        />
      </div>

      {/* Consent Checkbox */}
      <div className="mt-3.5">
        <label
          htmlFor={consentId}
          className={`flex cursor-pointer items-start gap-2.5 rounded-[18px] border p-3 transition-colors duration-[var(--dur-fast)] ${
            errors.consent
              ? "border-[var(--status-error-border)] bg-[var(--status-error-bg)]"
              : "border-[var(--border-subtle)] bg-[var(--bg-page)] hover:border-[var(--accent-cta)]"
          }`}
        >
          <input
            id={consentId}
            type="checkbox"
            checked={form.consent}
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? errConsentId : undefined}
            onChange={(e) => updateField("consent", e.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-[var(--accent-cta)]"
          />
          <span className="text-[length:var(--text-lg)] leading-snug text-[var(--text-secondary)]">
            Allow BASISSIGN engineers to send my quote, permit answers, or 3D
            mockup by email or phone. Zero third-party sharing.
          </span>
        </label>
        {errors.consent && (
          <p
            id={errConsentId}
            role="alert"
            className="mt-1 text-[length:var(--text-md)] font-medium text-[var(--status-error-fg)]"
          >
            {errors.consent}
          </p>
        )}
      </div>

      {/* Submit Row */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-subtle)] pt-4">
        <div className="inline-flex items-center gap-1.5 text-[length:var(--text-lg)] text-[var(--text-secondary)]">
          <PhoneIcon className="h-3.5 w-3.5 text-[var(--accent-text)]" />
          <span>Direct:</span>
          <a
            href={BRAND_FACTS.phoneHref}
            className="font-semibold text-[var(--text-primary)] no-underline hover:text-[var(--accent-text)]"
          >
            {BRAND_FACTS.phone}
          </a>
        </div>

        <PillButton
          type="submit"
          variant="cta"
          loading={isSubmitting}
          error={Boolean(errors.form)}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending Query..." : "Send Quick Query"}
        </PillButton>
      </div>
    </form>
  );
}
