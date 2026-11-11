import type { Metadata } from "next";
import Link from "next/link";
import { PortfolioGridIcon, ShieldCheckIcon } from "@/components/Icons";
import { JsonLd } from "@/components/JsonLd";
import { PillButton } from "@/components/PillButton";
import { PortfolioGallery } from "@/components/PortfolioGallery";
import { BRAND_FACTS } from "@/data/catalog";
import { PORTFOLIO_ITEMS } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Commercial Signage Portfolio | 35 Completed US Installations",
  description:
    "Browse 35 completed BASISSIGN UL 48 channel letter, halo-lit, double-sided blade, silicone LED flex neon, and dimensional metal installations across US restaurants, clinics, plazas, and hotels.",
  alternates: {
    canonical: "/portfolio",
  },
  openGraph: {
    title: "Commercial Signage Portfolio | BASISSIGN",
    description:
      "35 architectural sign installations manufactured factory-direct by Basis Sign LLC (UL 48 #E555259). Filter by illumination style and inspect fabrication quality.",
    url: `${BRAND_FACTS.domain}/portfolio`,
    images: [
      {
        url: "/images/portfolio/choices-markets-roof-truss.webp",
        width: 1200,
        height: 900,
        alt: "BASISSIGN Completed UL 48 Commercial Signage Portfolio",
      },
    ],
  },
};

export default function PortfolioPage() {
  const collectionLd = {
    "@context": "https://schema.org",
    "@type": ["CollectionPage", "ImageGallery"],
    name: "BASISSIGN Commercial Signage Installation Portfolio",
    description:
      "35 verified custom channel letter, halo-lit, blade cabinet, silicone LED flex neon, and architectural dimensional metal projects fabricated by Basis Sign LLC.",
    url: `${BRAND_FACTS.domain}/portfolio`,
    about: {
      "@type": "Organization",
      name: BRAND_FACTS.legalName,
      url: BRAND_FACTS.domain,
    },
    associatedMedia: PORTFOLIO_ITEMS.map((item) => ({
      "@type": "ImageObject",
      name: `${item.title} — ${item.categoryLabel}`,
      caption: item.signSpec,
      contentUrl: `${BRAND_FACTS.domain}${item.image}`,
    })),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BRAND_FACTS.domain,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Portfolio",
        item: `${BRAND_FACTS.domain}/portfolio`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={collectionLd} />
      <JsonLd data={breadcrumbLd} />

      <section className="py-10 sm:py-16">
        <div className="site-container">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0 text-[length:var(--text-lg)] text-[var(--text-muted-theme)]">
              <li>
                <Link
                  href="/"
                  className="text-[var(--text-secondary)] no-underline hover:text-[var(--accent-text)]"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li
                aria-current="page"
                className="font-medium text-[var(--text-primary)]"
              >
                Portfolio
              </li>
            </ol>
          </nav>

          {/* Editorial Intro Header */}
          <div className="flex flex-col justify-between gap-6 border-b border-[var(--border-subtle)] pb-8 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-2 rounded-[var(--radius-lg)] border border-[var(--border-strong)] bg-[var(--bg-elevated)] px-3.5 py-1 text-[length:var(--text-md)] font-semibold uppercase tracking-[0.06em] text-[var(--accent-text)]">
                  <PortfolioGridIcon className="h-3.5 w-3.5" />
                  <span>01–35 / Architectural Installations</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-1 text-[length:var(--text-md)] font-medium text-[var(--text-secondary)]">
                  <ShieldCheckIcon className="h-3.5 w-3.5 text-[var(--accent-text)]" />
                  <span>UL 48 #{BRAND_FACTS.ulFileNumber} Factory Quality</span>
                </span>
              </div>

              <h1 className="display-h2 mt-4 text-[var(--text-primary)]">
                Built Across North America. Verified in the Field.
              </h1>

              <p className="mt-3 text-[length:var(--text-2xl)] leading-relaxed text-[var(--text-secondary)]">
                Inspect finished BASISSIGN channel letters, reverse halo
                monograms, projecting blade cabinets, optical silicone LED flex
                neon, and dimensional metal lobby installations delivered for
                franchises, restaurants, medical centers, and US trade sign
                partners.
              </p>
            </div>

            <div className="shrink-0">
              <PillButton href="/quote" variant="cta">
                Quote a Similar Sign
              </PillButton>
            </div>
          </div>

          <div className="mt-8">
            <PortfolioGallery />
          </div>
        </div>
      </section>
    </>
  );
}
