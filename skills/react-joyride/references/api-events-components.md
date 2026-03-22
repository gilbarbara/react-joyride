# Events, Constants, Custom Components

## Constants

### ACTIONS
```typescript
const ACTIONS = {
  INIT: 'init',
  START: 'start',
  STOP: 'stop',
  RESET: 'reset',
  PREV: 'prev',
  NEXT: 'next',
  GO: 'go',
  CLOSE: 'close',
  SKIP: 'skip',
  UPDATE: 'update',
  COMPLETE: 'complete',
} as const;
```

### EVENTS
```typescript
const EVENTS = {
  TOUR_START: 'tour:start',
  STEP_BEFORE_HOOK: 'step:before_hook',
  STEP_BEFORE: 'step:before',
  SCROLL_START: 'scroll:start',
  SCROLL_END: 'scroll:end',
  BEACON: 'beacon',
  TOOLTIP: 'tooltip',
  STEP_AFTER: 'step:after',
  STEP_AFTER_HOOK: 'step:after_hook',
  TOUR_END: 'tour:end',
  TOUR_STATUS: 'tour:status',
  TARGET_NOT_FOUND: 'error:target_not_found',
  ERROR: 'error',
} as const;
```

### LIFECYCLE
```typescript
const LIFECYCLE = {
  INIT: 'init',
  READY: 'ready',
  BEACON_BEFORE: 'beacon_before',
  BEACON: 'beacon',
  TOOLTIP_BEFORE: 'tooltip_before',
  TOOLTIP: 'tooltip',
  COMPLETE: 'complete',
} as const;
```

### STATUS
```typescript
const STATUS = {
  IDLE: 'idle',
  READY: 'ready',
  WAITING: 'waiting',
  RUNNING: 'running',
  PAUSED: 'paused',
  SKIPPED: 'skipped',
  FINISHED: 'finished',
} as const;
```

### ORIGIN
```typescript
const ORIGIN = {
  BUTTON_CLOSE: 'button_close',
  BUTTON_SKIP: 'button_skip',
  BUTTON_PRIMARY: 'button_primary',
  KEYBOARD: 'keyboard',
  OVERLAY: 'overlay',
} as const;
```

## Event Types

### EventData

The full payload passed to `onEvent` and event subscribers:

```typescript
type EventData = TourData & {
  error: Error | null;         // Only for 'error' events
  scroll: ScrollData | null;   // Only for 'scroll:start' / 'scroll:end'
  scrolling: boolean;
  type: Events;                // The event type (discriminator)
  waiting: boolean;
}
```

### TourData

Base payload (also passed to `before` and `after` hooks):

```typescript
interface TourData {
  action: Actions;
  controlled: boolean;
  index: number;
  lifecycle: Lifecycle;
  origin: Origin | null;
  size: number;
  status: Status;
  step: StepMerged;
}
```

### EventHandler

```typescript
type EventHandler = (data: EventData, controls: Controls) => void;
```

### ScrollData

```typescript
type ScrollData = {
  duration: number;     // Scroll duration in ms
  element: Element;     // Element being scrolled
  initial: number;      // Scroll position before
  target: number;       // Computed scroll destination
}
```

## Event Flow (per step)

```
tour:start (once)
  |
  v
step:before_hook  (if before hook exists)
  |
  v
step:before  (target found, step about to render)
  |
  v
scroll:start / scroll:end  (if scrolling needed)
  |
  v
beacon  (if beacon shown) OR tooltip  (if beacon skipped)
  |
  v  (user clicks beacon)
tooltip
  |
  v  (user clicks next/prev/close/skip)
step:after
  |
  v
step:after_hook  (if after hook exists)
  |
  v  (next step or tour end)
tour:end  (when finished/skipped)
```

## Custom Component Render Props

### TooltipRenderProps

```typescript
type TooltipRenderProps = {
  // Tour state
  continuous: boolean;
  index: number;
  isLastStep: boolean;
  size: number;
  step: StepMerged;

  // Button props (spread on button elements)
  backProps: {
    'aria-label': string;
    'data-action': string;
    onClick: MouseEventHandler<HTMLElement>;
    role: string;
    title: string;
  };
  closeProps: { /* same shape */ };
  primaryProps: { /* same shape */ };
  skipProps: { /* same shape */ };

  // Container props (spread on tooltip wrapper)
  tooltipProps: {
    'aria-modal': boolean;
    role: string;  // 'dialog'
  };

  // Tour controls
  controls: Controls;
}
```

**Important**: Always spread `tooltipProps` on the root element and button props on their respective buttons. This ensures correct accessibility attributes and action handling.

### BeaconRenderProps

```typescript
type BeaconRenderProps = {
  continuous: boolean;
  index: number;
  isLastStep: boolean;
  size: number;
  step: StepMerged;
}
```

Must render a `<span>` since it's placed inside a `<button>` wrapper.

### ArrowRenderProps

```typescript
type ArrowRenderProps = {
  base: number;          // Arrow base width
  placement: Placement;  // Computed placement
  size: number;          // Arrow height
}
```

### LoaderRenderProps

```typescript
type LoaderRenderProps = {
  step: StepMerged;
}
```

Set `loaderComponent={null}` on Props or Step to disable the loader entirely.

Docs: https://v3.react-joyride.com/docs/custom-components
