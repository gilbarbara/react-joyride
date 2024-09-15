import { ReactElement } from 'react';
import { createPortal } from 'react-dom';

import { canUseDOM } from '~/modules/dom';

interface Props {
  children: ReactElement;
  element: HTMLElement;
}

export default function JoyridePortal(props: Props) {
  const { children, element } = props;

  if (!canUseDOM() || !element) {
    return null;
  }

  return createPortal(children, element);
}
