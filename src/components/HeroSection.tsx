"use client";

import Link from "next/link";
import {
  useEffect,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
} from "react";
import { BRAND_FACTS, type ProductIconKey } from "@/data/catalog";
import {
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LightbulbIcon,
  PauseIcon,
  PlayIcon,
  ProductServiceIcon,
  ShieldCheckIcon,
} from "./Icons";
import { PillButton } from "./PillButton";
import { SignStudioPreview } from "./SignStudioPreview";

interface HeroSlide {
  id: string;
  badge: string;
  title: string;
  iconKey: ProductIconKey;
  productHref: string;
  onImage: string;
  offImage: string;
  alt: string;
}

const HERO_SLIDES: readonly HeroSlide[] = [
  {
    id: "dual-lit",
    badge: "Dual-Lit Channel Letters",
    title: "VELORA · Front & Back Dual-Lit Facade",
    iconKey: "dual-lit",
    productHref: "/products/dual-lit-channel-letters",
    onImage: "/images/hero/hero-01-on.webp",
    offImage: "/images/hero/hero-01-off.webp",
    alt: "VELORA UL 48 Front and Back Dual-Lit custom channel letters illuminating dark marble storefront facade",
  },
  {
    id: "front-lit",
    badge: "Front-Lit Letters",
    title: "JEWELRY · 3/16\" Cast Acrylic Front-Lit Letters",
    iconKey: "front-lit",
    productHref: "/products/front-lit-channel-letters",
    onImage: "/images/hero/hero-02-on.webp",
    offImage: "/images/hero/hero-02-off.webp",
    alt: "JEWELRY UL 48 Front-Lit custom LED channel letters mounted across charcoal luxury storefront",
  },
  {
    id: "halo-lit",
    badge: "Back / Halo-Lit Letters",
    title: "CREATIVE GIRLS · 160° Reverse Metal Halo Wash",
    iconKey: "halo-lit",
    productHref: "/products/halo-lit-channel-letters",
    onImage: "/images/hero/hero-03-on.webp",
    offImage: "/images/hero/hero-03-off.webp",
    alt: "CREATIVE GIRLS brushed metal Halo-Lit channel letters casting warm architectural wall wash onto limestone facade",
  },
  {
    id: "blade-sign",
    badge: "Double-Sided Blade",
    title: "LUMINA COFFEE · 90° Gusseted Blade Sign",
    iconKey: "blade-lightbox",
    productHref: "/products/blade-signs-light-boxes",
    onImage: "/images/hero/hero-04-on.webp",
    offImage: "/images/hero/hero-04-off.webp",
    alt: "LUMINA COFFEE ROASTERS double-sided round projecting illuminated blade sign mounted to stone storefront",
  },
  {
    id: "enterprise-front-lit",
    badge: "Enterprise Channel Letters",
    title: "BOLTTECH · Commercial Roof & Curtainwall Signage",
    iconKey: "front-lit",
    productHref: "/products/front-lit-channel-letters",
    onImage: "/images/hero/hero-05-on.webp",
    offImage: "/images/hero/hero-05-off.webp",
    alt: "Enterprise UL 48 illuminated commercial building channel letters mounted along multi-story glass facade",
  },
];

const TRUST_MARQUEE_ITEMS = [
  `UL 48 File #${BRAND_FACTS.ulFileNumber}`,
  "Mean Well® Class 2 Drivers",
  "NEC Article 600 Ready",
  "304/316 Stainless Steel",
  "1:1 CNC Mounting Patterns",
  "Blind Trade Crating",
  "3-Year Full Warranty",
  "<1% Freight Damage",
];

const AUTO_ADVANCE_MS = 5500;

