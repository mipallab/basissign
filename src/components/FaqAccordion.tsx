"use client";

import { useState } from "react";
import { GLOBAL_FAQS } from "@/data/faqs";
import { ChevronDownIcon } from "./Icons";

export interface AccordionFaqItem {
  id?: string;
  category?: string;
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items?: AccordionFaqItem[];
  id?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
}

export function FaqAccordion({
  items = GLOBAL_FAQS,
  id = "faq",
  eyebrow = "Technical & Permit FAQ",
  title = "Answers for Inspectors, Sign Shops & Business Owners",
  subtitle = "Direct engineering specifications covering UL Standard 48 certification (#E555259), NEC Article 600 disconnects, blind trade shipping, and installation deliverables.",
}: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="border-t border-[var(--border-subtle)] py-[var(--section-py)]"
    >
      <div className="site-container">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Left Sticky Editorial Intro */}
          <div className="lg:col-span-5">
            <p className="ui-eyebrow text-[var(--accent-text)]">{eyebrow}</p>
            <h2
              id={`${id}-heading`}
              className="display-h2 mt-3 text-[var(--text-primary)]"
            >
              {title}
            </h2>
            <p className="mt-4 text-[length:var(--text-2xl)] leading-relaxed text-[var(--text-secondary)]">
              {subtitle}
            </p>
          </div>

          {/* Right Animated Accordion Stack */}
          <div className="flex flex-col gap-3 lg:col-span-7">
            {items.map((item, idx) => {
              const key = item.id ?? `${id}-${idx}`;
              const isOpen = openIndex === idx;
              const panelId = `faq-panel-${key}`;
              const buttonId = `faq-btn-${key}`;

              return (
                <div
                  key={key}
                  className="rounded-[var(--radius-xs)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] transition-colors duration-[var(--dur-fast)] hover:border-[var(--border-strong)]"
                >
                  <h3 className="m-0">
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() =>
                        setOpenIndex((prev) => (prev === idx ? null : idx))
                      }
                      className="flex min-h-[60px] w-full cursor-pointer items-center justify-between gap-4 rounded-[calc(var(--radius-xs)-1px)] px-5 py-4 text-left text-[var(--text-primary)] transition-colors duration-[var(--dur-fast)] hover:bg-[var(--bg-subtle)] active:scale-[0.995] sm:px-6 sm:py-5"
                    >
                      <span className="flex flex-col gap-1">
                        {item.category && (
                          <span className="ui-eyebrow text-[var(--accent-text)]">
                            {item.category}
                          </span>
                        )}
                        <span className="text-[length:var(--text-3xl)] font-medium leading-snug text-[var(--text-primary)]">
                          {item.question}
                        </span>
                      </span>

                      <span
                        aria-hidden="true"
                        className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-lg)] border border-[var(--border-strong)] bg-[var(--bg-page)] text-[var(--text-primary)] transition-transform duration-[var(--dur-normal)] ease-[var(--ease-editorial)] ${
                          isOpen ? "rotate-180 bg-[var(--accent-cta)] text-[var(--surface-white)] border-transparent" : ""
                        }`}
                      >
                        <ChevronDownIcon className="h-4 w-4" />
                      </span>
                    </button>
                  </h3>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    aria-hidden={!isOpen}
                    className="grid transition-[grid-template-rows,opacity,visibility] duration-[var(--dur-slow)] ease-[var(--ease-editorial)]"
                    style={{
                      gridTemplateRows: isOpen ? "1fr" : "0fr",
                      opacity: isOpen ? 1 : 0,
                      visibility: isOpen ? "visible" : "hidden",
                    }}
                  >
                    <div className="overflow-hidden">
                      <p className="m-0 border-t border-[var(--border-subtle)] px-5 pb-5 pt-4 text-[length:var(--text-2xl)] leading-relaxed text-[var(--text-secondary)] sm:px-6 sm:pb-6">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
