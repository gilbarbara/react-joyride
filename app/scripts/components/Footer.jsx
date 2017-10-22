import React from 'react';
import PropTypes from 'prop-types';
import PackageJSON from '../../../package.json';

export default class Footer extends React.Component {
  static propTypes = {
    addTooltip: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.addTooltip({
      title: 'A fixed tooltip',
      text: 'You can have fixed tooltips too!',
      selector: '.main-footer h4',
      position: 'bottom',
      event: 'click',
      isFixed: true,
      style: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: '#fff',
        mainColor: '#ff0044',
        width: '29rem',
        header: {
          color: '#ff0044',
          textTransform: 'uppercase',
          textAlign: 'center',
        },
      },
    });
  }

  render() {
    return (
      <footer className="main-footer">
        <h4>React-Joyride v{PackageJSON.version}</h4>
        <div>
          <iframe
            title="GitHub repo"
            src="https://ghbtns.com/github-btn.html?user=gilbarbara&repo=react-joyride&type=star&count=true"
            frameBorder="0"
            scrolling="0" width="92px" height="20px"
          />
        </div>
      </footer>
    );
  }
}
