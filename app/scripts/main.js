// Polyfills
import 'core-js/shim';
import 'classlist-polyfill';
import './utils/Polyfills';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/App';

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<App />, document.getElementById('react'));
});
