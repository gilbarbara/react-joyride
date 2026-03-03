import { useEffect, useRef, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Basic from './Basic';
import Carousel from './Carousel';
import CodeSandboxEdit from './components/CodeSandboxEdit';
import ErrorFallback from './components/ErrorFallback';
import GitHubRepo from './components/GitHubRepo';
import Header from './components/Header';
import Controlled from './Controlled';
import CustomComponents from './CustomComponents';
import Modal from './Modal';
import { getScreenSize } from './modules/helpers';
import MultiRoute from './MultiRoute';
import MultiRouteHome from './MultiRoute/routes/Home';
import MultiRouteA from './MultiRoute/routes/RouteA';
import MultiRouteB from './MultiRoute/routes/RouteB';
import NotFound from './NotFound';
import Scroll from './Scroll';

const { NODE_ENV } = process.env;

function App() {
  const [breakpoint, setBreakpoint] = useState(getScreenSize());
  const debounceTimeout = useRef(0);

  const handleResize = useRef(() => {
    clearTimeout(debounceTimeout.current);

    debounceTimeout.current = window.setTimeout(() => {
      setBreakpoint(getScreenSize());
    }, 250);
  });

  useEffect(() => {
    const { current } = handleResize;

    window.addEventListener('resize', current);

    return () => {
      window.removeEventListener('resize', current);
    };
  });

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <BrowserRouter>
        <Header />
        <main className="flex flex-col min-h-dvh pt-16" role="main">
          <Routes>
            <Route element={<Basic breakpoint={breakpoint} />} path="/" />
            <Route element={<Controlled />} path="/controlled" />
            <Route element={<CustomComponents />} path="/custom" />
            <Route element={<Carousel />} path="/carousel" />
            <Route element={<Modal />} path="/modal" />
            <Route element={<MultiRoute />} path="/multi-route">
              <Route element={<MultiRouteHome />} index />
              <Route element={<MultiRouteA />} path="a" />
              <Route element={<MultiRouteB />} path="b" />
            </Route>
            <Route element={<Scroll />} path="/scroll" />
            <Route element={<NotFound />} path="*" />
          </Routes>
        </main>
        {NODE_ENV === 'production' && <CodeSandboxEdit />}
        {NODE_ENV === 'production' && <GitHubRepo />}
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
