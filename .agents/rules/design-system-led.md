---
trigger: always_on
---

# BASISSIGN Engineering & Design System Rules

1. **Design Tokens Only:** Use semantic CSS variables from `src/app/globals.css` (`--ink`, `--paper`, `--surface-black`, `--surface-white`, `--text-tertiary`, `--text-muted`, `--accent-cta`, `--accent-glow`, `--radius-*`, `--duration-*`, `--ease-editorial`). Never hardcode arbitrary raw hex colors inside React components.
2. **Mandatory Component States:** Every interactive component (buttons, links, inputs, selects, theme toggles, day/night switches, dropzones, step cards) must implement `default`, `hover`, `focus-visible`, `active`, `disabled`, `loading`, and `error` states.
3. **WCAG 2.2 AA & Keyboard First:** Maintain `>= 4.5:1` contrast, visible focus rings, `Escape` to close overlays/drawers, focus trapping in mobile drawer, and `@media (prefers-reduced-motion: reduce)` fallbacks.
4. **Responsive Orientation Coverage:** Test and support Mobile Portrait (`360px`), Mobile Landscape (`max-height: 480px`), Tablet Portrait/Landscape (`768px-1024px`), Laptop (`1280px-1440px`), and Desktop (`1536px+`) with zero horizontal overflow.
5. **Security:** Validate all Quote API fields strictly on server & client, sanitize filenames, enforce upload MIME + size + magic-byte checks, never render user-uploaded SVG inline, and maintain strict CSP & security headers.
6. **SEO & Agentic SEO (GEO/AEO):** Keep semantic HTML landmarks, JSON-LD structured data, `/llms.txt`, `/llms-full.txt`, `sitemap.xml`, and `robots.txt` accurate and synchronized with product catalog specs.
