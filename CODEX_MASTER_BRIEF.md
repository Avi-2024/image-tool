# CODEX EXECUTION OVERRIDE — READ FIRST

**Priority:** This section refines the original specification below. In conflicts, follow this section for design execution, browser verification, and honest completion reporting, while preserving the original specification's privacy, architecture, conversion correctness, SEO, and test requirements.

**Mission:** Build **PixelConvert**, a genuinely working, premium, locally processed JPG/PNG/WebP converter. The finished UI must feel art-directed by a senior product designer, implemented by a staff frontend engineer, and evaluated with real browser screenshots. No wireframe look, no fake behavior, no generic "AI SaaS" aesthetic.

## A. OPERATING CONTRACT

- Read this entire document and `AGENTS.md` before making changes.
- Inspect the repository; retain and improve existing working code rather than deleting it indiscriminately.
- Create a short milestone plan in `IMPLEMENTATION_PLAN.md`; then execute against it when not in Plan mode.
- Do not merely deliver a plan or scaffold. Create files, run scripts, test genuine image conversions, and inspect the actual built interface.
- The UI must be original and coherent. Do not clone or reproduce another brand's page pixel for pixel.
- Avoid unnecessary new libraries. No images ever leave the browser. No backend routes, upload endpoints, or fake analytics dashboards.
- Respect the source prompt's static export constraints, unique route content, and browser capability verification.
- Document anything not verified. Never claim success based only on code inspection.

## B. VISUAL CONCEPT — "PRECISION EDITORIAL UTILITY"

Visual personality: **quiet confidence, typographic precision, tangible utility, calm technology**. A premium tool that is obviously easy to use before reading instructions. The strongest visual element is the converter, not a decorative hero or an illustration.

### Brand and color tokens

Use CSS variables and a small token system. Target palette (refine only if it improves contrast):

| Role | Light | Dark |
|---|---|---|
| Page background | `#F8FAFC` | `#0B1120` |
| Elevated surface | `#FFFFFF` | `#111C2D` |
| Primary text | `#0F172A` | `#F8FAFC` |
| Secondary text | `#475569` | `#A8B7CB` |
| Borders | `#E2E8F0` | `#29384D` |
| Primary action | `#2563EB` | `#3B82F6` |
| Focus ring | `#2563EB` | `#93C5FD` |

Use functional success/error colors sparingly. Avoid purple gradients, neon accents, multicolored shadows, and needless glassmorphism. Provide accessible contrast in both themes.

### Typography and sizing

- One professional sans family, optionally a second carefully chosen display face. Prefer properly bundled local font assets if the repo contains them; otherwise use a refined stable system fallback. Do not rely on flaky runtime font fetching.
- Typography must look intentional. Avoid mechanically using the same size/weight everywhere.
- Desktop H1 ~48–56px, mobile H1 ~32–38px, with tight tracking and sensible 1.05–1.15 line-height; avoid clipping.
- Body text ~15–17px, line-height 1.5–1.65. Supporting text typically >=13px.
- Labels ~13–14px medium weight; filename rows ~14–15px; never oversize controls.
- Use distinct but restrained font weights. Avoid indiscriminate bolding.

### Layout and spacing

- Center shell max-width ~1120–1200px with 24–32px desktop gutters and 16–20px mobile gutters.
- Header height ~64–72px. Compact above-the-fold hero; the conversion dropzone starts within the initial viewport on a 1440x900 screen.
- Desktop hero width and converter alignment should create one deliberate axis. Avoid visually unrelated sections.
- 8px spacing rhythm with deliberate 4px adjustments. Major section gaps ~64–88px desktop and ~40–56px mobile.
- One dominant workspace surface for the converter. Rounded corners roughly 20–24px; nested controls 10–14px.
- Borders should establish depth more often than shadows. Use one consistent shadow treatment at most.
- Avoid unnecessary boxes around every paragraph or value. Add cards only when grouping improves comprehension.
- Empty space is intentional. No dead whitespace above the converter.

### Homepage composition

1. Restrained brand header: original wordmark/logo mark, "Convert"/"Tools"/"About", accessible theme toggle.
2. Above-fold editorial hero: short privacy-led statement, 1–2 lines of copy, small credible "Processes on your device" trust cue, then the upload workspace.
3. Converter workspace as hero object: obvious input-drop zone, tasteful upload icon, strong primary action, contextual format control; no competing visual focal point.
4. Six conversion links in a crisp directory/grid. Each title and explanation is specific; do not use repeated generic content.
5. Compact genuine advantages + transparent how-it-works explanation.
6. Unique FAQs and restrained footer. Ads only below the tool when enabled.

### Converter visual states — design every one

1. **Empty:** drag/drop zone looks clickable; formats and limits are readable but not noisy.
2. **Dragover:** premium subtle highlight and meaningful feedback, no distracting bounce.
3. **Selected:** thumbnails, truncated filenames with access to full name, original dimensions/size, target format, clear action; settings appear contextually.
4. **Processing:** stable row heights, status icon, real progress at queue granularity, disabled duplicate actions; prevent UI jumping.
5. **Success:** tasteful success indicator, before/after sizes, honest saved/larger percentage, prominent real download controls.
6. **Partial failure:** human-readable row error, retry path, ability to download successes.
7. **Cancelled / unsupported:** legible recovery state with no fake success banners.

Do not make the tool look like an admin dashboard. The conversion UI should feel polished and purposeful, with subtle tactile feedback: hover, focus, button press, completion. Keep motion <=200ms for routine transitions and respect `prefers-reduced-motion`.

