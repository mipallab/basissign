import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogArticleRenderer } from "@/components/BlogArticleRenderer";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BookOpenIcon,
  ChevronDownIcon,
  ClockIcon,
  ExternalLinkIcon,
  ShieldCheckIcon,
} from "@/components/Icons";
import { JsonLd } from "@/components/JsonLd";
import { PillButton } from "@/components/PillButton";
import { ShortQueryForm } from "@/components/ShortQueryForm";
import {
  extractBlogFaqs,
  formatBlogDate,
  getAdjacentBlogPosts,
  getAllBlogSummaries,
  getBlogPostBySlug,
  getPostHeadings,
  getRelatedBlogPosts,
  sanitizeHref,
} from "@/data/blog";
import { BRAND_FACTS } from "@/data/catalog";
import { normalizeQuoteTypeParam } from "@/lib/quote-schema";

export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllBlogSummaries().map((post) => ({
    slug: post.slug,
  }));
}

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) {
    return {
      title: "Guide Not Found",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.modified,
      url: `${BRAND_FACTS.domain}/blog/${post.slug}`,
      title: `${post.title} | BASISSIGN`,
      description: post.excerpt,
      images: [
        {
          url: post.coverImage,
          width: post.coverWidth,
          height: post.coverHeight,
          alt: post.coverAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | BASISSIGN`,
      description: post.excerpt,
      images: [post.coverImage],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const totalGuides = getAllBlogSummaries().length;
  const headings = getPostHeadings(post);
  const { prev, next } = getAdjacentBlogPosts(post.slug);
  const relatedPosts = getRelatedBlogPosts(post.slug, 3);
  const extractedFaqs = extractBlogFaqs(post);
  const quoteType = normalizeQuoteTypeParam(post.quoteTypeId);
  const safePinterestUrl = sanitizeHref(post.pinterestUrl);

  const blogPostingLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: `${BRAND_FACTS.domain}${post.coverImage}`,
    datePublished: post.date,
    dateModified: post.modified,
    wordCount: post.wordCount,
    timeRequired: `PT${post.readingMinutes}M`,
    articleSection: post.categoryLabel,
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
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BRAND_FACTS.domain}/blog/${post.slug}`,
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
        name: "Blog",
        item: `${BRAND_FACTS.domain}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${BRAND_FACTS.domain}/blog/${post.slug}`,
      },
    ],
  };

  const faqLd =
    extractedFaqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: extractedFaqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <>
      <JsonLd data={blogPostingLd} />
      <JsonLd data={breadcrumbLd} />
      {faqLd && <JsonLd data={faqLd} />}

      <article className="py-10 sm:py-14">
        <div className="site-container">
          {/* 1. Breadcrumb */}
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
                  href="/blog"
                  className="text-[var(--text-secondary)] no-underline hover:text-[var(--accent-text)]"
                >
                  Blog
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li
                aria-current="page"
                className="max-w-full truncate font-medium text-[var(--text-primary)]"
              >
                {post.title}
              </li>
            </ol>
          </nav>

          {/* 2. Editorial Header & Pinterest Cover Image Frame */}
          <header className="grid grid-cols-1 items-center gap-8 border-b border-[var(--border-subtle)] pb-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="flex flex-wrap items-center gap-2.5">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-1.5 rounded-[var(--radius-lg)] border border-[var(--border-strong)] bg-[var(--bg-elevated)] px-3.5 py-1 text-[length:var(--text-md)] font-semibold text-[var(--accent-text)] no-underline transition-colors hover:border-[var(--accent-cta)]"
                >
                  <BookOpenIcon className="h-3.5 w-3.5" />
                  <span>{post.categoryLabel}</span>
                </Link>

                <span className="inline-flex items-center gap-1 text-[length:var(--text-lg)] text-[var(--text-muted-theme)]">
                  <ClockIcon className="h-3.5 w-3.5" />
                  <span>{post.readingMinutes} min read</span>
                </span>

                <span
                  aria-hidden="true"
                  className="text-[var(--text-muted-theme)]"
                >
                  &middot;
                </span>

                <span className="text-[length:var(--text-lg)] text-[var(--text-muted-theme)]">
                  {post.wordCount.toLocaleString()} words
                </span>

                <span
                  aria-hidden="true"
                  className="text-[var(--text-muted-theme)]"
                >
                  &middot;
                </span>

                <time
                  dateTime={post.date}
                  className="text-[length:var(--text-lg)] text-[var(--text-muted-theme)]"
                >
                  Updated {formatBlogDate(post.modified || post.date)}
                </time>
              </div>

              <h1 className="display-h2 mt-4 text-[var(--text-primary)]">
                {post.title}
              </h1>

              <p className="mt-4 text-[length:var(--text-4xl)] leading-relaxed text-[var(--text-secondary)]">
                {post.excerpt}
              </p>
            </div>

            <div className="lg:col-span-5">
              <figure className="m-0 overflow-hidden rounded-[var(--radius-xs)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] shadow-sm">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--bg-subtle)]">
                  <Image
                    src={post.coverImage}
                    alt={post.coverAlt}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border-subtle)] px-4 py-2.5 text-[length:var(--text-md)] text-[var(--text-muted-theme)]">
                  <span>Architectural Signage Reference</span>
                  {safePinterestUrl && (
                    <a
                      href={safePinterestUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-medium text-[var(--accent-text)] no-underline hover:underline"
                    >
                      <span>Visual Reference via Pinterest</span>
                      <ExternalLinkIcon className="h-3 w-3" />
                      <span className="sr-only"> (opens in new tab)</span>
                    </a>
                  )}
                </figcaption>
              </figure>
            </div>
          </header>

          {/* 3. TOP Short Query Form */}
          <section
            aria-label="Quick project quote and permit query"
            className="mt-8"
          >
            <ShortQueryForm
              variant="top"
              placement={`blog-top:${post.slug}`}
              defaultSignType={post.quoteTypeId}
              articleTitle={post.title}
            />
          </section>

          {/* 4. Two-Column Article Body + Sticky Desktop Sidebar */}
          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_308px] lg:items-stretch">
            {/* Left Main Article Column */}
            <div className="min-w-0">
              {/* Mobile Jump-to-Section TOC */}
              {headings.length > 0 && (
                <details className="mb-7 rounded-[var(--radius-xs)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] lg:hidden">
                  <summary className="flex min-h-[48px] cursor-pointer list-none items-center justify-between gap-2 px-5 py-3 text-[length:var(--text-xl)] font-semibold text-[var(--text-primary)]">
                    <span>Jump to Section ({headings.length})</span>
                    <ChevronDownIcon className="h-4 w-4 text-[var(--text-secondary)]" />
                  </summary>
                  <nav
                    aria-label="Article table of contents"
                    className="border-t border-[var(--border-subtle)] px-5 py-3.5"
                  >
                    <ol className="m-0 flex list-none flex-col gap-2 p-0">
                      {headings.map((h) => (
                        <li key={h.id}>
                          <a
                            href={`#${h.id}`}
                            className="inline-block py-1 text-[length:var(--text-xl)] text-[var(--text-secondary)] no-underline transition-colors hover:text-[var(--accent-text)]"
                          >
                            {h.text}
                          </a>
                        </li>
                      ))}
                    </ol>
                  </nav>
                </details>
              )}

              <BlogArticleRenderer blocks={post.blocks} />
            </div>

            {/* Right Sticky Desktop Sidebar (pins beside article body and scrolls off naturally when article ends) */}
            <aside
              aria-label="Guide navigation and UL 48 quick specifications"
              className="hidden lg:block"
            >
              <div className="sticky top-24 flex max-h-[calc(100dvh-7rem)] flex-col gap-5 overflow-y-auto p-2 -m-2">
                {headings.length > 0 && (
                  <nav
                    aria-label="Table of contents"
                    className="rounded-[var(--radius-xs)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-5"
                  >
                    <p className="ui-eyebrow m-0 text-[var(--accent-text)]">
                      On This Page
                    </p>
                    <ol className="m-0 mt-3.5 flex list-none flex-col gap-2 p-0">
                      {headings.map((h) => (
                        <li key={h.id}>
                          <a
                            href={`#${h.id}`}
                            className="block rounded-[10px] px-2.5 py-1.5 text-[length:var(--text-xl)] leading-snug text-[var(--text-secondary)] no-underline transition-colors hover:bg-[var(--bg-subtle)] hover:text-[var(--accent-text)]"
                          >
                            {h.text}
                          </a>
                        </li>
                      ))}
                    </ol>
                  </nav>
                )}

                {/* UL 48 Quick Facts Card */}
                <div className="rounded-[var(--radius-xs)] border border-[var(--border-strong)] bg-[var(--bg-elevated)] p-5">
                  <div className="flex items-center gap-2 text-[length:var(--text-xl)] font-semibold text-[var(--text-primary)]">
                    <ShieldCheckIcon className="h-4 w-4 text-[var(--accent-text)]" />
                    <span>UL 48 Quick Facts</span>
                  </div>
                  <dl className="m-0 mt-3.5 flex flex-col gap-2.5 border-t border-[var(--border-subtle)] pt-3.5 text-[length:var(--text-lg)]">
                    <div className="flex items-center justify-between gap-2">
                      <dt className="text-[var(--text-muted-theme)]">
                        UL File #
                      </dt>
                      <dd className="m-0 font-semibold text-[var(--text-primary)]">
                        {BRAND_FACTS.ulFileNumber}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <dt className="text-[var(--text-muted-theme)]">Code</dt>
                      <dd className="m-0 font-semibold text-[var(--text-primary)]">
                        NEC Article 600
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <dt className="text-[var(--text-muted-theme)]">
                        Lead Time
                      </dt>
                      <dd className="m-0 font-semibold text-[var(--text-primary)]">
                        {BRAND_FACTS.leadTimeDays}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <dt className="text-[var(--text-muted-theme)]">
                        Drivers
                      </dt>
                      <dd className="m-0 font-semibold text-[var(--text-primary)]">
                        {BRAND_FACTS.driverBrand} Class 2
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <dt className="text-[var(--text-muted-theme)]">
                        Warranty
                      </dt>
                      <dd className="m-0 font-semibold text-[var(--text-primary)]">
                        {BRAND_FACTS.warrantyYears}-Year Full
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-5">
                    <PillButton
                      href={`/quote?type=${quoteType}`}
                      variant="cta"
                      fullWidth
                    >
                      Request 3D Mockup
                    </PillButton>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* 5. BOTTOM Short Query Form */}
          <section
            aria-label="Request custom quote and 3D mockup"
            className="mt-12 border-t border-[var(--border-subtle)] pt-10"
          >
            <ShortQueryForm
              variant="bottom"
              placement={`blog-bottom:${post.slug}`}
              defaultSignType={post.quoteTypeId}
              articleTitle={post.title}
            />
          </section>

          {/* 6. Prev / Next Guide Navigation */}
          {(prev || next) && (
            <nav
              aria-label="Adjacent signage guides"
              className="mt-10 grid grid-cols-1 gap-4 border-t border-[var(--border-subtle)] pt-8 sm:grid-cols-2"
            >
              {prev ? (
                <Link
                  href={`/blog/${prev.slug}`}
                  className="group flex flex-col justify-between rounded-[var(--radius-xs)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-5 no-underline transition-colors hover:border-[var(--accent-cta)]"
                >
                  <span className="inline-flex items-center gap-1.5 text-[length:var(--text-md)] font-semibold uppercase tracking-[0.06em] text-[var(--accent-text)]">
                    <ArrowLeftIcon className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                    <span>Newer Guide</span>
                  </span>
                  <span className="mt-2 text-[length:var(--text-3xl)] font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-text)]">
                    {prev.title}
                  </span>
                </Link>
              ) : (
                <div className="hidden sm:block" />
              )}

              {next && (
                <Link
                  href={`/blog/${next.slug}`}
                  className="group flex flex-col justify-between rounded-[var(--radius-xs)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-5 text-left no-underline transition-colors hover:border-[var(--accent-cta)] sm:text-right"
                >
                  <span className="inline-flex items-center gap-1.5 text-[length:var(--text-md)] font-semibold uppercase tracking-[0.06em] text-[var(--accent-text)] sm:justify-end">
                    <span>Previous Guide</span>
                    <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                  <span className="mt-2 text-[length:var(--text-3xl)] font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-text)]">
                    {next.title}
                  </span>
                </Link>
              )}
            </nav>
          )}

          {/* Related Signage Guides (3 Cards) */}
          <section
            aria-labelledby="related-guides-heading"
            className="mt-12 border-t border-[var(--border-subtle)] pt-10"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="ui-eyebrow m-0 text-[var(--accent-text)]">
                  Continue Reading
                </p>
                <h2
                  id="related-guides-heading"
                  className="display-h3 m-0 mt-1 text-[var(--text-primary)]"
                >
                  Related Signage Guides
                </h2>
              </div>

              <PillButton href="/blog" variant="ghost">
                View All {totalGuides} Guides
              </PillButton>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((rel) => (
                <article
                  key={rel.slug}
                  className="group flex flex-col rounded-[var(--radius-xs)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] transition-colors hover:border-[var(--accent-cta)]"
                >
                  <Link
                    href={`/blog/${rel.slug}`}
                    className="flex h-full flex-col rounded-[var(--radius-xs)] no-underline"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-[calc(var(--radius-xs)-1px)] bg-[var(--bg-subtle)]">
                      <Image
                        src={rel.coverImage}
                        alt={rel.coverAlt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-[var(--dur-slower)] ease-[var(--ease-editorial)] group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between p-5">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-page)] px-2.5 py-0.5 text-[length:var(--text-sm)] font-semibold text-[var(--accent-text)]">
                            {rel.categoryLabel}
                          </span>
                          <span className="text-[length:var(--text-md)] text-[var(--text-muted-theme)]">
                            {rel.readingMinutes} min read
                          </span>
                        </div>
                        <h3 className="mt-3 text-[length:var(--text-3xl)] font-semibold leading-snug text-[var(--text-primary)] group-hover:text-[var(--accent-text)]">
                          {rel.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-[length:var(--text-xl)] text-[var(--text-secondary)]">
                          {rel.excerpt}
                        </p>
                      </div>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-[length:var(--text-lg)] font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-text)]">
                        <span>Read Guide</span>
                        <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        </div>
      </article>
    </>
  );
}
