"use client";

import {
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
  type KeyboardEvent,
  type MutableRefObject,
} from "react";
import { BRAND_FACTS } from "@/data/catalog";
import {
  ALLOWED_UPLOAD_EXTENSIONS,
  ENVIRONMENT_OPTIONS,
  LED_KELVIN_OPTIONS,
  LETTER_HEIGHT_OPTIONS,
  MAX_UPLOAD_BYTES,
  MAX_UPLOAD_FILES,
  MOUNTING_OPTIONS,
  SIGN_TYPE_OPTIONS,
  TARGET_TIMELINE_OPTIONS,
  normalizeQuoteTypeParam,
  quotePayloadSchema,
  type QuotePayload,
} from "@/lib/quote-schema";
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  CheckIcon,
  ChevronDownIcon,
  PhoneIcon,
  ProductServiceIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UploadIcon,
} from "./Icons";
import { PillButton } from "./PillButton";

interface QuoteWizardProps {
  initialType?: string | null;
  initialEnv?: string | null;
  initialTrade?: boolean;
}

const STEP_LABELS = [
  { num: 1, title: "Sign Type" },
  { num: 2, title: "Location & Mount" },
  { num: 3, title: "Copy & Lighting" },
  { num: 4, title: "Artwork" },
  { num: 5, title: "Contact & Send" },
] as const;

function getDefaultMounting(
  signType: QuotePayload["signType"]
): QuotePayload["mounting"] {
  if (signType === "halo-lit" || signType === "dual-lit") {
    return "standoffs";
  }
  if (signType === "blade-sign" || signType === "push-thru") return "blade-bracket";
  return "raceway";
}

function getDefaultLedFinish(
  signType: QuotePayload["signType"]
): QuotePayload["ledFinish"] {
  if (signType === "halo-lit") return "3000K Warm Gold Halo";
  return "6500K Crisp Cool White";
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}

function getFileExtension(filename: string): string {
  const dot = filename.lastIndexOf(".");
  if (dot < 0) return "";
  return filename.slice(dot).toLowerCase();
}

interface QuoteFormState {
  signType: QuotePayload["signType"];
  environment: QuotePayload["environment"];
  mounting: QuotePayload["mounting"];
  tradeBlindShipping: boolean;
  signText: string;
  letterHeight: QuotePayload["letterHeight"];
  totalWidthInches: string;
  ledFinish: QuotePayload["ledFinish"];
  free3dMockup: boolean;
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  zipCode: string;
  targetTimeline: QuotePayload["targetTimeline"];
  notes: string;
  consent: boolean;
  websiteUrl: string;
}

type FieldErrorMap = Partial<Record<keyof QuoteFormState | "form", string>>;

interface SubmissionSuccess {
  quoteRefId: string;
  receivedAt: string;
  signTypeLabel: string;
  email: string;
  fileCount: number;
}

