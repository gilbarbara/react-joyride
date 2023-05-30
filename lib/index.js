'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
require('prop-types');
var treeChanges = require('tree-changes');
var is = require('is-lite');
var ReactDOM = require('react-dom');
var ExecutionEnvironment = require('exenv');
var scroll = require('scroll');
var scrollParent = require('scrollparent');
var reactIs = require('react-is');
var deepmerge = require('deepmerge');
var Floater = require('react-floater');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var treeChanges__default = /*#__PURE__*/_interopDefaultLegacy(treeChanges);
var is__default = /*#__PURE__*/_interopDefaultLegacy(is);
var ReactDOM__default = /*#__PURE__*/_interopDefaultLegacy(ReactDOM);
var ExecutionEnvironment__default = /*#__PURE__*/_interopDefaultLegacy(ExecutionEnvironment);
var scroll__default = /*#__PURE__*/_interopDefaultLegacy(scroll);
var scrollParent__default = /*#__PURE__*/_interopDefaultLegacy(scrollParent);
var deepmerge__default = /*#__PURE__*/_interopDefaultLegacy(deepmerge);
var Floater__default = /*#__PURE__*/_interopDefaultLegacy(Floater);

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
      result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn(this, result);
  };
}
function _toPrimitive(input, hint) {
  if (typeof input !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (typeof res !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return typeof key === "symbol" ? key : String(key);
}

var ACTIONS = {
  INIT: 'init',
  START: 'start',
  STOP: 'stop',
  RESET: 'reset',
  PREV: 'prev',
  NEXT: 'next',
  GO: 'go',
  CLOSE: 'close',
  SKIP: 'skip',
  UPDATE: 'update'
};

var EVENTS = {
  TOUR_START: 'tour:start',
  STEP_BEFORE: 'step:before',
  BEACON: 'beacon',
  TOOLTIP: 'tooltip',
  STEP_AFTER: 'step:after',
  TOUR_END: 'tour:end',
  TOUR_STATUS: 'tour:status',
  TARGET_NOT_FOUND: 'error:target_not_found',
  ERROR: 'error'
};

var LIFECYCLE = {
  INIT: 'init',
  READY: 'ready',
  BEACON: 'beacon',
  TOOLTIP: 'tooltip',
  COMPLETE: 'complete',
  ERROR: 'error'
};

var STATUS = {
  IDLE: 'idle',
  READY: 'ready',
  WAITING: 'waiting',
  RUNNING: 'running',
  PAUSED: 'paused',
  SKIPPED: 'skipped',
  FINISHED: 'finished',
  ERROR: 'error'
};

var canUseDOM = ExecutionEnvironment__default["default"].canUseDOM;
var isReact16 = ReactDOM.createPortal !== undefined;

/**
 * Get the current browser
 *
 * @param {string} userAgent
 *
 * @returns {String}
 */
function getBrowser() {
  var userAgent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : navigator.userAgent;
  var browser = userAgent;
  if (typeof window === 'undefined') {
    browser = 'node';
  } else if (document.documentMode) {
    browser = 'ie';
  } else if (/Edge/.test(userAgent)) {
    browser = 'edge';
  }
  // Opera 8.0+
  else if (Boolean(window.opera) || userAgent.indexOf(' OPR/') >= 0) {
    browser = 'opera';
  }
  // Firefox 1.0+
  else if (typeof window.InstallTrigger !== 'undefined') {
    browser = 'firefox';
  }
  // Chrome 1+
  else if (window.chrome) {
    browser = 'chrome';
  }
  // Safari (and Chrome iOS, Firefox iOS)
  else if (/(Version\/([0-9._]+).*Safari|CriOS|FxiOS| Mobile\/)/.test(userAgent)) {
    browser = 'safari';
  }
  return browser;
}

/**
 * Get the toString Object type
 * @param {*} value
 * @returns {string}
 */
function getObjectType(value) {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}

/**
 * Get text from React components
 *
 * @param {*} root
 *
 * @returns {string}
 */
function getText(root) {
  var content = [];
  var recurse = function recurse(child) {
    /* istanbul ignore else */
    if (typeof child === 'string' || typeof child === 'number') {
      content.push(child);
    } else if (Array.isArray(child)) {
      child.forEach(function (c) {
        return recurse(c);
      });
    } else if (child && child.props) {
      var children = child.props.children;
      if (Array.isArray(children)) {
        children.forEach(function (c) {
          return recurse(c);
        });
      } else {
        recurse(children);
      }
    }
  };
  recurse(root);
  return content.join(' ').trim();
}
function hasOwnProperty(value, key) {
  return Object.prototype.hasOwnProperty.call(value, key);
}
function hasValidKeys(value, keys) {
  if (!is__default["default"].plainObject(value) || !is__default["default"].array(keys)) {
    return false;
  }
  return Object.keys(value).every(function (d) {
    return keys.indexOf(d) !== -1;
  });
}

/**
 * Convert hex to RGB
 *
 * @param {string} hex
 * @returns {Array}
 */
function hexToRGB(hex) {
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  var properHex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(properHex);
  return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : [];
}

/**
 * Decide if the step shouldn't skip the beacon
 * @param {Object} step
 *
 * @returns {boolean}
 */
function hideBeacon(step) {
  return step.disableBeacon || step.placement === 'center';
}

/**
 * Compare if two variables are equal
 *
 * @param {*} left
 * @param {*} right
 *
 * @returns {boolean}
 */
function isEqual(left, right) {
  var type;
  var hasReactElement = /*#__PURE__*/React.isValidElement(left) || /*#__PURE__*/React.isValidElement(right);
  var hasUndefined = is__default["default"].undefined(left) || is__default["default"].undefined(right);
  if (getObjectType(left) !== getObjectType(right) || hasReactElement || hasUndefined) {
    return false;
  }
  if (is__default["default"].domElement(left)) {
    return left.isSameNode(right);
  }
  if (is__default["default"].number(left)) {
    return left === right;
  }
  if (is__default["default"]["function"](left)) {
    return left.toString() === right.toString();
  }
  for (var key in left) {
    /* istanbul ignore else */
    if (hasOwnProperty(left, key)) {
      if (typeof left[key] === 'undefined' || typeof right[key] === 'undefined') {
        return false;
      }
      type = getObjectType(left[key]);
      if (['object', 'array'].indexOf(type) !== -1 && isEqual(left[key], right[key])) {
        continue;
      }
      if (type === 'function' && isEqual(left[key], right[key])) {
        continue;
      }
      if (left[key] !== right[key]) {
        return false;
      }
    }
  }
  for (var p in right) {
    /* istanbul ignore else */
    if (hasOwnProperty(right, p)) {
      if (typeof left[p] === 'undefined') {
        return false;
      }
    }
  }
  return true;
}

/**
 * Detect legacy browsers
 *
 * @returns {boolean}
 */
function isLegacy() {
  return !(['chrome', 'safari', 'firefox', 'opera'].indexOf(getBrowser()) !== -1);
}

/**
 * Log method calls if debug is enabled
 *
 * @private
 * @param {Object}       arg
 * @param {string}       arg.title    - The title the logger was called from
 * @param {Object|Array} [arg.data]   - The data to be logged
 * @param {boolean}      [arg.warn]  - If true, the message will be a warning
 * @param {boolean}      [arg.debug] - Nothing will be logged unless debug is true
 */
function log(_ref) {
  var title = _ref.title,
    data = _ref.data,
    _ref$warn = _ref.warn,
    warn = _ref$warn === void 0 ? false : _ref$warn,
    _ref$debug = _ref.debug,
    debug = _ref$debug === void 0 ? false : _ref$debug;
  /* eslint-disable no-console */
  var logFn = warn ? console.warn || console.error : console.log;
  if (debug) {
    if (title && data) {
      console.groupCollapsed("%creact-joyride: ".concat(title), 'color: #ff0044; font-weight: bold; font-size: 12px;');
      if (Array.isArray(data)) {
        data.forEach(function (d) {
          if (is__default["default"].plainObject(d) && d.key) {
            logFn.apply(console, [d.key, d.value]);
          } else {
            logFn.apply(console, [d]);
          }
        });
      } else {
        logFn.apply(console, [data]);
      }
      console.groupEnd();
    } else {
      console.error('Missing title or data props');
    }
  }
  /* eslint-enable */
}

var defaultState = {
  action: '',
  controlled: false,
  index: 0,
  lifecycle: LIFECYCLE.INIT,
  size: 0,
  status: STATUS.IDLE
};
var validKeys = ['action', 'index', 'lifecycle', 'status'];
function createStore(props) {
  var store = new Map();
  var data = new Map();
  var Store = /*#__PURE__*/function () {
    function Store() {
      var _this = this;
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$continuous = _ref.continuous,
        continuous = _ref$continuous === void 0 ? false : _ref$continuous,
        stepIndex = _ref.stepIndex,
        _ref$steps = _ref.steps,
        _steps = _ref$steps === void 0 ? [] : _ref$steps;
      _classCallCheck(this, Store);
      _defineProperty(this, "listener", void 0);
      _defineProperty(this, "setSteps", function (steps) {
        var _this$getState = _this.getState(),
          size = _this$getState.size,
          status = _this$getState.status;
        var state = {
          size: steps.length,
          status: status
        };
        data.set('steps', steps);
        if (status === STATUS.WAITING && !size && steps.length) {
          state.status = STATUS.RUNNING;
        }
        _this.setState(state);
      });
      _defineProperty(this, "addListener", function (listener) {
        _this.listener = listener;
      });
      _defineProperty(this, "update", function (state) {
        if (!hasValidKeys(state, validKeys)) {
          throw new Error("State is not valid. Valid keys: ".concat(validKeys.join(', ')));
        }
        _this.setState(_objectSpread2({}, _this.getNextState(_objectSpread2(_objectSpread2(_objectSpread2({}, _this.getState()), state), {}, {
          action: state.action || ACTIONS.UPDATE
        }), true)));
      });
      _defineProperty(this, "start", function (nextIndex) {
        var _this$getState2 = _this.getState(),
          index = _this$getState2.index,
          size = _this$getState2.size;
        _this.setState(_objectSpread2(_objectSpread2({}, _this.getNextState({
          action: ACTIONS.START,
          index: is__default["default"].number(nextIndex) ? nextIndex : index
        }, true)), {}, {
          status: size ? STATUS.RUNNING : STATUS.WAITING
        }));
      });
      _defineProperty(this, "stop", function () {
        var advance = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        var _this$getState3 = _this.getState(),
          index = _this$getState3.index,
          status = _this$getState3.status;
        if ([STATUS.FINISHED, STATUS.SKIPPED].indexOf(status) !== -1) return;
        _this.setState(_objectSpread2(_objectSpread2({}, _this.getNextState({
          action: ACTIONS.STOP,
          index: index + (advance ? 1 : 0)
        })), {}, {
          status: STATUS.PAUSED
        }));
      });
      _defineProperty(this, "close", function () {
        var _this$getState4 = _this.getState(),
          index = _this$getState4.index,
          status = _this$getState4.status;
        if (status !== STATUS.RUNNING) return;
        _this.setState(_objectSpread2({}, _this.getNextState({
          action: ACTIONS.CLOSE,
          index: index + 1
        })));
      });
      _defineProperty(this, "go", function (nextIndex) {
        var _this$getState5 = _this.getState(),
          controlled = _this$getState5.controlled,
          status = _this$getState5.status;
        if (controlled || status !== STATUS.RUNNING) return;
        var step = _this.getSteps()[nextIndex];
        _this.setState(_objectSpread2(_objectSpread2({}, _this.getNextState({
          action: ACTIONS.GO,
          index: nextIndex
        })), {}, {
          status: step ? status : STATUS.FINISHED
        }));
      });
      _defineProperty(this, "info", function () {
        return _this.getState();
      });
      _defineProperty(this, "next", function () {
        var _this$getState6 = _this.getState(),
          index = _this$getState6.index,
          status = _this$getState6.status;
        if (status !== STATUS.RUNNING) return;
        _this.setState(_this.getNextState({
          action: ACTIONS.NEXT,
          index: index + 1
        }));
      });
      _defineProperty(this, "open", function () {
        var _this$getState7 = _this.getState(),
          status = _this$getState7.status;
        if (status !== STATUS.RUNNING) return;
        _this.setState(_objectSpread2({}, _this.getNextState({
          action: ACTIONS.UPDATE,
          lifecycle: LIFECYCLE.TOOLTIP
        })));
      });
      _defineProperty(this, "prev", function () {
        var _this$getState8 = _this.getState(),
          index = _this$getState8.index,
          status = _this$getState8.status;
        if (status !== STATUS.RUNNING) return;
        _this.setState(_objectSpread2({}, _this.getNextState({
          action: ACTIONS.PREV,
          index: index - 1
        })));
      });
      _defineProperty(this, "reset", function () {
        var restart = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        var _this$getState9 = _this.getState(),
          controlled = _this$getState9.controlled;
        if (controlled) return;
        _this.setState(_objectSpread2(_objectSpread2({}, _this.getNextState({
          action: ACTIONS.RESET,
          index: 0
        })), {}, {
          status: restart ? STATUS.RUNNING : STATUS.READY
        }));
      });
      _defineProperty(this, "skip", function () {
        var _this$getState10 = _this.getState(),
          status = _this$getState10.status;
        if (status !== STATUS.RUNNING) return;
        _this.setState({
          action: ACTIONS.SKIP,
          lifecycle: LIFECYCLE.INIT,
          status: STATUS.SKIPPED
        });
      });
      this.setState({
        action: ACTIONS.INIT,
        controlled: is__default["default"].number(stepIndex),
        continuous: continuous,
        index: is__default["default"].number(stepIndex) ? stepIndex : 0,
        lifecycle: LIFECYCLE.INIT,
        status: _steps.length ? STATUS.READY : STATUS.IDLE
      }, true);
      this.setSteps(_steps);
    }
    _createClass(Store, [{
      key: "setState",
      value: function setState(nextState) {
        var initial = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var state = this.getState();
        var _state$nextState = _objectSpread2(_objectSpread2({}, state), nextState),
          action = _state$nextState.action,
          index = _state$nextState.index,
          lifecycle = _state$nextState.lifecycle,
          size = _state$nextState.size,
          status = _state$nextState.status;
        store.set('action', action);
        store.set('index', index);
        store.set('lifecycle', lifecycle);
        store.set('size', size);
        store.set('status', status);
        if (initial) {
          store.set('controlled', nextState.controlled);
          store.set('continuous', nextState.continuous);
        }

        /* istanbul ignore else */
        if (this.listener && this.hasUpdatedState(state)) {
          // console.log('▶ ▶ ▶ NEW STATE', this.getState());
          this.listener(this.getState());
        }
      }
    }, {
      key: "getState",
      value: function getState() {
        if (!store.size) {
          return _objectSpread2({}, defaultState);
        }
        return {
          action: store.get('action') || '',
          controlled: store.get('controlled') || false,
          index: parseInt(store.get('index'), 10),
          lifecycle: store.get('lifecycle') || '',
          size: store.get('size') || 0,
          status: store.get('status') || ''
        };
      }
    }, {
      key: "getNextState",
      value: function getNextState(state) {
        var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var _this$getState11 = this.getState(),
          action = _this$getState11.action,
          controlled = _this$getState11.controlled,
          index = _this$getState11.index,
          size = _this$getState11.size,
          status = _this$getState11.status;
        var newIndex = is__default["default"].number(state.index) ? state.index : index;
        var nextIndex = controlled && !force ? index : Math.min(Math.max(newIndex, 0), size);
        return {
          action: state.action || action,
          controlled: controlled,
          index: nextIndex,
          lifecycle: state.lifecycle || LIFECYCLE.INIT,
          size: state.size || size,
          status: nextIndex === size ? STATUS.FINISHED : state.status || status
        };
      }
    }, {
      key: "hasUpdatedState",
      value: function hasUpdatedState(oldState) {
        var before = JSON.stringify(oldState);
        var after = JSON.stringify(this.getState());
        return before !== after;
      }
    }, {
      key: "getSteps",
      value: function getSteps() {
        var steps = data.get('steps');
        return Array.isArray(steps) ? steps : [];
      }
    }, {
      key: "getHelpers",
      value: function getHelpers() {
        return {
          close: this.close,
          go: this.go,
          info: this.info,
          next: this.next,
          open: this.open,
          prev: this.prev,
          reset: this.reset,
          skip: this.skip
        };
      }
    }]);
    return Store;
  }();
  return new Store(props);
}

/**
 * Find the bounding client rect
 *
 * @private
 * @param {HTMLElement} element - The target element
 * @returns {Object}
 */
function getClientRect(element) {
  if (!element) {
    return {};
  }
  return element.getBoundingClientRect();
}

/**
 * Helper function to get the browser-normalized "document height"
 * @returns {Number}
 */
function getDocumentHeight() {
  var _document = document,
    body = _document.body,
    html = _document.documentElement;
  if (!body || !html) {
    return 0;
  }
  return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
}

/**
 * Find and return the target DOM element based on a step's 'target'.
 *
 * @private
 * @param {string|HTMLElement} element
 *
 * @returns {HTMLElement|null}
 */
function getElement(element) {
  /* istanbul ignore else */
  if (typeof element === 'string') {
    return document.querySelector(element);
  }
  return element;
}

/**
 *  Get computed style property
 *
 * @param {HTMLElement} el
 *
 * @returns {Object}
 */
function getStyleComputedProperty(el) {
  if (!el || el.nodeType !== 1) {
    return {};
  }
  return getComputedStyle(el);
}

/**
 * Get scroll parent with fix
 *
 * @param {HTMLElement} element
 * @param {boolean} skipFix
 * @param {boolean} [forListener]
 *
 * @returns {*}
 */
function getScrollParent(element, skipFix, forListener) {
  var parent = scrollParent__default["default"](element);
  if (parent.isSameNode(scrollDoc())) {
    if (forListener) {
      return document;
    }
    return scrollDoc();
  }
  var hasScrolling = parent.scrollHeight > parent.offsetHeight;

  /* istanbul ignore else */
  if (!hasScrolling && !skipFix) {
    parent.style.overflow = 'initial';
    return scrollDoc();
  }
  return parent;
}

/**
 * Check if the element has custom scroll parent
 *
 * @param {HTMLElement} element
 * @param {boolean} skipFix
 *
 * @returns {boolean}
 */
function hasCustomScrollParent(element, skipFix) {
  if (!element) return false;
  var parent = getScrollParent(element, skipFix);
  return !parent.isSameNode(scrollDoc());
}

/**
 * Check if the element has custom offset parent
 *
 * @param {HTMLElement} element
 *
 * @returns {boolean}
 */
function hasCustomOffsetParent(element) {
  return element.offsetParent !== document.body;
}

/**
 * Check if an element has fixed/sticky position
 * @param {HTMLElement|Node} el
 * @param {string} [type]
 *
 * @returns {boolean}
 */
function hasPosition(el) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'fixed';
  if (!el || !(el instanceof HTMLElement)) {
    return false;
  }
  var nodeName = el.nodeName;
  if (nodeName === 'BODY' || nodeName === 'HTML') {
    return false;
  }
  if (getStyleComputedProperty(el).position === type) {
    return true;
  }
  return hasPosition(el.parentNode, type);
}

/**
 * Check if the element is visible
 *
 * @param {HTMLElement} element
 *
 * @returns {boolean}
 */
function isElementVisible(element) {
  if (!element) return false;
  var parentElement = element;
  while (parentElement) {
    if (parentElement === document.body) break;

    /* istanbul ignore else */
    if (parentElement instanceof HTMLElement) {
      var _getComputedStyle = getComputedStyle(parentElement),
        display = _getComputedStyle.display,
        visibility = _getComputedStyle.visibility;
      if (display === 'none' || visibility === 'hidden') {
        return false;
      }
    }
    parentElement = parentElement.parentNode;
  }
  return true;
}

/**
 * Find and return the target DOM element based on a step's 'target'.
 *
 * @private
 * @param {string|HTMLElement} element
 * @param {number} offset
 * @param {boolean} skipFix
 *
 * @returns {HTMLElement|undefined}
 */
function getElementPosition(element, offset, skipFix) {
  var elementRect = getClientRect(element);
  var parent = getScrollParent(element, skipFix);
  var hasScrollParent = hasCustomScrollParent(element, skipFix);
  var parentTop = 0;

  /* istanbul ignore else */
  if (parent instanceof HTMLElement) {
    parentTop = parent.scrollTop;
  }
  var top = elementRect.top + (!hasScrollParent && !hasPosition(element) ? parentTop : 0);
  return Math.floor(top - offset);
}

/**
 * Get the offsetTop of each element up to the body
 *
 * @param {HTMLElement} element
 *
 * @returns {number}
 */
function getTopOffset(element) {
  if (element instanceof HTMLElement) {
    if (element.offsetParent instanceof HTMLElement) {
      return getTopOffset(element.offsetParent) + element.offsetTop;
    }
    return element.offsetTop;
  }
  return 0;
}

/**
 * Get the scrollTop position
 *
 * @param {HTMLElement} element
 * @param {number} offset
 * @param {boolean} skipFix
 *
 * @returns {number}
 */
function getScrollTo(element, offset, skipFix) {
  if (!element) {
    return 0;
  }
  var parent = scrollParent__default["default"](element);
  var top = getTopOffset(element);
  if (hasCustomScrollParent(element, skipFix) && !hasCustomOffsetParent(element)) {
    top -= getTopOffset(parent);
  }
  return Math.floor(top - offset);
}
function scrollDoc() {
  return document.scrollingElement || document.createElement('body');
}

/**
 * Scroll to position
 * @param {number} value
 * @param {HTMLElement} element
 * @param {number} scrollDuration
 * @returns {Promise<*>}
 */
function scrollTo(value) {
  var element = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : scrollDoc();
  var scrollDuration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 300;
  return new Promise(function (resolve, reject) {
    var scrollTop = element.scrollTop;
    var limit = value > scrollTop ? value - scrollTop : scrollTop - value;
    scroll__default["default"].top(element, value, {
      duration: limit < 100 ? 50 : scrollDuration
    }, function (error) {
      if (error && error.message !== 'Element already at target scroll position') {
        return reject(error);
      }
      return resolve();
    });
  });
}

function createChainableTypeChecker(validate) {
  function checkType(isRequired, props, propName, componentName, location, propFullName) {
    var componentNameSafe = componentName || '<<anonymous>>';
    var propFullNameSafe = propFullName || propName;

    /* istanbul ignore else */
    if (props[propName] == null) {
      if (isRequired) {
        return new Error("Required ".concat(location, " `").concat(propFullNameSafe, "` was not specified in `").concat(componentNameSafe, "`."));
      }
      return null;
    }
    for (var _len = arguments.length, args = new Array(_len > 6 ? _len - 6 : 0), _key = 6; _key < _len; _key++) {
      args[_key - 6] = arguments[_key];
    }
    return validate.apply(void 0, [props, propName, componentNameSafe, location, propFullNameSafe].concat(args));
  }
  var chainedCheckType = checkType.bind(null, false);
  chainedCheckType.isRequired = checkType.bind(null, true);
  return chainedCheckType;
}
createChainableTypeChecker(function (props, propName, componentName, location, propFullName) {
  var propValue = props[propName];
  var Component = propValue;
  if (! /*#__PURE__*/React__default["default"].isValidElement(propValue) && reactIs.isValidElementType(propValue)) {
    var ownProps = {
      ref: function ref() {},
      step: {}
    };
    Component = /*#__PURE__*/React__default["default"].createElement(Component, ownProps);
  }
  if (is__default["default"].string(propValue) || is__default["default"].number(propValue) || !reactIs.isValidElementType(propValue) || !([reactIs.Element, reactIs.ForwardRef].indexOf(reactIs.typeOf(Component)) !== -1)) {
    return new Error("Invalid ".concat(location, " `").concat(propFullName, "` supplied to `").concat(componentName, "`. Expected a React class or forwardRef."));
  }
  return undefined;
});

var defaultOptions = {
  arrowColor: '#fff',
  backgroundColor: '#fff',
  beaconSize: 36,
  overlayColor: 'rgba(0, 0, 0, 0.5)',
  primaryColor: '#f04',
  spotlightShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
  textColor: '#333',
  zIndex: 100
};
var buttonBase = {
  backgroundColor: 'transparent',
  border: 0,
  borderRadius: 0,
  color: '#555',
  cursor: 'pointer',
  fontSize: 16,
  lineHeight: 1,
  padding: 8,
  WebkitAppearance: 'none'
};
var spotlight = {
  borderRadius: 4,
  position: 'absolute'
};
function getStyles() {
  var stepStyles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var options = deepmerge__default["default"](defaultOptions, stepStyles.options || {});
  var width = 290;
  if (window.innerWidth > 480) {
    width = 380;
  }
  if (options.width) {
    if (window.innerWidth < options.width) {
      width = window.innerWidth - 30;
    } else {
      width = options.width; //eslint-disable-line prefer-destructuring
    }
  }

  var overlay = {
    bottom: 0,
    left: 0,
    overflow: 'hidden',
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: options.zIndex
  };
  var defaultStyles = {
    beacon: _objectSpread2(_objectSpread2({}, buttonBase), {}, {
      display: 'inline-block',
      height: options.beaconSize,
      position: 'relative',
      width: options.beaconSize,
      zIndex: options.zIndex
    }),
    beaconInner: {
      animation: 'joyride-beacon-inner 1.2s infinite ease-in-out',
      backgroundColor: options.primaryColor,
      borderRadius: '50%',
      display: 'block',
      height: '50%',
      left: '50%',
      opacity: 0.7,
      position: 'absolute',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      width: '50%'
    },
    beaconOuter: {
      animation: 'joyride-beacon-outer 1.2s infinite ease-in-out',
      backgroundColor: "rgba(".concat(hexToRGB(options.primaryColor).join(','), ", 0.2)"),
      border: "2px solid ".concat(options.primaryColor),
      borderRadius: '50%',
      boxSizing: 'border-box',
      display: 'block',
      height: '100%',
      left: 0,
      opacity: 0.9,
      position: 'absolute',
      top: 0,
      transformOrigin: 'center',
      width: '100%'
    },
    tooltip: {
      backgroundColor: options.backgroundColor,
      borderRadius: 5,
      boxSizing: 'border-box',
      color: options.textColor,
      fontSize: 16,
      maxWidth: '100%',
      padding: 15,
      position: 'relative',
      width: width
    },
    tooltipContainer: {
      lineHeight: 1.4,
      textAlign: 'center'
    },
    tooltipTitle: {
      fontSize: 18,
      margin: 0
    },
    tooltipContent: {
      padding: '20px 10px'
    },
    tooltipFooter: {
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: 15
    },
    tooltipFooterSpacer: {
      flex: 1
    },
    buttonNext: _objectSpread2(_objectSpread2({}, buttonBase), {}, {
      backgroundColor: options.primaryColor,
      borderRadius: 4,
      color: '#fff'
    }),
    buttonBack: _objectSpread2(_objectSpread2({}, buttonBase), {}, {
      color: options.primaryColor,
      marginLeft: 'auto',
      marginRight: 5
    }),
    buttonClose: _objectSpread2(_objectSpread2({}, buttonBase), {}, {
      color: options.textColor,
      height: 14,
      padding: 15,
      position: 'absolute',
      right: 0,
      top: 0,
      width: 14
    }),
    buttonSkip: _objectSpread2(_objectSpread2({}, buttonBase), {}, {
      color: options.textColor,
      fontSize: 14
    }),
    overlay: _objectSpread2(_objectSpread2({}, overlay), {}, {
      backgroundColor: options.overlayColor,
      mixBlendMode: 'hard-light'
    }),
    overlayLegacy: _objectSpread2({}, overlay),
    overlayLegacyCenter: _objectSpread2(_objectSpread2({}, overlay), {}, {
      backgroundColor: options.overlayColor
    }),
    spotlight: _objectSpread2(_objectSpread2({}, spotlight), {}, {
      backgroundColor: 'gray'
    }),
    spotlightLegacy: _objectSpread2(_objectSpread2({}, spotlight), {}, {
      boxShadow: "0 0 0 9999px ".concat(options.overlayColor, ", ").concat(options.spotlightShadow)
    }),
    floaterStyles: {
      arrow: {
        color: options.arrowColor
      },
      options: {
        zIndex: options.zIndex + 100
      }
    },
    options: options
  };
  return deepmerge__default["default"](defaultStyles, stepStyles);
}

var DEFAULTS = {
  floaterProps: {
    options: {
      preventOverflow: {
        boundariesElement: 'scrollParent'
      }
    },
    wrapperOptions: {
      offset: -18,
      position: true
    }
  },
  locale: {
    back: 'Back',
    close: 'Close',
    last: 'Last',
    next: 'Next',
    open: 'Open the dialog',
    skip: 'Skip'
  },
  step: {
    event: 'click',
    placement: 'bottom',
    offset: 10
  }
};

function getTourProps(props) {
  var sharedTourProps = ['beaconComponent', 'disableCloseOnEsc', 'disableOverlay', 'disableOverlayClose', 'disableScrolling', 'disableScrollParentFix', 'floaterProps', 'hideBackButton', 'hideCloseButton', 'locale', 'showProgress', 'showSkipButton', 'spotlightClicks', 'spotlightPadding', 'styles', 'tooltipComponent'];
  return Object.keys(props).filter(function (d) {
    return sharedTourProps.indexOf(d) !== -1;
  }).reduce(function (acc, i) {
    acc[i] = props[i]; //eslint-disable-line react/destructuring-assignment

    return acc;
  }, {});
}
function getMergedStep(step, props) {
  if (!step) return null;
  var mergedStep = deepmerge__default["default"].all([getTourProps(props), DEFAULTS.step, step], {
    isMergeableObject: is__default["default"].plainObject
  });
  var mergedStyles = getStyles(deepmerge__default["default"](props.styles || {}, step.styles || {}));
  var scrollParent = hasCustomScrollParent(getElement(step.target), mergedStep.disableScrollParentFix);
  var floaterProps = deepmerge__default["default"].all([props.floaterProps || {}, DEFAULTS.floaterProps, mergedStep.floaterProps || {}]);

  // Set react-floater props
  floaterProps.offset = mergedStep.offset;
  floaterProps.styles = deepmerge__default["default"](floaterProps.styles || {}, mergedStyles.floaterStyles || {});
  delete mergedStyles.floaterStyles;
  floaterProps.offset += props.spotlightPadding || step.spotlightPadding || 0;
  if (step.placementBeacon) {
    floaterProps.wrapperOptions.placement = step.placementBeacon;
  }
  if (scrollParent) {
    floaterProps.options.preventOverflow.boundariesElement = 'window';
  }
  return _objectSpread2(_objectSpread2({}, mergedStep), {}, {
    locale: deepmerge__default["default"].all([DEFAULTS.locale, props.locale || {}, mergedStep.locale || {}]),
    floaterProps: floaterProps,
    styles: mergedStyles
  });
}

/**
 * Validate if a step is valid
 *
 * @param {Object} step - A step object
 * @param {boolean} debug
 *
 * @returns {boolean} - True if the step is valid, false otherwise
 */
function validateStep(step) {
  var debug = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  if (!is__default["default"].plainObject(step)) {
    log({
      title: 'validateStep',
      data: 'step must be an object',
      warn: true,
      debug: debug
    });
    return false;
  }
  if (!step.target) {
    log({
      title: 'validateStep',
      data: 'target is missing from the step',
      warn: true,
      debug: debug
    });
    return false;
  }
  return true;
}

/**
 * Validate if steps is valid
 *
 * @param {Array} steps - A steps array
 * @param {boolean} debug
 *
 * @returns {boolean} - True if the steps are valid, false otherwise
 */
function validateSteps(steps) {
  var debug = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  if (!is__default["default"].array(steps)) {
    log({
      title: 'validateSteps',
      data: 'steps must be an array',
      warn: true,
      debug: debug
    });
    return false;
  }
  return steps.every(function (d) {
    return validateStep(d, debug);
  });
}

var Scope = /*#__PURE__*/_createClass(function Scope(_element) {
  var _this = this;
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  _classCallCheck(this, Scope);
  _defineProperty(this, "element", void 0);
  _defineProperty(this, "options", void 0);
  _defineProperty(this, "canBeTabbed", function (element) {
    var tabIndex = element.tabIndex;
    if (tabIndex === null || tabIndex < 0) tabIndex = undefined;
    var isTabIndexNaN = isNaN(tabIndex);
    return !isTabIndexNaN && _this.canHaveFocus(element);
  });
  _defineProperty(this, "canHaveFocus", function (element) {
    var validTabNodes = /input|select|textarea|button|object/;
    var nodeName = element.nodeName.toLowerCase();
    var res = validTabNodes.test(nodeName) && !element.getAttribute('disabled') || nodeName === 'a' && !!element.getAttribute('href');
    return res && _this.isVisible(element);
  });
  _defineProperty(this, "findValidTabElements", function () {
    return [].slice.call(_this.element.querySelectorAll('*'), 0).filter(_this.canBeTabbed);
  });
  _defineProperty(this, "handleKeyDown", function (e) {
    var _this$options$keyCode = _this.options.keyCode,
      keyCode = _this$options$keyCode === void 0 ? 9 : _this$options$keyCode;

    /* istanbul ignore else */
    if (e.keyCode === keyCode) {
      _this.interceptTab(e);
    }
  });
  _defineProperty(this, "interceptTab", function (event) {
    var elements = _this.findValidTabElements();
    if (!elements.length) {
      return;
    }
    event.preventDefault();
    var shiftKey = event.shiftKey;
    var x = elements.indexOf(document.activeElement);
    if (x === -1 || !shiftKey && x + 1 === elements.length) {
      x = 0;
    } else if (shiftKey && x === 0) {
      x = elements.length - 1;
    } else {
      x += shiftKey ? -1 : 1;
    }
    elements[x].focus();
  });
  _defineProperty(this, "isHidden", function (element) {
    var noSize = element.offsetWidth <= 0 && element.offsetHeight <= 0;
    var style = window.getComputedStyle(element);
    if (noSize && !element.innerHTML) return true;
    return noSize && style.getPropertyValue('overflow') !== 'visible' || style.getPropertyValue('display') === 'none';
  });
  _defineProperty(this, "isVisible", function (element) {
    var parentElement = element;
    while (parentElement) {
      /* istanbul ignore else */
      if (parentElement instanceof HTMLElement) {
        if (parentElement === document.body) break;
        /* istanbul ignore else */
        if (_this.isHidden(parentElement)) return false;
        parentElement = parentElement.parentNode;
      }
    }
    return true;
  });
  _defineProperty(this, "removeScope", function () {
    window.removeEventListener('keydown', _this.handleKeyDown);
  });
  _defineProperty(this, "checkFocus", function (target) {
    if (document.activeElement !== target) {
      target.focus();
      window.requestAnimationFrame(function () {
        return _this.checkFocus(target);
      });
    }
  });
  _defineProperty(this, "setFocus", function () {
    var selector = _this.options.selector;
    if (!selector) return;
    var target = _this.element.querySelector(selector);

    /* istanbul ignore else */
    if (target) {
      window.requestAnimationFrame(function () {
        return _this.checkFocus(target);
      });
    }
  });
  if (!(_element instanceof HTMLElement)) {
    throw new TypeError('Invalid parameter: element must be an HTMLElement');
  }
  this.element = _element;
  this.options = options;
  window.addEventListener('keydown', this.handleKeyDown, false);
  this.setFocus();
});

var JoyrideBeacon = /*#__PURE__*/function (_React$Component) {
  _inherits(JoyrideBeacon, _React$Component);
  var _super = _createSuper(JoyrideBeacon);
  function JoyrideBeacon(props) {
    var _this;
    _classCallCheck(this, JoyrideBeacon);
    _this = _super.call(this, props);
    _defineProperty(_assertThisInitialized(_this), "setBeaconRef", function (c) {
      _this.beacon = c;
    });
    if (!props.beaconComponent) {
      var head = document.head || document.getElementsByTagName('head')[0];
      var style = document.createElement('style');
      var css = "\n        @keyframes joyride-beacon-inner {\n          20% {\n            opacity: 0.9;\n          }\n        \n          90% {\n            opacity: 0.7;\n          }\n        }\n        \n        @keyframes joyride-beacon-outer {\n          0% {\n            transform: scale(1);\n          }\n        \n          45% {\n            opacity: 0.7;\n            transform: scale(0.75);\n          }\n        \n          100% {\n            opacity: 0.9;\n            transform: scale(1);\n          }\n        }\n      ";
      style.type = 'text/css';
      style.id = 'joyride-beacon-animation';
      if (props.nonce !== undefined) {
        style.setAttribute('nonce', props.nonce);
      }
      style.appendChild(document.createTextNode(css));
      head.appendChild(style);
    }
    return _this;
  }
  _createClass(JoyrideBeacon, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;
      var shouldFocus = this.props.shouldFocus;

      setTimeout(function () {
        if (is__default["default"].domElement(_this2.beacon) && shouldFocus) {
          _this2.beacon.focus();
        }
      }, 0);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var style = document.getElementById('joyride-beacon-animation');
      if (style) {
        style.parentNode.removeChild(style);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
        beaconComponent = _this$props.beaconComponent,
        locale = _this$props.locale,
        onClickOrHover = _this$props.onClickOrHover,
        styles = _this$props.styles;
      var props = {
        'aria-label': locale.open,
        onClick: onClickOrHover,
        onMouseEnter: onClickOrHover,
        ref: this.setBeaconRef,
        title: locale.open
      };
      var component;
      if (beaconComponent) {
        var BeaconComponent = beaconComponent;
        component = /*#__PURE__*/React__default["default"].createElement(BeaconComponent, props);
      } else {
        component = /*#__PURE__*/React__default["default"].createElement("button", _extends({
          key: "JoyrideBeacon",
          className: "react-joyride__beacon",
          style: styles.beacon,
          type: "button"
        }, props), /*#__PURE__*/React__default["default"].createElement("span", {
          style: styles.beaconInner
        }), /*#__PURE__*/React__default["default"].createElement("span", {
          style: styles.beaconOuter
        }));
      }
      return component;
    }
  }]);
  return JoyrideBeacon;
}(React__default["default"].Component);

