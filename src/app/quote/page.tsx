import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheckIcon, SparklesIcon, TruckIcon } from "@/components/Icons";
import { JsonLd } from "@/components/JsonLd";
import { QuoteWizard } from "@/components/QuoteWizard";
import { BRAND_FACTS } from "@/data/catalog";

export const metadata: Metadata = {
  title: "Request a Custom Sign Quote & Free 3D Mockup",
  description:
    "Configure custom UL 48 (#E555259) front-lit channel letters, halo-lit signs, dual-lit letters, push-thru light boxes, and double-sided blade signs. Receive factory-direct pricing and a free 3D Day/Night mockup within 24 hours.",
  alternates: {
    canonical: `${BRAND_FACTS.domain}/quote`,
  },
  openGraph: {
    title: "Request a Custom Sign Quote & Free 3D Mockup | BASISSIGN",
    description:
      "5-step B2B wholesale commercial sign quote configurator with blind trade shipping and 24h free 3D Day/Night rendering.",
    url: `${BRAND_FACTS.domain}/quote`,
  },
};

interface QuotePageProps {
  searchParams: Promise<{
    type?: string;
    env?: string;
    trade?: string;
  }>;
}

export default async function QuotePage({ searchParams }: QuotePageProps) {
  const sp = await searchParams;
  const initialTrade = sp.trade === "1" || sp.trade === "true";

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Custom UL 48 Signage Engineering Estimate & Free 3D Day/Night Mockup",
    provider: {
      "@type": "Organization",
      name: BRAND_FACTS.legalName,
      url: BRAND_FACTS.domain,
      telephone: BRAND_FACTS.phone,
    },
    areaServed: "US",
    serviceType: "Custom Commercial Signage Manufacturing & Engineering Proofing",
    description:
      "5-step B2B custom channel letter and commercial signage configurator providing UL 48 File #E555259 specification quotes and scaled 3D Day/Night storefront renderings within 1 business day.",
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
        name: "Request a Quote",
        item: `${BRAND_FACTS.domain}/quote`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={serviceLd} />
      <JsonLd data={breadcrumbLd} />

      <section className="py-10 sm:py-16">
        <div className="site-container">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-5">
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
              <li aria-current="page" className="font-medium text-[var(--text-primary)]">
                Request a Quote
              </li>
            </ol>
          </nav>

          {/* Editorial Intro Header */}
          <div className="mb-10 max-w-3xl">
            <p className="ui-eyebrow text-[var(--accent-text)]">
              24-Hour Engineering SLA · No Obligation
            </p>
            <h1 className="display-h2 mt-3 text-[var(--text-primary)]">
              Request a Custom Sign Quote &amp; Free 3D Mockup
            </h1>
            <p className="mt-3 text-[length:var(--text-3xl)] leading-relaxed text-[var(--text-secondary)]">
              Configure your UL 48 (#{BRAND_FACTS.ulFileNumber}) channel letters,
              dual-lit signs, or blade &amp; push-thru light boxes in under 90
              seconds. Sign shops can enable Blind White-Label Shipping in Step 2.
            </p>

            {/* Quick SLA Badges */}
            <div className="mt-5 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3.5 py-1.5 text-[length:var(--text-lg)] font-medium text-[var(--text-primary)]">
                <SparklesIcon className="h-4 w-4 text-[var(--accent-text)]" />
                Free 3D Day/Night Facade Proof
              </span>
              <span className="inline-flex items-center gap-2 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3.5 py-1.5 text-[length:var(--text-lg)] font-medium text-[var(--text-primary)]">
                <ShieldCheckIcon className="h-4 w-4 text-[var(--accent-text)]" />
                UL 48 File #{BRAND_FACTS.ulFileNumber} Ready
              </span>
              <span className="inline-flex items-center gap-2 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3.5 py-1.5 text-[length:var(--text-lg)] font-medium text-[var(--text-primary)]">
                <TruckIcon className="h-4 w-4 text-[var(--accent-text)]" />
                {BRAND_FACTS.freightDamageRate} Freight Damage Rate
              </span>
            </div>
          </div>

          {/* 5-Step Configurator */}
          <QuoteWizard
            initialType={sp.type}
            initialEnv={sp.env}
            initialTrade={initialTrade}
          />
        </div>
      </section>
    </>
  );
}
