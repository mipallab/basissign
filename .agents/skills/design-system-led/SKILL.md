---
name: design-system-led
description: Creates implementation-ready design-system guidance with tokens, component behavior, and accessibility standards for BASISSIGN. Use when creating or updating UI rules, component specifications, or design-system documentation.
---

<!-- TYPEUI_SH_MANAGED_START -->

# BASISSIGN LED & Architectural Signage Design System

## Mission
Deliver implementation-ready design-system guidance for BASISSIGN (`https://basissign.com/`) optimized for consistency, WCAG 2.2 AA accessibility, smooth 60fps animations, and fast B2B wholesale conversion across e-commerce and quote storefronts.

## Brand
- Product/brand: BASISSIGN (Basis Sign LLC — UL 48 File #E555259)
- Reference Aesthetic: https://www.neontrip.de/
- Audience: US sign shops, contractors, design firms, and commercial business owners
- Product surface: SEO + Agentic-SEO commercial signage storefront & Request-a-Quote configurator

## Style Foundations
- Visual style: clean, structured, architectural editorial, implementation-first
- Main font style: `font.family.primary=Inter`, `font.family.stack=Inter, Arial, sans-serif`, `font.size.base=16px`, `font.weight.base=400`, `font.lineHeight.base=24.8px`
- Typography scale: `font.size.xs=10px`, `font.size.sm=11px`, `font.size.md=12px`, `font.size.lg=13px`, `font.size.xl=14px`, `font.size.2xl=15px`, `font.size.3xl=16px`, `font.size.4xl=17px`
- Color palette:
  - `color.ink=#181615`
  - `color.paper=#f5f4f1`
  - `color.text.primary=#181615` (light surface) / `#ffffff` (dark surface)
  - `color.text.secondary=#ffffff`
  - `color.text.tertiary=#494b4c`
  - `color.text.inverse=#635f5a`
  - `color.surface.base=#000000`
  - `color.accent.cta=#d5107c`
  - `color.accent.glow=#fa31a2`
- Spacing scale: `space.1=2px`, `space.2=3px`, `space.3=4px`, `space.4=5px`, `space.5=6px`, `space.6=8px`, `space.7=10px`, `space.8=12px`
- Radius/motion tokens: `radius.xs=30px`, `radius.sm=50px`, `radius.md=100px`, `radius.lg=999px` | `motion.duration.instant=200ms`, `motion.duration.fast=220ms`, `motion.duration.normal=250ms`, `motion.duration.slow=300ms`, `motion.duration.slower=550ms` | `motion.ease=cubic-bezier(.785,.135,.15,.86)`

## Accessibility
- Target: WCAG 2.2 AA
- Keyboard-first interactions required.
- Focus-visible rules required (`outline: 3px solid var(--accent-glow); outline-offset: 4px`).
- Contrast constraints required (`>= 4.5:1` normal text, `>= 3:1` large text & UI controls).

## Rules: Do
- Use semantic CSS custom property tokens, never raw hex values inside React/UI components.
- Every component must define required states: `default`, `hover`, `focus-visible`, `active`, `disabled`, `loading`, `error`.
- Responsive behavior and edge-case handling must cover Mobile, Tablet, Laptop, Desktop in both Portrait and Landscape (`height <= 480px`).
- Accessibility acceptance criteria must be testable in implementation.

## Rules: Don't
- Do not allow low-contrast text or hidden focus indicators.
- Do not introduce one-off spacing or typography exceptions.
- Do not use ambiguous labels or non-descriptive actions.
- Do not ship component guidance without explicit state rules.

<!-- TYPEUI_SH_MANAGED_END -->
