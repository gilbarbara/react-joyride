// Polyfills
import 'core-js/modules/es6.promise';
import 'core-js/modules/es6.array.from';
import 'core-js/modules/es6.object.assign';
import 'classlist-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/App';

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<App />, document.getElementById('react'));
});
