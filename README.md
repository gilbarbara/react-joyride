React Joyride
===

Create walkthroughs and guided tours for your apps. [Demo](http://gilbarbara.github.io/react-joyride/)

---

## Installation

`npm install --save react-joyride`

```javascript
var joyride = require('react-joyride').Mixin;

var App = React.createClass({
  mixins: [joyride],
  ...
});

```

## Options

You can change some options in the `componentWillMount` stage. None are required.

```javascript
componentWillMount: function () {
	this.setState({
		joyrideAutoplay: true,
		joyrideLocale: {
			close: 'Close',
			last: 'Last',
			next: 'Next'
		},
		joyrideSteps: [
			{
				title: 'First Step',
				text: 'Start using the joyride',
				selector: '.first-step',
				position: 'bottom-left'
			},
			...	
		],
		...
	});
}
```

- `joyrideAutoplay` (bool): Show the beacon as soon as you add steps. Defaults to `true`
- `joyrideLocale` (object): The strings used in the tooltip. Defaults to `{ close: 'Close', last: 'Last', next: 'Next' }`
- `joyrideScrollToSteps` (bool): Scroll the page to the next step if needed. Defaults to `true`
- `joyrideSteps` (array): The steps of your tour. You can leave it empty and add steps asynchronously using the `joyrideAddSteps` method. Defaults to `[]`
- `joyrideShowBackdrop` (bool): Display a backdrop with holes above your steps. Defaults to `true`
- `joyrideType` (string): The type of your presentation. It can be `tour` (play sequencially using Next button) or `single`. Defaults to `single`
- `joyrideCompleteCallback` (function): It will be called after an user has completed all the steps in your tour. Defaults to `function () {}`
- `joyrideStepCallback` (function): It will be called after each step and passes the step object. Defaults to `undefined`

## Step Syntax
There are 4 usable options but you can pass other options if needed.

- `title`: The title of the tooltip (optional)
- `text`: The tooltip's body (required)
- `selector`: The DOM selector of your step (required)
- `position`: The position of you beacon/tooltip. It can be one of these: `right`, `left`, `top`, `top-left`, `top-right`, `bottom`, `bottom-left`, `bottom-right` and `center`. This defaults to `top`.

## Methods

**`joyrideAddSteps(steps)`**

Add steps asynchronously (if they need to be fetched from a database, etc). It accepts single steps `{object}` or an array of objects `[{}, {}]`

**`joyrideGetProgress()`**
Retrieve the current progress of your tour. The object returned looks like this:
```javascript
{
  "index": 2,
  "percentageComplete": 50,
  "step": {
		title: "",
		text: "...",
		selector: "...",
		position: "..."
  }
}
```

---

Inspired by [react-tour-guide](https://github.com/jakemmarsh/react-tour-guide) and [jquery joyride tour](http://zurb.com/playground/jquery-joyride-feature-tour-plugin)
