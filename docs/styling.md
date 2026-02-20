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

If you want to customize the arrow, check [react-floater](https://github.com/gilbarbara/react-floater) documentation.

## Component Hierarchy and Advanced Styling

React Joyride uses a component hierarchy for positioning and styling:

React Joyride → React Floater → Popper.js

To control advanced positioning and styling behavior, you can pass options through this
component chain using the `floaterProps` prop:

```tsx
<Joyride
  steps={steps}
  floaterProps={{
    // Styling for React Floater
    styles: {
      floater: { filter: 'none' },
      arrow: {
        size: 20,  // Width of the base of the arrow
        base: 10   // Distance from the tip to the edge
      },
    },
    // Popper.js modifiers
    modifiers: {
      arrow: {
        options: {
          padding: 20, // Controls arrow positioning padding
        },
      },
      offset: {
        options: {
          offset: [0, 20], // Adjusts main tooltip position
        },
      },
    },
  }}
/>
```

### Common Use Case: Adjusting Arrow Position for Rounded Corners

A common styling challenge is adjusting arrow positioning when using tooltips with rounded corners.
Here's an example of how to adjust the arrow position to accommodate border-radius styling:

```tsx
<Joyride
  steps={steps}
  floaterProps={{
    styles: {
      floater: {
        borderRadius: '8px',
      },
      arrow: {
        size: 16,
        base: 8,
      }
    },
    modifiers: {
      arrow: {
        options: {
          padding: 12, // Increase padding to prevent arrow from aligning with rounded corners
        },
      },
    },
  }}
/>
```

For detailed configuration options, see the [Popper.js modifiers documentation](https://popper.js.org/docs/v2/modifiers/), particularly the [arrow modifier](https://popper.js.org/docs/v2/modifiers/arrow/).

Note that solutions found in older issues (before v2) may not work with current versions due to changes in the underlying positioning library.
