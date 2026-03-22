---
name: react-joyride
description: >-
  Guide for implementing, configuring, and debugging React Joyride v3 guided tours.
  Use this skill whenever the user mentions joyride, guided tour, onboarding tour,
  walkthrough, tooltip tour, step-by-step guide, product tour, or wants to highlight
  UI elements sequentially. Also use when debugging tour issues like tooltips not
  appearing, targets not found, or controlled mode problems. This skill covers the
  useJoyride hook, Joyride component, step configuration, events, controls, custom
  components, and styling.
license: MIT
metadata:
  author: gilbarbara
  version: "3.0.0"
---

# React Joyride v3

Create guided tours in React apps. Two public APIs: the `useJoyride()` hook (recommended) and the `<Joyride>` component.

Online docs: https://v3.react-joyride.com

## Quick Start

### Using the hook (recommended)

```tsx
import { useJoyride, STATUS, Status } from 'react-joyride';

function App() {
  const { Tour } = useJoyride({
    continuous: true,
    run: true,
    steps: [
      { target: '.my-element', content: 'This is the first step', title: 'Welcome' },
      { target: '#sidebar', content: 'Navigate here', placement: 'right' },
    ],
    onEvent: (data) => {
      if (([STATUS.FINISHED, STATUS.SKIPPED] as Status).includes(data.status)) {
        // Tour ended
      }
    },
  });

  return <div>{Tour}{/* rest of app */}</div>;
}
```

### Using the component

```tsx
import { Joyride, STATUS, Status } from 'react-joyride';

function App() {
  return (
    <Joyride
      continuous
      run={true}
      steps={[
        { target: '.my-element', content: 'First step' },
        { target: '#sidebar', content: 'Second step' },
      ]}
      onEvent={(data) => {
        if (([STATUS.FINISHED, STATUS.SKIPPED] as Status).includes(data.status)) {
          // Tour ended
        }
      }}
    />
  );
}
```

The hook returns `{ controls, failures, on, state, step, Tour }`. Render `Tour` in your JSX.

Docs: https://v3.react-joyride.com/docs/getting-started

## Core Concepts

The tour has two state dimensions:

**Tour Status**: `idle -> ready -> waiting -> running <-> paused -> finished | skipped`
- `idle`: No steps loaded
- `ready`: Steps loaded, waiting for `run: true`
- `waiting`: `run=true` but steps loading async (transitions to running when steps arrive)
- `running`: Tour active
- `paused`: Tour paused (controlled mode at COMPLETE, or `stop()` called)
- `finished` / `skipped`: Tour ended

**Step Lifecycle** (per step): `init -> ready -> beacon_before -> beacon -> tooltip_before -> tooltip -> complete`
- `*_before` phases: scrolling and positioning happen here
- `beacon`: Pulsing indicator shown (skipped when `continuous` + navigating, `skipBeacon`, or `placement: 'center'`)
- `tooltip`: The tooltip is visible and interactive

Docs: https://v3.react-joyride.com/docs/how-it-works

## Step Configuration

Each step requires `target` and `content`. All other fields are optional.

```tsx
{
  target: '.my-element',       // CSS selector, HTMLElement, React ref, or () => HTMLElement
  content: 'Step body text',   // ReactNode
  title: 'Optional title',    // ReactNode
  placement: 'bottom',        // Default. Also: top, left, right, *-start, *-end, auto, center
  id: 'unique-id',            // Optional identifier
  data: { custom: 'data' },   // Attached to event callbacks
}
```

### Target types

```tsx
// CSS selector
{ target: '.sidebar-nav' }
// HTMLElement
{ target: document.getElementById('my-el') }
// React ref
const ref = useRef(null);
{ target: ref }
// Function (evaluated each lifecycle)
{ target: () => document.querySelector('.dynamic-element') }
```

### Common step options (override per-step)

