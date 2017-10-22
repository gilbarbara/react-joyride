import React from 'react';
import Joyride from 'react-joyride';
import { autobind } from 'core-decorators';

import Header from 'components/Header';
import Footer from 'components/Footer';
import Panels from 'components/Panels';
import Charts from 'components/Charts';
import Tables from 'components/Tables';
import Loader from 'components/Loader';

@autobind
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      joyrideOverlay: true,
      joyrideType: 'continuous',
      isReady: false,
      isRunning: false,
      stepIndex: 0,
      steps: [],
      selector: '',
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        isReady: true,
        isRunning: true,
      });
    }, 1000);
  }

  addSteps(steps) {
    let newSteps = steps;

    if (!Array.isArray(newSteps)) {
      newSteps = [newSteps];
    }

    if (!newSteps.length) {
      return;
    }

    // Force setState to be synchronous to keep step order.
    this.setState(currentState => {
      currentState.steps = currentState.steps.concat(newSteps);
      return currentState;
    });
  }

  addTooltip(data) {
    this.joyride.addTooltip(data);
  }

  next() {
    this.joyride.next();
  }

  callback(data) {
    console.log('%ccallback', 'color: #47AAAC; font-weight: bold; font-size: 13px;'); //eslint-disable-line no-console
    console.log(data); //eslint-disable-line no-console

    this.setState({
      selector: data.type === 'tooltip:before' ? data.step.selector : '',
    });
  }

  onClickSwitch(e) {
    e.preventDefault();
    const el = e.currentTarget;
    const state = {};

    if (el.dataset.key === 'joyrideType') {
      this.joyride.reset();

      this.setState({
        isRunning: false,
      });

      setTimeout(() => {
        this.setState({
          isRunning: true,
        });
      }, 300);

      state.joyrideType = e.currentTarget.dataset.type;
    }

    if (el.dataset.key === 'joyrideOverlay') {
      state.joyrideOverlay = el.dataset.type === 'active';
    }

    this.setState(state);
  }

  render() {
    const {
      isReady,
      isRunning,
      joyrideOverlay,
      joyrideType,
      selector,
      stepIndex,
      steps,
    } = this.state;
    let html;

    if (isReady) {
      html = (
        <div>
          <Joyride
            ref={c => (this.joyride = c)}
            callback={this.callback}
            debug={false}
            disableOverlay={selector === '.card-tickets'}
            locale={{
              back: (<span>Back</span>),
              close: (<span>Close</span>),
              last: (<span>Last</span>),
              next: (<span>Next</span>),
              skip: (<span>Skip</span>),
            }}
            run={isRunning}
            showOverlay={joyrideOverlay}
            showSkipButton={true}
            showStepsProgress={true}
            stepIndex={stepIndex}
            steps={steps}
            type={joyrideType}
          />
          <Header
            joyrideType={joyrideType}
            joyrideOverlay={joyrideOverlay}
            onClickSwitch={this.onClickSwitch}
            addSteps={this.addSteps}
            addTooltip={this.addTooltip}
          />
          <Footer addTooltip={this.addTooltip} />
          <main className="main-content">
            <div className="container-fluid">
              <Panels addSteps={this.addSteps} selector={selector} next={this.next} />
              <Charts addSteps={this.addSteps} />
              <Tables addSteps={this.addSteps} />
            </div>
          </main>
        </div>
      );
    } else {
      html = (<Loader />);
    }

    return (
      <div key="App" className="app">{html}</div>
    );
  }
}

export default App;
