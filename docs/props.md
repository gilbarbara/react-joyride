# Props

The only required prop is `steps` with an array of [steps](step.md).  
Below is the complete list of possible props and options:

{% hint style="info" %}
▶︎ indicates the default value if there's one
{% endhint %}

**beaconComponent** {ReactNode}  
A React component or function to be used instead the default Beacon. Check [custom components](custom-components.md) for details.

**callback** {\(\) =&gt; CallbackProps\)}  
It will be called when Joyride's state changes. it returns a single parameter with the state.

**continuous** {boolean} ▶︎ `false`  
The tour is played sequentially with the **Next** button.

**debug** {boolean} ▶︎ `false`  
Log Joyride's actions to the console.

**disableCloseOnEsc** {boolean} ▶︎ `false`  
Disable closing the tooltip on ESC.

**disableOverlay** {boolean} ▶︎ `false`  
Don't show the overlay.

**disableOverlayClose** {boolean} ▶︎ `false`  
Don't close the tooltip when clicking the overlay.

**disableScrolling** {boolean} ▶︎ `false`  
Disable auto scrolling between steps.

**disableScrollParentFix** {boolean} ▶︎ `false`  
Disable the fix to handle "unused" overflow parents

**floaterProps** {object}  
Options to be passed to [react-floater](https://github.com/gilbarbara/react-floater).

**getHelpers** {\(\) =&gt; StoreHelpers\)} Get the store methods to control the tour programatically. `prev, next, go, close, skip, reset, info`

**hideBackButton** {boolean} ▶︎ `false`  
Hide the "back" button.

**hideCloseButton** {boolean} ▶︎ `false`  
Hide the "close" button.

**locale** {object} ▶︎ `{ back: 'Back', close: 'Close', last: 'Last', next: 'Next', skip: 'Skip' }`  
The strings used in the tooltip.

**run** {boolean} ▶︎ `true`  
Run/stop the tour.

**scrollOffset** {number} ▶︎ `20`  
The scroll distance from the element scrollTop value.

**scrollDuration** {number} ▶︎ `300`  
The duration for scroll to element.

**scrollToFirstStep** {boolean} ▶︎ `false`  
Scroll the page for the first step.

**showProgress** {boolean} ▶︎ `false`  
Display the tour progress in the next button \_e.g. 2/5 \_in `continuous` tours.

**showSkipButton** {boolean} ▶︎ `false`  
Display a button to skip the tour.

**spotlightClicks** {boolean} ▶︎ `false`  
Allow mouse and touch events thru the spotlight. You can click links in your app.

**spotlightPadding** {number} ▶︎ `10`  
The padding of the spotlight.

**stepIndex** {number}  
Setting a number here will turn Joyride into `controlled` mode.

You'll have to keep an internal state by yourself and update it with the events in the `callback`.

> **Do not use this if you don't need it.**

**steps** {Array&lt;Step&gt;} - **required**  
The tour's steps.  
Check the [step](step.md) docs for more information.

**styles** {object}  
Override the [styling](styling.md) of the Tooltip globally

**tooltipComponent** {React.Node}  
A React component or function to be used instead the default Tooltip excluding the arrow.  
Check [custom components](custom-components.md) for details.