function JoyrideSpotlight(_ref) {
  var styles = _ref.styles;
  return /*#__PURE__*/React__default["default"].createElement("div", {
    key: "JoyrideSpotlight",
    className: "react-joyride__spotlight",
    style: styles
  });
}

var _excluded$2 = ["mixBlendMode", "zIndex"];
var JoyrideOverlay = /*#__PURE__*/function (_React$Component) {
  _inherits(JoyrideOverlay, _React$Component);
  var _super = _createSuper(JoyrideOverlay);
  function JoyrideOverlay() {
    var _this;
    _classCallCheck(this, JoyrideOverlay);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "_isMounted", false);
    _defineProperty(_assertThisInitialized(_this), "state", {
      mouseOverSpotlight: false,
      isScrolling: false,
      showSpotlight: true
    });
    _defineProperty(_assertThisInitialized(_this), "handleMouseMove", function (e) {
      var mouseOverSpotlight = _this.state.mouseOverSpotlight;
      var _this$spotlightStyles = _this.spotlightStyles,
        height = _this$spotlightStyles.height,
        left = _this$spotlightStyles.left,
        position = _this$spotlightStyles.position,
        top = _this$spotlightStyles.top,
        width = _this$spotlightStyles.width;
      var offsetY = position === 'fixed' ? e.clientY : e.pageY;
      var offsetX = position === 'fixed' ? e.clientX : e.pageX;
      var inSpotlightHeight = offsetY >= top && offsetY <= top + height;
      var inSpotlightWidth = offsetX >= left && offsetX <= left + width;
      var inSpotlight = inSpotlightWidth && inSpotlightHeight;
      if (inSpotlight !== mouseOverSpotlight) {
        _this.updateState({
          mouseOverSpotlight: inSpotlight
        });
      }
    });
    _defineProperty(_assertThisInitialized(_this), "handleScroll", function () {
      var target = _this.props.target;
      var element = getElement(target);
      if (_this.scrollParent !== document) {
        var isScrolling = _this.state.isScrolling;
        if (!isScrolling) {
          _this.updateState({
            isScrolling: true,
            showSpotlight: false
          });
        }
        clearTimeout(_this.scrollTimeout);
        _this.scrollTimeout = setTimeout(function () {
          _this.updateState({
            isScrolling: false,
            showSpotlight: true
          });
        }, 50);
      } else if (hasPosition(element, 'sticky')) {
        _this.updateState({});
      }
    });
    _defineProperty(_assertThisInitialized(_this), "handleResize", function () {
      clearTimeout(_this.resizeTimeout);
      _this.resizeTimeout = setTimeout(function () {
        if (!_this._isMounted) {
          return;
        }
        _this.forceUpdate();
      }, 100);
    });
    return _this;
  }
  _createClass(JoyrideOverlay, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props = this.props;
        _this$props.debug;
        _this$props.disableScrolling;
        var disableScrollParentFix = _this$props.disableScrollParentFix,
        target = _this$props.target;
      var element = getElement(target);
      this.scrollParent = getScrollParent(element, disableScrollParentFix, true);
      this._isMounted = true;
      window.addEventListener('resize', this.handleResize);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var _this2 = this;
      var _this$props2 = this.props,
        lifecycle = _this$props2.lifecycle,
        spotlightClicks = _this$props2.spotlightClicks;
      var _treeChanges = treeChanges__default["default"](prevProps, this.props),
        changed = _treeChanges.changed;

      /* istanbul ignore else */
      if (changed('lifecycle', LIFECYCLE.TOOLTIP)) {
        this.scrollParent.addEventListener('scroll', this.handleScroll, {
          passive: true
        });
        setTimeout(function () {
          var isScrolling = _this2.state.isScrolling;
          if (!isScrolling) {
            _this2.updateState({
              showSpotlight: true
            });
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
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this._isMounted = false;
      window.removeEventListener('mousemove', this.handleMouseMove);
      window.removeEventListener('resize', this.handleResize);
      clearTimeout(this.resizeTimeout);
      clearTimeout(this.scrollTimeout);
      this.scrollParent.removeEventListener('scroll', this.handleScroll);
    }
  }, {
    key: "spotlightStyles",
    get: function get() {
      var showSpotlight = this.state.showSpotlight;
      var _this$props3 = this.props,
        disableScrollParentFix = _this$props3.disableScrollParentFix,
        spotlightClicks = _this$props3.spotlightClicks,
        spotlightPadding = _this$props3.spotlightPadding,
        styles = _this$props3.styles,
        target = _this$props3.target;
      var element = getElement(target);
      var elementRect = getClientRect(element);
      var isFixedTarget = hasPosition(element);
      var top = getElementPosition(element, spotlightPadding, disableScrollParentFix);
      return _objectSpread2(_objectSpread2({}, isLegacy() ? styles.spotlightLegacy : styles.spotlight), {}, {
        height: Math.round(elementRect.height + spotlightPadding * 2),
        left: Math.round(elementRect.left - spotlightPadding),
        opacity: showSpotlight ? 1 : 0,
        pointerEvents: spotlightClicks ? 'none' : 'auto',
        position: isFixedTarget ? 'fixed' : 'absolute',
        top: top,
        transition: 'opacity 0.2s',
        width: Math.round(elementRect.width + spotlightPadding * 2)
      });
    }
  }, {
    key: "updateState",
    value: function updateState(state) {
      if (!this._isMounted) {
        return;
      }
      this.setState(state);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$state = this.state,
        mouseOverSpotlight = _this$state.mouseOverSpotlight,
        showSpotlight = _this$state.showSpotlight;
      var _this$props4 = this.props,
        disableOverlay = _this$props4.disableOverlay,
        disableOverlayClose = _this$props4.disableOverlayClose,
        lifecycle = _this$props4.lifecycle,
        onClickOverlay = _this$props4.onClickOverlay,
        placement = _this$props4.placement,
        styles = _this$props4.styles;
      if (disableOverlay || lifecycle !== LIFECYCLE.TOOLTIP) {
        return null;
      }
      var baseStyles = styles.overlay;

      /* istanbul ignore else */
      if (isLegacy()) {
        baseStyles = placement === 'center' ? styles.overlayLegacyCenter : styles.overlayLegacy;
      }
      var stylesOverlay = _objectSpread2({
        cursor: disableOverlayClose ? 'default' : 'pointer',
        height: getDocumentHeight(),
        pointerEvents: mouseOverSpotlight ? 'none' : 'auto'
      }, baseStyles);
      var spotlight = placement !== 'center' && showSpotlight && /*#__PURE__*/React__default["default"].createElement(JoyrideSpotlight, {
        styles: this.spotlightStyles
      });

      // Hack for Safari bug with mix-blend-mode with z-index
      if (getBrowser() === 'safari') {
        stylesOverlay.mixBlendMode;
          stylesOverlay.zIndex;
          var safarOverlay = _objectWithoutProperties(stylesOverlay, _excluded$2);
        spotlight = /*#__PURE__*/React__default["default"].createElement("div", {
          style: _objectSpread2({}, safarOverlay)
        }, spotlight);
        delete stylesOverlay.backgroundColor;
      }
      return /*#__PURE__*/React__default["default"].createElement("div", {
        className: "react-joyride__overlay",
        style: stylesOverlay,
        onClick: onClickOverlay
      }, spotlight);
    }
  }]);
  return JoyrideOverlay;
}(React__default["default"].Component);

