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
this.joyrideAddSteps([{...}])]
```

Start the tour with:

```javascript
this.joyrideStart()
```

## Options

`joyrideLocale` {object}: The strings used in the tooltip. Defaults to `{ back: 'Back', close: 'Close', last: 'Last', next: 'Next' }`

`joyrideScrollOffset` {number}: The scrollTop offset used in `joyrideScrollToSteps`. Defaults to `20`

`joyrideScrollToSteps` {bool}: Scroll the page to the next step if needed. Defaults to `true`

`joyrideShowBackButton` {bool}: Display a back button. Defaults to `true`

`joyrideShowOverlay` {bool}: Display an overlay with holes above your steps. Defaults to `true`

`joyrideShowStepsProgress` {bool}: Display the tour progress in the next button (1/5) in `guided` tours. Defaults to `false`

`joyrideTooltipOffset` {number}: The tooltip offset from the target. Defaults to `30`

`joyrideType` {string}: The type of your presentation. It can be `guided` (played sequencially with the Next button) or `single`. Defaults to `guided`

`joyrideCompleteCallback` {function}: It will be called after an user has completed all the steps in your tour and passes all steps. Defaults to `undefined`

`joyrideStepCallback` {function}: It will be called after each step and passes the completed step. Defaults to `undefined`

You can change these in `componentWillMount`. All optional.

Example:

```javascript
componentWillMount: function () {
	this.setState({
		joyrideLocale: {
			back: 'Voltar',
			close: 'Fechar',
			last: 'Último',
			next: 'Próximo'
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

## API

### this.joyrideAddSteps(steps, [start])

Add steps to your tour. You can call this method multiple times even after the tour has started.

- `steps` {object|array} - Tour's steps
- `start` {boolean} - Starts the tour right away (optional)

```javascript
this.joyrideAddSteps([
	{
		title: "", //optional
		text: "...",
		selector: "...",
		position: "..."
	},
	...
]);
```

### this.joyrideStart(autorun)

Call this method to start the tour if it wasn't already started with `this.joyrideAddSteps()`

- `autorun` {boolean} - Starts the tour with the first tooltip opened.

### this.joyrideGetProgress()
Retrieve the current progress of your tour. The object returned looks like this:

```javascript
{
	index: 2,
	percentageComplete: 50,
	step: {
		title: "...",
		text: "...",
		selector: "...",
		position: "..."
	}
}}
```

## Step Syntax
There are 4 usable options but you can pass extra parameters.

- `title`: The title of the tooltip (optional)
- `text`: The tooltip's body (required)
- `selector`: The target DOM selector of your step (required)
- `position`: Relative position of you beacon and tooltip. It can be one of these: `right`, `left`, `top`, `top-left`, `top-right`, `bottom`, `bottom-left`, `bottom-right` and `center`. This defaults to `top`.

Example:

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

## SCSS Options

#### Basic

- `$joyride-color`: The base color. Defaults to `#f04`
- `$joyride-zindex`: Defaults to `1500`
- `$joyride-overlay-color`: Defaults to `rgba(#000, 0.5)`
- `$joyride-beacon-color`: Defaults to `$joyride-color`
- `$joyride-beacon-size`: Defaults to `36px`
- `$joyride-hole-border-radius`: Defaults to `4px`
- `$joyride-hole-shadow`: Defaults to `0 0 15px rgba(#000, 0.5)`

#### Tooltip

- `$joyride-tooltip-arrow-size`: You must use even numbers to avoid half-pixel inconsistencies. Defaults to `28px`
- `$joyride-tooltip-bg-color`: Defaults to `#fff`
- `$joyride-tooltip-border-radius`: Defaults to `8px`
- `$joyride-tooltip-color`: The header and text color. Defaults to `#555`
- `$joyride-tooltip-font-size`: Defaults to `16px`
- `$joyride-tooltip-padding`: Defaults to `20px`
- `$joyride-tooltip-shadow`: Defaults to `drop-shadow(2px 4px 4px rgba(#000, 0.5))`
- `$joyride-tooltip-width`: Sass list of Mobile / Tablet / Desktop sizes. Defaults to `(290px, 360px, 450px)`
- `$joyride-header-color`: Defaults to `$joyride-tooltip-header-color`
- `$joyride-header-font-size`: Defaults to `20px`
- `$joyride-header-border-color`: Defaults to `$joyride-color`
- `$joyride-header-border-width`: Defaults to `1px`
- `$joyride-button-bg-color`: Defaults to `$joyride-color`
- `$joyride-button-color`: Defaults to `#fff`
- `$joyride-button-border-radius`: Defaults to `4px`
- `$joyride-back-button-color`: Defaults to `$joyride-color`

## License

Copyright © 2015 Gil Barbara - [MIT License](LICENSE)

---

Inspired by [react-tour-guide](https://github.com/jakemmarsh/react-tour-guide) and [jquery joyride tour](http://zurb.com/playground/jquery-joyride-feature-tour-plugin)
