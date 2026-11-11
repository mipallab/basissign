import type { Metadata } from "next";
import Link from "next/link";
import { FaqAccordion } from "@/components/FaqAccordion";
import { CheckIcon, ShieldCheckIcon } from "@/components/Icons";
import { JsonLd } from "@/components/JsonLd";
import { PillButton } from "@/components/PillButton";
import { UlRacewayShowcase } from "@/components/UlRacewayShowcase";
import { BRAND_FACTS } from "@/data/catalog";
import { GLOBAL_FAQS } from "@/data/faqs";

export const metadata: Metadata = {
  title: "UL 48 Certification (#E555259) & NEC Article 600 Compliance",
  description:
    "Authoritative municipal permit and electrical inspection guide for BASISSIGN UL Standard 48 Listed (#E555259) illuminated channel letters, Mean Well Class 2 drivers, and NEC Article 600 disconnects.",
  alternates: {
    canonical: "/ul-48-compliance",
  },
  openGraph: {
    title: "UL 48 Certification (#E555259) & NEC Article 600 Compliance | BASISSIGN",
    description:
      "Inspector-ready UL Standard 48 File #E555259 specifications, NEC 600 disconnect switching, and wet-location construction details.",
    url: `${BRAND_FACTS.domain}/ul-48-compliance`,
  },
};

const AHJ_CHECKLIST = [
  {
    code: "01 / UL 48 FILE #E555259",
    title: "Serialized UL Standard 48 Hologram Labels",
    description:
      "Every BASISSIGN illuminated channel letter set, raceway, and light box carries an official serialized UL 48 label traceable to Basis Sign LLC (UL File #E555259) for Authority Having Jurisdiction (AHJ) verification.",
  },
  {
    code: "02 / NEC ARTICLE 600",
    title: "Factory-Installed Watertight Disconnect Switch",
    description:
      "Raceways and sign cabinets include UL-recognized externally operable disconnect switches per NEC Article 600.6, allowing service technicians to isolate primary power directly at the sign.",
  },
  {
    code: "03 / CLASS 2 POWER",
    title: "Mean Well® IP67 UL Listed Class 2 Drivers",
    description:
      "All low-voltage 12VDC/24VDC LED circuits are driven by Mean Well® Class 2 IP67 waterproof power supplies (120–277VAC universal input) with overload and thermal protection.",
  },
  {
    code: "04 / WET-LOCATION",
    title: "Precision Drain Holes & Silicone Sealing",
    description:
      "Exterior wet-location letters include CNC-punched bottom weep/drain holes, sealed wire pass-through bushings, and UV-resistant neutral-cure silicone baffling.",
  },
  {
    code: "05 / FLAME & METAL",
    title: "0.040\"–0.080\" Marine Aluminum & UL Acrylic",
    description:
      "Housings are fabricated from non-combustible 3003/5052 aluminum or 304/316 stainless steel paired with UL-recognized 3M™ / Acrylite® sign-grade cast acrylic.",
  },
  {
    code: "06 / INSTALL BLUEPRINT",
    title: "1:1 CNC Pattern & Load-Sized Electrical Specs",
    description:
      "Every shipment includes a full-scale 1:1 mounting pattern, amperage/wattage electrical callout table for city permit submittals, and non-corrosive mounting hardware.",
  },
];

