import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { canUseDOM, isReact16 } from '../modules/helpers';

export default class JoyridePortal extends React.Component {
  static propTypes = {
    children: PropTypes.element,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  };

  componentDidMount() {
    if (!canUseDOM) return;

    if (!isReact16) {
      this.renderReact15();
    }
  }

  componentDidUpdate() {
    if (!canUseDOM) return;

    if (!isReact16) {
      this.renderReact15();
    }
  }

  componentWillUnmount() {
    if (!canUseDOM || !this.node) return;

    if (!isReact16) {
      ReactDOM.unmountComponentAtNode(this.node);
    }

    if (this.node.parentNode === document.body) {
      document.body.removeChild(this.node);
      this.node = undefined;
    }
  }

  appendNode() {
    const { id } = this.props;

    if (!this.node) {
      this.node = document.createElement('div');

      /* istanbul ignore else */
      if (id) {
        this.node.id = id;
      }

      document.body.appendChild(this.node);
    }
  }

  renderReact15() {
    if (!canUseDOM) return null;

    const { children } = this.props;

    if (!this.node) {
      this.appendNode();
    }

    ReactDOM.unstable_renderSubtreeIntoContainer(this, children, this.node);

    return null;
  }

  renderReact16() {
    if (!canUseDOM || !isReact16) return null;

    const { children } = this.props;

    if (!this.node) {
      this.appendNode();
    }

    return ReactDOM.createPortal(children, this.node);
  }

  render() {
    if (!isReact16) {
      return null;
    }

    return this.renderReact16();
  }
}
