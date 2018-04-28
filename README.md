# React Joyride

[![](https://badge.fury.io/js/react-joyride.svg)](https://www.npmjs.com/package/react-joyride) [![](https://travis-ci.org/gilbarbara/react-joyride.svg)](https://travis-ci.org/gilbarbara/react-joyride) [![](https://api.codeclimate.com/v1/badges/43ecb5536910133429bd/maintainability)](https://codeclimate.com/github/gilbarbara/react-joyride/maintainability) [![](https://api.codeclimate.com/v1/badges/43ecb5536910133429bd/test_coverage)](https://codeclimate.com/github/gilbarbara/react-joyride/test_coverage)

[![Joyride example image](http://gilbarbara.github.io/react-joyride/media/example.png)](http://gilbarbara.github.io/react-joyride/)

React-Joyride is React component to create a tour for your app for new users or explain functionality of new features.  
It uses [react-floater](https://github.com/gilbarbara/react-floater) \(with popper.js for positioning and styling\) and you can use your own components if you want.

#### View the demo [here](https://2zpjporp4p.codesandbox.io/)

You can edit the demo [here](https://codesandbox.io/s/2zpjporp4p)

## Setup

```bash
npm install --save react-joyride
```

## Getting Started

```js
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

[Props](docs/props.md)

[Step](docs/step.md)

[Styling](docs/styling.md)

[Callback](docs/callback.md)

[Constants](docs/constants.md)

[Migration from 1.x](docs/migration.md)



