import Code from '~/components/Code';

function OptionsHeader() {
  return (
    <thead>
      <tr>
        <th>Option</th>
        <th className="min-w-32">Type</th>
        <th className="min-w-32">Default</th>
      </tr>
    </thead>
  );
}

export function AppearanceTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full table">
        <OptionsHeader />
        <tbody>
          <tr>
            <td>
              <p className="text-lg font-bold">backgroundColor</p>
              <p>Tooltip background color.</p>
            </td>
            <td>
              <Code>string</Code>
            </td>
            <td>
              <strong>#ffffff</strong>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">buttons</p>
              <p>Buttons to show in the tooltip.</p>
              <p>An empty array hides all buttons (footer and close).</p>
            </td>
            <td>
              <Code>ButtonType[]</Code>
            </td>
            <td>
              <strong>["back", "close", "primary"]</strong>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">offset</p>
              <p>Distance in pixels between the tooltip and the target.</p>
            </td>
            <td>
              <Code>number</Code>
            </td>
            <td>
              <strong>10</strong>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">primaryColor</p>
              <p>Primary button and beacon color.</p>
            </td>
            <td>
              <Code>string</Code>
            </td>
            <td>
              <strong>#000000</strong>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">showProgress</p>
              <p>
                Show progress in the next button (e.g., <Code>2 of 5</Code>) in{' '}
                <Code>continuous</Code> tours.
              </p>
            </td>
            <td>
              <Code>boolean</Code>
            </td>
            <td>
              <strong>false</strong>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">textColor</p>
              <p>Tooltip text color.</p>
            </td>
            <td>
              <Code>string</Code>
            </td>
            <td>
              <strong>#000000</strong>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">width</p>
              <p>Tooltip width in pixels or CSS string.</p>
            </td>
            <td>
              <Code>string | number</Code>
            </td>
            <td>
              <strong>380</strong>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">zIndex</p>
              <p>z-index for the overlay and tooltip.</p>
            </td>
            <td>
              <Code>number</Code>
            </td>
            <td>
              <strong>100</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function ArrowTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full table">
        <OptionsHeader />
        <tbody>
          <tr>
            <td>
              <p className="text-lg font-bold">arrowBase</p>
              <p>Width of the arrow base edge in pixels.</p>
            </td>
            <td>
              <Code>number</Code>
            </td>
            <td>
              <strong>32</strong>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">arrowColor</p>
              <p>Arrow fill color.</p>
            </td>
            <td>
              <Code>string</Code>
            </td>
            <td>
              <strong>#ffffff</strong>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">arrowSize</p>
              <p>Height/depth of the arrow (tip to base) in pixels.</p>
            </td>
            <td>
              <Code>number</Code>
            </td>
            <td>
              <strong>16</strong>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">arrowSpacing</p>
              <p>Distance between the arrow and the tooltip edge.</p>
            </td>
            <td>
              <Code>number</Code>
            </td>
            <td>
              <strong>12</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function BeaconTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full table">
        <OptionsHeader />
        <tbody>
          <tr>
            <td>
              <p className="text-lg font-bold">beaconSize</p>
              <p>Beacon diameter in pixels.</p>
            </td>
            <td>
              <Code>number</Code>
            </td>
            <td>
              <strong>36</strong>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">beaconTrigger</p>
              <p>
                Interaction that opens the tooltip. <Code>'hover'</Code> opens on mouseenter.
              </p>
            </td>
            <td>
              <Code>'click' | 'hover'</Code>
            </td>
            <td>
              <strong>click</strong>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">skipBeacon</p>
              <p>Don't show the Beacon before the tooltip.</p>
            </td>
            <td>
              <Code>boolean</Code>
            </td>
            <td>
              <strong>false</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function InteractionsTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full table">
        <OptionsHeader />
        <tbody>
          <tr>
            <td>
              <p className="text-lg font-bold">blockTargetInteraction</p>
              <p>Block pointer events on the highlighted element.</p>
            </td>
            <td>
              <Code>boolean</Code>
            </td>
            <td>
              <strong>false</strong>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">closeButtonAction</p>
              <p>Action when the close button is clicked.</p>
              <p>
                <Code>'close'</Code> advances to the next step, <Code>'skip'</Code> ends the tour.
              </p>
            </td>
            <td>
              <Code>'close' | 'skip'</Code>
            </td>
            <td>
              <strong>close</strong>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">disableFocusTrap</p>
              <p>Disable the focus trap for the tooltip.</p>
            </td>
            <td>
              <Code>boolean</Code>
            </td>
            <td>
              <strong>false</strong>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">dismissKeyAction</p>
              <p>Action when the ESC key is pressed.</p>
              <p>
                <Code>'close'</Code> closes the step, <Code>'next'</Code> advances,{' '}
                <Code>false</Code> disables.
              </p>
            </td>
            <td>
              <Code>'close' | 'next' | false</Code>
            </td>
            <td>
              <strong>close</strong>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">overlayClickAction</p>
              <p>Action when the overlay is clicked.</p>
              <p>
                <Code>'close'</Code> closes the step, <Code>'next'</Code> advances,{' '}
                <Code>false</Code> disables.
              </p>
            </td>
            <td>
              <Code>'close' | 'next' | false</Code>
            </td>
            <td>
              <strong>close</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function OverlayTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full table">
        <OptionsHeader />
        <tbody>
          <tr>
            <td>
              <p className="text-lg font-bold">hideOverlay</p>
              <p>Don't show the overlay.</p>
            </td>
            <td>
              <Code>boolean</Code>
            </td>
            <td>
              <strong>false</strong>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">overlayColor</p>
              <p>Overlay backdrop color.</p>
            </td>
            <td>
              <Code>string</Code>
            </td>
            <td>
              <strong>#00000080</strong>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">spotlightPadding</p>
              <p>Spotlight padding around the target.</p>
              <p>
                Accepts a number for all sides, or a <Code>{'{ top, right, bottom, left }'}</Code>{' '}
                object.
              </p>
            </td>
            <td>
              <Code>number | SpotlightPadding</Code>
            </td>
            <td>
              <strong>10</strong>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">spotlightRadius</p>
              <p>Border radius of the spotlight cutout in pixels.</p>
            </td>
            <td>
              <Code>number</Code>
            </td>
            <td>
              <strong>4</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function ScrollingTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full table">
        <OptionsHeader />
        <tbody>
          <tr>
            <td>
              <p className="text-lg font-bold">scrollDuration</p>
              <p>Scroll animation duration in milliseconds.</p>
            </td>
            <td>
              <Code>number</Code>
            </td>
            <td>
              <strong>300</strong>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">scrollOffset</p>
              <p>Scroll distance from the element scrollTop value.</p>
            </td>
            <td>
              <Code>number</Code>
            </td>
            <td>
              <strong>20</strong>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">skipScroll</p>
              <p>Disable scrolling to the target.</p>
            </td>
            <td>
              <Code>boolean</Code>
            </td>
            <td>
              <strong>false</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function TimingTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full table">
        <OptionsHeader />
        <tbody>
          <tr>
            <td>
              <p className="text-lg font-bold">before</p>
              <p>Async hook that runs before the step.</p>
              <p>
                The tour waits for the promise to resolve and shows the loader (after{' '}
                <Code>loaderDelay</Code>). Capped by <Code>beforeTimeout</Code>.
              </p>
            </td>
            <td>
              <Code>{'(data: TourData) => Promise<void>'}</Code>
            </td>
            <td>--</td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">after</p>
              <p>Hook that runs after the step completes.</p>
              <p>Fire-and-forget — does not block the tour.</p>
            </td>
            <td>
              <Code>{'(data: TourData) => void'}</Code>
            </td>
            <td>--</td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">beforeTimeout</p>
              <p>
                Max wait time (ms) for a <Code>before</Code> hook to resolve. <Code>0</Code>{' '}
                disables the timeout.
              </p>
            </td>
            <td>
              <Code>number</Code>
            </td>
            <td>
              <strong>5000</strong>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">loaderDelay</p>
              <p>Delay (ms) before showing the loader while the tour is waiting.</p>
            </td>
            <td>
              <Code>number</Code>
            </td>
            <td>
              <strong>300</strong>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">targetWaitTimeout</p>
              <p>
                Max wait time (ms) for the target element to appear. <Code>0</Code> disables
                waiting.
              </p>
            </td>
            <td>
              <Code>number</Code>
            </td>
            <td>
              <strong>1000</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
