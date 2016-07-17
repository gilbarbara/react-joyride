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
          text: 'Or some other marketing bullshit terms',
          selector: '.mission h2 span',
          position: 'bottom',
          style: {
            beacon: {
              offsetY: 20
            }
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
      ]
    };

    this.onClickStart = this.onClickStart.bind(this);
  }

  componentDidMount() {
    this.refs.joyride.addTooltip({
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

      this.refs.joyride.start();
      return;
    }

    this.refs.joyride.reset(true);
  }

  render() {
    return (
      <div className="demo">
        <Joyride
          ref="joyride"
          steps={this.state.steps}
          scrollToFirstStep={true}
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
            <h2><span>Mission</span></h2>
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
