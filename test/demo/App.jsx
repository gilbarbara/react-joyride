import React from 'react';
import Joyride from '../../src/scripts/Joyride';

export default class Demo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      running: false,
      steps: [
        {
          title: 'Our Projects',
          text: 'Ooops. I forgot to add images!',
          textAlign: 'center',
          selector: '.projects h2 span',
          position: 'right',
          style: {
            beacon: {
              offsetX: 30
            }
          }
        },
        {
          title: 'Our Mission',
          text: 'Can be advanced by clicking an element through the overlay hole.',
          selector: '.mission button',
          position: 'bottom',
          style: {
            beacon: {
              offsetY: 20
            },
            button: {
              display: 'none',
            },
          }
        },
        {
          title: 'About Us',
          text: 'We are the people',
          selector: '.about h2 span',
          position: 'left',
          style: {
            beacon: {
              offsetX: 20
            },
          }
        },
        {
          title: 'Menu',
          text: 'You can find more stuff here',
          selector: '.main-header a',
          position: 'top',
          fixed: true,
          style: {
            beacon: {
              offsetY: 15
            }
          }
        }
      ],
      step: 0,
    };

    this.onClickStart = this.onClickStart.bind(this);
    this.handleNextButtonClick = this.handleNextButtonClick.bind(this);
    this.handleJoyrideCallback = this.handleJoyrideCallback.bind(this);
  }

  componentDidMount() {
    this.joyride.addTooltip({
      title: 'The classic joyride',
      text: "Let's go on a magical tour! Just click the big orange button.",
      selector: '.hero__tooltip',
      position: 'bottom',
      event: 'hover',
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
      text: 'For fixed elements, you know.',
      selector: '.main-header img',
      position: 'top',
      fixed: true,
      event: 'hover',
      style: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderRadius: 0,
        color: '#fff',
        mainColor: '#f04',
        textAlign: 'center',
        width: '29rem'
      }
    });
  }

  onClickStart(e) {
    e.preventDefault();

    this.setState({
      running: true,
      step: 0,
    });
  }

  handleNextButtonClick() {
    if (this.state.step === 1) {
      this.joyride.stop();
      // allow the tooltip time to hide before proceeding to next step and restarting
      setTimeout(() => {
        this.joyride.next();
        this.joyride.start(true);
      }, 100);
    }
  }

  handleJoyrideCallback(result) {
    if (result.type === 'step:before') {
      // Keep internal state in sync with joyride
      this.setState({ step: result.index });
    }

    if (result.type === 'finished' && this.state.running) {
      // Need to set our running state to false, so we can restart if we click start again.
      this.setState({ running: false });
    }
  }

  render() {
    return (
      <div className="demo">
        <Joyride
          ref={c => (this.joyride = c)}
          run={this.state.running}
          steps={this.state.steps}
          stepIndex={this.state.step}
          scrollToFirstStep={true}
          type="continuous"
          disableOverlay={this.state.step === 1}
          callback={this.handleJoyrideCallback}
          debug={false} />
        <header className="main-header">
          <div className="container">
            <a href="#" onClick={e => e.preventDefault()}><span /></a>
            <img src="/logo.svg" alt="Joyride" />
          </div>
        </header>
        <div className="hero">
          <div className="container">
            <div className="hero__content">
              <h1>
                <span>Create walkthroughs and guided tours for your ReactJS apps.</span>
                <a href="#" className="hero__tooltip">?</a>
              </h1>
              <a href="#" className="hero__start" onClick={this.onClickStart}>Let's Go!</a>
            </div>
          </div>
        </div>
        <div className="site__section projects">
          <div className="container">
            <h2><span>Projects</span></h2>
          </div>
        </div>

        <div className="site__section mission">
          <div className="container">
            <h2><span>Mission</span></h2>
            <button className="btn btn-secondary" onClick={this.handleNextButtonClick}>Advance</button>
          </div>
        </div>
        <div className="site__section about">
          <div className="container">
            <h2><span>About</span></h2>
          </div>
        </div>
      </div>
    );
  }
}
