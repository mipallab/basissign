import type { Metadata } from "next";
import Link from "next/link";
import { BlogIndexClient } from "@/components/BlogIndexClient";
import { BookOpenIcon, ShieldCheckIcon } from "@/components/Icons";
import { JsonLd } from "@/components/JsonLd";
import { PillButton } from "@/components/PillButton";
import { getAllBlogSummaries } from "@/data/blog";
import { BLOG_POST_COUNT } from "@/data/blog-shared";
import { BRAND_FACTS } from "@/data/catalog";

export const metadata: Metadata = {
  title: "Commercial Signage Blog & UL 48 Engineering Guides",
  description:
    `Explore ${BLOG_POST_COUNT} in-depth guides from BASISSIGN covering municipal sign permits, UL 48 (#E555259) compliance, channel letter pricing, blade & push-thru light boxes, mounting hardware, and wholesale trade outsourcing.`,
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    type: "website",
    title: "Commercial Signage Blog & Engineering Guides | BASISSIGN",
    description:
      `${BLOG_POST_COUNT} technical guides covering US sign permits, UL 48 & NEC 600 code, custom channel letter pricing, and commercial installation best practices.`,
    url: `${BRAND_FACTS.domain}/blog`,
    images: [
      {
        url: "/images/blog/pinterest/channel-letter-signs-in-alpharetta-ga-permit-rules-timeline-and.webp",
        width: 736,
        height: 736,
        alt: "BASISSIGN Commercial Signage & UL 48 Engineering Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Commercial Signage Blog & UL 48 Engineering Guides | BASISSIGN",
    description:
      `${BLOG_POST_COUNT} technical guides on US sign permits, UL 48 channel letters, wholesale sign manufacturing, and commercial facade installation.`,
    images: ["/images/blog/pinterest/channel-letter-signs-in-alpharetta-ga-permit-rules-timeline-and.webp"],
  },
};

export default function BlogIndexPage() {
  const summaries = getAllBlogSummaries();

  const blogLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "BASISSIGN Commercial Signage & UL 48 Engineering Blog",
    description:
      "Technical guides, permit checklists, pricing benchmarks, and installation specifications for custom commercial signage and UL Standard 48 channel letters.",
    url: `${BRAND_FACTS.domain}/blog`,
    publisher: {
      "@type": "Organization",
      name: BRAND_FACTS.legalName,
      url: BRAND_FACTS.domain,
    },
    blogPost: summaries.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      url: `${BRAND_FACTS.domain}/blog/${post.slug}`,
      datePublished: post.date,
      dateModified: post.modified,
      image: `${BRAND_FACTS.domain}${post.coverImage}`,
      author: {
        "@type": "Organization",
        name: BRAND_FACTS.legalName,
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
        name: "Blog",
        item: `${BRAND_FACTS.domain}/blog`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={blogLd} />
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
                Blog
              </li>
            </ol>
          </nav>

          {/* Editorial Intro Header */}
          <div className="flex flex-col justify-between gap-6 border-b border-[var(--border-subtle)] pb-8 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-2 rounded-[var(--radius-lg)] border border-[var(--border-strong)] bg-[var(--bg-elevated)] px-3.5 py-1 text-[length:var(--text-md)] font-semibold uppercase tracking-[0.06em] text-[var(--accent-text)]">
                  <BookOpenIcon className="h-3.5 w-3.5" />
                  <span>01–{summaries.length} / Engineering &amp; Permit Library</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-1 text-[length:var(--text-md)] font-medium text-[var(--text-secondary)]">
                  <ShieldCheckIcon className="h-3.5 w-3.5 text-[var(--accent-text)]" />
                  <span>UL 48 #{BRAND_FACTS.ulFileNumber} Specs</span>
                </span>
              </div>

              <h1 className="display-h2 mt-4 text-[var(--text-primary)]">
                Signage Engineering, Permits &amp; Wholesale Guides
              </h1>

              <p className="mt-3 text-[length:var(--text-2xl)] leading-relaxed text-[var(--text-secondary)]">
                Field-tested guides on municipal sign permit checklists, UL
                Standard 48 electrical requirements, channel letter pricing
                benchmarks, raceway vs. flush installation hardware, and
                factory-direct trade fulfillment.
              </p>
            </div>

            <div className="shrink-0">
              <PillButton href="/quote" variant="cta">
                Request a Free 3D Mockup
              </PillButton>
            </div>
          </div>

          {/* Interactive Filter + Search + Grid */}
          <div className="mt-8">
            <BlogIndexClient posts={summaries} />
          </div>
        </div>
      </section>
    </>
  );
}
