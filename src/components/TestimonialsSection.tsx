import { BRAND_FACTS, TESTIMONIALS } from "@/data/catalog";

export function TestimonialsSection() {
  return (
    <section
      id="reviews"
      aria-labelledby="reviews-heading"
      className="border-t border-[var(--border-subtle)] bg-[var(--bg-subtle)] py-[var(--section-py)]"
    >
      <div className="site-container">
        <div className="max-w-3xl">
          <p className="ui-eyebrow text-[var(--accent-text)]">
            Verified US B2B Partners
          </p>
          <h2
            id="reviews-heading"
            className="display-h2 mt-3 text-[var(--text-primary)]"
          >
            Trusted by {BRAND_FACTS.businessesServed} Sign Shops &amp;
            Commercial Owners
          </h2>
          <p className="mt-3 text-[length:var(--text-2xl)] leading-relaxed text-[var(--text-secondary)]">
            Why regional sign companies, national hospitality groups, and medical
            clinics rely on BASISSIGN for inspector-ready fabrication and
            damage-free crating.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <article
              key={item.id}
              className="flex flex-col justify-between rounded-[var(--radius-xs)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-6 sm:p-8"
            >
              <div>
                <div className="inline-flex rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-3 py-1 text-[length:var(--text-md)] font-medium text-[var(--text-secondary)]">
                  {item.productUsed}
                </div>

                <blockquote className="m-0 mt-5 text-[length:var(--text-2xl)] leading-relaxed text-[var(--text-primary)]">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
              </div>

              <footer className="mt-6 border-t border-[var(--border-subtle)] pt-4">
                <div className="text-[length:var(--text-2xl)] font-semibold text-[var(--text-primary)]">
                  {item.author}
                </div>
                <div className="mt-0.5 text-[length:var(--text-lg)] text-[var(--text-secondary)]">
                  {item.role} · {item.companyType}
                </div>
                <div className="mt-1 text-[length:var(--text-md)] font-medium text-[var(--text-muted-theme)]">
                  {item.location}
                </div>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
