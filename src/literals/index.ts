export const ACTIONS = {
  INIT: 'init',
  START: 'start',
  STOP: 'stop',
  RESET: 'reset',
  PREV: 'prev',
  NEXT: 'next',
  GO: 'go',
  CLOSE: 'close',
  SKIP: 'skip',
  UPDATE: 'update',
  COMPLETE: 'complete',
} as const;

export const EVENTS = {
  TOUR_START: 'tour:start',
  STEP_BEFORE_HOOK: 'step:before_hook',
  STEP_BEFORE: 'step:before',
  SCROLL_START: 'scroll:start',
  SCROLL_END: 'scroll:end',
  BEACON: 'beacon',
  TOOLTIP: 'tooltip',
  STEP_AFTER: 'step:after',
  STEP_AFTER_HOOK: 'step:after_hook',
  TOUR_END: 'tour:end',
  TOUR_STATUS: 'tour:status',
  TARGET_NOT_FOUND: 'error:target_not_found',
  ERROR: 'error',
} as const;

export const LIFECYCLE = {
  INIT: 'init',
  READY: 'ready',
  BEACON_BEFORE: 'beacon_before',
  BEACON: 'beacon',
  TOOLTIP_BEFORE: 'tooltip_before',
  TOOLTIP: 'tooltip',
  COMPLETE: 'complete',
  ERROR: 'error',
} as const;

export const ORIGIN = {
  BUTTON_CLOSE: 'button_close',
  BUTTON_SKIP: 'button_skip',
  BUTTON_PRIMARY: 'button_primary',
  KEYBOARD: 'keyboard',
  OVERLAY: 'overlay',
} as const;

export const STATUS = {
  IDLE: 'idle',
  READY: 'ready',
  WAITING: 'waiting',
  RUNNING: 'running',
  PAUSED: 'paused',
  SKIPPED: 'skipped',
  FINISHED: 'finished',
  ERROR: 'error',
} as const;

export const PORTAL_ELEMENT_ID = 'react-joyride-portal';
