import { useState } from 'react';
import { useMount } from '@gilbarbara/hooks';
import { Button, Spinner } from '@heroui/react';

import { useAppContext } from '../context';

export default function Home() {
  const [showLoader, setLoader] = useState(false);
  const {
    setState,
    state: { run, tourActive },
  } = useAppContext();

  useMount(() => {
    if (tourActive) {
      setLoader(true);

      setTimeout(() => {
        setLoader(false);
        setState({ run: true, stepIndex: 0 });
      }, 600);
    }
  });

  const handleClickStart = () => {
    setState({ run: true, tourActive: true });
  };

  return (
    <div>
      <h2 className="text-center text-3xl font-bold text-secondary">
        <span id="home">Home</span>
      </h2>
      <div className="flex items-center justify-center h-20">
        {showLoader && <Spinner color="secondary" size="lg" />}
      </div>
      {!run && (
        <div className="flex items-center justify-center">
          <Button className="font-bold" color="secondary" onPress={handleClickStart}>
            Start the tour
          </Button>
        </div>
      )}
    </div>
  );
}
