import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import {
  ClockIcon,
  MailIcon,
  MapPinIcon,
  MessageSquareIcon,
  PhoneIcon,
  ShieldCheckIcon,
  TruckIcon,
} from "@/components/Icons";
import { JsonLd } from "@/components/JsonLd";
import { PillButton } from "@/components/PillButton";
import { BRAND_FACTS } from "@/data/catalog";

export const metadata: Metadata = {
  title: "Contact Engineering & Wholesale Desk",
  description:
    "Contact BASISSIGN (Basis Sign LLC) directly for UL 48 (#E555259) custom channel letter quotes, sign shop trade partnerships, NEC 600 permit packets, and crated freight support.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact BASISSIGN | Factory-Direct Signage Engineering",
    description:
      "Call +1 (912) 304-4034 or email support@basissign.com for UL 48 commercial signage quotes, wholesale blind shipping, and permit documentation.",
    url: `${BRAND_FACTS.domain}/contact`,
  },
};

export default function ContactPage() {
  const contactPageLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact BASISSIGN Engineering & Trade Partner Desk",
    url: `${BRAND_FACTS.domain}/contact`,
    description:
      "Direct B2B communication channel for BASISSIGN UL Standard 48 (#E555259) commercial channel letter manufacturing and wholesale sign shop support.",
    mainEntity: {
      "@type": "Organization",
      name: BRAND_FACTS.legalName,
      url: BRAND_FACTS.domain,
      telephone: BRAND_FACTS.phone,
      email: BRAND_FACTS.email,
      areaServed: {
        "@type": "Country",
        name: "United States",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: BRAND_FACTS.phone,
        email: BRAND_FACTS.email,
        contactType: "sales and technical engineering",
        areaServed: "US",
        availableLanguage: "English",
      },
    },
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
        name: "Contact",
        item: `${BRAND_FACTS.domain}/contact`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={contactPageLd} />
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
                Contact
              </li>
            </ol>
          </nav>

          {/* Two-Column Editorial Contact Layout */}
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
            {/* Left Column: Factory Contact Info & Trade Program Details */}
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-2 rounded-[var(--radius-lg)] border border-[var(--border-strong)] bg-[var(--bg-elevated)] px-3.5 py-1.5 text-[length:var(--text-md)] font-semibold uppercase tracking-[0.06em] text-[var(--accent-text)]">
                <MessageSquareIcon className="h-4 w-4" />
                <span>24-Hour Engineering SLA</span>
              </div>

              <h1 className="display-h2 mt-4 text-[var(--text-primary)]">
                Talk Directly With Our Fabrication Engineers
              </h1>

              <p className="mt-3 text-[length:var(--text-2xl)] leading-relaxed text-[var(--text-secondary)]">
                Whether you are specifying custom UL 48 channel letters for a
                single storefront or setting up blind white-label trade pricing
                for your sign shop, our US engineering team responds within one
                business day.
              </p>

              {/* Direct Contact Cards */}
              <div className="mt-7 flex flex-col gap-3.5">
                <a
                  href={BRAND_FACTS.phoneHref}
                  className="group flex items-start gap-4 rounded-[22px] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-5 no-underline transition-colors hover:border-[var(--accent-cta)]"
                >
                  <span
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[var(--bg-subtle)] text-[var(--accent-text)]"
                    aria-hidden="true"
                  >
                    <PhoneIcon className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="ui-eyebrow text-[var(--text-muted-theme)]">
                      Phone — Direct US Sales &amp; Engineering
                    </div>
                    <div className="mt-1 text-[length:var(--text-4xl)] font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-text)]">
                      {BRAND_FACTS.phone}
                    </div>
                    <div className="mt-0.5 text-[length:var(--text-lg)] text-[var(--text-secondary)]">
                      Mon–Fri, 8:00 AM – 6:00 PM EST
                    </div>
                  </div>
                </a>

                <a
                  href={`mailto:${BRAND_FACTS.email}`}
                  className="group flex items-start gap-4 rounded-[22px] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-5 no-underline transition-colors hover:border-[var(--accent-cta)]"
                >
                  <span
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[var(--bg-subtle)] text-[var(--accent-text)]"
                    aria-hidden="true"
                  >
                    <MailIcon className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="ui-eyebrow text-[var(--text-muted-theme)]">
                      Email — Art Files &amp; Engineering
                    </div>
                    <div className="mt-1 text-[length:var(--text-4xl)] font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-text)]">
                      {BRAND_FACTS.email}
                    </div>
                    <div className="mt-0.5 text-[length:var(--text-lg)] text-[var(--text-secondary)]">
                      Send .ai, .eps, .pdf, or storefront dimensions
                    </div>
                  </div>
                </a>
              </div>

              {/* Engineering Specifications & Trade Callout */}
              <div className="mt-6 rounded-[24px] border border-[var(--border-strong)] bg-[var(--bg-subtle)] p-6">
                <h2 className="display-h3 m-0 text-[var(--text-primary)]">
                  Factory Standards &amp; Logistics
                </h2>
                <ul className="m-0 mt-4 flex list-none flex-col gap-3 p-0 text-[length:var(--text-xl)] text-[var(--text-secondary)]">
                  <li className="flex items-start gap-2.5">
                    <ShieldCheckIcon className="mt-1 h-4 w-4 shrink-0 text-[var(--accent-text)]" />
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        UL 48 Listed File #{BRAND_FACTS.ulFileNumber}:
                      </strong>{" "}
                      Inspector-ready labeling &amp; NEC Article 600 disconnects.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <ClockIcon className="mt-1 h-4 w-4 shrink-0 text-[var(--accent-text)]" />
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        {BRAND_FACTS.leadTimeDays} Production:
                      </strong>{" "}
                      Fast factory turnaround with complimentary 24h 3D mockups.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <TruckIcon className="mt-1 h-4 w-4 shrink-0 text-[var(--accent-text)]" />
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        Blind White-Label Crating:
                      </strong>{" "}
                      Custom foam-in-place freight across all 50 states (
                      {BRAND_FACTS.freightDamageRate} damage rate).
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <MapPinIcon className="mt-1 h-4 w-4 shrink-0 text-[var(--accent-text)]" />
                    <span>
                      <strong className="text-[var(--text-primary)]">
                        Service Territory:
                      </strong>{" "}
                      Nationwide US &amp; North American Commercial Delivery.
                    </span>
                  </li>
                </ul>

                <div className="mt-6 border-t border-[var(--border-subtle)] pt-5">
                  <p className="mb-3 text-[length:var(--text-lg)] text-[var(--text-secondary)]">
                    Need to upload vector artwork or select dimensions &amp;
                    Kelvin options for a formal quote?
                  </p>
                  <PillButton href="/quote" variant="ghost">
                    Use the 5-Step Quote Configurator
                  </PillButton>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Validated Inquiry Form */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
