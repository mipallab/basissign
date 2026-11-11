"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useId, useState, type ReactNode } from "react";
import {
  sanitizeHref,
  type BlogBlock,
  type BlogFaqItem,
  type BlogInlineRun,
} from "@/data/blog-shared";
import { ArrowRightIcon, ChevronDownIcon, ExternalLinkIcon } from "./Icons";
import { PillButton } from "./PillButton";

function renderRunText(
  text: string,
  bold?: boolean,
  italic?: boolean,
  code?: boolean,
  onDarkSurface = false
): ReactNode {
  let node: ReactNode = text;
  if (code) {
    node = (
      <code
        className={
          onDarkSurface
            ? "rounded-[6px] border border-[var(--local-border)] bg-[var(--local-elevated)] px-1.5 py-0.5 text-[0.9em] text-[var(--local-fg)]"
            : "rounded-[6px] border border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-1.5 py-0.5 text-[0.9em] text-[var(--text-primary)]"
        }
      >
        {node}
      </code>
    );
  }
  if (italic) {
    node = <em>{node}</em>;
  }
  if (bold) {
    node = (
      <strong
        className={
          onDarkSurface
            ? "font-semibold text-[var(--local-fg)]"
            : "font-semibold text-[var(--text-primary)]"
        }
      >
        {node}
      </strong>
    );
  }
  return node;
}

function InlineRuns({
  runs,
  onDarkSurface = false,
}: {
  runs: readonly BlogInlineRun[];
  onDarkSurface?: boolean;
}) {
  return (
    <>
      {runs.map((run, idx) => {
        if (run.type === "text") {
          return (
            <Fragment key={idx}>
              {renderRunText(
                run.text,
                run.bold,
                run.italic,
                run.code,
                onDarkSurface
              )}
            </Fragment>
          );
        }

        const safeHref = sanitizeHref(run.href);
        if (!safeHref) {
          return (
            <Fragment key={idx}>
              {renderRunText(
                run.text,
                run.bold,
                run.italic,
                false,
                onDarkSurface
              )}
            </Fragment>
          );
        }

        const isInternal = safeHref.startsWith("/") || safeHref.startsWith("#");
        const isContactProtocol =
          safeHref.startsWith("tel:") || safeHref.startsWith("mailto:");
        const isExternal = !isInternal && !isContactProtocol;

        const content = renderRunText(
          run.text,
          run.bold,
          run.italic,
          false,
          onDarkSurface
        );

        if (isInternal) {
          return (
            <Link
              key={idx}
              href={safeHref}
              className="font-medium text-[var(--accent-text)] underline decoration-[color-mix(in_srgb,var(--accent-text)_42%,transparent)] underline-offset-4 transition-colors duration-[var(--dur-fast)] hover:decoration-[var(--accent-text)]"
            >
              {content}
            </Link>
          );
        }

        if (isContactProtocol) {
          return (
            <a
              key={idx}
              href={safeHref}
              className="font-medium text-[var(--accent-text)] underline decoration-[color-mix(in_srgb,var(--accent-text)_42%,transparent)] underline-offset-4 transition-colors duration-[var(--dur-fast)] hover:decoration-[var(--accent-text)]"
            >
              {content}
            </a>
          );
        }

        return (
          <a
            key={idx}
            href={safeHref}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="inline-flex items-baseline gap-1 font-medium text-[var(--accent-text)] underline decoration-[color-mix(in_srgb,var(--accent-text)_42%,transparent)] underline-offset-4 transition-colors duration-[var(--dur-fast)] hover:decoration-[var(--accent-text)]"
          >
            <span>{content}</span>
            <ExternalLinkIcon className="inline h-3.5 w-3.5 shrink-0 translate-y-[1px]" />
            <span className="sr-only"> (opens in new tab)</span>
          </a>
        );
      })}
    </>
  );
}

