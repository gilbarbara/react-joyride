import { useEffect, useRef } from 'react';

import { noop } from '~/modules/helpers';

const TABBABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), area[href], [tabindex="0"]';

export default function useFocusTrap(element: HTMLElement | null, selector?: string | null): void {
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!element) {
      return noop;
    }

    previousFocus.current = document.activeElement as HTMLElement | null;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') {
        return;
      }

      event.preventDefault();

      const elements = [...element.querySelectorAll<HTMLElement>(TABBABLE_SELECTOR)];
      const { shiftKey } = event;

      if (!elements.length) {
        return;
      }

      let index = document.activeElement
        ? elements.indexOf(document.activeElement as HTMLElement)
        : 0;

      if (index === -1 || (!shiftKey && index + 1 === elements.length)) {
        index = 0;
      } else if (shiftKey && index === 0) {
        index = elements.length - 1;
      } else {
        index += shiftKey ? -1 : 1;
      }

      elements[index].focus();
    };

    element.addEventListener('keydown', handleKeyDown, false);

    let timerId: ReturnType<typeof setTimeout> | undefined;

    if (selector) {
      const target = element.querySelector<HTMLElement>(selector);

      if (target) {
        // Delay focus to allow Floater's CSS transition to complete
        timerId = setTimeout(() => {
          target.focus({ preventScroll: true });
        }, 100);
      }
    }

    return () => {
      element.removeEventListener('keydown', handleKeyDown);

      if (timerId !== undefined) {
        clearTimeout(timerId);
      }

      previousFocus.current?.focus({ preventScroll: true });
    };
  }, [element, selector]);
}
