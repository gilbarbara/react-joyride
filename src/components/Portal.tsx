import { ReactElement } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  children: ReactElement;
  element: HTMLElement;
}

export default function JoyridePortal(props: Props) {
  const { children, element } = props;

  if (!element) {
    return null;
  }

  return createPortal(children, element);
}