function BlogFaqAccordionBlock({ items }: { items: readonly BlogFaqItem[] }) {
  const uid = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div
      className="my-8 flex flex-col gap-3"
      role="region"
      aria-label="Frequently Asked Questions"
    >
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        const btnId = `${uid}-faq-btn-${idx}`;
        const panelId = `${uid}-faq-panel-${idx}`;

        return (
          <div
            key={btnId}
            className="rounded-[var(--radius-xs)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] transition-colors duration-[var(--dur-fast)] hover:border-[var(--border-strong)]"
          >
            <h3 className="m-0">
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex((prev) => (prev === idx ? null : idx))}
                className="flex min-h-[56px] w-full cursor-pointer items-center justify-between gap-4 rounded-[calc(var(--radius-xs)-1px)] px-5 py-4 text-left text-[var(--text-primary)] transition-colors duration-[var(--dur-fast)] hover:bg-[var(--bg-subtle)] active:scale-[0.995]"
              >
                <span className="text-[length:var(--text-3xl)] font-medium leading-snug text-[var(--text-primary)]">
                  {item.question}
                </span>
                <span
                  aria-hidden="true"
                  className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-lg)] border border-[var(--border-strong)] bg-[var(--bg-page)] text-[var(--text-primary)] transition-transform duration-[var(--dur-normal)] ease-[var(--ease-editorial)] ${
                    isOpen
                      ? "rotate-180 border-transparent bg-[var(--accent-cta)] text-[var(--surface-white)]"
                      : ""
                  }`}
                >
                  <ChevronDownIcon className="h-4 w-4" />
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              aria-hidden={!isOpen}
              className="grid transition-[grid-template-rows,opacity,visibility] duration-[var(--dur-slow)] ease-[var(--ease-editorial)]"
              style={{
                gridTemplateRows: isOpen ? "1fr" : "0fr",
                opacity: isOpen ? 1 : 0,
                visibility: isOpen ? "visible" : "hidden",
              }}
            >
              <div className="overflow-hidden">
                <div className="border-t border-[var(--border-subtle)] px-5 pb-5 pt-4">
                  {item.answerRuns.map((paragraphRuns, pIdx) => (
                    <p
                      key={pIdx}
                      className={`m-0 text-[length:var(--text-2xl)] leading-relaxed text-[var(--text-secondary)] ${
                        pIdx > 0 ? "mt-3" : ""
                      }`}
                    >
                      <InlineRuns runs={paragraphRuns} />
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function BlogArticleRenderer({ blocks }: { blocks: readonly BlogBlock[] }) {
  return (
    <div className="min-w-0">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading": {
            if (block.level === 2) {
              return (
                <h2
                  key={`${block.id}-${index}`}
                  id={block.id}
                  className="display-h3 mt-10 mb-4 scroll-mt-24 text-[var(--text-primary)] first:mt-0"
                >
                  {block.text}
                </h2>
              );
            }
            if (block.level === 3) {
              return (
                <h3
                  key={`${block.id}-${index}`}
                  id={block.id}
                  className="mt-7 mb-3 scroll-mt-24 text-[length:var(--text-4xl)] font-semibold leading-snug text-[var(--text-primary)]"
                >
                  {block.text}
                </h3>
              );
            }
            return (
              <h4
                key={`${block.id}-${index}`}
                id={block.id}
                className="mt-5 mb-2 scroll-mt-24 text-[length:var(--text-3xl)] font-semibold text-[var(--text-primary)]"
              >
                {block.text}
              </h4>
            );
          }

          case "paragraph":
            return (
              <p
                key={index}
                className="my-4 text-[length:var(--text-3xl)] leading-[1.7] text-[var(--text-secondary)]"
              >
                <InlineRuns runs={block.runs} />
              </p>
            );

          case "list": {
            const ListTag = block.ordered ? "ol" : "ul";
            return (
              <ListTag
                key={index}
                className={`my-5 flex flex-col gap-2.5 pl-6 text-[length:var(--text-3xl)] leading-[1.65] text-[var(--text-secondary)] marker:font-semibold marker:text-[var(--accent-text)] ${
                  block.ordered ? "list-decimal" : "list-disc"
                }`}
              >
                {block.items.map((itemRuns, itemIdx) => (
                  <li key={itemIdx} className="pl-1">
                    <InlineRuns runs={itemRuns} />
                  </li>
                ))}
              </ListTag>
            );
          }

          case "table": {
            const hasHeaders = block.headers.some((cell) => cell.length > 0);
            return (
              <div
                key={index}
                role="region"
                tabIndex={0}
                aria-label="Specification comparison table"
                className="my-7 overflow-x-auto rounded-[var(--radius-xs)] border border-[var(--border-strong)] bg-[var(--bg-elevated)] shadow-sm"
              >
                <table className="w-full min-w-[540px] border-collapse text-left">
                  {hasHeaders && (
                    <thead>
                      <tr className="surface-dark">
                        {block.headers.map((headerRuns, hIdx) => (
                          <th
                            key={hIdx}
                            scope="col"
                            className="px-4 py-3.5 text-[length:var(--text-md)] font-semibold uppercase tracking-[0.06em] text-[var(--local-fg)]"
                          >
                            <InlineRuns runs={headerRuns} onDarkSurface />
                          </th>
                        ))}
                      </tr>
                    </thead>
                  )}
                  <tbody>
                    {block.rows.map((row, rIdx) => (
                      <tr
                        key={rIdx}
                        className="border-t border-[var(--border-subtle)] transition-colors duration-[var(--dur-fast)] hover:bg-[var(--bg-subtle)]"
                      >
                        {row.map((cellRuns, cIdx) => {
                          if (cIdx === 0) {
                            return (
                              <th
                                key={cIdx}
                                scope="row"
                                className="px-4 py-3.5 align-top text-[length:var(--text-xl)] font-semibold text-[var(--text-primary)]"
                              >
                                <InlineRuns runs={cellRuns} />
                              </th>
                            );
                          }
                          return (
                            <td
                              key={cIdx}
                              className="px-4 py-3.5 align-top text-[length:var(--text-xl)] leading-relaxed text-[var(--text-secondary)]"
                            >
                              <InlineRuns runs={cellRuns} />
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }

          case "image":
            return (
              <figure
                key={index}
                className="my-8 overflow-hidden rounded-[var(--radius-xs)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)]"
              >
                <div className="relative w-full overflow-hidden bg-[var(--bg-subtle)]">
                  <Image
                    src={block.src}
                    alt={block.alt}
                    width={block.width}
                    height={block.height}
                    sizes="(max-width: 1024px) 100vw, 820px"
                    className="h-auto w-full object-cover"
                  />
                </div>
                {(block.caption || block.alt) && (
                  <figcaption className="border-t border-[var(--border-subtle)] px-4 py-3 text-[length:var(--text-lg)] text-[var(--text-muted-theme)]">
                    {block.caption || block.alt}
                  </figcaption>
                )}
              </figure>
            );

          case "cta": {
            const safeCtaHref = sanitizeHref(block.href) ?? "/quote";
            const isInternalCta =
              safeCtaHref.startsWith("/") || safeCtaHref.startsWith("#");
            const isContactProtocol =
              safeCtaHref.startsWith("tel:") ||
              safeCtaHref.startsWith("mailto:");
            const isExternalCta = !isInternalCta && !isContactProtocol;

            return (
              <aside
                key={index}
                className="my-8 rounded-[var(--radius-xs)] border border-[var(--border-strong)] bg-[var(--bg-subtle)] p-6 text-center sm:p-8"
              >
                <p className="ui-eyebrow m-0 text-[var(--accent-text)]">
                  BASISSIGN Factory-Direct Engineering
                </p>
                <p className="mx-auto mt-2 max-w-xl text-[length:var(--text-3xl)] font-medium text-[var(--text-primary)]">
                  Get UL 48 (#E555259) specifications, wholesale pricing, and a
                  complimentary 24-hour 3D Day/Night facade proof.
                </p>
                <div className="mt-5 flex justify-center">
                  {isInternalCta ? (
                    <PillButton href={safeCtaHref} variant="cta">
                      {block.label}
                    </PillButton>
                  ) : (
                    <a
                      href={safeCtaHref}
                      target={isExternalCta ? "_blank" : undefined}
                      rel={isExternalCta ? "noopener noreferrer" : undefined}
                      className="nt-pill-btn nt-pill-btn--cta"
                    >
                      <span>{block.label}</span>
                      {isExternalCta && (
                        <span className="sr-only"> (opens in new tab)</span>
                      )}
                      <span className="nt-pill-btn__circle" aria-hidden="true">
                        <ArrowRightIcon className="nt-pill-btn__arrow nt-pill-btn__arrow--primary h-4 w-4" />
                        <ArrowRightIcon className="nt-pill-btn__arrow nt-pill-btn__arrow--secondary h-4 w-4" />
                      </span>
                    </a>
                  )}
                </div>
              </aside>
            );
          }

          case "faq":
            return <BlogFaqAccordionBlock key={index} items={block.items} />;
        }
      })}
    </div>
  );
}
