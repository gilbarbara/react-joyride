import React from 'react';
import ReactDOM from 'react-dom';
import App from './src/App';

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
    './src/App',
    () => renderApp(require('./src/App').default)
  );
}
