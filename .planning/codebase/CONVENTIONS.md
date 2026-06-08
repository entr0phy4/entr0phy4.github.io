# Coding Conventions

**Analysis Date:** 2026-06-08

## Naming Patterns

**Files:**
- React components: PascalCase — `Button.tsx`, `FadeIn.tsx`, `RootLayout.tsx`
- Utility/helper files: camelCase — `formatDate.ts`, `renderTags.tsx`, `mdx.ts`
- Config files: lowercase with dots — `prettier.config.js`, `postcss.config.js`, `next.config.mjs`
- MDX plugin files: lowercase `.mjs` — `recma.mjs`, `remark.mjs`

**Functions/Components:**
- Exported components: PascalCase named functions — `export function Button(...)`, `export function FadeIn(...)`
- Private/internal sub-components within a file: PascalCase, not exported — `function Header(...)`, `function Navigation()`, `function NavigationRow(...)`
- Utility functions: camelCase — `formatDate`, `loadArticles`, `loadCaseStudies`

**Variables:**
- `let` is strongly preferred over `const` for local variables in component bodies — e.g., `let shouldReduceMotion = ...`, `let inner = ...`, `let articles = ...`
- `const` used for module-level constants and configuration objects — `const viewport = {...}`, `const clients = [...]`
- Props destructuring uses inline patterns, not intermediate variables

**Types:**
- Type aliases use PascalCase with `type` keyword — `type ButtonProps = ...`, `type Colors = ...`
- Interfaces use PascalCase with `interface` — `interface Article {...}`, `interface Section {...}`
- Generic type parameters: single uppercase letter — `T extends React.ElementType`
- Utility types leveraged extensively: `Omit<>`, `React.ComponentPropsWithoutRef<>`, `React.ForwardedRef<>`

## Code Style

**Formatting:**
- Tool: Prettier 3.x (`prettier.config.js`)
- Single quotes: `true`
- Semicolons: `false` (no semicolons)
- Tailwind class ordering: enforced by `prettier-plugin-tailwindcss`
- Target stylesheet: `./src/styles/tailwind.css`

**Linting:**
- Tool: ESLint 10.x (`.eslintrc.json`)
- Config: `next/core-web-vitals` (Next.js recommended)
- No custom rule overrides — relies on the preset

**TypeScript:**
- Strict mode enabled (`tsconfig.json` — `"strict": true`)
- Target: `es6`, module: `esnext`
- `isolatedModules: true` for per-file compilation
- Path alias `@/*` maps to `./src/*`

## Import Organization

**Order (as observed consistently across files):**
1. External library imports — `import { type Metadata } from 'next'`, `import clsx from 'clsx'`
2. Next.js built-ins — `import Link from 'next/link'`, `import Image from 'next/image'`
3. Local `@/components/*` imports
4. Local `@/lib/*` imports
5. Local `@/images/*` and `@/styles/*` imports (last)

**Path Aliases:**
- `@/` resolves to `src/` — use for all internal imports. Never use relative paths like `../../components`.

**Import Syntax:**
- Named imports preferred: `import { FadeIn, FadeInStagger } from '@/components/FadeIn'`
- Type-only imports use `type` keyword: `import { type Metadata } from 'next'`, `import { type ImageProps } from 'next/image'`
- No barrel index files — import directly from the source component file

## Component Architecture

**Props Pattern:**
- Use `React.ComponentPropsWithoutRef<T>` to extend native element or component props:
  ```tsx
  export function SectionIntro({
    title,
    eyebrow,
    ...props
  }: Omit<React.ComponentPropsWithoutRef<typeof Container>, 'title' | 'children'> & {
    title: string
    eyebrow?: string
  }) { ... }
  ```
- Polymorphic components use generics:
  ```tsx
  export function Container<T extends React.ElementType = 'div'>({
    as,
    ...props
  }: ContainerProps<T>) { ... }
  ```
- Forwarded refs use `forwardRef` from React and typed `React.ForwardedRef<HTMLElement>` (see `Badge.tsx`)

**Conditional Rendering:**
- `clsx` for conditional className strings — always use `clsx`, never template literals for class concatenation
- Ternary expressions for simple conditional JSX; rendered inline in JSX
- Boolean flags like `invert?: boolean` and `smaller?: boolean` with default values as function defaults

**Client vs Server Components:**
- `'use client'` directive used for components with hooks, browser APIs, or framer-motion interactions (`FadeIn.tsx`, `RootLayout.tsx`, `NavBar.tsx`, `GrayscaleTransitionImage.tsx`)
- Server Components (no directive) handle data fetching — page files using `async function` pattern (`src/app/blog/page.tsx`, `src/app/blog/wrapper.tsx`)
- Context providers always `'use client'` — `FadeInStaggerContext`, `RootLayoutContext`

**Context Pattern:**
```tsx
const MyContext = createContext<{ value: Type } | null>(null)
// Consumer asserts non-null with !
let { value } = useContext(MyContext)!
```

## Styling

**Framework:** Tailwind CSS v4 via `@tailwindcss/postcss`

**Patterns:**
- All styling via Tailwind utility classes in JSX `className` attributes
- Responsive prefixes: `sm:`, `lg:` (mobile-first)
- Dark mode: `dark:` variants used in `Badge.tsx` color definitions
- Conditional classes always via `clsx()` — `clsx('base-class', condition && 'conditional-class', condition ? 'a' : 'b')`
- Brand accent color `#00FF00` / `[#00ff00]` used for interactive highlights, section headings, and active states
- Arbitrary values in brackets: `hover:bg-[#00FF00]/10`, `text-[#00ff00]`

## Error Handling

**Strategy:** Minimal explicit error handling — this is a static content site with no API routes.

**Patterns:**
- Type narrowing used instead of runtime checks: `typeof props.href === 'undefined'`
- Optional chaining for DOM operations: `event.target.closest('a')?.href`
- `// @ts-ignore` used only with a link to the upstream issue as justification (see `RootLayout.tsx`)
- No try/catch blocks in application code — async data loading via `Promise.all` in `src/lib/mdx.ts` without explicit catch

## Logging

**Approach:** No logging library. Console logging not used in application code.

## Comments

**When to Comment:**
- `// @ts-ignore` only with a GitHub issue link explaining the TypeScript limitation
- Commented-out JSX blocks (`{/* ... */}`) used throughout to preserve code for future use or easy re-enabling — this is an accepted pattern in this codebase
- No documentation comments (JSDoc/TSDoc) on exported functions

**Observed Pattern:**
```tsx
// @ts-ignore (https://github.com/facebook/react/issues/17157)
inert={expanded ? true : undefined}
```

## Function Design

**Size:** Functions are generally small and focused. Larger components (e.g., `RootLayoutInner`) are broken into private sub-components within the same file.

**Parameters:** Destructured directly in function signature. Optional props have inline defaults (`invert = false`, `shape = 0`).

**Return Values:** Components return JSX directly. Utility functions return typed values without intermediate variables where possible.

## Module Design

**Exports:**
- All components use named exports — `export function Button(...)`, `export function TouchTarget(...)`
- No default exports for components (exception: `forwardRef` pattern wraps named assignment)
- Page files (`page.tsx`, `layout.tsx`) use default exports as required by Next.js App Router
- MDX wrapper files use default async function exports as required by Next.js

**Barrel Files:** Not used. Import directly from each component file.

---

*Convention analysis: 2026-06-08*
