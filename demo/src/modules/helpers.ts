/* eslint-disable no-console */

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

export function logGroup(type: string, data: any) {
  console.groupCollapsed(type);
  console.log(data);
  console.groupEnd();
}
