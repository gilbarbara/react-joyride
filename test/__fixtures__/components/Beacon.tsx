import { forwardRef } from 'react';

import type { BeaconRenderProps } from '~/types';

const BeaconComponent = forwardRef<HTMLButtonElement, BeaconRenderProps>((_, ref) => {
  return (
    <button
      ref={ref}
      aria-label="Beacon"
      className="react-joyride__beacon"
      data-testid="button-beacon"
      type="button"
    >
      <span className="react-joyride__beacon__outer" />
      <span className="react-joyride__beacon__inner" />
    </button>
  );
});

export default BeaconComponent;
