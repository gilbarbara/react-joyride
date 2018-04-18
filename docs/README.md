# React Joyride

A React component to create tours for your app!

You can use it to showcase your app to new users or explain functionality of new features.  
It uses [react-floater](https://github.com/gilbarbara/react-floater) \(with [popper.js](https://github.com/FezVrasta/popper.js) for positioning and styling\).  
And you can use your own components if you want.

### View the demo [here](https://2zpjporp4p.codesandbox.io/)

## Setup

```bash
npm i react-joyride
```

## Getting Started

```javascript
import Joyride from 'react-joyride';

export class App extends React.Component {
  state = {
    run: false,
    steps: [
      {
        target: '.my-first-step',
        content: 'This if my awesome feature!',
        placement: 'bottom',
      },
      {
        target: '.my-other-step',
        content: 'This if my awesome feature!',
        placement: 'bottom',
      },
      ...
    ]
  };

  componentDidMount() {
    this.setState({ run: true });
  }

  callback = (tour) => {
    const { action, index, type } = data;
  };

  render () {
    const { steps, run } = this.state;

    return (
      <div className="app">
        <Joyride
          steps={steps}
          run={run}
          debug={true}
          callback={this.callback}
          ...
        />
        ...
      </div>
    );
  }
}
```

## Documentation

[Props](props.md)

[Step](step.md)

[Styling](styling.md)

[Callback](callback.md)

[Constants](constants.md)

[Migration from 1.x](migration.md)

