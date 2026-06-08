# External Integrations

**Analysis Date:** 2026-06-08

## APIs & External Services

**Version Control / Source Data:**
- GitHub REST API (v2022-11-28) — Fetches commit history for the `/changelog` page
  - SDK/Client: `octokit` ^5.0.5 (`Octokit` class from `octokit` package)
  - Auth: `GH_TOKEN` environment variable (personal access token)
  - Used in: `src/app/changelog/page.tsx`
  - Endpoints called:
    - `GET /repos/{owner}/{repo}/commits` — list commits for `entr0phy4/entr0phy4.github.io`
    - `GET /repos/{owner}/{repo}/commits/{ref}` — fetch per-commit details (files, patches)
  - Called at build time (static export — Next.js SSG)

## Data Storage

**Databases:**
- None — no database is used.

**File Storage:**
- Local filesystem only — blog posts are MDX files under `src/app/blog/`; images are co-located in blog subdirectories (e.g., `src/app/blog/CrossFit/`, `src/app/blog/linux-from-scratch/images/`)

**Caching:**
- GitHub Actions build cache (`actions/cache@v4`) for `.next/cache` / webpack artifacts
- No runtime caching layer

## Authentication & Identity

**Auth Provider:**
- None — this is a fully static public site with no user authentication

**API Authentication:**
- GitHub API token (`GH_TOKEN`) used server-side (build time only) via Octokit

## Monitoring & Observability

**Error Tracking:**
- None detected

**Logs:**
- No structured logging; standard Next.js build/dev console output only

## CI/CD & Deployment

**Hosting:**
- GitHub Pages (`entr0phy4.github.io`)
- Static files served from `dist/` after Next.js static export

**CI Pipeline:**
- GitHub Actions (`.github/workflows/nextjs.yml`)
  - Trigger: push to `main` branch, or manual `workflow_dispatch`
  - Build runner: `ubuntu-latest`
  - Steps: checkout → install pnpm 11.5.2 → setup Node.js 20 → restore cache → `pnpm install --frozen-lockfile` → `pnpm exec next build` → upload artifact → deploy to GitHub Pages
  - Deployment: `actions/deploy-pages@v4`
  - Concurrency group: `pages` (no cancel-in-progress)

## Environment Configuration

**Required env vars:**
- `GH_TOKEN` — GitHub personal access token; required at build time for the changelog page to call the GitHub API. Without it, the `/changelog` route will fail at build/SSG time.

**Secrets location:**
- GitHub repository secret: `GH_TOKEN` (referenced as `${{ secrets.GH_TOKEN }}` in the workflow)
- Local development: must be set manually in shell environment (e.g., `export GH_TOKEN=...`)
- `.env*.local` files are gitignored; no `.env` file is committed

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None (all API calls are outbound requests from server-side render/build, not webhook-triggered)

## Fonts

**Self-hosted:**
- Mona Sans variable font (`src/fonts/Mona-Sans.var.woff2`) — served as a static asset, no external font CDN (Google Fonts etc.) used

---

*Integration audit: 2026-06-08*