### Responsive rules

- Validate at 390x844, 768x1024, 1440x900, plus 360px width.
- Touch targets >=44px where reasonable; no horizontal scroll; avoid text truncation of actions.
- On mobile, settings stack vertically, actions remain easy to reach, and result file rows reshape gracefully.
- On desktop, keep a single clear primary column for the tool rather than a cluttered multi-panel dashboard.
- Screenshots must reveal real states, not skeleton placeholders or empty white cards.

### Accessibility quality

- WCAG 2.2 AA target. Strong focus rings, native semantics, good live regions, visible labels, accessible errors, contrast checks in dark and light themes.
- Distinguish state by text/icons as well as color. Never use obsolete `aria-dropeffect` as the primary indication.

## C. MASTER-QUALITY BROWSER REVIEW LOOP (REQUIRED)

After implementing the functional product:

1. Start a real development or preview server, or serve the static `out/` output.
2. Use Playwright or the available browser automation to capture full-page screenshots at 1440x900, 768x1024, 390x844 in **light mode**, and at least one dark-mode screenshot.
3. Capture at least the empty state, an uploaded-file state, a conversion-success state, and one error state. Use real test fixtures.
4. Inspect screenshots personally. Critique typographic hierarchy, spacing consistency, component proportions, contrast, alignment, density, overflow, and wasted space. Do not assume passing CSS tests means visual polish.
5. Correct the actual defects in source code. Perform **at least two explicit visual review-and-improve passes**, not merely a one-shot implementation.
6. Re-run screenshots after changes and compare. Do not stop because the first screenshot looks acceptable.
7. Validate keyboard-only navigation, reduced motion, and no layout jumping during state changes.
8. Use visual evidence and working UX to decide if the experience feels ready, not adjectives or unsupported claims.
9. If browser automation or screenshots are unavailable, state exactly what you could not inspect and supply manual validation instructions. Never fabricate an inspection.

### Visual rejection criteria

Reject and redesign if any of these occur:

- It looks like a copied generic shadcn landing-page template with large card grids.
- The hero consumes most of the viewport and hides the tool.
- Font sizes look arbitrary, labels are tiny, or card spacing is uneven.
- The upload panel has competing buttons or unclear format-selection flow.
- Light theme is polished but dark theme has muddy contrast.
- Conversion results look like unstyled debug output.
- Mobile controls overflow, stack awkwardly, or become too small to tap.
- Decorative effects obscure the conversion task.
- It looks good only when no files have been selected.
- Any button appears functional but fails on interaction.

## D. BEHAVIORAL QUALITY DETAILS

- Choose a sensible initial target selection behavior for the generic homepage; if no target is selected, visibly require selection. Never silently convert to an arbitrary format.
- Support duplicate filenames without overwriting ZIP entries.
- Show thumbnail previews only for validated supported images; clean up object URLs.
- Transparently indicate when an output becomes larger rather than smaller.
- If browser WebP encoding is unavailable, explain it. Never relabel PNG bytes as WebP.
- Reject animated WebP or explicitly disclose and confirm a single-frame-only behavior; do not silently remove animation.
- Add subtle helper text for transparency flattening, WebP browser support, and JPEG quality tradeoffs in exactly the contexts where relevant.
- On settings changes, invalidate stale outputs (or lock settings during processing); no mismatched settings/results.
- No intrusive popups, forced signup, cookie banner for cookies that do not exist, fake testimonials, fabricated download counters, or placeholder ad inventory when ads are off.

## E. VERIFICATION GATE

Before calling work "done", run the repository's relevant lint, typecheck, unit, browser end-to-end, and production static export commands. Confirm the six conversions with real image fixtures and output-byte/header checks. Ensure all public links resolve. Confirm there are no actual file upload requests in the browser network log. Validate sitemap and canonical URLs with the configured production site origin.

Completion report must include:

- Working pages and behavior actually built
- Commands run and exact pass/fail summaries
- Screenshots created and their paths, **only if they actually exist**
- Any tests/browser environments not available
- Remaining known defects, if any
- How to run the site locally and deploy static output

**Do not say "pixel perfect", "fully tested", or "production ready" without evidence.**

---

# ORIGINAL PRODUCT & ENGINEERING SPECIFICATION

# MASTER IMPLEMENTATION PROMPT — PRIVACY-FIRST IMAGE CONVERTER SAAS-QUALITY WEBSITE

## ROLE & EXECUTION MODE

Act as a Principal Frontend Engineer, Web Performance Specialist, Technical SEO Architect, Accessibility Engineer, and Senior UI/UX Designer.

You are responsible for building a complete, production-ready, privacy-first image conversion website from scratch.

**Project working name:** PixelConvert (configurable)

**Primary goal:** Create a premium, fast, SEO-optimized image converter that users trust, Google can crawl, and the owner can eventually monetize using display advertising.

**Technology:** Next.js App Router, TypeScript, Tailwind CSS, browser Web Workers, OffscreenCanvas, and fflate.

**Absolute requirement:** All actual image conversion must happen locally on the user's device. Images must never be uploaded to a server or sent to an external API.

### EXECUTION INSTRUCTIONS

You are in implementation mode, not consultation mode.

