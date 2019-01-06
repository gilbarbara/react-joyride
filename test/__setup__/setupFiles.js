import Enzyme, { shallow, mount, render } from 'enzyme';
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

global.shallow = shallow;
global.mount = mount;
global.render = render;

const react = document.createElement('div');
react.id = 'react';
react.style.height = '100vh';
document.body.appendChild(react);

window.requestAnimationFrame = callback => {
  setTimeout(callback, 0);
};

window.matchMedia = () => ({
  matches: false,
  addListener: () => {},
  removeListener: () => {},
});
