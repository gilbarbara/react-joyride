# Common Patterns

## Async Transitions with `before`/`after` Hooks (Preferred)

The library handles waiting for async operations. Use `before` hooks to prepare the UI before a step shows (open dropdowns, load data, trigger animations). The tour waits for the promise to resolve. Use `after` hooks for cleanup (fire-and-forget, does not block).

This is the **preferred approach** over controlled mode for most async scenarios.

```tsx
import { useState } from 'react';
import { ACTIONS, STATUS, useJoyride } from 'react-joyride';

function Dashboard() {
  const [run, setRun] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { Tour } = useJoyride({
    continuous: true,
    run,
    steps: [
      {
        target: '.nav-bar',
        content: 'This is the navigation',
        skipBeacon: true,
      },
      {
        target: '.dropdown-item', // Element inside the dropdown
        content: 'This dropdown item is important',
        skipBeacon: true,
        before: ({ action }) => {
          // Open dropdown before this step — runs on both forward and back navigation
          setIsMenuOpen(true);
          return new Promise(resolve => setTimeout(resolve, 300));
        },
      },
      {
        target: '.main-content',
        content: 'And here is the main content',
        before: ({ action }) => {
          // Close dropdown when moving to this step
          setIsMenuOpen(false);
          return new Promise(resolve => setTimeout(resolve, 300));
        },
      },
    ],
    onEvent: (data) => {
      if ([STATUS.FINISHED, STATUS.SKIPPED].includes(data.status)) {
        setRun(false);
        setIsMenuOpen(false);
      }
    },
  });

  return (
    <div>
      {Tour}
      <button onClick={() => setRun(true)}>Start Tour</button>
      {/* ... */}
    </div>
  );
}
```

## Before/After Hooks

### Async data loading before a step

```tsx
{
  target: '.user-profile',
  content: 'Here is your profile data',
  before: async () => {
    await fetchUserProfile();
    // Tour waits for this promise to resolve
  },
  beforeTimeout: 10000, // Allow up to 10s
}
```

### Analytics tracking after a step

```tsx
{
  target: '.feature',
  content: 'Check out this feature',
  after: (data) => {
    // Fire-and-forget — does not block the tour
    analytics.track('tour_step_completed', {
      stepIndex: data.index,
      action: data.action,
    });
  },
}
```

### Delayed transitions (e.g., waiting for animation)

```tsx
{
  target: '.sidebar',
  content: 'The sidebar',
  before: ({ action }) => {
    // Only delay when navigating forward (not on back)
    const ms = action === ACTIONS.PREV ? 0 : 300;
    return new Promise(resolve => setTimeout(resolve, ms));
  },
}
```

## Custom Tooltip Component

```tsx
import type { TooltipRenderProps } from 'react-joyride';

function CustomTooltip({
  backProps,
  closeProps,
  index,
  isLastStep,
  primaryProps,
  size,
  skipProps,
  step,
  tooltipProps,
}: TooltipRenderProps) {
  return (
    <div
      {...tooltipProps}
      style={{
        background: '#fff',
        borderRadius: 8,
        maxWidth: 400,
        padding: 20,
        width: step.width,
      }}
    >
      {step.title && <h3 style={{ margin: '0 0 8px' }}>{step.title}</h3>}
      <div>{step.content}</div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
        {step.buttons.includes('skip') && !isLastStep && (
          <button {...skipProps} type="button">Skip</button>
        )}
        <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
          {index > 0 && (
            <button {...backProps} type="button">Back</button>
          )}
          <button {...primaryProps} type="button">
            {isLastStep ? 'Done' : `Next (${index + 1}/${size})`}
          </button>
        </div>
      </div>
    </div>
  );
}

// Usage:
// <Joyride tooltipComponent={CustomTooltip} ... />
// or in useJoyride: useJoyride({ tooltipComponent: CustomTooltip, ... })
```

## Event Subscription with `on()`

```tsx
function App() {
  const { on, Tour } = useJoyride({
    steps,
    run: true,
    continuous: true,
  });

  useEffect(() => {
    const unsubs = [
      on('tour:start', (data) => {
        console.log('Tour started');
      }),
      on('tooltip', (data) => {
        analytics.track('step_viewed', { index: data.index });
      }),
      on('tour:end', (data) => {
        const wasSkipped = data.status === 'skipped';
        analytics.track('tour_ended', { skipped: wasSkipped, lastStep: data.index });
      }),
    ];

    return () => unsubs.forEach(unsub => unsub());
  }, [on]);

  return <div>{Tour}</div>;
}
```

## Dynamic Steps

```tsx
function App() {
  const [steps, setSteps] = useState<Step[]>([]);

  useEffect(() => {
    // Build steps based on feature flags, user role, etc.
    const dynamicSteps: Step[] = [
      { target: '.dashboard', content: 'Welcome to your dashboard' },
    ];

    if (user.isAdmin) {
      dynamicSteps.push({
        target: '.admin-panel',
        content: 'Admin controls are here',
      });
    }

    if (featureFlags.newSearch) {
      dynamicSteps.push({
        target: '.search-bar',
        content: 'Try the new search',
      });
    }

    setSteps(dynamicSteps);
  }, [user, featureFlags]);

  return (
    <Joyride
      run={steps.length > 0}
      steps={steps}
      continuous
    />
  );
}
```

## React Ref Targets

```tsx
function App() {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const steps: Step[] = [
    { target: sidebarRef, content: 'Navigation sidebar' },
    { target: buttonRef, content: 'Click here to create' },
    { target: '.css-selector', content: 'Mix refs with selectors' },
  ];

  return (
    <div>
      <Joyride steps={steps} run continuous />
      <div ref={sidebarRef}>Sidebar</div>
      <button ref={buttonRef}>Create</button>
      <span className="css-selector">Other element</span>
    </div>
  );
}
```

## Restart / Resume Tour

```tsx
function App() {
  const [run, setRun] = useState(false);
  const [initialStepIndex, setInitialStepIndex] = useState(0);

  const handleStart = () => {
    setInitialStepIndex(0);
    setRun(true);
  };

  const handleResume = (fromStep: number) => {
    setInitialStepIndex(fromStep);
    setRun(true);
  };

  return (
    <div>
      <Joyride
        run={run}
        initialStepIndex={initialStepIndex}
        steps={steps}
        continuous
        onEvent={(data) => {
          if ([STATUS.FINISHED, STATUS.SKIPPED].includes(data.status)) {
            setRun(false);
          }
        }}
      />
      <button onClick={handleStart}>Start Tour</button>
      <button onClick={() => handleResume(3)}>Resume from Step 4</button>
    </div>
  );
}
```

## Center Placement (Modal Style)

```tsx
{
  target: 'body',
  placement: 'center',
  content: (
    <div>
      <h2>Welcome!</h2>
      <p>This appears as a centered modal overlay.</p>
    </div>
  ),
  // Center placement automatically hides beacon and arrow
}
```
