# Step

The step is a plain object that only requires two properties to be valid: `target` and `content`.

```text
{
  target: '.my-selector',
  content: 'This is my super awesome feature!'
}
```

## Options

{% hint style="info" %} ▶︎ indicates the default value if there's one {% endhint %}

**content** `ReactNode`  
The tooltip's body.

**data** `any`  
Additional data you can add to the step.

**disableBeacon** `boolean` ▶︎ **false**  
Don't show the Beacon before the tooltip.

**event** `'click' | 'hover'` ▶︎ **click**  
The event to trigger the beacon.

**hideFooter** `boolean` ▶︎ **false**  
Hide the tooltip's footer.

**isFixed** `boolean` ▶︎ **false**  
Force the step to be fixed.

**offset** `number` ▶︎ **10**  
The distance from the target to the tooltip.

**placement** `string` ▶︎ **bottom**  
The placement of the beacon and tooltip. It will re-position itself if there's no space available.  
It can be:

- top, top-start, top-end
- bottom, bottom-start, bottom-end
- left, left-start, left-end
- right, right-start, right-end
- auto \(it will choose the best position\)
- center \(set the target to `body`\)

Check [react-floater](https://github.com/gilbarbara/react-floater) for more information.

**placementBeacon** `string` ▶︎ placement  
The beacon's placement can be top, bottom, left, or right. If nothing is passed, it will use the `placement`.

**styles** `Partial<Styles>`  
Override the [styling](styling.md) of the step's Tooltip

**target** `HTMLElement|string` - **required**  
The target for the step. It can be a [CSS selector](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors) or an HTMLElement directly \(but using refs created in the same render would require an additional render to be set\).

**title** `ReactNode`  
The tooltip's title.

## Common Props Inheritance

Step will inherit some properties from Joyride's own [props](props.md), but you can override them:

- beaconComponent
- disableCloseOnEsc
- disableOverlay
- disableOverlayClose
- disableScrolling
- floaterProps - Options passed to React Floater for positioning and styling. Step-level floaterProps are merged with component-level floaterProps, allowing per-step customization of tooltip appearance and positioning. See [styling documentation](styling.md#component-hierarchy-and-advanced-styling) for detailed examples.
- hideBackButton
- hideCloseButton
- locale
- showProgress
- showSkipButton
- spotlightClicks
- spotlightPadding
- styles
- tooltipComponent
