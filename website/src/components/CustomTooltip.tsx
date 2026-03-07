import { FormattedMessage } from 'react-intl';
import type { TooltipRenderProps } from 'react-joyride';

export default function CustomTooltip(props: TooltipRenderProps) {
  const {
    backProps,
    continuous,
    index,
    isLastStep,
    primaryProps,
    size,
    skipProps,
    step,
    tooltipProps,
  } = props;

  return (
    <div
      {...tooltipProps}
      className="relative bg-white dark:bg-black max-w-sm overflow-hidden rounded-md"
      data-testid="tooltip"
      style={{ width: step.width }}
    >
      <div className="p-4">
        {step.title && <p className="text-xl font-bold text-primary mb-3">{step.title}</p>}
        {step.content && <div className="dark:text-gray-200">{step.content}</div>}
      </div>
      <div className="bg-blue-100 dark:bg-gray-800 relative">
        <div className="w-full h-1 absolute -top-1">
          <div className="h-full bg-primary" style={{ width: `${((index + 1) / size) * 100}%` }} />
        </div>
        <div className="flex justify-between p-2">
          {step.buttons.includes('skip') && !isLastStep && (
            <button
              {...skipProps}
              className="px-3 py-1 text-sm rounded hover:bg-blue-200 dark:hover:bg-gray-600 dark:text-gray-200"
              type="button"
            >
              <FormattedMessage id="skip" />
            </button>
          )}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {Array.from({ length: size }, (_, index_) => index_).map(d => (
              <span
                key={d}
                className={`size-2 shrink-0 rounded-full ${index === d ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-500'}`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            {index > 0 && (
              <button
                {...backProps}
                className="px-3 py-1 text-sm rounded hover:bg-blue-200 dark:hover:bg-gray-600 dark:text-gray-200"
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
