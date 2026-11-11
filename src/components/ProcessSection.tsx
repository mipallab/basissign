"use client";

import { useState } from "react";
import { BRAND_FACTS } from "@/data/catalog";
import {
  CheckIcon,
  LayersIcon,
  LightbulbIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TruckIcon,
} from "./Icons";
import { PillButton } from "./PillButton";
import { SignStudioPreview } from "./SignStudioPreview";

const WORKFLOW_STEPS = [
  {
    step: "01",
    title: "Send Copy & Facade Photo (Free 24h 3D Mockup)",
    description:
      "Submit your sign copy, dimensions, or logo vector file through our 5-step configurator. Within 1 business day, our engineers send factory-direct pricing and a scaled Day/Night storefront rendering.",
    icon: SparklesIcon,
  },
  {
    step: "02",
    title: "Precision CNC Fabrication & UL 48 Testing",
    description:
      "Upon proof approval, we notch and weld marine-grade aluminum returns, route 3/16\" acrylic faces, wire Mean Well® IP67 Class 2 drivers, and apply serialized UL 48 File #E555259 labels.",
    icon: LayersIcon,
  },
  {
    step: "03",
    title: "Foam-Crated Nationwide Delivery (<1% Damage)",
    description:
      "Your sign ships in custom wooden & foam-in-place crating complete with a full-scale 1:1 CNC mounting pattern, stainless studs, NEC 600 disconnect switch, and a 3-year full warranty.",
    icon: TruckIcon,
  },
];

