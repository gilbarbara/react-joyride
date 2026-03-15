import { cloneElement, type FC, isValidElement, type ReactElement, type ReactNode } from 'react';
import innerText from 'react-innertext';
import deepmergeFactory from '@fastify/deepmerge';
import is from 'is-lite';

import { ACTIONS, LIFECYCLE } from '~/literals';

import type {
  Actions,
  AnyObject,
  Lifecycle,
  NarrowPlainObject,
  PlainObject,
  Simplify,
  State,
  Step,
  StepMerged,
} from '~/types';

import { getScrollParent, hasPosition, scrollDocument } from './dom';

type RemoveType<TObject, TExclude = undefined> = {
  [Key in keyof TObject as TObject[Key] extends TExclude ? never : Key]: TObject[Key];
};

interface GetReactNodeTextOptions {
  defaultValue?: any;
  step?: number;
  steps?: number;
}

interface NeedsScrollingOptions {
  isFirstStep: boolean;
  scrollToFirstStep: boolean;
  step: StepMerged;
  target: HTMLElement | null;
  targetLifecycle?: Lifecycle;
}

/**
 * Remove properties with undefined value from an object
 */
export function cleanUpObject<T extends PlainObject>(input: T) {
  const output: Record<string, unknown> = {};

  for (const key in input) {
    if (input[key] !== undefined) {
      output[key] = input[key];
    }
  }

  return output as RemoveType<T>;
}

export function deepMerge<T extends object>(...objects: object[]): T {
  return deepmergeFactory({
    all: true,
    isMergeableObject: (value): value is object =>
      !(!is.plainObject(value) || isValidElement(value)),
  })(...objects) as T;
}

/**
 * Get Object type
 */
export function getObjectType(value: unknown): string {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}

export function getReactNodeText(input: ReactNode, options: GetReactNodeTextOptions = {}): string {
  const { defaultValue, step, steps } = options;
  let text = innerText(input);

  if (!text) {
    if (
      isValidElement(input) &&
      !Object.values(input.props as Record<string, unknown>).length &&
      getObjectType(input.type) === 'function'
    ) {
      try {
        const component = (input.type as FC)({}) as ReactNode;

        text = getReactNodeText(component, options);
      } catch {
        text = innerText(defaultValue);
      }
    } else {
      text = innerText(defaultValue);
    }
  } else if ((text.includes('{current}') || text.includes('{total}')) && step && steps) {
    text = text.replace('{current}', step.toString()).replace('{total}', steps.toString());
  }

  return text;
}

/**
 * Convert hex to RGB
 */
export function hexToRGB(hex: string): Array<number> {
  const shorthandRegex = /^#?([\da-f])([\da-f])([\da-f])$/i;
  const properHex = hex.replace(shorthandRegex, (_m, r, g, b) => r + r + g + g + b + b);

  const result = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})/i.exec(properHex);

  return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : [];
}

/**
 * Log method calls if debug is enabled
 */
