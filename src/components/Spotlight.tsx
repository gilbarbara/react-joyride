import { CSSProperties } from 'react';

interface Props {
  styles: CSSProperties;
}

export default function JoyrideSpotlight({ styles }: Props) {
  return (
    <div
      key="JoyrideSpotlight"
      className="react-joyride__spotlight"
      data-test-id="spotlight"
      style={styles}
    />
  );
}
