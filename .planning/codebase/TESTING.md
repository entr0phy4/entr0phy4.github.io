# Testing Patterns

**Analysis Date:** 2026-06-08

## Test Framework

**Runner:** None — no testing framework is installed or configured.

**Assertion Library:** None

**Run Commands:**
```bash
# No test commands defined. package.json scripts:
pnpm dev      # Development server
pnpm build    # Production build
pnpm start    # Start production server
pnpm lint     # ESLint via next lint
```

## Current Testing State

This is a personal portfolio/blog static site built with Next.js (static export). **No automated tests exist in the codebase.** There are no:
- Test files (`*.test.*`, `*.spec.*`) — verified by filesystem search
- Test framework dependencies (jest, vitest, playwright, cypress, @testing-library)
- Test configuration files (`jest.config.*`, `vitest.config.*`, `playwright.config.*`)
- Test directories (`__tests__/`, `tests/`, `e2e/`)

The project's `package.json` contains no `test` script.

## Linting as Quality Gate

The only automated quality check is ESLint via `next lint`:

```bash
pnpm lint    # Runs ESLint with next/core-web-vitals config
```

**Config:** `.eslintrc.json` — `{ "extends": "next/core-web-vitals" }`

This covers:
- React Hooks rules
- React best practices
- Next.js specific rules (Image optimization, Link usage, etc.)
- Core Web Vitals related checks

## Type Checking as Quality Gate

TypeScript strict mode serves as a compile-time correctness layer:

```bash
# TypeScript check via build
pnpm build    # Type errors will fail the build
```

**Config:** `tsconfig.json` with `"strict": true`, `"noEmit": true` for type-only checking.

## Build Verification

Static export build (`output: 'export'`) in `next.config.mjs` serves as an integration check:

```bash
pnpm build    # Fails on TypeScript errors, broken imports, or MDX processing errors
```

The build produces a static site in `dist/` and exercises all page rendering, MDX transformation, and asset resolution.

## Test File Organization

**Current:** No test files exist.

**Recommended location if tests are added:**
- Unit tests: Co-located with source — `src/components/Button.test.tsx` alongside `src/components/Button.tsx`
- Integration/E2E tests: `tests/` or `e2e/` at project root

## Recommended Testing Additions

If testing is introduced, the following stack would align with project conventions (TypeScript, React, Next.js):

**Unit/Component Testing:**
- Framework: Vitest (compatible with ES modules and `"module": "esnext"`)
- DOM: `@testing-library/react` + `@testing-library/user-event`
- Config file: `vitest.config.ts` at project root

**E2E Testing:**
- Framework: Playwright (works well with Next.js static exports)
- Config file: `playwright.config.ts` at project root

**Example vitest config skeleton:**
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

**Example component test pattern (if added):**
```typescript
// src/components/Button.test.tsx
import { render, screen } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('renders as a button when no href', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('renders as a link when href provided', () => {
    render(<Button href="/about">About</Button>)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/about')
  })
})
```

## Coverage

**Requirements:** None enforced (no test framework).

## Test Types

**Unit Tests:** Not present.

**Integration Tests:** Not present.

**E2E Tests:** Not present.

**Static Analysis (in use):**
- ESLint: `pnpm lint`
- TypeScript: via `pnpm build`

---

*Testing analysis: 2026-06-08*
