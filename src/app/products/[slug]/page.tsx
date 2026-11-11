import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaqAccordion } from "@/components/FaqAccordion";
import {
  ArrowRightIcon,
  CheckIcon,
  ProductServiceIcon,
  ShieldCheckIcon,
} from "@/components/Icons";
import { JsonLd } from "@/components/JsonLd";
import { PillButton } from "@/components/PillButton";
import { ProductPreviewFrame } from "@/components/ProductPreviewFrame";
import { BRAND_FACTS, PRODUCT_CATALOG, getProductBySlug } from "@/data/catalog";

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
    title: product.name,
    description: product.answerFirstSummary,
    alternates: {
      canonical: `/products/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} | BASISSIGN`,
      description: product.answerFirstSummary,
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

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    category: product.category,
    description: product.answerFirstSummary,
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
        value: product.ulListed
          ? `UL 48 File #${BRAND_FACTS.ulFileNumber}`
          : "Non-electrical / ADA Code",
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
      label: "Certification",
      value: product.ulListed
        ? `UL 48 Listed (#${BRAND_FACTS.ulFileNumber}) & NEC 600`
        : "ADA / Building Code Compliant",
    },
    { label: "Factory Lead Time", value: product.leadTime },
    { label: "Factory Warranty", value: product.warranty },
    { label: "Minimum Stroke", value: product.minStroke },
    { label: "Return / Shell Depth", value: product.depthRange },
    { label: "Face Material", value: product.faceMaterial },
    { label: "Return Material", value: product.returnMaterial },
    { label: "Illumination", value: product.illuminationStyle },
    { label: "Ingress / Rating", value: product.ipRating },
  ];

  return (
    <>
      <JsonLd data={productLd} />
      <JsonLd data={faqLd} />
      <JsonLd data={breadcrumbLd} />

      {/* Product Architectural Hero */}
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
            {/* Editorial Overview & Direct Quote CTA */}
            <div className="lg:col-span-6">
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
                  <span>
                    {product.ulListed
                      ? `UL 48 #${BRAND_FACTS.ulFileNumber}`
                      : "ADA / Architectural Code"}
                  </span>
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
                <PillButton
                  href={`/quote?type=${product.quoteTypeId}`}
                  variant="cta"
                >
                  Quote {product.shortName}
                </PillButton>
                <PillButton href="/ul-48-compliance" variant="ghost">
                  UL 48 Compliance Specs
                </PillButton>
              </div>
            </div>

            {/* Interactive 3-Photo + Video Gallery Stage */}
            <div className="lg:col-span-6">
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

      {/* Complete Engineering Specification Grid */}
      <section
        aria-labelledby="eng-specs-heading"
        className="border-t border-[var(--border-subtle)] bg-[var(--bg-subtle)] py-[var(--section-py)]"
      >
        <div className="site-container">
          <p className="ui-eyebrow text-[var(--accent-text)]">
            Architectural &amp; Electrical Tolerances
          </p>
          <h2
            id="eng-specs-heading"
            className="display-h2 mt-2 text-[var(--text-primary)]"
          >
            Engineering Specifications
          </h2>

          <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {specRows.map((spec) => (
              <div
                key={spec.label}
                className="rounded-[22px] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-5"
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

          {/* Mounting + Finish Options + Crate Deliverables + Applications */}
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-[var(--radius-xs)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-6 sm:p-8">
              <h3 className="display-h3 text-[var(--text-primary)]">
                Mounting &amp; Kelvin / Finish Options
              </h3>

              <div className="mt-5">
                <p className="ui-eyebrow text-[var(--accent-text)]">
                  Supported Mounting Hardware
                </p>
                <ul className="m-0 mt-2.5 flex list-none flex-col gap-2 p-0 text-[length:var(--text-2xl)] text-[var(--text-primary)]">
                  {product.mountingOptions.map((m) => (
                    <li key={m} className="flex items-start gap-2.5">
                      <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-[var(--accent-text)]" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 border-t border-[var(--border-subtle)] pt-5">
                <p className="ui-eyebrow text-[var(--accent-text)]">
                  Standard LED Kelvin &amp; Architectural Finishes
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
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

            <div className="rounded-[var(--radius-xs)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-6 sm:p-8">
              <h3 className="display-h3 text-[var(--text-primary)]">
                Crate Deliverables &amp; Ideal Applications
              </h3>

              <div className="mt-5">
                <p className="ui-eyebrow text-[var(--accent-text)]">
                  Included Inside Every Crate
                </p>
                <ul className="m-0 mt-2.5 flex list-none flex-col gap-2 p-0 text-[length:var(--text-2xl)] text-[var(--text-primary)]">
                  {product.deliverables.map((d) => (
                    <li key={d} className="flex items-start gap-2.5">
                      <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-[var(--accent-text)]" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 border-t border-[var(--border-subtle)] pt-5">
                <p className="ui-eyebrow text-[var(--accent-text)]">
                  Recommended Commercial Applications
                </p>
                <ul className="m-0 mt-2.5 grid list-none grid-cols-1 gap-2 p-0 text-[length:var(--text-xl)] text-[var(--text-secondary)] sm:grid-cols-2">
                  {product.idealFor.map((useCase) => (
                    <li key={useCase}>&bull; {useCase}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product-Specific FAQs */}
      <FaqAccordion
        id="product-faq"
        items={product.faqs}
        eyebrow="Product Technical FAQ"
        title={`${product.shortName} Engineering Questions`}
        subtitle={`Permit, installation, and material answers specific to BASISSIGN ${product.name}.`}
      />

      {/* Related Commercial Signage Systems */}
      <section className="border-t border-[var(--border-subtle)] bg-[var(--bg-subtle)] py-14">
        <div className="site-container">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="display-h3 m-0 text-[var(--text-primary)]">
              Explore Other Sign Systems
            </h2>
            <PillButton href={`/quote?type=${product.quoteTypeId}`} variant="cta">
              Start Quote for {product.shortName}
            </PillButton>
          </div>

          <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {relatedProducts.map((rel) => (
              <Link
                key={rel.slug}
                href={`/products/${rel.slug}`}
                className="group flex flex-col justify-between rounded-[22px] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-5 no-underline transition-colors hover:border-[var(--accent-cta)]"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[10px] border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--accent-text)]"
                      aria-hidden="true"
                    >
                      <ProductServiceIcon iconKey={rel.iconKey} className="h-3.5 w-3.5" />
                    </span>
                    <span className="ui-eyebrow text-[var(--accent-text)]">
                      {rel.chapterCode}
                    </span>
                  </div>
                  <h3 className="mt-3 text-[length:var(--text-3xl)] font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-text)]">
                    {rel.shortName}
                  </h3>
                  <p className="mt-1.5 text-[length:var(--text-lg)] text-[var(--text-secondary)]">
                    {rel.tagline}
                  </p>
                </div>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[length:var(--text-lg)] font-semibold text-[var(--text-primary)]">
                  <span>View Specs</span>
                  <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