1. Inspect the existing repository and identify its framework, package manager, and configuration.
2. If the repository is empty, initialize the complete application.
3. Produce an implementation plan internally and execute it.
4. Create or modify actual source files in the working directory.
5. Implement all essential functionality completely, not as pseudocode.
6. Do not stop after building the homepage.
7. Do not leave empty event handlers, fake conversions, nonfunctional buttons, or unfinished core features.
8. Run linting, TypeScript checks, production builds, and applicable tests.
9. Resolve errors instead of merely reporting them.
10. Provide a concise completion report with verification evidence.

Make reasonable engineering decisions without repeatedly requesting confirmation.

Do not claim a feature is complete until it has been implemented and verified.

---

# 1. PRODUCT VISION

This is not a basic image upload form.

It should feel like a premium online utility comparable in experience quality to established image conversion products, while maintaining an original visual identity.

The interface must prioritize:

- Trust and privacy
- Fast task completion
- Excellent mobile usability
- Strong visual hierarchy
- Accessible interactions
- Reliable batch processing
- Search-engine discoverability
- Low cumulative layout shift
- Future advertising monetization
- Clear, accurate conversion feedback

The converter itself is the primary product.

Do not bury it beneath an oversized hero banner, advertisements, or unnecessary marketing sections.

### Design direction

Use a premium, understated visual system:

- Clean off-white light theme and carefully designed dark theme
- Strong typography using performant system fonts or bundled local fonts
- Professional blue or indigo primary accent
- Restrained use of gradients
- Soft borders and subtle shadows
- Rounded components with consistent radii
- Precise spacing and alignment
- Lucide icons where useful
- Clear interactive hover, focus, loading, success, and error states

Avoid generic AI-generated dashboard aesthetics, excessive glassmorphism, oversized headings, and distracting animations.

Create a coherent design system rather than styling individual sections independently.

---

# 2. REQUIRED TECHNOLOGY STACK

Use:

- Current stable compatible Next.js with App Router
- React
- TypeScript with strict mode enabled
- Tailwind CSS
- Lucide React icons
- Web Workers
- OffscreenCanvas and createImageBitmap
- HTMLCanvasElement fallback when appropriate
- fflate for ZIP archives
- Vitest for unit tests
- React Testing Library for component tests
- Playwright for end-to-end testing
- ESLint
- npm with a committed lockfile

Use compatible, reproducible dependency versions. Verify compatibility rather than guessing dependency versions.

Do not introduce a database, authentication system, upload API, backend processing service, or server actions.

### Static hosting requirement

Configure Next.js for static export:

`output: 'export'`

All published pages must build as static HTML and client assets.

Do not use features incompatible with static export, including runtime server redirects, request-dependent route handlers, or on-demand dynamic routes.

Do not use the default Next.js server image optimization service.

Use browser APIs only within client-side code and appropriate lifecycle boundaries.

The website must be deployable from the generated `out/` directory.

---

# 3. FOLDER STRUCTURE

Use the following structure as the architectural baseline. Additional files are allowed when needed for a clean production implementation.

    config/
      site.ts
      converters.ts

    lib/
      converter/
        types.ts
        constants.ts
        helpers.ts
        capabilities.ts
        worker.ts
        zip.worker.ts
        worker-client.ts
        hooks.ts

    components/
      ui/
        Button.tsx
        Slider.tsx
        Select.tsx
        Progress.tsx
      layout/
        Header.tsx
        Footer.tsx
        ThemeProvider.tsx
        ThemeToggle.tsx
      converter/
        Dropzone.tsx
        ConversionSettings.tsx
        FileQueue.tsx
        FileItem.tsx
        DownloadActions.tsx
      Converter.tsx
      AdSlot.tsx
      Breadcrumbs.tsx
      FAQSection.tsx
      RelatedConverters.tsx
      JsonLd.tsx

    app/
      layout.tsx
      page.tsx
      globals.css
      sitemap.ts
      robots.ts
      not-found.tsx
      [slug]/
        page.tsx
      (static)/
        privacy/page.tsx
        about/page.tsx
        contact/page.tsx

    tests/
      unit/
      components/
      e2e/
      fixtures/

    public/
      favicon.svg
      og-image.png

    .env.example
    next.config.ts
    package.json
    README.md

Keep processing logic separate from presentation components.

Do not place the entire application inside one enormous React component.

---

# 4. CENTRAL CONVERTER CONFIGURATION

Implement `config/converters.ts` as the single source of truth for converter landing pages.

Use this TypeScript interface:

    export type FileFormat =
      | 'jpg'
      | 'jpeg'
      | 'png'
      | 'webp'
      | 'any';

    export interface ConverterPage {
      slug: string;
      from: FileFormat;
      to: FileFormat;
      aliases: string[];
      status: 'live' | 'planned';
      title: string;
      metaDescription: string;
      h1: string;
      intro: string;
      howToSteps: string[];
      faqs: {
        question: string;
        answer: string;
      }[];
      relatedSlugs: string[];
      extraNotes?: string;
    }

Implement typed helpers:

- `getLiveConverters()`
- `getConverterBySlug(slug)`
- `getRelatedConverters(slug)`
- `normalizeFormat(format)`
- `isSupportedConversion(from, to)`

Validate configuration invariants through automated tests.

Every slug must be unique.

Every related slug must reference an existing live converter.

No planned converter may appear in the public sitemap, navigation, or generated static paths.

### First six live routes

Implement all six:

1. `/png-to-jpg`
2. `/jpg-to-png`
3. `/webp-to-jpg`
4. `/webp-to-png`
5. `/png-to-webp`
6. `/jpg-to-webp`