| Option | Default | Description |
|--------|---------|-------------|
| `placement` | `'bottom'` | Tooltip position. Use `'center'` for modal-style (requires `target: 'body'`) |
| `skipBeacon` | `false` | Skip beacon, show tooltip directly |
| `buttons` | `['back','close','primary']` | Buttons in tooltip. Add `'skip'` for skip button |
| `hideOverlay` | `false` | Don't show dark overlay |
| `blockTargetInteraction` | `false` | Block clicks on highlighted element |
| `before` | - | `(data) => Promise<void>` — async hook before step shows |
| `after` | - | `(data) => void` — fire-and-forget hook after step completes |
| `skipScroll` | `false` | Don't scroll to target |
| `scrollTarget` | - | Scroll to this element instead of `target` |
| `spotlightTarget` | - | Highlight this element instead of `target` |
| `spotlightPadding` | `10` | Padding around spotlight. Number or `{ top, right, bottom, left }` |
| `targetWaitTimeout` | `1000` | ms to wait for target to appear. `0` = no waiting |
| `beforeTimeout` | `5000` | ms to wait for `before` hook. `0` = no timeout |

All `Options` fields can be set globally via `options` prop or per-step. Per-step values override global.

Docs: https://v3.react-joyride.com/docs/step | https://v3.react-joyride.com/docs/props/options

## Uncontrolled vs Controlled

### Uncontrolled (default — strongly preferred)

The tour manages step navigation internally. This is the right choice for most use cases.

**The library handles async transitions for you.** If a step needs to wait for a UI change (dropdown opening, data loading, animation), use `before` hooks — the tour waits for the promise to resolve before showing the step. If a target element isn't in the DOM yet, `targetWaitTimeout` (default: 1000ms) handles polling for it. You do NOT need controlled mode for these cases.

```tsx
const { Tour } = useJoyride({
  continuous: true,
  run: isRunning,
  steps: [
    { target: '.nav', content: 'Navigation' },
    {
      target: '.dropdown-item',
      content: 'Inside the dropdown',
      before: () => {
        // Open dropdown and wait for animation — tour waits automatically
        openDropdown();
        return new Promise(resolve => setTimeout(resolve, 300));
      },
      after: () => closeDropdown(), // Clean up after step (fire-and-forget)
    },
    { target: '.main-content', content: 'Main content' },
  ],
  onEvent: (data) => {
    if (([STATUS.FINISHED, STATUS.SKIPPED] as Status).includes(data.status)) {
      setIsRunning(false);
    }
  },
});
```

### Controlled (with `stepIndex`) — use sparingly

