/*eslint-disable import/imports-first */
// Polyfills
import 'core-js/shim';
import 'classlist-polyfill';
import 'utils/polyfills';

import React from 'react';
import ReactDOM from 'react-dom';
import App from 'containers/App';

import '../styles/main.scss';

export function renderApp(RootComponent) {
  const target = document.getElementById('react');

  /* istanbul ignore if */
  if (target) {
    ReactDOM.render(
      <RootComponent />,
      target
    );
  }
}

renderApp(App);

/* istanbul ignore next  */
if (module.hot) {
  module.hot.accept(
    'containers/App',
    () => renderApp(require('containers/App').default)
  );
}
