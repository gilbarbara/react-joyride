import React from 'react';
import PropTypes from 'prop-types';
import Joyride, { STATUS } from '../../src/index';

import tourSteps from './steps';

const filteredSteps = tourSteps
  .filter((d, i) => i !== 3)
  .map(d => {
    if (d.target === '.mission button') {
      d.target = '.mission h2';
    }

    return d;
  });

export default class Standard extends React.Component {
  constructor(props) {
    super(props);

    const steps = [...filteredSteps];

    if (props.withCentered) {
      steps.push({
        target: 'body',
        placement: 'center',
        content: "Let's begin our journey",
        textAlign: 'center',
      });
    }

    this.state = {
      run: false,
      steps,
    };
  }

  static propTypes = {
    callback: PropTypes.func.isRequired,
  };

  handleClickStart = () => {
    this.setState({
      run: true,
    });
  };

  handleJoyrideCallback = data => {
    const { callback } = this.props;
    const { status } = data;

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      this.setState({ run: false });
    }

    callback(data);
  };

  render() {
    const { run, steps } = this.state;

    return (
      <div className="demo">
        <Joyride
          run={run}
          steps={steps}
          continuous
          scrollToFirstStep
          showSkipButton={true}
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