Only use controlled mode when the parent genuinely needs to manage the step index externally (e.g., syncing with URL params, external state machines, or complex multi-component coordination that `before`/`after` hooks can't handle).

```tsx
const [stepIndex, setStepIndex] = useState(0);
const [run, setRun] = useState(true);

const { Tour } = useJoyride({
  continuous: true,
  run,
  stepIndex,  // This makes it controlled
  steps,
  onEvent: (data) => {
    const { action, index, status, type } = data;

    if (([STATUS.FINISHED, STATUS.SKIPPED] as Status).includes(status)) {
      setRun(false);
      return;
    }

    if (type === 'step:after' || type === 'error:target_not_found') {
      setStepIndex(index + (action === 'prev' ? -1 : 1));
    }
  },
});
```

**Controlled mode rules:**
- `go()` and `reset()` are disabled (logged warning)
- You must update `stepIndex` in response to events
- The tour pauses at COMPLETE — you must advance it
- Prefer uncontrolled mode with `before`/`after` hooks unless you have a strong reason for external index management

## Event System

### `onEvent` callback

```tsx
onEvent: (data: EventData, controls: Controls) => void
```

The `data` object contains the full tour state plus event-specific fields. The `controls` object lets you programmatically control the tour.

### Event types (in order per step)

| Event | When |
|-------|------|
| `tour:start` | Tour begins |
| `step:before_hook` | `before` hook is called |
| `step:before` | Target found, step about to render |
| `scroll:start` | Scrolling to target |
| `scroll:end` | Scroll complete |
| `beacon` | Beacon shown |
| `tooltip` | Tooltip shown |
| `step:after` | User navigated (next/prev/close/skip) |
| `step:after_hook` | `after` hook called |
| `tour:end` | Tour finished or skipped |
| `tour:status` | Status changed (on stop/reset) |
| `error:target_not_found` | Target element not found |
| `error` | Generic error |

### Event subscription with `on()`

```tsx
const { on, Tour } = useJoyride({ ... });

useEffect(() => {
  const unsubscribe = on('tooltip', (data, controls) => {
    analytics.track('tour_step_viewed', { step: data.index });
  });
  return unsubscribe;
}, [on]);
```

Docs: https://v3.react-joyride.com/docs/events

## Controls

Available via `useJoyride()` return value or `onEvent` second argument:

| Method | Description |
|--------|-------------|
| `next()` | Advance to next step |
| `prev()` | Go to previous step |
| `close(origin?)` | Close current step, advance |
| `skip(origin?)` | Skip the tour entirely |
| `start(index?)` | Start the tour |
| `stop(advance?)` | Stop (pause) the tour |
| `go(index)` | Jump to step (uncontrolled only) |
| `reset(restart?)` | Reset tour (uncontrolled only) |
| `open()` | Open tooltip for current step |
| `info()` | Get current state |

Docs: https://v3.react-joyride.com/docs/hook

## Styling & Theming

Three layers of customization (from simple to full control):

### 1. Color options (simplest)

```tsx
options: {
  primaryColor: '#1976d2',      // Buttons and beacon
  backgroundColor: '#1a1a2e',   // Tooltip background
  textColor: '#ffffff',         // Tooltip text
  overlayColor: 'rgba(0,0,0,0.7)', // Overlay backdrop
  arrowColor: '#1a1a2e',        // Arrow (match background)
}
```

### 2. Styles override

```tsx
styles: {
  tooltip: { borderRadius: 12 },
  buttonPrimary: { backgroundColor: '#1976d2' },
  buttonBack: { color: '#666' },
  spotlight: { borderRadius: 8 },
}
```

Style keys: `arrow`, `beacon`, `beaconInner`, `beaconOuter`, `beaconWrapper`, `buttonBack`, `buttonClose`, `buttonPrimary`, `buttonSkip`, `floater`, `loader`, `overlay`, `tooltip`, `tooltipContainer`, `tooltipContent`, `tooltipFooter`, `tooltipFooterSpacer`, `tooltipTitle`

### 3. Custom components (full control)

See next section.

Docs: https://v3.react-joyride.com/docs/props/styles

## Custom Components

Replace any UI component via props. Each receives render props with step data and button handlers.

### Custom Tooltip

```tsx
import type { TooltipRenderProps } from 'react-joyride';

function MyTooltip({ backProps, index, primaryProps, size, skipProps, step, tooltipProps }: TooltipRenderProps) {
  return (
    <div {...tooltipProps} style={{ background: '#fff', padding: 16, borderRadius: 8, width: step.width }}>
      {step.title && <h3>{step.title}</h3>}
      <div>{step.content}</div>
      <div>
        {index > 0 && <button {...backProps}>Back</button>}
        <button {...primaryProps}>Next</button>
      </div>
    </div>
  );
}

// Usage
<Joyride tooltipComponent={MyTooltip} ... />
```

**Important**: Spread `tooltipProps` on the container (sets `role="dialog"` and `aria-modal`). Spread button props (`backProps`, `primaryProps`, `closeProps`, `skipProps`) on buttons for correct action handling.

### Custom Beacon

Must render a `<span>` (placed inside a `<button>` wrapper). Receives `BeaconRenderProps`: `{ continuous, index, isLastStep, size, step }`.

### Custom Arrow

Receives `ArrowRenderProps`: `{ base, placement, size }`.

### Custom Loader

Receives `LoaderRenderProps`: `{ step }`. Set to `null` to disable the loader.

Docs: https://v3.react-joyride.com/docs/custom-components

## Problem → Solution Guide

| I need to... | Use |
|---|---|
| Wait for async UI changes between steps (dropdown, animation, data load) | `before` hook returning a Promise — not controlled mode |
| Control step navigation externally (URL sync, external state machine) | Controlled mode with `stepIndex` — but try `before`/`after` hooks first |
| Track which steps failed (target missing, hook error) | `failures` array from `useJoyride()` return |
| Listen to specific events without `onEvent` switch | `on('event:type', handler)` from `useJoyride()` return |
| Show a centered modal-style step | `target: 'body'` + `placement: 'center'` |

## Common Gotchas & Debugging

### Use `debug: true` first

The `debug` prop is the most powerful troubleshooting tool. It logs detailed lifecycle transitions, state changes, and event emissions to the console. Always start here when something isn't working.

```tsx
<Joyride debug={true} ... />
// or
useJoyride({ debug: true, ... })
```

The console output shows exactly which lifecycle phase the tour reaches, what actions are firing, and where it gets stuck.

### Tour not starting
- Check `run={true}` is set
- Verify `steps` array is not empty and steps have valid `target` + `content`
- For SSR: use `<Joyride>` component (auto-guards DOM access) or check `typeof window !== 'undefined'`

### Target not found
- Test selector in console: `document.querySelector('.your-selector')`
- Element must be visible (not `display: none`, `visibility: hidden`, or zero dimensions)
- If element mounts later, increase `targetWaitTimeout` (default: 1000ms)
- Set `targetWaitTimeout: 0` to skip waiting entirely
- In uncontrolled mode, missing targets auto-advance; in controlled mode, handle `error:target_not_found` event

### Tooltip never appears / overlay flashes
- Add `debug: true` and check the console to see which lifecycle phase is reached
- Verify the target element is in the viewport or scrollable
- Check for CSS `overflow: hidden` on ancestors clipping the target
- If using portals or modals, the target may not be accessible

### Controlled mode stuck
- First question: do you actually need controlled mode? Most async needs are solved with `before`/`after` hooks in uncontrolled mode
- If controlled: you MUST update `stepIndex` in your `onEvent` handler when `type === 'step:after'`
- Handle both forward (`action !== 'prev'`) and backward (`action === 'prev'`) navigation
- Also handle `error:target_not_found` to skip broken steps
- `go()` and `reset()` don't work in controlled mode

### Before hook timeout
- Default `beforeTimeout` is 5000ms — increase if your async operation takes longer
- Set `beforeTimeout: 0` for no timeout
- The loader appears after `loaderDelay` (300ms) while waiting

### Scroll issues
- Use `scrollTarget` to scroll to a different element than the tooltip target
- Adjust `scrollOffset` (default: 20px) for headers or fixed elements
- Set `skipScroll: true` to disable auto-scrolling for a step
- `scrollToFirstStep: false` by default — set to `true` if first step is off-screen

### Center placement
- Use `placement: 'center'` with `target: 'body'` for modal-style centered tooltips
- Center placement automatically hides the beacon and arrow

### Imports

```tsx
// Named exports only (no default export in v3)
import { Joyride, useJoyride } from 'react-joyride';

// Constants for type-safe comparisons
import { ACTIONS, EVENTS, LIFECYCLE, ORIGIN, STATUS } from 'react-joyride';

// Types
import type { Step, Props, EventData, Controls, TooltipRenderProps } from 'react-joyride';
```

Docs: https://v3.react-joyride.com/docs/exports

## Reference Files

Read these for complete API details:

- `references/api-props-options.md` — Full Props, Options (all 30+ fields with defaults), Locale, FloatingOptions, Styles types
- `references/api-step-state-controls.md` — Step, StepMerged, StepTarget, State, Controls (all 10 methods), UseJoyrideReturn, StepFailure
- `references/api-events-components.md` — All 13 event types, ACTIONS/LIFECYCLE/STATUS/ORIGIN constants, EventData, custom component render props
- `references/patterns.md` — Complete working examples: controlled mode, before/after hooks, custom tooltip, event subscription, dynamic steps
