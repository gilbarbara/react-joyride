React Joyride
===

<a href="https://www.npmjs.com/package/react-joyride" target="_blank">![](https://badge.fury.io/js/react-joyride.svg)</a> <a href="https://travis-ci.org/gilbarbara/react-joyride" target="_blank">![](https://travis-ci.org/gilbarbara/react-joyride.svg)</a>

<a href="http://gilbarbara.github.io/react-joyride/" target="_blank">![](http://gilbarbara.github.io/react-joyride/media/example.png)</a>

View the demo <a href="http://gilbarbara.github.io/react-joyride/" target="_blank">here</a>.

## Install

```javascript
npm install --save react-joyride
```


```javascript
var react = require('react/addons');
var joyride = require('react-joyride').Mixin;

var App = React.createClass({
  mixins: [React.addons.PureRenderMixin, joyride],
  ...
});
```

**This mixin changes state often so you should use `React.addons.PureRenderMixin` in your components as well.**

#### Styles
 
If your are using **SCSS**:

```scss
@include 'react-joyride/lib/styles/react-joyride'

```

Or include this directly in your html:

```html
<link rel="stylesheet" href="react-joyride/lib/styles/react-joyride.css" type="text/css">
```


## Getting Started

Add steps to your tour after your component is mounted.

```javascript
this.joyrideAddSteps({...})]
//If you pass `true` as a second parameter it will start the tour immediately.
```

You can start the tour at any time

```javascript
this.joyrideStart()
```

## Options

- `joyrideLocale` (object): The strings used in the tooltip. Defaults to `{ close: 'Close', last: 'Last', next: 'Next' }`
- `joyrideScrollToSteps` (bool): Scroll the page to the next step if needed. Defaults to `true`
- `joyrideShowBackdrop` (bool): Display a backdrop with holes above your steps. Defaults to `true`
- `joyrideTooltipOffset`: (number) The tooltip offset from the target. Defaults to `30`
- `joyrideType` (string): The type of your presentation. It can be `guided` (played sequencially with the Next button) or `single`. Defaults to `guided`
- `joyrideCompleteCallback` (function): It will be called after an user has completed all the steps in your tour and passes all steps. Defaults to `undefined`
- `joyrideStepCallback` (function): It will be called after each step and passes the completed step. Defaults to `undefined`

You can change these in `componentWillMount`. All optional.

Example:

```javascript
componentWillMount: function () {
	this.setState({
		joyrideLocale: {
			close: 'Close',
			last: 'Last',
			next: 'Next'
		},
		joyrideStepCallback: function(step) {
			console.log(step);
		},
		joyrideCompleteCallback: function(steps) {
			console.log(steps);
		}
		...
	});
}
```

## Methods

```javascript
/**
 * Add Steps
 * @param steps {object|array} - Steps to add to the tour
 * @param start {boolean} - Starts the tour right away
 */

this.joyrideAddSteps([
	{
		title: "", //optional
		text: "...",
		selector: "...",
		position: "..."
	},
	...
], true);
```
You can call this method multiple times even after the tour has started.

```javascript

/**
 * Starts the tour
 * @param [autorun] {boolean} - Starts with the first tooltip opened
 */
 
 this.joyrideStart(true);

```
Call this method to, well, start the tour.

```javascript
/**
 * Retrieve the current progress of your tour
 * @returns {{
	index: 2,
	percentageComplete: 50,
	step: {
		title: "",
		text: "...",
		selector: "...",
		position: "..."
	}
}}
 */
```

## Step Syntax
There are 4 usable options but you can pass extra parameters.

```javascript
{
    title: 'First Step',
    text: 'Start using the joyride',
    selector: '.first-step',
    position: 'bottom-left',
    ...
    name: 'my-first-step',
    parent: 'MyComponentName'
}
```

- `title`: The title of the tooltip (optional)
- `text`: The tooltip's body (required)
- `selector`: The target DOM selector of your step (required)
- `position`: Relative position of you beacon and tooltip. It can be one of these: `right`, `left`, `top`, `top-left`, `top-right`, `bottom`, `bottom-left`, `bottom-right` and `center`. This defaults to `top`.

## SCSS Options

- `$joyride-color`: The base color. Defaults to `#f04`
- `$joyride-zindex`: Defaults to `1500`
- `$joyride-beacon-color`: Defaults to `$joyride-color`
- `$joyride-beacon-size`: Defaults to `36px`
- `$joyride-hole-border-radius`: Defaults to `4px`
- `$joyride-hole-inner-shadow`: Defaults to `0 0 15px rgba(#000, 0.5)`
- `$joyride-hole-outer-shadow`: You'll need a huge blur value to fill the whole screen. Defaults to `0 0 0 9999px rgba(#000, 0.5)`
- `$joyride-tooltip-arrow-size`: You must use even numbers to avoid half-pixel inconsistencies. Defaults to `28px`
- `$joyride-tooltip-background-color`: Defaults to `#fff`
- `$joyride-tooltip-border-radius`: Defaults to `8px`
- `$joyride-tooltip-button-color`: Defaults to `#fff`
- `$joyride-tooltip-button-radius`: Defaults to `4px`
- `$joyride-tooltip-color`: The header and button color. Defaults to `#333`
- `$joyride-tooltip-highlight-color`: The header and button color. Defaults to `$joyride-color`
- `$joyride-tooltip-width`: Sass List. Defaults to `(290px, 360px, 450px)`

## License

Copyright © 2015 Gil Barbara - [MIT License](LICENSE)

---

Inspired by [react-tour-guide](https://github.com/jakemmarsh/react-tour-guide) and [jquery joyride tour](http://zurb.com/playground/jquery-joyride-feature-tour-plugin)
