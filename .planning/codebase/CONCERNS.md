# Codebase Concerns

**Analysis Date:** 2026-06-08

## Tech Debt

**Dead `work` Section — Code without Route:**
- Issue: `src/lib/mdx.ts` exports `loadCaseStudies()` which tries to load MDX files from `src/app/work/`, but that directory was removed. `src/app/page.tsx` imports and calls `loadCaseStudies()`, storing the result in `caseStudies`, but the entire `<CaseStudies>` component and `<Clients>` / `<Testimonial>` / `<Services>` components are commented out. The import of 9 client logos and `CaseStudy` types is therefore dead code.
- Files: `src/lib/mdx.ts:76-78`, `src/app/page.tsx:13-23`, `src/app/page.tsx:180`
- Impact: Build succeeds only because `caseStudies` resolves to `[]` (no matching files), but the function and all dead imports remain, increasing bundle analysis noise and making the intent of the page unclear.
- Fix approach: Remove `loadCaseStudies()` from `src/lib/mdx.ts`, remove the `CaseStudy` interface, remove the dead client logo imports and `CaseStudy`-related component code from `src/app/page.tsx`.

**`next.config.mjs` references non-existent `@/app/work/wrapper`:**
- Issue: The `remarkMDXLayout` plugin is conditionally applied for paths matching `src/app/work`, pointing to `@/app/work/wrapper` as the MDX layout. The `src/app/work/` directory and `wrapper.tsx` do not exist.
- Files: `next.config.mjs:96-101`
- Impact: The regex branch never fires (no `.mdx` files under `src/app/work/`), so no build failure, but it's a silent dead branch that will confuse anyone editing the MDX pipeline.
- Fix approach: Remove the `src/app/work` conditional block from `next.config.mjs`.

**`tsconfig.json` includes a `.bak` file path:**
- Issue: `tsconfig.json` `include` array contains `"src/app/work/page.tsx.bak"`. This file does not exist on disk, but the TypeScript compiler will attempt to resolve it.
- Files: `tsconfig.json:37`
- Impact: Potential type-checking noise; the `.bak` file was the removed `work` page. Leaving it in `include` is misleading and may silently break type checks if the file is accidentally recreated with wrong types.
- Fix approach: Remove `"src/app/work/page.tsx.bak"` from `tsconfig.json` `include`.

**Heavily Commented-Out Template Code:**
- Issue: Large blocks of JSX/TSX are commented out across multiple files — this is unused boilerplate from the TailwindUI Studio template that was never fully adapted or removed. Affected areas: logo link in `RootLayout.tsx` (lines 66-82), "Offices" section in navigation (lines 237-245), `NewsletterForm` in `Footer.tsx` (lines 117-119), `ContactSection` in nearly every page, `Clients`/`CaseStudies`/`Testimonial`/`Services` components on the home page, `Team`/`Culture` components on the About page, budget radio inputs on Contact page, `PageLinks` on About page.
- Files: `src/components/RootLayout.tsx:66-82,237-245`, `src/components/Footer.tsx:117-125`, `src/app/page.tsx:221-236`, `src/app/about/page.tsx:45-56,204-224`, `src/app/contact/page.tsx:76-86`
- Impact: Significantly increases the size and cognitive load of each file; obscures which sections are intentional vs. deferred. Template intent and actual site intent are mixed.
- Fix approach: Decide which features to keep or remove permanently. Delete commented-out blocks that will not be used; extract deferred features into issues/backlog.

**`about/page.tsx` Imports 12 Team Images (All Unused):**
- Issue: 12 fictional team member images (`leslie-alexander.jpg`, `michael-foster.jpg`, `dries-vincent.jpg`, etc.) are imported and referenced inside a `team` constant that renders inside the `<Team />` component — which is commented out (line 215).
- Files: `src/app/about/page.tsx:13-24`, `src/app/about/page.tsx:59-130`, `src/app/about/page.tsx:215`
- Impact: Dead imports inflate the dependency graph without providing any content to real users. 12 image assets are bundled into the Next.js static export unnecessarily.
- Fix approach: Either remove the `team` data, the component, and the imports entirely, or uncomment the `<Team />` section and replace the template photos with real content.

---

## Known Bugs

