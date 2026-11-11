"use client";

import { useState } from "react";
import { BRAND_FACTS } from "@/data/catalog";
import { LightbulbIcon } from "./Icons";
import { SignStudioPreview } from "./SignStudioPreview";

export function UlRacewayShowcase() {
  const [lit, setLit] = useState(true);
  const [viewMode, setViewMode] = useState<"bench" | "crate">("bench");

  return (
    <div className="surface-dark overflow-hidden rounded-[var(--radius-xs)] border border-[var(--border-strong)] p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
        <div>
          <p className="ui-eyebrow text-[var(--accent-text)]">
            Interactive AHJ Inspection View
          </p>
          <h2 className="mt-1 text-[length:var(--text-4xl)] font-semibold text-[var(--local-fg)]">
            UL 48 File #{BRAND_FACTS.ulFileNumber} + NEC Article 600 System
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div
            role="group"
            aria-label="AHJ compliance view mode"
            className="inline-flex flex-wrap gap-1 rounded-[26px] border p-1 sm:rounded-[var(--radius-lg)]"
            style={{
              backgroundColor: "var(--local-elevated)",
              borderColor: "var(--local-border)",
            }}
          >
            <button
              type="button"
              aria-pressed={viewMode === "bench"}
              onClick={() => setViewMode("bench")}
              className="nt-mode-tab"
            >
              Shop Bench Test
            </button>
            <button
              type="button"
              aria-pressed={viewMode === "crate"}
              onClick={() => setViewMode("crate")}
              className="nt-mode-tab"
            >
              Blind Crate &amp; Blueprint
            </button>
          </div>

          <button
            type="button"
            aria-pressed={viewMode === "bench" ? lit : false}
            onClick={() => {
              if (viewMode !== "bench") {
                setViewMode("bench");
                setLit(true);
              } else {
                setLit((prev) => !prev);
              }
            }}
            className="light-toggle"
          >
            <span className="light-toggle__track" aria-hidden="true">
              <span className="light-toggle__thumb">
                <LightbulbIcon className="h-3.5 w-3.5" />
              </span>
            </span>
            <span>
              {viewMode === "bench"
                ? lit
                  ? "Circuit Live (ON)"
                  : "Disconnect Open (OFF)"
                : "Test UL 48 Bench"}
            </span>
          </button>
        </div>
      </div>

      <div
        className="surface-dark relative aspect-[16/10] w-full overflow-hidden rounded-[22px] border border-[var(--local-border)]"
        onMouseEnter={() => {
          if (viewMode === "bench") setLit(false);
        }}
        onMouseLeave={() => {
          if (viewMode === "bench") setLit(true);
        }}
      >
        <div
          aria-hidden={viewMode !== "bench"}
          className="absolute inset-0 transition-opacity duration-[var(--dur-slower)] ease-[var(--ease-editorial)]"
          style={{
            opacity: viewMode === "bench" ? 1 : 0,
            zIndex: viewMode === "bench" ? 1 : 0,
            pointerEvents: viewMode === "bench" ? "auto" : "none",
          }}
        >
          <SignStudioPreview
            variant="photo"
            imageSrc="/images/ul-build-bench-on.webp"
            offImageSrc="/images/ul-build-bench-off.webp"
            lit={lit}
            loading="eager"
            supportsDayNight
            aspectClass="aspect-[16/10]"
            sizes="(max-width: 1024px) 100vw, 48vw"
            alt={
              viewMode === "bench"
                ? "UL 48 factory test bench showing welded channel letter, Mean Well Class 2 driver, and 1:1 mounting template"
                : ""
            }
            badgeText={
              lit
                ? "Load Test Active · UL 48 #E555259"
                : "NEC 600 Disconnect Open (OFF)"
            }
          />
        </div>

        <div
          aria-hidden={viewMode !== "crate"}
          className="absolute inset-0 transition-opacity duration-[var(--dur-slower)] ease-[var(--ease-editorial)]"
          style={{
            opacity: viewMode === "crate" ? 1 : 0,
            zIndex: viewMode === "crate" ? 1 : 0,
            pointerEvents: viewMode === "crate" ? "auto" : "none",
          }}
        >
          <SignStudioPreview
            variant="photo"
            imageSrc="/images/trade-crate-blueprint.webp"
            lit
            loading="eager"
            supportsDayNight={false}
            aspectClass="aspect-[16/10]"
            sizes="(max-width: 1024px) 100vw, 48vw"
            alt={
              viewMode === "crate"
                ? "Unmarked custom birch wood freight crate beside CAD engineering blueprint for blind wholesale signage shipment"
                : ""
            }
            badgeText="Unmarked Crate · 1:1 CNC Blueprint"
          />
        </div>
      </div>

      <p className="mt-4 text-[length:var(--text-lg)] leading-relaxed text-[var(--local-fg-muted)]">
        {viewMode === "bench"
          ? "Toggle Circuit Live / Disconnect Open (or hover over the photo) to verify factory LED load testing alongside the Mean Well® IP67 Class 2 driver and 1:1 installation blueprint."
          : "Every UL 48 shipment leaves in custom plywood crating with a full-scale 1:1 mounting pattern and zero manufacturer branding inside for trade partners."}
      </p>
    </div>
  );
}
