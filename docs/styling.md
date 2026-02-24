# Styling

Version 2 uses inline styles instead of V1 SCSS.  
To update the default theme, just pass a `styles` prop to the Joyride component,  
You can control the overall theme with the special `options` object.

```text
const defaultOptions = {
  arrowColor: '#fff',
  backgroundColor: '#fff',
  beaconSize: 36,
  overlayColor: 'rgba(0, 0, 0, 0.5)',
  primaryColor: '#f04',
  spotlightShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
  textColor: '#333',
  width: undefined,
  zIndex: 100,
};
```

## Example

```tsx
import React, { useState } from 'react';
import Joyride, { ACTIONS, EVENTS } from 'react-joyride';
const steps = [
  {
    target: '.my-first-step',
    content: 'This is my awesome feature!',
  },
  {
    target: '.my-other-step',
    content: 'This another awesome feature!',
  },
];

export default function App() {
  const [run, setRun] = useState(false);

  const handleClickStart = () => {
    setRun(true);
  };

  return (
    <div>
      <Joyride
        run={run}
        steps={steps}
        styles={{
          options: {
            arrowColor: '#e3ffeb',
            backgroundColor: '#e3ffeb',
            overlayColor: 'rgba(79, 26, 0, 0.4)',
            primaryColor: '#000',
            textColor: '#004a14',
            width: 900,
            zIndex: 1000,
          },
        }}
      />
      <button onClick={handleClickStart}>Start</button>
      // Your code here...
    </div>
  );
}
```

You can customize the styles per step, too.

Check [styles.js](https://github.com/gilbarbara/react-joyride/blob/main/src/styles.ts) for more information.

Or, if you need finer control, you can use your own components for the beacon and tooltip. Check the [custom components](custom-components.md) documentation.

To customize the arrow, use the `styles.arrow` option with `base` (width) and `size` (depth) properties.

## Advanced Positioning

React Joyride uses [@floating-ui/react-dom](https://floating-ui.com/) for tooltip positioning.

To control positioning behavior, use the `floatingOptions` prop:

```tsx
import { shift } from '@floating-ui/react-dom';

<Joyride
  steps={steps}
  floatingOptions={{
    strategy: 'fixed',
    middleware: [
      shift({ padding: 10 }),
    ],
  }}
/>
```

The default middleware stack includes `offset`, `flip` (or `autoPlacement` for `auto` placement), `shift`, and `arrow`. Any middleware you pass via `floatingOptions.middleware` is appended to these defaults.

### Arrow Styling

Arrow appearance is controlled via the `styles` prop:

```tsx
<Joyride
  steps={steps}
  styles={{
    arrow: {
      base: 32,  // Width of the arrow base (default: 32)
      size: 16,  // Depth of the arrow (default: 16)
    },
  }}
/>
```

### Beacon Positioning

Beacon placement can be customized independently:

```tsx
<Joyride
  steps={steps}
  floatingOptions={{
    beaconOptions: {
      offset: -10,       // Distance from target (default: -18)
      placement: 'top',  // Override beacon placement
    },
  }}
/>
```

For detailed configuration options, see the [Floating UI middleware documentation](https://floating-ui.com/docs/middleware).