**Changelog: N+1 GitHub API Calls at Build Time:**
- Symptoms: The changelog page fetches the commit list (up to 30 commits by default), then fires a separate `GET /repos/{owner}/{repo}/commits/{ref}` request for *each* commit using `Promise.all`. This results in 31 API requests on every build.
- Files: `src/app/changelog/page.tsx:19-43`
- Trigger: Every static site build and any ISR revalidation. GitHub's REST API rate-limit for authenticated requests is 5000/hr; 31 calls per build leaves a large margin, but will fail silently if `GH_TOKEN` is absent or expired, rendering the changelog page with broken data.
- Workaround: Provide `GH_TOKEN` secret; current code passes `undefined` auth gracefully (unauthenticated limit: 60/hr, risky for CI).

**Changelog: No Error Handling for Missing `GH_TOKEN`:**
- Symptoms: If `process.env.GH_TOKEN` is `undefined`, `new Octokit({ auth: undefined })` falls back to unauthenticated mode (60 req/hr). No try/catch wraps the Octokit calls; a network failure or rate-limit error will crash the build/render with an unhandled rejection.
- Files: `src/app/changelog/page.tsx:19-43`
- Trigger: Build without `GH_TOKEN` secret set, or rate-limit reached.
- Workaround: None currently. Add try/catch and a graceful fallback UI.

**Contact Form: Submission Has No Handler:**
- Symptoms: The contact form at `/contact` renders fields (Name, Email, Company, Phone, Message) and a submit button, but the `<form>` has no `action`, `method`, or `onSubmit` handler. Clicking "Let's work together" does nothing.
- Files: `src/app/contact/page.tsx:57-93`
- Trigger: Visiting `/contact` and submitting the form.
- Workaround: None. Users cannot actually contact the site owner via the form.

---

## Security Considerations

**GitHub Token Scope Unknown:**
- Risk: `GH_TOKEN` is used to authenticate Octokit requests for public repository data. If the token has scopes beyond `public_repo` read, it exposes more of the GitHub account than needed.
- Files: `src/app/changelog/page.tsx:19-21`, `.github/workflows/nextjs.yml:33`
- Current mitigation: Token is injected via GitHub Actions secret and `process.env`; never hardcoded.
- Recommendations: Ensure the token is a fine-grained PAT with read-only access to `contents` on the single repo. Document the required minimum scope in the README.

