import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createRoot, Root } from 'react-dom/client';

import { canUseDOM } from '~/modules/dom';
import { isReact16 } from '~/modules/helpers';

interface Props {
  children: React.ReactElement;
  id: string;
}

export default class JoyridePortal extends React.Component<Props> {
  node: HTMLElement | null = null;
  root: Root | null = null;

  componentDidMount() {
    const { id } = this.props;

    if (!canUseDOM()) {
      return;
    }

    this.node = document.createElement('div');
    this.node.id = id;
    this.root = createRoot(this.node);

    document.body.appendChild(this.node);

    if (!isReact16) {
      this.renderReact15();
    }
  }

  componentDidUpdate() {
    if (!canUseDOM()) {
      return;
    }

    if (!isReact16) {
      this.renderReact15();
    }
  }

  componentWillUnmount() {
    if (!canUseDOM() || !this.node) {
      return;
    }

    if (!isReact16) {
      // eslint-disable-next-line react/no-deprecated
      ReactDOM.unmountComponentAtNode(this.node);
    }

    if (this.node.parentNode === document.body) {
      this.root?.unmount();
      this.node = null;
    }
  }

  renderReact15() {
    if (!canUseDOM()) {
      return;
    }

    const { children } = this.props;

    if (this.node) {
      ReactDOM.createPortal(children, this.node);
    }
  }

  renderReact16() {
    if (!canUseDOM() || !isReact16) {
      return null;
    }

    const { children } = this.props;

    if (!this.node) {
      return null;
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
