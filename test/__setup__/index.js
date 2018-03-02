import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

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
