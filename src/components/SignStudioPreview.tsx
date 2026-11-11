"use client";

import Image from "next/image";

export type StudioPreviewVariant = "photo";

interface SignStudioPreviewProps {
  variant?: StudioPreviewVariant;
  lit: boolean;
  imageSrc?: string;
  offImageSrc?: string;
  alt: string;
  aspectClass?: string;
  priority?: boolean;
  loading?: "eager" | "lazy";
  sizes?: string;
  supportsDayNight?: boolean;
  badgeText?: string;
  className?: string;
}

export function SignStudioPreview({
  lit,
  imageSrc = "/images/hero/hero-01-on.webp",
  offImageSrc,
  alt,
  aspectClass = "aspect-[4/3]",
  priority = false,
  loading,
  sizes = "(max-width: 768px) 100vw, 50vw",
  supportsDayNight = true,
  badgeText,
  className = "",
}: SignStudioPreviewProps) {
  const hasPairedOffPhoto = Boolean(offImageSrc && supportsDayNight);
  const imageLoading = priority ? undefined : loading;

  return (
    <div
      className={`relative w-full overflow-hidden ${aspectClass} surface-dark ${className}`}
    >
      {hasPairedOffPhoto && offImageSrc ? (
        <>
          <Image
            src={offImageSrc}
            alt=""
            aria-hidden="true"
            fill
            priority={priority}
            loading={imageLoading}
            sizes={sizes}
            className="object-cover"
          />
          <Image
            src={imageSrc}
            alt={alt}
            fill
            priority={priority}
            loading={imageLoading}
            sizes={sizes}
            className="object-cover transition-opacity duration-[var(--dur-slower)] ease-[var(--ease-editorial)]"
            style={{ opacity: lit ? 1 : 0 }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 transition-opacity duration-[var(--dur-slower)] ease-[var(--ease-editorial)]"
            style={{
              opacity: lit ? 0.14 : 0,
              background:
                "radial-gradient(circle at 60% 35%, color-mix(in srgb, var(--accent-glow) 28%, transparent), transparent 65%)",
            }}
          />
        </>
      ) : (
        <>
          <Image
            src={imageSrc}
            alt={alt}
            fill
            priority={priority}
            loading={imageLoading}
            sizes={sizes}
            className="object-cover transition-[filter,transform] duration-[var(--dur-slower)] ease-[var(--ease-editorial)]"
            style={
              supportsDayNight && !lit
                ? {
                    filter: "brightness(1.2) saturate(0.55) contrast(0.92)",
                    transform: "scale(1.015)",
                  }
                : {
                    filter: "brightness(1) saturate(1.06) contrast(1.04)",
                    transform: "scale(1)",
                  }
            }
          />

          {/* Atmospheric Day vs Night Contrast Grading Layer */}
          {supportsDayNight && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 transition-opacity duration-[var(--dur-slower)] ease-[var(--ease-editorial)]"
              style={{
                opacity: lit ? 0.12 : 0.34,
                background: lit
                  ? "radial-gradient(circle at 60% 35%, color-mix(in srgb, var(--accent-glow) 28%, transparent), transparent 65%)"
                  : "linear-gradient(180deg, color-mix(in srgb, var(--paper) 42%, transparent) 0%, color-mix(in srgb, var(--ink) 18%, transparent) 100%)",
              }}
            />
          )}
        </>
      )}

      {badgeText && (
        <div
          className="pointer-events-none absolute bottom-3 left-3 z-20 inline-flex w-fit max-w-[calc(100%-1.5rem)] items-center gap-2 rounded-[var(--radius-lg)] px-3 py-1 text-[length:var(--text-sm)] font-medium tracking-wide backdrop-blur-md sm:bottom-4 sm:left-4 sm:max-w-[calc(100%-2rem)] sm:px-3.5 sm:py-1.5 sm:text-[length:var(--text-md)]"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--surface-black) 74%, transparent)",
            color: "var(--surface-white)",
            border:
              "1px solid color-mix(in srgb, var(--surface-white) 22%, transparent)",
          }}
        >
          <span
            className="h-2 w-2 shrink-0 rounded-full transition-all duration-[var(--dur-slow)]"
            style={{
              backgroundColor:
                lit || !supportsDayNight
                  ? "var(--accent-glow)"
                  : "var(--text-muted)",
              boxShadow:
                lit || !supportsDayNight ? "0 0 10px var(--accent-glow)" : "none",
            }}
          />
          <span className="truncate">{badgeText}</span>
        </div>
      )}
    </div>
  );
}
