import React from 'react';
import SVG from 'react-inlinesvg';

class Header extends React.Component {
  static propTypes = {
    addTooltip: React.PropTypes.func.isRequired,
    joyrideOverlay: React.PropTypes.bool.isRequired,
    joyrideType: React.PropTypes.string.isRequired,
    onClickSwitch: React.PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.props.addTooltip({
      title: 'Standalone Tooltips',
      text: '<h2 style="margin-bottom: 10px; line-height: 1.6">Now you can open tooltips independently!</h2>And even style them one by one!',
      selector: '.intro h3 a',
      position: 'bottom',
      event: 'hover',
      style: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderRadius: 0,
        color: '#fff',
        mainColor: '#ff67b4',
        textAlign: 'center',
        width: '29rem',
      },
    });

    this.props.addTooltip({
      text: 'Change how you want to play the tour',
      selector: '.sw-right',
      trigger: '.sw-right span a',
      position: 'bottom',
      style: {
        backgroundColor: '#E6F212',
        borderRadius: '0.5rem',
        color: '#000',
        textAlign: 'center',
        width: '18rem',
      },
    });
  }

  render() {
    const {
      joyrideOverlay,
      joyrideType,
      onClickSwitch,
    } = this.props;

    return (
      <header className="main-header">
        <div className="container">
          <div className="intro">
            <SVG src={require('assets/media/logo.svg')}>
              <img src={require('assets/media/logo.png')} alt="React Joyride" />
            </SVG>
            <h2>Create walkthroughs and guided tours for your ReactJS apps.</h2>
            <h3>Now with standalone tooltips!
              <a href="#tooltip"><i className="fa fa-question-circle" /></a></h3>
          </div>

          <div className="row row-menu">
            <div className="col-5 col-md-4">
              <div className="switch-wrapper">
                <span>Overlay</span>
                <div className="switch">
                  <a
                    href="#overlay"
                    className={joyrideOverlay ? 'active' : ''}
                    data-key="joyrideOverlay"
                    data-type="active"
                    onClick={onClickSwitch}
                  >On</a>
                  <a
                    href="#overlay"
                    className={!joyrideOverlay ? 'active' : ''}
                    data-key="joyrideOverlay"
                    data-type="disabled"
                    onClick={onClickSwitch}
                  >Off</a>
                </div>
              </div>
            </div>
            <div className="col-7 col-md-4">
              <div className="switch-wrapper sw-right">
                <span>Tour Type<a href="#tooltip"><i className="fa fa-question-circle" /></a></span>

                <div className="switch">
                  <a
                    href="#type" className={joyrideType === 'continuous' ? 'active' : ''}
                    data-key="joyrideType"
                    data-type="continuous"
                    onClick={onClickSwitch}
                  >Continuous</a>
                  <a
                    href="#type" className={joyrideType === 'single' ? 'active' : ''}
                    data-key="joyrideType"
                    data-type="single"
                    onClick={onClickSwitch}
                  >Single</a>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4 github">
              <a href="https://github.com/gilbarbara/react-joyride">
                <SVG src={require('assets/media/github.svg')} />
              </a>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
