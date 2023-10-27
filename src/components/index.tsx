import * as React from 'react';
import { Props as FloaterProps } from 'react-floater';
import isEqual from '@gilbarbara/deep-equal';
import is from 'is-lite';
import treeChanges from 'tree-changes';

import {
  canUseDOM,
  getElement,
  getScrollParent,
  getScrollTo,
  hasCustomScrollParent,
  scrollTo,
} from '~/modules/dom';
import { log, shouldScroll } from '~/modules/helpers';
import { getMergedStep, validateSteps } from '~/modules/step';
import createStore from '~/modules/store';

import { ACTIONS, EVENTS, LIFECYCLE, STATUS } from '~/literals';

import { defaultProps } from '~/defaults';
import { Actions, CallBackProps, Props, State, Status, StoreHelpers } from '~/types';

import Step from './Step';

class Joyride extends React.Component<Props, State> {
  private readonly helpers: StoreHelpers;
  private readonly store: ReturnType<typeof createStore>;
  private beaconPopper: any;
  private tooltipPopper: any;

  static defaultProps = defaultProps;

  constructor(props: Props) {
    super(props);

    const { debug, getHelpers, run, stepIndex } = props;

    this.store = createStore({
      ...props,
      controlled: run && is.number(stepIndex),
    });
    this.helpers = this.store.getHelpers();

    const { addListener } = this.store;

    log({
      title: 'init',
      data: [
        { key: 'props', value: this.props },
        { key: 'state', value: this.state },
      ],
      debug,
    });

    // Sync the store to this component's state.
    addListener(this.syncState);

    if (getHelpers) {
      getHelpers(this.helpers);
    }

    this.state = this.store.getState();
  }

  componentDidMount() {
    if (!canUseDOM()) {
      return;
    }

    const { debug, disableCloseOnEsc, run, steps } = this.props;
    const { start } = this.store;

    if (validateSteps(steps, debug) && run) {
      start();
    }

    /* istanbul ignore else */
    if (!disableCloseOnEsc) {
      document.body.addEventListener('keydown', this.handleKeyboard, { passive: true });
    }
  }

  componentDidUpdate(previousProps: Props, previousState: State) {
    if (!canUseDOM()) {
      return;
    }

    const { action, controlled, index, lifecycle, status } = this.state;
    const { debug, run, stepIndex, steps } = this.props;
    const { stepIndex: previousStepIndex, steps: previousSteps } = previousProps;
    const { reset, setSteps, start, stop, update } = this.store;
    const { changed: changedProps } = treeChanges(previousProps, this.props);
    const { changed, changedFrom } = treeChanges(previousState, this.state);
    const step = getMergedStep(steps[index], this.props);

    const stepsChanged = !isEqual(previousSteps, steps);
    const stepIndexChanged = is.number(stepIndex) && changedProps('stepIndex');
    const target = getElement(step.target);

    if (stepsChanged) {
      if (validateSteps(steps, debug)) {
        setSteps(steps);
      } else {
        // eslint-disable-next-line no-console
        console.warn('Steps are not valid', steps);
      }
    }

    /* istanbul ignore else */
    if (changedProps('run')) {
      if (run) {
        start(stepIndex);
      } else {
        stop();
      }
    }

    /* istanbul ignore else */
    if (stepIndexChanged) {
      let nextAction: Actions =
        is.number(previousStepIndex) && previousStepIndex < stepIndex ? ACTIONS.NEXT : ACTIONS.PREV;

      if (action === ACTIONS.STOP) {
        nextAction = ACTIONS.START;
      }

      if (!([STATUS.FINISHED, STATUS.SKIPPED] as Array<Status>).includes(status)) {
        update({
          action: action === ACTIONS.CLOSE ? ACTIONS.CLOSE : nextAction,
          index: stepIndex,
          lifecycle: LIFECYCLE.INIT,
        });
      }
    }

    // Update the index if the first step is not found
    if (!controlled && status === STATUS.RUNNING && index === 0 && !target) {
      this.store.update({ index: index + 1 });
      this.callback({
        ...this.state,
        type: EVENTS.TARGET_NOT_FOUND,
        step,
      });
    }

    const callbackData = {
      ...this.state,
      index,
      step,
    };
    const isAfterAction = changed('action', [
      ACTIONS.NEXT,
      ACTIONS.PREV,
      ACTIONS.SKIP,
      ACTIONS.CLOSE,
    ]);

    if (isAfterAction && changed('status', STATUS.PAUSED)) {
      const previousStep = getMergedStep(steps[previousState.index], this.props);

      this.callback({
        ...callbackData,
        index: previousState.index,
        lifecycle: LIFECYCLE.COMPLETE,
        step: previousStep,
        type: EVENTS.STEP_AFTER,
      });
    }

    if (changed('status', [STATUS.FINISHED, STATUS.SKIPPED])) {
      const previousStep = getMergedStep(steps[previousState.index], this.props);

      if (!controlled) {
        this.callback({
          ...callbackData,
          index: previousState.index,
          lifecycle: LIFECYCLE.COMPLETE,
          step: previousStep,
          type: EVENTS.STEP_AFTER,
        });
      }

      this.callback({
        ...callbackData,
        type: EVENTS.TOUR_END,
        // Return the last step when the tour is finished
        step: previousStep,
        index: previousState.index,
      });
      reset();
    } else if (changedFrom('status', [STATUS.IDLE, STATUS.READY], STATUS.RUNNING)) {
      this.callback({
        ...callbackData,
        type: EVENTS.TOUR_START,
      });
    } else if (changed('status') || changed('action', ACTIONS.RESET)) {
      this.callback({
        ...callbackData,
        type: EVENTS.TOUR_STATUS,
      });
    }

    this.scrollToStep(previousState);

    if (step.placement === 'center' && status === STATUS.RUNNING && lifecycle === LIFECYCLE.INIT) {
      this.store.update({ lifecycle: LIFECYCLE.READY });
    }
  }

