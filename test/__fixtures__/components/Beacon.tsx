import type { BeaconRenderProps } from '~/types';

export default function BeaconComponent(_props: BeaconRenderProps) {
  return (
    <span>
      <span className="custom-beacon__outer" />
      <span className="custom-beacon__inner" />
    </span>
  );
}
