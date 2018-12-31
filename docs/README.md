# React Joyride

[![Joyride example image](http://gilbarbara.github.io/react-joyride/media/example.png)](http://gilbarbara.github.io/react-joyride/)

#### Create awesome tours for your app!

Showcase your app to new users or explain functionality of new features.  

It uses [react-floater](https://github.com/gilbarbara/react-floater) for positioning and styling.  
And you can use your own components too.

**Open the [demo](https://2zpjporp4p.codesandbox.io/)**

**Open GitHub [repo](https://github.com/gilbarbara/react-joyride)**

## Setup

```bash
npm i react-joyride
```

## Getting Started

```javascript
import Joyride from 'react-joyride';

export class App extends React.Component {
  state = {
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

  render () {
    const { steps } = this.state;

    return (
      <div className="app">
        <Joyride
          steps={steps}
          ...
        />
        ...
      </div>
    );
  }
}
```
