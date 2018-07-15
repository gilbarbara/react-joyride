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
import { getBrowser, isLegacy } from '../modules/helpers';

import LIFECYCLE from '../constants/lifecycle';

import Spotlight from './Spotlight';

export default class Overlay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mouseOverSpotlight: false,
      isScrolling: false,
      showSpotlight: props.disableScrolling,
    };
  }

  static propTypes = {
    disableOverlay: PropTypes.bool.isRequired,
    disableScrolling: PropTypes.bool.isRequired,
    lifecycle: PropTypes.string.isRequired,
    onClickOverlay: PropTypes.func.isRequired,
    placement: PropTypes.string.isRequired,
    spotlightClicks: PropTypes.bool.isRequired,
    spotlightPadding: PropTypes.number,
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

    window.addEventListener('resize', this.handleResize);
  }

  componentWillReceiveProps(nextProps) {
    const { disableScrolling, lifecycle, spotlightClicks } = nextProps;
    const { changed, changedTo } = treeChanges(this.props, nextProps);

    if (!disableScrolling) {
      if (changedTo('lifecycle', LIFECYCLE.TOOLTIP)) {
        this.scrollParent.addEventListener('scroll', this.handleScroll, { passive: true });

        setTimeout(() => {
          const { isScrolling } = this.state;

          if (!isScrolling) {
            this.setState({ showSpotlight: true });
            this.scrollParent.removeEventListener('scroll', this.handleScroll);
          }
        }, 100);
      }
    }

    if (changed('spotlightClicks') || changed('disableOverlay') || changed('lifecycle')) {
      if (spotlightClicks && lifecycle === LIFECYCLE.TOOLTIP) {
        window.addEventListener('mousemove', this.handleMouseMove, false);
      }
      else if (lifecycle !== LIFECYCLE.TOOLTIP) {
        window.removeEventListener('mousemove', this.handleMouseMove);
      }
    }
  }

  componentWillUnmount() {
    const { disableScrolling } = this.props;

    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('resize', this.handleResize);

    if (!disableScrolling) {
      clearTimeout(this.scrollTimeout);
      this.scrollParent.removeEventListener('scroll', this.handleScroll);
    }
  }

  handleMouseMove = (e) => {
    const { mouseOverSpotlight } = this.state;
    const { height, left, position, top, width } = this.stylesSpotlight;

    const offsetY = position === 'fixed' ? e.clientY : e.pageY;
    const offsetX = position === 'fixed' ? e.clientX : e.pageX;
    const inSpotlightHeight = (offsetY >= top && offsetY <= top + height);
    const inSpotlightWidth = (offsetX >= left && offsetX <= left + width);
    const inSpotlight = inSpotlightWidth && inSpotlightHeight;

    if (inSpotlight !== mouseOverSpotlight) {
      this.setState({ mouseOverSpotlight: inSpotlight });
    }
  };

  handleScroll = () => {
    const { isScrolling } = this.state;

    if (!isScrolling) {
      this.setState({ isScrolling: true, showSpotlight: false });
    }

    clearTimeout(this.scrollTimeout);

    this.scrollTimeout = setTimeout(() => {
      clearTimeout(this.scrollTimeout);
      this.setState({ isScrolling: false, showSpotlight: true });
      this.scrollParent.removeEventListener('scroll', this.handleScroll);
    }, 50);
  };

  handleResize = () => {
    clearTimeout(this.resizeTimeout);

    this.resizeTimeout = setTimeout(() => {
      clearTimeout(this.resizeTimeout);
      this.forceUpdate();
    }, 100);
  };

  get stylesSpotlight() {
    const { showSpotlight } = this.state;
    const { spotlightClicks, spotlightPadding, styles, target } = this.props;
    const element = getElement(target);
    const elementRect = getClientRect(element);
    const isFixedTarget = isFixed(element);
    const top = getElementPosition(element, spotlightPadding);

    return {
      ...(isLegacy() ? styles.spotlightLegacy : styles.spotlight),
      height: Math.round(elementRect.height + (spotlightPadding * 2)),
      left: Math.round(elementRect.left - spotlightPadding),
      opacity: showSpotlight ? 1 : 0,
      pointerEvents: spotlightClicks ? 'none' : 'auto',
      position: isFixedTarget ? 'fixed' : 'absolute',
      top,
      transition: 'opacity 0.2s',
      width: Math.round(elementRect.width + (spotlightPadding * 2)),
    };
  }

  render() {
    const { mouseOverSpotlight, showSpotlight } = this.state;
    const {
      disableOverlay,
      lifecycle,
      onClickOverlay,
      placement,
      styles,
    } = this.props;

    if (disableOverlay || lifecycle !== LIFECYCLE.TOOLTIP) {
      return null;
    }

    const stylesOverlay = {
      cursor: disableOverlay ? 'default' : 'pointer',
      height: getDocumentHeight(),
      pointerEvents: mouseOverSpotlight ? 'none' : 'auto',
      ...(isLegacy() ? styles.overlayLegacy : styles.overlay),
    };

    let spotlight = placement !== 'center' && showSpotlight && (
      <Spotlight styles={this.stylesSpotlight} />
    );

    // Hack for Safari bug with mix-blend-mode with z-index
    if (getBrowser() === 'safari') {
      const { mixBlendMode, zIndex, ...safarOverlay } = stylesOverlay;

      spotlight = (
        <div style={{ ...safarOverlay }}>
          {spotlight}
        </div>
      );
      delete stylesOverlay.backgroundColor;
    }

    return (
      <div
        className="joyride-overlay"
        style={stylesOverlay}
        onClick={onClickOverlay}
      >
        {spotlight}
      </div>
    );
  }
}
