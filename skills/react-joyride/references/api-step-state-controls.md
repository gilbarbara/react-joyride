# Step, State, Controls

## Step

A single step provided by the user. Extends `SharedProps` and `Partial<Options>`.

```typescript
type Step = SharedProps & Partial<Options> & {
  // Required
  content: ReactNode;                           // Tooltip body
  target: StepTarget;                           // Element to highlight

  // Optional
  id?: string;                                  // Unique identifier
  title?: ReactNode;                            // Tooltip title
  data?: any;                                   // Custom data (passed to callbacks)

  // Positioning
  placement?: Placement | 'auto' | 'center';   // Default: 'bottom'
  beaconPlacement?: Placement;                  // Beacon-specific placement
  isFixed?: boolean;                            // Force fixed positioning (default: false)

  // Alternate targets
  scrollTarget?: StepTarget;                    // Scroll to this instead of target
  spotlightTarget?: StepTarget;                 // Highlight this instead of target
}
```

All `Options` fields (see api-props-options.md) are also valid on Step for per-step overrides.

## StepTarget

Four ways to specify a target element:

```typescript
type StepTarget =
  | string                              // CSS selector
  | HTMLElement                         // Direct element reference
  | RefObject<HTMLElement | null>       // React ref
  | (() => HTMLElement | null);         // Function (re-evaluated each lifecycle)
```

## StepMerged

The normalized step after defaults are applied. All `Options` fields become required, plus:
- `spotlightPadding: Required<SpotlightPadding>` (always `{ top, right, bottom, left }`)
- `styles: Styles` (fully resolved)

This is what you receive in event callbacks and custom component props.

## State

```typescript
type State = {
  action: Actions;         // What triggered the update (init, start, next, prev, etc.)
  controlled: boolean;     // true when stepIndex prop is set
  index: number;           // Current step index
  lifecycle: Lifecycle;     // Step rendering phase
  origin: Origin | null;   // UI element that triggered action
  scrolling: boolean;      // Scroll animation in progress
  size: number;            // Total number of steps
  status: Status;          // Tour status (idle, ready, running, etc.)
  waiting: boolean;        // Blocked on before hook or target polling
}
```

## Controls

All 10 methods for programmatic tour control:

```typescript
type Controls = {
  close(origin?: Origin | null): void;
  // Close the current step and advance to the next one.
  // Optional origin for event tracking.

  go(nextIndex: number): void;
  // Jump to a specific step by index.
  // Uncontrolled mode only — logs warning in controlled mode.

  info(): State;
  // Get the current tour state snapshot.

  next(): void;
  // Advance to the next step.

  open(): void;
  // Open the tooltip for the current step (skip beacon).

  prev(): void;
  // Go back to the previous step.

  reset(restart?: boolean): void;
  // Reset the tour to the beginning.
  // If restart=true, also starts the tour.
  // Uncontrolled mode only — logs warning in controlled mode.

  skip(origin?: 'button_close' | 'button_skip'): void;
  // Skip (end) the tour entirely. Sets status to SKIPPED.

  start(nextIndex?: number): void;
  // Start the tour. Optionally at a specific step index.

  stop(advance?: boolean): void;
  // Stop (pause) the tour. Sets status to PAUSED.
  // If advance=true, moves to next step before stopping.
}
```

## UseJoyrideReturn

```typescript
type UseJoyrideReturn = {
  controls: Controls;
  // Programmatic tour control methods.

  failures: StepFailure[];
  // Steps that failed (target not found, before hook errors).
  // Clears on start/reset.

  on: (eventType: Events, handler: EventHandler) => () => void;
  // Subscribe to a specific event type.
  // Returns an unsubscribe function.

  state: State;
  // Current tour state (reactive, updates on changes).

  step: StepMerged | null;
  // Current merged step, or null if no step is active.

  Tour: ReactElement | null;
  // The tour React element. Render this in your JSX.
}
```

## StepFailure

```typescript
interface StepFailure {
  reason: 'before_hook' | 'target_not_found';
  step: StepMerged;
}
```

## Placement

```typescript
type Placement =
  | 'top' | 'top-start' | 'top-end'
  | 'bottom' | 'bottom-start' | 'bottom-end'
  | 'left' | 'left-start' | 'left-end'
  | 'right' | 'right-start' | 'right-end';

// Step also accepts: 'auto' (Floating UI auto-placement) and 'center' (modal-style)
```
