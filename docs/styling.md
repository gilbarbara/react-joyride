# Styling

Version 2 uses inline styles instead of the previous CSS/SCSS files but you can also use you own components for the beacon and tooltip and style them anyway you want.

To update the default theme, just pass a `styles` prop to the Joyride component or directly in a [step](step.md).  
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

```javascript
import Joyride from 'react-joyride';
import { ACTIONS, EVENTS } from 'react-joyride/es/constants';

export class App extends React.Component {
  state = {
    run: false,
    steps: [],
  };

  render () {
    const { run, stepIndex, steps } = this.state;

    return (
      <div className="app">
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
            }
          }}
          ...
        />
        ...
      </div>
    );
  }
}
```

You can also customize any element independently. Check [styles.js](https://github.com/gilbarbara/react-joyride/tree/3e08384415a831b20ce21c8423b6c271ad419fbf/src/styles.js) for more information.

If you want to customize the arrow, check [react-floater](https://github.com/gilbarbara/react-floater) documentation.

