# CLAUDE.md

## Overview

React Joyride is a React library for creating guided tours (tooltips, walkthroughs, onboarding). Supports React 16.8-19 and SSR.

For deep architecture details, see `docs/architecture.md`.

## Commands

Package manager: **pnpm**

```bash
pnpm lint              # ESLint with --fix on src/, test/, and e2e/
pnpm typecheck         # tsc using test/tsconfig.json
pnpm test              # Vitest (run once)
pnpm test:coverage     # With coverage
pnpm test:watch        # Watch mode
pnpm e2e               # Playwright (chromium, firefox, webkit)
pnpm e2e:chromium      # Chromium only
pnpm website           # Website at localhost:3000
pnpm website:build     # Build website for production
pnpm website:start     # Serve built website locally
pnpm website:serve     # Build + start website
pnpm build             # tsdown
pnpm check             # lint → typecheck → test:coverage
pnpm validate          # check → build → size → typevalidation
```

Single test: `pnpm test modules/store` | Single e2e: `pnpm e2e:chromium standard`

## How It Works

Singleton `Store` class (ref-based) manages frozen state snapshots. React subscribes via `useSyncExternalStore`.

Two public APIs: `<Joyride>` component and `useJoyride()` hook (returns `{ controls, failures, on, state, step, Tour }`).

**State machine** has two dimensions: tour `Status` (`idle → ready → waiting → running ↔ paused → finished/skipped`) and step `Lifecycle` (`init → ready → beacon_before → beacon → tooltip_before → tooltip → complete`). See architecture.md for full details.

**Event system**: Single `onEvent(data, controls)` callback receives discriminated events and tour controls: `tour:start`, `step:before_hook`, `step:before`, `scroll:start`, `scroll:end`, `beacon`, `tooltip`, `step:after`, `step:after_hook`, `tour:end`, `tour:status`, `error:target_not_found`, `error`.

**Controlled** (with `stepIndex` prop): Tour pauses at COMPLETE; parent manages index via `onEvent`. **Uncontrolled**: Store manages index internally; supports `initialStepIndex`.

## Key Files

| File | Role |
|------|------|
| `src/index.tsx` | SSR-safe wrapper, exports types and literals |
| `src/hooks/useJoyride.tsx` | Public hook: orchestrates tour, returns controls/state/Tour |
| `src/hooks/useTourEngine.ts` | Store init, subscriptions, delegates to sub-hooks |
| `src/hooks/useControls.ts` | Tour control methods (next, prev, start, stop, etc.) |
| `src/hooks/useEventEmitter.ts` | Centralized event emission with controls |
| `src/hooks/usePropSync.ts` | Syncs run/steps props to store |
| `src/hooks/useLifecycleEffect.ts` | 5 effects: action tracking, target resolution, presentation, transitions, tour flow |
| `src/hooks/useScrollEffect.ts` | Scroll-to-target with placement adjustments |
| `src/hooks/usePortalElement.ts` | Portal DOM element management |
| `src/hooks/useTargetPosition.ts` | Target rect tracking via ResizeObserver |
| `src/hooks/useFocusTrap.ts` | Focus trap for tooltip accessibility |
| `src/modules/store.ts` | State machine + frozen snapshots |
| `src/modules/dom.ts` | Element lookup, scroll, visibility |
| `src/modules/step.ts` | Step merging + validation |
| `src/modules/helpers.tsx` | Utilities (deepMerge, mergeProps, logDebug) |
| `src/modules/changes.ts` | State transition detection (treeChanges) |
| `src/modules/svg.ts` | SVG path generation for overlay/spotlight |
| `src/defaults.ts` | Default props, locale, options |
| `src/styles.ts` | Style generation from step |
| `src/literals/index.ts` | Constants (ACTIONS, EVENTS, LIFECYCLE, ORIGIN, STATUS) |

## Components

| Component | File | Purpose |
|-----------|------|---------|
| TourRenderer | `src/components/TourRenderer.tsx` | Conditional rendering, keyboard handler (ESC) |
| Step | `src/components/Step.tsx` | Validates step + target, renders Floater |
| Floater | `src/components/Floater.tsx` | Dual Floating UI instances (beacon + tooltip), arrow |
| Beacon | `src/components/Beacon.tsx` | Animated pulsing indicator |
| Tooltip | `src/components/Tooltip/index.tsx` | Button handlers, custom component support |
| DefaultTooltip | `src/components/Tooltip/DefaultTooltip.tsx` | Default tooltip layout |
| CloseButton | `src/components/Tooltip/CloseButton.tsx` | SVG close icon |
| Arrow | `src/components/Arrow.tsx` | Tooltip arrow, customizable via `arrowComponent` |
| Overlay | `src/components/Overlay.tsx` | SVG-based spotlight with path cutout |
| Loader | `src/components/Loader.tsx` | Loading indicator during target wait/before hooks |
| Portal | `src/components/Portal.tsx` | React portal wrapper |

## Types

Split into 8 domain files under `src/types/`: `common`, `components`, `events`, `floating`, `props`, `state`, `step`, `utilities`. Re-exported from `src/types/index.ts`.

## Path Alias

`~/*` maps to `src/*` (tsconfig.json; vite/vitest via vite-tsconfig-paths; playwright uses website webServer).

## Test Structure

- **Unit tests** (Vitest + jsdom): `test/modules/`, `test/components/`, `test/hooks/`, `test/tours/`
- **E2E tests** (Playwright): `e2e/` with screenshot snapshots per browser
- **Fixtures**: `test/__fixtures__/` — Demo components used by both suites

Coverage thresholds: 90% statements, 80% branches, 90% functions, 90% lines.

## Key Dependencies

| Package | Purpose |
|---------|---------|
| `@floating-ui/react-dom` | Tooltip/beacon positioning |
| `@fastify/deepmerge` | Deep object merging (React element aware) |
| `@gilbarbara/hooks` | useMemoDeepCompare, useMount, usePrevious, useUpdateEffect, useWindowSize |
| `@gilbarbara/deep-equal` | Deep equality checking |
| `scroll` / `scrollparent` | Smooth scrolling and scroll parent detection |
| `react-innertext` | Extract text from React elements |
| `is-lite` | Type checking utilities |

## Website

Next.js 16 documentation and demo site in `website/`. Imports library via local path (`"react-joyride": "../"`).

**Stack**: HeroUI v2, Tailwind CSS v4, MDX (rehype-pretty-code + Shiki), next-themes, DocSearch.

**Note**: Uses `--webpack` flag for dev/build due to Turbopack symlink issues with local package imports.

**Documentation** (`website/src/app/docs/`): MDX pages covering getting-started, new-in-v3, how-it-works, hook, props (options, styles, floating-options), step, events, custom-components, exports, accessibility, migration.

**Demos** (`website/src/app/demos/`): 8 interactive examples — overview, controlled, custom-components, scroll, modal, carousel, chat, multi-route.

**Key patterns**:
- `ConfigContext` — centralized tour configuration for demos
- `website/src/components/` — 33 components (ConfigPanel, custom tour components, code blocks, navigation)
- `website/src/config/` — sidebar nav, default values, hero content

## Visual Customization
- Visual/cosmetic options (colors, borders, sizes) belong in `styles.*`, not as new Options fields.
- Before adding a new option for appearance, check if it fits an existing or new `styles` key.
