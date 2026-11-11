"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { BRAND_FACTS } from "@/data/catalog";
import {
  PORTFOLIO_CATEGORIES,
  PORTFOLIO_ITEMS,
  type PortfolioCategoryId,
  type PortfolioItem,
} from "@/data/portfolio";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  PortfolioGridIcon,
  ProductServiceIcon,
  ResetZoomIcon,
  ShieldCheckIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "./Icons";
import { PillButton } from "./PillButton";

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.5;

interface DragSession {
  pointerId: number;
  startX: number;
  startY: number;
  panStartX: number;
  panStartY: number;
  moved: number;
}

export function PortfolioGallery() {
  const [activeCategory, setActiveCategory] =
    useState<PortfolioCategoryId>("all");
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState<number>(MIN_ZOOM);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const dragSessionRef = useRef<DragSession | null>(null);

  const filteredItems = useMemo<readonly PortfolioItem[]>(() => {
    if (activeCategory === "all") return PORTFOLIO_ITEMS;
    return PORTFOLIO_ITEMS.filter((item) => item.categoryId === activeCategory);
  }, [activeCategory]);

  const categoryCounts = useMemo(() => {
    const counts: Record<PortfolioCategoryId, number> = {
      all: PORTFOLIO_ITEMS.length,
      "front-lit": 0,
      "halo-lit": 0,
      "blade-cabinet": 0,
      "led-neon": 0,
      "metal-ada": 0,
    };
    for (const item of PORTFOLIO_ITEMS) {
      counts[item.categoryId] += 1;
    }
    return counts;
  }, []);

  const activeItem =
    activeItemIndex !== null ? (filteredItems[activeItemIndex] ?? null) : null;

  const resetZoomAndPan = useCallback(() => {
    setZoom(MIN_ZOOM);
    setPan({ x: 0, y: 0 });
    setIsDragging(false);
    dragSessionRef.current = null;
  }, []);

  const openModalForIndex = (index: number, triggerEl: HTMLButtonElement) => {
    lastTriggerRef.current = triggerEl;
    resetZoomAndPan();
    setActiveItemIndex(index);
  };

  const closeModal = useCallback(() => {
    setActiveItemIndex(null);
    resetZoomAndPan();
    window.setTimeout(() => {
      lastTriggerRef.current?.focus();
    }, 0);
  }, [resetZoomAndPan]);

  const showPrevProject = useCallback(() => {
    if (filteredItems.length === 0) return;
    resetZoomAndPan();
    setActiveItemIndex((prev) => {
      if (prev === null) return 0;
      return (prev - 1 + filteredItems.length) % filteredItems.length;
    });
  }, [filteredItems.length, resetZoomAndPan]);

  const showNextProject = useCallback(() => {
    if (filteredItems.length === 0) return;
    resetZoomAndPan();
    setActiveItemIndex((prev) => {
      if (prev === null) return 0;
      return (prev + 1) % filteredItems.length;
    });
  }, [filteredItems.length, resetZoomAndPan]);

  const clampPan = useCallback(
    (rawX: number, rawY: number, currentZoom: number) => {
      if (currentZoom <= 1.01) return { x: 0, y: 0 };
      const rect = stageRef.current?.getBoundingClientRect();
      const maxX = rect ? (rect.width * (currentZoom - 1)) / 2 : 0;
      const maxY = rect ? (rect.height * (currentZoom - 1)) / 2 : 0;
      return {
        x: Math.max(-maxX, Math.min(maxX, rawX)),
        y: Math.max(-maxY, Math.min(maxY, rawY)),
      };
    },
    []
  );

  const adjustZoom = useCallback(
    (nextZoomRaw: number) => {
      const clamped = Math.max(
        MIN_ZOOM,
        Math.min(MAX_ZOOM, Number(nextZoomRaw.toFixed(2)))
      );
      setZoom(clamped);
      if (clamped <= 1.01) {
        setPan({ x: 0, y: 0 });
      } else {
        setPan((prev) => clampPan(prev.x, prev.y, clamped));
      }
    },
    [clampPan]
  );

  // Modal lifecycle: scroll lock, focus initialization, Escape/Arrow/Zoom shortcuts & Tab trap
  useEffect(() => {
    if (activeItemIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 20);

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeModal();
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showPrevProject();
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        showNextProject();
        return;
      }

      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        adjustZoom(zoom + ZOOM_STEP);
        return;
      }

      if (event.key === "-") {
        event.preventDefault();
        adjustZoom(zoom - ZOOM_STEP);
        return;
      }

      if (event.key === "0") {
        event.preventDefault();
        resetZoomAndPan();
        return;
      }

      if (event.key === "Tab" && modalRef.current) {
        const focusables = Array.from(
          modalRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
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
  }, [
    activeItemIndex,
    adjustZoom,
    closeModal,
    resetZoomAndPan,
    showNextProject,
    showPrevProject,
    zoom,
  ]);

  const handleStagePointerDown = (
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragSessionRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      panStartX: pan.x,
      panStartY: pan.y,
      moved: 0,
    };
    if (zoom > 1.01) {
      setIsDragging(true);
    }
  };

  const handleStagePointerMove = (
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    const session = dragSessionRef.current;
    if (!session || session.pointerId !== event.pointerId) return;

    const dx = event.clientX - session.startX;
    const dy = event.clientY - session.startY;
    session.moved = Math.max(session.moved, Math.hypot(dx, dy));

    if (zoom > 1.01) {
      setPan(clampPan(session.panStartX + dx, session.panStartY + dy, zoom));
    }
  };

  const handleStagePointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    const session = dragSessionRef.current;
    if (!session || session.pointerId !== event.pointerId) return;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const wasClick = session.moved < 6;
    dragSessionRef.current = null;
    setIsDragging(false);

    if (wasClick) {
      if (zoom > 1.01) {
        resetZoomAndPan();
      } else {
        adjustZoom(2);
      }
    }
  };

  const handleCategorySelect = (category: PortfolioCategoryId) => {
    setActiveCategory(category);
    setActiveItemIndex(null);
    resetZoomAndPan();
  };

  return (
    <div>
      {/* Accessible Category Filter Pills */}
      <div
        role="group"
        aria-label="Filter signage installations by product category"
        className="flex flex-wrap items-center gap-2.5"
      >
        <button
          type="button"
          aria-pressed={activeCategory === "all"}
          onClick={() => handleCategorySelect("all")}
          className={`inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-[var(--radius-lg)] border px-4 py-2 text-[length:var(--text-lg)] font-medium transition-all duration-[var(--dur-fast)] active:scale-[0.97] ${
            activeCategory === "all"
              ? "border-[var(--accent-cta)] bg-[var(--ink)] text-[var(--surface-white)]"
              : "border-[var(--border-strong)] bg-[var(--bg-elevated)] text-[var(--text-primary)] hover:border-[var(--accent-cta)] hover:bg-[var(--bg-subtle)]"
          }`}
        >
          <PortfolioGridIcon
            className={`h-4 w-4 ${
              activeCategory === "all"
                ? "text-[var(--accent-glow)]"
                : "text-[var(--accent-text)]"
            }`}
          />
          <span>All Projects</span>
          <span
            className={`rounded-full px-2 py-0.5 text-[length:var(--text-sm)] font-semibold ${
              activeCategory === "all"
                ? "bg-[color-mix(in_srgb,var(--surface-white)_16%,transparent)] text-[var(--surface-white)]"
                : "bg-[var(--bg-subtle)] text-[var(--text-secondary)]"
            }`}
          >
            {categoryCounts.all}
          </span>
        </button>

        {PORTFOLIO_CATEGORIES.map((category) => {
          const isSelected = activeCategory === category.id;
          return (
            <button
              key={category.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => handleCategorySelect(category.id)}
              className={`inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-[var(--radius-lg)] border px-4 py-2 text-[length:var(--text-lg)] font-medium transition-all duration-[var(--dur-fast)] active:scale-[0.97] ${
                isSelected
                  ? "border-[var(--accent-cta)] bg-[var(--ink)] text-[var(--surface-white)]"
                  : "border-[var(--border-strong)] bg-[var(--bg-elevated)] text-[var(--text-primary)] hover:border-[var(--accent-cta)] hover:bg-[var(--bg-subtle)]"
              }`}
            >
              <ProductServiceIcon
                iconKey={category.iconKey}
                className={`h-4 w-4 ${
                  isSelected
                    ? "text-[var(--accent-glow)]"
                    : "text-[var(--accent-text)]"
                }`}
              />
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

      {/* Results Count Readout */}
      <p className="mt-5 text-[length:var(--text-xl)] text-[var(--text-secondary)]">
        Showing <strong className="text-[var(--text-primary)]">{filteredItems.length}</strong>{" "}
        verified US commercial installations. Select any project card to open the
        high-resolution zoom inspector.
      </p>

      {/* Responsive Installations Grid */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {filteredItems.map((item, idx) => (
          <article
            key={item.id}
            className="group rounded-[var(--radius-xs)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] transition-colors duration-[var(--dur-fast)] hover:border-[var(--accent-cta)]"
          >
            <button
              type="button"
              onClick={(e) => openModalForIndex(idx, e.currentTarget)}
              aria-label={`Inspect ${item.title} (${item.categoryLabel}) in zoom lightbox`}
              className="flex h-full w-full cursor-pointer flex-col rounded-[var(--radius-xs)] text-left transition-transform duration-[var(--dur-instant)] active:scale-[0.99]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-[calc(var(--radius-xs)-1px)] bg-[var(--surface-black)]">
                <Image
                  src={item.image}
                  alt={`${item.title} — ${item.signSpec}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 25vw"
                  className="object-cover transition-transform duration-[var(--dur-slower)] ease-[var(--ease-editorial)] group-hover:scale-[1.03]"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-[var(--radius-lg)] border px-3 py-1 text-[length:var(--text-sm)] font-medium opacity-95 backdrop-blur-md transition-opacity group-hover:opacity-100"
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, var(--surface-black) 72%, transparent)",
                    borderColor:
                      "color-mix(in srgb, var(--surface-white) 24%, transparent)",
                    color: "var(--surface-white)",
                  }}
                >
                  <ZoomInIcon className="h-3.5 w-3.5 text-[var(--accent-glow)]" />
                  <span>Inspect</span>
                </span>
              </div>

              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-page)] px-3 py-1 text-[length:var(--text-sm)] font-semibold text-[var(--accent-text)]">
                      <ProductServiceIcon
                        iconKey={item.iconKey}
                        className="h-3.5 w-3.5"
                      />
                      <span>{item.categoryLabel}</span>
                    </span>
                    <span className="text-[length:var(--text-sm)] font-medium text-[var(--text-muted-theme)]">
                      {item.industry}
                    </span>
                  </div>

                  <h2 className="mt-3 text-[length:var(--text-4xl)] font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-text)]">
                    {item.title}
                  </h2>

                  <p className="mt-1.5 text-[length:var(--text-xl)] leading-snug text-[var(--text-secondary)]">
                    {item.signSpec}
                  </p>
                </div>
              </div>
            </button>
          </article>
        ))}
      </div>

      {/* High-Resolution Zoom & Pan Lightbox Modal */}
      {activeItem && activeItemIndex !== null && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-6"
          role="presentation"
        >
          {/* Backdrop Scrim */}
          <div
            aria-hidden="true"
            onClick={closeModal}
            className="fixed inset-0 backdrop-blur-md"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--surface-black) 82%, transparent)",
            }}
          />

          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="lightbox-project-title"
            className="surface-dark relative z-[111] flex max-h-[94dvh] w-full max-w-6xl flex-col overflow-y-auto overflow-x-hidden rounded-[var(--radius-xs)] border shadow-2xl"
            style={{
              borderColor: "var(--local-border)",
              backgroundColor: "var(--local-bg)",
            }}
          >
            {/* Top Toolbar: Category, Counter, Zoom Controls & Close */}
            <div
              className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 sm:px-6"
              style={{
                borderColor: "var(--local-border)",
                backgroundColor: "var(--local-elevated)",
              }}
            >
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-lg)] border border-[var(--local-border)] px-3 py-1 text-[length:var(--text-md)] font-semibold text-[var(--accent-text)]">
                  <ProductServiceIcon
                    iconKey={activeItem.iconKey}
                    className="h-4 w-4"
                  />
                  <span>{activeItem.categoryLabel}</span>
                </span>
                <span className="text-[length:var(--text-lg)] font-medium text-[var(--local-fg-muted)]">
                  {activeItemIndex + 1} / {filteredItems.length}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => adjustZoom(zoom - ZOOM_STEP)}
                  disabled={zoom <= MIN_ZOOM}
                  aria-label="Zoom out image"
                  className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-[var(--radius-lg)] border border-[var(--local-border)] bg-[var(--local-bg)] text-[var(--local-fg)] transition-colors hover:border-[var(--accent-glow)] active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ZoomOutIcon className="h-4 w-4" />
                </button>

                <span
                  aria-live="polite"
                  className="min-w-[54px] text-center text-[length:var(--text-lg)] font-semibold text-[var(--local-fg)]"
                >
                  {Math.round(zoom * 100)}%
                </span>

                <button
                  type="button"
                  onClick={() => adjustZoom(zoom + ZOOM_STEP)}
                  disabled={zoom >= MAX_ZOOM}
                  aria-label="Zoom in image"
                  className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-[var(--radius-lg)] border border-[var(--local-border)] bg-[var(--local-bg)] text-[var(--local-fg)] transition-colors hover:border-[var(--accent-glow)] active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ZoomInIcon className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={resetZoomAndPan}
                  disabled={zoom <= 1.01 && pan.x === 0 && pan.y === 0}
                  aria-label="Reset zoom to 100%"
                  className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-[var(--radius-lg)] border border-[var(--local-border)] bg-[var(--local-bg)] px-3 text-[length:var(--text-md)] font-medium text-[var(--local-fg)] transition-colors hover:border-[var(--accent-glow)] active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ResetZoomIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Reset</span>
                </button>

                <span
                  aria-hidden="true"
                  className="mx-1 h-5 w-px"
                  style={{ backgroundColor: "var(--local-border)" }}
                />

                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={closeModal}
                  aria-label="Close installation lightbox"
                  className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-[var(--radius-lg)] border border-[var(--local-border)] bg-[var(--local-bg)] text-[var(--local-fg)] transition-colors hover:border-[var(--accent-glow)] hover:text-[var(--accent-text)] active:scale-[0.96]"
                >
                  <CloseIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Interactive Uncropped Image Zoom & Drag Pan Stage */}
            <div
              ref={stageRef}
              onPointerDown={handleStagePointerDown}
              onPointerMove={handleStagePointerMove}
              onPointerUp={handleStagePointerEnd}
              onPointerCancel={handleStagePointerEnd}
              className="relative h-[44dvh] w-full shrink-0 touch-none select-none overflow-hidden lg:h-[56dvh]"
              style={{
                backgroundColor: "var(--surface-black)",
                cursor:
                  zoom > 1.01
                    ? isDragging
                      ? "grabbing"
                      : "grab"
                    : "zoom-in",
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
                  transformOrigin: "center center",
                  transition: isDragging
                    ? "none"
                    : "transform 220ms var(--ease-editorial)",
                }}
              >
                <Image
                  src={activeItem.image}
                  alt={`${activeItem.title} — ${activeItem.signSpec}`}
                  fill
                  priority
                  sizes="92vw"
                  className="pointer-events-none select-none object-contain p-2 sm:p-4"
                />
              </div>

              {/* Quick Prev / Next Floating Controls */}
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={showPrevProject}
                aria-label="Previous portfolio project"
                className="absolute left-3 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-[var(--radius-lg)] border border-[var(--local-border)] text-[var(--surface-white)] backdrop-blur-md transition-colors hover:border-[var(--accent-glow)] active:scale-[0.96]"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--surface-black) 72%, transparent)",
                }}
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>

              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={showNextProject}
                aria-label="Next portfolio project"
                className="absolute right-3 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-[var(--radius-lg)] border border-[var(--local-border)] text-[var(--surface-white)] backdrop-blur-md transition-colors hover:border-[var(--accent-glow)] active:scale-[0.96]"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--surface-black) 72%, transparent)",
                }}
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Bottom Specification Footer & Conversion CTA */}
            <div
              className="flex flex-col justify-between gap-4 border-t px-4 py-4 sm:flex-row sm:items-center sm:px-6"
              style={{
                borderColor: "var(--local-border)",
                backgroundColor: "var(--local-elevated)",
              }}
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-[length:var(--text-md)] text-[var(--local-fg-muted)]">
                  <span>{activeItem.industry}</span>
                  {activeItem.categoryId !== "metal-ada" && (
                    <span className="inline-flex items-center gap-1 text-[var(--accent-text)]">
                      · <ShieldCheckIcon className="h-3.5 w-3.5" /> UL 48 #
                      {BRAND_FACTS.ulFileNumber}
                    </span>
                  )}
                </div>
                <h2
                  id="lightbox-project-title"
                  className="mt-1 truncate text-[length:var(--text-4xl)] font-semibold text-[var(--local-fg)]"
                >
                  {activeItem.title}
                </h2>
                <p className="mt-0.5 text-[length:var(--text-xl)] text-[var(--local-fg-muted)]">
                  {activeItem.signSpec}
                </p>
              </div>

              <div className="shrink-0">
                <PillButton
                  href={`/quote?type=${activeItem.quoteTypeId}`}
                  variant="light-on-dark"
                >
                  Quote Similar Sign
                </PillButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
