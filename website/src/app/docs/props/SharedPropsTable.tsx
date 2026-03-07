'use client';

import { Link } from '@heroui/react';

import Code from '~/components/Code';

export default function SharedPropsTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full table">
        <thead>
          <tr>
            <th>Prop</th>
            <th className="min-w-32">Type</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <p className="text-lg font-bold">arrowComponent</p>
              <p>
                Custom <Link href="./custom-components#arrowcomponent">arrow</Link> component.
              </p>
            </td>
            <td>
              <Code>{'ElementType<ArrowRenderProps>'}</Code>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">beaconComponent</p>
              <p>
                Custom <Link href="./custom-components#beaconcomponent">beacon</Link> component.
              </p>
            </td>
            <td>
              <Code>{'ElementType<BeaconRenderProps>'}</Code>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">
                <Link href="./props/floating-options">floatingOptions</Link>
              </p>
              <p>
                Tooltip/beacon positioning config via{' '}
                <Link href="https://floating-ui.com/" isExternal>
                  Floating UI
                </Link>
                .
              </p>
            </td>
            <td>
              <Code>{'Partial<FloatingOptions>'}</Code>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">loaderComponent</p>
              <p>
                Custom <Link href="./custom-components#loadercomponent">loader</Link> component. Set
                to <Code>null</Code> to disable.
              </p>
            </td>
            <td>
              <Code>{'ElementType<LoaderRenderProps> | null'}</Code>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">
                <a href="#locale">locale</a>
              </p>
              <p>Tooltip strings (button labels, aria-labels).</p>
            </td>
            <td>
              <Code>Locale</Code>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">styles</p>
              <p>
                <Link href="./props/styles">Style overrides</Link> for tooltip and other elements.
              </p>
            </td>
            <td>
              <Code>{'PartialDeep<Styles>'}</Code>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">tooltipComponent</p>
              <p>
                Custom <Link href="./custom-components#tooltipcomponent">tooltip</Link> component.
              </p>
            </td>
            <td>
              <Code>{'ElementType<TooltipRenderProps>'}</Code>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
