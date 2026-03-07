import Code from '~/components/Code';

export default function StepTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full table">
        <thead>
          <tr>
            <th>Property</th>
            <th className="min-w-32">Type</th>
            <th className="min-w-32">Default</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <p className="text-lg font-bold">beaconPlacement</p>
              <p>Override the beacon's placement separately from the tooltip.</p>
            </td>
            <td>
              <Code>Placement</Code>
            </td>
            <td>--</td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">
                content — <span className="text-red">required</span>
              </p>
              <p>The tooltip's body.</p>
            </td>
            <td>
              <Code>ReactNode</Code>
            </td>
            <td>--</td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">data</p>
              <p>
                Additional data attached to the step. Accessible via events and custom components.
              </p>
            </td>
            <td>
              <Code>any</Code>
            </td>
            <td>--</td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">id</p>
              <p>A unique identifier for the step.</p>
            </td>
            <td>
              <Code>string</Code>
            </td>
            <td>--</td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">isFixed</p>
              <p>
                Force <Code>fixed</Code> positioning. Automatically detected for fixed/sticky
                targets.
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
              <p className="text-lg font-bold">placement</p>
              <p>Tooltip and beacon placement. Repositions automatically if there's no space.</p>
            </td>
            <td>
              <Code>Placement | 'auto' | 'center'</Code>
            </td>
            <td>
              <strong>bottom</strong>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">scrollTarget</p>
              <p>
                Scroll to this element instead of the target. Spotlight and tooltip still use{' '}
                <Code>target</Code>.
              </p>
            </td>
            <td>
              <div className="flex flex-col items-start gap-1">
                <Code>string</Code>
                <Code>HTMLElement </Code>
                <Code>{'RefObject<HTMLElement | null>'}</Code>
                <Code>{'(() => HTMLElement | null)'}</Code>
              </div>
            </td>
            <td>--</td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">spotlightTarget</p>
              <p>
                Highlight this element instead of the target. Tooltip still anchors to{' '}
                <Code>target</Code>.
              </p>
            </td>
            <td>
              <div className="flex flex-col items-start gap-1">
                <Code>string</Code>
                <Code>HTMLElement </Code>
                <Code>{'RefObject<HTMLElement | null>'}</Code>
                <Code>{'(() => HTMLElement | null)'}</Code>
              </div>
            </td>
            <td>--</td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">
                target — <span className="text-red">required</span>
              </p>
              <p>
                The element the step points to. Accepts a CSS selector, HTMLElement, React ref, or a
                function that returns an element.
              </p>
            </td>
            <td>
              <div className="flex flex-col items-start gap-1">
                <Code>string</Code>
                <Code>HTMLElement </Code>
                <Code>{'RefObject<HTMLElement | null>'}</Code>
                <Code>{'(() => HTMLElement | null)'}</Code>
              </div>
            </td>
            <td>--</td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">title</p>
              <p>The tooltip's title.</p>
            </td>
            <td>
              <Code>ReactNode</Code>
            </td>
            <td>--</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
