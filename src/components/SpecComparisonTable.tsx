import Link from "next/link";
import { PRODUCT_CATALOG, SPEC_COMPARISON_ROWS } from "@/data/catalog";
import { ArrowRightIcon, ProductServiceIcon } from "./Icons";

function getQuoteTypeForSlug(slug: string): string {
  return PRODUCT_CATALOG.find((item) => item.slug === slug)?.quoteTypeId ?? "front-lit";
}

export function SpecComparisonTable() {
  return (
    <section
      id="specs-comparison"
      aria-labelledby="specs-comparison-heading"
      className="border-t border-[var(--border-subtle)] bg-[var(--bg-subtle)] py-[var(--section-py)]"
    >
      <div className="site-container">
        <div className="max-w-3xl">
          <p className="ui-eyebrow text-[var(--accent-text)]">
            Engineering Specification Matrix
          </p>
          <h2
            id="specs-comparison-heading"
            className="display-h2 mt-3 text-[var(--text-primary)]"
          >
            Compare Commercial Signage Systems
          </h2>
          <p className="mt-3 text-[length:var(--text-2xl)] leading-relaxed text-[var(--text-secondary)]">
            Side-by-side fabrication tolerances, UL 48 certification coverage,
            minimum stroke dimensions, and factory turnaround times for commercial
            specifiers and sign shops.
          </p>
        </div>

        {/* Keyboard-Accessible Horizontal Scroll Container */}
        <div
          role="region"
          aria-label="Channel letter and signage specification comparison table"
          tabIndex={0}
          className="mt-8 overflow-x-auto rounded-[var(--radius-xs)] border border-[var(--border-strong)] bg-[var(--bg-elevated)] shadow-sm"
        >
          <table className="w-full min-w-[820px] border-collapse text-left">
            <thead>
              <tr className="surface-dark">
                <th
                  scope="col"
                  className="px-5 py-4 text-[length:var(--text-lg)] font-semibold uppercase tracking-[0.06em] text-[var(--local-fg)]"
                >
                  Sign System
                </th>
                <th
                  scope="col"
                  className="px-5 py-4 text-[length:var(--text-lg)] font-semibold uppercase tracking-[0.06em] text-[var(--local-fg)]"
                >
                  UL / Code Status
                </th>
                <th
                  scope="col"
                  className="px-5 py-4 text-[length:var(--text-lg)] font-semibold uppercase tracking-[0.06em] text-[var(--local-fg)]"
                >
                  Illumination Style
                </th>
                <th
                  scope="col"
                  className="px-5 py-4 text-[length:var(--text-lg)] font-semibold uppercase tracking-[0.06em] text-[var(--local-fg)]"
                >
                  Min Size / Stroke
                </th>
                <th
                  scope="col"
                  className="px-5 py-4 text-[length:var(--text-lg)] font-semibold uppercase tracking-[0.06em] text-[var(--local-fg)]"
                >
                  Lead Time
                </th>
                <th
                  scope="col"
                  className="px-5 py-4 text-[length:var(--text-lg)] font-semibold uppercase tracking-[0.06em] text-[var(--local-fg)]"
                >
                  Ideal Use Case
                </th>
                <th
                  scope="col"
                  className="px-5 py-4 text-right text-[length:var(--text-lg)] font-semibold uppercase tracking-[0.06em] text-[var(--local-fg)]"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {SPEC_COMPARISON_ROWS.map((row) => {
                const quoteType = getQuoteTypeForSlug(row.slug);
                return (
                  <tr
                    key={row.slug}
                    className="border-t border-[var(--border-subtle)] transition-colors duration-[var(--dur-fast)] hover:bg-[var(--bg-subtle)]"
                  >
                    <th scope="row" className="px-5 py-4 font-semibold">
                      <Link
                        href={`/products/${row.slug}`}
                        className="group inline-flex items-center gap-2.5 text-[length:var(--text-2xl)] text-[var(--text-primary)] no-underline transition-colors hover:text-[var(--accent-text)]"
                      >
                        <span
                          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--accent-text)] transition-colors group-hover:border-[var(--accent-cta)]"
                          aria-hidden="true"
                        >
                          <ProductServiceIcon iconKey={row.iconKey} className="h-4 w-4" />
                        </span>
                        <span className="underline decoration-[var(--border-strong)] underline-offset-4 group-hover:decoration-[var(--accent-text)]">
                          {row.product}
                        </span>
                      </Link>
                    </th>
                    <td className="px-5 py-4 text-[length:var(--text-xl)] font-medium text-[var(--text-primary)]">
                      {row.ul48Certified}
                    </td>
                    <td className="px-5 py-4 text-[length:var(--text-xl)] text-[var(--text-secondary)]">
                      {row.illumination}
                    </td>
                    <td className="px-5 py-4 text-[length:var(--text-xl)] text-[var(--text-secondary)]">
                      {row.minHeight}
                    </td>
                    <td className="px-5 py-4 text-[length:var(--text-xl)] font-medium text-[var(--text-primary)]">
                      {row.leadTime}
                    </td>
                    <td className="px-5 py-4 text-[length:var(--text-xl)] text-[var(--text-secondary)]">
                      {row.bestUseCase}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/quote?type=${quoteType}`}
                        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-[var(--radius-lg)] border border-[var(--border-strong)] bg-[var(--bg-page)] px-4 py-1.5 text-[length:var(--text-lg)] font-medium text-[var(--text-primary)] no-underline transition-colors duration-[var(--dur-fast)] hover:border-[var(--accent-cta)] hover:bg-[var(--accent-cta)] hover:text-[var(--surface-white)] active:scale-[0.98]"
                      >
                        <span>Quote</span>
                        <ArrowRightIcon className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
