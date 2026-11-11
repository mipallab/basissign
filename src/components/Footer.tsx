import Image from "next/image";
import Link from "next/link";
import { BLOG_POST_COUNT } from "@/data/blog-shared";
import { BRAND_FACTS, PRODUCT_CATALOG } from "@/data/catalog";
import {
  MailIcon,
  PhoneIcon,
  ProductServiceIcon,
  ShieldCheckIcon,
  TruckIcon,
} from "./Icons";
import { PillButton } from "./PillButton";

export function Footer() {
  return (
    <footer className="surface-dark border-t border-[var(--local-border)]">
      <div className="site-container py-14 sm:py-20">
        {/* Architectural Pre-Footer Callout */}
        <div
          className="mb-14 flex flex-col items-start justify-between gap-6 rounded-[var(--radius-xs)] border p-6 sm:flex-row sm:items-center sm:p-10"
          style={{
            backgroundColor: "var(--local-elevated)",
            borderColor: "var(--local-border)",
          }}
        >
          <div className="max-w-2xl">
            <p className="ui-eyebrow text-[var(--accent-text)]">
              24-Hour Engineering SLA
            </p>
            <h2 className="display-h3 mt-2 text-[var(--local-fg)]">
              Ready for a factory-direct quote &amp; scaled 3D Day/Night facade proof?
            </h2>
            <p className="mt-2 text-[length:var(--text-2xl)] text-[var(--local-fg-muted)]">
              Send your sign copy or storefront photo. Receive UL 48 (#E555259) pricing,
              power specs, and a complimentary 3D rendering within 1 business day.
            </p>
          </div>
          <div className="shrink-0">
            <PillButton href="/quote" variant="light-on-dark">
              Request a Quote
            </PillButton>
          </div>
        </div>

        {/* 4-Column Architectural Directory */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div>
            <Link
              href="/"
              aria-label="BASISSIGN — Home"
              className="inline-flex items-center no-underline transition-opacity hover:opacity-85"
            >
              <span className="sr-only">{BRAND_FACTS.name}</span>
              <Image
                src="/brand/basissign-logo-dark.svg"
                alt=""
                aria-hidden="true"
                width={192}
                height={90}
                unoptimized
                className="h-11 w-auto"
              />
            </Link>

            <p className="mt-4 text-[length:var(--text-xl)] leading-relaxed text-[var(--local-fg-muted)]">
              Wholesale-grade custom architectural signage and UL 48 listed LED channel
              letters built for US sign shops, contractors, and multi-location brands.
            </p>

            <div className="mt-5 flex flex-col gap-2.5 text-[length:var(--text-xl)]">
              <a
                href={BRAND_FACTS.phoneHref}
                className="inline-flex items-center gap-2 text-[var(--local-fg)] no-underline transition-colors hover:text-[var(--accent-text)]"
              >
                <PhoneIcon className="h-4 w-4 text-[var(--accent-text)]" />
                <span>{BRAND_FACTS.phone}</span>
              </a>
              <a
                href={`mailto:${BRAND_FACTS.email}`}
                className="inline-flex items-center gap-2 text-[var(--local-fg)] no-underline transition-colors hover:text-[var(--accent-text)]"
              >
                <MailIcon className="h-4 w-4 text-[var(--accent-text)]" />
                <span>{BRAND_FACTS.email}</span>
              </a>
            </div>
          </div>

          {/* Product Catalog Links */}
          <div>
            <h3 className="ui-eyebrow text-[var(--local-fg)]">Sign Systems</h3>
            <ul className="m-0 mt-4 flex list-none flex-col gap-2.5 p-0">
              {PRODUCT_CATALOG.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/products/${item.slug}`}
                    className="group inline-flex min-h-[32px] items-center gap-2 text-[length:var(--text-xl)] text-[var(--local-fg-muted)] no-underline transition-colors hover:text-[var(--local-fg)]"
                  >
                    <ProductServiceIcon
                      iconKey={item.iconKey}
                      className="h-4 w-4 shrink-0 text-[var(--accent-text)] transition-transform group-hover:scale-105"
                    />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Engineering & Agentic SEO Resources */}
          <div>
            <h3 className="ui-eyebrow text-[var(--local-fg)]">
              Engineering &amp; Specs
            </h3>
            <ul className="m-0 mt-4 flex list-none flex-col gap-2.5 p-0">
              <li>
                <Link
                  href="/portfolio"
                  className="inline-flex min-h-[32px] items-center text-[length:var(--text-xl)] text-[var(--local-fg-muted)] no-underline transition-colors hover:text-[var(--local-fg)]"
                >
                  Our Portfolio (35 Projects)
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="inline-flex min-h-[32px] items-center text-[length:var(--text-xl)] text-[var(--local-fg-muted)] no-underline transition-colors hover:text-[var(--local-fg)]"
                >
                  Signage Blog &amp; Guides ({BLOG_POST_COUNT})
                </Link>
              </li>
              <li>
                <Link
                  href="/ul-48-compliance"
                  className="inline-flex min-h-[32px] items-center text-[length:var(--text-xl)] text-[var(--local-fg-muted)] no-underline transition-colors hover:text-[var(--local-fg)]"
                >
                  UL 48 (#E555259) &amp; NEC 600
                </Link>
              </li>
              <li>
                <Link
                  href="/quote"
                  className="inline-flex min-h-[32px] items-center text-[length:var(--text-xl)] text-[var(--local-fg-muted)] no-underline transition-colors hover:text-[var(--local-fg)]"
                >
                  5-Step Quote Configurator
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="inline-flex min-h-[32px] items-center text-[length:var(--text-xl)] text-[var(--local-fg-muted)] no-underline transition-colors hover:text-[var(--local-fg)]"
                >
                  Contact Engineering Desk
                </Link>
              </li>
              <li>
                <Link
                  href="/#process"
                  className="inline-flex min-h-[32px] items-center text-[length:var(--text-xl)] text-[var(--local-fg-muted)] no-underline transition-colors hover:text-[var(--local-fg)]"
                >
                  Blind Trade Shipping
                </Link>
              </li>
              <li>
                <Link
                  href="/#faq"
                  className="inline-flex min-h-[32px] items-center text-[length:var(--text-xl)] text-[var(--local-fg-muted)] no-underline transition-colors hover:text-[var(--local-fg)]"
                >
                  Technical FAQ
                </Link>
              </li>
              <li>
                <a
                  href="/llms.txt"
                  className="inline-flex min-h-[32px] items-center text-[length:var(--text-xl)] text-[var(--local-fg-muted)] no-underline transition-colors hover:text-[var(--local-fg)]"
                >
                  AI / Agent Spec Index (/llms.txt)
                </a>
              </li>
              <li>
                <a
                  href="/sitemap.xml"
                  className="inline-flex min-h-[32px] items-center text-[length:var(--text-xl)] text-[var(--local-fg-muted)] no-underline transition-colors hover:text-[var(--local-fg)]"
                >
                  XML Sitemap
                </a>
              </li>
            </ul>
          </div>

          {/* Quality & Compliance Guarantee */}
          <div>
            <h3 className="ui-eyebrow text-[var(--local-fg)]">
              Factory Standards
            </h3>
            <div className="mt-4 flex flex-col gap-3">
              <div
                className="rounded-[20px] border p-4"
                style={{
                  backgroundColor: "var(--local-elevated)",
                  borderColor: "var(--local-border)",
                }}
              >
                <div className="flex items-center gap-2 text-[length:var(--text-xl)] font-semibold text-[var(--local-fg)]">
                  <ShieldCheckIcon className="h-4 w-4 text-[var(--accent-text)]" />
                  <span>UL 48 File #{BRAND_FACTS.ulFileNumber}</span>
                </div>
                <p className="mt-1 text-[length:var(--text-lg)] text-[var(--local-fg-muted)]">
                  {BRAND_FACTS.warrantyYears}-Year Full Electrical &amp; Structural
                  Warranty with {BRAND_FACTS.driverBrand} Class 2 Drivers.
                </p>
              </div>

              <div
                className="rounded-[20px] border p-4"
                style={{
                  backgroundColor: "var(--local-elevated)",
                  borderColor: "var(--local-border)",
                }}
              >
                <div className="flex items-center gap-2 text-[length:var(--text-xl)] font-semibold text-[var(--local-fg)]">
                  <TruckIcon className="h-4 w-4 text-[var(--accent-text)]" />
                  <span>{BRAND_FACTS.freightDamageRate} Freight Damage</span>
                </div>
                <p className="mt-1 text-[length:var(--text-lg)] text-[var(--local-fg-muted)]">
                  Foam-in-place wooden crating across all 50 US states in{" "}
                  {BRAND_FACTS.leadTimeDays}.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Notice */}
        <div
          className="mt-12 flex flex-col justify-between gap-3 border-t pt-6 text-[length:var(--text-md)] text-[var(--local-fg-muted)] sm:flex-row sm:items-center"
          style={{ borderColor: "var(--local-border)" }}
        >
          <p className="m-0">
            &copy; 2026 {BRAND_FACTS.legalName}. All Rights Reserved. | UL 48 Listed File #
            {BRAND_FACTS.ulFileNumber}
          </p>
          <p className="m-0">
            Serving {BRAND_FACTS.businessesServed} US Commercial Storefronts &amp; Sign
            Partners
          </p>
        </div>
      </div>
    </footer>
  );
}
