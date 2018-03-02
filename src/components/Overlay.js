import React from 'react';
import PropTypes from 'prop-types';
import treeChanges from 'tree-changes';

import { getElement, getOffsetBoundingClientRect, isFixed } from '../modules/dom';
import { isLegacy } from '../modules/helpers';

import LIFECYCLE from '../constants/lifecycle';

import Hole from './Hole';

export default class Overlay extends React.Component {
  state = {
    mouseOverHole: false,
  };

  static propTypes = {
    allowClicksThruHole: PropTypes.bool.isRequired,
    disableOverlay: PropTypes.bool.isRequired,
    holePadding: PropTypes.number,
    lifecycle: PropTypes.string.isRequired,
    offsetParent: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]).isRequired,
    onClickOverlay: PropTypes.func.isRequired,
    styles: PropTypes.object.isRequired,
    target: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]).isRequired,
  };

  componentDidMount() {
    const { allowClicksThruHole, disableOverlay } = this.props;

    if (!disableOverlay && allowClicksThruHole) {
      document.addEventListener('mousemove', this.handleMouseMove, false);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { allowClicksThruHole, disableOverlay } = nextProps;
    const { changed } = treeChanges(this.props, nextProps);

    if (changed('disableOverlay')) {
      if (!disableOverlay && allowClicksThruHole) {
        document.addEventListener('mousemove', this.handleMouseMove, false);
      }
      else {
        document.removeEventListener('mousemove', this.handleMouseMove, false);
      }
    }

    if (changed('allowClicksThruHole')) {
      if (allowClicksThruHole) {
        document.addEventListener('mousemove', this.handleMouseMove, false);
      }
      else {
        document.removeEventListener('mousemove', this.handleMouseMove, false);
      }
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.handleMouseMove, false);
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

  get stylesHole() {
    const { allowClicksThruHole, holePadding, offsetParent, target, styles } = this.props;

    const rect = getOffsetBoundingClientRect(getElement(target), getElement(offsetParent));
    const isFixedTarget = isFixed(target);

    return {
      ...(isLegacy() ? styles.holeLegacy : styles.hole),
      height: Math.round(rect.height + (holePadding * 2)),
      left: Math.round(rect.left - holePadding),
      pointerEvents: allowClicksThruHole ? 'none' : 'auto',
      position: isFixedTarget ? 'fixed' : 'absolute',
      top: Math.round((rect.top - (isFixedTarget ? 0 : document.body.getBoundingClientRect().top)) - holePadding),
      width: Math.round(rect.width + (holePadding * 2)),
    };
  }

  render() {
    const {
      allowClicksThruHole,
      disableOverlay,
      holePadding,
      lifecycle,
      offsetParent,
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
      height: document.body.clientHeight,
      pointerEvents: this.state.mouseOverHole ? 'none' : 'auto',
      ...(isLegacy() ? styles.overlayLegacy : styles.overlay),
    };

    return (
      <div
        className="joyride-overlay"
        style={stylesOverlay}
        onClick={onClickOverlay}
      >
        <Hole
          allowClicksThruHole={allowClicksThruHole}
          holePadding={holePadding}
          offsetParent={offsetParent}
          target={target}
          styles={this.stylesHole}
        />
        {output.hole}
      </div>
    );
  }
}
