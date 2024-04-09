# Props

The only required prop is `steps` with an array of [steps](step.md).  
Below is the complete list of possible props and options:

{% hint style="info" %} ▶︎ indicates the default value if there's one. You can check the definition of the type for the props [here](https://github.com/gilbarbara/react-joyride/blob/main/src/types/components.ts) {% endhint %}

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

**disableScrollParentFix** `boolean` ▶︎ **false**  
Disable the fix to handle "unused" overflow parents.

**floaterProps** `Partial<FloaterProps>`  
Options to be passed to [react-floater](https://github.com/gilbarbara/react-floater).

**getHelpers** `() => StoreHelpers`  
Get the store methods to control the tour programmatically. `prev, next, go, close, skip, reset, info`.

**hideBackButton** `boolean` ▶︎ **false**  
Hide the **Back** button.

**hideCloseButton** `boolean` ▶︎ **false**  
Hide the **Close** button.

**locale** `Locale` ▶︎ **{ back: 'Back', close: 'Close', last: 'Last', next: 'Next', open: 'Open the dialog', skip: 'Skip' }**  
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

> **Do not use this if you don't need it.**

**steps** `Array<Step>` - **required**  
The tour's steps.  
Check the [step](step.md) docs for more information.

**styles** `Partial<Styles>`  
Override the [styling](styling.md) of the Tooltip

**tooltipComponent** `ElementType<TooltipRenderProps>`  
A React component to use instead of the default Tooltip. Check [custom components](custom-components.md) for details.