Use `jpg` as the canonical URL representation for JPEG.

The actual MIME type must be `image/jpeg`, never `image/jpg`.

Treat `jpeg` as an accepted input alias.

Use aliases such as `png-to-jpeg` and `jpeg-to-webp` for normalization and future host-level redirects.

Do not accidentally produce duplicate indexed pages for aliases.

Because static export cannot perform server-side redirects, document optional deployment-level 301 redirect configuration separately. The application must not depend on those redirects to function.

### Content requirements

Each live landing page must have entirely unique and useful SEO copy.

No template-generated paragraphs with only format names changed.

Each route needs:

- Unique meta title
- Unique meta description
- Unique H1
- Purpose-specific introduction
- At least four actionable how-to steps
- At least three genuinely useful FAQs
- Input/output compatibility explanation
- Relevant practical limitations
- Helpful internal links to related converters

Use these route-specific content briefs.

**PNG to JPG**

Explain transparent backgrounds, the background color picker, converting graphics to JPEG, and why lossy JPEG may be smaller for photographs but not necessarily for every PNG.

Include FAQs about alpha transparency, quality loss, and suitable use cases.

**JPG to PNG**

Explain that PNG is lossless for subsequent encoding but converting an existing JPG cannot recover details already removed by JPEG compression.

Explain why output files may be larger and when PNG is useful for editing workflows.

**WebP to JPG**

Explain compatibility with applications that do not accept WebP, transparent-background flattening, and JPEG's inability to preserve transparency.

Explain that repeated lossy encoding can introduce artifacts.

**WebP to PNG**

Explain preserving decoded transparency, lossless PNG output encoding, and why converting an existing lossy WebP does not recover lost visual details.

**PNG to WebP**

Explain modern browser delivery, the possibility of smaller files, alpha preservation, and the difference between PNG lossless encoding and browser WebP encoder behavior.

Do not promise lossless WebP output unless the actual selected encoder guarantees it.

**JPG to WebP**

Explain web image delivery, quality-versus-size tradeoffs, browser support, and why actual compression savings depend on image content and encoder settings.

Do not promise a fixed 30% reduction.

### Editorial standard

Write for a real person trying to solve a conversion problem.

Avoid keyword stuffing, repetitive sentences, exaggerated claims, and generic paragraphs that could appear on every route.

Content should be concise but genuinely informative.

---

# 5. SEO ARCHITECTURE

Implement SEO using static server-rendered Next.js pages.

The website must not rely on client-side JavaScript to insert essential SEO page content.

### Metadata

Each converter route must generate:

- Unique title
- Unique meta description
- Canonical URL
- Open Graph title and description
- Appropriate social preview metadata
- Robots directives

Set `metadataBase` from the configured site URL.

Read the canonical production URL from a documented environment variable, such as `NEXT_PUBLIC_SITE_URL`.

Provide a safe development default while clearly documenting that the production URL must be configured before deployment.

Do not create fictional business identities or misleading organizational claims.

### Dynamic routing

In `app/[slug]/page.tsx`:

- Use `generateStaticParams()`
- Generate paths from live canonical slugs only
- Use `dynamicParams = false`
- Return a genuine 404 for unsupported routes
- Read route parameters using the Promise-based App Router API supported by the installed Next.js version
- Use `generateMetadata()` for page-specific metadata
- Keep the converter engine in a Client Component
- Keep descriptions, headings, breadcrumbs, FAQs, and related-link sections statically rendered

Do not accidentally create a client-only SEO landing page.

### Sitemap

In `app/sitemap.ts`:

- Include homepage
- Include six live converter pages
- Include About
- Include Contact
- Include Privacy Policy
- Exclude planned routes
- Exclude URL aliases
- Exclude unsupported routes

Use valid canonical absolute URLs.

Avoid fabricated last-modified dates. Use an actual known release/update date or omit optional dates.

### Robots

Implement a valid `robots.txt` response using the App Router metadata convention.

Reference the canonical sitemap URL.

Allow crawling of public static pages.

### Structured data

Implement appropriate JSON-LD:

- `WebSite` for the website
- `SoftwareApplication` or `WebApplication` for the converter utility
- `BreadcrumbList` on converter pages
- `FAQPage` only for FAQ content visibly present on the page

Do not manufacture ratings, reviews, prices, or social profiles.

Understand that FAQ structured data does not guarantee Google FAQ rich results.

Generate JSON-LD safely, preventing unsafe script-breaking content.

### Internal linking

Create useful contextual links between related converter pages.

The homepage must provide crawlable links to all six live converters.

Every converter landing page must link to relevant other tools.

Use descriptive anchor text.

No dead links or planned-tool links presented as functioning tools.

### SEO quality

Implement:

- Semantic HTML
- One clear H1 per page
- Correct heading hierarchy
- Descriptive page URLs
- Helpful introductory copy
- Server-rendered informational sections
- Clean navigation
- Accurate image alt text
- Good page experience
- Accessible content
- Low JavaScript overhead where practical

Never claim that implementation alone guarantees indexing, rankings, AdSense approval, or search traffic.

---

# 6. REAL CLIENT-SIDE CONVERSION ENGINE

This is the highest-priority implementation.

All conversion must use actual browser decoding and encoding.

Do not rename files as a substitute for conversion.

Do not simulate progress while performing no work.

Do not call image conversion APIs.

### Supported formats

Inputs:

- JPEG/JPG
- PNG
- WebP

