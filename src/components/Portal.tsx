import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createRoot, type Root } from 'react-dom/client';

import { canUseDOM } from '~/modules/dom';
import { isReact16 } from '~/modules/helpers';

interface Props {
  children: React.ReactElement;
  id: string;
}

export default class JoyridePortal extends React.Component<Props> {
  node: HTMLElement | null = null;
  rootNode: Root | null = null;

  componentDidMount() {
    const { id } = this.props;

    if (!canUseDOM()) {
      return;
    }

    this.node = document.createElement('div');
    this.node.id = id;

    document.body.appendChild(this.node);

    if (!isReact16) {
      throw new Error('react-joyride requires React 16.3 or later.');
    }
  }

  componentDidUpdate() {
    if (!canUseDOM()) {
      return;
    }

    if (!isReact16) {
      throw new Error('react-joyride requires React 16.3 or later.');
    }
  }

  componentWillUnmount() {
    if (!canUseDOM() || !this.node) {
      return;
    }

    if (!isReact16) {
      this.rootNode?.unmount();
    }

    if (this.node.parentNode === document.body) {
      document.body.removeChild(this.node);
      this.node = null;
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

    this.rootNode = createRoot(this.node);

    return ReactDOM.createPortal(children, this.node);
  }

  render() {
    if (!isReact16) {
      return null;
    }

    return this.renderReact16();
  }
}
