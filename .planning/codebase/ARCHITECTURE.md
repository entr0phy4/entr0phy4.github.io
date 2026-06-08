<!-- refreshed: 2026-06-08 -->
# Architecture

**Analysis Date:** 2026-06-08

## System Overview

```text
┌─────────────────────────────────────────────────────────────────────┐
│                     Next.js App Router (SSG)                        │
│                        `src/app/`                                   │
├──────────────────┬──────────────────┬────────────┬──────────────────┤
│  Page: Home      │  Page: Blog      │  Page:     │  Page:           │
│  `app/page.tsx`  │  `app/blog/`     │  About     │  Changelog       │
│                  │  (MDX articles)  │  `app/     │  `app/changelog/ │
│                  │                  │  about/`   │  page.tsx`       │
└────────┬─────────┴────────┬─────────┴─────┬──────┴──────────┬───────┘
         │                  │               │                  │
         ▼                  ▼               ▼                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       Component Library                             │
│                      `src/components/`                              │
│  RootLayout · Container · FadeIn · NavBar · Footer · MDXComponents  │
└───────────────────────────┬─────────────────────────────────────────┘
                            │
         ┌──────────────────┼──────────────────┐
         ▼                  ▼                  ▼
┌─────────────┐   ┌──────────────────┐  ┌────────────────────────┐
│  src/lib/   │   │  MDX Pipeline    │  │  GitHub Octokit API    │
│  mdx.ts     │   │  src/mdx/        │  │  (Changelog page only) │
│  formatDate │   │  next.config.mjs │  │  at build time         │
│  renderTags │   │                  │  └────────────────────────┘
└─────────────┘   └──────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Static Output                                                      │
│  `dist/`  (output: 'export')                                        │
└─────────────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| RootLayout | Shell: animated header, hamburger nav, footer wrapper | `src/components/RootLayout.tsx` |
| Container | Max-width centering wrapper, polymorphic `as` prop | `src/components/Container.tsx` |
| FadeIn / FadeInStagger | Framer Motion scroll-triggered fade animations | `src/components/FadeIn.tsx` |
| NavBar | Sticky table-of-contents for blog articles, scroll-tracking | `src/components/NavBar.tsx` |
| Footer | Site-wide footer with nav links and social links | `src/components/Footer.tsx` |
| MDXComponents | MDX element overrides: img, table, Blockquote, TagList, Typography, wrapper | `src/components/MDXComponents.tsx` |
| BlogArticleWrapper | Article-level layout: header, NavBar injection, "more articles" tail | `src/app/blog/wrapper.tsx` |
| Badge | Colored tag pill | `src/components/Badge.tsx` |
| RenderTags | Maps string[] → Badge components with random colors | `src/lib/renderTags.tsx` |
| GridPattern | Decorative SVG background grid | `src/components/GridPattern.tsx` |

## Pattern Overview

**Overall:** Next.js App Router Static Site Generation (SSG) + MDX content pipeline

**Key Characteristics:**
- All pages are statically exported to `dist/` via `output: 'export'`
- Blog posts are authored as `page.mdx` files co-located with their images
- A `remarkMDXLayout` plugin (in `next.config.mjs`) automatically injects `BlogArticleWrapper` as the layout for all files under `src/app/blog/`
- Server Components are the default; interactive UI components (RootLayout, FadeIn, NavBar) opt in to `'use client'`
- The `@/` path alias maps to `./src/` throughout the entire codebase

## Layers

**Pages Layer:**
- Purpose: Route definitions — each directory in `src/app/` is a URL segment
- Location: `src/app/`
- Contains: `page.tsx` (React Server Components), `page.mdx` (MDX blog articles), `layout.tsx` (root layout), `not-found.tsx`
- Depends on: Component Library, `src/lib/`
- Used by: Next.js router

**Component Library:**
- Purpose: Reusable, stateless (or locally stateful) UI components
- Location: `src/components/`
- Contains: Layout primitives (Container, Border), animation wrappers (FadeIn), navigation (NavBar, Footer, RootLayout), content display (Blockquote, PageIntro, SectionIntro, StatList, TagList)
- Depends on: Tailwind CSS, Framer Motion, clsx, headlessui
- Used by: Pages layer, `src/app/blog/wrapper.tsx`

**Lib / Utilities:**
- Purpose: Data-fetching helpers and formatting utilities used across pages
- Location: `src/lib/`
- Contains: `mdx.ts` (MDX file discovery and metadata loading), `formatDate.ts` (date string formatter), `renderTags.tsx` (tag-to-Badge mapper)
- Depends on: `fast-glob`, Next.js Image types
- Used by: Pages layer, `src/app/blog/wrapper.tsx`

**MDX Pipeline:**
- Purpose: Compile `.mdx` files with custom remark/rehype/recma plugins
- Location: `src/mdx/remark.mjs`, `src/mdx/recma.mjs`, `next.config.mjs`
- Contains: remark plugin list (mdxAnnotations, remarkGfm), recma plugin list (mdxAnnotations), shiki syntax highlighting, automatic layout injection per directory
- Depends on: `@next/mdx`, `shiki`, `remark-gfm`, `mdx-annotations`, `recma-import-images`, `rehype-unwrap-images`
- Used by: Next.js webpack build for any `*.mdx` file

**Styles:**
- Purpose: Global CSS and Tailwind configuration
- Location: `src/styles/`
- Contains: `tailwind.css` (Tailwind directives and CSS variables), `base.css` (resets), `typography.css` (`.typography` prose class used inside MDX wrapper)

## Data Flow

### Blog List Page

1. `loadArticles()` called in `src/app/blog/page.tsx` (Server Component, build time)
2. `loadEntries()` in `src/lib/mdx.ts` globs `**/page.mdx` under `src/app/blog/`
3. Each `.mdx` file is dynamically imported; `article` named export extracted as metadata
4. Array sorted descending by `date` field, returned as `Array<MDXEntry<Article>>`
5. Blog listing page renders article cards with `FadeIn`, `Border`, `Badge`, `Button` components

### Individual Blog Article

1. Next.js resolves `/blog/[slug]` → `src/app/blog/[slug]/page.mdx`
2. MDX compilation runs: `remarkMDXLayout` injects `import _Layout from '@/app/blog/wrapper'` and `export default function Layout(props) { return <_Layout {...props} article={article} sections={sections} /> }`
3. `BlogArticleWrapper` (`src/app/blog/wrapper.tsx`) renders: header, `NavBar` with sections, MDX content wrapped in `MDXComponents.wrapper`, "more articles" tail via `PageLinks`
4. `MDXComponents` overrides HTML elements with styled React components (images → `GrayscaleTransitionImage`, tables → scrollable wrapper, etc.)

### Changelog Page

1. `src/app/changelog/page.tsx` uses Octokit at build time (SSG): fetches `GET /repos/entr0phy4/entr0phy4.github.io/commits`
2. For each commit, fetches detailed diff via `GET /repos/{owner}/{repo}/commits/{ref}`
3. Renders commit list with first file's patch displayed as color-coded diff

**State Management:**
- No global state store. Navigation open/close state is local `useState` in `RootLayoutInner` (`src/components/RootLayout.tsx`). Active section state in `NavBar` is local `useState` with scroll listener. `RootLayoutContext` (React Context) shares `logoHovered` between `RootLayout` and `Header`.

## Key Abstractions

**MDXEntry<T>:**
- Purpose: Wraps MDX metadata type with a `href` and `metadata` field for routing and back-reference
- Examples: `MDXEntry<Article>` (blog posts), `MDXEntry<CaseStudy>` (unused work entries)
- Pattern: `src/lib/mdx.ts` — generic type `T & { href: string; metadata: T }`

**Container:**
- Purpose: Polymorphic max-width centering wrapper; accepts `as` prop for semantic elements
- Pattern: `as?: T` + `Omit<React.ComponentPropsWithoutRef<T>, ...>` for type-safe polymorphism — `src/components/Container.tsx`

**FadeIn / FadeInStagger:**
- Purpose: Scroll-triggered Framer Motion entrance animation; `FadeInStagger` uses React Context to orchestrate staggered children without prop drilling
- Pattern: Context-based stagger coordination — `src/components/FadeIn.tsx`

## Entry Points

**Root Layout:**
- Location: `src/app/layout.tsx`
- Triggers: Every page request
- Responsibilities: Sets `<html>` and `<body>`, applies `tailwind.css`, wraps content in `RootLayout`

**Home Page:**
- Location: `src/app/page.tsx`
- Triggers: `/` route
- Responsibilities: Hero section, loads first 3 case studies (currently rendered as blog-style cards), tag display

**Blog Index:**
- Location: `src/app/blog/page.tsx`
- Triggers: `/blog` route
- Responsibilities: Loads all articles via `loadArticles()`, renders article list

**Changelog:**
- Location: `src/app/changelog/page.tsx`
- Triggers: `/changelog` route (build-time SSG)
- Responsibilities: Fetches GitHub commits via Octokit, renders diff-style commit history

## Architectural Constraints

- **Rendering model:** Static export only (`output: 'export'`). No runtime server — every page is pre-rendered at build time. The Changelog page fetches GitHub API at build time; stale after deployment.
- **Global state:** `RootLayoutContext` is the only React Context. No Redux/Zustand/etc.
- **Circular imports:** None detected.
- **Environment secrets:** `GH_TOKEN` env var required at build time for `src/app/changelog/page.tsx`. Not needed for other pages.
- **Image optimization:** Disabled (`images: { unoptimized: true }`) for static export compatibility.
- **MDX layout injection:** Automatic — any `.mdx` file under `src/app/blog/` gets `BlogArticleWrapper` injected as its default export layout via `next.config.mjs:remarkMDXLayout`. Do not add manual layout exports to blog MDX files.

## Anti-Patterns

### Duplicate `metadata` export in Home page

**What happens:** `src/app/page.tsx` has two `export const metadata` declarations (lines 7 and 174).
**Why it's wrong:** The second declaration silently overrides the first; the first metadata block is dead code.
**Do this instead:** Keep only the single intended `metadata` export per page file.

### Extensively commented-out template code

**What happens:** Large blocks of JSX are commented out in `src/app/page.tsx`, `src/app/about/page.tsx`, `src/app/blog/page.tsx`, `src/components/RootLayout.tsx`, and others — they are leftovers from the TailwindUI Studio template.
**Why it's wrong:** Increases cognitive noise; unused image imports still load at build time; future editors may accidentally uncomment mismatched placeholder content.
**Do this instead:** Remove commented-out blocks and corresponding unused imports when a section is confirmed not needed.

### Unused imports from template

**What happens:** `src/app/about/page.tsx` imports all 12 team member images that are only used inside a commented-out `<Team />` component.
**Why it's wrong:** Import resolution overhead at build time; misleads code readers into thinking these assets are active.
**Do this instead:** Remove unused imports together with the dead JSX.

## Error Handling

**Strategy:** Minimal — this is a static personal site with no forms or mutations.

**Patterns:**
- `src/app/not-found.tsx` provides the custom 404 page
- Octokit calls in `src/app/changelog/page.tsx` have no try/catch; a GitHub API failure at build time will crash the build

## Cross-Cutting Concerns

**Logging:** None — no structured logging library in use.
**Validation:** None — no runtime input validation (no user inputs beyond the static newsletter form in Footer, which is not wired up).
**Authentication:** None — public static site.

---

*Architecture analysis: 2026-06-08*