function subscribeReducedMotion(callback: () => void): () => void {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getReducedMotionSnapshot(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot(): boolean {
  return false;
}

export function HeroSection() {
  const [isLit, setIsLit] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isFocusWithin, setIsFocusWithin] = useState(false);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  useEffect(() => {
    if (isPaused || isHovering || isFocusWithin || prefersReducedMotion) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(timer);
  }, [isPaused, isHovering, isFocusWithin, prefersReducedMotion]);

  const activeSlide = HERO_SLIDES[activeIndex] ?? HERO_SLIDES[0];

  const goToPrev = () => {
    setActiveIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handleControlsKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goToPrev();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goToNext();
    }
  };

  return (
    <section
      aria-label="BASISSIGN Custom Channel Letter Showcase Carousel"
      aria-roledescription="carousel"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onFocusCapture={() => setIsFocusWithin(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setIsFocusWithin(false);
        }
      }}
      className="hero-section-shell surface-dark relative flex min-h-[clamp(600px,86vh,860px)] flex-col justify-between overflow-hidden pt-8 pb-8 sm:pt-12 sm:pb-10"
    >
      {/* Full-Bleed Multi-Slide Architectural Signage Facade Crossfade Stack */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {HERO_SLIDES.map((slide, idx) => {
          const isActive = idx === activeIndex;
          return (
            <div
              key={slide.id}
              aria-hidden={!isActive}
              className="absolute inset-0 transition-opacity duration-[550ms] ease-[var(--ease-editorial)]"
              style={{ opacity: isActive ? 1 : 0 }}
            >
              <SignStudioPreview
                variant="photo"
                imageSrc={slide.onImage}
                offImageSrc={slide.offImage}
                alt={isActive ? slide.alt : ""}
                aspectClass="h-full w-full"
                className="h-full w-full"
                priority={idx === 0}
                sizes="100vw"
                supportsDayNight
                lit={isLit}
              />
            </div>
          );
        })}

        {/* Atmospheric Scrim for Crisp WCAG AA Headline Readability */}
        <div
          aria-hidden="true"
          className="absolute inset-0 transition-opacity duration-[var(--dur-slower)] ease-[var(--ease-editorial)]"
          style={{
            background: isLit
              ? "linear-gradient(95deg, color-mix(in srgb, var(--surface-black) 92%, transparent) 0%, color-mix(in srgb, var(--surface-black) 78%, transparent) 44%, color-mix(in srgb, var(--surface-black) 26%, transparent) 100%)"
              : "linear-gradient(95deg, color-mix(in srgb, var(--surface-black) 94%, transparent) 0%, color-mix(in srgb, var(--surface-black) 82%, transparent) 48%, color-mix(in srgb, var(--surface-black) 36%, transparent) 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-44"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, color-mix(in srgb, var(--surface-black) 92%, transparent) 100%)",
          }}
        />
      </div>

      {/* Foreground Architectural Editorial Content */}
      <div className="site-container relative z-10 flex flex-1 flex-col justify-between">
        {/* Top Metadata & Day/Night Illumination Switch */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div
            className="inline-flex items-center gap-2 rounded-[var(--radius-lg)] border px-3.5 py-1.5 text-[length:var(--text-md)] font-semibold uppercase tracking-[0.08em] backdrop-blur-md"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--surface-black) 70%, transparent)",
              borderColor:
                "color-mix(in srgb, var(--surface-white) 24%, transparent)",
              color: "var(--local-fg)",
            }}
          >
            <ShieldCheckIcon className="h-4 w-4 text-[var(--accent-text)]" />
            <span>
              UL 48 Listed · File #{BRAND_FACTS.ulFileNumber} · Factory-Direct
            </span>
          </div>

          <button
            type="button"
            aria-pressed={isLit}
            onClick={() => setIsLit((prev) => !prev)}
            className="light-toggle"
          >
            <span className="light-toggle__track" aria-hidden="true">
              <span className="light-toggle__thumb">
                <LightbulbIcon className="h-3.5 w-3.5" />
              </span>
            </span>
            <span>
              {isLit
                ? "Lights ON — Night Facade"
                : "Lights OFF — Architectural Day"}
            </span>
          </button>
        </div>

        {/* Main Hero Typography & Action Pair */}
        <div className="my-auto max-w-3xl py-8 sm:py-10">
          <h1 className="display-hero m-0 text-[var(--local-fg)]">
            Architectural Channel Letters. Factory-Direct to Your Storefront.
          </h1>

          <p className="ui-body-lg mt-5 max-w-2xl text-[var(--local-fg-muted)]">
            UL 48 listed (#{BRAND_FACTS.ulFileNumber}) custom illuminated channel
            letters, halo signage, and push-thru cabinets built to NEC Article
            600 standards. Shipped nationwide in {BRAND_FACTS.leadTimeDays} with
            a free 3D Day/Night mockup within 24 hours.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <PillButton href="/quote" variant="light-on-dark">
              Request a Quote
            </PillButton>
            <PillButton href="/portfolio" variant="ghost-on-dark">
              Explore Portfolio
            </PillButton>
          </div>

          {/* Key B2B Manufacturing Proof Metrics */}
          <dl
            className="mt-9 grid max-w-2xl grid-cols-2 gap-x-6 gap-y-4 border-t pt-6 sm:grid-cols-4"
            style={{ borderColor: "var(--local-border)" }}
          >
            <div>
              <dt className="text-[length:var(--text-md)] text-[var(--local-fg-muted)]">
                US Storefronts Served
              </dt>
              <dd className="m-0 mt-1 text-[length:var(--text-4xl)] font-semibold text-[var(--local-fg)]">
                {BRAND_FACTS.businessesServed}
              </dd>
            </div>
            <div>
              <dt className="text-[length:var(--text-md)] text-[var(--local-fg-muted)]">
                Standard Lead Time
              </dt>
              <dd className="m-0 mt-1 text-[length:var(--text-4xl)] font-semibold text-[var(--local-fg)]">
                {BRAND_FACTS.leadTimeDays}
              </dd>
            </div>
            <div>
              <dt className="text-[length:var(--text-md)] text-[var(--local-fg-muted)]">
                Freight Damage Rate
              </dt>
              <dd className="m-0 mt-1 text-[length:var(--text-4xl)] font-semibold text-[var(--local-fg)]">
                {BRAND_FACTS.freightDamageRate}
              </dd>
            </div>
            <div>
              <dt className="text-[length:var(--text-md)] text-[var(--local-fg-muted)]">
                Full Factory Warranty
              </dt>
              <dd className="m-0 mt-1 text-[length:var(--text-4xl)] font-semibold text-[var(--local-fg)]">
                {BRAND_FACTS.warrantyYears} Years
              </dd>
            </div>
          </dl>
        </div>

        {/* Active Slide Metadata + Accessible Carousel Controls */}
        <div
          onKeyDown={handleControlsKeyDown}
          className="flex flex-wrap items-center justify-between gap-3 pb-2"
        >
          <Link
            href={activeSlide.productHref}
            className="group inline-flex min-h-[42px] items-center gap-2.5 rounded-[var(--radius-lg)] border px-4 py-1.5 text-[length:var(--text-lg)] text-[var(--local-fg)] no-underline backdrop-blur-md transition-colors hover:border-[var(--accent-glow)]"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--surface-black) 72%, transparent)",
              borderColor:
                "color-mix(in srgb, var(--surface-white) 22%, transparent)",
            }}
          >
            <ProductServiceIcon
              iconKey={activeSlide.iconKey}
              className="h-4 w-4 shrink-0 text-[var(--accent-text)]"
            />
            <span className="font-medium">{activeSlide.title}</span>
            <ArrowRightIcon className="h-3.5 w-3.5 shrink-0 text-[var(--accent-text)] transition-transform group-hover:translate-x-1" />
          </Link>

          <div
            role="group"
            aria-label="Hero showcase slide controls"
            className="inline-flex items-center gap-1.5 rounded-[var(--radius-lg)] border p-1 backdrop-blur-md"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--surface-black) 74%, transparent)",
              borderColor:
                "color-mix(in srgb, var(--surface-white) 22%, transparent)",
            }}
          >
            <button
              type="button"
              onClick={goToPrev}
              aria-label="Previous featured sign slide"
              className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-[var(--radius-lg)] text-[var(--local-fg)] transition-colors hover:bg-[color-mix(in_srgb,var(--surface-white)_16%,transparent)] active:scale-[0.96]"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-1 px-1">
              {HERO_SLIDES.map((slide, idx) => {
                const isSelected = idx === activeIndex;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    aria-label={`Show slide ${idx + 1} of ${HERO_SLIDES.length}: ${slide.badge}`}
                    aria-current={isSelected ? "true" : undefined}
                    className="inline-flex h-9 cursor-pointer items-center justify-center px-1 transition-all"
                  >
                    <span
                      aria-hidden="true"
                      className={`block h-2 rounded-[var(--radius-lg)] transition-all duration-[var(--dur-normal)] ease-[var(--ease-editorial)] ${
                        isSelected
                          ? "w-7 bg-[var(--accent-glow)]"
                          : "w-2.5 bg-[color-mix(in_srgb,var(--surface-white)_38%,transparent)] hover:bg-[var(--surface-white)]"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={goToNext}
              aria-label="Next featured sign slide"
              className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-[var(--radius-lg)] text-[var(--local-fg)] transition-colors hover:bg-[color-mix(in_srgb,var(--surface-white)_16%,transparent)] active:scale-[0.96]"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>

            <span
              aria-hidden="true"
              className="mx-0.5 h-5 w-px"
              style={{ backgroundColor: "var(--local-border)" }}
            />

            <button
              type="button"
              onClick={() => setIsPaused((prev) => !prev)}
              aria-pressed={isPaused}
              aria-label={
                isPaused ? "Resume hero slideshow" : "Pause hero slideshow"
              }
              className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-[var(--radius-lg)] text-[var(--local-fg)] transition-colors hover:bg-[color-mix(in_srgb,var(--surface-white)_16%,transparent)] active:scale-[0.96]"
            >
              {isPaused ? (
                <PlayIcon className="h-4 w-4" />
              ) : (
                <PauseIcon className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Infinite Seamless Trust Marquee */}
      <div
        className="hero-brands relative z-10 mt-3 border-t pt-5"
        style={{ borderColor: "var(--local-border)" }}
        aria-label="BASISSIGN Engineering and Compliance Standards"
      >
        <div className="hero-brands__track items-center">
          {TRUST_MARQUEE_ITEMS.map((item) => (
            <span
              key={`primary-${item}`}
              className="inline-flex shrink-0 items-center gap-2.5 rounded-[var(--radius-lg)] border px-4 py-2 text-[length:var(--text-lg)] font-medium text-[var(--local-fg)]"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--local-elevated) 84%, transparent)",
                borderColor: "var(--local-border)",
              }}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: "var(--accent-glow)" }}
                aria-hidden="true"
              />
              <span>{item}</span>
            </span>
          ))}
          {TRUST_MARQUEE_ITEMS.map((item) => (
            <span
              key={`dup-${item}`}
              aria-hidden="true"
              className="inline-flex shrink-0 items-center gap-2.5 rounded-[var(--radius-lg)] border px-4 py-2 text-[length:var(--text-lg)] font-medium text-[var(--local-fg)]"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--local-elevated) 84%, transparent)",
                borderColor: "var(--local-border)",
              }}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: "var(--accent-glow)" }}
              />
              <span>{item}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
