"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type FocusEvent, type KeyboardEvent } from "react";
import { BLOG_POST_COUNT } from "@/data/blog-shared";
import { BRAND_FACTS, PRODUCT_CATALOG } from "@/data/catalog";
import { PORTFOLIO_ITEMS } from "@/data/portfolio";
import {
  ArrowRightIcon,
  BookOpenIcon,
  ChevronDownIcon,
  CloseIcon,
  LayersIcon,
  MailIcon,
  MenuIcon,
  MessageSquareIcon,
  MoonIcon,
  PhoneIcon,
  PortfolioGridIcon,
  ProductServiceIcon,
  ShieldCheckIcon,
  SunIcon,
} from "./Icons";
import { PillButton } from "./PillButton";
import { useTheme } from "./ThemeProvider";

export function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [trackedPath, setTrackedPath] = useState(pathname);
  const [productsOpen, setProductsOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (trackedPath !== pathname) {
    setTrackedPath(pathname);
    setProductsOpen(false);
    setDrawerOpen(false);
  }

  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownTriggerRef = useRef<HTMLButtonElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const drawerCloseRef = useRef<HTMLButtonElement>(null);

  // Outside click & Escape handling for desktop Products dropdown
  useEffect(() => {
    if (!productsOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProductsOpen(false);
      }
    };

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setProductsOpen(false);
        dropdownTriggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [productsOpen]);

  // Focus-trap, Escape close & body scroll lock for Mobile/Tablet Kinetic Drawer
  useEffect(() => {
    if (!drawerOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      drawerCloseRef.current?.focus();
    }, 20);

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setDrawerOpen(false);
        window.setTimeout(() => menuTriggerRef.current?.focus(), 0);
        return;
      }

      if (event.key === "Tab" && drawerRef.current) {
        const focusables = Array.from(
          drawerRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => el.offsetParent !== null);

        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [drawerOpen]);

  const handleDropdownBlur = (event: FocusEvent<HTMLDivElement>) => {
    const nextFocused = event.relatedTarget as Node | null;
    if (!event.currentTarget.contains(nextFocused)) {
      setProductsOpen(false);
    }
  };

  const handleDropdownKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setProductsOpen(true);
    }
  };

  const closeDrawerAndRestore = () => {
    setDrawerOpen(false);
    window.setTimeout(() => menuTriggerRef.current?.focus(), 0);
  };

  return (
    <>
      <header
        className="sticky top-0 z-50 min-h-[74px] border-b border-[var(--border-subtle)] backdrop-blur-md transition-colors duration-[var(--dur-normal)] ease-[var(--ease-editorial)]"
        style={{
          backgroundColor: "var(--header-bg)",
          color: "var(--header-fg)",
        }}
      >
        <div className="site-container flex min-h-[74px] items-center justify-between gap-2 py-2 xl:gap-3">
          {/* Brand Logo & UL 48 Identity */}
          <div className="flex min-w-0 items-center gap-2 xl:gap-3">
            <Link
              href="/"
              aria-label="BASISSIGN — Home"
              className="group inline-flex shrink-0 items-center rounded-[var(--radius-lg)] py-1 pr-1 no-underline transition-opacity duration-[var(--dur-fast)] hover:opacity-85 active:scale-[0.98] xl:pr-2"
            >
              <span className="sr-only">{BRAND_FACTS.name}</span>
              <Image
                src="/brand/basissign-logo-light.svg"
                alt=""
                aria-hidden="true"
                width={180}
                height={85}
                priority
                unoptimized
                className="brand-logo--light h-10 w-auto sm:h-11"
              />
              <Image
                src="/brand/basissign-logo-dark.svg"
                alt=""
                aria-hidden="true"
                width={192}
                height={90}
                priority
                unoptimized
                className="brand-logo--dark h-10 w-auto sm:h-11"
              />
            </Link>

            <Link
              href="/ul-48-compliance"
              className="hidden shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-1 text-[length:var(--text-sm)] font-semibold tracking-wide text-[var(--text-secondary)] no-underline transition-colors duration-[var(--dur-fast)] hover:border-[var(--accent-cta)] hover:text-[var(--text-primary)] xl:inline-flex"
            >
              <ShieldCheckIcon className="h-3.5 w-3.5 text-[var(--accent-text)]" />
              <span>UL 48 #{BRAND_FACTS.ulFileNumber}</span>
            </Link>
          </div>

          {/* Desktop Primary Navigation */}
          <nav
            aria-label="Primary"
            className="hidden items-center gap-0.5 lg:flex xl:gap-1"
          >
            <div
              ref={dropdownRef}
              onBlur={handleDropdownBlur}
              className="relative"
            >
              <button
                ref={dropdownTriggerRef}
                type="button"
                aria-expanded={productsOpen}
                aria-haspopup="menu"
                aria-controls="desktop-products-menu"
                onClick={() => setProductsOpen((prev) => !prev)}
                onKeyDown={handleDropdownKeyDown}
                className="inline-flex min-h-[44px] shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-[var(--radius-lg)] px-2.5 py-2 text-[length:var(--text-lg)] font-medium text-[var(--text-primary)] transition-colors duration-[var(--dur-fast)] hover:bg-[var(--bg-subtle)] active:scale-[0.98] xl:px-3.5 xl:text-[length:var(--text-xl)]"
              >
                <span>Products</span>
                <ChevronDownIcon
                  className={`h-4 w-4 transition-transform duration-[var(--dur-normal)] ease-[var(--ease-editorial)] ${
                    productsOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {productsOpen && (
                <div
                  id="desktop-products-menu"
                  role="menu"
                  aria-label="BASISSIGN Sign Systems"
                  className="absolute left-0 top-full mt-2 w-[400px] rounded-[var(--radius-xs)] border border-[var(--border-strong)] bg-[var(--bg-elevated)] p-2.5 shadow-2xl"
                >
                  <div className="mb-1.5 px-3 pt-1 text-[length:var(--text-xs)] font-semibold uppercase tracking-[0.1em] text-[var(--text-muted-theme)]">
                    Architectural &amp; UL 48 Systems
                  </div>
                  <ul className="m-0 flex list-none flex-col gap-1 p-0">
                    {PRODUCT_CATALOG.map((item) => (
                      <li key={item.slug} role="none">
                        <Link
                          role="menuitem"
                          href={`/products/${item.slug}`}
                          onClick={() => setProductsOpen(false)}
                          className="group flex items-center justify-between gap-3 rounded-[20px] px-3 py-2.5 text-left no-underline transition-colors duration-[var(--dur-fast)] hover:bg-[var(--bg-subtle)] active:scale-[0.99]"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <span
                              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--accent-text)] transition-colors group-hover:border-[var(--accent-cta)]"
                              aria-hidden="true"
                            >
                              <ProductServiceIcon iconKey={item.iconKey} className="h-4 w-4" />
                            </span>
                            <div className="min-w-0">
                              <div className="text-[length:var(--text-xl)] font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-text)]">
                                {item.shortName}
                              </div>
                              <div className="truncate text-[length:var(--text-md)] text-[var(--text-muted-theme)]">
                                {item.chapterCode} · {item.leadTime}
                              </div>
                            </div>
                          </div>
                          <ArrowRightIcon className="h-4 w-4 shrink-0 text-[var(--text-muted-theme)] transition-transform duration-[var(--dur-fast)] group-hover:translate-x-1 group-hover:text-[var(--accent-text)]" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 border-t border-[var(--border-subtle)] pt-2">
                    <Link
                      role="menuitem"
                      href="/ul-48-compliance"
                      onClick={() => setProductsOpen(false)}
                      className="flex items-center justify-between rounded-[20px] px-3.5 py-2.5 text-[length:var(--text-lg)] font-semibold text-[var(--text-primary)] no-underline transition-colors duration-[var(--dur-fast)] hover:bg-[var(--bg-subtle)] hover:text-[var(--accent-text)]"
                    >
                      <span className="inline-flex items-center gap-2">
                        <ShieldCheckIcon className="h-4 w-4 text-[var(--accent-text)]" />
                        UL 48 (#E555259) &amp; NEC 600 Specs
                      </span>
                      <ArrowRightIcon className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/portfolio"
              aria-current={pathname === "/portfolio" ? "page" : undefined}
              className={`inline-flex min-h-[44px] shrink-0 items-center whitespace-nowrap rounded-[var(--radius-lg)] px-2.5 py-2 text-[length:var(--text-lg)] font-medium no-underline transition-colors duration-[var(--dur-fast)] active:scale-[0.98] xl:px-3.5 xl:text-[length:var(--text-xl)] ${
                pathname === "/portfolio"
                  ? "bg-[var(--bg-subtle)] text-[var(--accent-text)]"
                  : "text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
              }`}
            >
              Portfolio
            </Link>

            <Link
              href="/blog"
              aria-current={
                pathname === "/blog" || pathname?.startsWith("/blog/")
                  ? "page"
                  : undefined
              }
              className={`inline-flex min-h-[44px] shrink-0 items-center whitespace-nowrap rounded-[var(--radius-lg)] px-2.5 py-2 text-[length:var(--text-lg)] font-medium no-underline transition-colors duration-[var(--dur-fast)] active:scale-[0.98] xl:px-3.5 xl:text-[length:var(--text-xl)] ${
                pathname === "/blog" || pathname?.startsWith("/blog/")
                  ? "bg-[var(--bg-subtle)] text-[var(--accent-text)]"
                  : "text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
              }`}
            >
              Blog
            </Link>

            <Link
              href="/ul-48-compliance"
              aria-current={pathname === "/ul-48-compliance" ? "page" : undefined}
              className={`inline-flex min-h-[44px] shrink-0 items-center whitespace-nowrap rounded-[var(--radius-lg)] px-2.5 py-2 text-[length:var(--text-lg)] font-medium no-underline transition-colors duration-[var(--dur-fast)] active:scale-[0.98] xl:px-3.5 xl:text-[length:var(--text-xl)] ${
                pathname === "/ul-48-compliance"
                  ? "bg-[var(--bg-subtle)] text-[var(--accent-text)]"
                  : "text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
              }`}
            >
              UL 48 &amp; Specs
            </Link>

            <Link
              href="/#process"
              className="inline-flex min-h-[44px] shrink-0 items-center whitespace-nowrap rounded-[var(--radius-lg)] px-2.5 py-2 text-[length:var(--text-lg)] font-medium text-[var(--text-primary)] no-underline transition-colors duration-[var(--dur-fast)] hover:bg-[var(--bg-subtle)] active:scale-[0.98] xl:px-3.5 xl:text-[length:var(--text-xl)]"
            >
              Process
            </Link>

            <Link
              href="/contact"
              aria-current={pathname === "/contact" ? "page" : undefined}
              className={`inline-flex min-h-[44px] shrink-0 items-center whitespace-nowrap rounded-[var(--radius-lg)] px-2.5 py-2 text-[length:var(--text-lg)] font-medium no-underline transition-colors duration-[var(--dur-fast)] active:scale-[0.98] xl:px-3.5 xl:text-[length:var(--text-xl)] ${
                pathname === "/contact"
                  ? "bg-[var(--bg-subtle)] text-[var(--accent-text)]"
                  : "text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Right Action Controls */}
          <div className="flex shrink-0 items-center gap-2 xl:gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              aria-pressed={theme === "dark"}
              aria-label={
                theme === "dark"
                  ? "Switch to light architectural theme"
                  : "Switch to dark architectural theme"
              }
              className="theme-toggle"
            >
              <span className="theme-toggle__badge" aria-hidden="true">
                {theme === "dark" ? (
                  <SunIcon className="h-4 w-4" />
                ) : (
                  <MoonIcon className="h-4 w-4" />
                )}
              </span>
              <span className="hidden sm:inline">
                {theme === "dark" ? "Light" : "Dark"}
              </span>
            </button>

            <div className="hidden shrink-0 lg:block">
              <PillButton
                href="/quote"
                variant="cta"
                className="shrink-0 whitespace-nowrap"
              >
                Request a Quote
              </PillButton>
            </div>

            <button
              ref={menuTriggerRef}
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-expanded={drawerOpen}
              aria-controls="mobile-kinetic-drawer"
              aria-label={drawerOpen ? "Close navigation menu" : "Open navigation menu"}
              className="inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center gap-2 rounded-[var(--radius-lg)] border border-[var(--border-strong)] bg-[var(--bg-elevated)] px-3 text-[var(--text-primary)] transition-colors duration-[var(--dur-fast)] hover:border-[var(--accent-cta)] hover:bg-[var(--bg-subtle)] active:scale-[0.97] lg:hidden"
            >
              <MenuIcon className="h-5 w-5" />
              <span className="hidden text-[length:var(--text-lg)] font-medium sm:inline">
                Menu
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile / Tablet Kinetic Drawer Menu */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-[100] lg:hidden"
          role="presentation"
        >
          {/* Backdrop scrim */}
          <div
            aria-hidden="true"
            onClick={closeDrawerAndRestore}
            className="fixed inset-0 backdrop-blur-sm transition-opacity duration-[var(--dur-normal)]"
            style={{
              backgroundColor: "color-mix(in srgb, var(--surface-black) 64%, transparent)",
            }}
          />

          {/* Slide-in Kinetic Panel */}
          <div
            ref={drawerRef}
            id="mobile-kinetic-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
            className="mobile-drawer-panel fixed inset-y-0 right-0 z-[101] flex w-full max-w-[420px] flex-col justify-between overflow-y-auto border-l border-[var(--border-strong)] bg-[var(--bg-page)] px-5 py-5 text-[var(--text-primary)] shadow-2xl sm:px-7"
          >
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
                <Link
                  href="/"
                  aria-label="BASISSIGN — Home"
                  onClick={() => setDrawerOpen(false)}
                  className="inline-flex items-center no-underline"
                >
                  <span className="sr-only">{BRAND_FACTS.name}</span>
                  <Image
                    src="/brand/basissign-logo-light.svg"
                    alt=""
                    aria-hidden="true"
                    width={180}
                    height={85}
                    unoptimized
                    className="brand-logo--light h-9 w-auto"
                  />
                  <Image
                    src="/brand/basissign-logo-dark.svg"
                    alt=""
                    aria-hidden="true"
                    width={192}
                    height={90}
                    unoptimized
                    className="brand-logo--dark h-9 w-auto"
                  />
                </Link>

                <button
                  ref={drawerCloseRef}
                  type="button"
                  onClick={closeDrawerAndRestore}
                  aria-label="Close navigation menu"
                  className="inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-[var(--radius-lg)] border border-[var(--border-strong)] bg-[var(--bg-elevated)] text-[var(--text-primary)] transition-colors duration-[var(--dur-fast)] hover:border-[var(--accent-cta)] hover:text-[var(--accent-text)] active:scale-[0.97]"
                >
                  <CloseIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Products Navigation */}
              <div className="mt-5">
                <p className="ui-eyebrow mb-2 text-[var(--text-muted-theme)]">
                  Sign Systems
                </p>
                <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
                  {PRODUCT_CATALOG.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={`/products/${item.slug}`}
                        onClick={() => setDrawerOpen(false)}
                        className="flex min-h-[46px] items-center justify-between gap-2 rounded-[20px] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3.5 py-2.5 text-[var(--text-primary)] no-underline transition-colors duration-[var(--dur-fast)] hover:border-[var(--accent-cta)] active:scale-[0.99]"
                      >
                        <span className="inline-flex items-center gap-2.5 font-medium text-[length:var(--text-2xl)]">
                          <span
                            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[10px] bg-[var(--bg-subtle)] text-[var(--accent-text)]"
                            aria-hidden="true"
                          >
                            <ProductServiceIcon iconKey={item.iconKey} className="h-4 w-4" />
                          </span>
                          <span>{item.shortName}</span>
                        </span>
                        <span className="text-[length:var(--text-sm)] text-[var(--text-muted-theme)]">
                          {item.leadTime}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Engineering & Sections */}
              <div className="mt-5">
                <p className="ui-eyebrow mb-2 text-[var(--text-muted-theme)]">
                  Engineering &amp; Resources
                </p>
                <div className="grid grid-cols-1 gap-1.5">
                  <Link
                    href="/portfolio"
                    onClick={() => setDrawerOpen(false)}
                    className="flex min-h-[44px] items-center justify-between rounded-[20px] px-3 py-2 text-[length:var(--text-2xl)] font-medium text-[var(--text-primary)] no-underline hover:bg-[var(--bg-subtle)]"
                  >
                    <span className="inline-flex items-center gap-2">
                      <PortfolioGridIcon className="h-4 w-4 text-[var(--accent-text)]" />
                      Our Portfolio ({PORTFOLIO_ITEMS.length} Installations)
                    </span>
                    <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/blog"
                    onClick={() => setDrawerOpen(false)}
                    className="flex min-h-[44px] items-center justify-between rounded-[20px] px-3 py-2 text-[length:var(--text-2xl)] font-medium text-[var(--text-primary)] no-underline hover:bg-[var(--bg-subtle)]"
                  >
                    <span className="inline-flex items-center gap-2">
                      <BookOpenIcon className="h-4 w-4 text-[var(--accent-text)]" />
                      Signage Blog &amp; Guides ({BLOG_POST_COUNT})
                    </span>
                    <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/ul-48-compliance"
                    onClick={() => setDrawerOpen(false)}
                    className="flex min-h-[44px] items-center justify-between rounded-[20px] px-3 py-2 text-[length:var(--text-2xl)] font-medium text-[var(--text-primary)] no-underline hover:bg-[var(--bg-subtle)]"
                  >
                    <span className="inline-flex items-center gap-2">
                      <ShieldCheckIcon className="h-4 w-4 text-[var(--accent-text)]" />
                      UL 48 (#E555259) Compliance
                    </span>
                    <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setDrawerOpen(false)}
                    className="flex min-h-[44px] items-center justify-between rounded-[20px] px-3 py-2 text-[length:var(--text-2xl)] font-medium text-[var(--text-primary)] no-underline hover:bg-[var(--bg-subtle)]"
                  >
                    <span className="inline-flex items-center gap-2">
                      <MessageSquareIcon className="h-4 w-4 text-[var(--accent-text)]" />
                      Contact Engineering Desk
                    </span>
                    <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/#process"
                    onClick={() => setDrawerOpen(false)}
                    className="flex min-h-[44px] items-center justify-between rounded-[20px] px-3 py-2 text-[length:var(--text-2xl)] font-medium text-[var(--text-primary)] no-underline hover:bg-[var(--bg-subtle)]"
                  >
                    <span className="inline-flex items-center gap-2">
                      <LayersIcon className="h-4 w-4 text-[var(--accent-text)]" />
                      3-Step Process &amp; Trade
                    </span>
                    <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom CTA & Direct Contacts */}
            <div className="mt-6 border-t border-[var(--border-subtle)] pt-5">
              <PillButton
                href="/quote"
                variant="cta"
                fullWidth
                className="mb-4"
              >
                Request a Free Quote &amp; 3D Mockup
              </PillButton>

              <div className="flex flex-col gap-2 text-[length:var(--text-lg)] text-[var(--text-secondary)]">
                <a
                  href={BRAND_FACTS.phoneHref}
                  className="inline-flex min-h-[36px] items-center gap-2 text-[var(--text-primary)] no-underline hover:text-[var(--accent-text)]"
                >
                  <PhoneIcon className="h-4 w-4 text-[var(--accent-text)]" />
                  <span>{BRAND_FACTS.phone}</span>
                </a>
                <a
                  href={`mailto:${BRAND_FACTS.email}`}
                  className="inline-flex min-h-[36px] items-center gap-2 text-[var(--text-primary)] no-underline hover:text-[var(--accent-text)]"
                >
                  <MailIcon className="h-4 w-4 text-[var(--accent-text)]" />
                  <span>{BRAND_FACTS.email}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
