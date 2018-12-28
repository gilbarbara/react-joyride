# React Joyride

[![](https://badge.fury.io/js/react-joyride.svg)](https://www.npmjs.com/package/react-joyride) [![](https://travis-ci.org/gilbarbara/react-joyride.svg)](https://travis-ci.org/gilbarbara/react-joyride) [![](https://api.codeclimate.com/v1/badges/43ecb5536910133429bd/maintainability)](https://codeclimate.com/github/gilbarbara/react-joyride/maintainability) [![](https://api.codeclimate.com/v1/badges/43ecb5536910133429bd/test_coverage)](https://codeclimate.com/github/gilbarbara/react-joyride/test_coverage)

[![Joyride example image](http://gilbarbara.github.io/react-joyride/media/example.png)](http://gilbarbara.github.io/react-joyride/)

#### Create awesome tours for your app!

Use it to showcase your app to new users or explain functionality of new features.  

It uses [react-floater](https://github.com/gilbarbara/react-floater) for positioning and styling.  
And you can use your own components if you want.

### View the demo [here](https://2zpjporp4p.codesandbox.io/)

## Setup

```bash
npm i react-joyride@next
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
        content: 'This is my awesome feature!',
      },
      {
        target: '.my-other-step',
        content: 'This another awesome feature!',
      },
      ...
    ]
  };

  componentDidMount() {
    this.setState({ run: true });
  }

  render () {
    const { steps, run } = this.state;

    return (
      <div className="app">
        <Joyride
          run={run}
          steps={steps}
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

[Customization](customization.md)

[Callback](callback.md)

[Constants](constants.md)

[Accessibility](accessibility.md)

[Migration from 1.x](migration.md)

