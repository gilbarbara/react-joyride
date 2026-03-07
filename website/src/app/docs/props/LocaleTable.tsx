'use client';

import Code from '~/components/Code';

export default function LocaleTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full table">
        <thead>
          <tr>
            <th>Key</th>
            <th className="min-w-32">Type</th>
            <th className="min-w-32">Default</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <p className="text-lg font-bold">back</p>
              <p>Back button label</p>
            </td>
            <td>
              <Code>ReactNode</Code>
            </td>
            <td>
              <strong>Back</strong>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">close</p>
              <p>Close button label</p>
            </td>
            <td>
              <Code>ReactNode</Code>
            </td>
            <td>
              <strong>Close</strong>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">last</p>
              <p>Primary button label on the last step</p>
            </td>
            <td>
              <Code>ReactNode</Code>
            </td>
            <td>
              <strong>Last</strong>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">next</p>
              <p>Next button label</p>
            </td>
            <td>
              <Code>ReactNode</Code>
            </td>
            <td>
              <strong>Next</strong>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">nextWithProgress</p>
              <p>
                Next button label when <Code>showProgress</Code> is true.
              </p>
              <p>
                Use <Code>{'{current}'}</Code> and <Code>{'{total}'}</Code> placeholders.
              </p>
            </td>
            <td>
              <Code>ReactNode</Code>
            </td>
            <td>
              <strong>{'Next ({current} of {total})'}</strong>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">open</p>
              <p>Beacon aria-label</p>
            </td>
            <td>
              <Code>ReactNode</Code>
            </td>
            <td>
              <strong>Open the dialog</strong>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">skip</p>
              <p>Skip button label</p>
            </td>
            <td>
              <Code>ReactNode</Code>
            </td>
            <td>
              <strong>Skip</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
