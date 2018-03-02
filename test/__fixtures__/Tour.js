import React from 'react';
import PropTypes from 'prop-types';
import Joyride from '../../src/index';

import steps from './steps';

export default class Tour extends React.Component {
  state = {
    autoStart: false,
    run: false,
    steps,
    stepIndex: 0,
  };

  static propTypes = {
    joyride: PropTypes.shape({
      callback: PropTypes.func,
    }),
  };

  static defaultProps = {
    joyride: {},
  };

  handleClickStart = (e) => {
    e.preventDefault();

    this.setState({
      run: true,
      stepIndex: 0,
    });
  };

  handleClickNextButton = () => {
    if (this.state.stepIndex === 1) {
      this.joyride.next();
    }
  };

  handleJoyrideCallback = (result) => {
    const { joyride } = this.props;

    if (result.type === 'step:before') {
      // Keep internal state in sync with joyride
      this.setState({ stepIndex: result.index });
    }

    if (result.type === 'finished' && this.state.run) {
      // Need to set our running state to false, so we can restart if we click start again.
      this.setState({ run: false });
    }

    if (result.type === 'error:target_not_found') {
      this.setState({
        stepIndex: result.action === 'back' ? result.index - 1 : result.index + 1,
        autoStart: result.action !== 'close' && result.action !== 'esc',
      });
    }

    if (typeof joyride.callback === 'function') {
      joyride.callback(result);
    }
    else {
      console.log(result); //eslint-disable-line no-console
    }
  };

  render() {
    const props = {
      ...this.state,
      ...this.props.joyride,
    };

    return (
      <div className="demo">
        <Joyride
          debug={false}
          disableOverlay={this.state.stepIndex === 1}
          scrollToFirstStep
          type="continuous"
          {...props}
          ref={c => (this.joyride = c)}
          callback={this.handleJoyrideCallback}
        />
        <main>
          <div className="hero">
            <div className="container">
              <div className="hero__content">
                <h1>
                  <span>Create walkthroughs and guided tours for your ReactJS apps.</span>
                  <button className="hero__tooltip">?</button>
                </h1>
                <a href="#start" className="hero__start" onClick={this.handleClickStart}>Let's Go!</a>
              </div>
            </div>
          </div>
          <div className="demo__section projects">
            <div className="container">
              <h2><span>Projects</span></h2>
              <div className="list">
                <div>
                  <img src="http://placehold.it/800x600/ff0044/ffffff?txtsize=50&text=ASBESTOS" alt="ASBESTOS" />
                </div>
                <div>
                  <img src="http://placehold.it/800x600/00ff44/ffffff?txtsize=50&text=GROW" alt="GROW" />
                </div>
                <div>
                  <img src="http://placehold.it/800x600/333/ffffff?txtsize=50&text=∂Vo∑" alt="∂Vo∑" />
                </div>
              </div>
            </div>
          </div>

          <div className="demo__section mission">
            <div className="container">
              <h2><span>Mission</span></h2>
              <button className="btn btn-secondary mission__button" onClick={this.handleClickNextButton}>Advance
              </button>
            </div>
          </div>
          <div className="demo__section about">
            <div className="container">
              <h2><span>About</span></h2>
            </div>
          </div>
        </main>
        <footer className="demo__footer">
          <div className="container">
            <a href="#menu" onClick={e => e.preventDefault()}><span /></a>
            <img src={require('../assets/media/logo.svg')} alt="Joyride" />
          </div>
        </footer>
      </div>
    );
  }
}
