# PixelConvert

A static Next.js image converter. JPG/JPEG, PNG and still WebP files are decoded and encoded in the visitor's browser. There is no image-upload API, database, account requirement or third-party processing service.

## Run

Requires Node.js 20.9+ and npm. The committed lockfile pins the installed dependency tree.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Supported routes: `/`, `/png-to-jpg/`, `/jpg-to-png/`, `/webp-to-jpg/`, `/webp-to-png/`, `/png-to-webp/`, `/jpg-to-webp/`, `/about/`, `/privacy/`, `/contact/`.

## Verify and build

```sh
npm run lint
npm run typecheck
npm run test
npm run build
npm run preview
```

Static output is generated in `out/`; the preview server defaults to port 4173 and serves a genuine 404 for missing paths. `scripts/dev.mjs` accepts supervisor flags and passes the supported hostname/port flags to Next.js.

For native Playwright (in a host that allows browser processes):

```sh
npx playwright install --with-deps chromium webkit
# After npm run build, run npm run preview in another terminal.
TEST_BASE_URL=http://127.0.0.1:4173 npm run test:e2e
```

`PW_CHROMIUM_EXECUTABLE` optionally selects an installed Chromium executable. No browser fingerprints or security controls need changing.

For the alternate same-origin browser harness used in this managed environment:

```sh
npm run qa:prepare
npm run build
npm run preview
```

Open `/__qa/index.html?w=1440&h=900&theme=light` and click **Run actual browser tests**. It uses the actual exported app inside an iframe, real fixture files, real conversion encoders and ZIP bytes. `state=chosen`, `state=success`, `state=error` and `state=processing` prepare real queue states for visual inspection. Other useful sizes are 768×1024, 390×844 and 360×844. The processing fixture must be generated using `python3 scripts/generate-large-fixture.py` (requires Pillow). The harness is deliberately not part of a release build: remove `public/__qa` before the final build. Never publish the test fixture directory.

## Architecture

- `config/converters.ts`: canonical route and unique content configuration. Six live slugs drive static generation, directory navigation and sitemap. Alias URLs are not duplicate indexed pages. Optional host-level 301s can map `jpeg` aliases to the canonical `jpg` routes.
- `components/Converter.tsx`: settings and state-aware actions. Presentation is separated into dropzone, settings and file-row components.
- `lib/converter/hooks.ts`: bounded batch scheduling (two workers on desktop, one at narrow viewport widths), cancellation, retries, stale-output invalidation and resource cleanup.
- `lib/converter/worker.ts` / `engine.ts`: OffscreenCanvas image encoding where available. A worker initialization failure or missing OffscreenCanvas uses an HTMLCanvas fallback. Worker instances are short-lived and terminated after each job, with at most two active jobs; this is bounded scheduling rather than a persistent worker pool.
- `lib/converter/zip.worker.ts`: ZIP generation off the UI thread using fflate. Files are stored without extra compression because image data is already encoded; colliding names remain unique.
- `app`: static server-rendered metadata, content, FAQs, JSON-LD, robots and sitemap.
- `public/fonts`: bundled Inter Latin variable font under the SIL Open Font License. No remote font requests.

## Safety and supported behavior

30 files; 25 MiB per input; 40 million decoded pixels; maximum dimension 16,384 px; 150 MiB output limit for ZIP preparation. JPEG, PNG and standard WebP headers are checked before decoding. Browser resources can impose lower limits.

The filename extension, MIME and file signature must match. Output bytes are verified before a download is offered. Animated WebP and APNG are rejected. No support is claimed for GIF, SVG, HEIC, AVIF, PDF or animation. JPEG flattens transparent pixels onto a chosen solid color. PNG preserves decoded pixels; converting a lossy source does not recover lost detail. WebP uses the browser encoder's quality control and is not advertised as guaranteed lossless. Exact encoded sizes vary by browser.

Cancel terminates active workers; a canvas fallback encoding cannot be interrupted mid-operation, but its late result is discarded. Changing settings invalidates old outputs. Downloads use temporary Blob URLs released after 30 seconds. Preview URLs are released on removal/clear/unmount. Workers and pending ZIP timers are cleaned up on unmount. Decode and preview validation use a sequential pipeline; large originals can still consume substantial browser memory, so use smaller batches on low-memory devices.

## Privacy, contact and ads

No image payload leaves the converter. Ordinary page assets and Next.js route prefetch requests still use the network. No analytics or ad-network scripts are included. The browser may store a theme preference in localStorage. Hosting request logs remain the hosting provider's responsibility.

