"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { BRAND_FACTS } from "@/data/catalog";
import { CloseIcon, ShieldCheckIcon, SparklesIcon } from "./Icons";
import { PillButton, type PillVariant } from "./PillButton";
import { ShortQueryForm } from "./ShortQueryForm";

interface ProductQuoteRequestOptions {
  quoteTypeId?: string;
  productName?: string;
  placement?: string;
}

interface ProductQuoteModalContextValue {
  openQuoteModal: (
    options?: ProductQuoteRequestOptions,
    triggerEl?: HTMLElement | null
  ) => void;
  closeQuoteModal: () => void;
}

const ProductQuoteModalContext =
  createContext<ProductQuoteModalContextValue | null>(null);

export function useProductQuoteModal() {
  const ctx = useContext(ProductQuoteModalContext);
  if (!ctx) {
    throw new Error(
      "useProductQuoteModal must be used inside a ProductQuoteProvider"
    );
  }
  return ctx;
}

interface ProductQuoteProviderProps {
  defaultQuoteTypeId?: string;
  defaultProductName?: string;
  defaultPlacement?: string;
  children: ReactNode;
}

export function ProductQuoteProvider({
  defaultQuoteTypeId = "front-lit",
  defaultProductName = "Custom Architectural Signage",
  defaultPlacement = "product-modal",
  children,
}: ProductQuoteProviderProps) {
  const titleId = useId();
  const descId = useId();

  const [isOpen, setIsOpen] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [sessionId, setSessionId] = useState(0);
  const [activeOptions, setActiveOptions] = useState<
    Required<ProductQuoteRequestOptions>
  >({
    quoteTypeId: defaultQuoteTypeId,
    productName: defaultProductName,
    placement: defaultPlacement,
  });

  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastTriggerRef = useRef<HTMLElement | null>(null);

  const openQuoteModal = useCallback(
    (options?: ProductQuoteRequestOptions, triggerEl?: HTMLElement | null) => {
      lastTriggerRef.current =
        triggerEl ?? (document.activeElement as HTMLElement | null);
      setHasSubmitted(false);
      setActiveOptions({
        quoteTypeId: options?.quoteTypeId || defaultQuoteTypeId,
        productName: options?.productName || defaultProductName,
        placement: options?.placement || defaultPlacement,
      });
      setSessionId((prev) => prev + 1);
      setIsOpen(true);
    },
    [defaultPlacement, defaultProductName, defaultQuoteTypeId]
  );

  const closeQuoteModal = useCallback(() => {
    setIsOpen(false);
    const restoreTarget = lastTriggerRef.current;
    window.setTimeout(() => {
      if (restoreTarget && document.contains(restoreTarget)) {
        restoreTarget.focus();
      }
    }, 0);
  }, []);

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
        closeQuoteModal();
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
  }, [closeQuoteModal, isOpen]);

  return (
    <ProductQuoteModalContext.Provider
      value={{ openQuoteModal, closeQuoteModal }}
    >
      {children}

      {isOpen && (
        <div
          className="fixed inset-0 z-[115] flex items-center justify-center p-3 sm:p-6"
          role="presentation"
        >
          {/* Backdrop Scrim */}
          <div
            aria-hidden="true"
            onClick={closeQuoteModal}
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
                    <span>Short Product Inquiry</span>
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
                  Request a Quote: {activeOptions.productName}
                </h2>
                <p
                  id={descId}
                  className="m-0 mt-1 text-[length:var(--text-xl)] text-[var(--text-secondary)]"
                >
                  Submit brief project specs below—our US engineers reply within
                  1 business day with UL 48 pricing and a complimentary 3D
                  facade mockup.
                </p>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeQuoteModal}
                aria-label={
                  hasSubmitted
                    ? "Close confirmation dialog"
                    : `Close quote dialog for ${activeOptions.productName}`
                }
                className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-[var(--radius-lg)] border border-[var(--border-strong)] bg-[var(--bg-elevated)] text-[var(--text-primary)] transition-colors duration-[var(--dur-fast)] hover:border-[var(--accent-cta)] hover:text-[var(--accent-text)] active:scale-[0.96]"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Streamlined Product Short Inquiry Body */}
            <div className="px-5 py-5 sm:px-7 sm:py-6">
              <ShortQueryForm
                key={`${sessionId}-${activeOptions.quoteTypeId}`}
                mode="product"
                variant="modal"
                placement={activeOptions.placement}
                defaultSignType={activeOptions.quoteTypeId}
                onSuccessSubmitted={() => setHasSubmitted(true)}
                onCloseModal={closeQuoteModal}
              />
            </div>
          </div>
        </div>
      )}
    </ProductQuoteModalContext.Provider>
  );
}

interface ProductQuoteTriggerProps {
  children: ReactNode;
  quoteTypeId: string;
  productName: string;
  placement?: string;
  variant?: PillVariant;
  fullWidth?: boolean;
  className?: string;
  ariaLabel?: string;
}

export function ProductQuoteTrigger({
  children,
  quoteTypeId,
  productName,
  placement,
  variant = "cta",
  fullWidth = false,
  className = "",
  ariaLabel,
}: ProductQuoteTriggerProps) {
  const { openQuoteModal } = useProductQuoteModal();

  return (
    <PillButton
      type="button"
      variant={variant}
      fullWidth={fullWidth}
      className={className}
      ariaLabel={ariaLabel ?? `Request a Quote for ${productName}`}
      onClick={(e) =>
        openQuoteModal(
          {
            quoteTypeId,
            productName,
            placement: placement || `product-modal:${quoteTypeId}`,
          },
          e.currentTarget
        )
      }
    >
      {children}
    </PillButton>
  );
}
