import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

import CombinedSteps from './CombinedSteps';
import Controlled from './Controlled';
import CustomOptions from './CustomOptions';
import Scroll from './Scroll';
import Standard from './Standard';

const tours = {
  combined: CombinedSteps,
  controlled: Controlled,
  custom: CustomOptions,
  scroll: Scroll,
  standard: Standard,
} as const;

// eslint-disable-next-line react-refresh/only-export-components
function App() {
  const [route, setRoute] = useState(() => window.location.hash.slice(1));

  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash.slice(1));

    window.addEventListener('hashchange', onHashChange);

    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const Tour = tours[route as keyof typeof tours];

  if (Tour) {
    return <Tour finishedCallback={() => console.log('done')} />;
  }

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', padding: 20, minHeight: '100vh' }}>
      <h1>React Joyride Tours</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {Object.keys(tours).map(name => (
          <li key={name}>
            <a href={`#${name}`} style={{ color: '#fff' }}>
              {name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
