# Codebase Structure

**Analysis Date:** 2026-06-08

## Directory Layout

```
entr0phy4.github.io/
├── src/                    # All application source code
│   ├── app/                # Next.js App Router pages and layouts
│   │   ├── layout.tsx      # Root HTML layout (RootLayout wrapper)
│   │   ├── page.tsx        # Home page (/)
│   │   ├── not-found.tsx   # Custom 404 page
│   │   ├── about/
│   │   │   └── page.tsx    # About page (/about)
│   │   ├── blog/
│   │   │   ├── page.tsx    # Blog index (/blog)
│   │   │   ├── wrapper.tsx # BlogArticleWrapper — injected as layout for all .mdx files in blog/
│   │   │   ├── CrossFit/
│   │   │   │   ├── page.mdx          # Blog post: "CrossFit" HTB writeup
│   │   │   │   ├── ghydra/           # Images for this post
│   │   │   │   └── *.png             # Screenshots co-located with article
│   │   │   ├── linux-from-scratch/
│   │   │   │   ├── page.mdx          # Blog post: Linux From Scratch walkthrough
│   │   │   │   └── images/           # Images co-located with article
│   │   │   └── treatment-of-the-tty/
│   │   │       └── page.mdx          # Blog post: TTY treatment
│   │   ├── changelog/
│   │   │   └── page.tsx    # Changelog page — fetches GitHub commits via Octokit
│   │   ├── contact/
│   │   │   └── page.tsx    # Contact page (/contact)
│   │   └── process/
│   │       └── page.tsx    # Process page (/process)
│   ├── components/         # Reusable UI component library
│   ├── lib/                # Data utilities and helpers
│   ├── mdx/                # MDX remark/recma plugin definitions
│   │   ├── remark.mjs      # Exports remarkPlugins array
│   │   └── recma.mjs       # Exports recmaPlugins array
│   ├── styles/             # Global CSS
│   │   ├── tailwind.css    # Tailwind directives + CSS custom properties
│   │   ├── base.css        # CSS resets
│   │   └── typography.css  # .typography prose class for MDX content
│   ├── fonts/
│   │   └── Mona-Sans.var.woff2   # Self-hosted variable font
│   └── images/             # Static images (logos, team photos)
│       ├── clients/        # Client logo SVGs (light/dark, logo/logomark variants)
│       └── team/           # Team member photos
├── dist/                   # Static export output (generated, not committed)
├── .planning/              # GSD planning documents
│   └── codebase/           # Codebase analysis documents (this file's directory)
├── .github/
│   └── workflows/          # GitHub Actions CI/CD workflows
├── next.config.mjs         # Next.js + MDX pipeline configuration
├── tsconfig.json           # TypeScript config (@/* path alias → ./src/*)
├── postcss.config.js       # PostCSS config for Tailwind CSS v4
├── prettier.config.js      # Prettier + tailwindcss plugin
├── package.json            # Dependencies and scripts
├── pnpm-lock.yaml          # Lockfile
├── pnpm-workspace.yaml     # pnpm workspace config
├── css.d.ts                # CSS module type declarations
├── mdx-components.tsx      # Next.js MDX components export (re-exports MDXComponents)
├── next-env.d.ts           # Next.js TypeScript ambient declarations
└── CHANGELOG.md            # Manual changelog document
```

## Directory Purposes

**`src/app/`:**
- Purpose: All Next.js route segments. Each subdirectory = a URL segment.
- Contains: `page.tsx` (route pages), `layout.tsx` (shared layout), `page.mdx` (blog articles), `wrapper.tsx` (blog article layout component)
- Key files: `src/app/layout.tsx` (root), `src/app/page.tsx` (home), `src/app/blog/wrapper.tsx` (MDX article shell)

**`src/components/`:**
- Purpose: Shared UI component library. No business logic — purely presentational or locally interactive components.
- Contains: 27 `.tsx` files covering layout, animation, navigation, content blocks, and MDX element overrides
- Key files: `RootLayout.tsx` (site shell), `Container.tsx` (max-width wrapper), `FadeIn.tsx` (animation), `MDXComponents.tsx` (MDX overrides), `NavBar.tsx` (article TOC)

**`src/lib/`:**
- Purpose: Shared utilities used across pages and components
- Contains: `mdx.ts` (MDX file discovery + type definitions), `formatDate.ts` (date display), `renderTags.tsx` (tag Badge renderer)
- Key files: `src/lib/mdx.ts` defines `Article`, `CaseStudy`, `Section`, `MDXEntry<T>` types and `loadArticles()` / `loadCaseStudies()` functions

**`src/mdx/`:**
- Purpose: MDX compilation plugin arrays, imported by `next.config.mjs`
- Contains: `remark.mjs` (remark plugins: mdxAnnotations + remarkGfm), `recma.mjs` (recma plugins: mdxAnnotations)

