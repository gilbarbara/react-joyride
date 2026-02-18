import { Link } from 'react-router-dom';

import Maze from './Maze';

function Footer() {
  return (
    <footer
      className="fixed bottom-0 left-0 right-0 flex items-center bg-white gap-2 h-16 px-4 z-50"
      role="contentinfo"
    >
      <div className="flex items-center gap-2">
        <Maze />
        <a href="https://docs.react-joyride.com" rel="noopener noreferrer" target="_blank">
          Docs
        </a>
      </div>
      <div className="flex flex-wrap flex-1 items-center justify-center gap-2">
        <Link to="/">Basic</Link>
        <Link to="/multi-route">Multi Route</Link>
        <Link to="/controlled">Controlled</Link>
        <Link to="/custom">Custom</Link>
        <Link to="/carousel">Carousel</Link>
        <Link to="/modal">Modal</Link>
        <Link to="/scroll">Scroll</Link>
      </div>
    </footer>
  );
}

export default Footer;