Copy `.env.example` to `.env.local` and configure:

- `NEXT_PUBLIC_SITE_URL`: real HTTPS origin, used for canonical URLs, sitemap and metadata. Defaults to `http://localhost:3000` for development. The supplied repository URL is not a production website origin.
- `NEXT_PUBLIC_CONTACT_EMAIL`: real contact address. When absent, the page explains that contact is not configured. When present, the form opens a mailto draft and never claims a message was sent.
- `NEXT_PUBLIC_ADS_ENABLED`: defaults false. Enabling it shows a labeled reserved ad placement; no ad network integration or income is implied. Actual ads require a privacy review and consent handling before activation.

Rebuild after changing public environment values. Upload `out/` to a static host supporting directory index files and route 404s; set appropriate security headers at that host. Do not deploy `public/__qa` or generated test reports.

## Verification evidence

See `docs/VERIFICATION.md` and `docs/screenshots/`. The managed environment blocked native Chromium launching and lacked WebKit system libraries. Cloud Chromium was used for real conversion tests and screenshots. Responsive screenshots use same-origin iframe viewports rather than physical mobile/tablet devices. Safari, real-device performance, OS-level reduced-motion behavior and production domain configuration remain unverified. No ranking, ad approval or revenue guarantee is made.

## Production release and search indexing

Use `npm run build:release` for a **public** release. It stops if the HTTPS origin, indexing opt-in or contact email is missing, or if QA assets would ship. `npm run build` remains available for development previews, which default to `noindex, follow`.

1. Choose the real production domain/subdomain. Set `NEXT_PUBLIC_SITE_URL` to its root HTTPS origin without a path, query, fragment or credentials.
2. Set `NEXT_PUBLIC_CONTACT_EMAIL` to your actual support address and `NEXT_PUBLIC_ALLOW_INDEXING=true` only on production. Use `false` on staging/previews.
3. Optionally set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` to Search Console's HTML verification token, or use DNS verification independently. This token is public; it is not an API key.
4. Run lint, typecheck, unit tests, `npm run build:release` and browser tests. Public environment values are baked into static HTML/JavaScript: rebuild after every change.
5. Deploy only `out/` to your selected static host after approving public launch. Configure HTTPS, directory indexes and a real HTTP 404 for missing paths. Do not use an SPA catch-all returning homepage HTML with status 200. Redirect HTTP and alternate hostnames to the canonical HTTPS host in one hop; preserve paths.
6. Inspect the deployed homepage and all six tool URLs. They should return 200, have matching canonical URLs and no `noindex`/`X-Robots-Tag: noindex`. Verify `/robots.txt`, `/sitemap.xml`, static JS/worker/font assets, and a deliberately missing URL returning 404.
7. Verify the domain in Google Search Console, submit `/sitemap.xml`, run live URL inspection and request indexing of the homepage and six conversion pages. Monitor the Page indexing report. Search Console access and a deployed URL are required; local build verification cannot submit or prove indexing.

`npm run check:seo` examines the actual exported HTML: all ten pages, unique titles/descriptions, canonicals, social previews, visible FAQ schemas, internal links/fragments, robots, the 404 page, and absence of test assets. `-- --release` also requires indexable pages and the canonical sitemap reference. It checks the exported files, not the host's HTTP headers, redirects or availability.

### Host configuration and performance

Serve fingerprinted `/_next/static/` assets with `Cache-Control: public, max-age=31536000, immutable`; revalidate HTML, robots and sitemap so releases do not leave stale metadata. Enable Brotli/gzip where supported. Set `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin` and disable unused camera/microphone/geolocation through Permissions-Policy. Validate any Content-Security-Policy with Next's inline hydration/theme scripts and module workers before enforcing it; a blind restrictive policy can break conversion. Confirm real downloads on Safari and physical mobile devices and measure Core Web Vitals on the final host.

### Advertising launch

Reserved ad components remain below the converter and keep a stable footprint when enabled. The flag only shows an honest placeholder; it does not activate an ad network. Before integrating a network, update privacy disclosures, handle applicable consent, keep ads clearly separated from upload/download actions and verify mobile layout shifts. Add `ads.txt` only with the real publisher information supplied by the chosen network. No approval, ranking or revenue is guaranteed.

Google references: [technical requirements](https://developers.google.com/search/docs/essentials/technical), [sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).
