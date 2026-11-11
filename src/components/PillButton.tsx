"use client";

import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";
import { ArrowRightIcon } from "./Icons";

export type PillVariant =
  | "primary"
  | "cta"
  | "ghost"
  | "light-on-dark"
  | "ghost-on-dark";

interface PillButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  variant?: PillVariant;
  disabled?: boolean;
  loading?: boolean;
  error?: boolean;
  fullWidth?: boolean;
  className?: string;
  ariaLabel?: string;
}

const variantClassMap: Record<PillVariant, string> = {
  primary: "",
  cta: "nt-pill-btn--cta",
  ghost: "nt-pill-btn--ghost",
  "light-on-dark": "nt-pill-btn--light-on-dark",
  "ghost-on-dark": "nt-pill-btn--ghost-on-dark",
};

export function PillButton({
  children,
  href,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  loading = false,
  error = false,
  fullWidth = false,
  className = "",
  ariaLabel,
}: PillButtonProps) {
  const classes = [
    "nt-pill-btn",
    variantClassMap[variant],
    fullWidth ? "w-full justify-between" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const circleContent = (
    <span className="nt-pill-btn__circle" aria-hidden="true">
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-[color:var(--btn-arrow-fg)] border-t-transparent opacity-90" />
      ) : (
        <>
          <ArrowRightIcon className="nt-pill-btn__arrow nt-pill-btn__arrow--primary h-4 w-4" />
          <ArrowRightIcon className="nt-pill-btn__arrow nt-pill-btn__arrow--secondary h-4 w-4" />
        </>
      )}
    </span>
  );

  if (href) {
    if (disabled || loading) {
      return (
        <span
          role="link"
          aria-disabled="true"
          aria-busy={loading || undefined}
          aria-label={ariaLabel}
          data-loading={loading ? "true" : undefined}
          data-error={error ? "true" : undefined}
          className={classes}
        >
          <span>{children}</span>
          {circleContent}
        </span>
      );
    }

    return (
      <Link
        href={href}
        className={classes}
        aria-label={ariaLabel}
        data-error={error ? "true" : undefined}
      >
        <span>{children}</span>
        {circleContent}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      aria-label={ariaLabel}
      data-loading={loading ? "true" : undefined}
      data-error={error ? "true" : undefined}
      className={classes}
    >
      <span>{children}</span>
      {circleContent}
    </button>
  );
}