Outputs:

- JPG
- PNG
- WebP

The generic homepage accepts any supported input and allows the user to choose a valid output format.

The keyword `any` is a UI selection state, not an actual output MIME type.

Do not claim SVG, GIF, AVIF, HEIC, PDF, or animated image support.

Reject unsupported inputs clearly.

### Worker implementation

Use a dedicated worker in:

`lib/converter/worker.ts`

Instantiate using a Next.js-compatible module-worker pattern.

Implement a typed request/response protocol with unique job identifiers and explicit success/error messages.

Worker processing pipeline:

1. Receive the source image Blob/File and conversion settings.
2. Decode using `createImageBitmap()`.
3. Respect embedded image orientation using `{ imageOrientation: 'from-image' }` where supported.
4. Validate decoded dimensions and pixel count.
5. Create an OffscreenCanvas with the appropriate dimensions.
6. Obtain a valid 2D rendering context.
7. Apply the selected background color if necessary.
8. Draw the decoded image.
9. Encode to the requested MIME type.
10. Validate that the resulting Blob actually uses the requested format.
11. Return the completed Blob and associated metadata.
12. Dispose of the ImageBitmap and temporary processing resources in `finally` blocks.

Ensure image orientation is not applied twice.

Do not use synchronous base64 encoding for large images.

Do not use `canvas.toDataURL()` as the primary conversion method.

### Alpha protection

When converting PNG or WebP to JPEG:

- Expose a color picker in the interface
- Default to `#FFFFFF`
- Validate hexadecimal colors
- Fill the canvas before rendering the source image
- Never allow accidental black backgrounds caused by lost transparency

Preserve transparency for PNG outputs.

For WebP outputs, preserve transparency where the browser encoder supports it.

Only show the background picker when the selected input/output combination makes it relevant.

### Format verification

Never assume that specifying `image/webp` produces a WebP Blob.

Browsers may silently fall back to PNG.

After encoding:

- Verify Blob existence
- Verify nonzero Blob size
- Verify expected MIME type
- Verify the encoded file signature where appropriate

If the output is not actually in the requested format, treat conversion as unsupported or failed.

Never save a PNG payload with a `.webp` or `.jpg` extension.

### Browser compatibility

Perform runtime feature detection for:

- Worker support
- OffscreenCanvas
- createImageBitmap
- Available encoding methods
- WebP export support
- Requested output MIME support

Do not depend on user-agent sniffing alone.

If worker OffscreenCanvas processing is unavailable, provide an actual fallback using HTMLCanvasElement where supported.

The fallback must yield between queued files to keep the interface as responsive as practical.

If the browser lacks the required encoder, show an accessible explanation rather than pretending conversion succeeded.

Document browser limitations accurately.

### Safety guards

Constants:

- Maximum files: 30
- Maximum input file size: 25 MiB each
- Maximum decoded pixels: 40 million
- Maximum image dimension: 16,384 pixels

Validate dimensions against browser/runtime canvas capabilities as well.

Handle browser resource errors gracefully.

Validate signatures for JPEG, PNG, and WebP, not just extensions.

Check extension/MIME/signature consistency when possible.

Reject corrupt files cleanly.

Avoid decoding unsupported or obviously suspicious content.

### Performance

Create a bounded worker pool.

Use at most two image conversion workers concurrently by default, with a sensible lower-memory strategy for mobile devices.

Do not create one worker per uploaded image.

Support:

- Queued work
- Concurrent execution within a safe limit
- Progressive results
- Per-file failures
- Queue cancellation
- Retry of failed files
- Worker termination on teardown

Maintain responsive UI during ordinary batch conversion.

Do not make unverifiable absolute promises of 60 FPS on every device.

---

# 7. REACT STATE AND QUEUE MANAGEMENT

Implement:

`lib/converter/hooks.ts`

Expose a reusable `useConverter()` hook.

Model each file using a typed state machine.

Statuses:

- pending
- processing
- completed
- failed
- cancelled

Store:

- Stable file ID
- Original filename
- Original size
- Source format
- Target format
- Conversion status
- Progress
- Output Blob
- Converted size
- Error message
- Result filename

Avoid duplicate queue entries caused by rapid clicks or repeated renders.

Prevent multiple simultaneous starts for the same job.

Guard against stale worker responses after cancellation or component unmount.

Cancellation must stop queued work and terminate or invalidate in-progress worker jobs.

Never display a cancelled result as completed.

Changing output settings must not leave old results labeled as if they were generated with the new settings.

Choose and implement a clear policy for invalidating completed outputs when settings change.

Use React state and refs appropriately.

Avoid unnecessary re-rendering of all file cards during each queue event.

---

# 8. MEMORY AND RESOURCE MANAGEMENT

Browser memory usage is a critical production requirement.

Implement explicit cleanup for:

- Generated object URLs
- Thumbnail preview URLs
- ImageBitmap objects
- Temporary canvases
- Worker instances
- Removed queue items
- Cancelled jobs
- Completed ZIP operations

Revoke preview URLs whenever previews are removed or replaced.

For downloaded file URLs, revoke after the download has been safely initiated, allowing a short browser-compatible cleanup interval when immediate revocation could break downloads.

Do not keep unused large buffers alive.

Avoid loading all 30 files into decoded canvases simultaneously.

Gracefully handle memory pressure and resource exhaustion.

---

# 9. ZIP BATCH DOWNLOAD

Implement real ZIP creation using fflate.

