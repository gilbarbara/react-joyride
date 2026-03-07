/* eslint-disable no-console */

import { isValidElement } from 'react';
import type { Options, Props } from 'react-joyride';
import deepmergeFactory from '@fastify/deepmerge';
import is from 'is-lite';

export function deepMerge<T extends object>(...objects: object[]): T {
  return deepmergeFactory({
    all: true,
    isMergeableObject: (value): value is object =>
      !(!is.plainObject(value) || isValidElement(value)),
  })(...objects) as T;
}

export function delay(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms));
}

export function getScreenSize() {
  const { innerWidth } = window;
  let breakpoint = 'xs';

  if (innerWidth >= 1024) {
    breakpoint = 'lg';
  } else if (innerWidth >= 768) {
    breakpoint = 'md';
  } else if (innerWidth >= 400) {
    breakpoint = 'sm';
  }

  return breakpoint;
}

export function getTourColors(isDarkMode: boolean): Partial<Options> {
  return {
    arrowColor: isDarkMode ? '#333333' : '#ffffff',
    backgroundColor: isDarkMode ? '#333333' : '#ffffff',
    primaryColor: isDarkMode ? '#ffffff' : '#000000',
    textColor: isDarkMode ? '#ffffff' : '#000000',
    overlayColor: isDarkMode ? '#00000080' : '#00000080',
  };
}

export function logGroup(type: string, data: any) {
  console.groupCollapsed(type);
  console.log(data);
  console.groupEnd();
}

export function mergeProps(
  baseProps: Partial<Props>,
  overrideProps: Partial<Props>,
): Omit<Props, 'steps'> {
  const merged = deepMerge<Omit<Props, 'steps'>>(baseProps, overrideProps);

  // deepMerge skips undefined values, so apply explicit undefined overrides
  for (const key of Object.keys(overrideProps) as Array<keyof typeof overrideProps>) {
    if (overrideProps[key] === undefined) {
      delete (merged as Record<string, unknown>)[key];
    }
  }

  return merged;
}
