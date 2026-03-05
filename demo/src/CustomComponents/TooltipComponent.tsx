import { FormattedMessage } from 'react-intl';
import type { TooltipRenderProps } from 'react-joyride';

export default function Tooltip(props: TooltipRenderProps) {
  const { backProps, continuous, index, isLastStep, primaryProps, skipProps, step, tooltipProps } =
    props;

  return (
    <div
      {...tooltipProps}
      className="relative bg-white w-xs overflow-hidden rounded-md"
      data-testid="tooltip"
    >
      <div className="p-4">
        {step.title && <h3 className="text-xl font-bold text-primary mb-4">{step.title}</h3>}
        {step.content && <div>{step.content}</div>}
      </div>
      <div className="bg-blue-100">
        <div className="flex justify-between p-2">
          {step.showSkipButton && !isLastStep && (
            <button
              {...skipProps}
              className="px-3 py-1 text-sm rounded hover:bg-blue-200"
              type="button"
            >
              <FormattedMessage id="skip" />
            </button>
          )}
          <div className="flex gap-2">
            {index > 0 && (
              <button
                {...backProps}
                className="px-3 py-1 text-sm rounded hover:bg-blue-200"
                type="button"
              >
                <FormattedMessage id="back" />
              </button>
            )}
            <button
              {...primaryProps}
              className="px-3 py-1 text-sm rounded bg-primary text-white hover:opacity-90"
              type="button"
            >
              <FormattedMessage id={continuous ? 'next' : 'close'} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
