"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
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
    title: 'JEWELRY · 3/16" Cast Acrylic Front-Lit Letters',
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

const AUTO_ADVANCE_MS = 5000;

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
  const [isInView, setIsInView] = useState(true);

  const sectionRef = useRef<HTMLElement | null>(null);
  const dotRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (
      isPaused ||
      isHovering ||
      isFocusWithin ||
      !isLit ||
      !isInView ||
      prefersReducedMotion
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(timer);
  }, [isPaused, isHovering, isFocusWithin, isLit, isInView, prefersReducedMotion]);

  const activeSlide = HERO_SLIDES[activeIndex] ?? HERO_SLIDES[0];

  const selectSlide = (idx: number, moveFocus = false) => {
    const wrapped = (idx + HERO_SLIDES.length) % HERO_SLIDES.length;
    setActiveIndex(wrapped);
    if (moveFocus) {
      dotRefs.current[wrapped]?.focus();
    }
  };

  const handleControlsKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      selectSlide(activeIndex - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      selectSlide(activeIndex + 1);
    }
  };

  const handleDotKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    idx: number
  ) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      selectSlide(idx - 1, true);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      selectSlide(idx + 1, true);
    } else if (event.key === "Home") {
      event.preventDefault();
      selectSlide(0, true);
    } else if (event.key === "End") {
      event.preventDefault();
      selectSlide(HERO_SLIDES.length - 1, true);
    }
  };

  return (
    <section
      ref={sectionRef}
      aria-label="BASISSIGN Custom Channel Letter Showcase Carousel"
      aria-roledescription="carousel"
      className="bg-[var(--bg-elevated)]"
    >
      {/* Neontrip-Matched Architectural Hero Canvas With Rounded Bottom Transition */}
      <div
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onFocusCapture={() => setIsFocusWithin(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
            setIsFocusWithin(false);
          }
        }}
        className="hero-section-shell hero-nt-backdrop surface-dark relative overflow-hidden rounded-b-[24px] lg:min-h-[clamp(480px,62vh,640px)] lg:rounded-b-[34px]"
      >
        {/* Desktop Background Layers: Blurred Warm Ambient Storefront + Unobstructed Right-62% Sign Stage */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden lg:block"
        >
          {HERO_SLIDES.map((slide, idx) => {
            const isActive = idx === activeIndex;
            return (
              <div
                key={`desktop-scene-${slide.id}`}
                className="absolute inset-0 transition-opacity duration-[var(--dur-slower)] ease-[var(--ease-editorial)]"
                style={{ opacity: isActive ? 1 : 0 }}
              >
                {/* Layer 1: Soft Warm Architectural Ambient Backdrop Across Left/Full Width */}
                <div className="hero-nt-ambient absolute inset-0">
                  <SignStudioPreview
                    variant="photo"
                    imageSrc={slide.onImage}
                    offImageSrc={slide.offImage}
                    alt=""
                    aspectClass="h-full w-full"
                    className="h-full w-full"
                    priority={idx === 0}
                    loading="eager"
                    sizes="100vw"
                    supportsDayNight
                    lit={isLit}
                  />
                </div>

                {/* Layer 2: Unobstructed Right-62% Crisp Signage Photo Feathering Into Left Ambience */}
                <div className="hero-nt-right-stage">
                  <SignStudioPreview
                    variant="photo"
                    imageSrc={slide.onImage}
                    offImageSrc={slide.offImage}
                    alt={isActive ? slide.alt : ""}
                    aspectClass="h-full w-full"
                    className="h-full w-full"
                    priority={idx === 0}
                    loading="eager"
                    sizes="62vw"
                    supportsDayNight
                    lit={isLit}
                  />
                </div>
              </div>
            );
          })}

          {/* Gentle Left Typography Readability Gradient + Bottom Marquee Feather (Zero Cover Over Right Sign) */}
          <div className="hero-nt-scrim absolute inset-0 z-[1]" />
        </div>

        {/* Desktop Interactive Hover Sensor Over Right Sign Showcase (Hover -> Light OFF, Leave -> Light ON) */}
        <div
          aria-hidden="true"
          onMouseEnter={() => setIsLit(false)}
          onMouseLeave={() => setIsLit(true)}
          onClick={() => setIsLit((prev) => !prev)}
          className="absolute inset-y-0 right-0 left-[44%] z-[2] hidden cursor-pointer lg:block"
        />

        {/* Mobile/Tablet Unobstructed Top Photo Showcase Strip (< 1024px portrait, Right Split in mobile landscape) */}
        <div className="hero-nt-mobile-mask relative z-10 aspect-[16/10] max-h-[205px] w-full overflow-hidden sm:max-h-[320px] md:max-h-[430px] lg:hidden">
          {HERO_SLIDES.map((slide, idx) => {
            const isActive = idx === activeIndex;
            return (
              <div
                key={`mobile-scene-${slide.id}`}
                aria-hidden={!isActive}
                className="pointer-events-none absolute inset-0 transition-opacity duration-[var(--dur-slower)] ease-[var(--ease-editorial)]"
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
                  loading="eager"
                  sizes="100vw"
                  supportsDayNight
                  lit={isLit}
                />
              </div>
            );
          })}

          <button
            type="button"
            onClick={() => setIsLit((prev) => !prev)}
            aria-pressed={isLit}
            aria-label={`${activeSlide.title} — toggle day and night sign illumination`}
            className="absolute inset-0 z-10 cursor-pointer border-0 bg-transparent p-0 focus-visible:outline-[3px] focus-visible:outline-offset-[-3px]"
          />
        </div>

        {/* Unified Foreground Content + Previous Version Nav Dot Pill + Trust Marquee */}
        <div className="hero-nt-foreground relative z-20 flex flex-col justify-between lg:pointer-events-none lg:min-h-[clamp(480px,62vh,640px)]">
          {/* Top-Left / Center Editorial Copy (Strictly <= 44% on Desktop so Sign Showcase Stays Unobstructed) */}
          <div className="hero-nt-copy-wrap site-container pt-0.5 pb-3 sm:pt-1 sm:pb-4 lg:pointer-events-none lg:flex lg:flex-1 lg:items-center lg:py-5 xl:py-8">
            <div className="hero-nt-copy w-full max-w-xl lg:pointer-events-auto lg:max-w-[44%]">
              {/* Mobile & Tablet Row: UL 48 Badge + Unobstructed Light Toggle Directly Below Photo */}
              <div className="flex flex-wrap items-center justify-between gap-2 lg:block">
                <div
                  className="inline-flex max-w-full items-center gap-2 rounded-[var(--radius-lg)] border px-3 py-1.5 text-[length:var(--text-sm)] font-semibold uppercase tracking-[0.06em] backdrop-blur-md sm:px-3.5 sm:text-[length:var(--text-md)] sm:tracking-[0.08em]"
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, var(--ink) 70%, transparent)",
                    borderColor:
                      "color-mix(in srgb, var(--surface-white) 24%, transparent)",
                    color: "var(--local-fg)",
                  }}
                >
                  <ShieldCheckIcon className="h-4 w-4 shrink-0 text-[var(--accent-text)]" />
                  <span className="truncate">
                    UL 48{" "}
                    <span className="hero-badge-extended hidden sm:inline">
                      Listed · File{" "}
                    </span>
                    #{BRAND_FACTS.ulFileNumber}
                    <span className="hidden xl:inline"> · Factory-Direct</span>
                  </span>
                </div>

                <button
                  type="button"
                  aria-pressed={isLit}
                  onClick={() => setIsLit((prev) => !prev)}
                  className="light-toggle lg:hidden"
                >
                  <span className="light-toggle__track" aria-hidden="true">
                    <span className="light-toggle__thumb">
                      <LightbulbIcon className="h-3.5 w-3.5" />
                    </span>
                  </span>
                  <span>{isLit ? "Lights ON" : "Lights OFF"}</span>
                </button>
              </div>

              <h1 className="display-hero m-0 mt-2.5 text-[var(--local-fg)] sm:mt-3.5 lg:mt-4">
                Architectural Channel Letters. Factory-Direct to Your
                Storefront.
              </h1>

              <p className="hero-nt-copy-desc mt-2.5 max-w-[480px] text-[length:var(--text-xl)] leading-[1.5] text-[var(--local-fg-muted)] sm:mt-3.5 sm:text-[length:var(--text-3xl)] lg:text-[length:var(--text-4xl)]">
                UL 48 listed (#{BRAND_FACTS.ulFileNumber}) custom illuminated
                channel letters, halo signage, and push-thru cabinets built to
                NEC Article 600 standards.
                <span className="hero-nt-desc-extra">
                  {" "}
                  Shipped nationwide in {BRAND_FACTS.leadTimeDays} with a free
                  3D Day/Night mockup within 24 hours.
                </span>
              </p>

              <div className="hero-nt-cta-row mt-3.5 flex flex-wrap items-center gap-2.5 sm:mt-5 sm:gap-3.5">
                <PillButton href="/quote" variant="light-on-dark">
                  Request a Quote
                </PillButton>
                <PillButton href="/portfolio" variant="ghost-on-dark">
                  Explore Portfolio
                </PillButton>
              </div>
            </div>
          </div>

          {/* Bottom Controls Row: Active Slide Link Pill + Desktop Day/Night Toggle + Previous Version Dot Navigation Pill */}
          <div className="hero-nt-bottom-bar site-container pb-2.5 sm:pb-3 lg:pointer-events-auto">
            <div
              onKeyDown={handleControlsKeyDown}
              className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3"
            >
              <Link
                href={activeSlide.productHref}
                className="group inline-flex min-h-[42px] max-w-full min-w-0 items-center gap-2.5 rounded-[var(--radius-lg)] border px-4 py-1.5 text-[length:var(--text-lg)] text-[var(--local-fg)] no-underline backdrop-blur-md transition-colors hover:border-[var(--accent-glow)] active:scale-[0.98]"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--ink) 74%, transparent)",
                  borderColor:
                    "color-mix(in srgb, var(--surface-white) 22%, transparent)",
                }}
              >
                <ProductServiceIcon
                  iconKey={activeSlide.iconKey}
                  className="h-4 w-4 shrink-0 text-[var(--accent-text)]"
                />
                <span className="truncate font-medium">{activeSlide.title}</span>
                <ArrowRightIcon className="h-3.5 w-3.5 shrink-0 text-[var(--accent-text)] transition-transform group-hover:translate-x-1" />
              </Link>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  aria-pressed={isLit}
                  onClick={() => setIsLit((prev) => !prev)}
                  className="light-toggle hidden lg:inline-flex"
                >
                  <span className="light-toggle__track" aria-hidden="true">
                    <span className="light-toggle__thumb">
                      <LightbulbIcon className="h-3.5 w-3.5" />
                    </span>
                  </span>
                  <span className="xl:hidden">
                    {isLit ? "Lights ON" : "Lights OFF"}
                  </span>
                  <span className="hidden xl:inline">
                    {isLit
                      ? "Lights ON — Night Facade"
                      : "Lights OFF — Architectural Day"}
                  </span>
                </button>

                {/* Previous Version Dot Navigation Pill (< • • ━━ • • > | ||) */}
                <div
                  role="group"
                  aria-label="Hero showcase slide controls"
                  className="hero-nav-pill inline-flex shrink-0 items-center gap-1 rounded-[var(--radius-lg)] p-1"
                >
                  <button
                    type="button"
                    onClick={() => selectSlide(activeIndex - 1)}
                    aria-label="Previous featured sign slide"
                    className="hero-nav-pill__btn"
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </button>

                  <div className="flex items-center gap-0.5 px-1">
                    {HERO_SLIDES.map((slide, idx) => {
                      const isSelected = idx === activeIndex;
                      return (
                        <button
                          key={slide.id}
                          ref={(el) => {
                            dotRefs.current[idx] = el;
                          }}
                          type="button"
                          onClick={() => selectSlide(idx)}
                          onKeyDown={(e) => handleDotKeyDown(e, idx)}
                          aria-label={`Show slide ${idx + 1} of ${HERO_SLIDES.length}: ${slide.badge}`}
                          aria-current={isSelected ? "true" : undefined}
                          className="hero-nav-dot"
                        >
                          <span
                            aria-hidden="true"
                            className="hero-nav-dot__bar"
                          />
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => selectSlide(activeIndex + 1)}
                    aria-label="Next featured sign slide"
                    className="hero-nav-pill__btn"
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
                    className="hero-nav-pill__btn"
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
          </div>

          {/* Seamless Bottom Trust Marquee Strip Inside Hero Canvas */}
          <div
            className="hero-brands relative z-10 border-t py-3 lg:pointer-events-auto"
            style={{
              borderColor:
                "color-mix(in srgb, var(--surface-white) 16%, transparent)",
              background:
                "linear-gradient(180deg, transparent 0%, color-mix(in srgb, var(--ink) 74%, transparent) 100%)",
            }}
            aria-label="BASISSIGN Engineering and Compliance Standards"
          >
            <div className="hero-brands__track items-center">
              {TRUST_MARQUEE_ITEMS.map((item) => (
                <span
                  key={`primary-${item}`}
                  className="inline-flex shrink-0 items-center gap-2.5 rounded-[var(--radius-lg)] border px-3.5 py-1.5 text-[length:var(--text-lg)] font-medium text-[var(--local-fg)]"
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, var(--ink) 78%, transparent)",
                    borderColor:
                      "color-mix(in srgb, var(--surface-white) 18%, transparent)",
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
                  className="inline-flex shrink-0 items-center gap-2.5 rounded-[var(--radius-lg)] border px-3.5 py-1.5 text-[length:var(--text-lg)] font-medium text-[var(--local-fg)]"
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, var(--ink) 78%, transparent)",
                    borderColor:
                      "color-mix(in srgb, var(--surface-white) 18%, transparent)",
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
        </div>
      </div>

      {/* Theme-Adaptive B2B Manufacturing Proof Band Directly Beneath Hero (Light + Dark Clean) */}
      <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
        <div className="site-container py-6 sm:py-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center lg:gap-10">
            <div className="max-w-xs shrink-0">
              <p className="ui-eyebrow text-[var(--accent-text)]">
                UL 48 Certified Manufacturing
              </p>
              <p className="m-0 mt-1 text-[length:var(--text-4xl)] font-medium text-[var(--text-primary)]">
                Proven at commercial &amp; trade scale nationwide.
              </p>
            </div>

            <dl className="grid flex-1 grid-cols-2 gap-x-6 gap-y-4 border-t border-[var(--border-subtle)] pt-5 sm:grid-cols-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
              <div className="min-w-0">
                <dt className="text-[length:var(--text-md)] font-medium text-[var(--text-muted-theme)]">
                  US Storefronts Served
                </dt>
                <dd className="m-0 mt-1 text-[clamp(1.35rem,2.1vw,1.85rem)] font-semibold leading-tight text-[var(--text-primary)]">
                  {BRAND_FACTS.businessesServed}
                </dd>
              </div>
              <div className="min-w-0">
                <dt className="text-[length:var(--text-md)] font-medium text-[var(--text-muted-theme)]">
                  Standard Lead Time
                </dt>
                <dd className="m-0 mt-1 text-[clamp(1.15rem,1.9vw,1.65rem)] font-semibold leading-tight text-[var(--text-primary)]">
                  {BRAND_FACTS.leadTimeDays}
                </dd>
              </div>
              <div className="min-w-0">
                <dt className="text-[length:var(--text-md)] font-medium text-[var(--text-muted-theme)]">
                  Freight Damage Rate
                </dt>
                <dd className="m-0 mt-1 text-[clamp(1.35rem,2.1vw,1.85rem)] font-semibold leading-tight text-[var(--text-primary)]">
                  {BRAND_FACTS.freightDamageRate}
                </dd>
              </div>
              <div className="min-w-0">
                <dt className="text-[length:var(--text-md)] font-medium text-[var(--text-muted-theme)]">
                  Full Factory Warranty
                </dt>
                <dd className="m-0 mt-1 text-[clamp(1.35rem,2.1vw,1.85rem)] font-semibold leading-tight text-[var(--text-primary)]">
                  {BRAND_FACTS.warrantyYears} Years
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
