import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { canUseDOM, isReact16 } from '../modules/helpers';

export default class JoyridePortal extends React.Component {
  constructor(props) {
    super(props);

    if (!canUseDOM) return;

    this.node = document.createElement('div');

    /* istanbul ignore else */
    if (props.id) {
      this.node.id = props.id;
    }

    document.body.appendChild(this.node);
  }

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

    document.body.removeChild(this.node);
  }

  renderReact15() {
    if (!canUseDOM) return null;

    const { children } = this.props;

    ReactDOM.unstable_renderSubtreeIntoContainer(this, children, this.node);

    return null;
  }

  renderReact16() {
    if (!canUseDOM || !isReact16) return null;

    const { children } = this.props;

    return ReactDOM.createPortal(children, this.node);
  }

  render() {
    if (!isReact16) {
      return null;
    }

    return this.renderReact16();
  }
}
