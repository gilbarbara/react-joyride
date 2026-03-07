import { Link } from '@heroui/react';

import Code from '~/components/Code';

export default function FloatingOptionsTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full table">
        <thead>
          <tr>
            <th>Field</th>
            <th className="min-w-32">Type</th>
            <th className="min-w-32">Default</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <p className="text-lg font-bold">autoUpdate</p>
              <p>
                Options passed to{' '}
                <Link href="https://floating-ui.com/docs/autoUpdate" isExternal>
                  autoUpdate
                </Link>{' '}
                (ancestorScroll, elementResize, etc).
              </p>
            </td>
            <td>
              <Code>{'Partial<AutoUpdateOptions>'}</Code>
            </td>
            <td>--</td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">beaconOptions</p>
              <p>Beacon positioning config.</p>
            </td>
            <td>
              <Code>{'{offset?: number}'}</Code>
            </td>
            <td>
              <strong>{'{offset: -18}'}</strong>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">flipOptions</p>
              <p>
                Options for{' '}
                <Link href="https://floating-ui.com/docs/flip" isExternal>
                  flip
                </Link>{' '}
                middleware. <Code>false</Code> to disable.
              </p>
            </td>
            <td>
              <Code>{'Partial<FlipOptions> | false'}</Code>
            </td>
            <td>--</td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">hideArrow</p>
              <p>Hide the tooltip arrow. Center placement already hides it.</p>
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
              <p className="text-lg font-bold">middleware</p>
              <p>
                Additional{' '}
                <Link href="https://floating-ui.com/docs/middleware" isExternal>
                  middleware
                </Link>{' '}
                appended to defaults (offset, flip/autoPlacement, shift, arrow).
              </p>
            </td>
            <td>
              <Code>{'Array<Middleware>'}</Code>
            </td>
            <td>--</td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">onPosition</p>
              <p>Called after each position calculation.</p>
            </td>
            <td>
              <Code>{'(data: PositionData) => void'}</Code>
            </td>
            <td>--</td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">shiftOptions</p>
              <p>
                Options for{' '}
                <Link href="https://floating-ui.com/docs/shift" isExternal>
                  shift
                </Link>{' '}
                middleware.
              </p>
            </td>
            <td>
              <Code>{'Partial<ShiftOptions>'}</Code>
            </td>
            <td>--</td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">strategy</p>
              <p>
                Positioning strategy. Defaults to <Code>fixed</Code> when <Code>step.isFixed</Code>{' '}
                is true.
              </p>
            </td>
            <td>
              <Code>'absolute' | 'fixed'</Code>
            </td>
            <td>
              <strong>absolute</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