**`src/styles/`:**
- Purpose: Global CSS entry points
- Contains: Tailwind CSS setup, CSS resets, typography styles for prose content in MDX articles

**`src/images/`:**
- Purpose: Static images imported directly into components as Next.js image objects
- Contains: Client logos (`clients/`), team photos (`teams/`), general images (`laptop.jpg`, `meeting.jpg`, `whiteboard.jpg`)

**`dist/`:**
- Purpose: Next.js static export output (equivalent to `.next/` for static builds)
- Generated: Yes
- Committed: No (should be in `.gitignore`)

## Key File Locations

**Entry Points:**
- `src/app/layout.tsx`: Root HTML layout, applies global CSS, wraps all pages in `RootLayout`
- `src/app/page.tsx`: Home page component
- `src/app/blog/wrapper.tsx`: Article layout injected automatically by MDX remark plugin

**Configuration:**
- `next.config.mjs`: MDX pipeline setup, shiki syntax highlighting, `remarkMDXLayout` injection per directory, `output: 'export'`, `distDir: 'dist'`
- `tsconfig.json`: `@/*` alias → `./src/*`
- `postcss.config.js`: Tailwind CSS v4 PostCSS integration
- `prettier.config.js`: Code formatting with `prettier-plugin-tailwindcss`

**Core Logic:**
- `src/lib/mdx.ts`: `loadArticles()` / `loadCaseStudies()` — glob + dynamic import pattern for MDX metadata at build time
- `src/lib/formatDate.ts`: Date string formatting utility
- `src/lib/renderTags.tsx`: Maps `string[]` → colored `Badge` components

**Testing:**
- Not present — no test files detected in the repository.

## Naming Conventions

**Files:**
- Components: `PascalCase.tsx` (e.g., `FadeIn.tsx`, `NavBar.tsx`, `MDXComponents.tsx`)
- Pages: `page.tsx` or `page.mdx` (Next.js App Router convention)
- Layouts: `layout.tsx`, `wrapper.tsx`
- Lib utilities: `camelCase.ts` or `camelCase.tsx` (e.g., `formatDate.ts`, `renderTags.tsx`)
- MDX plugins: `camelCase.mjs` (e.g., `remark.mjs`, `recma.mjs`)
- Style files: `camelCase.css` (e.g., `tailwind.css`, `typography.css`)

**Directories:**
- Route segments: `kebab-case` (e.g., `linux-from-scratch/`, `treatment-of-the-tty/`)
- Route segments (proper nouns): `PascalCase` preserved from original slug (e.g., `CrossFit/`)
- Component/lib directories: `lowercase` single word (e.g., `components/`, `lib/`, `styles/`)

## Where to Add New Code

**New Blog Post:**
- Create directory: `src/app/blog/[post-slug]/`
- Article file: `src/app/blog/[post-slug]/page.mdx`
- Images: `src/app/blog/[post-slug]/[image-name].png` (co-located)
- Required MDX frontmatter export: `export const article = { date, title, description, tags, author }` and `export const sections = [{ id, title }]`
- The layout (`BlogArticleWrapper`) is injected automatically by `next.config.mjs` — do NOT add a manual layout export to the MDX file

**New Page Route:**
- Implementation: `src/app/[route-name]/page.tsx`
- Shared layout is inherited from `src/app/layout.tsx` automatically

**New UI Component:**
- Implementation: `src/components/[ComponentName].tsx`
- If it needs browser APIs or React hooks, add `'use client'` at the top
- Import via `@/components/[ComponentName]`

**New Utility / Helper:**
- Shared helpers: `src/lib/[utilName].ts` or `src/lib/[utilName].tsx`
- Import via `@/lib/[utilName]`

**New MDX Plugin:**
- Add to `src/mdx/remark.mjs` (remark plugins) or `src/mdx/recma.mjs` (recma plugins)
- Rehype plugins and layout injection are configured directly in `next.config.mjs`

**New Static Image:**
- Client logos: `src/images/clients/[client-name]/logo-[dark|light].svg` and `logomark-[dark|light].svg`
- General images: `src/images/[name].[jpg|png|svg]`
- Import as ES module in the consuming component: `import myImage from '@/images/[name].jpg'`

## Special Directories

**`.planning/`:**
- Purpose: GSD workflow planning documents (roadmaps, phase plans, codebase analysis)
- Generated: Partially (codebase analysis is generated; roadmaps are authored)
- Committed: Yes

**`dist/`:**
- Purpose: Static export output from `next build` (equivalent of `.next/` for `output: 'export'` mode)
- Generated: Yes
- Committed: No

**`.next/`:**
- Purpose: Next.js dev server cache and intermediate build artifacts
- Generated: Yes
- Committed: No

**`.github/workflows/`:**
- Purpose: GitHub Actions CI/CD (likely deploys to GitHub Pages)
- Generated: No
- Committed: Yes

---

*Structure analysis: 2026-06-08*
