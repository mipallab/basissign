"use client";

import Link from "next/link";
import { PRODUCT_CATALOG } from "@/data/catalog";
import {
  ArrowRightIcon,
  ProductServiceIcon,
  ShieldCheckIcon,
} from "./Icons";
import { ProductGallerySlider } from "./ProductGallerySlider";
import { ProductQuoteTrigger } from "./ProductQuoteModal";

export function ProductChapters() {
  return (
    <section
      id="products"
      aria-labelledby="products-heading"
      className="py-[var(--section-py)]"
    >
      <div className="site-container">
        {/* Editorial Section Header */}
        <div className="flex flex-col justify-between gap-6 border-b border-[var(--border-subtle)] pb-10 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <p className="ui-eyebrow text-[var(--accent-text)]">
              01–04 / Architectural Sign Systems
            </p>
            <h2
              id="products-heading"
              className="display-h2 mt-3 text-[var(--text-primary)]"
            >
              Custom Signage Engineered for Code &amp; Craft
            </h2>
          </div>
          <p className="max-w-xl text-[length:var(--text-2xl)] leading-relaxed text-[var(--text-secondary)]">
            Every BASISSIGN system is CNC-fabricated in marine-grade aluminum or
            304/316 stainless steel, pre-tested with Mean Well® Class 2 LED
            drivers, and delivered with 1:1 mounting patterns.
          </p>
        </div>

        {/* Interactive Product Chapters */}
        <div className="mt-12 flex flex-col gap-12 sm:gap-16">
          {PRODUCT_CATALOG.map((item, idx) => {
            const reversed = idx % 2 === 1;

            return (
              <article
                key={item.slug}
                aria-labelledby={`chapter-title-${item.slug}`}
                className="grid grid-cols-1 items-center gap-8 rounded-[var(--radius-xs)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-5 transition-colors duration-[var(--dur-normal)] sm:p-8 lg:grid-cols-12 lg:gap-10"
              >
                {/* 3-Photo + 1-Video Neontrip-Matched Gallery Slider Column */}
                <div
                  className={`relative min-w-0 lg:col-span-6 ${
                    reversed ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  <ProductGallerySlider
                    productName={item.name}
                    shortName={item.shortName}
                    supportsDayNight={item.supportsDayNightPreview}
                    gallery={item.gallery}
                    video={item.video}
                    sizes="(max-width: 1024px) 100vw, 48vw"
                  />
                </div>

                {/* Architectural Specification & Conversion Column */}
                <div
                  className={`flex min-w-0 flex-col justify-center lg:col-span-6 ${
                    reversed ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="inline-flex items-center gap-2 rounded-[var(--radius-lg)] border border-[var(--border-strong)] bg-[var(--bg-subtle)] px-3.5 py-1 text-[length:var(--text-md)] font-semibold tracking-[0.06em] text-[var(--text-primary)]">
                      <ProductServiceIcon
                        iconKey={item.iconKey}
                        className="h-3.5 w-3.5 text-[var(--accent-text)]"
                      />
                      <span>{item.chapterCode}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] px-3 py-1 text-[length:var(--text-md)] font-medium text-[var(--text-secondary)]">
                      <ShieldCheckIcon className="h-3.5 w-3.5 text-[var(--accent-text)]" />
                      <span>UL 48 #E555259 Listed</span>
                    </span>
                  </div>

                  <h3
                    id={`chapter-title-${item.slug}`}
                    className="display-h3 mt-4 text-[var(--text-primary)]"
                  >
                    {item.name}
                  </h3>

                  <p className="mt-2 text-[length:var(--text-2xl)] font-medium text-[var(--accent-text)]">
                    {item.tagline}
                  </p>

                  <p className="mt-3 text-[length:var(--text-2xl)] leading-relaxed text-[var(--text-secondary)]">
                    {item.answerFirstSummary}
                  </p>

                  {/* 2x2 Key Engineering Specs Grid */}
                  <dl className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-[18px] border border-[var(--border-subtle)] bg-[var(--bg-page)] p-3.5">
                      <dt className="ui-eyebrow text-[var(--text-muted-theme)]">
                        Face Spec
                      </dt>
                      <dd className="m-0 mt-1 text-[length:var(--text-xl)] font-medium text-[var(--text-primary)]">
                        {item.faceMaterial}
                      </dd>
                    </div>
                    <div className="rounded-[18px] border border-[var(--border-subtle)] bg-[var(--bg-page)] p-3.5">
                      <dt className="ui-eyebrow text-[var(--text-muted-theme)]">
                        Return / Shell
                      </dt>
                      <dd className="m-0 mt-1 text-[length:var(--text-xl)] font-medium text-[var(--text-primary)]">
                        {item.returnMaterial}
                      </dd>
                    </div>
                    <div className="rounded-[18px] border border-[var(--border-subtle)] bg-[var(--bg-page)] p-3.5">
                      <dt className="ui-eyebrow text-[var(--text-muted-theme)]">
                        Lead Time
                      </dt>
                      <dd className="m-0 mt-1 text-[length:var(--text-xl)] font-medium text-[var(--text-primary)]">
                        {item.leadTime}
                      </dd>
                    </div>
                    <div className="rounded-[18px] border border-[var(--border-subtle)] bg-[var(--bg-page)] p-3.5">
                      <dt className="ui-eyebrow text-[var(--text-muted-theme)]">
                        Primary Mounting
                      </dt>
                      <dd className="m-0 mt-1 text-[length:var(--text-xl)] font-medium text-[var(--text-primary)]">
                        {item.mountingOptions[0]}
                      </dd>
                    </div>
                  </dl>

                  {/* Actions */}
                  <div className="mt-7 flex flex-wrap items-center gap-4">
                    <ProductQuoteTrigger
                      quoteTypeId={item.quoteTypeId}
                      productName={item.shortName}
                      placement={`home-chapter:${item.slug}`}
                      variant="cta"
                    >
                      Request a Quote
                    </ProductQuoteTrigger>

                    <Link
                      href={`/products/${item.slug}`}
                      className="group inline-flex min-h-[44px] items-center gap-2 rounded-[var(--radius-lg)] px-4 py-2 text-[length:var(--text-xl)] font-medium text-[var(--text-primary)] no-underline transition-colors duration-[var(--dur-fast)] hover:bg-[var(--bg-subtle)] hover:text-[var(--accent-text)] active:scale-[0.98]"
                    >
                      <span>View Full Engineering Specs</span>
                      <ArrowRightIcon className="h-4 w-4 transition-transform duration-[var(--dur-fast)] group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
