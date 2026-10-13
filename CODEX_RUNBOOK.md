# CODEX RUNBOOK — Exact use sequence

## Prerequisites

Start with a clean project repository or an existing Next.js project. Put `CODEX_MASTER_BRIEF.md` and `AGENTS.md` in the **repository root**. Open this exact folder in Codex (app, IDE integration, or CLI). Make a commit of any existing user code before major refactors.

## Step 1 — Plan (no code)

If `/plan` is available in your Codex interface, enable Plan mode. Then paste:

> Read `CODEX_MASTER_BRIEF.md` and `AGENTS.md` in full. Inspect the repository and available tools. Create a concrete, dependency-ordered execution plan with milestones for foundation, conversion engine, workers, accessible premium UX, six SEO pages, and browser testing. Include measurable quality gates, actual browser screenshot inspection, and static-export validation. Resolve conflicts explicitly. Do not edit application code during this planning step.

Review the plan for architecture, browser compatibility, memory safety and **visual screenshot checks**.

## Step 2 — Implement (leave Plan mode)

Paste:

> Implement the approved plan now and continue through every milestone without stopping at scaffolding. Follow `CODEX_MASTER_BRIEF.md` and `AGENTS.md` as authoritative requirements. Make actual repository edits. Build the real converter engine before styling. Then implement the polished PixelConvert interface and six SEO pages. Run lint, typecheck, tests, Playwright and production static export; fix failures. Use real image fixtures. Do not falsely claim any test passed. Do not deploy or enable third-party advertising.

## Step 3 — Visual master pass (separate follow-up)

Paste:

> Conduct a **principal product designer visual audit** of the implemented website. Start the application, take Playwright screenshots at 1440x900, 768x1024, 390x844, in light/dark themes, covering empty, uploaded, processing, success and error states where possible. Inspect the screenshots and list the ten most damaging visual/UX weaknesses. Make targeted improvements to typography, hierarchy, spacing, alignment, information density, responsive controls, and polished feedback. Repeat screenshots after fixing them. Avoid generic SaaS cards, oversized type, gradients, and filler sections. Preserve working conversion logic and SEO. Be candid about any screenshots or browser environments unavailable.

## Step 4 — Code quality review

Use `/review` if your Codex interface offers it, and additionally paste:

> Audit the code for correctness and production risks: browser output encoding lies, alpha/background bugs, orientation bugs, object URL leaks, zip naming collisions, worker cancellation races, corrupted files, accessible UX, broken links, SSR/static-export incompatibilities, SEO canonical/schema mistakes, and mobile layout defects. Fix real issues. Re-run relevant checks and record evidence in the final report.

## Step 5 — Local run and release

In terminal, from repository root:

```bash
npm install
npm run dev
```

Open `http://localhost:3000` and manually convert a test image. Then check the production build:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Run `npm run test:e2e` if Playwright/browser dependencies are installed and configured. Static output should be in `out/` as specified. Configure the real production site URL and contact address before deployment. Do not enable ads or deploy publicly without user approval.

## If using CLI

Install Codex by following the official documentation for your platform, open the repository directory, and run the `codex` command. In the IDE/app, open the corresponding project directory. Slash commands vary by interface/version; if `/plan` isn't available, simply request a plan in natural language. `AGENTS.md` is already provided, so **do not need `/init`** unless you are intentionally replacing or extending the repository instructions.

## Success check

The work is finished only after real conversions, realistic visual states, valid output formats, an accessible mobile UX, correctly generated static SEO routes, and recorded lint/typecheck/build/test results. No deployment, revenue or ranking guarantees are implied.
