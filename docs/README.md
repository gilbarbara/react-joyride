# Overview

[![Joyride example image](http://gilbarbara.com/files/react-joyride.png)](https://react-joyride.com/)

### Create awesome tours for your app!

Showcase your app to new users or explain the functionality of new features.

It uses [@floating-ui/react-dom](https://floating-ui.com/) for positioning and styling.
You can also use your own components.

**Open the** [**demo**](https://react-joyride.com/)  
**Open GitHub** [**repo**](https://github.com/gilbarbara/react-joyride)

## Setup

```bash
npm i react-joyride
```

## Getting Started

```tsx
import React, { useState } from 'react';
import Joyride from 'react-joyride';

/*
 * If your steps are not dynamic you can use a simple array.
 * Otherwise you can set it as a state inside your component.
 */
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
  // If you want to delay the tour initialization you can use the `run` prop
  return (
    <div>
      <Joyride steps={steps} />
      ...
    </div>
  );
}
```

> To support legacy browsers, include the [scrollingelement](https://github.com/mathiasbynens/document.scrollingElement) polyfill.

## Library Architecture

React Joyride uses [@floating-ui/react-dom](https://floating-ui.com/) for positioning and styling.

To control the positioning behavior, you can pass options using `floatingOptions`. See the [styling documentation](styling.md) for more details.