var _excluded$1 = ["styles"],
  _excluded2 = ["color", "height", "width"];
function JoyrideTooltipCloseBtn(_ref) {
  var styles = _ref.styles,
    props = _objectWithoutProperties(_ref, _excluded$1);
  var color = styles.color,
    height = styles.height,
    width = styles.width,
    style = _objectWithoutProperties(styles, _excluded2);
  return /*#__PURE__*/React__default["default"].createElement("button", _extends({
    style: style,
    type: "button"
  }, props), /*#__PURE__*/React__default["default"].createElement("svg", {
    width: typeof width === 'number' ? "".concat(width, "px") : width,
    height: typeof height === 'number' ? "".concat(height, "px") : height,
    viewBox: "0 0 18 18",
    version: "1.1",
    xmlns: "http://www.w3.org/2000/svg",
    preserveAspectRatio: "xMidYMid"
  }, /*#__PURE__*/React__default["default"].createElement("g", null, /*#__PURE__*/React__default["default"].createElement("path", {
    d: "M8.13911129,9.00268191 L0.171521827,17.0258467 C-0.0498027049,17.248715 -0.0498027049,17.6098394 0.171521827,17.8327545 C0.28204354,17.9443526 0.427188206,17.9998706 0.572051765,17.9998706 C0.71714958,17.9998706 0.862013139,17.9443526 0.972581703,17.8327545 L9.0000937,9.74924618 L17.0276057,17.8327545 C17.1384085,17.9443526 17.2832721,17.9998706 17.4281356,17.9998706 C17.5729992,17.9998706 17.718097,17.9443526 17.8286656,17.8327545 C18.0499901,17.6098862 18.0499901,17.2487618 17.8286656,17.0258467 L9.86135722,9.00268191 L17.8340066,0.973848225 C18.0553311,0.750979934 18.0553311,0.389855532 17.8340066,0.16694039 C17.6126821,-0.0556467968 17.254037,-0.0556467968 17.0329467,0.16694039 L9.00042166,8.25611765 L0.967006424,0.167268345 C0.745681892,-0.0553188426 0.387317931,-0.0553188426 0.165993399,0.167268345 C-0.0553311331,0.390136635 -0.0553311331,0.751261038 0.165993399,0.974176179 L8.13920499,9.00268191 L8.13911129,9.00268191 Z",
    fill: color
  }))));
}

