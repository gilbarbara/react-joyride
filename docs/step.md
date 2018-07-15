# Step

The step is an plain object that only requires two properties to be valid: `target` and `content` \(or `tooltipComponent`\).

```text
{
  target: '.my-selector',
  content: 'This is my super awesome feature!'
}
```

It will inherit some properties from the Joyride's own [props](props.md) that can be overridden per step:

* beaconComponent
* disableCloseOnEsc
* disableOverlay
* disableOverlayClose
* disableScrolling
* floaterProps (check the [getMergedStep](../src/modules/step.js) function for more information)
* hideBackButton
* locale
* showProgress
* showSkipButton
* spotlightClicks
* spotlightPadding
* styles
* tooltipComponent

## And you can use these

**content** {React.Node\|string}  
The tooltip's body.

**disableBeacon** {boolean} ▶︎ `false`  
Don't show the Beacon before the tooltip.

**event** {string} ▶︎ `click`  
The event to trigger the beacon. It can be _**click**_ or _**hover**_

**isFixed** {boolean} ▶︎ `false`  
Force the step to be fixed.

**offset** {React.Node\|string} ▶︎ `10`  
The distance from the target to the tooltip.

**placement** {string} ▶︎ `bottom`  
The placement of the beacon and tooltip. It will re-position itself if there's no space available.  
It can be:

* top \(top-start, top-end\)
* bottom \(bottom-start, bottom-end\)
* left \(left-start, left-end\)
* right \(right-start, right-end
* auto
* center

Check [react-floater](https://github.com/gilbarbara/react-floater) for more information.

**placementBeacon** {string} ▶︎ placement  
The placement of the beacon. It will use the placement if nothing is passed and it can be: `top, bottom, left, right`.

**styles** {Object}  
Override the [styling](styling.md) of the step's Tooltip

**target** {Element\|string} - **required**  
The target for the step. It can be a [CSS selector](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors) or an HtmlElement directly \(but using refs created in the same render would required an additional render afterwards\).

**title** {React.Node\|string}  
The tooltip's title.