**`inert` Attribute via `@ts-ignore`:**
- Risk: Two `@ts-ignore` comments suppress type errors for the `inert` HTML attribute on `<div>` and `<motion.div>` elements in the nav menu. This was a known React typing gap (https://github.com/facebook/react/issues/17157). Since React 19 and TypeScript 5.x now support `inert`, these suppresions may be stale.
- Files: `src/components/RootLayout.tsx:191`, `src/components/RootLayout.tsx:214`
- Current mitigation: Functionally correct; `inert` works in modern browsers and properly prevents keyboard focus on hidden nav items.
- Recommendations: Verify if `@ts-ignore` is still needed with the current `@types/react@^19.2.17` and TypeScript `^6.0.3`; remove suppression if the type is now properly recognized.

---

## Performance Bottlenecks

**Changelog Page: 30+ Sequential-Then-Parallel API Calls Block Build:**
- Problem: `Promise.all(commits.map(...))` fires up to 30 detail requests in parallel, each network-bound. During static generation this blocks the build step. The default GitHub API page size returns 30 commits, meaning every build waits for 30 individual HTTP requests.
- Files: `src/app/changelog/page.tsx:31-43`
- Cause: Per-commit detail fetch needed only for `commit.files[0].patch`, which is not included in the list endpoint response.
- Improvement path: Use `per_page` to limit the commit list (e.g., 10 most recent). Consider storing a pre-fetched changelog JSON in the repo and updating it via a separate workflow rather than fetching live at build time.

**No Image Optimization (Static Export Limitation):**
- Problem: `next.config.mjs` sets `images: { unoptimized: true }` — all `<Image>` components bypass Next.js image optimization. Blog posts reference many large PNG screenshots (65 images in `linux-from-scratch` alone) served at full resolution.
- Files: `next.config.mjs:21-23`, `src/app/blog/linux-from-scratch/images/` (65 PNGs)
- Cause: Static export (`output: 'export'`) deployed to GitHub Pages cannot use the Next.js image optimization server.
- Improvement path: Pre-optimize images at check-in time using `sharp` (already a dev dependency). Add a script or pre-commit hook to compress new blog images.

---

## Fragile Areas

**MDX Blog Content Is Monolithic:**
- Files: `src/app/blog/linux-from-scratch/page.mdx` (largest file — 4700+ lines)
- Why fragile: The entire Linux From Scratch guide is a single MDX file. The file contains an `In progress...` marker at line 4759, indicating it is unfinished. Any syntax error in the file breaks the entire blog build.
- Safe modification: Test changes locally with `pnpm dev` before committing. The `sections` export (line 36) must stay in sync with actual heading structure or the TableOfContents navigation breaks.
- Test coverage: None — no automated check that sections IDs match headings.

**`wrapper.tsx` `sections` Type Mismatch Risk:**
- Files: `src/app/blog/wrapper.tsx:22`, `src/lib/mdx.ts:30-40`
- Why fragile: `sections` is typed as `MDXEntry<Section[]>` in `wrapper.tsx` but MDX files export `sections` as a plain `Section[]` array (not wrapped in `MDXEntry`). The `remarkMDXLayout` plugin injects the `sections` export as a prop. If the shape changes, TypeScript will not catch the mismatch at compile time because MDX module types are loose.
- Safe modification: Do not change the `sections` export shape without updating `wrapper.tsx` and `NavBar` accordingly. Check `src/components/NavBar.tsx` and `src/components/TableOfContent.tsx` for downstream consumers.

**Changelog Renders Only `commit.files[0].patch`:**
- Files: `src/app/changelog/page.tsx:95`
- Why fragile: Only the first file's patch is displayed per commit. Multi-file commits silently show only the first diff. Commits without file changes (e.g., merge commits) will render nothing.
- Safe modification: Add a guard for `commit.files?.length === 0` before rendering the diff section.

---

## Scaling Limits

**GitHub Pages Static Export:**
- Current capacity: Suitable for a personal blog with low traffic.
- Limit: No server-side rendering, ISR, or API routes. The changelog page is statically generated at build time, meaning the data goes stale until the next push or manual workflow dispatch.
- Scaling path: Migrate to Vercel or a Node-capable host to enable ISR (`revalidate`) on the changelog page, keeping commit data fresh without full rebuilds.

---

## Dependencies at Risk

**`recma-import-images` at `0.0.3` (Pre-Release):**
- Risk: Version `0.0.3` is a pre-1.0 release with no stability guarantee. Any breaking change in a patch release could break the MDX image import pipeline.
- Impact: Blog posts that use image imports in MDX (all three current posts rely on this) will fail to build.
- Migration plan: Monitor the package for a stable release. If abandoned, inline the recma plugin logic or switch to standard Markdown image syntax.

**`remark-rehype-wrap` at `0.0.5` and `unified-conditional` at `0.0.2` (Pre-Release):**
- Risk: Both are pre-1.0 packages. `unified-conditional` is used to conditionally apply remark plugins based on file path — a non-trivial part of the MDX pipeline.
- Impact: MDX build pipeline may silently produce incorrect output on any dependency update.
- Migration plan: Pin exact versions (already done via `pnpm-lock.yaml`). Evaluate if equivalent functionality can be achieved with stable alternatives or inlined logic.

---

## Missing Critical Features

**Contact Form Submission Backend:**
- Problem: `/contact` has a fully styled form UI but no submission logic. There is no API route, no form action URL, and no client-side handler.
- Blocks: Users cannot actually send a message to the site owner via the contact page.

**No Changelog Pagination:**
- Problem: The changelog fetches the first 30 commits (GitHub API default) with no "load more" or page navigation. As the repo grows, older changes are inaccessible.
- Blocks: Full commit history visibility on the changelog page.

---

## Test Coverage Gaps

**Zero Automated Tests:**
- What's not tested: No unit, integration, or E2E tests exist. No test runner is configured (`jest.config.*`, `vitest.config.*`, `playwright.config.*` are all absent). No `test` script in `package.json`.
- Files: Entire `src/` directory
- Risk: Any refactor or dependency upgrade that changes component behavior, MDX rendering, or the Octokit integration will go undetected until it breaks in production.
- Priority: High for the changelog data pipeline and MDX rendering correctness; Medium for UI components.

**No Build-Time Assertion for `GH_TOKEN`:**
- What's not tested: There is no check that `GH_TOKEN` is set before the build attempts the Octokit calls. The CI workflow sets the secret, but local builds will silently use unauthenticated mode.
- Files: `src/app/changelog/page.tsx:19`, `.github/workflows/nextjs.yml:33`
- Risk: Local builds may succeed with degraded data or hit the 60 req/hr rate limit and fail cryptically.
- Priority: Medium.

---

*Concerns audit: 2026-06-08*