var JoyrideTooltipContainer = /*#__PURE__*/function (_React$Component) {
  _inherits(JoyrideTooltipContainer, _React$Component);
  var _super = _createSuper(JoyrideTooltipContainer);
  function JoyrideTooltipContainer() {
    _classCallCheck(this, JoyrideTooltipContainer);
    return _super.apply(this, arguments);
  }
  _createClass(JoyrideTooltipContainer, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
        backProps = _this$props.backProps,
        closeProps = _this$props.closeProps,
        continuous = _this$props.continuous,
        index = _this$props.index,
        isLastStep = _this$props.isLastStep,
        primaryProps = _this$props.primaryProps,
        size = _this$props.size,
        skipProps = _this$props.skipProps,
        step = _this$props.step,
        tooltipProps = _this$props.tooltipProps;
      var content = step.content,
        hideBackButton = step.hideBackButton,
        hideCloseButton = step.hideCloseButton,
        hideFooter = step.hideFooter,
        showProgress = step.showProgress,
        showSkipButton = step.showSkipButton,
        title = step.title,
        styles = step.styles;
      var _step$locale = step.locale,
        back = _step$locale.back,
        close = _step$locale.close,
        last = _step$locale.last,
        next = _step$locale.next,
        skip = _step$locale.skip;
      var output = {
        primary: close
      };
      if (continuous) {
        output.primary = isLastStep ? last : next;
        if (showProgress) {
          output.primary = /*#__PURE__*/React__default["default"].createElement("span", null, output.primary, " (", index + 1, "/", size, ")");
        }
      }
      if (showSkipButton && !isLastStep) {
        output.skip = /*#__PURE__*/React__default["default"].createElement("button", _extends({
          style: styles.buttonSkip,
          type: "button",
          "aria-live": "off"
        }, skipProps), skip);
      }
      if (!hideBackButton && index > 0) {
        output.back = /*#__PURE__*/React__default["default"].createElement("button", _extends({
          style: styles.buttonBack,
          type: "button"
        }, backProps), back);
      }
      output.close = !hideCloseButton && /*#__PURE__*/React__default["default"].createElement(JoyrideTooltipCloseBtn, _extends({
        styles: styles.buttonClose
      }, closeProps));
      return /*#__PURE__*/React__default["default"].createElement("div", _extends({
        key: "JoyrideTooltip",
        className: "react-joyride__tooltip",
        style: styles.tooltip
      }, tooltipProps), /*#__PURE__*/React__default["default"].createElement("div", {
        style: styles.tooltipContainer
      }, title && /*#__PURE__*/React__default["default"].createElement("h4", {
        style: styles.tooltipTitle,
        "aria-label": title
      }, title), /*#__PURE__*/React__default["default"].createElement("div", {
        style: styles.tooltipContent
      }, content)), !hideFooter && /*#__PURE__*/React__default["default"].createElement("div", {
        style: styles.tooltipFooter
      }, /*#__PURE__*/React__default["default"].createElement("div", {
        style: styles.tooltipFooterSpacer
      }, output.skip), output.back, /*#__PURE__*/React__default["default"].createElement("button", _extends({
        style: styles.buttonNext,
        type: "button"
      }, primaryProps), output.primary)), output.close);
    }
  }]);
  return JoyrideTooltipContainer;
}(React__default["default"].Component);