Use a dedicated worker:

`lib/converter/zip.worker.ts`

ZIP creation must not synchronously block the React interface.

Features:

- Download completed files individually
- Download all completed outputs as ZIP
- Correct MIME: `application/zip`
- Correct file extensions
- ZIP filename: `converted-images.zip`
- Collision-safe output names
- Correct handling of duplicate source basenames
- Reliable handling of individual failed conversions

Example output naming:

`photo.jpg`

`photo-1.jpg`

`photo-2.jpg`

Use a stable deterministic naming algorithm.

Use a safe filename sanitizer while preserving useful Unicode characters.

Include only successfully converted files in ZIP downloads, and clearly disclose any excluded failed files.

Apply a practical memory safety threshold to archive generation, with an accessible explanation and individual-download alternative when a batch is too large.

Do not silently fail when creating an archive.

Test ZIP contents by extracting generated files in automated tests.

---

# 10. PREMIUM CONVERTER INTERFACE

Implement:

`<Converter defaultFrom="any" defaultTo="any" />`

For dedicated pages:

`<Converter defaultFrom="png" defaultTo="jpg" />`

The component must support both generic and format-specific contexts.

### A. Upload zone

Create a prominent drag-and-drop area with:

- Dashed border
- Clear upload icon
- Drag-over feedback
- Browse files button
- Mobile gallery/file picker support
- Native camera capture option where applicable
- Supported format information
- Maximum batch limits
- Full keyboard accessibility

Use native input elements where appropriate.

Make the dropzone keyboard-operable using Enter and Space.

Use valid contemporary ARIA semantics. Do not depend on obsolete drag-and-drop ARIA properties.

Provide accessible instructions and focus indicators.

### B. Format selection

Homepage:

- Select source format or accept automatic detection
- Select output format
- Prevent conversion until a concrete output format is selected

Dedicated route:

- Preselect and constrain the expected source format
- Preselect the route's output format
- Reject mismatched files with a useful error

Avoid contradictory route titles and actual converter behavior.

### C. Quality setting

Show quality control only for:

- JPG output
- WebP output

Range:

- Minimum: 0.1
- Maximum: 1.0
- Default: 0.9

Display the percentage and make the control accessible.

Explain that different browser encoders may produce different file sizes.

Do not show the slider for PNG.

### D. Background setting

Only display when:

- Input may contain alpha transparency
- Output is JPG/JPEG

Provide a native color input plus accessible hex display/input where useful.

Default: white.

### E. File dashboard

Each file should display:

- File name
- Original size
- Destination format
- Converted size
- Actual size difference
- Processing status
- Error message when applicable
- Download action on success
- Retry action on failure
- Remove action where safe

### Compression calculation

Calculate:

`((originalSize - convertedSize) / originalSize) * 100`

Display:

- Positive result: "24.5% smaller"
- Negative result: "12.3% larger"
- Zero result: "Same file size"

Never label an increased file size as a compression saving.

### F. Batch controls

Include:

- Add more files
- Convert
- Cancel processing
- Retry failed
- Download all as ZIP
- Clear all

Every displayed action must work.

Disable invalid actions appropriately.

### G. Progress

Display:

- Total files
- Completed count
- Failed count
- Current processing count
- Overall progress

Use an accessible native or ARIA progress indicator.

Do not invent precise byte-level progress for browser encoding operations when that information is unavailable.

Use meaningful file-count progress and indeterminate processing states as appropriate.

---

# 11. HOMEPAGE STRUCTURE

Build a complete homepage with the following layout.

### Section 1 — Navigation

Logo on left.

Navigation to:

- Image Converter
- Supported Tools
- About
- Theme toggle

Mobile navigation must be accessible.

### Section 2 — Hero

Premium headline:

"Convert Images Instantly. Keep Every File Private."

Supporting copy:

"Convert JPG, PNG, and WebP images directly in your browser. No uploads, no accounts, and no waiting for a server."

Clear privacy reassurance.

Keep the hero compact enough that users can quickly reach the converter.

### Section 3 — Main converter

The converter must appear in the primary initial viewport area on desktop.

Design it as the main visual focal point.

Avoid placing distracting ads above the upload area.

### Section 4 — Supported conversion tools

Show six cards.

Each card includes:

- Format pair
- Short, meaningful explanation
- Directional icon
- Link to converter page

Use actual working routes.

### Section 5 — Why use this converter?

Provide genuinely useful trust benefits:

- Local image processing
- Batch conversion
- Adjustable quality
- Transparency handling
- Cross-device browser access

Avoid claims not backed by implemented functionality.

### Section 6 — How it works

Explain three or four simple steps.

### Section 7 — Privacy explanation

Explain what local processing means and what it does not mean.

### Section 8 — Frequently asked questions

Include genuinely helpful answers.

### Section 9 — Footer

Include:

- Tool links
- Privacy Policy
- About
- Contact
- Copyright and legal links

---

# 12. CONVERTER LANDING PAGE STRUCTURE

All six format-specific pages must follow a consistent visual system while using unique written content.

Page hierarchy:

1. Navigation
2. Breadcrumb
3. Unique H1
4. Route-specific introduction
5. Primary converter
6. Relevant explanation or format comparison
7. How-to steps
8. Contextual usage tips
9. FAQ
10. Related converters
11. Reserved ad areas
12. Footer

The converter must remain the primary element.

Do not create SEO pages where visitors must scroll through long text before reaching the actual tool.

