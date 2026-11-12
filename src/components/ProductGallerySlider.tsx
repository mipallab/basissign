"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
} from "react";
import type {
  ProductGalleryPhoto,
  ProductGalleryVideo,
} from "@/data/catalog";
import { AlertCircleIcon, PauseIcon, PlayIcon } from "./Icons";
import { SignStudioPreview } from "./SignStudioPreview";

interface ProductGallerySliderProps {
  productName: string;
  shortName: string;
  supportsDayNight: boolean;
  gallery: ProductGalleryPhoto[];
  video: ProductGalleryVideo;
  priority?: boolean;
  sizes?: string;
}

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

export function ProductGallerySlider({
  productName,
  shortName,
  supportsDayNight,
  gallery,
  video,
  priority = false,
  sizes = "(max-width: 1024px) 100vw, 48vw",
}: ProductGallerySliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [cycleKey, setCycleKey] = useState(0);
  const [isLit, setIsLit] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [isFocusWithin, setIsFocusWithin] = useState(false);
  const [isManuallyPaused, setIsManuallyPaused] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const thumbRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  const photoCount = gallery.length;
  const totalItems = photoCount + 1;
  const videoIndex = photoCount;
  const isVideoActive = activeIndex === videoIndex;

  const isAutoPlaying =
    photoCount > 1 &&
    !isVideoActive &&
    !isHovering &&
    !isFocusWithin &&
    !isManuallyPaused &&
    isLit &&
    isInView &&
    !prefersReducedMotion;

  const isAutoPlayingRef = useRef(isAutoPlaying);
  useEffect(() => {
    isAutoPlayingRef.current = isAutoPlaying;
  }, [isAutoPlaying]);

  // Pause offscreen product sliders and reset smoothly when scrolled into viewport
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    if (isVideoActive && !videoError) {
      if (!prefersReducedMotion) {
        const playPromise = el.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(() => {
            // Browser autoplay policy blocked; user still has full native controls.
          });
        }
      }
    } else {
      el.pause();
    }
  }, [isVideoActive, videoError, prefersReducedMotion]);

  const selectIndex = (idx: number, moveFocus = false) => {
    const clamped = Math.max(0, Math.min(idx, totalItems - 1));
    setActiveIndex(clamped);
    setCycleKey((k) => k + 1);
    if (clamped < photoCount) {
      setIsLit(true);
    }
    if (moveFocus) {
      thumbRefs.current[clamped]?.focus();
    }
  };

  const handleProgressComplete = () => {
    if (!isAutoPlayingRef.current || photoCount <= 1) return;
    setActiveIndex((prev) => (prev + 1) % photoCount);
    setCycleKey((k) => k + 1);
  };

  const handleThumbKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    idx: number
  ) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      selectIndex((idx + 1) % totalItems, true);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      selectIndex((idx - 1 + totalItems) % totalItems, true);
    } else if (event.key === "Home") {
      event.preventDefault();
      selectIndex(0, true);
    } else if (event.key === "End") {
      event.preventDefault();
      selectIndex(totalItems - 1, true);
    }
  };

  return (
    <div
      ref={rootRef}
      className="flex flex-col"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onFocusCapture={() => setIsFocusWithin(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setIsFocusWithin(false);
        }
      }}
    >
      {/* Main 16:10 Interactive Stage (Auto-Slide 3s + Hover Light OFF / Mouse-Leave Light ON + Dark Video Theater) */}
      <div
        className="nt-chapter-stage"
        onMouseEnter={() => {
          if (!isVideoActive && supportsDayNight) {
            setIsLit(false);
          }
        }}
        onMouseLeave={() => {
          if (!isVideoActive && supportsDayNight) {
            setIsLit(true);
          }
        }}
        onClick={() => {
          if (!isVideoActive && supportsDayNight) {
            setIsLit((prev) => !prev);
          }
        }}
      >
        {isVideoActive ? (
          <div className="surface-dark relative aspect-[16/10] w-full overflow-hidden">
            {/* Soft Ambient Backdrop So Vertical Workshop Reels Fill 16:10 Cleanly */}
            <Image
              src={video.poster}
              alt=""
              aria-hidden="true"
              fill
              sizes={sizes}
              className="pointer-events-none scale-110 object-cover opacity-35 blur-xl"
            />

            {videoError ? (
              <div className="relative z-10 flex h-full w-full flex-col items-center justify-center p-4 text-center">
                <Image
                  src={video.poster}
                  alt={video.alt}
                  fill
                  sizes={sizes}
                  className="object-contain opacity-65"
                />
                <div
                  role="status"
                  className="relative z-20 inline-flex items-center gap-2 rounded-[var(--radius-lg)] border px-4 py-2 text-[length:var(--text-lg)] font-medium"
                  style={{
                    backgroundColor: "var(--status-error-bg)",
                    borderColor: "var(--status-error-border)",
                    color: "var(--status-error-fg)",
                  }}
                >
                  <AlertCircleIcon className="h-4 w-4 shrink-0" />
                  <span>Video preview unavailable — view photo frames below</span>
                </div>
              </div>
            ) : (
              <video
                ref={videoRef}
                src={video.src}
                poster={video.poster}
                controls
                loop
                muted
                playsInline
                preload="metadata"
                aria-label={`${shortName} — ${video.alt}`}
                onLoadStart={() => setVideoLoading(true)}
                onLoadedData={() => setVideoLoading(false)}
                onCanPlay={() => setVideoLoading(false)}
                onError={() => {
                  setVideoLoading(false);
                  setVideoError(true);
                }}
                data-loading={videoLoading ? "true" : undefined}
                className="relative z-10 h-full w-full object-contain"
              />
            )}
          </div>
        ) : (
          <>
            <div className="relative aspect-[16/10] w-full overflow-hidden">
              {gallery.map((photo, idx) => {
                const isSlideActive = idx === activeIndex;
                return (
                  <div
                    key={photo.id}
                    aria-hidden={!isSlideActive}
                    className="absolute inset-0 transition-opacity duration-[var(--dur-slower)] ease-[var(--ease-editorial)]"
                    style={{
                      opacity: isSlideActive ? 1 : 0,
                      zIndex: isSlideActive ? 1 : 0,
                      pointerEvents: isSlideActive ? "auto" : "none",
                    }}
                  >
                    <SignStudioPreview
                      variant="photo"
                      imageSrc={photo.onSrc}
                      offImageSrc={photo.offSrc}
                      alt={isSlideActive ? photo.alt : ""}
                      lit={supportsDayNight ? isLit : true}
                      supportsDayNight={supportsDayNight}
                      priority={priority && idx === 0}
                      aspectClass="aspect-[16/10]"
                      sizes={sizes}
                    />
                  </div>
                );
              })}
            </div>

            {/* Bottom Overlays: Hover Hint + Play/Pause Control (Left) + Lights ON/OFF Pill (Right) */}
            <div className="pointer-events-none absolute inset-x-2.5 bottom-2.5 z-20 flex flex-nowrap items-center justify-between gap-1.5 sm:inset-x-3 sm:bottom-3 sm:gap-2">
              <div className="pointer-events-auto flex items-center gap-1.5">
                <span className="nt-stage-hint">
                  {supportsDayNight ? (
                    <>
                      <span className="sm:hidden">Tap: Off</span>
                      <span className="hidden sm:inline">Hover: Light OFF</span>
                    </>
                  ) : (
                    <>
                      <span className="sm:hidden">Studio View</span>
                      <span className="hidden sm:inline">
                        {shortName} · Architectural Showcase
                      </span>
                    </>
                  )}
                </span>

                {photoCount > 1 && !prefersReducedMotion && (
                  <button
                    type="button"
                    aria-pressed={isManuallyPaused}
                    aria-label={
                      isManuallyPaused
                        ? `Resume ${shortName} 3-second photo slideshow`
                        : `Pause ${shortName} 3-second photo slideshow`
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsManuallyPaused((prev) => !prev);
                    }}
                    className="nt-stage-pause"
                  >
                    {isManuallyPaused ? (
                      <PlayIcon className="h-3.5 w-3.5" />
                    ) : (
                      <PauseIcon className="h-3.5 w-3.5" />
                    )}
                  </button>
                )}
              </div>

              {supportsDayNight && (
                <button
                  type="button"
                  aria-pressed={isLit}
                  aria-label={`Toggle Day and Night illumination for ${productName}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLit((prev) => !prev);
                  }}
                  className="nt-light-pill pointer-events-auto"
                >
                  <span className="nt-light-pill__dot" aria-hidden="true" />
                  <span>{isLit ? "Lights ON" : "Lights OFF"}</span>
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Bottom 4-Item Switcher Strip: 3 Photos (with 3s animated bottom border progress) + 1 Video Reel Thumbnail */}
      <div
        role="group"
        aria-label={`${productName} photo gallery and fabrication video`}
        className="nt-chapter-thumbs"
      >
        {gallery.map((photo, idx) => {
          const isSelected = activeIndex === idx;
          return (
            <button
              key={photo.id}
              ref={(el) => {
                thumbRefs.current[idx] = el;
              }}
              type="button"
              aria-pressed={isSelected}
              data-has-progress={
                isSelected && photoCount > 1 && !prefersReducedMotion
                  ? "true"
                  : undefined
              }
              onClick={() => selectIndex(idx)}
              onKeyDown={(e) => handleThumbKeyDown(e, idx)}
              className="nt-chapter-thumb"
            >
              <span className="nt-chapter-thumb__media">
                <Image
                  src={photo.onSrc}
                  alt={photo.thumbLabel}
                  fill
                  sizes="(max-width: 640px) 46vw, 180px"
                  className="nt-chapter-thumb__img object-cover"
                />
              </span>
              <span className="nt-chapter-thumb__label">{photo.thumbLabel}</span>

              {isSelected && photoCount > 1 && !prefersReducedMotion && (
                <span
                  key={`${activeIndex}-${cycleKey}`}
                  aria-hidden="true"
                  data-paused={!isAutoPlaying ? "true" : "false"}
                  onAnimationEnd={handleProgressComplete}
                  className="nt-chapter-thumb__progress"
                />
              )}
            </button>
          );
        })}

        {/* 4th Item: Video Thumbnail With Play Badge */}
        <button
          ref={(el) => {
            thumbRefs.current[videoIndex] = el;
          }}
          type="button"
          aria-pressed={isVideoActive}
          data-loading={isVideoActive && videoLoading ? "true" : undefined}
          data-error={videoError ? "true" : undefined}
          onClick={() => selectIndex(videoIndex)}
          onKeyDown={(e) => handleThumbKeyDown(e, videoIndex)}
          className="nt-chapter-thumb"
        >
          <span className="nt-chapter-thumb__media">
            <Image
              src={video.thumbSrc}
              alt={`${video.thumbLabel} (${video.durationLabel})`}
              fill
              sizes="(max-width: 640px) 46vw, 180px"
              className="nt-chapter-thumb__img object-cover"
            />
            <span className="nt-chapter-thumb__play" aria-hidden="true">
              <PlayIcon className="ml-0.5 h-4 w-4" />
            </span>
          </span>
          <span className="nt-chapter-thumb__label">
            {video.thumbLabel} · {video.durationLabel}
          </span>
        </button>
      </div>
    </div>
  );
}
