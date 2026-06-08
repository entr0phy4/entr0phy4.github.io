# Technology Stack

**Analysis Date:** 2026-06-08

## Languages

**Primary:**
- TypeScript 6.x - All source code in `src/` (`.ts`, `.tsx`)
- MDX 3.x - Blog posts in `src/app/blog/**/page.mdx`

**Secondary:**
- JavaScript (ESM) - Config files: `next.config.mjs`, `src/mdx/recma.mjs`, `src/mdx/remark.mjs`
- CSS - Styles in `src/styles/` (Tailwind CSS utility-first)

## Runtime

**Environment:**
- Node.js v20 (CI/CD enforced via `.github/workflows/nextjs.yml`)
- Local dev: Node.js v24.16.0

**Package Manager:**
- pnpm 11.5.2 (enforced via `packageManager` field in `package.json`)
- Lockfile: `pnpm-lock.yaml` (present, frozen in CI)

## Frameworks

**Core:**
- Next.js 16.x - App Router, static export (`output: 'export'`), distDir `dist/`
- React 19.x - UI rendering

**Build/Dev:**
- Webpack (explicitly enabled via `--webpack` flag in `dev` and `build` scripts)
- TypeScript compiler via `next build` (strict mode, `target: es6`)
- PostCSS via `@tailwindcss/postcss` (`postcss.config.js`)
- Tailwind CSS 4.x - Utility-first CSS, configured via `src/styles/tailwind.css`
- Shiki 4.x - Syntax highlighting for code blocks in MDX

**UI Component Libraries:**
- @headlessui/react 2.x - Accessible UI primitives
- framer-motion 12.x - Animations and transitions

**MDX Pipeline:**
- @next/mdx 16.x + @mdx-js/loader 3.x - MDX to React compilation
- remark-gfm 4.x - GitHub Flavored Markdown
- @shikijs/rehype 4.x - Code block syntax highlighting (CSS variables theme)
- rehype-unwrap-images - Unwraps `<p>` around images in MDX
- remark-rehype-wrap - Wraps MDX content in `<Typography>` component
- recma-import-images - Handles image imports in MDX
- mdx-annotations 0.x - MDX annotation support
- unified-conditional - Conditional remark/rehype plugin application by path

## Key Dependencies

**Critical:**
- `next` ^16.1.6 - Framework, routing, SSG
- `react` + `react-dom` ^19.2.7 - UI library
- `octokit` ^5.0.5 - GitHub API client (used in `src/app/changelog/page.tsx`)
- `fast-glob` ^3.3.3 - File system glob for discovering MDX blog posts (`src/lib/mdx.ts`)
- `clsx` ^2.1.1 - Conditional className utility

**Infrastructure:**
- `sharp` 0.34.5 (devDependency) - Image optimization during build
- `acorn` + `acorn-jsx` - JavaScript/JSX parsing for MDX layout injection in `next.config.mjs`
- `escape-string-regexp` ^5.0.0 - Regex escaping for path matching in MDX pipeline

## Configuration

**Environment:**
- `GH_TOKEN` - GitHub API token (required for changelog page to fetch commits via Octokit)
- Set as GitHub Actions secret (`${{ secrets.GH_TOKEN }}`) for CI builds
- No `.env` file is committed; `.env*.local` is gitignored

**Build:**
- `next.config.mjs` - Next.js config with MDX pipeline, static export, Shiki highlighter
- `tsconfig.json` - TypeScript config; path alias `@/*` → `./src/*`; strict mode; `moduleResolution: bundler`
- `postcss.config.js` - PostCSS with Tailwind CSS plugin only
- `prettier.config.js` - singleQuote, no semicolons, `prettier-plugin-tailwindcss`
- `.eslintrc.json` - `next/core-web-vitals` ruleset

**Custom Theme:**
- Font: Mona Sans (variable font, `src/fonts/Mona-Sans.var.woff2`)
- Custom CSS properties defined in `src/styles/tailwind.css` (`@theme` block)
- Shiki syntax highlighting uses CSS variable theme (`--shiki-*` variables)

## Platform Requirements

**Development:**
- Node.js v20+ and pnpm 11.5.2
- `GH_TOKEN` env var for running the changelog page locally
- Run: `pnpm dev` (starts Next.js dev server with Webpack)

**Production:**
- Static export — no Node.js server required at runtime
- Output: `dist/` directory (static HTML/CSS/JS)
- Deployment target: GitHub Pages (via `actions/deploy-pages@v4`)
- Build command: `pnpm exec next build`

---

*Stack analysis: 2026-06-08*
