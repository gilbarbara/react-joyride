import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import './polyfills';

Enzyme.configure({ adapter: new Adapter() });

Object.defineProperty(window.location, 'href', {
  writable: true,
  value: 'http://localhost:3000/',
});

Object.defineProperty(window.location, 'pathname', {
  writable: true,
  value: '/',
});

Object.defineProperty(window.location, 'search', {
  writable: true,
  value: '',
});

Object.defineProperty(window, 'open', {
  writable: true,
  value: '',
});

Object.defineProperty(Element.prototype, 'clientHeight', {
  writable: true,
  value: '',
});

Object.defineProperty(Element.prototype, 'clientWidth', {
  writable: true,
  value: '',
});

const react = document.createElement('div');
react.id = 'react';
react.style.height = '100vh';
document.body.appendChild(react);

window.matchMedia = () =>
  ({
    matches: false,
    addListener: () => {
    },
    removeListener: () => {
    },
  });