var _excluded = ["beaconComponent", "tooltipComponent"];
var JoyrideTooltip = /*#__PURE__*/function (_React$Component) {
  _inherits(JoyrideTooltip, _React$Component);
  var _super = _createSuper(JoyrideTooltip);
  function JoyrideTooltip() {
    var _this;
    _classCallCheck(this, JoyrideTooltip);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "handleClickBack", function (e) {
      e.preventDefault();
      var helpers = _this.props.helpers;
      helpers.prev();
    });
    _defineProperty(_assertThisInitialized(_this), "handleClickClose", function (e) {
      e.preventDefault();
      var helpers = _this.props.helpers;
      helpers.close();
    });
    _defineProperty(_assertThisInitialized(_this), "handleClickPrimary", function (e) {
      e.preventDefault();
      var _this$props = _this.props,
        continuous = _this$props.continuous,
        helpers = _this$props.helpers;
      if (!continuous) {
        helpers.close();
        return;
      }
      helpers.next();
    });
    _defineProperty(_assertThisInitialized(_this), "handleClickSkip", function (e) {
      e.preventDefault();
      var helpers = _this.props.helpers;
      helpers.skip();
    });
    _defineProperty(_assertThisInitialized(_this), "getElementsProps", function () {
      var _this$props2 = _this.props,
        continuous = _this$props2.continuous,
        isLastStep = _this$props2.isLastStep,
        setTooltipRef = _this$props2.setTooltipRef,
        step = _this$props2.step;
      var back = getText(step.locale.back);
      var close = getText(step.locale.close);
      var last = getText(step.locale.last);
      var next = getText(step.locale.next);
      var skip = getText(step.locale.skip);
      var primaryText = continuous ? next : close;
      if (isLastStep) {
        primaryText = last;
      }
      return {
        backProps: {
          'aria-label': back,
          'data-action': 'back',
          onClick: _this.handleClickBack,
          role: 'button',
          title: back
        },
        closeProps: {
          'aria-label': close,
          'data-action': 'close',
          onClick: _this.handleClickClose,
          role: 'button',
          title: close
        },
        primaryProps: {
          'aria-label': primaryText,
          'data-action': 'primary',
          onClick: _this.handleClickPrimary,
          role: 'button',
          title: primaryText
        },
        skipProps: {
          'aria-label': skip,
          'data-action': 'skip',
          onClick: _this.handleClickSkip,
          role: 'button',
          title: skip
        },
        tooltipProps: {
          'aria-modal': true,
          ref: setTooltipRef,
          role: 'alertdialog'
        }
      };
    });
    return _this;
  }
  _createClass(JoyrideTooltip, [{
    key: "render",
    value: function render() {
      var _this$props3 = this.props,
        continuous = _this$props3.continuous,
        index = _this$props3.index,
        isLastStep = _this$props3.isLastStep,
        size = _this$props3.size,
        step = _this$props3.step;
      step.beaconComponent;
        var tooltipComponent = step.tooltipComponent,
        cleanStep = _objectWithoutProperties(step, _excluded);
      var component;
      if (tooltipComponent) {
        var renderProps = _objectSpread2(_objectSpread2({}, this.getElementsProps()), {}, {
          continuous: continuous,
          index: index,
          isLastStep: isLastStep,
          size: size,
          step: cleanStep
        });
        var TooltipComponent = tooltipComponent;
        component = /*#__PURE__*/React__default["default"].createElement(TooltipComponent, renderProps);
      } else {
        component = /*#__PURE__*/React__default["default"].createElement(JoyrideTooltipContainer, _extends({}, this.getElementsProps(), {
          continuous: continuous,
          index: index,
          isLastStep: isLastStep,
          size: size,
          step: step
        }));
      }
      return component;
    }
  }]);
  return JoyrideTooltip;
}(React__default["default"].Component);

