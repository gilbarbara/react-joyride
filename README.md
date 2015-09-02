React Joyride
===

Create walkthroughs and guided tours for your apps. View the demo [here](http://gilbarbara.github.io/react-joyride/)

---

## Installation

`npm install --save react-joyride`

```javascript
var joyride = require('react-joyride').Mixin;

var App = React.createClass({
  mixins: [joyride],
  ...
  componentWillMount: function () {
  	this.setState({
  		joyrideSteps: [
  			{
  				title: 'First Step',
  				text: 'Start using the joyride',
  				selector: '.first-step',
  				position: 'bottom-left'
  			},
  			...	
  		]
  	});
  }

});

```

Position can be one of these: `right`, `left`, `top`, `top-left`, `top-right`, `bottom`, `bottom-left`, `bottom-right` and `center`. This defaults to `top`.

---

Inspired by [react-tour-guide](https://github.com/jakemmarsh/react-tour-guide) and [jquery joyride tour](http://zurb.com/playground/jquery-joyride-feature-tour-plugin)
