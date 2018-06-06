# React Joyride

[![](https://badge.fury.io/js/react-joyride.svg)](https://www.npmjs.com/package/react-joyride) [![](https://travis-ci.org/gilbarbara/react-joyride.svg)](https://travis-ci.org/gilbarbara/react-joyride) [![](https://api.codeclimate.com/v1/badges/43ecb5536910133429bd/maintainability)](https://codeclimate.com/github/gilbarbara/react-joyride/maintainability) [![](https://api.codeclimate.com/v1/badges/43ecb5536910133429bd/test_coverage)](https://codeclimate.com/github/gilbarbara/react-joyride/test_coverage)

[![Joyride example image](http://gilbarbara.github.io/react-joyride/media/example.png)](http://gilbarbara.github.io/react-joyride/)

Create a tour for your app!  
Use it to showcase your app for new users! Or explain functionality of complex features!  

#### View the demo [here](https://2zpjporp4p.codesandbox.io/)

You can edit the demo [here](https://codesandbox.io/s/2zpjporp4p)

>  If you are looking for the documentation for the old 1.x version, go [here](https://github.com/gilbarbara/react-joyride/tree/v1.11.4)

## Setup

```bash
npm i react-joyride@next
```

## Getting Started

Just set a `steps` array to the Joyride component and you're good to go!

You can use your own component for the tooltip body or beacon, if you want.

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

  callback = (data) => {
    const { action, index, type } = data;
  };

  render () {
    const { steps, run } = this.state;

    return (
      <div className="app">
        <Joyride
          steps={steps}
          run={run}
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

This library uses [react-floater](https://github.com/gilbarbara/react-floater) and [popper.js](https://github.com/FezVrasta/popper.js) for positioning and styling.