  componentWillUnmount() {
    const { disableCloseOnEsc } = this.props;

    /* istanbul ignore else */
    if (!disableCloseOnEsc) {
      document.body.removeEventListener('keydown', this.handleKeyboard);
    }
  }

  /**
   * Trigger the callback.
   */
  callback = (data: CallBackProps) => {
    const { callback } = this.props;

    /* istanbul ignore else */
    if (is.function(callback)) {
      callback(data);
    }
  };

  /**
   * Keydown event listener
   */
  handleKeyboard = (event: KeyboardEvent) => {
    const { index, lifecycle } = this.state;
    const { steps } = this.props;
    const step = steps[index];

    if (lifecycle === LIFECYCLE.TOOLTIP) {
      if (event.code === 'Escape' && step && !step.disableCloseOnEsc) {
        this.store.close();
      }
    }
  };

  /**
   * Sync the store with the component's state
   */
  syncState = (state: State) => {
    this.setState(state);
  };

  setPopper: FloaterProps['getPopper'] = (popper, type) => {
    if (type === 'wrapper') {
      this.beaconPopper = popper;
    } else {
      this.tooltipPopper = popper;
    }
  };

  scrollToStep(previousState: State) {
    const { index, lifecycle, status } = this.state;
    const {
      debug,
      disableScrollParentFix = false,
      scrollDuration,
      scrollOffset = 20,
      scrollToFirstStep = false,
      steps,
    } = this.props;
    const step = getMergedStep(steps[index], this.props);

    const target = getElement(step.target);
    const shouldScrollToStep = shouldScroll({
      isFirstStep: index === 0,
      lifecycle,
      previousLifecycle: previousState.lifecycle,
      scrollToFirstStep,
      step,
      target,
    });

    if (status === STATUS.RUNNING && shouldScrollToStep) {
      const hasCustomScroll = hasCustomScrollParent(target, disableScrollParentFix);
      const scrollParent = getScrollParent(target, disableScrollParentFix);
      let scrollY = Math.floor(getScrollTo(target, scrollOffset, disableScrollParentFix)) || 0;

      log({
        title: 'scrollToStep',
        data: [
          { key: 'index', value: index },
          { key: 'lifecycle', value: lifecycle },
          { key: 'status', value: status },
        ],
        debug,
      });

      /* istanbul ignore else */
      if (lifecycle === LIFECYCLE.BEACON && this.beaconPopper) {
        const { placement, popper } = this.beaconPopper;

        /* istanbul ignore else */
        if (!['bottom'].includes(placement) && !hasCustomScroll) {
          scrollY = Math.floor(popper.top - scrollOffset);
        }
      } else if (lifecycle === LIFECYCLE.TOOLTIP && this.tooltipPopper) {
        const { flipped, placement, popper } = this.tooltipPopper;

        if (['top', 'right', 'left'].includes(placement) && !flipped && !hasCustomScroll) {
          scrollY = Math.floor(popper.top - scrollOffset);
        } else {
          scrollY -= step.spotlightPadding;
        }
      }

      scrollY = scrollY >= 0 ? scrollY : 0;

      /* istanbul ignore else */
      if (status === STATUS.RUNNING) {
        scrollTo(scrollY, { element: scrollParent as Element, duration: scrollDuration });
      }
    }
  }

  render() {
    if (!canUseDOM()) {
      return null;
    }

    const { index, status } = this.state;
    const {
      continuous = false,
      debug = false,
      nonce,
      scrollToFirstStep = false,
      steps,
    } = this.props;
    let output;

    if (status === STATUS.RUNNING && steps[index]) {
      const step = getMergedStep(steps[index], this.props);

      output = (
        <Step
          {...this.state}
          callback={this.callback}
          continuous={continuous}
          debug={debug}
          helpers={this.helpers}
          nonce={nonce}
          setPopper={this.setPopper}
          shouldScroll={!step.disableScrolling && (index !== 0 || scrollToFirstStep)}
          step={step}
          update={this.store.update}
        />
      );
    }

    return <div className="react-joyride">{output}</div>;
  }
}

export default Joyride;
