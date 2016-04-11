React Joyride
===

<a href="https://www.npmjs.com/package/react-joyride" target="_blank">![](https://badge.fury.io/js/react-joyride.svg)</a> <a href="https://travis-ci.org/gilbarbara/react-joyride" target="_blank">![](https://travis-ci.org/gilbarbara/react-joyride.svg)</a> <a href="https://codeclimate.com/github/gilbarbara/react-joyride">![](https://codeclimate.com/github/gilbarbara/react-joyride/badges/gpa.svg)</a> <a href="https://gitter.im/gilbarbara/react-joyride?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge">![Join the chat at https://gitter.im/gilbarbara/react-joyride](https://badges.gitter.im/Join%20Chat.svg)</a>

<a href="http://gilbarbara.github.io/react-joyride/" target="_blank">![](http://gilbarbara.github.io/react-joyride/media/example.png)</a>

View the demo <a href="http://gilbarbara.github.io/react-joyride/" target="_blank">here</a>. [[source](https://github.com/gilbarbara/react-joyride/tree/demo)]

## Setup


### Version 1.0 has a very different setup from 0.x versions. The old syntax will not work.

```javascript
npm install --save react-joyride
```

Include `Joyride` in the parent component before anything else.


```javascript
var react = require('react');
var Joyride = require('react-joyride');

var App = React.createClass({
	render: function () {
		return (
			<div className="app">
				<Joyride ref="joyride" steps={this.state.steps} debug={true} ... />
				<YourComponents .../>
			</div>
		);
	}
  ...
});
```
Don't forget to pass a `ref` to the component.

### Styles
 
If your are using **SCSS** (and you should):

```scss
@include '../path/to/node-modules/react-joyride/lib/styles/react-joyride'

```

Or include this directly in your html:

```html
<link rel="stylesheet" href="react-joyride/lib/styles/react-joyride-compiled.css" type="text/css">
```


## Getting Started

Add a custom function to include steps and/or tooltips in your parent component

```javascript
addSteps: function (steps) {
	let joyride = this.refs.joyride;
		
	if (!Array.isArray(steps)) {
	    steps = [steps];
	}
	
	if (!steps.length) {
	    return false;
	}
	
	this.setState(function(currentState) {
	    currentState.steps = currentState.steps.concat(joyride.parseSteps(steps));
	    return currentState;
	});
}

addTooltip: function (data) {
    this.refs.joyride.addTooltip(data);
}
```

Add steps after your components are mounted.

```javascript
componentDidMount: function () {
	this.addSteps({...}); // or this.addTooltip({...});
	

	// or using props in your child components
	this.props.addSteps({...});
}
...   
render: function () {
	return (
		<Joyride ref="joyride" .../>
		<ChildComponent addSteps={this.addSteps} addTooltip={this.addTooltip} />
	);
}
```

Or you can start the tour after a criteria is met

```javascript
componentDidUpdate (prevProps, prevState) {
    if (!prevState.ready && this.state.ready) {
        this.refs.joyride.start();
    }
},
```

Please refer to the source code of the demo if you need a practical [example](https://github.com/gilbarbara/react-joyride/tree/demo/app/scripts).

## Options

You can change the initial options passing props to the component. All optional.

**debug** {bool}: Console.log Joyride's inner actions. Defaults to `false`

**keyboardNavigation** {bool}: Toggle keyboard navigation (esc, space bar, return). Defaults to `true`

**locale** {object}: The strings used in the tooltip. Defaults to `{ back: 'Back', close: 'Close', last: 'Last', next: 'Next', skip: 'Skip' }`

**resizeDebounce** {bool}: Delay the reposition of the current step while the window is being resized. Defaults to `false`

**resizeDebounceDelay** {number}: The amount of delay for the `resizeDebounce` callback. Defaults to `200`

**scrollOffset** {number}: The scrollTop offset used in `scrollToSteps`. Defaults to `20`

**scrollToSteps** {bool}: Scroll the page to the next step if needed. Defaults to `true`

**scrollToFirstStep** {bool}: Scroll the page for the first step. Defaults to `false`

**showBackButton** {bool}: Display a back button. Defaults to `true`

**showOverlay** {bool}: Display an overlay with holes above your steps (for tours only). Defaults to `true`

**showSkipButton** {bool}: Display a link to skip the tour. It will trigger the `completeCallback` if it was defined. Defaults to `false`

**showStepsProgress** {bool}: Display the tour progress in the next button *e.g. 2/5*  in `continuous` tours. Defaults to `false`

**steps** {array}: The tour's steps. Defaults to `[]`

**tooltipOffset** {number}: The tooltip offset from the target. Defaults to `30`

**type** {string}: The type of your presentation. It can be `continuous` (played sequencially with the Next button) or `single`. Defaults to `single`

**completeCallback** {function}: It will be called after an user has completed all the steps or skipped the tour and passes two parameters, the steps `{array}` and if the tour was skipped `{boolean}`. Defaults to `undefined`

**stepCallback** {function}: It will be called after each step and passes the completed step `{object}`. Defaults to `undefined`

Example:

```javascript
<Joyride ref="joyride" steps={this.state.steps} debug={true} type="single"
		 stepCallback={this._stepCallback} ... />
```

## API


### this.refs.joyride.start(autorun)

Call this method to start the tour.

- `autorun` {boolean} - Starts the tour with the first tooltip opened.

### this.refs.joyride.stop()

Call this method to stop/pause the tour.

### this.refs.joyride.reset(restart)

Call this method to reset the tour iteration back to 0

- `restart` {boolean} - Starts the new tour right away

### this.refs.joyride.getProgress()
Retrieve the current progress of your tour. The object returned looks like this:

```javascript
{
	index: 2,
	percentageComplete: 50,
	step: {
		title: "...",
		text: "...",
		selector: "...",
		position: "...",
		...
	}
}}
```

### this.refs.joyride.parseSteps(steps)

Parse the incoming steps, check if it's already rendered and returns an array with valid items

- `steps ` {array|object}

```javascript
var steps = this.refs.joyride.parseSteps({
    title: 'Title',
    text: 'description',
    selector: 'my-super-class',
    position: 'top'
});

// steps
[{
    title: 'Title',
    text: 'description',
    selector: '#super-panel',
    position: 'top'
}]
```

### Only start the tour after all target elements (or at least the first step) are rendered in the page.


## Tooltip / Step Syntax
There are a few usable options but you can pass custom parameters.

- `title`: The title of the tooltip
- `text`: The tooltip's body text **(required)**
- `selector`: The target DOM selector of your feature **(required)**
- `position`: Relative position of you beacon and tooltip. It can be one of these:`top`, `top-left`, `top-right`, `bottom`, `bottom-left`, `bottom-right`, `right` and `left`. This defaults to `top`.
- `type`: The event type that trigger the tooltip: `click` or `hover`. Defaults to `click`

Extra option for standalone tooltips

- `trigger`: The DOM element that will trigger the tooltip

As of version 1.x you can style tooltips independently with these options: `backgroundColor`, `borderRadius`, `color`, `mainColor`, `textAlign` and `width`.

Also you can style `button`, `skip`, `back` and `close` individually using standard style options. And `beacon` inner and outer colors.


Example:

```javascript
{
    title: 'First Step',
    text: 'Start using the <strong>joyride</strong>', // supports html tags
    selector: '.first-step',
    position: 'bottom-left',
    type: 'hover',
    style: {
		backgroundColor: 'rgba(0, 0, 0, 0.8)',
		borderRadius: '0',
		color: '#fff',
		mainColor: '#ff4456',
		textAlign: 'center',
		width: '29rem',
		beacon: {
			inner: '#000',
			outer: '#000'
		},
		button: {
			display: 'none'
			// or any style attribute
		},
		skip: {
			color: '#f04'
		},
		...
	},
    // custom params...
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
- `$joyride-tooltip-border-radius`: Defaults to `4px`
- `$joyride-tooltip-color`: The header and text color. Defaults to `#555`
- `$joyride-tooltip-font-size`: Defaults to `16px`
- `$joyride-tooltip-padding`: Defaults to `20px`
- `$joyride-tooltip-shadow`: Sass list for drop-shadow. Defaults to `(x: 1px, y: 2px, blur: 3px, color: rgba(#000, 0.3))`
- `$joyride-tooltip-width`: Sass list of Mobile / Tablet / Desktop sizes. Defaults to `(290px, 360px, 450px)`
- `$joyride-header-color`: Defaults to `$joyride-tooltip-header-color`
- `$joyride-header-font-size`: Defaults to `20px`
- `$joyride-header-border-color`: Defaults to `$joyride-color`
- `$joyride-header-border-width`: Defaults to `1px`
- `$joyride-button-bg-color`: Defaults to `$joyride-color`
- `$joyride-button-color`: Defaults to `#fff`
- `$joyride-button-border-radius`: Defaults to `4px`
- `$joyride-back-button-color`: Defaults to `$joyride-color`
- `$joyride-skip-button-color`: Defaults to `#ccc`
- `$joyride-close`: Sass list for the close button: Defaults to `(color: rgba($joyride-tooltip-color, 0.5), size: 30px, top: 10px, right: 10px)`
- `$joyride-close-visible`: Default to `true`;

## License

Copyright © 2015 Gil Barbara - [MIT License](LICENSE)

---

Inspired by [react-tour-guide](https://github.com/jakemmarsh/react-tour-guide) and [jquery joyride tour](http://zurb.com/playground/jquery-joyride-feature-tour-plugin)
  