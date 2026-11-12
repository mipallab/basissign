"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { BRAND_FACTS } from "@/data/catalog";
import { CloseIcon, ShieldCheckIcon, SparklesIcon } from "./Icons";
import { ShortQueryForm } from "./ShortQueryForm";

const QUOTE_MODAL_INTERVAL_MS = 60_000;
const DEFER_RETRY_MS = 5_000;
const SUBMITTED_STORAGE_KEY = "basissign_modal_quote_submitted";

function readSubmittedFlag(): boolean {
  try {
    return window.sessionStorage.getItem(SUBMITTED_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function writeSubmittedFlag(): void {
  try {
    window.sessionStorage.setItem(SUBMITTED_STORAGE_KEY, "1");
  } catch {
    // Ignore storage quota or private-mode restrictions
  }
}

function deriveDefaultSignTypeFromPath(pathname: string | null): string {
  if (!pathname) return "front-lit";
  const lower = pathname.toLowerCase();
  if (lower.includes("halo-lit")) return "halo-lit";
  if (lower.includes("dual-lit")) return "dual-lit";
  if (lower.includes("blade") || lower.includes("push-thru")) return "blade-sign";
  return "front-lit";
}

export function TimedQuoteModal() {
  const pathname = usePathname();
  const titleId = useId();
  const descId = useId();

  const [trackedPath, setTrackedPath] = useState(pathname);
  const [isOpen, setIsOpen] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  if (trackedPath !== pathname) {
    setTrackedPath(pathname);
    if (pathname === "/quote" && isOpen) {
      setIsOpen(false);
    }
  }

  const timerRef = useRef<number | null>(null);
  const pathnameRef = useRef(pathname);
  const isOpenRef = useRef(false);
  const hasSubmittedRef = useRef(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const scheduleTimer = useCallback(
    (delayMs: number) => {
      const arm = (ms: number) => {
        clearTimer();
        if (hasSubmittedRef.current || readSubmittedFlag()) return;
        if (pathnameRef.current === "/quote") return;
        if (isOpenRef.current) return;

        timerRef.current = window.setTimeout(() => {
          timerRef.current = null;

          if (hasSubmittedRef.current || readSubmittedFlag()) return;
          if (pathnameRef.current === "/quote") return;
          if (isOpenRef.current) return;

          // Defer if another modal/drawer dialog is currently open
          if (document.querySelector('[role="dialog"][aria-modal="true"]')) {
            arm(DEFER_RETRY_MS);
            return;
          }

          // Defer while user is actively typing in any input, textarea, or select
          const active = document.activeElement as HTMLElement | null;
          const tag = active?.tagName?.toLowerCase();
          const isTyping =
            tag === "input" ||
            tag === "textarea" ||
            tag === "select" ||
            Boolean(active?.isContentEditable);

          if (isTyping) {
            arm(DEFER_RETRY_MS);
            return;
          }

          previousFocusRef.current = active;
          isOpenRef.current = true;
          setIsOpen(true);
        }, ms);
      };

      arm(delayMs);
    },
    [clearTimer]
  );

  // Sync session storage submitted flag on mount & schedule initial 1-minute popup
  useEffect(() => {
    if (readSubmittedFlag()) {
      hasSubmittedRef.current = true;
      clearTimer();
      return;
    }

    if (pathnameRef.current !== "/quote") {
      scheduleTimer(QUOTE_MODAL_INTERVAL_MS);
    }

    return () => {
      clearTimer();
    };
  }, [clearTimer, scheduleTimer]);

  // Keep pathname synced: suppress on /quote, resume timer when navigating away
  useEffect(() => {
    pathnameRef.current = pathname;

    if (pathname === "/quote") {
      clearTimer();
      return;
    }

    if (
      !hasSubmittedRef.current &&
      !readSubmittedFlag() &&
      !isOpenRef.current &&
      timerRef.current === null
    ) {
      scheduleTimer(QUOTE_MODAL_INTERVAL_MS);
    }
  }, [clearTimer, pathname, scheduleTimer]);

  const dismissModal = useCallback(() => {
    isOpenRef.current = false;
    setIsOpen(false);

    const restoreTarget = previousFocusRef.current;
    window.setTimeout(() => {
      if (restoreTarget && document.contains(restoreTarget)) {
        restoreTarget.focus();
      }
    }, 0);

    if (!hasSubmittedRef.current && !readSubmittedFlag()) {
      scheduleTimer(QUOTE_MODAL_INTERVAL_MS);
    }
  }, [scheduleTimer]);

  const handleSuccessSubmitted = useCallback(() => {
    writeSubmittedFlag();
    hasSubmittedRef.current = true;
    setHasSubmitted(true);
    clearTimer();
  }, [clearTimer]);

  // WCAG 2.2 AA Dialog Lifecycle: Scroll lock, focus initialization, Escape close & Tab trap
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 20);

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        dismissModal();
        return;
      }

      if (event.key === "Tab" && modalRef.current) {
        const focusables = Array.from(
          modalRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => el.offsetParent !== null);

        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [dismissModal, isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[115] flex items-center justify-center p-3 sm:p-6"
      role="presentation"
    >
      {/* Backdrop Scrim */}
      <div
        aria-hidden="true"
        onClick={dismissModal}
        className="fixed inset-0 backdrop-blur-md transition-opacity duration-[var(--dur-normal)]"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--surface-black) 78%, transparent)",
        }}
      />

      {/* Scroll-Safe Dialog Container */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="relative z-[116] flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-y-auto overflow-x-hidden rounded-[var(--radius-xs)] border border-[var(--border-strong)] bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-2xl"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[var(--border-subtle)] bg-[var(--bg-page)] px-5 py-4 sm:px-7 sm:py-5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-lg)] bg-[var(--accent-cta)] px-3 py-0.5 text-[length:var(--text-sm)] font-semibold uppercase tracking-[0.06em] text-[var(--surface-white)]">
                <SparklesIcon className="h-3 w-3" />
                <span>Free 24h 3D Mockup</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[length:var(--text-md)] font-medium text-[var(--text-secondary)]">
                <ShieldCheckIcon className="h-3.5 w-3.5 text-[var(--accent-text)]" />
                <span>UL 48 #{BRAND_FACTS.ulFileNumber}</span>
              </span>
            </div>

            <h2
              id={titleId}
              className="display-h3 m-0 mt-2 text-[var(--text-primary)]"
            >
              Get Factory-Direct Signage Pricing
            </h2>
            <p
              id={descId}
              className="m-0 mt-1 text-[length:var(--text-xl)] text-[var(--text-secondary)]"
            >
              Tell our US fabrication engineers what sign you need—receive UL
              48 specs &amp; a complimentary 3D facade proof within 1 business
              day.
            </p>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={dismissModal}
            aria-label={
              hasSubmitted
                ? "Close confirmation dialog"
                : "Dismiss quote request dialog"
            }
            className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-[var(--radius-lg)] border border-[var(--border-strong)] bg-[var(--bg-elevated)] text-[var(--text-primary)] transition-colors duration-[var(--dur-fast)] hover:border-[var(--accent-cta)] hover:text-[var(--accent-text)] active:scale-[0.96]"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Compact Modal Form Body */}
        <div className="px-5 py-5 sm:px-7 sm:py-6">
          <ShortQueryForm
            variant="modal"
            placement={`timed-modal:${pathname || "/"}`.slice(0, 160)}
            defaultSignType={deriveDefaultSignTypeFromPath(pathname)}
            onSuccessSubmitted={handleSuccessSubmitted}
          />
        </div>
      </div>
    </div>
  );
}
