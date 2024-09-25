import chalk from 'chalk';

import { STATUS } from '~/literals';

import { CallBackProps } from '~/types';

export function callbackResponseFactory(initial?: Partial<CallBackProps>) {
  const { controlled = false, size = 6, status = STATUS.RUNNING } = initial ?? {};

  return (input: Partial<CallBackProps>) => {
    return {
      controlled,
      origin: null,
      size,
      status,
      step: expect.any(Object),
      ...input,
    };
  };
}

export function capitalize<T extends string = string>(input: T) {
  return (input.charAt(0).toLocaleUpperCase() +
    input.slice(1).toLocaleLowerCase()) as Capitalize<T>;
}

type Colors = 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white' | 'black';

interface LoggerOptions {
  bg?: Colors;
  char?: string;
  color?: Colors;
  data?: any;
  level?: number;
  spaced?: boolean;
}

export function logger(text: string, options: LoggerOptions = {}) {
  const { bg, char = '#', color, data, level, spaced } = options;
  let title = text;

  if (level) {
    title = `${char.repeat(level)} ${text}`;
  }

  if (color) {
    title = chalk[color](title);
  }

  if (bg) {
    title = chalk[`bg${capitalize(bg)}`](title);
  }

  if (spaced) {
    console.log();
  }

  console.log(chalk.bold(title));

  if (data) {
    console.log(data);
  }

  if (spaced) {
    console.log();
  }
}