export function log(debug: boolean, scope: string, title: string, ...data: unknown[]): void {
  if (!debug) {
    return;
  }

  const now = new Date();
  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(now.getMilliseconds()).padStart(3, '0')}`;

  // eslint-disable-next-line no-console
  console.log(
    `${scope} %c${title}%c ${time}`,
    'font-weight: bold',
    'color: gray; font-weight: normal',
    ...data,
  );
}

/**
 * Merges the defaultProps with literal values with the incoming props, removing undefined values from it that would override the defaultProps.
 * The result is a type-safe object with the defaultProps as required properties.
 */
export function mergeProps<TDefaultProps extends PlainObject<any>, TProps extends PlainObject<any>>(
  defaultProps: TDefaultProps,
  props: TProps,
) {
  const cleanProps = cleanUpObject(props);

  return { ...defaultProps, ...cleanProps } as unknown as Simplify<
    TProps & Required<Pick<TProps, keyof TDefaultProps & string>>
  >;
}

export function needsScrolling(options: NeedsScrollingOptions): boolean {
  const { isFirstStep, scrollToFirstStep, step, target, targetLifecycle } = options;

  if (
    step.skipScroll ||
    (isFirstStep && !scrollToFirstStep && targetLifecycle !== LIFECYCLE.TOOLTIP) ||
    step.placement === 'center'
  ) {
    return false;
  }

  const parent = (target?.isConnected ? getScrollParent(target) : scrollDocument()) as Element;
  const isCustomScrollParent = parent ? !parent.isSameNode(scrollDocument()) : false;

  if ((step.isFixed || hasPosition(target)) && !isCustomScrollParent) {
    return false;
  }

  return parent.scrollHeight > parent.clientHeight;
}

/**
 * A function that does nothing.
 */
export function noop() {
  return undefined;
}

/**
 * Type-safe Object.keys()
 */
export function objectKeys<T extends AnyObject>(input: T) {
  return Object.keys(input) as Array<keyof T>;
}

/**
 * Remove properties from an object
 */
export function omit<T extends Record<string, any>, K extends keyof T>(
  input: NarrowPlainObject<T>,
  ...filter: K[]
) {
  if (!is.plainObject(input)) {
    throw new TypeError('Expected an object');
  }

  const output: any = {};

  for (const key in input) {
    /* istanbul ignore else */
    if ({}.hasOwnProperty.call(input, key)) {
      if (!filter.includes(key as unknown as K)) {
        output[key] = input[key];
      }
    }
  }

  return output as Omit<T, K>;
}

/**
 * Select properties from an object
 */
export function pick<T extends Record<string, any>, K extends keyof T>(
  input: NarrowPlainObject<T>,
  ...filter: K[]
) {
  if (!is.plainObject(input)) {
    throw new TypeError('Expected an object');
  }

  if (!filter.length) {
    return input;
  }

  const output: any = {};

  for (const key in input) {
    /* istanbul ignore else */
    if ({}.hasOwnProperty.call(input, key)) {
      if (filter.includes(key as unknown as K)) {
        output[key] = input[key];
      }
    }
  }

  return output as Pick<T, K>;
}

export function replaceLocaleContent(input: ReactNode, step: number, steps: number): ReactNode {
  const replacer = (text: string) =>
    text.replace('{current}', String(step)).replace('{total}', String(steps));

  if (getObjectType(input) === 'string') {
    return replacer(input as string);
  }

  if (!isValidElement(input)) {
    return input;
  }

  const { children } = input.props as { children?: ReactNode };

  if (is.string(children) && children.includes('{current}')) {
    return cloneElement(input as ReactElement<{ children?: ReactNode }>, {
      children: replacer(children),
    });
  }

  if (Array.isArray(children)) {
    return cloneElement(input as ReactElement<{ children?: ReactNode }>, {
      children: children.map((child: ReactNode) => {
        if (typeof child === 'string') {
          return replacer(child);
        }

        return replaceLocaleContent(child, step, steps);
      }),
    });
  }

  if (is.function(input.type) && !Object.values(input.props as Record<string, unknown>).length) {
    try {
      const component = (input.type as FC)({}) as ReactNode;

      return replaceLocaleContent(component, step, steps);
    } catch {
      return input;
    }
  }

  return input;
}

/**
 * Decide if the step shouldn't skip the beacon
 */
export function shouldHideBeacon(step: Step, state: State, continuous: boolean): boolean {
  const { action } = state;

  const withContinuous = continuous && ([ACTIONS.PREV, ACTIONS.NEXT] as Actions[]).includes(action);

  return step.skipBeacon || step.placement === 'center' || withContinuous;
}

/**
 * Sort object keys
 */
export function sortObjectKeys<T extends PlainObject>(input: T) {
  return objectKeys(input)
    .sort()
    .reduce((acc, key) => {
      acc[key] = input[key];

      return acc;
    }, {} as T);
}
