import Code from '~/components/Code';

export default function HookReturnValueTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full table">
        <thead>
          <tr>
            <th>Field</th>
            <th className="min-w-32">Type</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <p className="text-lg font-bold">controls</p>
              <p>Methods to programmatically control the tour.</p>
            </td>
            <td>
              <Code>Controls</Code>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">failures</p>
              <p>
                Steps that failed during the tour (target not found, before hook errors). Clears on
                start/reset.
              </p>
            </td>
            <td>
              <Code>StepFailure[]</Code>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">on</p>
              <p>Subscribe to a specific event type. Returns an unsubscribe function.</p>
            </td>
            <td>
              <Code>{'(eventType: Events, handler: EventHandler) => () => void'}</Code>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">state</p>
              <p>The current tour state.</p>
            </td>
            <td>
              <Code>State</Code>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">step</p>
              <p>
                The current step with all defaults applied, or <Code>null</Code> if no step is
                active.
              </p>
            </td>
            <td>
              <Code>StepMerged | null</Code>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-lg font-bold">Tour</p>
              <p>The tour React element to render. Must be included in your JSX.</p>
            </td>
            <td>
              <Code>ReactElement | null</Code>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
