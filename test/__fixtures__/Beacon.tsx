import { forwardRef } from 'react';

import { BeaconRenderProps } from '~/types';

const BeaconComponent = forwardRef<HTMLButtonElement, BeaconRenderProps>((_, ref) => {
  return (
    <button
      ref={ref}
      aria-label="Beacon"
      className="react-joyride__beacon"
      data-test-id="button-beacon"
      type="button"
    >
      <span className="react-joyride__beacon__inner" />
    </button>
  );
});

export default BeaconComponent;