var JoyridePortal = /*#__PURE__*/function (_React$Component) {
  _inherits(JoyridePortal, _React$Component);
  var _super = _createSuper(JoyridePortal);
  function JoyridePortal() {
    _classCallCheck(this, JoyridePortal);
    return _super.apply(this, arguments);
  }
  _createClass(JoyridePortal, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (!canUseDOM) return;
      if (!isReact16) {
        this.renderReact15();
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if (!canUseDOM) return;
      if (!isReact16) {
        this.renderReact15();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (!canUseDOM || !this.node) return;
      if (!isReact16) {
        ReactDOM__default["default"].unmountComponentAtNode(this.node);
      }
      if (this.node.parentNode === document.body) {
        document.body.removeChild(this.node);
        this.node = undefined;
      }
    }
  }, {
    key: "appendNode",
    value: function appendNode() {
      var id = this.props.id;
      if (!this.node) {
        this.node = document.createElement('div');

        /* istanbul ignore else */
        if (id) {
          this.node.id = id;
        }
        document.body.appendChild(this.node);
      }
    }
  }, {
    key: "renderReact15",
    value: function renderReact15() {
      if (!canUseDOM) return null;
      var children = this.props.children;
      if (!this.node) {
        this.appendNode();
      }
      ReactDOM__default["default"].unstable_renderSubtreeIntoContainer(this, children, this.node);
      return null;
    }
  }, {
    key: "renderReact16",
    value: function renderReact16() {
      if (!canUseDOM || !isReact16) return null;
      var children = this.props.children;
      if (!this.node) {
        this.appendNode();
      }
      return /*#__PURE__*/ReactDOM__default["default"].createPortal(children, this.node);
    }
  }, {
    key: "render",
    value: function render() {
      if (!isReact16) {
        return null;
      }
      return this.renderReact16();
    }
  }]);
  return JoyridePortal;
}(React__default["default"].Component);

