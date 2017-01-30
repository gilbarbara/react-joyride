import React from 'react';
import PackageJSON from '../../../package.json';

const Footer = () =>
  (<div className="main-footer">
    <div>React-Joyride v{PackageJSON.version}</div>
    <div>
      <iframe
        src="https://ghbtns.com/github-btn.html?user=gilbarbara&repo=react-joyride&type=star&count=true"
        frameBorder="0"
        scrolling="0" width="92px" height="20px"
      />
    </div>
  </div>);

export default Footer;
