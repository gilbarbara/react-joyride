# Props, Options, Locale, FloatingOptions, Styles

## Props

```typescript
type Props = SharedProps & {
  continuous?: boolean;        // Sequential play with Next button (default: false)
  debug?: boolean;             // Log to console (default: false)
  initialStepIndex?: number;   // Start index for uncontrolled mode (default: 0)
  nonce?: string;              // CSP nonce for inline styles
  onEvent?: EventHandler;      // (data: EventData, controls: Controls) => void
  options?: Partial<Options>;  // Default options for all steps
  portalElement?: string | HTMLElement; // Render tooltip into this element
  run?: boolean;               // Start/stop tour (default: false)
  scrollToFirstStep?: boolean; // Scroll to first step on start (default: false)
  stepIndex?: number;          // Controlled mode: manages step index externally
  steps: Array<Step>;          // Required: tour steps
}
```

## SharedProps

Inherited by both `Props` and `Step`:

```typescript
type SharedProps = {
  arrowComponent?: ElementType<ArrowRenderProps>;
  beaconComponent?: ElementType<BeaconRenderProps>;
  floatingOptions?: Partial<FloatingOptions>;
  loaderComponent?: ElementType<LoaderRenderProps> | null; // null disables loader
  locale?: Locale;
  styles?: PartialDeep<Styles>;
  tooltipComponent?: ElementType<TooltipRenderProps>;
}
```

## Options

All fields can be set globally via `options` prop or per-step (step overrides global).

### Appearance

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `backgroundColor` | `string` | `'#ffffff'` | Tooltip background |
| `primaryColor` | `string` | `'#000000'` | Primary button and beacon |
| `textColor` | `string` | `'#000000'` | Tooltip text |
| `overlayColor` | `string` | `'#00000080'` | Overlay backdrop |
| `arrowColor` | `string` | `'#ffffff'` | Arrow fill |
| `width` | `string \| number` | `380` | Tooltip width |
| `zIndex` | `number` | `100` | z-index for overlay/tooltip |

### Arrow

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `arrowBase` | `number` | `32` | Base width in pixels |
| `arrowSize` | `number` | `16` | Height/depth in pixels |
| `arrowSpacing` | `number` | `12` | Distance from tooltip edge |

### Beacon

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `beaconSize` | `number` | `36` | Diameter in pixels |
| `beaconTrigger` | `'click' \| 'hover'` | `'click'` | How to open tooltip from beacon |

### Overlay & Spotlight

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `hideOverlay` | `boolean` | `false` | Don't show overlay |
| `blockTargetInteraction` | `boolean` | `false` | Block pointer events on target |
| `spotlightRadius` | `number` | `4` | Border radius of cutout |
| `spotlightPadding` | `number \| SpotlightPadding` | `10` | Padding around target |

```typescript
interface SpotlightPadding { top?: number; right?: number; bottom?: number; left?: number; }
```

### Buttons & Interactions

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `buttons` | `ButtonType[]` | `['back','close','primary']` | Buttons in tooltip |
| `closeButtonAction` | `'close' \| 'skip'` | `'close'` | Close button behavior |
| `overlayClickAction` | `'close' \| 'next' \| false` | `'close'` | Overlay click behavior |
| `dismissKeyAction` | `'close' \| 'next' \| false` | `'close'` | ESC key behavior |
| `showProgress` | `boolean` | `false` | Show "N of Total" in tooltip |

`ButtonType = 'back' | 'close' | 'primary' | 'skip'`

### Scroll

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `skipBeacon` | `boolean` | `false` | Skip beacon, show tooltip directly |
| `skipScroll` | `boolean` | `false` | Don't scroll to target |
| `scrollDuration` | `number` | `300` | Scroll animation ms |
| `scrollOffset` | `number` | `20` | Scroll distance from element |
| `offset` | `number` | `10` | Distance between tooltip and spotlight |

### Timing & Async

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `before` | `BeforeHook` | - | `(data: TourData) => Promise<void>` — runs before step |
| `after` | `AfterHook` | - | `(data: TourData) => void` — runs after step (fire-and-forget) |
| `beforeTimeout` | `number` | `5000` | Max wait for before hook (0 = no timeout) |
| `targetWaitTimeout` | `number` | `1000` | Max wait for target to appear (0 = no waiting) |
| `loaderDelay` | `number` | `300` | Delay before showing loader |
| `disableFocusTrap` | `boolean` | `false` | Disable focus trap on tooltip |

## Locale

```typescript
interface Locale {
  back?: ReactNode;              // 'Back'
  close?: ReactNode;             // 'Close'
  last?: ReactNode;              // 'Last'
  next?: ReactNode;              // 'Next'
  nextWithProgress?: ReactNode;  // 'Next ({current} of {total})'
  open?: ReactNode;              // 'Open the dialog'
  skip?: ReactNode;              // 'Skip'
}
```

`{current}` and `{total}` are placeholder strings replaced at render time in `nextWithProgress`.

## FloatingOptions

Controls `@floating-ui/react-dom` positioning:

```typescript
interface FloatingOptions {
  autoUpdate?: Partial<AutoUpdateOptions>;     // Auto-reposition options
  beaconOptions?: { offset?: number };         // Beacon offset (default: -18)
  flipOptions?: Partial<FlipOptions> | false;  // Flip middleware (false to disable)
  hideArrow?: boolean;                         // Hide arrow (default: false)
  middleware?: Array<Middleware>;               // Additional Floating UI middleware
  onPosition?: (data: PositionData) => void;   // Position callback
  shiftOptions?: Partial<ShiftOptions>;        // Shift middleware options
  strategy?: 'fixed' | 'absolute';             // Auto-detected from step.isFixed
}
```

Docs: https://v3.react-joyride.com/docs/props/floating-options

## Styles

Override CSS for any UI element:

```typescript
interface Styles {
  arrow: CSSProperties;
  beacon: CSSProperties;
  beaconInner: CSSProperties;
  beaconOuter: CSSProperties;
  beaconWrapper: CSSProperties;
  buttonBack: CSSProperties;
  buttonClose: CSSProperties;
  buttonPrimary: CSSProperties;
  buttonSkip: CSSProperties;
  floater: CSSProperties;
  loader: CSSProperties;
  overlay: CSSProperties;
  tooltip: CSSProperties;
  tooltipContainer: CSSProperties;
  tooltipContent: CSSProperties;
  tooltipFooter: CSSProperties;
  tooltipFooterSpacer: CSSProperties;
  tooltipTitle: CSSProperties;
}
```

Use `PartialDeep<Styles>` — only override what you need.

Docs: https://v3.react-joyride.com/docs/props/styles