var JoyrideStep = /*#__PURE__*/function (_React$Component) {
  _inherits(JoyrideStep, _React$Component);
  var _super = _createSuper(JoyrideStep);
  function JoyrideStep() {
    var _this;
    _classCallCheck(this, JoyrideStep);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "scope", {
      removeScope: function removeScope() {}
    });
    /**
     * Beacon click/hover event listener
     *
     * @param {Event} e
     */
    _defineProperty(_assertThisInitialized(_this), "handleClickHoverBeacon", function (e) {
      var _this$props = _this.props,
        step = _this$props.step,
        update = _this$props.update;
      if (e.type === 'mouseenter' && step.event !== 'hover') {
        return;
      }
      update({
        lifecycle: LIFECYCLE.TOOLTIP
      });
    });
    _defineProperty(_assertThisInitialized(_this), "handleClickOverlay", function () {
      var _this$props2 = _this.props,
        helpers = _this$props2.helpers,
        step = _this$props2.step;
      if (!step.disableOverlayClose) {
        helpers.close();
      }
    });
    _defineProperty(_assertThisInitialized(_this), "setTooltipRef", function (c) {
      _this.tooltip = c;
    });
    _defineProperty(_assertThisInitialized(_this), "setPopper", function (popper, type) {
      var _this$props3 = _this.props,
        action = _this$props3.action,
        setPopper = _this$props3.setPopper,
        update = _this$props3.update;
      if (type === 'wrapper') {
        _this.beaconPopper = popper;
      } else {
        _this.tooltipPopper = popper;
      }
      setPopper(popper, type);
      if (_this.beaconPopper && _this.tooltipPopper) {
        update({
          action: action === ACTIONS.CLOSE ? ACTIONS.CLOSE : action,
          lifecycle: LIFECYCLE.READY
        });
      }
    });
    return _this;
  }
  _createClass(JoyrideStep, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props4 = this.props,
        debug = _this$props4.debug,
        index = _this$props4.index;
      log({
        title: "step:".concat(index),
        data: [{
          key: 'props',
          value: this.props
        }],
        debug: debug
      });
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var _this$props5 = this.props,
        action = _this$props5.action,
        callback = _this$props5.callback,
        continuous = _this$props5.continuous,
        controlled = _this$props5.controlled,
        debug = _this$props5.debug,
        index = _this$props5.index,
        lifecycle = _this$props5.lifecycle,
        size = _this$props5.size,
        status = _this$props5.status,
        step = _this$props5.step,
        update = _this$props5.update;
      var prevStep = prevProps.step;
      document.querySelector(prevStep === null || prevStep === void 0 ? void 0 : prevStep.target).style.boxShadow = 'none';
      document.querySelector(step === null || step === void 0 ? void 0 : step.target).style.boxShadow = '0 0 4px 2px #7839EE';
      var _treeChanges = treeChanges__default["default"](prevProps, this.props),
        changed = _treeChanges.changed,
        changedFrom = _treeChanges.changedFrom;
      var state = {
        action: action,
        controlled: controlled,
        index: index,
        lifecycle: lifecycle,
        size: size,
        status: status
      };
      var skipBeacon = continuous && action !== ACTIONS.CLOSE && (index > 0 || action === ACTIONS.PREV);
      var hasStoreChanged = changed('action') || changed('index') || changed('lifecycle') || changed('status');
      var hasStarted = changedFrom('lifecycle', [LIFECYCLE.TOOLTIP, LIFECYCLE.INIT], LIFECYCLE.INIT);
      var isAfterAction = changed('action', [ACTIONS.NEXT, ACTIONS.PREV, ACTIONS.SKIP, ACTIONS.CLOSE]);
      if (isAfterAction && (hasStarted || controlled)) {
        callback(_objectSpread2(_objectSpread2({}, state), {}, {
          index: prevProps.index,
          lifecycle: LIFECYCLE.COMPLETE,
          step: prevProps.step,
          type: EVENTS.STEP_AFTER
        }));
      }
      if (step.placement === 'center' && status === STATUS.RUNNING && changed('index') && action !== ACTIONS.START && lifecycle === LIFECYCLE.INIT) {
        update({
          lifecycle: LIFECYCLE.READY
        });
      }

      // There's a step to use, but there's no target in the DOM
      if (hasStoreChanged) {
        var element = getElement(step.target);
        var elementExists = !!element;
        var hasRenderedTarget = elementExists && isElementVisible(element);
        if (hasRenderedTarget) {
          if (changedFrom('status', STATUS.READY, STATUS.RUNNING) || changedFrom('lifecycle', LIFECYCLE.INIT, LIFECYCLE.READY)) {
            callback(_objectSpread2(_objectSpread2({}, state), {}, {
              step: step,
              type: EVENTS.STEP_BEFORE
            }));
          }
        } else {
          console.warn(elementExists ? 'Target not visible' : 'Target not mounted', step); //eslint-disable-line no-console
          callback(_objectSpread2(_objectSpread2({}, state), {}, {
            type: EVENTS.TARGET_NOT_FOUND,
            step: step
          }));
          if (!controlled) {
            update({
              index: index + ([ACTIONS.PREV].indexOf(action) !== -1 ? -1 : 1)
            });
          }
        }
      }
      if (changedFrom('lifecycle', LIFECYCLE.INIT, LIFECYCLE.READY)) {
        update({
          lifecycle: hideBeacon(step) || skipBeacon ? LIFECYCLE.TOOLTIP : LIFECYCLE.BEACON
        });
      }
      if (changed('index')) {
        log({
          title: "step:".concat(lifecycle),
          data: [{
            key: 'props',
            value: this.props
          }],
          debug: debug
        });
      }

      /* istanbul ignore else */
      if (changed('lifecycle', LIFECYCLE.BEACON)) {
        callback(_objectSpread2(_objectSpread2({}, state), {}, {
          step: step,
          type: EVENTS.BEACON
        }));
      }
      if (changed('lifecycle', LIFECYCLE.TOOLTIP)) {
        callback(_objectSpread2(_objectSpread2({}, state), {}, {
          step: step,
          type: EVENTS.TOOLTIP
        }));
        this.scope = new Scope(this.tooltip, {
          selector: '[data-action=primary]'
        });
        this.scope.setFocus();
      }
      if (changedFrom('lifecycle', [LIFECYCLE.TOOLTIP, LIFECYCLE.INIT], LIFECYCLE.INIT)) {
        this.scope.removeScope();
        delete this.beaconPopper;
        delete this.tooltipPopper;
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var step = this.props.step;
      document.querySelector(step === null || step === void 0 ? void 0 : step.target).style.boxShadow = 'none';
      this.scope.removeScope();
    }
  }, {
    key: "open",
    get: function get() {
      var _this$props6 = this.props,
        step = _this$props6.step,
        lifecycle = _this$props6.lifecycle;
      return !!(hideBeacon(step) || lifecycle === LIFECYCLE.TOOLTIP);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props7 = this.props,
        continuous = _this$props7.continuous,
        debug = _this$props7.debug,
        helpers = _this$props7.helpers,
        index = _this$props7.index,
        lifecycle = _this$props7.lifecycle,
        nonce = _this$props7.nonce,
        shouldScroll = _this$props7.shouldScroll,
        size = _this$props7.size,
        step = _this$props7.step;
      var target = getElement(step.target);
      if (!validateStep(step) || !is__default["default"].domElement(target)) {
        return null;
      }
      return /*#__PURE__*/React__default["default"].createElement("div", {
        key: "JoyrideStep-".concat(index),
        className: "react-joyride__step"
      }, /*#__PURE__*/React__default["default"].createElement(JoyridePortal, {
        id: "react-joyride-portal"
      }, /*#__PURE__*/React__default["default"].createElement(JoyrideOverlay, _extends({}, step, {
        debug: debug,
        lifecycle: lifecycle,
        onClickOverlay: this.handleClickOverlay
      }))), /*#__PURE__*/React__default["default"].createElement(Floater__default["default"], _extends({
        component: /*#__PURE__*/React__default["default"].createElement(JoyrideTooltip, {
          continuous: continuous,
          helpers: helpers,
          index: index,
          isLastStep: index + 1 === size,
          setTooltipRef: this.setTooltipRef,
          size: size,
          step: step
        }),
        debug: debug,
        getPopper: this.setPopper,
        id: "react-joyride-step-".concat(index),
        isPositioned: step.isFixed || hasPosition(target),
        open: this.open,
        placement: step.placement,
        target: step.target
      }, step.floaterProps), /*#__PURE__*/React__default["default"].createElement(JoyrideBeacon, {
        beaconComponent: step.beaconComponent,
        locale: step.locale,
        nonce: nonce,
        onClickOrHover: this.handleClickHoverBeacon,
        shouldFocus: shouldScroll,
        styles: step.styles
      })));
    }
  }]);
  return JoyrideStep;
}(React__default["default"].Component);