export function QuoteWizard({
  initialType,
  initialEnv,
  initialTrade = false,
}: QuoteWizardProps) {
  const normalizedType = normalizeQuoteTypeParam(initialType);
  const normalizedEnv: QuotePayload["environment"] =
    initialEnv?.toLowerCase().trim() === "interior"
      ? "interior"
      : "exterior-ul48";

  const [step, setStep] = useState<number>(1);
  const [maxVisitedStep, setMaxVisitedStep] = useState<number>(1);

  const [form, setForm] = useState<QuoteFormState>(() => ({
    signType: normalizedType,
    environment: normalizedEnv,
    mounting: getDefaultMounting(normalizedType),
    tradeBlindShipping: initialTrade,
    signText: "",
    letterHeight: LETTER_HEIGHT_OPTIONS[1],
    totalWidthInches: "",
    ledFinish: getDefaultLedFinish(normalizedType),
    free3dMockup: true,
    fullName: "",
    companyName: "",
    email: "",
    phone: "",
    zipCode: "",
    targetTimeline: TARGET_TIMELINE_OPTIONS[1],
    notes: "",
    consent: false,
    websiteUrl: "",
  }));

  const [files, setFiles] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<FieldErrorMap>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<SubmissionSuccess | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const wizardTopRef = useRef<HTMLDivElement>(null);
  const signTypeRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const envRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const mountRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const alertId = useId();

  const handleRovingRadioKeyDown = <T extends string>(
    event: KeyboardEvent<HTMLButtonElement>,
    options: readonly { id: T }[],
    currentIndex: number,
    onSelect: (id: T) => void,
    refs: MutableRefObject<(HTMLButtonElement | null)[]>
  ) => {
    const len = options.length;
    if (len === 0) return;

    let nextIndex: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (currentIndex + 1) % len;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (currentIndex - 1 + len) % len;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = len - 1;
    }

    if (nextIndex !== null) {
      event.preventDefault();
      const targetOption = options[nextIndex];
      onSelect(targetOption.id);
      refs.current[nextIndex]?.focus();
    }
  };

  const selectedSignOption =
    SIGN_TYPE_OPTIONS.find((opt) => opt.id === form.signType) ??
    SIGN_TYPE_OPTIONS[0];
  const selectedMountingOption =
    MOUNTING_OPTIONS.find((opt) => opt.id === form.mounting) ??
    MOUNTING_OPTIONS[0];
  const selectedEnvironmentOption =
    ENVIRONMENT_OPTIONS.find((opt) => opt.id === form.environment) ??
    ENVIRONMENT_OPTIONS[0];

  const updateField = <K extends keyof QuoteFormState>(
    field: K,
    value: QuoteFormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field] && !prev.form) return prev;
      const next = { ...prev };
      delete next[field];
      delete next.form;
      return next;
    });
  };

  const handleSignTypeChange = (nextType: QuotePayload["signType"]) => {
    setForm((prev) => ({
      ...prev,
      signType: nextType,
      mounting: getDefaultMounting(nextType),
      ledFinish: getDefaultLedFinish(nextType),
    }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next.signType;
      return next;
    });
  };

  const scrollToTopOfWizard = () => {
    wizardTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const validateStep = (targetStep: number): boolean => {
    const nextErrors: FieldErrorMap = {};

    if (targetStep === 1) {
      const res = quotePayloadSchema.shape.signType.safeParse(form.signType);
      if (!res.success) {
        nextErrors.signType =
          res.error.issues[0]?.message ?? "Select a signage type.";
      }
    } else if (targetStep === 2) {
      const envRes = quotePayloadSchema.shape.environment.safeParse(
        form.environment
      );
      if (!envRes.success) {
        nextErrors.environment =
          envRes.error.issues[0]?.message ?? "Select placement environment.";
      }
      const mountRes = quotePayloadSchema.shape.mounting.safeParse(
        form.mounting
      );
      if (!mountRes.success) {
        nextErrors.mounting =
          mountRes.error.issues[0]?.message ?? "Select mounting configuration.";
      }
    } else if (targetStep === 3) {
      const copyRes = quotePayloadSchema.shape.signText.safeParse(
        form.signText
      );
      if (!copyRes.success) {
        nextErrors.signText =
          copyRes.error.issues[0]?.message ?? "Enter sign copy or brand name.";
      }
      const heightRes = quotePayloadSchema.shape.letterHeight.safeParse(
        form.letterHeight
      );
      if (!heightRes.success) {
        nextErrors.letterHeight =
          heightRes.error.issues[0]?.message ?? "Select estimated height.";
      }
      const widthRes = quotePayloadSchema.shape.totalWidthInches.safeParse(
        form.totalWidthInches
      );
      if (!widthRes.success) {
        nextErrors.totalWidthInches =
          widthRes.error.issues[0]?.message ?? "Keep width description under 40 characters.";
      }
      const ledRes = quotePayloadSchema.shape.ledFinish.safeParse(
        form.ledFinish
      );
      if (!ledRes.success) {
        nextErrors.ledFinish =
          ledRes.error.issues[0]?.message ?? "Select LED color or finish.";
      }
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const goToNextStep = () => {
    if (!validateStep(step)) return;
    const next = Math.min(5, step + 1);
    setStep(next);
    setMaxVisitedStep((prev) => Math.max(prev, next));
    scrollToTopOfWizard();
  };

  const goToPreviousStep = () => {
    const prev = Math.max(1, step - 1);
    setErrors({});
    setStep(prev);
    scrollToTopOfWizard();
  };

  const jumpToStep = (target: number) => {
    if (target <= maxVisitedStep && target !== step) {
      if (target > step && !validateStep(step)) return;
      setErrors({});
      setStep(target);
    }
  };

  const validateAndAddFiles = (incomingList: FileList | File[]) => {
    setUploadError(null);
    const incoming = Array.from(incomingList);
    if (incoming.length === 0) return;

    const current = [...files];

    for (const candidate of incoming) {
      if (current.length >= MAX_UPLOAD_FILES) {
        setUploadError(
          `Maximum ${MAX_UPLOAD_FILES} files allowed per quote request.`
        );
        break;
      }

      const ext = getFileExtension(candidate.name);
      if (
        !ALLOWED_UPLOAD_EXTENSIONS.includes(
          ext as (typeof ALLOWED_UPLOAD_EXTENSIONS)[number]
        )
      ) {
        setUploadError(
          `Unsupported file "${candidate.name}". Allowed: ${ALLOWED_UPLOAD_EXTENSIONS.join(", ")}`
        );
        continue;
      }

      if (candidate.size <= 0) {
        setUploadError(`File "${candidate.name}" appears empty.`);
        continue;
      }

      if (candidate.size > MAX_UPLOAD_BYTES) {
        setUploadError(
          `File "${candidate.name}" exceeds the 15 MB per-file limit.`
        );
        continue;
      }

      const alreadyAdded = current.some(
        (existing) =>
          existing.name === candidate.name && existing.size === candidate.size
      );
      if (!alreadyAdded) {
        current.push(candidate);
      }
    }

    setFiles(current);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      validateAndAddFiles(e.target.files);
      e.target.value = "";
    }
  };

  const handleDropzoneDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (files.length >= MAX_UPLOAD_FILES || isSubmitting) return;
    setIsDragging(true);
  };

  const handleDropzoneDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDropzoneDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (isSubmitting) return;
    if (files.length >= MAX_UPLOAD_FILES) {
      setUploadError(
        `Maximum ${MAX_UPLOAD_FILES} files already attached. Remove one to add another.`
      );
      return;
    }
    if (e.dataTransfer.files) {
      validateAndAddFiles(e.dataTransfer.files);
    }
  };

  const removeFileAt = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    setUploadError(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const parsed = quotePayloadSchema.safeParse(form);
    if (!parsed.success) {
      const nextErrors: FieldErrorMap = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof QuoteFormState | undefined;
        if (key && !nextErrors[key]) {
          nextErrors[key] = issue.message;
        }
      }
      nextErrors.form =
        "Please review the highlighted fields before submitting your quote request.";
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("payload", JSON.stringify(parsed.data));
      for (const file of files) {
        formData.append("files", file, file.name);
      }

      const response = await fetch("/api/quote", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as {
        ok?: boolean;
        quoteRefId?: string;
        receivedAt?: string;
        error?: string;
        fieldErrors?: Record<string, string[] | undefined>;
      };

      if (!response.ok || !data.ok) {
        const apiErrors: FieldErrorMap = {
          form:
            data.error ||
            "Unable to submit your quote request. Please check your details and try again.",
        };

        if (data.fieldErrors) {
          for (const [key, messages] of Object.entries(data.fieldErrors)) {
            if (messages && messages[0]) {
              apiErrors[key as keyof QuoteFormState] = messages[0];
            }
          }
        }

        setErrors(apiErrors);
        return;
      }

      setConfirmed({
        quoteRefId: data.quoteRefId || "BS-PENDING",
        receivedAt: data.receivedAt || new Date().toISOString(),
        signTypeLabel: selectedSignOption.label,
        email: parsed.data.email,
        fileCount: files.length,
      });
      scrollToTopOfWizard();
    } catch {
      setErrors({
        form: `Network error submitting your quote. Please retry or call ${BRAND_FACTS.phone}.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetWizard = () => {
    setConfirmed(null);
    setStep(1);
    setMaxVisitedStep(1);
    setFiles([]);
    setErrors({});
    setUploadError(null);
    setForm((prev) => ({
      ...prev,
      signText: "",
      totalWidthInches: "",
      notes: "",
      consent: false,
      websiteUrl: "",
    }));
  };

  if (confirmed) {
    return (
      <div
        ref={wizardTopRef}
        className="rounded-[var(--radius-xs)] border border-[var(--border-strong)] bg-[var(--bg-elevated)] p-6 sm:p-10"
      >
        <div
          className="inline-flex items-center gap-2 rounded-[var(--radius-lg)] px-4 py-1.5 text-[length:var(--text-md)] font-semibold uppercase tracking-[0.08em]"
          style={{
            backgroundColor: "var(--status-success-bg)",
            color: "var(--status-success-fg)",
          }}
        >
          <CheckIcon className="h-4 w-4" />
          <span>Quote Request Received</span>
        </div>

        <h2 className="display-h2 mt-5 text-[var(--text-primary)]">
          Engineering Ticket #{confirmed.quoteRefId}
        </h2>

        <p className="mt-3 max-w-2xl text-[length:var(--text-2xl)] leading-relaxed text-[var(--text-secondary)]">
          Thank you, <strong>{form.fullName}</strong>. Your specification for{" "}
          <strong>{confirmed.signTypeLabel}</strong> (&ldquo;{form.signText}&rdquo;)
          has been routed to our UL 48 engineering team. We will send your
          factory-direct quote{form.free3dMockup ? " and scaled 3D Day/Night facade mockup" : ""}{" "}
          to <strong>{confirmed.email}</strong> within 1 business day.
        </p>

        <dl className="mt-8 grid grid-cols-1 gap-4 rounded-[24px] border border-[var(--border-subtle)] bg-[var(--bg-page)] p-5 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="ui-eyebrow text-[var(--text-muted-theme)]">
              Reference ID
            </dt>
            <dd className="m-0 mt-1 text-[length:var(--text-2xl)] font-semibold text-[var(--text-primary)]">
              {confirmed.quoteRefId}
            </dd>
          </div>
          <div>
            <dt className="ui-eyebrow text-[var(--text-muted-theme)]">
              System &amp; Mounting
            </dt>
            <dd className="m-0 mt-1 text-[length:var(--text-2xl)] font-medium text-[var(--text-primary)]">
              {selectedSignOption.shortLabel} · {selectedMountingOption.label}
            </dd>
          </div>
          <div>
            <dt className="ui-eyebrow text-[var(--text-muted-theme)]">
              Shipping Mode
            </dt>
            <dd className="m-0 mt-1 text-[length:var(--text-2xl)] font-medium text-[var(--text-primary)]">
              {form.tradeBlindShipping
                ? "Blind White-Label Trade Crate"
                : "Standard BASISSIGN Crate"}
            </dd>
          </div>
          <div>
            <dt className="ui-eyebrow text-[var(--text-muted-theme)]">
              Artwork Attached
            </dt>
            <dd className="m-0 mt-1 text-[length:var(--text-2xl)] font-medium text-[var(--text-primary)]">
              {confirmed.fileCount}{" "}
              {confirmed.fileCount === 1 ? "file" : "files"}
            </dd>
          </div>
        </dl>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border-subtle)] pt-6">
          <div className="flex flex-wrap items-center gap-5 text-[length:var(--text-xl)] text-[var(--text-secondary)]">
            <a
              href={BRAND_FACTS.phoneHref}
              className="inline-flex items-center gap-2 font-medium text-[var(--text-primary)] no-underline hover:text-[var(--accent-text)]"
            >
              <PhoneIcon className="h-4 w-4 text-[var(--accent-text)]" />
              <span>Need rush help? {BRAND_FACTS.phone}</span>
            </a>
            <span>Email: {BRAND_FACTS.email}</span>
          </div>

          <PillButton type="button" onClick={resetWizard} variant="primary">
            Start Another Quote
          </PillButton>
        </div>
      </div>
    );
  }

  return (
    <div ref={wizardTopRef} className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      {/* Main 5-Step Configurator Column */}
      <div className="lg:col-span-8">
        {/* Interactive Step Indicator Bar */}
        <nav
          aria-label="Quote Configurator Progress"
          className="mb-6 rounded-[var(--radius-xs)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-3 sm:p-4"
        >
          <ol className="m-0 grid list-none grid-cols-2 gap-2 p-0 sm:grid-cols-5">
            {STEP_LABELS.map((item) => {
              const isCurrent = step === item.num;
              const isCompleted = item.num < step;
              const isReachable = item.num <= maxVisitedStep;

              return (
                <li key={item.num}>
                  <button
                    type="button"
                    disabled={!isReachable}
                    aria-current={isCurrent ? "step" : undefined}
                    onClick={() => jumpToStep(item.num)}
                    className={`flex min-h-[46px] w-full items-center gap-2 rounded-[20px] border px-3 py-2 text-left transition-all duration-[var(--dur-fast)] ${
                      isCurrent
                        ? "border-[var(--accent-cta)] bg-[var(--accent-cta)] text-[var(--surface-white)]"
                        : isCompleted
                          ? "cursor-pointer border-[var(--border-strong)] bg-[var(--bg-subtle)] text-[var(--text-primary)] hover:border-[var(--accent-cta)]"
                          : isReachable
                            ? "cursor-pointer border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] hover:border-[var(--border-strong)]"
                            : "cursor-not-allowed border-transparent bg-transparent text-[var(--text-muted-theme)] opacity-60"
                    }`}
                  >
                    <span
                      className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[length:var(--text-md)] font-semibold ${
                        isCurrent
                          ? "bg-[var(--surface-white)] text-[var(--ink)]"
                          : isCompleted
                            ? "bg-[var(--ink)] text-[var(--surface-white)]"
                            : "border border-current"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckIcon className="h-3.5 w-3.5" />
                      ) : (
                        item.num
                      )}
                    </span>
                    <span className="truncate text-[length:var(--text-lg)] font-medium">
                      {item.title}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Form Container */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-[var(--radius-xs)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-5 sm:p-8"
        >
          {/* Top Form Validation Banner */}
          {errors.form && (
            <div
              id={alertId}
              role="alert"
              className="mb-6 flex items-start gap-3 rounded-[20px] border p-4 text-[length:var(--text-xl)]"
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

          {/* STEP 1: SIGN TYPE */}
          {step === 1 && (
            <fieldset className="m-0 border-0 p-0">
              <legend className="mb-2 block text-[length:var(--text-md)] font-semibold uppercase tracking-[0.1em] text-[var(--accent-text)]">
                Step 1 of 5 · Sign Architecture
              </legend>
              <h2
                id="step1-sign-type-heading"
                className="display-h3 m-0 text-[var(--text-primary)]"
              >
                Select Your Custom Signage System
              </h2>
              <p className="mt-2 text-[length:var(--text-2xl)] text-[var(--text-secondary)]">
                All illuminated channel letters and cabinets carry serialized UL
                48 (#{BRAND_FACTS.ulFileNumber}) labels and Mean Well® Class 2
                drivers. Use arrow keys or click to select.
              </p>

              <div
                role="radiogroup"
                aria-labelledby="step1-sign-type-heading"
                aria-required="true"
                aria-invalid={Boolean(errors.signType)}
                aria-describedby={errors.signType ? "err-signType" : undefined}
                className="mt-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2"
              >
                {SIGN_TYPE_OPTIONS.map((option, idx) => {
                  const selected = form.signType === option.id;
                  return (
                    <button
                      key={option.id}
                      ref={(el) => {
                        signTypeRefs.current[idx] = el;
                      }}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      disabled={isSubmitting}
                      aria-busy={isSubmitting || undefined}
                      data-loading={isSubmitting ? "true" : undefined}
                      data-error={errors.signType ? "true" : undefined}
                      tabIndex={selected ? 0 : -1}
                      onClick={() => handleSignTypeChange(option.id)}
                      onKeyDown={(e) =>
                        handleRovingRadioKeyDown(
                          e,
                          SIGN_TYPE_OPTIONS,
                          idx,
                          handleSignTypeChange,
                          signTypeRefs
                        )
                      }
                      className={`group relative flex cursor-pointer flex-col justify-between rounded-[24px] border p-4 text-left transition-all duration-[var(--dur-fast)] focus-visible:outline-[3px] focus-visible:outline-[var(--accent-glow)] focus-visible:outline-offset-[4px] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 data-[loading=true]:cursor-wait data-[loading=true]:opacity-75 sm:p-5 ${
                        errors.signType
                          ? "border-[var(--status-error-border)] bg-[var(--status-error-bg)]"
                          : selected
                            ? "border-[var(--accent-cta)] bg-[var(--bg-subtle)] accent-glow-ring"
                            : "border-[var(--border-subtle)] bg-[var(--bg-page)] hover:border-[var(--accent-cta)] hover:bg-[var(--bg-card-hover)]"
                      }`}
                    >
                      <div className="w-full">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5">
                            <span
                              className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[12px] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--accent-text)]"
                              aria-hidden="true"
                            >
                              <ProductServiceIcon iconKey={option.iconKey} className="h-4 w-4" />
                            </span>
                            <span className="text-[length:var(--text-3xl)] font-semibold text-[var(--text-primary)]">
                              {option.label}
                            </span>
                          </div>
                          <span
                            className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors ${
                              selected
                                ? "border-[var(--accent-cta)] bg-[var(--accent-cta)] text-[var(--surface-white)]"
                                : "border-[var(--border-strong)] bg-[var(--bg-elevated)]"
                            }`}
                          >
                            {selected && <CheckIcon className="h-3.5 w-3.5" />}
                          </span>
                        </div>

                        <p className="mt-2 text-[length:var(--text-xl)] leading-snug text-[var(--text-secondary)]">
                          {option.description}
                        </p>
                      </div>

                      <div className="mt-4">
                        <span className="inline-flex rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-1 text-[length:var(--text-md)] font-medium text-[var(--text-primary)]">
                          {option.badge}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {errors.signType && (
                <p
                  id="err-signType"
                  role="alert"
                  className="mt-3 text-[length:var(--text-xl)] font-medium text-[var(--status-error-fg)]"
                >
                  {errors.signType}
                </p>
              )}
            </fieldset>
          )}

          {/* STEP 2: LOCATION, MOUNTING & TRADE BLIND SHIPPING */}
          {step === 2 && (
            <div className="flex flex-col gap-7">
              <div>
                <p className="ui-eyebrow text-[var(--accent-text)]">
                  Step 2 of 5 · Code &amp; Mounting Spec
                </p>
                <h2 className="display-h3 mt-2 text-[var(--text-primary)]">
                  Location Rating &amp; Facade Mounting
                </h2>
              </div>

              {/* Exterior vs Interior */}
              <fieldset className="m-0 border-0 p-0">
                <legend
                  id="step2-environment-legend"
                  className="mb-3 text-[length:var(--text-2xl)] font-semibold text-[var(--text-primary)]"
                >
                  Installation Environment
                </legend>
                <div
                  role="radiogroup"
                  aria-labelledby="step2-environment-legend"
                  aria-required="true"
                  aria-invalid={Boolean(errors.environment)}
                  aria-describedby={
                    errors.environment ? "err-environment" : undefined
                  }
                  className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                >
                  {ENVIRONMENT_OPTIONS.map((env, idx) => {
                    const selected = form.environment === env.id;
                    return (
                      <button
                        key={env.id}
                        ref={(el) => {
                          envRefs.current[idx] = el;
                        }}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        disabled={isSubmitting}
                        aria-busy={isSubmitting || undefined}
                        data-loading={isSubmitting ? "true" : undefined}
                        data-error={errors.environment ? "true" : undefined}
                        tabIndex={selected ? 0 : -1}
                        onClick={() => updateField("environment", env.id)}
                        onKeyDown={(e) =>
                          handleRovingRadioKeyDown(
                            e,
                            ENVIRONMENT_OPTIONS,
                            idx,
                            (nextEnv) => updateField("environment", nextEnv),
                            envRefs
                          )
                        }
                        className={`relative cursor-pointer rounded-[22px] border p-4 text-left transition-colors focus-visible:outline-[3px] focus-visible:outline-[var(--accent-glow)] focus-visible:outline-offset-[4px] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 data-[loading=true]:cursor-wait data-[loading=true]:opacity-75 ${
                          errors.environment
                            ? "border-[var(--status-error-border)] bg-[var(--status-error-bg)]"
                            : selected
                              ? "border-[var(--accent-cta)] bg-[var(--bg-subtle)]"
                              : "border-[var(--border-subtle)] bg-[var(--bg-page)] hover:border-[var(--accent-cta)] hover:bg-[var(--bg-card-hover)]"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-[length:var(--text-2xl)] text-[var(--text-primary)]">
                            {env.label}
                          </span>
                          <span
                            className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                              selected
                                ? "border-[var(--accent-cta)] bg-[var(--accent-cta)] text-[var(--surface-white)]"
                                : "border-[var(--border-strong)]"
                            }`}
                          >
                            {selected && <CheckIcon className="h-3 w-3" />}
                          </span>
                        </div>
                        <p className="mt-1.5 text-[length:var(--text-lg)] text-[var(--text-secondary)]">
                          {env.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
                {errors.environment && (
                  <p
                    id="err-environment"
                    role="alert"
                    className="mt-2 text-[length:var(--text-lg)] font-medium text-[var(--status-error-fg)]"
                  >
                    {errors.environment}
                  </p>
                )}
              </fieldset>

              {/* Mounting Hardware */}
              <fieldset className="m-0 border-0 p-0">
                <legend
                  id="step2-mounting-legend"
                  className="mb-3 text-[length:var(--text-2xl)] font-semibold text-[var(--text-primary)]"
                >
                  Mounting Configuration
                </legend>
                <div
                  role="radiogroup"
                  aria-labelledby="step2-mounting-legend"
                  aria-required="true"
                  aria-invalid={Boolean(errors.mounting)}
                  aria-describedby={errors.mounting ? "err-mounting" : undefined}
                  className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                >
                  {MOUNTING_OPTIONS.map((mount, idx) => {
                    const selected = form.mounting === mount.id;
                    return (
                      <button
                        key={mount.id}
                        ref={(el) => {
                          mountRefs.current[idx] = el;
                        }}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        disabled={isSubmitting}
                        aria-busy={isSubmitting || undefined}
                        data-loading={isSubmitting ? "true" : undefined}
                        data-error={errors.mounting ? "true" : undefined}
                        tabIndex={selected ? 0 : -1}
                        onClick={() => updateField("mounting", mount.id)}
                        onKeyDown={(e) =>
                          handleRovingRadioKeyDown(
                            e,
                            MOUNTING_OPTIONS,
                            idx,
                            (nextMount) => updateField("mounting", nextMount),
                            mountRefs
                          )
                        }
                        className={`relative cursor-pointer rounded-[22px] border p-4 text-left transition-colors focus-visible:outline-[3px] focus-visible:outline-[var(--accent-glow)] focus-visible:outline-offset-[4px] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 data-[loading=true]:cursor-wait data-[loading=true]:opacity-75 ${
                          errors.mounting
                            ? "border-[var(--status-error-border)] bg-[var(--status-error-bg)]"
                            : selected
                              ? "border-[var(--accent-cta)] bg-[var(--bg-subtle)]"
                              : "border-[var(--border-subtle)] bg-[var(--bg-page)] hover:border-[var(--accent-cta)] hover:bg-[var(--bg-card-hover)]"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-[length:var(--text-2xl)] text-[var(--text-primary)]">
                            {mount.label}
                          </span>
                          <span
                            className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                              selected
                                ? "border-[var(--accent-cta)] bg-[var(--accent-cta)] text-[var(--surface-white)]"
                                : "border-[var(--border-strong)]"
                            }`}
                          >
                            {selected && <CheckIcon className="h-3 w-3" />}
                          </span>
                        </div>
                        <p className="mt-1.5 text-[length:var(--text-lg)] text-[var(--text-secondary)]">
                          {mount.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
                {errors.mounting && (
                  <p
                    id="err-mounting"
                    role="alert"
                    className="mt-2 text-[length:var(--text-lg)] font-medium text-[var(--status-error-fg)]"
                  >
                    {errors.mounting}
                  </p>
                )}
              </fieldset>

              {/* Trade Blind White-Label Shipping Switch */}
              <div className="flex flex-col justify-between gap-4 rounded-[24px] border border-[var(--border-strong)] bg-[var(--bg-page)] p-5 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2 text-[length:var(--text-2xl)] font-semibold text-[var(--text-primary)]">
                    <ShieldCheckIcon className="h-4 w-4 text-[var(--accent-text)]" />
                    <span>Trade / Sign-Shop Blind White-Label Shipping</span>
                  </div>
                  <p className="mt-1 text-[length:var(--text-lg)] text-[var(--text-secondary)]">
                    Ship directly to your job site or shop in unbranded crates
                    with zero BASISSIGN invoices or markings inside.
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={form.tradeBlindShipping}
                  aria-label="Toggle Trade Blind White-Label Shipping"
                  disabled={isSubmitting}
                  onClick={() =>
                    updateField("tradeBlindShipping", !form.tradeBlindShipping)
                  }
                  className={`inline-flex min-h-[44px] shrink-0 cursor-pointer items-center gap-3 rounded-[var(--radius-lg)] border px-4 py-2 text-[length:var(--text-lg)] font-semibold transition-colors active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${
                    form.tradeBlindShipping
                      ? "border-[var(--accent-cta)] bg-[var(--accent-cta)] text-[var(--surface-white)]"
                      : "border-[var(--border-strong)] bg-[var(--bg-elevated)] text-[var(--text-primary)] hover:border-[var(--accent-cta)]"
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 rounded-full ${
                      form.tradeBlindShipping
                        ? "bg-[var(--surface-white)]"
                        : "bg-[var(--text-muted-theme)]"
                    }`}
                  />
                  <span>
                    {form.tradeBlindShipping ? "Blind Trade ON" : "Standard"}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: COPY, DIMENSIONS & LIGHTING */}
          {step === 3 && (
            <div className="flex flex-col gap-6">
              <div>
                <p className="ui-eyebrow text-[var(--accent-text)]">
                  Step 3 of 5 · Dimensions &amp; Illumination
                </p>
                <h2 className="display-h3 mt-2 text-[var(--text-primary)]">
                  Sign Copy, Letter Height &amp; LED Color
                </h2>
              </div>

              <div>
                <label
                  htmlFor="signText"
                  className="mb-2 block text-[length:var(--text-xl)] font-semibold text-[var(--text-primary)]"
                >
                  Sign Copy / Brand Name <span aria-hidden="true">*</span>
                </label>
                <input
                  id="signText"
                  type="text"
                  required
                  maxLength={160}
                  value={form.signText}
                  onChange={(e) => updateField("signText", e.target.value)}
                  placeholder='e.g. "APEX DENTAL STUDIO" or "See uploaded logo"'
                  aria-invalid={Boolean(errors.signText)}
                  aria-describedby={errors.signText ? "err-signText" : undefined}
                  className="ui-input"
                />
                {errors.signText && (
                  <p
                    id="err-signText"
                    role="alert"
                    className="mt-1.5 text-[length:var(--text-lg)] font-medium text-[var(--status-error-fg)]"
                  >
                    {errors.signText}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="letterHeight"
                    className="mb-2 block text-[length:var(--text-xl)] font-semibold text-[var(--text-primary)]"
                  >
                    Estimated Letter / Cabinet Height{" "}
                    <span aria-hidden="true">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="letterHeight"
                      value={form.letterHeight}
                      onChange={(e) =>
                        updateField(
                          "letterHeight",
                          e.target.value as QuotePayload["letterHeight"]
                        )
                      }
                      aria-invalid={Boolean(errors.letterHeight)}
                      aria-describedby={
                        errors.letterHeight ? "err-letterHeight" : undefined
                      }
                      className="ui-select"
                    >
                      {LETTER_HEIGHT_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-secondary)]" />
                  </div>
                  {errors.letterHeight && (
                    <p
                      id="err-letterHeight"
                      role="alert"
                      className="mt-1.5 text-[length:var(--text-lg)] font-medium text-[var(--status-error-fg)]"
                    >
                      {errors.letterHeight}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="totalWidthInches"
                    className="mb-2 block text-[length:var(--text-xl)] font-semibold text-[var(--text-primary)]"
                  >
                    Max Overall Width / Fascia Span (Optional)
                  </label>
                  <input
                    id="totalWidthInches"
                    type="text"
                    maxLength={40}
                    value={form.totalWidthInches}
                    onChange={(e) =>
                      updateField("totalWidthInches", e.target.value)
                    }
                    placeholder='e.g. "120 in wide" or "18 ft storefront"'
                    aria-invalid={Boolean(errors.totalWidthInches)}
                    aria-describedby={
                      errors.totalWidthInches ? "err-totalWidthInches" : undefined
                    }
                    className="ui-input"
                  />
                  {errors.totalWidthInches && (
                    <p
                      id="err-totalWidthInches"
                      role="alert"
                      className="mt-1.5 text-[length:var(--text-lg)] font-medium text-[var(--status-error-fg)]"
                    >
                      {errors.totalWidthInches}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="ledFinish"
                  className="mb-2 block text-[length:var(--text-xl)] font-semibold text-[var(--text-primary)]"
                >
                  LED Color Temperature or Metal Finish{" "}
                  <span aria-hidden="true">*</span>
                </label>
                <div className="relative">
                  <select
                    id="ledFinish"
                    value={form.ledFinish}
                    onChange={(e) =>
                      updateField(
                        "ledFinish",
                        e.target.value as QuotePayload["ledFinish"]
                      )
                    }
                    aria-invalid={Boolean(errors.ledFinish)}
                    aria-describedby={
                      errors.ledFinish ? "err-ledFinish" : undefined
                    }
                    className="ui-select"
                  >
                    {LED_KELVIN_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-secondary)]" />
                </div>
                {errors.ledFinish && (
                  <p
                    id="err-ledFinish"
                    role="alert"
                    className="mt-1.5 text-[length:var(--text-lg)] font-medium text-[var(--status-error-fg)]"
                  >
                    {errors.ledFinish}
                  </p>
                )}
              </div>

              {/* Free 3D Day/Night Mockup Switch */}
              <div className="flex flex-col justify-between gap-4 rounded-[24px] border border-[var(--border-subtle)] bg-[var(--bg-page)] p-5 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2 text-[length:var(--text-2xl)] font-semibold text-[var(--text-primary)]">
                    <SparklesIcon className="h-4 w-4 text-[var(--accent-text)]" />
                    <span>Include Free 3D Day/Night Facade Mockup</span>
                  </div>
                  <p className="mt-1 text-[length:var(--text-lg)] text-[var(--text-secondary)]">
                    Delivered with your quote within 1 business day for landlord
                    or client sign-off.
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={form.free3dMockup}
                  aria-label="Toggle free 3D Day and Night mockup"
                  disabled={isSubmitting}
                  onClick={() =>
                    updateField("free3dMockup", !form.free3dMockup)
                  }
                  className={`inline-flex min-h-[44px] shrink-0 cursor-pointer items-center gap-3 rounded-[var(--radius-lg)] border px-4 py-2 text-[length:var(--text-lg)] font-semibold transition-colors active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${
                    form.free3dMockup
                      ? "border-[var(--accent-cta)] bg-[var(--accent-cta)] text-[var(--surface-white)]"
                      : "border-[var(--border-strong)] bg-[var(--bg-elevated)] text-[var(--text-primary)] hover:border-[var(--accent-cta)]"
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 rounded-full ${
                      form.free3dMockup
                        ? "bg-[var(--surface-white)]"
                        : "bg-[var(--text-muted-theme)]"
                    }`}
                  />
                  <span>
                    {form.free3dMockup ? "Included Free" : "Quote Only"}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: ARTWORK & BUILDING FACADE UPLOAD */}
          {step === 4 && (
            <div className="flex flex-col gap-6">
              <div>
                <p className="ui-eyebrow text-[var(--accent-text)]">
                  Step 4 of 5 · Artwork &amp; Storefront Photos
                </p>
                <h2 className="display-h3 mt-2 text-[var(--text-primary)]">
                  Upload Logo Vector or Building Photo (Optional)
                </h2>
                <p className="mt-2 text-[length:var(--text-2xl)] text-[var(--text-secondary)]">
                  Attach vector files (.pdf, .ai, .eps, .svg) or storefront
                  photos (.png, .jpg) for scaled 3D Day/Night proofing. Don&apos;t
                  have final artwork yet? Skip straight to Step 5.
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                tabIndex={-1}
                multiple
                accept={ALLOWED_UPLOAD_EXTENSIONS.join(",")}
                onChange={handleFileInputChange}
                disabled={files.length >= MAX_UPLOAD_FILES || isSubmitting}
                aria-invalid={Boolean(uploadError)}
                aria-describedby={uploadError ? "upload-error-msg" : undefined}
                className="sr-only"
                aria-label="Select logo artwork or facade photos"
              />

              <div
                aria-disabled={files.length >= MAX_UPLOAD_FILES || isSubmitting}
                aria-busy={isSubmitting || undefined}
                aria-invalid={Boolean(uploadError)}
                data-dragging={isDragging ? "true" : undefined}
                data-loading={isSubmitting ? "true" : undefined}
                data-error={uploadError ? "true" : undefined}
                onDragOver={handleDropzoneDragOver}
                onDragLeave={handleDropzoneDragLeave}
                onDrop={handleDropzoneDrop}
                className={`ui-dropzone !p-0 ${
                  uploadError
                    ? "border-[var(--status-error-border)] bg-[var(--status-error-bg)]"
                    : ""
                }`}
              >
                <button
                  type="button"
                  disabled={files.length >= MAX_UPLOAD_FILES || isSubmitting}
                  aria-describedby={uploadError ? "upload-error-msg" : undefined}
                  onClick={() => {
                    if (files.length < MAX_UPLOAD_FILES && !isSubmitting) {
                      fileInputRef.current?.click();
                    }
                  }}
                  className="mx-auto flex w-full cursor-pointer flex-col items-center rounded-[var(--radius-xs)] px-6 py-7 text-center disabled:cursor-not-allowed"
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--bg-subtle)] text-[var(--accent-text)]">
                    <UploadIcon className="h-6 w-6" />
                  </span>
                  <span className="mt-4 text-[length:var(--text-3xl)] font-semibold text-[var(--text-primary)]">
                    {files.length >= MAX_UPLOAD_FILES
                      ? `Maximum ${MAX_UPLOAD_FILES} files attached`
                      : "Drag & drop files here, or click to browse"}
                  </span>
                  <span className="mt-1.5 text-[length:var(--text-lg)] text-[var(--text-muted-theme)]">
                    Accepted: PDF, AI, EPS, SVG, PNG, JPG · Max 15 MB per file ·
                    Up to {MAX_UPLOAD_FILES} files
                  </span>
                </button>
              </div>

              {uploadError && (
                <div
                  id="upload-error-msg"
                  role="alert"
                  className="flex items-center gap-2.5 rounded-[18px] border p-3.5 text-[length:var(--text-lg)] font-medium"
                  style={{
                    backgroundColor: "var(--status-error-bg)",
                    borderColor: "var(--status-error-border)",
                    color: "var(--status-error-fg)",
                  }}
                >
                  <AlertCircleIcon className="h-4 w-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {files.length > 0 && (
                <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                  {files.map((file, idx) => (
                    <li
                      key={`${file.name}-${file.size}-${idx}`}
                      className="flex items-center justify-between gap-3 rounded-[20px] border border-[var(--border-subtle)] bg-[var(--bg-page)] px-4 py-3"
                    >
                      <div className="min-w-0">
                        <div className="truncate text-[length:var(--text-xl)] font-medium text-[var(--text-primary)]">
                          {file.name}
                        </div>
                        <div className="text-[length:var(--text-md)] text-[var(--text-muted-theme)]">
                          {getFileExtension(file.name).toUpperCase().slice(1)}{" "}
                          · {formatBytes(file.size)}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFileAt(idx)}
                        aria-label={`Remove ${file.name}`}
                        className="min-h-[38px] shrink-0 cursor-pointer rounded-[var(--radius-lg)] border border-[var(--border-strong)] bg-[var(--bg-elevated)] px-3.5 py-1 text-[length:var(--text-lg)] font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--status-error-border)] hover:text-[var(--status-error-fg)]"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* STEP 5: CONTACT & TIMELINE */}
          {step === 5 && (
            <div className="flex flex-col gap-5">
              <div>
                <p className="ui-eyebrow text-[var(--accent-text)]">
                  Step 5 of 5 · Engineering Delivery Details
                </p>
                <h2 className="display-h3 mt-2 text-[var(--text-primary)]">
                  Where Should We Send Your Quote &amp; 3D Proof?
                </h2>
              </div>

              {/* Honeypot anti-spam field */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-[9999px] opacity-0"
              >
                <label htmlFor="websiteUrl">Leave this field blank</label>
                <input
                  id="websiteUrl"
                  name="websiteUrl"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.websiteUrl}
                  onChange={(e) => updateField("websiteUrl", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-[length:var(--text-xl)] font-semibold text-[var(--text-primary)]"
                  >
                    Full Name <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    autoComplete="name"
                    required
                    maxLength={100}
                    value={form.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    placeholder="Jordan Alvarez"
                    aria-invalid={Boolean(errors.fullName)}
                    aria-describedby={
                      errors.fullName ? "err-fullName" : undefined
                    }
                    className="ui-input"
                  />
                  {errors.fullName && (
                    <p
                      id="err-fullName"
                      role="alert"
                      className="mt-1.5 text-[length:var(--text-lg)] font-medium text-[var(--status-error-fg)]"
                    >
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="companyName"
                    className="mb-2 block text-[length:var(--text-xl)] font-semibold text-[var(--text-primary)]"
                  >
                    Company / Sign Shop Name <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="companyName"
                    type="text"
                    autoComplete="organization"
                    required
                    maxLength={120}
                    value={form.companyName}
                    onChange={(e) => updateField("companyName", e.target.value)}
                    placeholder="Apex Sign & Lighting Co."
                    aria-invalid={Boolean(errors.companyName)}
                    aria-describedby={
                      errors.companyName ? "err-companyName" : undefined
                    }
                    className="ui-input"
                  />
                  {errors.companyName && (
                    <p
                      id="err-companyName"
                      role="alert"
                      className="mt-1.5 text-[length:var(--text-lg)] font-medium text-[var(--status-error-fg)]"
                    >
                      {errors.companyName}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-[length:var(--text-xl)] font-semibold text-[var(--text-primary)]"
                  >
                    Business Email <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={160}
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="estimating@company.com"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "err-email" : undefined}
                    className="ui-input"
                  />
                  {errors.email && (
                    <p
                      id="err-email"
                      role="alert"
                      className="mt-1.5 text-[length:var(--text-lg)] font-medium text-[var(--status-error-fg)]"
                    >
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-[length:var(--text-xl)] font-semibold text-[var(--text-primary)]"
                  >
                    Phone Number <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    maxLength={30}
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="(555) 234-5678"
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? "err-phone" : undefined}
                    className="ui-input"
                  />
                  {errors.phone && (
                    <p
                      id="err-phone"
                      role="alert"
                      className="mt-1.5 text-[length:var(--text-lg)] font-medium text-[var(--status-error-fg)]"
                    >
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="zipCode"
                    className="mb-2 block text-[length:var(--text-xl)] font-semibold text-[var(--text-primary)]"
                  >
                    Shipping ZIP / Postal Code <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="zipCode"
                    type="text"
                    autoComplete="postal-code"
                    required
                    maxLength={12}
                    value={form.zipCode}
                    onChange={(e) => updateField("zipCode", e.target.value)}
                    placeholder="30303"
                    aria-invalid={Boolean(errors.zipCode)}
                    aria-describedby={
                      errors.zipCode ? "err-zipCode" : undefined
                    }
                    className="ui-input"
                  />
                  {errors.zipCode && (
                    <p
                      id="err-zipCode"
                      role="alert"
                      className="mt-1.5 text-[length:var(--text-lg)] font-medium text-[var(--status-error-fg)]"
                    >
                      {errors.zipCode}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="targetTimeline"
                    className="mb-2 block text-[length:var(--text-xl)] font-semibold text-[var(--text-primary)]"
                  >
                    Target Installation Timeline{" "}
                    <span aria-hidden="true">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="targetTimeline"
                      value={form.targetTimeline}
                      onChange={(e) =>
                        updateField(
                          "targetTimeline",
                          e.target.value as QuotePayload["targetTimeline"]
                        )
                      }
                      aria-invalid={Boolean(errors.targetTimeline)}
                      aria-describedby={
                        errors.targetTimeline ? "err-targetTimeline" : undefined
                      }
                      className="ui-select"
                    >
                      {TARGET_TIMELINE_OPTIONS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-secondary)]" />
                  </div>
                  {errors.targetTimeline && (
                    <p
                      id="err-targetTimeline"
                      role="alert"
                      className="mt-1.5 text-[length:var(--text-lg)] font-medium text-[var(--status-error-fg)]"
                    >
                      {errors.targetTimeline}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="notes"
                  className="mb-2 block text-[length:var(--text-xl)] font-semibold text-[var(--text-primary)]"
                >
                  Pantone PMS Codes, Wall Surface, or Landlord Criteria
                  (Optional)
                </label>
                <textarea
                  id="notes"
                  maxLength={2000}
                  value={form.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  placeholder="Share brick/stucco/ACM substrate notes, PMS colors, raceway paint code, or municipal sign criteria..."
                  aria-invalid={Boolean(errors.notes)}
                  aria-describedby={errors.notes ? "err-notes" : undefined}
                  className="ui-textarea"
                />
                {errors.notes && (
                  <p
                    id="err-notes"
                    role="alert"
                    className="mt-1.5 text-[length:var(--text-lg)] font-medium text-[var(--status-error-fg)]"
                  >
                    {errors.notes}
                  </p>
                )}
              </div>

              <div>
                <label className="flex cursor-pointer items-start gap-3 rounded-[20px] border border-[var(--border-subtle)] bg-[var(--bg-page)] p-4">
                  <input
                    type="checkbox"
                    checked={form.consent}
                    onChange={(e) => updateField("consent", e.target.checked)}
                    aria-invalid={Boolean(errors.consent)}
                    aria-describedby={
                      errors.consent ? "err-consent" : undefined
                    }
                    className="mt-1 h-5 w-5 shrink-0 accent-[var(--accent-cta)]"
                  />
                  <span className="text-[length:var(--text-xl)] leading-snug text-[var(--text-primary)]">
                    I authorize {BRAND_FACTS.legalName} engineers to prepare my
                    custom signage estimate, UL 48 specification sheet, and
                    complimentary 3D Day/Night mockup.
                  </span>
                </label>
                {errors.consent && (
                  <p
                    id="err-consent"
                    role="alert"
                    className="mt-1.5 text-[length:var(--text-lg)] font-medium text-[var(--status-error-fg)]"
                  >
                    {errors.consent}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Bottom Step Navigation Controls */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border-subtle)] pt-6">
            {step > 1 ? (
              <button
                type="button"
                onClick={goToPreviousStep}
                disabled={isSubmitting}
                className="inline-flex min-h-[48px] cursor-pointer items-center gap-2 rounded-[var(--radius-lg)] border border-[var(--border-strong)] bg-[var(--bg-page)] px-5 py-2 text-[length:var(--text-xl)] font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--accent-cta)] hover:bg-[var(--bg-subtle)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                <span>Back</span>
              </button>
            ) : (
              <span className="text-[length:var(--text-lg)] text-[var(--text-muted-theme)]">
                Step 1 of 5 · No obligation quote
              </span>
            )}

            {step < 5 ? (
              <PillButton
                type="button"
                onClick={goToNextStep}
                variant="cta"
              >
                {step === 4
                  ? files.length > 0
                    ? `Continue with ${files.length} ${
                        files.length === 1 ? "File" : "Files"
                      }`
                    : "Skip Upload & Continue"
                  : "Continue"}
              </PillButton>
            ) : (
              <PillButton
                type="submit"
                variant="cta"
                loading={isSubmitting}
                error={Boolean(errors.form)}
              >
                {isSubmitting
                  ? "Submitting Quote..."
                  : "Submit Quote Request"}
              </PillButton>
            )}
          </div>
        </form>
      </div>

      {/* Live Architectural Summary & Direct Support Sidebar */}
      <aside
        aria-label="Live Quote Specification Summary"
        className="lg:col-span-4"
      >
        <div className="rounded-[var(--radius-xs)] border border-[var(--border-strong)] bg-[var(--bg-elevated)] p-6 lg:sticky lg:top-24 lg:max-h-[calc(100dvh-7rem)] lg:overflow-y-auto">
          <div className="flex items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-4">
            <div>
              <p className="ui-eyebrow text-[var(--accent-text)]">
                Live Specification
              </p>
              <h3 className="mt-1 text-[length:var(--text-4xl)] font-semibold text-[var(--text-primary)]">
                {selectedSignOption.shortLabel}
              </h3>
            </div>
            <span className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-3 py-1 text-[length:var(--text-md)] font-semibold text-[var(--text-primary)]">
              {selectedSignOption.badge}
            </span>
          </div>

          <dl className="m-0 mt-4 flex flex-col gap-3.5 text-[length:var(--text-xl)]">
            <div className="flex justify-between gap-3">
              <dt className="text-[var(--text-muted-theme)]">Environment</dt>
              <dd className="m-0 text-right font-medium text-[var(--text-primary)]">
                {selectedEnvironmentOption.id === "exterior-ul48"
                  ? "Exterior UL 48"
                  : "Interior Dry"}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-[var(--text-muted-theme)]">Mounting</dt>
              <dd className="m-0 text-right font-medium text-[var(--text-primary)]">
                {selectedMountingOption.label}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-[var(--text-muted-theme)]">Trade Crate</dt>
              <dd className="m-0 text-right font-medium text-[var(--text-primary)]">
                {form.tradeBlindShipping ? "Blind White-Label" : "Standard"}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-[var(--text-muted-theme)]">Sign Copy</dt>
              <dd className="m-0 max-w-[190px] truncate text-right font-medium text-[var(--text-primary)]">
                {form.signText.trim() || "Pending copy"}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-[var(--text-muted-theme)]">Letter Height</dt>
              <dd className="m-0 text-right font-medium text-[var(--text-primary)]">
                {form.letterHeight}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-[var(--text-muted-theme)]">Illumination</dt>
              <dd className="m-0 max-w-[190px] truncate text-right font-medium text-[var(--text-primary)]">
                {form.ledFinish}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-[var(--text-muted-theme)]">3D Mockup</dt>
              <dd className="m-0 text-right font-medium text-[var(--accent-text)]">
                {form.free3dMockup ? "Free 24h Rendering" : "Quote Only"}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-[var(--text-muted-theme)]">Attachments</dt>
              <dd className="m-0 text-right font-medium text-[var(--text-primary)]">
                {files.length} / {MAX_UPLOAD_FILES} files
              </dd>
            </div>
          </dl>

          <div className="mt-6 rounded-[20px] border border-[var(--border-subtle)] bg-[var(--bg-page)] p-4">
            <div className="flex items-center gap-2 text-[length:var(--text-xl)] font-semibold text-[var(--text-primary)]">
              <ShieldCheckIcon className="h-4 w-4 text-[var(--accent-text)]" />
              <span>Included With Every Quote</span>
            </div>
            <ul className="m-0 mt-2.5 flex list-none flex-col gap-1.5 p-0 text-[length:var(--text-lg)] text-[var(--text-secondary)]">
              <li>&bull; Itemized factory-direct wholesale quote</li>
              <li>&bull; UL 48 (#{BRAND_FACTS.ulFileNumber}) &amp; NEC 600 spec sheet</li>
              <li>&bull; Free 1:1 pattern &amp; Mean Well® power sizing</li>
              <li>&bull; {BRAND_FACTS.warrantyYears}-Year warranty &amp; &lt;1% freight rate</li>
            </ul>
          </div>

          <div className="mt-5 border-t border-[var(--border-subtle)] pt-4 text-[length:var(--text-lg)] text-[var(--text-secondary)]">
            <div>Direct Estimating Desk:</div>
            <a
              href={BRAND_FACTS.phoneHref}
              className="mt-1 inline-flex items-center gap-1.5 font-semibold text-[var(--text-primary)] no-underline hover:text-[var(--accent-text)]"
            >
              <PhoneIcon className="h-4 w-4 text-[var(--accent-text)]" />
              <span>{BRAND_FACTS.phone}</span>
            </a>
            <div className="mt-0.5">{BRAND_FACTS.email}</div>
          </div>
        </div>
      </aside>
    </div>
  );
}
