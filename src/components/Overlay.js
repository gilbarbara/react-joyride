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
  hasPosition,
} from '../modules/dom';
import { getBrowser, isLegacy, log } from '../modules/helpers';

import LIFECYCLE from '../constants/lifecycle';

import Spotlight from './Spotlight';

export default class JoyrideOverlay extends React.Component {
  _isMounted = false;
  state = {
    mouseOverSpotlight: false,
    isScrolling: false,
    showSpotlight: true,
  };

  static propTypes = {
    debug: PropTypes.bool.isRequired,
    disableOverlay: PropTypes.bool.isRequired,
    disableOverlayClose: PropTypes.bool,
    disableScrolling: PropTypes.bool.isRequired,
    disableScrollParentFix: PropTypes.bool.isRequired,
    lifecycle: PropTypes.string.isRequired,
    onClickOverlay: PropTypes.func.isRequired,
    placement: PropTypes.string.isRequired,
    spotlightClicks: PropTypes.bool.isRequired,
    spotlightPadding: PropTypes.number,
    styles: PropTypes.object.isRequired,
    target: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  };

  componentDidMount() {
    const { debug, disableScrolling, disableScrollParentFix, target } = this.props;
    const element = getElement(target);

    this.scrollParent = getScrollParent(element, disableScrollParentFix, true);
    this._isMounted = true;

    /* istanbul ignore else */
    if (!disableScrolling) {
      /* istanbul ignore else */
      if (process.env.NODE_ENV === 'development' && hasCustomScrollParent(element, true)) {
        log({
          title: 'step has a custom scroll parent and can cause trouble with scrolling',
          data: [{ key: 'parent', value: this.scrollParent }],
          debug,
        });
      }
    }

    window.addEventListener('resize', this.handleResize);
  }

  componentDidUpdate(prevProps) {
    const { lifecycle, spotlightClicks } = this.props;
    const { changed } = treeChanges(prevProps, this.props);

    /* istanbul ignore else */
    if (changed('lifecycle', LIFECYCLE.TOOLTIP)) {
      this.scrollParent.addEventListener('scroll', this.handleScroll, { passive: true });

      setTimeout(() => {
        const { isScrolling } = this.state;

        if (!isScrolling) {
          this.updateState({ showSpotlight: true });
        }
      }, 100);
    }

    if (changed('spotlightClicks') || changed('disableOverlay') || changed('lifecycle')) {
      if (spotlightClicks && lifecycle === LIFECYCLE.TOOLTIP) {
        window.addEventListener('mousemove', this.handleMouseMove, false);
      } else if (lifecycle !== LIFECYCLE.TOOLTIP) {
        window.removeEventListener('mousemove', this.handleMouseMove);
      }
    }
  }

  componentWillUnmount() {
    this._isMounted = false;

    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('resize', this.handleResize);

    clearTimeout(this.resizeTimeout);
    clearTimeout(this.scrollTimeout);
    this.scrollParent.removeEventListener('scroll', this.handleScroll);
  }

  get spotlightStyles() {
    const { showSpotlight } = this.state;
    const { disableScrollParentFix, spotlightClicks, spotlightPadding, styles, target } =
      this.props;
    const element = getElement(target);
    const elementRect = getClientRect(element);
    const isFixedTarget = hasPosition(element);
    const top = getElementPosition(element, spotlightPadding, disableScrollParentFix);

    return {
      ...(isLegacy() ? styles.spotlightLegacy : styles.spotlight),
      height: Math.round(elementRect.height + spotlightPadding * 2),
      left: Math.round(elementRect.left - spotlightPadding),
      opacity: showSpotlight ? 1 : 0,
      pointerEvents: spotlightClicks ? 'none' : 'auto',
      position: isFixedTarget ? 'fixed' : 'absolute',
      top,
      transition: 'opacity 0.2s',
      width: Math.round(elementRect.width + spotlightPadding * 2),
    };
  }

  handleMouseMove = e => {
    const { mouseOverSpotlight } = this.state;
    const { height, left, position, top, width } = this.spotlightStyles;

    const offsetY = position === 'fixed' ? e.clientY : e.pageY;
    const offsetX = position === 'fixed' ? e.clientX : e.pageX;
    const inSpotlightHeight = offsetY >= top && offsetY <= top + height;
    const inSpotlightWidth = offsetX >= left && offsetX <= left + width;
    const inSpotlight = inSpotlightWidth && inSpotlightHeight;

    if (inSpotlight !== mouseOverSpotlight) {
      this.updateState({ mouseOverSpotlight: inSpotlight });
    }
  };

  handleScroll = () => {
    const { target } = this.props;
    const element = getElement(target);

    if (this.scrollParent !== document) {
      const { isScrolling } = this.state;

      if (!isScrolling) {
        this.updateState({ isScrolling: true, showSpotlight: false });
      }

      clearTimeout(this.scrollTimeout);

      this.scrollTimeout = setTimeout(() => {
        this.updateState({ isScrolling: false, showSpotlight: true });
      }, 50);
    } else if (hasPosition(element, 'sticky')) {
      this.updateState({});
    }
  };

  handleResize = () => {
    clearTimeout(this.resizeTimeout);

    this.resizeTimeout = setTimeout(() => {
      if (!this._isMounted) {
        return;
      }

      this.forceUpdate();
    }, 100);
  };

  updateState(state) {
    if (!this._isMounted) {
      return;
    }

    this.setState(state);
  }

  render() {
    const { mouseOverSpotlight, showSpotlight } = this.state;
    const { disableOverlay, disableOverlayClose, lifecycle, onClickOverlay, placement, styles } =
      this.props;

    if (disableOverlay || lifecycle !== LIFECYCLE.TOOLTIP) {
      return null;
    }

    let baseStyles = styles.overlay;

    /* istanbul ignore else */
    if (isLegacy()) {
      baseStyles = placement === 'center' ? styles.overlayLegacyCenter : styles.overlayLegacy;
    }

    const stylesOverlay = {
      cursor: disableOverlayClose ? 'default' : 'pointer',
      height: getDocumentHeight(),
      pointerEvents: mouseOverSpotlight ? 'none' : 'auto',
      ...baseStyles,
    };

    let spotlight = placement !== 'center' && showSpotlight && (
      <Spotlight styles={this.spotlightStyles} />
    );

    // Hack for Safari bug with mix-blend-mode with z-index
    if (getBrowser() === 'safari') {
      const { mixBlendMode, zIndex, ...safarOverlay } = stylesOverlay;

      spotlight = <div style={{ ...safarOverlay }}>{spotlight}</div>;
      delete stylesOverlay.backgroundColor;
    }

    return (
      <div className="react-joyride__overlay" style={stylesOverlay} onClick={onClickOverlay}>
        {spotlight}
      </div>
    );
  }
}
