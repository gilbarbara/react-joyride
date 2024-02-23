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

You can customize the styles per step too.

Check [styles.js](https://github.com/gilbarbara/react-joyride/blob/main/src/styles.ts) for more information.

Or if you need finer control you can use you own components for the beacon and tooltip. Check the [custom components](custom-components.md) documentation.

If you want to customize the arrow, check [react-floater](https://github.com/gilbarbara/react-floater) documentation.