export default function UlCompliancePage() {
  const complianceFaqs = GLOBAL_FAQS.filter((f) =>
    ["ul48-certified", "installation-hardware", "warranty"].includes(f.id)
  );

  const techArticleLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline:
      "UL Standard 48 (#E555259) & NEC Article 600 Compliance for Custom Channel Letters",
    description:
      "Engineering and electrical inspection specification for Basis Sign LLC UL 48 listed electric signs.",
    author: {
      "@type": "Organization",
      name: BRAND_FACTS.legalName,
      url: BRAND_FACTS.domain,
    },
    publisher: {
      "@type": "Organization",
      name: BRAND_FACTS.legalName,
      url: BRAND_FACTS.domain,
    },
    mainEntityOfPage: `${BRAND_FACTS.domain}/ul-48-compliance`,
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: complianceFaqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
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
        name: "UL 48 & NEC 600 Compliance",
        item: `${BRAND_FACTS.domain}/ul-48-compliance`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={techArticleLd} />
      <JsonLd data={faqLd} />
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
                UL 48 &amp; NEC 600 Compliance
              </li>
            </ol>
          </nav>

          {/* Header & Answer-First Summary */}
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-2 rounded-[var(--radius-lg)] border border-[var(--border-strong)] bg-[var(--bg-elevated)] px-3.5 py-1.5 text-[length:var(--text-md)] font-semibold uppercase tracking-[0.06em] text-[var(--accent-text)]">
                <ShieldCheckIcon className="h-4 w-4" />
                <span>UL File #{BRAND_FACTS.ulFileNumber} · NEC Article 600</span>
              </div>

              <h1 className="display-h2 mt-4 text-[var(--text-primary)]">
                Inspector-Ready UL 48 &amp; NEC 600 Compliance
              </h1>

              <p className="mt-4 text-[length:var(--text-3xl)] leading-relaxed text-[var(--text-primary)]">
                {BRAND_FACTS.legalName} fabricates illuminated channel letters,
                raceways, and architectural light boxes under{" "}
                <strong>UL Standard 48 (File #{BRAND_FACTS.ulFileNumber})</strong>{" "}
                and <strong>National Electrical Code (NEC) Article 600</strong>
                —ensuring rapid municipal sign permit approval across all 50 US
                states.
              </p>

              <ul className="m-0 mt-5 flex list-none flex-col gap-2.5 p-0 text-[length:var(--text-2xl)] text-[var(--text-secondary)]">
                <li className="flex items-start gap-2.5">
                  <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-[var(--accent-text)]" />
                  <span>
                    Serialized UL 48 hologram applied directly on housing / raceway
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-[var(--accent-text)]" />
                  <span>
                    UL Class 2 {BRAND_FACTS.driverBrand} IP67 drivers (120–277VAC)
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-[var(--accent-text)]" />
                  <span>
                    Permitting spec sheets &amp; amperage schedules supplied before
                    shipping
                  </span>
                </li>
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <PillButton href="/quote" variant="cta">
                  Request Permit-Ready Quote
                </PillButton>
                <PillButton href="/#specs-comparison" variant="ghost">
                  Compare All Sign Specs
                </PillButton>
              </div>
            </div>

            <div className="lg:col-span-6">
              <UlRacewayShowcase />
            </div>
          </div>
        </div>
      </section>

      {/* 6-Point AHJ Inspection Checklist */}
      <section
        aria-labelledby="ahj-checklist-heading"
        className="border-t border-[var(--border-subtle)] bg-[var(--bg-subtle)] py-[var(--section-py)]"
      >
        <div className="site-container">
          <div className="max-w-3xl">
            <p className="ui-eyebrow text-[var(--accent-text)]">
              Authority Having Jurisdiction (AHJ) Verification
            </p>
            <h2
              id="ahj-checklist-heading"
              className="display-h2 mt-3 text-[var(--text-primary)]"
            >
              6-Point Municipal Inspection Checklist
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {AHJ_CHECKLIST.map((item) => (
              <article
                key={item.code}
                className="rounded-[var(--radius-xs)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-6 sm:p-7"
              >
                <span className="ui-eyebrow text-[var(--accent-text)]">
                  {item.code}
                </span>
                <h3 className="display-h3 mt-2 text-[var(--text-primary)]">
                  {item.title}
                </h3>
                <p className="mt-3 text-[length:var(--text-2xl)] leading-relaxed text-[var(--text-secondary)]">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <FaqAccordion
        id="ul-faq"
        items={complianceFaqs}
        eyebrow="Code & Permit FAQ"
        title="Questions From City Inspectors & Installers"
        subtitle={`Direct documentation answers for Basis Sign LLC UL File #${BRAND_FACTS.ulFileNumber}.`}
      />
    </>
  );
}
