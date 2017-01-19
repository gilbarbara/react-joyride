import React from 'react';
import Joyride from '../../src/scripts/Joyride';

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
          position: 'top',
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
              offsetX: 20
            },
          }
        },
        {
          text: "Text only steps — Because sometimes you don't really need a proper heading",
          selector: '.demo__footer a',
          position: 'top',
          isFixed: true,
          style: {
            beacon: {
              offsetY: 15
            }
          }
        },
        {
          title: 'First Project Completed Date',
          text: 'This is when the first project was completed',
          textAlign: 'center',
          selector: '.table table tr:nth-child(1) td:nth-child(3)',
          position: 'top',
          scrollContainerSelector: '.table-wrapper'
        },
        {
          title: 'Mid Random Content',
          text: 'Target a cell near the end to scroll the child container down and to the right',
          textAlign: 'center',
          selector: '.table table tr:nth-child(8) td:nth-child(9)',
          position: 'top',
          scrollContainerSelector: '.table-wrapper'
        },
        {
          title: 'Last Project',
          text: 'Select a cell towards the front of the table to scroll the child down and to the left',
          textAlign: 'center',
          selector: '.table table tr:nth-child(15) td:nth-child(4)',
          position: 'top',
          scrollContainerSelector: '.table-wrapper'
        },
        {
          title: 'Last Project - Next Cell',
          text: 'Since this should already be in view, the container should not have scrolled',
          textAlign: 'center',
          selector: '.table table tr:nth-child(15) td:nth-child(5)',
          position: 'top',
          scrollContainerSelector: '.table-wrapper'
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
      text: 'For fixed elements, you know?',
      selector: '.demo__footer img',
      position: 'top',
      isFixed: true,
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
      this.joyride.next();
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

    if (result.type === 'error:target_not_found') {
      this.setState({
        step: result.action === 'back' ? result.index - 1 : result.index + 1,
        autoStart: result.action !== 'close' && result.action !== 'esc',
      });
    }

    if (result.type === 'step:after') {
      this.setState({ autoStart: false });
    }
  }

  render() {
    let sampleProjects = [];
    let contentRows = [];
    for (let i = 4; i <= 10; i++) {
      contentRows.push(<td key={'content_' + i}>Content {i}</td>);
    }

    for (let i = 1; i <= 15; i++) {
      sampleProjects.push(
        <tr key={i}>
          <td>Test Project {i}</td>
          <td>Leon Kennedy</td>
          <td>01-01-20{i < 10 ? '0' + i : i}</td>
          {contentRows}
        </tr>
      );
    }

    return (
      <div className="demo">
        <Joyride
          autoStart={this.state.autoStart}
          callback={this.handleJoyrideCallback}
          debug={false}
          disableOverlay={this.state.step === 1}
          ref={c => (this.joyride = c)}
          run={this.state.running}
          scrollToFirstStep={true}
          showSkipButton={true}
          stepIndex={this.state.step}
          steps={this.state.steps}
          type="continuous" />
        <main>
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
          <div className="demo__section projects">
            <div className="container">
              <h2><span>Projects</span></h2>
              <div className="list">
                <div>
                  <img src="http://placehold.it/800x600/ff0044/ffffff?txtsize=50&text=ASBESTOS" role="presentation" />
                </div>
                <div>
                  <img src="http://placehold.it/800x600/00ff44/ffffff?txtsize=50&text=GROW" role="presentation" />
                </div>
                <div>
                  <img src="http://placehold.it/800x600/333/ffffff?txtsize=50&text=∂Vo∑" role="presentation" />
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

          <div className="container">
            <div className="table-wrapper table">
              <table>
                <thead>
                  <tr>
                    <th>Project Name</th>
                    <th>Creator</th>
                    <th>Date Completed</th>
                    <th>Column 4</th>
                    <th>Column 5</th>
                    <th>Column 6</th>
                    <th>Column 7</th>
                    <th>Column 8</th>
                    <th>Column 9</th>
                    <th>Column 10</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleProjects}
                </tbody>
              </table>
            </div>
          </div>
        </main>
        <footer className="demo__footer">
          <div className="container">
            <a href="#" onClick={e => e.preventDefault()}><span /></a>
            <img src="/logo.svg" alt="Joyride" />
          </div>
        </footer>
      </div>
    );
  }
}
