"use client";

import Image from "next/image";
import Link from "next/link";
import { useDeferredValue, useMemo, useRef, useState } from "react";
import {
  BLOG_CATEGORIES,
  formatBlogDate,
  type BlogCategoryId,
  type BlogPostSummary,
} from "@/data/blog-shared";
import {
  ArrowRightIcon,
  BookOpenIcon,
  ClockIcon,
  CloseIcon,
  SearchIcon,
} from "./Icons";

interface BlogIndexClientProps {
  posts: readonly BlogPostSummary[];
}

export function BlogIndexClient({ posts }: BlogIndexClientProps) {
  const [activeCategory, setActiveCategory] = useState<BlogCategoryId>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const deferredQuery = useDeferredValue(searchQuery);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const categoryCounts = useMemo(() => {
    const counts: Record<BlogCategoryId, number> = {
      all: posts.length,
      "permits-ul": 0,
      "channel-letters": 0,
      "cost-wholesale": 0,
      "install-care": 0,
      "faq-resources": 0,
    };
    for (const post of posts) {
      counts[post.categoryId] += 1;
    }
    return counts;
  }, [posts]);

  const normalizedQuery = deferredQuery.trim().toLowerCase();

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      if (activeCategory !== "all" && post.categoryId !== activeCategory) {
        return false;
      }
      if (!normalizedQuery) return true;
      const haystack = `${post.title} ${post.excerpt} ${post.categoryLabel} ${post.wpCategories.join(" ")}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [posts, activeCategory, normalizedQuery]);

  const showSpotlight =
    activeCategory === "all" &&
    normalizedQuery.length === 0 &&
    filteredPosts.length > 0;

  const spotlightPost = showSpotlight ? filteredPosts[0] : null;
  const gridPosts = showSpotlight ? filteredPosts.slice(1) : filteredPosts;

  const handleResetFilters = () => {
    setActiveCategory("all");
    setSearchQuery("");
    searchInputRef.current?.focus();
  };

  return (
    <div>
      {/* Filter & Search Toolbar */}
      <div className="flex flex-col gap-5 rounded-[var(--radius-xs)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-5 shadow-sm sm:p-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          {/* Category Filter Pills */}
          <div
            role="group"
            aria-label="Filter signage articles by category"
            className="flex flex-wrap items-center gap-2"
          >
            {BLOG_CATEGORIES.map((category) => {
              const isSelected = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setActiveCategory(category.id)}
                  className={`inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-[var(--radius-lg)] border px-4 py-2 text-[length:var(--text-lg)] font-medium transition-all duration-[var(--dur-fast)] active:scale-[0.97] ${
                    isSelected
                      ? "border-[var(--accent-cta)] bg-[var(--ink)] text-[var(--surface-white)]"
                      : "border-[var(--border-strong)] bg-[var(--bg-page)] text-[var(--text-primary)] hover:border-[var(--accent-cta)] hover:bg-[var(--bg-subtle)]"
                  }`}
                >
                  <span>{category.label}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[length:var(--text-sm)] font-semibold ${
                      isSelected
                        ? "bg-[color-mix(in_srgb,var(--surface-white)_16%,transparent)] text-[var(--surface-white)]"
                        : "bg-[var(--bg-subtle)] text-[var(--text-secondary)]"
                    }`}
                  >
                    {categoryCounts[category.id]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Live Search Input */}
          <div className="relative w-full shrink-0 lg:w-[320px]">
            <label htmlFor="blog-search-input" className="sr-only">
              Search signage guides by topic, permit rule, or product
            </label>
            <SearchIcon
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted-theme)]"
              aria-hidden="true"
            />
            <input
              ref={searchInputRef}
              id="blog-search-input"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search UL 48, permits, pricing..."
              className="ui-input ui-input--compact pl-10 pr-11"
            />
            {searchQuery.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  searchInputRef.current?.focus();
                }}
                aria-label="Clear search query"
                className="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)] active:scale-[0.96]"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Accessible Live Result Count */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border-subtle)] pt-3.5">
          <p
            aria-live="polite"
            className="m-0 text-[length:var(--text-xl)] text-[var(--text-secondary)]"
          >
            Showing{" "}
            <strong className="text-[var(--text-primary)]">
              {filteredPosts.length}
            </strong>{" "}
            of {posts.length} engineering &amp; signage guides
            {normalizedQuery ? ` matching "${deferredQuery.trim()}"` : ""}.
          </p>

          {(activeCategory !== "all" || searchQuery.length > 0) && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex min-h-[36px] cursor-pointer items-center gap-1.5 rounded-[var(--radius-lg)] border border-[var(--border-strong)] bg-[var(--bg-page)] px-3.5 py-1 text-[length:var(--text-md)] font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--accent-cta)] active:scale-[0.98]"
            >
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Featured Lead Guide Spotlight */}
      {spotlightPost && (
        <article className="group mt-8 rounded-[var(--radius-xs)] border border-[var(--border-strong)] bg-[var(--bg-elevated)] shadow-sm transition-colors duration-[var(--dur-fast)] hover:border-[var(--accent-cta)]">
          <Link
            href={`/blog/${spotlightPost.slug}`}
            className="grid grid-cols-1 items-stretch rounded-[var(--radius-xs)] text-left no-underline lg:grid-cols-12"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-[calc(var(--radius-xs)-1px)] bg-[var(--bg-subtle)] lg:col-span-5 lg:aspect-auto lg:min-h-[320px] lg:rounded-l-[calc(var(--radius-xs)-1px)] lg:rounded-tr-none">
              <Image
                src={spotlightPost.coverImage}
                alt={spotlightPost.coverAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover transition-transform duration-[var(--dur-slower)] ease-[var(--ease-editorial)] group-hover:scale-[1.03]"
              />
            </div>

            <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-7">
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-lg)] border border-[var(--accent-cta)] bg-[var(--accent-cta)] px-3 py-1 text-[length:var(--text-sm)] font-semibold uppercase tracking-[0.06em] text-[var(--surface-white)]">
                    <BookOpenIcon className="h-3.5 w-3.5" />
                    <span>Featured Lead Guide</span>
                  </span>
                  <span className="inline-flex items-center rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-page)] px-3 py-1 text-[length:var(--text-sm)] font-semibold text-[var(--accent-text)]">
                    {spotlightPost.categoryLabel}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[length:var(--text-md)] text-[var(--text-muted-theme)]">
                    <ClockIcon className="h-3.5 w-3.5" />
                    <span>{spotlightPost.readingMinutes} min read</span>
                  </span>
                  <time
                    dateTime={spotlightPost.date}
                    className="text-[length:var(--text-md)] text-[var(--text-muted-theme)]"
                  >
                    {formatBlogDate(spotlightPost.date)}
                  </time>
                </div>

                <h2 className="display-h3 mt-4 text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-text)]">
                  {spotlightPost.title}
                </h2>

                <p className="mt-3 text-[length:var(--text-2xl)] leading-relaxed text-[var(--text-secondary)]">
                  {spotlightPost.excerpt}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between gap-4 border-t border-[var(--border-subtle)] pt-4">
                <span className="text-[length:var(--text-lg)] text-[var(--text-muted-theme)]">
                  {spotlightPost.wordCount.toLocaleString()} words ·{" "}
                  {spotlightPost.linkCount} citations
                </span>
                <span className="inline-flex items-center gap-2 text-[length:var(--text-xl)] font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-text)]">
                  <span>Read Complete Guide</span>
                  <ArrowRightIcon className="h-4 w-4 transition-transform duration-[var(--dur-fast)] group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </Link>
        </article>
      )}

      {/* Empty Search State */}
      {filteredPosts.length === 0 ? (
        <div className="mt-8 rounded-[var(--radius-xs)] border border-[var(--border-strong)] bg-[var(--bg-elevated)] p-10 text-center">
          <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--bg-subtle)] text-[var(--accent-text)]">
            <SearchIcon className="h-5 w-5" />
          </div>
          <h2 className="display-h3 mt-4 text-[var(--text-primary)]">
            No matching signage guides found
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-[length:var(--text-2xl)] text-[var(--text-secondary)]">
            We couldn&apos;t find any articles matching your current filter
            {normalizedQuery ? ` ("${deferredQuery.trim()}")` : ""}. Reset
            filters to view all {posts.length} guides.
          </p>
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-[var(--radius-lg)] bg-[var(--accent-cta)] px-6 py-2.5 text-[length:var(--text-xl)] font-semibold text-[var(--surface-white)] transition-opacity hover:opacity-90 active:scale-[0.98]"
            >
              Reset Filters
            </button>
          </div>
        </div>
      ) : (
        /* Responsive 3-Column Card Grid */
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {gridPosts.map((post) => (
            <article
              key={post.slug}
              className="group flex flex-col rounded-[var(--radius-xs)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] transition-colors duration-[var(--dur-fast)] hover:border-[var(--accent-cta)]"
            >
              <Link
                href={`/blog/${post.slug}`}
                className="flex h-full flex-col rounded-[var(--radius-xs)] text-left no-underline transition-transform duration-[var(--dur-instant)] active:scale-[0.995]"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-[calc(var(--radius-xs)-1px)] bg-[var(--bg-subtle)]">
                  <Image
                    src={post.coverImage}
                    alt={post.coverAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-[var(--dur-slower)] ease-[var(--ease-editorial)] group-hover:scale-[1.03]"
                  />
                </div>

                <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="inline-flex items-center rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-page)] px-3 py-1 text-[length:var(--text-sm)] font-semibold text-[var(--accent-text)]">
                        {post.categoryLabel}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[length:var(--text-md)] font-medium text-[var(--text-muted-theme)]">
                        <ClockIcon className="h-3.5 w-3.5" />
                        <span>{post.readingMinutes} min read</span>
                      </span>
                    </div>

                    <h2 className="mt-3 text-[length:var(--text-4xl)] font-semibold leading-snug text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-text)]">
                      {post.title}
                    </h2>

                    <p className="mt-2 line-clamp-3 text-[length:var(--text-xl)] leading-relaxed text-[var(--text-secondary)]">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-[var(--border-subtle)] pt-3.5 text-[length:var(--text-lg)]">
                    <time
                      dateTime={post.date}
                      className="text-[var(--text-muted-theme)]"
                    >
                      {formatBlogDate(post.date)}
                    </time>
                    <span className="inline-flex items-center gap-1.5 font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-text)]">
                      <span>Read Guide</span>
                      <ArrowRightIcon className="h-4 w-4 transition-transform duration-[var(--dur-fast)] group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
