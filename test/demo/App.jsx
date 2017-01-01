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
          text: 'Can be advanced by clicking an element in an overlay hole.',
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
              offsetX: 15
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
      text: "Let's go on a magical tour",
      selector: '.hero h3 span',
      position: 'bottom',
      event: 'hover',
      style: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderRadius: 0,
        color: '#fff',
        mainColor: '#ff67b4',
        textAlign: 'center',
        width: '20rem'
      }
    });
  }

  onClickStart(e) {
    const state = this.state;
    e.preventDefault();

    if (!state.running && state.steps.length) {
      this.setState({
        running: true
      });

      this.joyride.start();
      return;
    }

    this.joyride.reset(true);
  }

  handleNextButtonClick() {
    if (this.state.step === 1) {
      this.joyride.stop();
      // allow the tooltip time to hide before proceeding to next step and restarting
      setTimeout(() => {
        this.joyride.next();
        this.joyride.start();
      }, 100);
    }
  }

  handleJoyrideCallback(result) {
    if (result.type === 'step:before') {
      this.setState({ step: result.index });
    }
  }

  render() {
    return (
      <div className="demo">
        <Joyride
          ref={c => (this.joyride = c)}
          steps={this.state.steps}
          scrollToFirstStep={true}
          disableOverlay={this.state.step === 1}
          callback={this.handleJoyrideCallback}
          debug={false} />
        <div className="hero">
          <div className="container">
            <h1>My super awesome catchy title</h1>
            <h3><span>Let's Talk?</span><a href="#" onClick={this.onClickStart}>&raquo;</a></h3>
          </div>
        </div>
        <div className="site__section projects">
          <div className="container">
            <h2><span>Projects</span></h2>
          </div>
        </div>

        <div className="site__section mission">
          <div className="container">
            <h2><span>Mission</span></h2><button onClick={this.handleNextButtonClick}>Advance</button>
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
