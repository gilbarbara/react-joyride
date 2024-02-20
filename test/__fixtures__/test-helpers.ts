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
