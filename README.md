# React Joyride

[![](https://badge.fury.io/js/react-joyride.svg)](https://www.npmjs.com/package/react-joyride) [![CI](https://github.com/gilbarbara/react-joyride/actions/workflows/ci.yml/badge.svg)](https://github.com/gilbarbara/react-joyride/actions/workflows/ci.yml) [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=gilbarbara_react-joyride&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=gilbarbara_react-joyride) [![Coverage](https://sonarcloud.io/api/project_badges/measure?project=gilbarbara_react-joyride&metric=coverage)](https://sonarcloud.io/summary/new_code?id=gilbarbara_react-joyride)

#### Create awesome tours for your app!

Showcase your app to new users or explain the functionality of new features.

[![Joyride example image](https://react-joyride.com/images/react-joyride-v3.gif)](https://react-joyride.com/)

### Highlights

- 🎨 **Easy to use:** Just set the `steps` and you're good to go
- 🔧 **Customizable:** Use your own components and styles
- ♿ **Accessible:** Focus trapping, keyboard navigation, and ARIA support
- 📦 **Lightweight:** ~30% smaller bundle than v2
- 🔄 **Broad compatibility:** React 16.8+ through React 19
- 🖥️ **SSR-safe:** Works with Next.js, Remix, and other server-rendering frameworks

### Resources

- [Documentation](https://react-joyride.com/docs/getting-started)
- [Demos](https://react-joyride.com/demos)
- [What's new in v3](https://react-joyride.com/docs/new-in-v3)
- [StackBlitz Playground](https://stackblitz.com/edit/react-joyride)

## Setup

```bash
npm i react-joyride
```

## Quick Start

### Component API

```tsx
import { Joyride } from 'react-joyride';

const steps = [
  { target: '.my-first-step', content: 'This is my awesome feature!' },
  { target: '.my-other-step', content: 'This is another awesome feature!' },
];

export function App() {
  return (
    <div>
      <Joyride run steps={steps} />
      {/* your app */}
    </div>
  );
}
```

### Hook API

```tsx
import { useJoyride } from 'react-joyride';

const steps = [
  { target: '.my-first-step', content: 'This is my awesome feature!' },
  { target: '.my-other-step', content: 'This is another awesome feature!' },
];

export function App() {
  const { controls, state, Tour } = useJoyride({ steps });

  return (
    <div>
      <button onClick={() => controls.start()}>Start Tour</button>
      {Tour}
      {/* your app */}
    </div>
  );
}
```

## Agent Skill

Enable AI assistants to implement guided tours with React Joyride.

The skill gives your AI assistant comprehensive knowledge of the API, step configuration, events, custom components, and common patterns.

```bash
npx skills add gilbarbara/react-joyride
```

## Migration from v2

Check the [migration guide](https://react-joyride.com/docs/migration) for detailed instructions on upgrading from v2.

## License
MIT
