import React from 'react';
import PropTypes from 'prop-types';
import isRequiredIf from 'react-proptype-conditional-require';
import Floater from 'react-floater';
import treeChanges from 'tree-changes';
import is from 'is-lite';

import ACTIONS from '../constants/actions';
import LIFECYCLE from '../constants/lifecycle';

import { getElement, isFixed } from '../modules/dom';
import { log } from '../modules/helpers';
import { validateStep } from '../modules/step';

import Beacon from './Beacon';
import Overlay from './Overlay';
import Tooltip from './Tooltip/index';
import JoyridePortal from './Portal';

export default class JoyrideStep extends React.Component {
  static propTypes = {
    action: PropTypes.string.isRequired,
    continuous: PropTypes.bool.isRequired,
    controlled: PropTypes.bool.isRequired,
    debug: PropTypes.bool.isRequired,
    getPopper: PropTypes.func.isRequired,
    helpers: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    lifecycle: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    step: PropTypes.shape({
      beaconComponent: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.element,
      ]),
      content: isRequiredIf(PropTypes.node, props => !props.tooltipComponent && !props.title),
      disableBeacon: PropTypes.bool,
      disableOverlay: PropTypes.bool,
      disableOverlayClicks: PropTypes.bool,
      event: PropTypes.string,
      hideBackButton: PropTypes.bool,
      isFixed: PropTypes.bool,
      locale: PropTypes.object,
      offset: PropTypes.number.isRequired,
      placement: PropTypes.oneOf([
        'top', 'top-start', 'top-end',
        'bottom', 'bottom-start', 'bottom-end',
        'left', 'left-start', 'left-end',
        'right', 'right-start', 'right-end',
        'auto', 'center',
      ]),
      spotlightClicks: PropTypes.bool,
      spotlightPadding: PropTypes.number,
      target: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string,
      ]).isRequired,
      styles: PropTypes.object,
      title: PropTypes.node,
      tooltipComponent: isRequiredIf(PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.element,
      ]), props => !props.content && !props.title),
      tooltipOptions: PropTypes.shape({
        offset: PropTypes.number,
      }),
    }).isRequired,
    update: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { debug, lifecycle } = this.props;

    log({
      title: `step:${lifecycle}`,
      data: [
        { key: 'props', value: this.props },
      ],
      debug,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { action, continuous, debug, index, lifecycle, step, update } = this.props;
    const { changed, changedFrom, changedTo } = treeChanges(this.props, nextProps);
    const skipBeacon = continuous && action !== ACTIONS.CLOSE && (index > 0 || action === ACTIONS.PREV);

    if (changedFrom('lifecycle', LIFECYCLE.INIT, LIFECYCLE.READY)) {
      update({ lifecycle: step.disableBeacon || skipBeacon ? LIFECYCLE.TOOLTIP : LIFECYCLE.BEACON });
    }

    if (changed('index')) {
      log({
        title: `step:${lifecycle}`,
        data: [
          { key: 'props', value: this.props },
        ],
        debug,
      });
    }

    if (changedTo(LIFECYCLE.INIT)) {
      delete this.beaconPopper;
      delete this.tooltipPopper;
    }
  }

  /**
   * Beacon click/hover event listener
   *
   * @param {Event} e
   */
  handleClickHoverBeacon = (e) => {
    const { step, update } = this.props;

    if (e.type === 'mouseenter' && step.event !== 'hover') {
      return;
    }

    update({ lifecycle: LIFECYCLE.TOOLTIP });
  };

  handleClickOverlay = () => {
    const { step } = this.props;

    if (!step.disableOverlayClicks) {
      this.props.helpers.close();
    }
  };

  getPopper = (popper, type) => {
    const { getPopper } = this.props;

    if (type === 'wrapper') {
      this.beaconPopper = popper;
    }
    else {
      this.tooltipPopper = popper;
    }

    getPopper(popper, type);
  };

  get open() {
    const { step, lifecycle } = this.props;

    return !!(step.disableBeacon || lifecycle === LIFECYCLE.TOOLTIP);
  }

  render() {
    const {
      continuous,
      controlled,
      debug,
      helpers,
      index,
      lifecycle,
      size,
      step,
    } = this.props;
    const target = getElement(step.target);

    if (!validateStep(step) || !is.domElement(target)) {
      return null;
    }

    return (
      <div key={`JoyrideStep-${index}`} className="joyride-step">
        <JoyridePortal>
          <Overlay
            {...step}
            lifecycle={lifecycle}
            onClickOverlay={this.handleClickOverlay}
          />
        </JoyridePortal>
        <Floater
          component={(
            <Tooltip
              continuous={continuous}
              controlled={controlled}
              helpers={helpers}
              index={index}
              isLastStep={index + 1 === size}
              step={step}
            />
          )}
          debug={debug}
          getPopper={this.getPopper}
          id={`react-joyride:${index}`}
          positionFixed={step.isFixed || isFixed(target)}
          open={this.open}
          placement={step.placement}
          target={step.target}
          {...step.tooltipOptions}
        >
          <Beacon beaconComponent={step.beaconComponent} onClickOrHover={this.handleClickHoverBeacon} styles={step.styles} />
        </Floater>
      </div>
    );
  }
}
