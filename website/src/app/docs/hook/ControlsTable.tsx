import Code from '~/components/Code';

export default function ControlsTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full table">
        <thead>
          <tr>
            <th>Method</th>
            <th className="min-w-32">Type</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <p className="text-lg font-bold">start</p>
              <p>Start the tour. Optionally pass a step index to start from.</p>
              <p>
                Equivalent to setting <Code>run={'{true}'}</Code>.
              </p>
            </td>
            <td>
              <Code>{'(nextIndex?: number) => void'}</Code>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">stop</p>
              <p>
                Stop (pause) the tour. If <Code>advance</Code> is true, the index advances before
                stopping.
              </p>
              <p>
                Equivalent to setting <Code>run={'{false}'}</Code>.
              </p>
            </td>
            <td>
              <Code>{'(advance?: boolean) => void'}</Code>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">next</p>
              <p>Advance to the next step. Only works when the tour is running.</p>
            </td>
            <td>
              <Code>{'() => void'}</Code>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">prev</p>
              <p>Go back to the previous step. Only works when the tour is running.</p>
            </td>
            <td>
              <Code>{'() => void'}</Code>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">go</p>
              <p>Jump to a specific step by index. Only works in uncontrolled mode.</p>
            </td>
            <td>
              <Code>{'(nextIndex: number) => void'}</Code>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">close</p>
              <p>Close the current step and advance to the next one.</p>
            </td>
            <td>
              <Code>{'(origin?: Origin | null) => void'}</Code>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">skip</p>
              <p>Skip the tour entirely.</p>
            </td>
            <td>
              <Code>{"(origin?: 'button_close' | 'button_skip' | null) => void"}</Code>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">open</p>
              <p>Open the tooltip for the current step (skip the beacon).</p>
            </td>
            <td>
              <Code>{'() => void'}</Code>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">reset</p>
              <p>
                Reset the tour to step 0. If <Code>restart</Code> is true, the tour starts again
                immediately. Only works in uncontrolled mode.
              </p>
            </td>
            <td>
              <Code>{'(restart?: boolean) => void'}</Code>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">info</p>
              <p>Get a snapshot of the current tour state.</p>
            </td>
            <td>
              <Code>{'() => State'}</Code>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
