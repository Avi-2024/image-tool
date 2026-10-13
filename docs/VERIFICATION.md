# Verification — 2026-10-13

## Scope and provenance

The repository was empty. The user subsequently authorized pushing the supplied docs and building from the brief. No existing application code was replaced. The documentation was pushed first; the implementation is a separate commit.

Ten public pages are built: homepage, six canonical converters, About, Privacy and Contact. Static export also emits robots, sitemap and a 404 page. All conversion operates locally. No public deployment, ad network or paid service was configured.

## Command results

| Command | Observed result |
| --- | --- |
| `npm install` | Installed the reproducible dependency tree; package-lock committed |
| `npm run lint` | Passed, zero errors/warnings after correction |
| `npm run typecheck` | Passed |
| `npm run test` | 25 tests passed: 21 unit, four presentation component tests |
| `npm run build` | Passed; static `out/` generated, six dynamic converter paths prerendered |
| `npm run test:e2e -- --project=webkit --grep 'png to jpg'` | Blocked before test execution: missing GTK/GStreamer and related system libraries |
| Local Chromium launch | Blocked by host socket restrictions before opening a page |
| Cloud Chromium harness | 18 real browser checks passed; details in `browser-results.json` |

## Actual browser functional evidence

The harness opened the real production-export pages and exercised their actual input-change handlers, controls, queue, workers/fallback, encoding and download preparation. Fixtures were genuine JPEG/PNG/WebP files, including alpha, EXIF rotation, animation and corrupt input. Test-only fault injection exercised unsupported encoder output and retry; it was not used to fake successful conversions.

Verified all six conversion pairs: MIME, file signature, extension, nonempty output, dimensions; alpha for PNG/WebP; white and custom green flattening for JPEG; 90-degree EXIF orientation; HTMLCanvas fallback; isolated corrupt/unsupported/animated failures; 30-file and 25 MiB guards; cancellation and stale-response suppression; settings invalidation; duplicate names; stored ZIP member extraction with JPEG header checks; source mismatch; unsupported WebP fallback rejection and successful retry; canonical URLs, unique metadata, visible JSON-LD and 10 sitemap entries; no horizontal overflow at iframe widths 360/390/768/1024/1440; theme switching. Observed converter network requests were ordinary GET asset/prefetch requests, with no conversion upload requests. Source contains no upload endpoint or conversion fetch/API call.

## Two visual refinement passes

1. Inspected the initial desktop and mobile layouts. Found heavy fallback typography, low workspace positioning, a clipped mobile output selector and small supporting labels. Bundled a local variable Inter font, restrained heading weight/size, moved the workspace upward, widened the mobile destination selector and improved label readability. See baseline and pass1 screenshots.
2. Inspected dark tablet success and mobile partial failure. Found excessive separation between Add images and the queue, repeated output labels on failed rows and a raw DataView error. Moved secondary actions into the queue header, refined the slider track, added visible download affordances, aligned thumbnail/result rows, removed redundant failed-row targets and introduced plain-language corrupt-file recovery. A final contrast correction keeps white primary-action text on #2563EB in both themes (approximately 5.17:1).

Final screenshots were inspected after these edits. Desktop selected-file view, desktop empty view, dark mobile success and light tablet partial-failure screenshots are retained under `screenshots/`. These are actual rendered browser screenshots, cropped to remove the test harness's surrounding whitespace. No product mockup or generated UI image was substituted.

## Browser environment limits

The cloud browser's native viewport was approximately 1348×926. Responsive inspection used same-origin embedded viewport sizes of 1440×900, 768×1024 and 390×844; overflow checks included 360 and 1024 px widths. Desktop screenshots show the visible portion of the 1440px embedded viewport; its centered converter was visible. Tablet captures show the native browser's visible height rather than a complete 1024px image. These are responsive-layout checks, not physical-device emulation or Safari verification. Full-page screenshot capture and direct screenshot clipping timed out; native viewport captures were used.

Processing was verified in live browser accessibility state: two active rows, queued remaining files, real processed counts, disabled duplicate actions and Cancel. The fast native screenshot path returned a prior frame, so no screenshot is falsely labeled as proof of active processing.

Actual ZIP bytes and members were checked through a test-only interception of the generated download anchor. A subsequent native cloud download-event observation timed out; a saved native download file was not verified. The standalone Playwright suite includes genuine OS download checks for a normal development host. Native picker selection was exercised but end-to-end picker/download behavior should be retested outside this cloud environment.

Keyboard Enter activation of the theme control was observed. Full keyboard-only traversal, a screen-reader session, OS reduced-motion preference behavior, Lighthouse/Core Web Vitals, low-memory real devices, Firefox and Safari/WebKit remain unverified. Reduced-motion CSS and focus styles are implemented. This is not a full WCAG conformance certification.

## Release configuration

The development canonical origin remains `http://localhost:3000`. Set `NEXT_PUBLIC_SITE_URL` to the real HTTPS website origin and `NEXT_PUBLIC_CONTACT_EMAIL` to the actual contact address, then rebuild. Ads default off. Contact honestly explains missing configuration. No public site or hosting account has been provisioned.

The test-only `public/__qa` directory is removed before the final release build. Generate stress fixtures and prepare that directory only for local QA. The release output contains no test fixture or QA harness assets.
