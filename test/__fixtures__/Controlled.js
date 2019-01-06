import React from 'react';
import PropTypes from 'prop-types';
import Joyride, { ACTIONS, EVENTS, STATUS } from '../../src/index';

import tourSteps from './steps';

export default class Controlled extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      run: false,
      steps: tourSteps,
      stepIndex: 0,
    };
  }

  static propTypes = {
    callback: PropTypes.func.isRequired,
  };

  handleClickStart = () => {
    this.setState({
      run: true,
      stepIndex: 0,
    });
  };

  handleClickNextButton = () => {
    this.setState({ stepIndex: 2 });
  };

  handleJoyrideCallback = data => {
    const { callback } = this.props;
    const { action, index, status, type } = data;

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      this.setState({ run: false, stepIndex: 0 });
    } else if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      // Keep internal state in sync with joyride
      this.setState({ stepIndex: index + (action === ACTIONS.PREV ? -1 : 1) });
    }

    callback(data);
  };

  render() {
    const { run, steps, stepIndex } = this.state;

    return (
      <div className="demo">
        <Joyride
          run={run}
          steps={steps}
          stepIndex={stepIndex}
          continuous
          spotlightClicks
          scrollToFirstStep
          callback={this.handleJoyrideCallback}
        />
        <main>
          <div className="hero">
            <div className="container">
              <div className="hero__content">
                <h1>
                  <span>Create walkthroughs and guided tours for your ReactJS apps.</span>
                </h1>
                <button className="hero__start" onClick={this.handleClickStart} type="button">
                  Let's Go!
                </button>
              </div>
            </div>
          </div>
          <div className="demo__section projects">
            <div className="container">
              <h2>
                <span>Projects</span>
              </h2>
              <div className="list">
                <div>
                  <img
                    src="http://placehold.it/800x600/ff0044/ffffff?txtsize=50&text=ASBESTOS"
                    alt="ASBESTOS"
                  />
                </div>
                <div>
                  <img
                    src="http://placehold.it/800x600/00ff44/ffffff?txtsize=50&text=GROW"
                    alt="GROW"
                  />
                </div>
                <div>
                  <img
                    src="http://placehold.it/800x600/333/ffffff?txtsize=50&text=∂Vo∑"
                    alt="∂Vo∑"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="demo__section mission">
            <div className="container">
              <h2>
                <span>Mission</span>
              </h2>
              {stepIndex === 1 && (
                <button
                  className="btn btn-secondary mission__button"
                  onClick={this.handleClickNextButton}
                  type="button"
                >
                  Advance
                </button>
              )}
            </div>
          </div>
          <div className="demo__section about">
            <div className="container">
              <h2>
                <span>About</span>
              </h2>
            </div>
          </div>
        </main>
        <footer className="demo__footer">
          <div className="container">
            <button type="button">
              <span />
            </button>
            JOYRIDE
          </div>
        </footer>
      </div>
    );
  }
}
