# Callback

You can get Joyride's state change using the `callback` prop.

It will receive a plain object with the state changes.

Example data:

```text
{
  action: 'start',
  controlled: true,
  index: 0,
  lifecycle: 'init',
  size: 4,
  status: 'running',
  step: { the.current.step },
  type: 'tour:start',
}
```

```text
{
  action: 'update',
  controlled: true,
  index: 0,
  lifecycle: 'beacon',
  size: 4,
  status: 'running',
  step: { the.current.step },
  type: 'beacon',
}
```

```text
{
  action: 'next',
  controlled: true,
  index: 0,
  lifecycle: 'complete',
  size: 4,
  status: 'running',
  step: { the.current.step },
  type: 'step:after',
}
```

```javascript
import Joyride from 'react-joyride';
import { ACTIONS, EVENTS } from 'react-joyride/es/constants';

export class App extends React.Component {
  state = {
    run: false,
    steps: [],
    stepIndex: 0, // a controlled tour
  };

  callback = (tour) => {
    const { action, index, type } = data;

    if (type === EVENTS.TOUR_END) {
      // Update user preferences with completed tour flag
    } else if (type === EVENTS.STEP_AFTER && index === 1) {
      // pause the tour, load a new route and start it again once is done.
      this.setState({ run: false });
    } 
    else if ([EVENTS.STEP_AFTER, EVENTS.CLOSE, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      // Sunce this is a controlled tour you'll need to update the state to advance the tour
      this.setState({ stepIndex: index + (action === ACTIONS.PREV ? -1 : 1) });
    }
  };

  render () {
    const { run, stepIndex, steps } = this.state;

    return (
      <div className="app">
        <Joyride
          callback={this.callback}
          run={run}
          stepIndex={stepIndex}
          steps={steps}
          ...
        />
        ...
      </div>
    );
  }
}
```

You can read more about the constants [here](constants.md)

