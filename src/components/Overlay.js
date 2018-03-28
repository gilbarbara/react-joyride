import React from 'react';
import PropTypes from 'prop-types';
import treeChanges from 'tree-changes';

import {
  getClientRect,
  getDocumentHeight,
  getElement,
  getElementPosition,
  getScrollParent,
  hasCustomScrollParent,
  isFixed,
} from '../modules/dom';
import { isLegacy } from '../modules/helpers';

import LIFECYCLE from '../constants/lifecycle';

import Hole from './Hole';

export default class Overlay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mouseOverHole: false,
      isScrolling: false,
      showHole: false,
    };
  }

  static propTypes = {
    allowClicksThruHole: PropTypes.bool.isRequired,
    disableOverlay: PropTypes.bool.isRequired,
    disableScrolling: PropTypes.bool.isRequired,
    holePadding: PropTypes.number,
    lifecycle: PropTypes.string.isRequired,
    onClickOverlay: PropTypes.func.isRequired,
    styles: PropTypes.object.isRequired,
    target: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]).isRequired,
  };

  componentDidMount() {
    const { disableScrolling, target } = this.props;

    if (!disableScrolling) {
      const element = getElement(target);
      this.scrollParent = hasCustomScrollParent(element) ? getScrollParent(element) : document;
    }
  }

  componentWillReceiveProps(nextProps) {
    const { isScrolling } = this.state;
    const { allowClicksThruHole, disableScrolling, lifecycle } = nextProps;
    const { changed, changedTo } = treeChanges(this.props, nextProps);

    if (!disableScrolling) {
      if (changedTo('lifecycle', LIFECYCLE.TOOLTIP)) {
        this.scrollParent.addEventListener('scroll', this.handleScroll, { passive: true });

        setTimeout(() => {
          if (!isScrolling) {
            this.setState({ showHole: true });
          }
        }, 30);
      }
    }

    if (changed('allowClicksThruHole') || changed('disableOverlay') || changed('lifecycle')) {
      if (allowClicksThruHole && lifecycle === LIFECYCLE.TOOLTIP) {
        document.addEventListener('mousemove', this.handleMouseMove, false);
      }
      else if (lifecycle !== LIFECYCLE.TOOLTIP) {
        document.removeEventListener('mousemove', this.handleMouseMove);
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(this.scrollTimeout);
    document.removeEventListener('mousemove', this.handleMouseMove);
    this.scrollParent.removeEventListener('scroll', this.handleScroll);
  }

  handleMouseMove = (e) => {
    const { mouseOverHole } = this.state;
    const { height, left, position, top, width } = this.stylesHole;

    const offsetY = position === 'fixed' ? e.clientY : e.pageY;
    const offsetX = position === 'fixed' ? e.clientX : e.pageX;
    const inHoleHeight = (offsetY >= top && offsetY <= top + height);
    const inHoleWidth = (offsetX >= left && offsetX <= left + width);
    const inHole = inHoleWidth && inHoleHeight;

    if (inHole !== mouseOverHole) {
      this.setState({ mouseOverHole: inHole });
    }
  };

  handleScroll = () => {
    if (!this.state.isScrolling) {
      this.setState({ isScrolling: true, showHole: false });
    }

    clearTimeout(this.scrollTimeout);

    this.scrollTimeout = setTimeout(() => {
      clearTimeout(this.scrollTimeout);
      this.setState({ isScrolling: false, showHole: true });
      this.scrollParent.removeEventListener('scroll', this.handleScroll);
    }, 50);
  };

  get stylesHole() {
    const { showHole } = this.state;
    const { allowClicksThruHole, holePadding, styles, target } = this.props;
    const element = getElement(target);
    const elementRect = getClientRect(element);
    const isFixedTarget = isFixed(target);
    const top = getElementPosition(element, holePadding);

    return {
      ...(isLegacy() ? styles.holeLegacy : styles.hole),
      height: Math.round(elementRect.height + (holePadding * 2)),
      left: Math.round(elementRect.left - holePadding),
      opacity: showHole ? 1 : 0,
      pointerEvents: allowClicksThruHole ? 'none' : 'auto',
      position: isFixedTarget ? 'fixed' : 'absolute',
      top,
      transition: 'opacity 0.2s',
      width: Math.round(elementRect.width + (holePadding * 2)),
    };
  }

  render() {
    const { showHole } = this.state;
    const {
      allowClicksThruHole,
      disableOverlay,
      holePadding,
      lifecycle,
      onClickOverlay,
      target,
      styles,
    } = this.props;
    const output = {};

    if (disableOverlay || lifecycle !== LIFECYCLE.TOOLTIP) {
      return null;
    }

    const stylesOverlay = {
      cursor: disableOverlay ? 'default' : 'pointer',
      height: getDocumentHeight(),
      pointerEvents: this.state.mouseOverHole ? 'none' : 'auto',
      ...(isLegacy() ? styles.overlayLegacy : styles.overlay),
    };

    return (
      <div
        className="joyride-overlay"
        style={stylesOverlay}
        onClick={onClickOverlay}
      >
        {showHole && (
          <Hole
            allowClicksThruHole={allowClicksThruHole}
            holePadding={holePadding}
            target={target}
            styles={this.stylesHole}
          />
        )}
        {output.hole}
      </div>
    );
  }
}
