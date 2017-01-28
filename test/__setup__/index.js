import './polyfills';

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
