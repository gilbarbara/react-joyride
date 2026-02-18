import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMount } from '@gilbarbara/hooks';
import { Button, Spinner } from '@heroui/react';

import { useAppContext } from '../context';

export default function RouteB() {
  const [showLoader, setLoader] = useState(true);
  const {
    setState,
    state: { tourActive },
  } = useAppContext();

  useMount(() => {
    if (tourActive) {
      setTimeout(() => {
        setLoader(false);
        setState({ run: true, stepIndex: 2 });
      }, 600);
    }
  });

  return (
    <div>
      <h2 className="text-center text-3xl font-bold text-secondary">
        <span id="routeB">Route B</span>
      </h2>
      <div className="flex items-center justify-center h-20">
        {showLoader && <Spinner color="secondary" size="lg" />}
      </div>
      <div className="flex items-center justify-center">
        <Link to="/multi-route">
          <Button color="default">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
