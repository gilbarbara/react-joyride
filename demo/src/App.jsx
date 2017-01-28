import React from 'react';
import Joyride from 'scripts/Joyride';

import './styles.scss';

export default class Demo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      autoStart: false,
      running: false,
      steps: [
        {
          title: 'Title only steps — As they say: Make the font bigger!',
          textAlign: 'center',
          selector: '.projects .list',
          position: 'top'
        },
        {
          title: 'Our Mission',
          text: 'Can be advanced by clicking an element through the overlay hole.',
          selector: '.mission button',
          position: 'bottom',
          allowClicksThruHole: true,
          style: {
            beacon: {
              offsetY: 20
            },
            button: {
              display: 'none',
            }
          }
        },
        {
          title: 'Unmounted target',
          text: 'This step tests what happens when a target is missing',
          selector: '.not-mounted',
        },
        {
          title: 'About Us',
          text: 'We are the people',
          selector: '.about h2 span',
          position: 'left',
          style: {
            beacon: {
              inner: '#27e200',
              offsetX: 20,
              outer: '#27e200'
            },
            arrow: {
              display: 'none'
            }
          }
        },
        {
          text: 'Text only steps — Because sometimes you don\'t really need a proper heading',
          selector: '.demo__footer a',
          position: 'top',
          isFixed: true,
          style: {
            beacon: '#000'
          }
        }
      ],
      step: 0,
    };

    this.handleClickStart = this.handleClickStart.bind(this);
    this.handleNextButtonClick = this.handleNextButtonClick.bind(this);
    this.handleJoyrideCallback = this.handleJoyrideCallback.bind(this);
  }

  static propTypes = {
    joyride: React.PropTypes.shape({
      autoStart: React.PropTypes.bool,
      callback: React.PropTypes.func,
      run: React.PropTypes.bool,
    }),
  };

  static defaultProps = {
    joyride: {
      autoStart: false,
      resizeDebounce: false,
      run: false,
    },
  };

  componentDidMount() {
    this.joyride.addTooltip({
      title: 'The classic joyride',
      text: 'Let\'s go on a magical tour! Just click the big orange button.',
      selector: '.hero__tooltip',
      position: 'bottom',
      event: 'click',
      style: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderRadius: 0,
        color: '#fff',
        mainColor: '#ff67b4',
        textAlign: 'center',
        width: '29rem'
      }
    });

    this.joyride.addTooltip({
      title: 'A fixed tooltip',
      text: 'For fixed elements, you know?',
      selector: '.demo__footer img',
      position: 'top',
      isFixed: true,
      event: 'hover',
      style: {
        backgroundColor: 'rgba(255, 255, 255, 1)',
        borderRadius: 0,
        color: '#333',
        textAlign: 'center',
        width: '29rem'
      }
    });
  }

  handleClickStart(e) {
    e.preventDefault();

    this.setState({
      running: true,
      step: 0,
    });
  }

  handleNextButtonClick() {
    if (this.state.step === 1) {
      this.joyride.next();
    }
  }

  handleJoyrideCallback(result) {
    const { joyride } = this.props;

    if (result.type === 'step:before') {
      // Keep internal state in sync with joyride
      this.setState({ step: result.index });
    }

    if (result.type === 'finished' && this.state.running) {
      // Need to set our running state to false, so we can restart if we click start again.
      this.setState({ running: false });
    }

    if (result.type === 'error:target_not_found') {
      this.setState({
        step: result.action === 'back' ? result.index - 1 : result.index + 1,
        autoStart: result.action !== 'close' && result.action !== 'esc',
      });
    }

    if (typeof joyride.callback === 'function') {
      joyride.callback();
    }
  }

  render() {
    const { joyride } = this.props;
    const joyrideProps = {
      autoStart: joyride.autoStart || this.state.autoStart,
      callback: this.handleJoyrideCallback,
      debug: false,
      disableOverlay: this.state.step === 1,
      resizeDebounce: joyride.resizeDebounce,
      run: joyride.run || this.state.running,
      scrollToFirstStep: joyride.scrollToFirstStep || true,
      stepIndex: joyride.stepIndex || this.state.step,
      steps: joyride.steps || this.state.steps,
      type: joyride.type || 'continuous'
    };

    return (
      <div className="demo">
        <Joyride
          {...joyrideProps}
          ref={c => (this.joyride = c)} />
        <main>
          <div className="hero">
            <div className="container">
              <div className="hero__content">
                <h1>
                  <span>Create walkthroughs and guided tours for your ReactJS apps.</span>
                  <a href="#tooltip" className="hero__tooltip">?</a>
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
              <button className="btn btn-secondary mission__button" onClick={this.handleNextButtonClick}>Advance
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
