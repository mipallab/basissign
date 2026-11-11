"use client";

import { useRef, useState, type FormEvent } from "react";
import { BRAND_FACTS } from "@/data/catalog";
import {
  CONTACT_TOPIC_OPTIONS,
  contactPayloadSchema,
  type ContactPayload,
} from "@/lib/contact-schema";
import {
  AlertCircleIcon,
  CheckIcon,
  ChevronDownIcon,
  PhoneIcon,
  ShieldCheckIcon,
} from "./Icons";
import { PillButton } from "./PillButton";

interface ContactFormState {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  inquiryTopic: ContactPayload["inquiryTopic"];
  message: string;
  consent: boolean;
  websiteUrl: string;
}

type FieldErrorMap = Partial<Record<keyof ContactFormState | "form", string>>;

interface SubmissionSuccess {
  contactRefId: string;
  receivedAt: string;
  inquiryTopic: string;
  email: string;
}

const INITIAL_FORM_STATE: ContactFormState = {
  fullName: "",
  companyName: "",
  email: "",
  phone: "",
  inquiryTopic: CONTACT_TOPIC_OPTIONS[0],
  message: "",
  consent: false,
  websiteUrl: "",
};

export function ContactForm() {
  const [form, setForm] = useState<ContactFormState>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<FieldErrorMap>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<SubmissionSuccess | null>(null);

  const formTopRef = useRef<HTMLDivElement>(null);

  const updateField = <K extends keyof ContactFormState>(
    key: K,
    value: ContactFormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      delete next.form;
      return next;
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const parsed = contactPayloadSchema.safeParse(form);
    if (!parsed.success) {
      const nextErrors: FieldErrorMap = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof ContactFormState | undefined;
        if (key && !nextErrors[key]) {
          nextErrors[key] = issue.message;
        }
      }
      nextErrors.form =
        "Please review the highlighted fields before sending your inquiry.";
      setErrors(nextErrors);
      formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
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
        const apiErrors: FieldErrorMap = {
          form:
            data.error ||
            "Unable to send your message right now. Please try again or email support@basissign.com.",
        };

        if (data.fieldErrors) {
          for (const [key, messages] of Object.entries(data.fieldErrors)) {
            if (messages && messages[0]) {
              apiErrors[key as keyof ContactFormState] = messages[0];
            }
          }
        }

        setErrors(apiErrors);
        setIsSubmitting(false);
        return;
      }

      setConfirmed({
        contactRefId: data.contactRefId || "BSC-SUBMITTED",
        receivedAt: data.receivedAt || new Date().toISOString(),
        inquiryTopic: parsed.data.inquiryTopic,
        email: parsed.data.email,
      });
      setIsSubmitting(false);
    } catch {
      setErrors({
        form: "Network error while sending message. Check your connection or call +1 (912) 304-4034.",
      });
      setIsSubmitting(false);
    }
  };

  if (confirmed) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-[var(--radius-xs)] border border-[var(--border-strong)] bg-[var(--bg-elevated)] p-6 shadow-xl sm:p-8"
      >
        <div
          className="inline-flex h-12 w-12 items-center justify-center rounded-full"
          style={{
            backgroundColor: "var(--status-success-bg)",
            color: "var(--status-success-fg)",
          }}
        >
          <CheckIcon className="h-6 w-6" />
        </div>

        <p className="ui-eyebrow mt-5 text-[var(--accent-text)]">
          Inquiry Logged Successfully
        </p>
        <h2 className="display-h3 mt-2 text-[var(--text-primary)]">
          Message Sent to BASISSIGN Engineering Desk
        </h2>
        <p className="mt-3 text-[length:var(--text-2xl)] leading-relaxed text-[var(--text-secondary)]">
          Thank you. We routed your{" "}
          <strong className="text-[var(--text-primary)]">
            {confirmed.inquiryTopic}
          </strong>{" "}
          inquiry and sent a receipt note to{" "}
          <strong className="text-[var(--text-primary)]">{confirmed.email}</strong>.
          Expect a response within 1 business day.
        </p>

        <dl className="mt-6 grid grid-cols-1 gap-3 rounded-[22px] border border-[var(--border-subtle)] bg-[var(--bg-page)] p-5 sm:grid-cols-2">
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
              Direct Priority Line
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

        <div className="mt-7 flex flex-wrap items-center gap-4">
          <PillButton href="/quote" variant="cta">
            Launch 5-Step Quote Tool
          </PillButton>
          <button
            type="button"
            onClick={() => {
              setConfirmed(null);
              setForm(INITIAL_FORM_STATE);
            }}
            className="inline-flex min-h-[44px] cursor-pointer items-center rounded-[var(--radius-lg)] border border-[var(--border-strong)] bg-[var(--bg-page)] px-5 py-2 text-[length:var(--text-xl)] font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--accent-cta)] active:scale-[0.98]"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={formTopRef}>
      <form
        onSubmit={handleSubmit}
        noValidate
        className="rounded-[var(--radius-xs)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-6 shadow-sm sm:p-8"
      >
        <div className="border-b border-[var(--border-subtle)] pb-5">
          <p className="ui-eyebrow text-[var(--accent-text)]">
            Direct Engineering &amp; Wholesale Desk
          </p>
          <h2 className="display-h3 mt-2 text-[var(--text-primary)]">
            Send Us a Message
          </h2>
          <p className="mt-2 text-[length:var(--text-xl)] text-[var(--text-secondary)]">
            Questions about trade accounts, municipal UL 48 (#{BRAND_FACTS.ulFileNumber})
            permits, crating, or sample kits? Our US team replies within 1 business day.
          </p>
        </div>

        {errors.form && (
          <div
            role="alert"
            className="mt-5 flex items-start gap-3 rounded-[20px] border p-4 text-[length:var(--text-xl)]"
            style={{
              backgroundColor: "var(--status-error-bg)",
              borderColor: "var(--status-error-border)",
              color: "var(--status-error-fg)",
            }}
          >
            <AlertCircleIcon className="mt-0.5 h-5 w-5 shrink-0" />
            <span>{errors.form}</span>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Full Name */}
          <div>
            <label
              htmlFor="contact-full-name"
              className="mb-1.5 block text-[length:var(--text-xl)] font-semibold text-[var(--text-primary)]"
            >
              Full Name <span className="text-[var(--accent-text)]">*</span>
            </label>
            <input
              id="contact-full-name"
              type="text"
              autoComplete="name"
              maxLength={100}
              value={form.fullName}
              disabled={isSubmitting}
              aria-busy={isSubmitting || undefined}
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={errors.fullName ? "err-contact-fullName" : undefined}
              onChange={(e) => updateField("fullName", e.target.value)}
              placeholder="e.g. Jordan Ellis"
              className="ui-input"
            />
            {errors.fullName && (
              <p
                id="err-contact-fullName"
                role="alert"
                className="mt-1.5 text-[length:var(--text-lg)] font-medium text-[var(--status-error-fg)]"
              >
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Company / Sign Shop Name */}
          <div>
            <label
              htmlFor="contact-company"
              className="mb-1.5 block text-[length:var(--text-xl)] font-semibold text-[var(--text-primary)]"
            >
              Company or Sign Shop <span className="text-[var(--accent-text)]">*</span>
            </label>
            <input
              id="contact-company"
              type="text"
              autoComplete="organization"
              maxLength={120}
              value={form.companyName}
              disabled={isSubmitting}
              aria-busy={isSubmitting || undefined}
              aria-invalid={Boolean(errors.companyName)}
              aria-describedby={
                errors.companyName ? "err-contact-companyName" : undefined
              }
              onChange={(e) => updateField("companyName", e.target.value)}
              placeholder="e.g. Apex Sign Contractors"
              className="ui-input"
            />
            {errors.companyName && (
              <p
                id="err-contact-companyName"
                role="alert"
                className="mt-1.5 text-[length:var(--text-lg)] font-medium text-[var(--status-error-fg)]"
              >
                {errors.companyName}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="contact-email"
              className="mb-1.5 block text-[length:var(--text-xl)] font-semibold text-[var(--text-primary)]"
            >
              Work Email <span className="text-[var(--accent-text)]">*</span>
            </label>
            <input
              id="contact-email"
              type="email"
              autoComplete="email"
              maxLength={160}
              value={form.email}
              disabled={isSubmitting}
              aria-busy={isSubmitting || undefined}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "err-contact-email" : undefined}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="you@company.com"
              className="ui-input"
            />
            {errors.email && (
              <p
                id="err-contact-email"
                role="alert"
                className="mt-1.5 text-[length:var(--text-lg)] font-medium text-[var(--status-error-fg)]"
              >
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="contact-phone"
              className="mb-1.5 block text-[length:var(--text-xl)] font-semibold text-[var(--text-primary)]"
            >
              Phone Number <span className="text-[var(--accent-text)]">*</span>
            </label>
            <input
              id="contact-phone"
              type="tel"
              autoComplete="tel"
              maxLength={30}
              value={form.phone}
              disabled={isSubmitting}
              aria-busy={isSubmitting || undefined}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "err-contact-phone" : undefined}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="(912) 555-0148"
              className="ui-input"
            />
            {errors.phone && (
              <p
                id="err-contact-phone"
                role="alert"
                className="mt-1.5 text-[length:var(--text-lg)] font-medium text-[var(--status-error-fg)]"
              >
                {errors.phone}
              </p>
            )}
          </div>

          {/* Inquiry Topic */}
          <div className="sm:col-span-2">
            <label
              htmlFor="contact-topic"
              className="mb-1.5 block text-[length:var(--text-xl)] font-semibold text-[var(--text-primary)]"
            >
              Inquiry Topic <span className="text-[var(--accent-text)]">*</span>
            </label>
            <div className="relative">
              <select
                id="contact-topic"
                value={form.inquiryTopic}
                disabled={isSubmitting}
                aria-busy={isSubmitting || undefined}
                aria-invalid={Boolean(errors.inquiryTopic)}
                aria-describedby={
                  errors.inquiryTopic ? "err-contact-topic" : undefined
                }
                onChange={(e) =>
                  updateField(
                    "inquiryTopic",
                    e.target.value as ContactPayload["inquiryTopic"]
                  )
                }
                className="ui-select"
              >
                {CONTACT_TOPIC_OPTIONS.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
              <ChevronDownIcon
                aria-hidden="true"
                className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-secondary)]"
              />
            </div>
            {errors.inquiryTopic && (
              <p
                id="err-contact-topic"
                role="alert"
                className="mt-1.5 text-[length:var(--text-lg)] font-medium text-[var(--status-error-fg)]"
              >
                {errors.inquiryTopic}
              </p>
            )}
          </div>

          {/* Message */}
          <div className="sm:col-span-2">
            <label
              htmlFor="contact-message"
              className="mb-1.5 block text-[length:var(--text-xl)] font-semibold text-[var(--text-primary)]"
            >
              Message / Project Details{" "}
              <span className="text-[var(--accent-text)]">*</span>
            </label>
            <textarea
              id="contact-message"
              maxLength={3000}
              value={form.message}
              disabled={isSubmitting}
              aria-busy={isSubmitting || undefined}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? "err-contact-message" : undefined}
              onChange={(e) => updateField("message", e.target.value)}
              placeholder="Share your target delivery timeline, sign shop trade account details, UL permit requirements, or order reference..."
              className="ui-textarea"
            />
            {errors.message && (
              <p
                id="err-contact-message"
                role="alert"
                className="mt-1.5 text-[length:var(--text-lg)] font-medium text-[var(--status-error-fg)]"
              >
                {errors.message}
              </p>
            )}
          </div>
        </div>

        {/* Honeypot anti-spam trap */}
        <div className="sr-only" aria-hidden="true">
          <label htmlFor="contact-website-url">Website URL</label>
          <input
            id="contact-website-url"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={form.websiteUrl}
            onChange={(e) => updateField("websiteUrl", e.target.value)}
          />
        </div>

        {/* Consent Checkbox */}
        <div className="mt-5">
          <label
            htmlFor="contact-consent"
            className={`flex cursor-pointer items-start gap-3 rounded-[20px] border p-4 transition-colors ${
              errors.consent
                ? "border-[var(--status-error-border)] bg-[var(--status-error-bg)]"
                : "border-[var(--border-subtle)] bg-[var(--bg-page)] hover:border-[var(--accent-cta)]"
            }`}
          >
            <input
              id="contact-consent"
              type="checkbox"
              checked={form.consent}
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.consent)}
              aria-describedby={errors.consent ? "err-contact-consent" : undefined}
              onChange={(e) => updateField("consent", e.target.checked)}
              className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-[var(--accent-cta)]"
            />
            <span className="text-[length:var(--text-xl)] text-[var(--text-secondary)]">
              I agree to let BASISSIGN engineering &amp; support respond to this
              inquiry via email or phone. Zero spam or third-party data sharing.
            </span>
          </label>
          {errors.consent && (
            <p
              id="err-contact-consent"
              role="alert"
              className="mt-1.5 text-[length:var(--text-lg)] font-medium text-[var(--status-error-fg)]"
            >
              {errors.consent}
            </p>
          )}
        </div>

        {/* Submit & Direct Line Footer */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border-subtle)] pt-6">
          <div className="inline-flex items-center gap-2 text-[length:var(--text-lg)] text-[var(--text-secondary)]">
            <ShieldCheckIcon className="h-4 w-4 text-[var(--accent-text)]" />
            <span>Protected UL 48 Wholesale Desk ·</span>
            <a
              href={BRAND_FACTS.phoneHref}
              className="inline-flex items-center gap-1 font-semibold text-[var(--text-primary)] no-underline hover:text-[var(--accent-text)]"
            >
              <PhoneIcon className="h-3.5 w-3.5 text-[var(--accent-text)]" />
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
            {isSubmitting ? "Sending Message..." : "Send Inquiry"}
          </PillButton>
        </div>
      </form>
    </div>
  );
}
