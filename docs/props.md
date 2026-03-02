# Props

The only required prop is `steps` with an array of [steps](step.md).  
Below is the complete list of possible props and options:

{% hint style="info" %} ▶︎ indicates the default value if there's one. You can check the definition of the type for the props <a href="https://github.com/gilbarbara/react-joyride/blob/main/src/types/components.ts" target="_blank">here</a>.{% endhint %}

**beaconComponent** `ElementType<BeaconRenderProps>`  
A React component to use instead of the default Beacon. Check [custom components](custom-components.md) for details.

**callback** `() => CallBackProps`  
A function to be called when Joyride's state changes. It returns a single parameter with the state.

**continuous** `boolean` ▶︎ **false**  
The tour is played sequentially with the **Next** button.

**debug** `boolean` ▶︎ **false**  
Log Joyride's actions to the console.

**disableCloseOnEsc** `boolean` ▶︎ **false**  
Disable closing the tooltip on ESC.

**disableOverlay** `boolean` ▶︎ **false**  
Don't show the overlay.

**disableOverlayClose** `boolean` ▶︎ **false**  
Don't close the tooltip when clicking the overlay.

**disableScrolling** `boolean` ▶︎ **false**  
Disable autoscrolling between steps.

**floatingOptions** `Partial<FloatingOptions>`
Options to control tooltip positioning via [@floating-ui/react-dom](https://floating-ui.com/).

- **autoUpdate** `Partial<AutoUpdateOptions>` — Options passed to [autoUpdate](https://floating-ui.com/docs/autoUpdate) (ancestorScroll, elementResize, animationFrame, etc).
- **beaconOptions** `{ offset?: number }` — Beacon positioning config. Default offset is `-18`.
- **hideArrow** `boolean` — Hide the tooltip arrow. Centered placement already hides the arrow. Default: `false`.
- **middleware** `Array<Middleware>` — Additional [Floating UI middleware](https://floating-ui.com/docs/middleware) appended to the defaults (offset, flip/autoPlacement, shift, arrow).
- **onPosition** `(data: PositionData) => void` — Called after each position calculation.
- **strategy** `'absolute' | 'fixed'` — Positioning strategy. Defaults to `'fixed'` when `step.isFixed` is true, `'absolute'` otherwise.

```tsx
import { size } from '@floating-ui/react-dom';

floatingOptions={{
  strategy: 'fixed',
  middleware: [
    size({ padding: 10 }),
  ],
  beaconOptions: {
    offset: -10,
  },
}}
```

See the [styling documentation](styling.md#advanced-positioning) for more examples.

**hideBackButton** `boolean` ▶︎ **false**  
Hide the **Back** button.

**hideCloseButton** `boolean` ▶︎ **false**  
Hide the **Close** button.

**locale** `Locale` ▶︎ **{ back: 'Back', close: 'Close', last: 'Last', next: 'Next', nextLabelWithProgress: 'Next (Step {step} of {steps})', open: 'Open the dialog', skip: 'Skip' }**  
The strings used in the tooltip.

**nonce** `string`  
A nonce value for inline styles (Content Security Policy - CSP)

**run** `boolean` ▶︎ **true**  
Run/stop the tour.

**scrollDuration** `number` ▶︎ **300**  
The duration for scroll to element.

**scrollOffset** `number` ▶︎ **20**  
The scroll distance from the element scrollTop value.

**scrollToFirstStep** `boolean` ▶︎ **false**  
Scroll the page for the first step.

**showProgress** `boolean` ▶︎ **false**  
Display the tour progress in the next button, `2/5`, in `continuous` tours.

**showSkipButton** `boolean` ▶︎ **false**  
Display a button to skip the tour.

**spotlightClicks** `boolean` ▶︎ **false**  
Allow mouse and touch events through the spotlight. You can click links in your app.

**spotlightPadding** `number` ▶︎ **10**  
The padding of the spotlight.

**stepIndex** `number`  
Setting a number here will turn Joyride into `controlled` mode.

You'll have to keep an internal state and update it with the events in the `callback`.

> **Do not use it if you don't need it.**

**steps** `Array<Step>` - **required**  
The tour's steps.  
Check the [step](step.md) docs for more information.

**styles** `Partial<Styles>`  
Override the [styling](styling.md) of the Tooltip

**tooltipComponent** `ElementType<TooltipRenderProps>`  
A React component to use instead of the default Tooltip. Check [custom components](custom-components.md) for details.
