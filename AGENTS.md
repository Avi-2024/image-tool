# AGENTS.md — PixelConvert Repository Instructions

These instructions apply to all work in this repository. Read `CODEX_MASTER_BRIEF.md` before implementation.

## Mission
Build and maintain a premium, privacy-first image converter. Quality means real, verified conversions; a visually intentional UI; accessibility; SEO integrity; and a reproducible static build.

## Non-negotiable architecture
- Next.js App Router, TypeScript strict, Tailwind CSS, static export. No backend image uploads, conversion APIs, databases, server actions, or secret-dependent services.
- Accept real JPEG, PNG, and WebP; output real JPEG, PNG, and WebP only. Output MIME, magic bytes, and extension must agree.
- Keep all conversion work in browser and Prefer Web Workers/OffscreenCanvas with tested fallback.
- Do not turn feature or error states into mocks. Do not use fabricated progress or fake conversion success.
- Respect file, decoded-pixel, concurrency, and memory limits. Clean up workers, Blob URLs, bitmaps, canvases, timers and archive buffers.
- `config/converters.ts` is canonical route source of truth. Only live slugs in navigation, statically generated pages, and sitemap. Unique meaningful SEO copy.
- Avoid third-party trackers and external assets where possible. Any future ads require truthful privacy updates and stable layout.

## Visual design rules
- Design concept: **precision editorial utility**—calm, confident, useful, premium. Tool-first, not a dashboard.
- Light: bg `#F8FAFC`, surface `#FFFFFF`, text `#0F172A`, accent `#2563EB`; dark: bg `#0B1120`, surface `#111C2D`, accent `#3B82F6` (verify contrast).
- Clear typography hierarchy and deliberate spacing; never overlarge labels or tiny text. Main hero short. Upload workspace visible near top on desktop.
- One clear primary CTA per state. No UI noise, gratuitous gradients, bloated hero cards, repeated generic card grids, or stock imagery for a utility.
- Design the full interaction sequence: empty -> chosen -> converting -> success -> partial failure -> download.
- Mobile first: check 360/390 px widths; no overflow; readable rows; >=44px touch targets where practical. Implement dark theme, focus states, reduced motion and accessible error/status feedback.
- Prefer native semantic elements. No fake testimonials, ratings, conversion counts, or manipulative UX.

## Engineering process
1. Inspect existing code before editing. Make the smallest clean architectural additions consistent with the brief.
2. Work milestone-by-milestone, with explicit validation after each milestone. Maintain `IMPLEMENTATION_PLAN.md` when performing large tasks.
3. Tests must include **real image fixtures** and verify output headers, dimensions, alpha/flattening, orientation, WebP support detection and archive extraction.
4. Run `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build` and applicable Playwright tests. Repair failures. If a command is missing, implement it where appropriate.
5. Inspect browser screenshots (desktop/mobile/light/dark, empty/success/error), improve UI, then inspect again. Do not claim visual review without seeing actual screenshots.
6. Verify no image payload is uploaded over the network.
7. Summarize actual changes, tests run, and limitations without exaggeration.

## Working conventions
- Strong typing, explicit boundaries and small, maintainable components. Accessible names, semantic markup, stable keys, controlled state.
- Use `image/jpeg` for JPG and canonical URL slug `jpg`. Avoid silently treating unsupported output as supported.
- Prefer distinct meaningful error messages and recovery actions.
- Work only in the repository for implementation; do not deploy publicly or configure paid services without explicit user approval.
- If a requirement conflicts with technical/browser reality, implement safe fallback and document exact behavior rather than claiming impossible guarantees.
