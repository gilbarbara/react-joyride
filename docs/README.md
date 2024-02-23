# Overview

[![Joyride example image](http://gilbarbara.com/files/react-joyride.png)](https://react-joyride.com/)

### Create awesome tours for your app!

Showcase your app to new users or explain functionality of new features.

It uses [react-floater](https://github.com/gilbarbara/react-floater) for positioning and styling.  
And you can use your own components too.

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

> If you need to support legacy browsers you need to include the [scrollingelement](https://github.com/mathiasbynens/document.scrollingElement) polyfill.
