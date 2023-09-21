import * as React from 'react';

interface Props {
  styles: React.CSSProperties;
}

function JoyrideSpotlight({ styles }: Props) {
  return <div key="JoyrideSpotlight" className="react-joyride__spotlight" style={styles} />;
}

export default JoyrideSpotlight;