export function ProcessSection() {
  const [racewayLit, setRacewayLit] = useState(true);
  const [viewMode, setViewMode] = useState<"crate" | "foam" | "bench">("crate");

  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="border-t border-[var(--border-subtle)] py-[var(--section-py)]"
    >
      <div className="site-container">
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <p className="ui-eyebrow text-[var(--accent-text)]">
              Turnkey Manufacturing Workflow
            </p>
            <h2
              id="process-heading"
              className="display-h2 mt-3 text-[var(--text-primary)]"
            >
              From Facade Photo to UL-Labeled Crate in 3 Steps
            </h2>
          </div>
          <PillButton href="/ul-48-compliance" variant="ghost">
            Inspect UL 48 Checklist
          </PillButton>
        </div>

        {/* 3-Step Turnkey Grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {WORKFLOW_STEPS.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.step}
                className="flex flex-col justify-between rounded-[var(--radius-xs)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-6 sm:p-8"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-[var(--radius-lg)] border border-[var(--border-strong)] bg-[var(--bg-subtle)] px-3.5 py-1 text-[length:var(--text-md)] font-semibold tracking-[0.08em] text-[var(--text-primary)]">
                      STEP {item.step}
                    </span>
                    <span
                      className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--bg-subtle)] text-[var(--accent-text)]"
                      aria-hidden="true"
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>
                  <h3 className="display-h3 mt-5 text-[var(--text-primary)]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[length:var(--text-2xl)] leading-relaxed text-[var(--text-secondary)]">
                    {item.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        {/* Interactive Wholesale Blind Crating & UL 48 Quality Showcase */}
        <div className="mt-12 grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
          {/* Interactive Crating & UL 48 Inspection Stage */}
          <div className="surface-dark flex flex-col justify-between overflow-hidden rounded-[var(--radius-xs)] border border-[var(--border-strong)] p-5 sm:p-7 lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
              <div>
                <p className="ui-eyebrow text-[var(--accent-text)]">
                  Blind Trade Fulfillment &amp; UL 48 QC
                </p>
                <h3 className="mt-1 text-[length:var(--text-4xl)] font-semibold text-[var(--local-fg)]">
                  Unmarked Wood Crates, Foam Packout &amp; UL 48 Bench Test
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <div
                  role="group"
                  aria-label="Trade fulfillment inspection view"
                  className="inline-flex flex-wrap gap-1 rounded-[26px] border p-1 sm:rounded-[var(--radius-lg)]"
                  style={{
                    backgroundColor: "var(--local-elevated)",
                    borderColor: "var(--local-border)",
                  }}
                >
                  <button
                    type="button"
                    aria-pressed={viewMode === "crate"}
                    onClick={() => setViewMode("crate")}
                    className="nt-mode-tab"
                  >
                    Blind Wood Crate
                  </button>
                  <button
                    type="button"
                    aria-pressed={viewMode === "foam"}
                    onClick={() => setViewMode("foam")}
                    className="nt-mode-tab"
                  >
                    Foam Interior
                  </button>
                  <button
                    type="button"
                    aria-pressed={viewMode === "bench"}
                    onClick={() => {
                      setViewMode("bench");
                      setRacewayLit(true);
                    }}
                    className="nt-mode-tab"
                  >
                    UL 48 Bench
                  </button>
                </div>

                <button
                  type="button"
                  aria-pressed={viewMode === "bench" ? racewayLit : false}
                  onClick={() => {
                    if (viewMode !== "bench") {
                      setViewMode("bench");
                      setRacewayLit(true);
                    } else {
                      setRacewayLit((prev) => !prev);
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
                      ? racewayLit
                        ? "Power Test ON"
                        : "Power Test OFF"
                      : "Inspect Power Test"}
                  </span>
                </button>
              </div>
            </div>

            <div
              className="surface-dark relative aspect-[16/11] w-full overflow-hidden rounded-[20px] border border-[var(--local-border)]"
              onMouseEnter={() => {
                if (viewMode === "bench") setRacewayLit(false);
              }}
              onMouseLeave={() => {
                if (viewMode === "bench") setRacewayLit(true);
              }}
            >
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
                  aspectClass="aspect-[16/11]"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  alt={
                    viewMode === "crate"
                      ? "Unmarked custom birch wood palletized shipping crate paired with 1:1 CAD installation blueprint before blind trade dispatch"
                      : ""
                  }
                  badgeText="Unmarked Wood Crate · CAD Blueprint"
                />
              </div>

              <div
                aria-hidden={viewMode !== "foam"}
                className="absolute inset-0 transition-opacity duration-[var(--dur-slower)] ease-[var(--ease-editorial)]"
                style={{
                  opacity: viewMode === "foam" ? 1 : 0,
                  zIndex: viewMode === "foam" ? 1 : 0,
                  pointerEvents: viewMode === "foam" ? "auto" : "none",
                }}
              >
                <SignStudioPreview
                  variant="photo"
                  imageSrc="/images/trade-crate-foam.webp"
                  lit
                  loading="eager"
                  supportsDayNight={false}
                  aspectClass="aspect-[16/11]"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  alt={
                    viewMode === "foam"
                      ? "Open unmarked plywood shipping crate lined with slotted custom polyethylene foam partitions for zero-damage channel letter delivery"
                      : ""
                  }
                  badgeText="Slotted Foam Crate · <1% Damage"
                />
              </div>

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
                  lit={racewayLit}
                  loading="eager"
                  supportsDayNight
                  aspectClass="aspect-[16/11]"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  alt={
                    viewMode === "bench"
                      ? "UL 48 shop test bench verifying channel letter illumination with Mean Well Class 2 driver and 1:1 mounting template"
                      : ""
                  }
                  badgeText={
                    racewayLit
                      ? "Power Test ON · UL 48 Assembly"
                      : "Power OFF · NEC 600 Disconnect"
                  }
                />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2.5 text-[length:var(--text-lg)] text-[var(--local-fg-muted)] sm:grid-cols-4">
              <div className="inline-flex items-center gap-1.5">
                <CheckIcon className="h-4 w-4 shrink-0 text-[var(--accent-text)]" />
                <span>Unmarked Blind Crate</span>
              </div>
              <div className="inline-flex items-center gap-1.5">
                <CheckIcon className="h-4 w-4 shrink-0 text-[var(--accent-text)]" />
                <span>Custom Foam Channels</span>
              </div>
              <div className="inline-flex items-center gap-1.5">
                <CheckIcon className="h-4 w-4 shrink-0 text-[var(--accent-text)]" />
                <span>UL 48 #{BRAND_FACTS.ulFileNumber}</span>
              </div>
              <div className="inline-flex items-center gap-1.5">
                <CheckIcon className="h-4 w-4 shrink-0 text-[var(--accent-text)]" />
                <span>1:1 CNC Blueprints</span>
              </div>
            </div>
          </div>

          {/* Wholesale Trade & Blind White-Label Shipping Callout */}
          <div className="flex flex-col justify-between rounded-[var(--radius-xs)] border border-[var(--border-strong)] bg-[var(--bg-elevated)] p-6 sm:p-8 lg:col-span-5">
            <div>
              <div className="inline-flex items-center gap-2 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-3.5 py-1.5 text-[length:var(--text-md)] font-semibold uppercase tracking-[0.06em] text-[var(--accent-text)]">
                <ShieldCheckIcon className="h-4 w-4" />
                <span>Trade Partner Program</span>
              </div>

              <h3 className="display-h3 mt-4 text-[var(--text-primary)]">
                Blind White-Label Shipping for US Sign Shops &amp; Contractors
              </h3>

              <p className="mt-3 text-[length:var(--text-2xl)] leading-relaxed text-[var(--text-secondary)]">
                Scale your installation capacity without expanding shop floor
                payroll. Every wholesale trade order can ship blind in unbranded
                crates straight to your shop or job site with zero BASISSIGN
                paperwork inside.
              </p>

              <ul className="m-0 mt-6 flex list-none flex-col gap-3 p-0 text-[length:var(--text-xl)] text-[var(--text-primary)]">
                <li className="flex items-start gap-2.5">
                  <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-[var(--accent-text)]" />
                  <span>
                    Unmarked custom foam-in-place crates ({BRAND_FACTS.freightDamageRate}{" "}
                    freight damage)
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-[var(--accent-text)]" />
                  <span>
                    Permit-ready UL 48 File #{BRAND_FACTS.ulFileNumber} labels &amp;
                    wire diagrams
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-[var(--accent-text)]" />
                  <span>
                    Full-scale 1:1 CNC mounting blueprints &amp; non-corrosive
                    hardware
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-[var(--accent-text)]" />
                  <span>
                    Consistent {BRAND_FACTS.leadTimeDays} turnaround on repeat
                    trade orders
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-8 border-t border-[var(--border-subtle)] pt-6">
              <PillButton href="/quote?trade=1" variant="cta" fullWidth>
                Start a Trade / Blind Quote
              </PillButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
