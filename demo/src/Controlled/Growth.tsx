import { forwardRef } from 'react';

import ContentBox from '../components/ContentBox';

const Growth = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div ref={ref} className="flex flex-col bg-purple p-4 text-center">
      <h2 className="text-2xl font-bold mb-2">Growth</h2>
      <ContentBox>
        <svg
          height="184px"
          style={{ height: 'auto', maxWidth: 340 }}
          version="1.1"
          viewBox="0 0 320 184"
          width="100%"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g>
            <polygon
              fill="#FFFFFF"
              fillOpacity="0.5"
              points="0 164.487713 106.666667 125.784722 160 116.108974 213.333333 96.7574785 320 1.42108547e-14 320 183.839209 213.333333 183.839209 160 183.839209 106.666667 183.839209 0 183.839209"
            />
          </g>
        </svg>
      </ContentBox>
    </div>
  );
});

export default Growth;
