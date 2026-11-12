import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaqAccordion } from "@/components/FaqAccordion";
import {
  ArrowRightIcon,
  CheckIcon,
  LayersIcon,
  PhoneIcon,
  ProductServiceIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "@/components/Icons";
import { JsonLd } from "@/components/JsonLd";
import { PillButton } from "@/components/PillButton";
import { ProductPreviewFrame } from "@/components/ProductPreviewFrame";
import {
  ProductQuoteProvider,
  ProductQuoteTrigger,
} from "@/components/ProductQuoteModal";
import { ShortQueryForm } from "@/components/ShortQueryForm";
import { BRAND_FACTS, PRODUCT_CATALOG, getProductBySlug } from "@/data/catalog";
import { PORTFOLIO_ITEMS } from "@/data/portfolio";

export const dynamicParams = false;

export async function generateStaticParams() {
  return PRODUCT_CATALOG.map((item) => ({
    slug: item.slug,
  }));
}

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: product.seoTitle,
    description: product.seoDescription,
    alternates: {
      canonical: `/products/${product.slug}`,
    },
    openGraph: {
      title: product.seoTitle,
      description: product.seoDescription,
      url: `${BRAND_FACTS.domain}/products/${product.slug}`,
      images: [
        {
          url: product.image,
          width: 1200,
          height: 750,
          alt: product.imageAlt,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = PRODUCT_CATALOG.filter(
    (item) => item.slug !== product.slug
  );

  const portfolioMatches = product.portfolioCategoryId
    ? PORTFOLIO_ITEMS.filter(
        (item) => item.categoryId === product.portfolioCategoryId
      ).slice(0, 6)
    : [];

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    category: product.category,
    description: product.seoDescription,
    image: `${BRAND_FACTS.domain}${product.image}`,
    url: `${BRAND_FACTS.domain}/products/${product.slug}`,
    brand: {
      "@type": "Brand",
      name: BRAND_FACTS.name,
    },
    manufacturer: {
      "@type": "Organization",
      name: BRAND_FACTS.legalName,
      url: BRAND_FACTS.domain,
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "UL Certification",
        value: `UL 48 File #${BRAND_FACTS.ulFileNumber}`,
      },
      {
        "@type": "PropertyValue",
        name: "Production Lead Time",
        value: product.leadTime,
      },
      {
        "@type": "PropertyValue",
        name: "Face Material",
        value: product.faceMaterial,
      },
      {
        "@type": "PropertyValue",
        name: "Return Material",
        value: product.returnMaterial,
      },
      {
        "@type": "PropertyValue",
        name: "Return / Cabinet Depth",
        value: product.depthRange,
      },
      {
        "@type": "PropertyValue",
        name: "Warranty",
        value: product.warranty,
      },
    ],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: product.faqs.map((f) => ({
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
        name: "Sign Systems",
        item: `${BRAND_FACTS.domain}/#products`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.shortName,
        item: `${BRAND_FACTS.domain}/products/${product.slug}`,
      },
    ],
  };

  const specRows = [
    { label: "Category", value: product.category },
    {
      label: "UL Certification",
      value: `UL 48 Listed (#${BRAND_FACTS.ulFileNumber}) & NEC 600`,
    },
    { label: "Factory Lead Time", value: product.leadTime },
    { label: "Factory Warranty", value: product.warranty },
    { label: "Minimum Stroke", value: product.minStroke },
    { label: "Return / Cabinet Depth", value: product.depthRange },
    { label: "Face Material", value: product.faceMaterial },
    { label: "Return / Shell Material", value: product.returnMaterial },
    { label: "Illumination", value: product.illuminationStyle },
    { label: "Ingress / Rating", value: product.ipRating },
  ];

  return (
    <ProductQuoteProvider
      defaultQuoteTypeId={product.quoteTypeId}
      defaultProductName={product.shortName}
      defaultPlacement={`product-modal:${product.slug}`}
    >
      <JsonLd data={productLd} />
      <JsonLd data={faqLd} />
      <JsonLd data={breadcrumbLd} />

      {/* 1. Hero Section */}
      <section className="py-10 sm:py-16">
        <div className="site-container">
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
              <li>
                <Link
                  href="/#products"
                  className="text-[var(--text-secondary)] no-underline hover:text-[var(--accent-text)]"
                >
                  Sign Systems
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li
                aria-current="page"
                className="font-medium text-[var(--text-primary)]"
              >
                {product.shortName}
              </li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            <div className="min-w-0 lg:col-span-6">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-2 rounded-[var(--radius-lg)] border border-[var(--border-strong)] bg-[var(--bg-elevated)] px-3.5 py-1 text-[length:var(--text-md)] font-semibold tracking-[0.06em] text-[var(--text-primary)]">
                  <ProductServiceIcon
                    iconKey={product.iconKey}
                    className="h-3.5 w-3.5 text-[var(--accent-text)]"
                  />
                  <span>{product.chapterCode}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-1 text-[length:var(--text-md)] font-medium text-[var(--text-secondary)]">
                  <ShieldCheckIcon className="h-3.5 w-3.5 text-[var(--accent-text)]" />
                  <span>UL 48 #{BRAND_FACTS.ulFileNumber} Listed</span>
                </span>
              </div>

              <h1 className="display-h2 mt-4 text-[var(--text-primary)]">
                {product.name}
              </h1>

              <p className="mt-2 text-[length:var(--text-4xl)] font-medium text-[var(--accent-text)]">
                {product.tagline}
              </p>

              <p className="mt-4 text-[length:var(--text-3xl)] leading-relaxed text-[var(--text-primary)]">
                {product.answerFirstSummary}
              </p>

              <p className="mt-3 text-[length:var(--text-2xl)] leading-relaxed text-[var(--text-secondary)]">
                {product.description}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <ProductQuoteTrigger
                  quoteTypeId={product.quoteTypeId}
                  productName={product.shortName}
                  placement={`product-hero:${product.slug}`}
                  variant="cta"
                >
                  Request a Quote
                </ProductQuoteTrigger>
                <PillButton href="/ul-48-compliance" variant="ghost">
                  UL 48 Compliance Specs
                </PillButton>
              </div>
            </div>

            <div className="min-w-0 lg:col-span-6">
              <ProductPreviewFrame
                productName={product.name}
                shortName={product.shortName}
                supportsDayNight={product.supportsDayNightPreview}
                gallery={product.gallery}
                video={product.video}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Product Overview & How It Works */}
      <section
        id="overview"
        aria-labelledby="overview-heading"
        className="border-t border-[var(--border-subtle)] bg-[var(--bg-subtle)] py-[var(--section-py)]"
      >
        <div className="site-container">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="min-w-0 lg:col-span-5">
              <p className="ui-eyebrow text-[var(--accent-text)]">
                02 / Product Overview
              </p>
              <h2
                id="overview-heading"
                className="display-h2 mt-2 text-[var(--text-primary)]"
              >
                {product.overviewHeading}
              </h2>
            </div>

            <div className="flex min-w-0 flex-col gap-4 lg:col-span-7">
              {product.overviewParagraphs.map((para, idx) => (
                <p
                  key={idx}
                  className="m-0 text-[length:var(--text-3xl)] leading-relaxed text-[var(--text-secondary)]"
                >
                  {para}
                </p>
              ))}
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            {product.howItWorksSteps.map((step) => (
              <article
                key={step.step}
                className="flex min-w-0 flex-col justify-between rounded-[24px] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-6"
              >
                <div>
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent-cta)] text-[length:var(--text-md)] font-semibold text-[var(--surface-white)]">
                    {step.step}
                  </span>
                  <h3 className="mt-4 text-[length:var(--text-4xl)] font-semibold leading-snug text-[var(--text-primary)]">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 text-[length:var(--text-2xl)] leading-relaxed text-[var(--text-secondary)]">
                    {step.detail}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Key Features & Benefits */}
      <section
        id="features"
        aria-labelledby="features-heading"
        className="border-t border-[var(--border-subtle)] py-[var(--section-py)]"
      >
        <div className="site-container">
          <div className="max-w-3xl">
            <p className="ui-eyebrow text-[var(--accent-text)]">
              03 / Key Features &amp; Benefits
            </p>
            <h2
              id="features-heading"
              className="display-h2 mt-2 text-[var(--text-primary)]"
            >
              Why Specifiers Choose {product.shortName}
            </h2>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
            {product.keyFeatures.map((feat) => (
              <article
                key={feat.title}
                className="flex min-w-0 items-start gap-4 rounded-[24px] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-6 sm:p-7"
              >
                <span
                  aria-hidden="true"
                  className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border border-[var(--border-strong)] bg-[var(--bg-page)] text-[var(--accent-text)]"
                >
                  <SparklesIcon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <h3 className="m-0 text-[length:var(--text-4xl)] font-semibold leading-snug text-[var(--text-primary)]">
                    {feat.title}
                  </h3>
                  <p className="mt-2 m-0 text-[length:var(--text-2xl)] leading-relaxed text-[var(--text-secondary)]">
                    {feat.benefit}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Materials & Construction */}
      <section
        id="materials"
        aria-labelledby="materials-heading"
        className="border-t border-[var(--border-subtle)] bg-[var(--bg-subtle)] py-[var(--section-py)]"
      >
        <div className="site-container">
          <div className="max-w-3xl">
            <p className="ui-eyebrow text-[var(--accent-text)]">
              04 / Materials &amp; Construction
            </p>
            <h2
              id="materials-heading"
              className="display-h2 mt-2 text-[var(--text-primary)]"
            >
              Fabrication Materials, Coatings &amp; Deliverables
            </h2>
          </div>

          <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {product.materialsBreakdown.map((item) => (
              <div
                key={item.component}
                className="min-w-0 rounded-[22px] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-6"
              >
                <dt className="flex items-center gap-2 text-[length:var(--text-md)] font-semibold uppercase tracking-[0.08em] text-[var(--accent-text)]">
                  <LayersIcon className="h-4 w-4 shrink-0" />
                  <span>{item.component}</span>
                </dt>
                <dd className="m-0 mt-2.5 text-[length:var(--text-2xl)] leading-relaxed text-[var(--text-primary)]">
                  {item.spec}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="min-w-0 rounded-[var(--radius-xs)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-6 sm:p-8">
              <h3 className="display-h3 m-0 text-[var(--text-primary)]">
                Finishing &amp; Coating Options
              </h3>
              <ul className="m-0 mt-4 flex list-none flex-col gap-2.5 p-0 text-[length:var(--text-2xl)] text-[var(--text-secondary)]">
                {product.finishingOptions.map((opt) => (
                  <li key={opt} className="flex items-start gap-2.5">
                    <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-[var(--accent-text)]" />
                    <span>{opt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="min-w-0 rounded-[var(--radius-xs)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-6 sm:p-8">
              <h3 className="display-h3 m-0 text-[var(--text-primary)]">
                Included Inside Every Crated Order
              </h3>
              <ul className="m-0 mt-4 flex list-none flex-col gap-2.5 p-0 text-[length:var(--text-2xl)] text-[var(--text-secondary)]">
                {product.deliverables.map((deliv) => (
                  <li key={deliv} className="flex items-start gap-2.5">
                    <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-[var(--accent-text)]" />
                    <span>{deliv}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Technical Specifications */}
      <section
        id="specifications"
        aria-labelledby="eng-specs-heading"
        className="border-t border-[var(--border-subtle)] py-[var(--section-py)]"
      >
        <div className="site-container">
          <p className="ui-eyebrow text-[var(--accent-text)]">
            05 / Architectural &amp; Electrical Tolerances
          </p>
          <h2
            id="eng-specs-heading"
            className="display-h2 mt-2 text-[var(--text-primary)]"
          >
            Technical Specifications
          </h2>

          <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {specRows.map((spec) => (
              <div
                key={spec.label}
                className="min-w-0 rounded-[22px] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-5"
              >
                <dt className="ui-eyebrow text-[var(--text-muted-theme)]">
                  {spec.label}
                </dt>
                <dd className="m-0 mt-2 text-[length:var(--text-2xl)] font-medium leading-snug text-[var(--text-primary)]">
                  {spec.value}
                </dd>
              </div>
            ))}
          </dl>

          {/* Verified Sizing Range Callout */}
          <div className="mt-5 rounded-[22px] border border-[var(--border-strong)] bg-[var(--bg-subtle)] p-5 sm:p-6">
            <p className="ui-eyebrow m-0 text-[var(--accent-text)]">
              Verified Sizing &amp; Engineering Notes
            </p>
            <p className="m-0 mt-1.5 text-[length:var(--text-2xl)] leading-relaxed text-[var(--text-primary)]">
              {product.sizeRangeNote}
            </p>
          </div>

          {/* Installation & Lighting Swatches */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="min-w-0 rounded-[var(--radius-xs)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-6 sm:p-8">
              <h3 className="display-h3 m-0 text-[var(--text-primary)]">
                Supported Installation Hardware
              </h3>
              <ul className="m-0 mt-4 flex list-none flex-col gap-2.5 p-0 text-[length:var(--text-2xl)] text-[var(--text-primary)]">
                {product.mountingOptions.map((m) => (
                  <li key={m} className="flex items-start gap-2.5">
                    <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-[var(--accent-text)]" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="min-w-0 rounded-[var(--radius-xs)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-6 sm:p-8">
              <h3 className="display-h3 m-0 text-[var(--text-primary)]">
                LED Color Temperatures &amp; Finishes
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {product.kelvinOptions.map((k) => (
                  <span
                    key={k}
                    className="rounded-[var(--radius-lg)] border border-[var(--border-strong)] bg-[var(--bg-page)] px-3.5 py-1.5 text-[length:var(--text-lg)] font-medium text-[var(--text-primary)]"
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Customization Options */}
      <section
        id="customization"
        aria-labelledby="customization-heading"
        className="border-t border-[var(--border-subtle)] bg-[var(--bg-subtle)] py-[var(--section-py)]"
      >
        <div className="site-container">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <p className="ui-eyebrow text-[var(--accent-text)]">
                06 / Customization Options
              </p>
              <h2
                id="customization-heading"
                className="display-h2 mt-2 text-[var(--text-primary)]"
              >
                Tailored to Your Facade, Brand &amp; Sign Criteria
              </h2>
            </div>

            <div className="shrink-0">
              <ProductQuoteTrigger
                quoteTypeId={product.quoteTypeId}
                productName={product.shortName}
                placement={`product-customization:${product.slug}`}
                variant="ghost"
              >
                Request a Quote
              </ProductQuoteTrigger>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
            {product.customizationGroups.map((group) => (
              <article
                key={group.title}
                className="min-w-0 rounded-[24px] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-6 sm:p-7"
              >
                <h3 className="m-0 text-[length:var(--text-4xl)] font-semibold text-[var(--text-primary)]">
                  {group.title}
                </h3>
                <p className="mt-2 text-[length:var(--text-xl)] leading-relaxed text-[var(--text-secondary)]">
                  {group.description}
                </p>
                <ul className="m-0 mt-4 flex list-none flex-col gap-2 p-0 text-[length:var(--text-xl)] text-[var(--text-primary)]">
                  {group.options.map((opt) => (
                    <li key={opt} className="flex items-start gap-2.5">
                      <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-[var(--accent-text)]" />
                      <span>{opt}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Applications */}
      <section
        id="applications"
        aria-labelledby="applications-heading"
        className="border-t border-[var(--border-subtle)] py-[var(--section-py)]"
      >
        <div className="site-container">
          <div className="max-w-3xl">
            <p className="ui-eyebrow text-[var(--accent-text)]">
              07 / Commercial Applications
            </p>
            <h2
              id="applications-heading"
              className="display-h2 mt-2 text-[var(--text-primary)]"
            >
              Environments Built for {product.shortName}
            </h2>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {product.applications.map((app) => (
              <article
                key={app.sector}
                className="min-w-0 rounded-[24px] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-6"
              >
                <p className="ui-eyebrow m-0 text-[var(--accent-text)]">
                  Commercial Vertical
                </p>
                <h3 className="mt-2 text-[length:var(--text-4xl)] font-semibold text-[var(--text-primary)]">
                  {app.sector}
                </h3>
                <p className="mt-2.5 m-0 text-[length:var(--text-2xl)] leading-relaxed text-[var(--text-secondary)]">
                  {app.detail}
                </p>
              </article>
            ))}

            {/* Balanced 6th Tile: Trade & Multi-Site Fulfillment */}
            <article className="flex min-w-0 flex-col justify-between rounded-[24px] border border-[var(--border-strong)] bg-[var(--bg-subtle)] p-6">
              <div>
                <p className="ui-eyebrow m-0 text-[var(--accent-text)]">
                  Custom Engineering Check
                </p>
                <h3 className="mt-2 text-[length:var(--text-4xl)] font-semibold text-[var(--text-primary)]">
                  Have Landlord Criteria or Drawings?
                </h3>
                <p className="mt-2.5 m-0 text-[length:var(--text-2xl)] leading-relaxed text-[var(--text-secondary)]">
                  Send your elevation photos or lease exhibit for a complimentary
                  24-hour 3D Day/Night rendering and {product.shortName} quote.
                </p>
              </div>
              <div className="mt-5">
                <ProductQuoteTrigger
                  quoteTypeId={product.quoteTypeId}
                  productName={product.shortName}
                  placement={`product-applications:${product.slug}`}
                  variant="cta"
                >
                  Get a Quote
                </ProductQuoteTrigger>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* 8. Product Gallery & Verified Installations */}
      <section
        id="gallery"
        aria-labelledby="gallery-heading"
        className="border-t border-[var(--border-subtle)] bg-[var(--bg-subtle)] py-[var(--section-py)]"
      >
        <div className="site-container">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="ui-eyebrow text-[var(--accent-text)]">
                08 / Product Photography &amp; Field Work
              </p>
              <h2
                id="gallery-heading"
                className="display-h2 mt-2 text-[var(--text-primary)]"
              >
                {product.shortName} Gallery
              </h2>
            </div>

            <Link
              href="/portfolio"
              className="group inline-flex min-h-[44px] items-center gap-2 text-[length:var(--text-xl)] font-semibold text-[var(--text-primary)] no-underline hover:text-[var(--accent-text)]"
            >
              <span>Browse Full Commercial Portfolio</span>
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* 3-Angle Uncropped Studio Photography Grid */}
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
            {product.gallery.map((photo) => (
              <figure
                key={photo.id}
                className="m-0 overflow-hidden rounded-[22px] border border-[var(--border-subtle)] bg-[var(--bg-elevated)]"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--surface-black)]">
                  <Image
                    src={photo.onSrc}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="p-4 sm:p-5">
                  <div className="ui-eyebrow text-[var(--accent-text)]">
                    {photo.thumbLabel}
                  </div>
                  <p className="mt-1.5 m-0 text-[length:var(--text-lg)] leading-snug text-[var(--text-secondary)]">
                    {photo.alt}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>

          {/* Verified Portfolio Case Studies or Transparent Gap Notice */}
          <div className="mt-10">
            <h3 className="display-h3 m-0 text-[var(--text-primary)]">
              Verified Field Installations
            </h3>

            {portfolioMatches.length > 0 ? (
              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {portfolioMatches.map((item) => (
                  <Link
                    key={item.id}
                    href="/portfolio"
                    className="group flex flex-col overflow-hidden rounded-[22px] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] no-underline transition-colors hover:border-[var(--accent-cta)]"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--surface-black)]">
                      <Image
                        src={item.image}
                        alt={`${item.title} — ${item.signSpec}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-[var(--dur-normal)] ease-[var(--ease-editorial)] group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                      <div>
                        <span className="ui-eyebrow text-[var(--accent-text)]">
                          {item.industry}
                        </span>
                        <h4 className="mt-1 text-[length:var(--text-3xl)] font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-text)]">
                          {item.title}
                        </h4>
                        <p className="mt-1.5 m-0 text-[length:var(--text-lg)] leading-snug text-[var(--text-secondary)]">
                          {item.signSpec}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-[22px] border border-[var(--border-strong)] bg-[var(--bg-elevated)] p-6">
                <p className="ui-eyebrow m-0 text-[var(--accent-text)]">
                  Verified Portfolio Archive Note
                </p>
                <p className="m-0 mt-2 text-[length:var(--text-2xl)] leading-relaxed text-[var(--text-secondary)]">
                  {product.portfolioGapNote}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 9. Frequently Asked Questions */}
      <FaqAccordion
        id="product-faq"
        items={product.faqs}
        eyebrow="09 / Product Technical FAQ"
        title={`${product.shortName} Questions & Code Answers`}
        subtitle={`Permit, customization, manufacturing lead time, and installation details verified for BASISSIGN ${product.name}.`}
      />

      {/* 10. Final CTA & Short Product Inquiry Form */}
      <section
        id="product-inquiry"
        aria-labelledby="final-cta-heading"
        className="border-t border-[var(--border-subtle)] bg-[var(--bg-subtle)] py-[var(--section-py)]"
      >
        <div className="site-container">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
            <div className="min-w-0 rounded-[var(--radius-xs)] border border-[var(--border-strong)] bg-[var(--bg-elevated)] p-6 sm:p-8 lg:col-span-5">
              <p className="ui-eyebrow m-0 text-[var(--accent-text)]">
                10 / Factory-Direct Inquiry
              </p>
              <h2
                id="final-cta-heading"
                className="display-h2 mt-2 text-[var(--text-primary)]"
              >
                Ready to Price Your {product.shortName}?
              </h2>
              <p className="mt-3 text-[length:var(--text-2xl)] leading-relaxed text-[var(--text-secondary)]">
                Open our quick modal or complete the brief project form alongside
                to get factory-direct UL 48 (#{BRAND_FACTS.ulFileNumber}) pricing
                and a complimentary 3D Day/Night facade proof within 1 business
                day.
              </p>

              <ul className="m-0 mt-6 flex list-none flex-col gap-3 p-0 text-[length:var(--text-xl)] text-[var(--text-primary)]">
                <li className="flex items-start gap-2.5">
                  <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-[var(--accent-text)]" />
                  <span>
                    <strong>UL 48 File #{BRAND_FACTS.ulFileNumber}:</strong>{" "}
                    Inspector-ready labels &amp; NEC 600 disconnects
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-[var(--accent-text)]" />
                  <span>
                    <strong>{product.leadTime} Production:</strong> Ships nationwide
                    with {BRAND_FACTS.freightDamageRate} freight damage rate
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-[var(--accent-text)]" />
                  <span>
                    <strong>{product.warranty}:</strong> Mean Well® Class 2 drivers
                    &amp; IP67 wet-location LEDs
                  </span>
                </li>
              </ul>

              <div className="mt-7 flex flex-wrap items-center gap-4">
                <ProductQuoteTrigger
                  quoteTypeId={product.quoteTypeId}
                  productName={product.shortName}
                  placement={`product-final-cta:${product.slug}`}
                  variant="cta"
                >
                  Request a Quote
                </ProductQuoteTrigger>

                <a
                  href={BRAND_FACTS.phoneHref}
                  className="inline-flex min-h-[44px] items-center gap-2 text-[length:var(--text-xl)] font-semibold text-[var(--text-primary)] no-underline hover:text-[var(--accent-text)]"
                >
                  <PhoneIcon className="h-4 w-4 text-[var(--accent-text)]" />
                  <span>{BRAND_FACTS.phone}</span>
                </a>
              </div>
            </div>

            <div className="min-w-0 lg:col-span-7">
              <ShortQueryForm
                mode="product"
                variant="bottom"
                placement={`product-bottom:${product.slug}`}
                defaultSignType={product.quoteTypeId}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sibling Sign Systems Cross-Navigation */}
      <section className="border-t border-[var(--border-subtle)] py-14">
        <div className="site-container">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="display-h3 m-0 text-[var(--text-primary)]">
              Explore Other Sign Systems
            </h2>
            <ProductQuoteTrigger
              quoteTypeId={product.quoteTypeId}
              productName={product.shortName}
              placement={`product-siblings-bar:${product.slug}`}
              variant="ghost"
            >
              Get a Quote for {product.shortName}
            </ProductQuoteTrigger>
          </div>

          <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-3">
            {relatedProducts.map((rel) => (
              <Link
                key={rel.slug}
                href={`/products/${rel.slug}`}
                className="group flex min-w-0 flex-col justify-between rounded-[22px] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-5 no-underline transition-colors hover:border-[var(--accent-cta)]"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--accent-text)]"
                      aria-hidden="true"
                    >
                      <ProductServiceIcon iconKey={rel.iconKey} className="h-4 w-4" />
                    </span>
                    <span className="ui-eyebrow text-[var(--accent-text)]">
                      {rel.chapterCode}
                    </span>
                  </div>
                  <h3 className="mt-3 text-[length:var(--text-3xl)] font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-text)]">
                    {rel.shortName}
                  </h3>
                  <p className="mt-1.5 text-[length:var(--text-xl)] text-[var(--text-secondary)]">
                    {rel.tagline}
                  </p>
                </div>
                <span className="mt-4 inline-flex min-h-[36px] items-center gap-1.5 text-[length:var(--text-lg)] font-semibold text-[var(--text-primary)]">
                  <span>View Full Specs</span>
                  <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </ProductQuoteProvider>
  );
}
