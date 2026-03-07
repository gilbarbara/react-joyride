import { Link } from '@heroui/react';

import Code from '~/components/Code';

export default function PropsTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full table">
        <thead>
          <tr>
            <th>Prop</th>
            <th className="min-w-32">Type</th>
            <th className="min-w-32">Default</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <p className="text-lg font-bold">continuous</p>
              <p>Play the tour sequentially with the Next button.</p>
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
              <p className="text-lg font-bold">debug</p>
              <p>Log Joyride's actions to the console.</p>
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
              <p className="text-lg font-bold">initialStepIndex</p>
              <p>
                The starting step index for uncontrolled tours. Ignored when <Code>stepIndex</Code>{' '}
                is set.
              </p>
            </td>
            <td>
              <Code>number</Code>
            </td>
            <td>
              <strong>0</strong>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">nonce</p>
              <p>A nonce value for inline styles (Content Security Policy).</p>
            </td>
            <td>
              <Code>string</Code>
            </td>
            <td>--</td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">onEvent</p>
              <p>
                A function called when Joyride fires an event. Receives{' '}
                <Code>(data, controls)</Code>.
              </p>
              <p>
                See <Link href="/docs/events">Events</Link> for details.
              </p>
            </td>
            <td>
              <Code>EventHandler</Code>
            </td>
            <td>--</td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">options</p>
              <p>
                Default <Link href="/docs/props/options">options</Link> for all steps.
              </p>
              <p>
                Can be overridden per-step by setting option fields directly on the step object.
              </p>
            </td>
            <td>
              <Code>{'Partial<Options>'}</Code>
            </td>
            <td>--</td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">portalElement</p>
              <p>Render all Joyride components inside a specific element.</p>
              <p>
                When inside a positioned container, the overlay and spotlight automatically adapt to
                the container's bounds instead of the full page.
              </p>
            </td>
            <td>
              <Code>string | HTMLElement</Code>
            </td>
            <td>
              <strong>document.body</strong>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">run</p>
              <p>Run/stop the tour.</p>
              <p>
                Equivalent to calling <Code>controls.start()</Code> / <Code>controls.stop()</Code>{' '}
                via the hook.
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
              <p className="text-lg font-bold">scrollToFirstStep</p>
              <p>Scroll the page for the first step.</p>
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
              <p className="text-lg font-bold">stepIndex</p>
              <p>
                Setting a number here will turn Joyride into <Code>controlled</Code> mode.
              </p>
              <p>
                You'll have to keep an internal state and update it with the events in{' '}
                <Code>onEvent</Code>.
              </p>
            </td>
            <td>
              <Code>number</Code>
            </td>
            <td>--</td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">
                steps — <span className="text-red">required</span>
              </p>
              <p>
                The tour's steps. Check the <Link href="/docs/step">step</Link> docs for more
                information.
              </p>
            </td>
            <td>
              <Code>{'Array<Step>'}</Code>
            </td>
            <td>--</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