Use quality content rather than artificial word-count padding.

---

# 13. ADVERTISING AND MONETIZATION READINESS

Create:

`components/AdSlot.tsx`

Props:

    interface AdSlotProps {
      id: string;
      slotPosition: 'below-tool' | 'in-content';
    }

Environment flag:

`NEXT_PUBLIC_ADS_ENABLED`

Default: `false`

### Behavior

If disabled:

- Do not load ad network scripts
- Do not display fake advertisements
- Do not leave unnecessary large blank spaces

If enabled:

- Reserve a predictable layout footprint
- Use at least 280px height where the selected responsive slot requires it
- Display a clearly labeled placeholder until real ads are integrated
- Never misrepresent a placeholder as a live advertisement

### Placement

Use restrained placements:

- Below the primary converter
- Between useful informational sections

Avoid:

- Ads over the upload zone
- Full-screen interruptions
- Auto-opening pop-ups
- Ads disguised as conversion buttons
- Layout shifts after content loads
- Excessive sticky advertising on mobile

Do not integrate actual AdSense scripts without configuration and consent requirements being addressed.

Structure the code so future ad-network integration can be added without rewriting the core converter.

A visible placeholder does not mean advertising is live or generating revenue.

---

# 14. PRIVACY AND COMPLIANCE

### Privacy Policy

Create `/privacy`.

Explain clearly:

- Images are processed locally in the browser
- No image-upload endpoint exists
- Selected files are not transmitted to the application server
- Files are held in browser memory during processing
- Clearing the queue releases associated browser resources
- Generated files are downloaded by the user
- Theme preferences may be stored locally
- Any future analytics or advertisements may introduce separate data processing requiring appropriate disclosures

Do not claim the website makes zero network requests; the browser still loads site assets.

Avoid absolute privacy guarantees that would become inaccurate after ad integration.

### About

Create `/about`.

Explain:

- Project mission
- Why browser-based conversion
- Supported formats
- Local-processing architecture
- Limitations of image re-encoding

### Contact

Create `/contact`.

Use semantic, accessible form controls.

Because this project has no backend, do not implement a fake contact submission that displays "Message sent" without sending anything.

Provide a functional client-side email composition workflow using a configured contact address, or an explicit alternative that does not pretend a message was delivered.

Keep contact configuration centralized.

Document any production configuration requirements.

---

# 15. ACCESSIBILITY REQUIREMENTS

Target WCAG 2.2 AA where applicable.

Implement:

- Proper labels
- Accessible form controls
- Keyboard navigation
- Visible focus rings
- Logical tab order
- Screen-reader status announcements
- Accessible progress indicators
- Proper error associations
- Adequate color contrast
- Reduced-motion preference handling
- Semantic navigation and main landmarks
- Correct button disabled states
- Accessible drag/drop alternatives
- Keyboard-usable theme switching

Do not implement clickable `div` elements when a real `button` or label is more appropriate.

Ensure dialogs, if any, handle focus and dismissal properly.

---

# 16. RESPONSIVE BEHAVIOR

Support:

- Small mobile screens
- Modern Android phones
- iPhone Safari
- Tablets
- Desktop
- Large desktop displays

Mobile priorities:

- Comfortable touch targets
- No horizontal overflow
- Proper upload picker behavior
- Readable filenames
- Compact progress display
- Responsive file rows
- Clear actions
- Safe-zone spacing
- Efficient memory use

Desktop priorities:

- High-quality visual hierarchy
- Balanced page width
- Good use of whitespace
- Strong alignment
- Predictable tool layout

Test around 360px, 390px, 768px, 1024px, and 1440px viewport widths.

---

# 17. PERFORMANCE AND CORE WEB VITALS

Optimize for:

- LCP
- CLS
- INP
- Lightweight JavaScript
- Efficient worker processing
- Avoiding main-thread CPU spikes
- Fast static asset delivery

Best practices:

- Server-render informational content
- Keep browser conversion code client-side
- Lazy-load optional processing modules when useful
- Avoid excessive animation libraries
- Avoid unnecessarily large icon bundles
- Avoid external font requests when practical
- Use stable content dimensions
- Keep ad containers layout-stable
- Avoid unnecessary network requests

Target excellent Lighthouse scores on representative pages, but report actual measured results rather than fabricated scores.

Do not sacrifice conversion correctness for superficial performance metrics.

---

# 18. ERROR HANDLING

Implement friendly errors for:

- Unsupported file format
- Incorrect source format on a dedicated page
- File exceeding 25 MiB
- More than 30 selected files
- Corrupted image
- Decode failure
- Invalid image dimensions
- Excessive pixel count
- Browser lacking required encoder
- Web Worker initialization failure
- Conversion failure
- Insufficient browser memory
- ZIP creation failure
- Download preparation failure

Do not show generic "Something went wrong" messages when a clearer explanation can be provided.

One failed file must not crash the entire batch.

Allow recovery or retry where possible.

---

# 19. REQUIRED TESTING

Create meaningful automated tests, not placeholder assertions.

### Unit tests

Verify:

- MIME normalization
- File extension mapping
- JPEG/PNG/WebP file signatures
- Size formatting
- Safe filename generation
- Deduplication
- Compression percentage math
- Hexadecimal color validation
- Configuration integrity
- Live route filtering
- Related route references

### Conversion tests

Use real small fixture images.

Verify:

