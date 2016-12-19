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
        },
        {
          title: 'Mid Project',
          text: 'Mid project completed',
          textAlign: 'center',
          selector: '.table table tr:nth-child(8) td:nth-child(6)',
          position: 'top',
          scrollContainerSelector: '.table-wrapper'
        },
        {
          title: 'Last Project',
          text: 'Last project completed',
          textAlign: 'center',
          selector: '.table table tr:nth-child(15) td:nth-child(4)',
          position: 'top',
          scrollContainerSelector: '.table-wrapper'
        },
        {
          title: 'Last Project 2',
          text: 'Last project completed other field',
          textAlign: 'center',
          selector: '.table table tr:nth-child(15) td:nth-child(5)',
          position: 'top',
          scrollContainerSelector: '.table-wrapper'
        }
      ]
    };

    this.onClickStart = this.onClickStart.bind(this);
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

  render() {
    let sampleProjects = [];
    for (let i = 1; i <= 15; i++) {
      sampleProjects.push(
        <tr key={i}>
          <td>Test Project {i}</td>
          <td>Leon Kennedy</td>
          <td>01-01-20{i < 10 ? '0' + i : i}</td>
          <td>Content 4</td>
          <td>Content 5</td>
          <td>Content 6</td>
          <td>Content 7</td>
          <td>Content 8</td>
          <td>Content 9</td>
          <td>Content 10</td>
        </tr>
      );
    }

    return (
      <div className="demo">
        <Joyride
          ref={c => (this.joyride = c)}
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
      </div>
    );
  }
}