var Joyride = /*#__PURE__*/function (_React$Component) {
  _inherits(Joyride, _React$Component);
  var _super = _createSuper(Joyride);
  function Joyride(props) {
    var _this;
    _classCallCheck(this, Joyride);
    _this = _super.call(this, props);
    _defineProperty(_assertThisInitialized(_this), "initStore", function () {
      var _this$props = _this.props,
        debug = _this$props.debug,
        getHelpers = _this$props.getHelpers,
        run = _this$props.run,
        stepIndex = _this$props.stepIndex;
      _this.store = new createStore(_objectSpread2(_objectSpread2({}, _this.props), {}, {
        controlled: run && is__default["default"].number(stepIndex)
      }));
      _this.helpers = _this.store.getHelpers();
      var addListener = _this.store.addListener;
      log({
        title: 'init',
        data: [{
          key: 'props',
          value: _this.props
        }, {
          key: 'state',
          value: _this.state
        }],
        debug: debug
      });

      // Sync the store to this component's state.
      addListener(_this.syncState);
      getHelpers(_this.helpers);
      return _this.store.getState();
    });
    /**
     * Trigger the callback.
     *
     * @private
     * @param {Object} data
     */
    _defineProperty(_assertThisInitialized(_this), "callback", function (data) {
      var callback = _this.props.callback;

      /* istanbul ignore else */
      if (is__default["default"]["function"](callback)) {
        callback(data);
      }
    });
    /**
     * Keydown event listener
     *
     * @private
     * @param {Event} e - Keyboard event
     */
    _defineProperty(_assertThisInitialized(_this), "handleKeyboard", function (e) {
      var _this$state = _this.state,
        index = _this$state.index,
        lifecycle = _this$state.lifecycle;
      var steps = _this.props.steps;
      var step = steps[index];
      var intKey = window.Event ? e.which : e.keyCode;
      if (lifecycle === LIFECYCLE.TOOLTIP) {
        if (intKey === 27 && step && !step.disableCloseOnEsc) {
          _this.store.close();
        }
      }
    });
    /**
     * Sync the store with the component's state
     *
     * @param {Object} state
     */
    _defineProperty(_assertThisInitialized(_this), "syncState", function (state) {
      _this.setState(state);
    });
    _defineProperty(_assertThisInitialized(_this), "setPopper", function (popper, type) {
      if (type === 'wrapper') {
        _this.beaconPopper = popper;
      } else {
        _this.tooltipPopper = popper;
      }
    });
    _defineProperty(_assertThisInitialized(_this), "shouldScroll", function (disableScrolling, index, scrollToFirstStep, lifecycle, step, target, prevState) {
      return !disableScrolling && (index !== 0 || scrollToFirstStep || lifecycle === LIFECYCLE.TOOLTIP) && step.placement !== 'center' && (!step.isFixed || !hasPosition(target)) &&
      // fixed steps don't need to scroll
      prevState.lifecycle !== lifecycle && [LIFECYCLE.BEACON, LIFECYCLE.TOOLTIP].indexOf(lifecycle) !== -1;
    });
    _this.state = _this.initStore();
    return _this;
  }
  _createClass(Joyride, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (!canUseDOM) return;
      var _this$props2 = this.props,
        disableCloseOnEsc = _this$props2.disableCloseOnEsc,
        debug = _this$props2.debug,
        run = _this$props2.run,
        steps = _this$props2.steps;
      var start = this.store.start;
      if (validateSteps(steps, debug) && run) {
        start();
      }

      /* istanbul ignore else */
      if (!disableCloseOnEsc) {
        document.body.addEventListener('keydown', this.handleKeyboard, {
          passive: true
        });
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      if (!canUseDOM) return;
      var _this$state2 = this.state,
        action = _this$state2.action,
        controlled = _this$state2.controlled,
        index = _this$state2.index,
        lifecycle = _this$state2.lifecycle,
        status = _this$state2.status;
      var _this$props3 = this.props,
        debug = _this$props3.debug,
        run = _this$props3.run,
        stepIndex = _this$props3.stepIndex,
        steps = _this$props3.steps;
      var prevSteps = prevProps.steps,
        prevStepIndex = prevProps.stepIndex;
      var _this$store = this.store,
        reset = _this$store.reset,
        setSteps = _this$store.setSteps,
        start = _this$store.start,
        stop = _this$store.stop,
        update = _this$store.update;
      var _treeChanges = treeChanges__default["default"](prevProps, this.props),
        changedProps = _treeChanges.changed;
      var _treeChanges2 = treeChanges__default["default"](prevState, this.state),
        changed = _treeChanges2.changed,
        changedFrom = _treeChanges2.changedFrom;
      var step = getMergedStep(steps[index], this.props);
      var stepsChanged = !isEqual(prevSteps, steps);
      var stepIndexChanged = is__default["default"].number(stepIndex) && changedProps('stepIndex');
      var target = getElement(step === null || step === void 0 ? void 0 : step.target);
      if (stepsChanged) {
        if (validateSteps(steps, debug)) {
          setSteps(steps);
        } else {
          console.warn('Steps are not valid', steps); //eslint-disable-line no-console
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
        var nextAction = prevStepIndex < stepIndex ? ACTIONS.NEXT : ACTIONS.PREV;
        if (action === ACTIONS.STOP) {
          nextAction = ACTIONS.START;
        }
        if (!([STATUS.FINISHED, STATUS.SKIPPED].indexOf(status) !== -1)) {
          update({
            action: action === ACTIONS.CLOSE ? ACTIONS.CLOSE : nextAction,
            index: stepIndex,
            lifecycle: LIFECYCLE.INIT
          });
        }
      }

      // Update the index if the first step is not found
      if (!controlled && status === STATUS.RUNNING && index === 0 && !target) {
        update({
          index: index + 1
        });
        this.callback(_objectSpread2(_objectSpread2({}, this.state), {}, {
          type: EVENTS.TARGET_NOT_FOUND,
          step: step
        }));
      }
      var callbackData = _objectSpread2(_objectSpread2({}, this.state), {}, {
        index: index,
        step: step
      });
      var isAfterAction = changed('action', [ACTIONS.NEXT, ACTIONS.PREV, ACTIONS.SKIP, ACTIONS.CLOSE]);
      if (isAfterAction && changed('status', STATUS.PAUSED)) {
        var prevStep = getMergedStep(steps[prevState.index], this.props);
        this.callback(_objectSpread2(_objectSpread2({}, callbackData), {}, {
          index: prevState.index,
          lifecycle: LIFECYCLE.COMPLETE,
          step: prevStep,
          type: EVENTS.STEP_AFTER
        }));
      }
      if (changed('status', [STATUS.FINISHED, STATUS.SKIPPED])) {
        var _prevStep = getMergedStep(steps[prevState.index], this.props);
        if (!controlled) {
          this.callback(_objectSpread2(_objectSpread2({}, callbackData), {}, {
            index: prevState.index,
            lifecycle: LIFECYCLE.COMPLETE,
            step: _prevStep,
            type: EVENTS.STEP_AFTER
          }));
        }
        this.callback(_objectSpread2(_objectSpread2({}, callbackData), {}, {
          index: prevState.index,
          // Return the last step when the tour is finished
          step: _prevStep,
          type: EVENTS.TOUR_END
        }));
        reset();
      } else if (changedFrom('status', [STATUS.IDLE, STATUS.READY], STATUS.RUNNING)) {
        this.callback(_objectSpread2(_objectSpread2({}, callbackData), {}, {
          type: EVENTS.TOUR_START
        }));
      } else if (changed('status')) {
        this.callback(_objectSpread2(_objectSpread2({}, callbackData), {}, {
          type: EVENTS.TOUR_STATUS
        }));
      } else if (changed('action', ACTIONS.RESET)) {
        this.callback(_objectSpread2(_objectSpread2({}, callbackData), {}, {
          type: EVENTS.TOUR_STATUS
        }));
      }
      if (step) {
        this.scrollToStep(prevState);
        if (step.placement === 'center' && status === STATUS.RUNNING && action === ACTIONS.START && lifecycle === LIFECYCLE.INIT) {
          update({
            lifecycle: LIFECYCLE.READY
          });
        }
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var disableCloseOnEsc = this.props.disableCloseOnEsc;

      /* istanbul ignore else */
      if (!disableCloseOnEsc) {
        document.body.removeEventListener('keydown', this.handleKeyboard);
      }
    }
  }, {
    key: "scrollToStep",
    value: function scrollToStep(prevState) {
      var _this$state3 = this.state,
        index = _this$state3.index,
        lifecycle = _this$state3.lifecycle,
        status = _this$state3.status;
      var _this$props4 = this.props,
        debug = _this$props4.debug,
        disableScrollParentFix = _this$props4.disableScrollParentFix,
        scrollToFirstStep = _this$props4.scrollToFirstStep,
        scrollOffset = _this$props4.scrollOffset,
        scrollDuration = _this$props4.scrollDuration,
        steps = _this$props4.steps;
      var step = getMergedStep(steps[index], this.props);

      /* istanbul ignore else */
      if (step) {
        var target = getElement(step.target);
        var shouldScroll = this.shouldScroll(step.disableScrolling, index, scrollToFirstStep, lifecycle, step, target, prevState);
        if (status === STATUS.RUNNING && shouldScroll) {
          var hasCustomScroll = hasCustomScrollParent(target, disableScrollParentFix);
          var scrollParent = getScrollParent(target, disableScrollParentFix);
          var scrollY = Math.floor(getScrollTo(target, scrollOffset, disableScrollParentFix)) || 0;
          log({
            title: 'scrollToStep',
            data: [{
              key: 'index',
              value: index
            }, {
              key: 'lifecycle',
              value: lifecycle
            }, {
              key: 'status',
              value: status
            }],
            debug: debug
          });

          /* istanbul ignore else */
          if (lifecycle === LIFECYCLE.BEACON && this.beaconPopper) {
            var _this$beaconPopper = this.beaconPopper,
              placement = _this$beaconPopper.placement,
              popper = _this$beaconPopper.popper;

            /* istanbul ignore else */
            if (!(['bottom'].indexOf(placement) !== -1) && !hasCustomScroll) {
              scrollY = Math.floor(popper.top - scrollOffset);
            }
          } else if (lifecycle === LIFECYCLE.TOOLTIP && this.tooltipPopper) {
            var _this$tooltipPopper = this.tooltipPopper,
              flipped = _this$tooltipPopper.flipped,
              _placement = _this$tooltipPopper.placement,
              _popper = _this$tooltipPopper.popper;
            if (['top', 'right', 'left'].indexOf(_placement) !== -1 && !flipped && !hasCustomScroll) {
              scrollY = Math.floor(_popper.top - scrollOffset);
            } else {
              scrollY -= step.spotlightPadding;
            }
          }
          scrollY = scrollY >= 0 ? scrollY : 0;

          /* istanbul ignore else */
          if (status === STATUS.RUNNING) {
            scrollTo(scrollY, scrollParent, scrollDuration);
          }
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      if (!canUseDOM) return null;
      var _this$state4 = this.state,
        index = _this$state4.index,
        status = _this$state4.status;
      var _this$props5 = this.props,
        continuous = _this$props5.continuous,
        debug = _this$props5.debug,
        nonce = _this$props5.nonce,
        scrollToFirstStep = _this$props5.scrollToFirstStep,
        steps = _this$props5.steps;
      var step = getMergedStep(steps[index], this.props);
      var output;
      if (status === STATUS.RUNNING && step) {
        output = /*#__PURE__*/React__default["default"].createElement(JoyrideStep, _extends({}, this.state, {
          callback: this.callback,
          continuous: continuous,
          debug: debug,
          setPopper: this.setPopper,
          helpers: this.helpers,
          nonce: nonce,
          shouldScroll: !step.disableScrolling && (index !== 0 || scrollToFirstStep),
          step: step,
          update: this.store.update
        }));
      }
      return /*#__PURE__*/React__default["default"].createElement("div", {
        className: "react-joyride"
      }, output);
    }
  }]);
  return Joyride;
}(React__default["default"].Component);
_defineProperty(Joyride, "defaultProps", {
  continuous: false,
  debug: false,
  disableCloseOnEsc: false,
  disableOverlay: false,
  disableOverlayClose: false,
  disableScrolling: false,
  disableScrollParentFix: false,
  getHelpers: function getHelpers() {},
  hideBackButton: false,
  run: true,
  scrollOffset: 20,
  scrollDuration: 300,
  scrollToFirstStep: false,
  showSkipButton: false,
  showProgress: false,
  spotlightClicks: false,
  spotlightPadding: 10,
  steps: []
});

exports.ACTIONS = ACTIONS;
exports.EVENTS = EVENTS;
exports.LIFECYCLE = LIFECYCLE;
exports.STATUS = STATUS;
exports["default"] = Joyride;