- PNG to JPG
- JPG to PNG
- JPG to WebP
- WebP to JPG
- WebP to PNG
- PNG to WebP
- Transparency flattening with white
- Transparency flattening with a custom color
- Preservation of alpha where applicable
- JPEG EXIF orientation
- Correct output MIME
- Correct output signature
- Nonempty output
- Expected decoded dimensions
- Corrupt-image error handling

Do not use mocked blobs as the only evidence that the actual encoder works.

### Queue tests

Verify:

- Multiple file selection
- 30-file limit
- 25 MiB limit
- Individual failures
- Retry behavior
- Cancellation
- Duplicate filename handling
- Stale worker-message protection
- Cleanup after removal

### ZIP tests

Verify:

- ZIP can be generated
- ZIP can be extracted
- Expected files exist
- Names are unique
- Contents use the correct image formats

### SEO tests

Verify:

- All six canonical routes exist
- Planned routes are excluded
- Unsupported routes return 404
- Unique page titles
- Unique meta descriptions
- Correct canonical metadata
- Sitemap contains only intended URLs
- JSON-LD parses successfully
- Breadcrumb links are valid

### End-to-end tests

Use Playwright for:

- Desktop upload and conversion
- Mobile-sized interface
- Keyboard-based upload interaction
- Full batch workflow
- ZIP download
- Theme toggle
- Browser error messaging
- Main navigation
- Privacy and footer pages

Run Chromium and WebKit tests where the environment supports them.

Explicitly check that image conversion does not generate file-upload network requests.

Test unsupported output encoding behavior by injecting a testable capability adapter or equivalent dependency boundary.

If certain browsers cannot run in the environment, report that limitation rather than claiming complete cross-browser verification.

---

# 20. DEVELOPER EXPERIENCE

Create a high-quality README containing:

- Project overview
- Feature list
- Technology stack
- Installation instructions
- Development commands
- Build commands
- Testing commands
- Static deployment instructions
- Environment variables
- How to add a new converter route
- How worker processing works
- Browser compatibility limitations
- Privacy model
- Advertising integration points
- Production launch checklist

Provide `.env.example` with documented variables:

    NEXT_PUBLIC_SITE_URL=http://localhost:3000
    NEXT_PUBLIC_ADS_ENABLED=false
    NEXT_PUBLIC_CONTACT_EMAIL=

No image-processing API keys should be needed.

Add appropriate package scripts:

- `dev`
- `build`
- `lint`
- `typecheck`
- `test`
- `test:e2e`

Prefer an easily reproducible local setup.

---

# 21. IMPLEMENTATION PHASES

Execute these phases in order, but complete the project rather than stopping to ask for permission after each phase.

### Phase 1 — Foundation

Initialize Next.js, TypeScript, Tailwind CSS, global styles, site configuration, theme system, metadata, and shared layout.

### Phase 2 — Conversion engine

Implement real decoding, encoding, MIME validation, worker processing, transparency handling, file limits, and browser compatibility.

### Phase 3 — Batch workflow

Implement worker pool management, queue handling, progress states, cancellation, retries, safe downloads, cleanup, and ZIP creation.

### Phase 4 — Premium interface

Build the homepage, converter UI, reusable components, dark theme, responsive behavior, accessible interactions, and polished empty/loading/error/success states.

### Phase 5 — SEO pages

Build all six unique converter pages, static metadata, canonical URLs, sitemap, robots directives, structured data, and internal navigation.

### Phase 6 — Compliance and monetization

Add Privacy, About, Contact, and AdSlot components.

### Phase 7 — Verification

Run all checks, test real conversions, inspect the production build, fix any errors, and confirm the static export.

---

# 22. DEFINITION OF DONE

The task is not complete until the following are true:

- The application starts locally.
- All six canonical converter pages are implemented.
- The generic homepage converter works.
- Image data is processed on the client.
- PNG/JPG/WebP conversions produce real valid files.
- Transparency behavior is correct.
- Unsupported encoders cannot produce misleading extensions.
- Batch conversion works.
- Individual downloads work.
- ZIP downloads work.
- Duplicate filenames are handled.
- Queue cancellation and retry work.
- Errors are recoverable.
- Object URLs and workers are cleaned up.
- Mobile layout is usable.
- Dark theme works.
- Navigation works.
- Static pages exist.
- SEO metadata is correctly generated.
- Sitemap and robots output are valid.
- Planned pages are not indexed.
- TypeScript passes.
- Linting passes.
- Tests pass or any environment limitations are explicitly documented.
- Production build succeeds.
- The static `out/` directory is generated.
- No fake feature or simulated conversion remains.

## FINAL OUTPUT REQUIREMENTS

When implementation is complete, provide:

1. **Implementation summary** — what was built.
2. **File structure** — actual created files.
3. **Functional verification** — conversions and scenarios tested.
4. **Build and test results** — exact commands and observed outcomes.
5. **Local run instructions** — commands to start and test the application.
6. **Deployment readiness** — required settings before production.
7. **Known limitations** — explicitly identified, not concealed.

Do not present unfinished work as production-ready.

## FINAL QUALITY DIRECTIVE

Think like a Staff Engineer responsible for a real public-facing product.

Prioritize correctness, reliability, performance, accessibility, privacy, SEO integrity, and maintainability.

Build the real product, not merely its appearance.

An attractive UI with a broken converter is a failure.

A functioning converter with inaccurate SEO and poor accessibility is also incomplete.

**Deliver a fully implemented, tested, polished image conversion website that can serve as the foundation of a sustainable, search-driven online utility business.**