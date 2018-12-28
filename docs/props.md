# Props

**beaconComponent** {ReactNode}  
A React component or function to be used instead the default Beacon. Check [Customization](customization.md) for details.

**callback** {function}  
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

**floaterProps** {object}  
Options to be passed to [react-floater](https://github.com/gilbarbara/react-floater).

**getHelpers** {function}
Get the store methods to control the tour programatically.
`prev, next, go, close, skip, reset, info`

**hideBackButton** {boolean} ▶︎ `false`  
Hide the "back" button.

**locale** {object} ▶︎ `{ back: 'Back', close: 'Close', last: 'Last', next: 'Next', skip: 'Skip' }`  
The strings used in the tooltip.

**run** {boolean} ▶︎ `true`  
Run/stop the tour.

**scrollOffset** {number} ▶︎ `20`  
The scroll distance from the element scrollTop value.

**scrollToFirstStep** {boolean} ▶︎ `false`  
Scroll the page for the first step.

**showProgress** {boolean} ▶︎ `false`  
Display the tour progress in the next button \_e.g. 2/5 \_in `continuous` tours.

**showSkipButton** {boolean} ▶︎ `false`  
Display a button to skip the tour.

**spotlightClicks** {number} ▶︎ `false`  
Allow mouse and touch events thru the spotlight. You can click links in your app.

**spotlightPadding** {boolean} ▶︎ `10`  
The padding of the spotlight.

**stepIndex** {number}  
Setting a number here will turn Joyride into `controlled` mode.  
You will receive the state events in the `callback` and you'll have to update this prop by yourself.

**steps** {Array&lt;StepProps&gt;} - **required**  
The tour's steps.

**styles** {object}  
Override the [styling](styling.md) of the Tooltip globally

**tooltipComponent** {React.Node}  
A React component or function to be used instead the default Tooltip excluding the arrow. Check [Customization](customization.md) for details.


