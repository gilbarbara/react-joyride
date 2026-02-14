import { useCallback, useEffect, useRef, useState } from 'react';

import {
  getClientRect,
  getElement,
  getElementPosition,
  getScrollParent,
  hasPosition,
} from '~/modules/dom';

export interface TargetRect {
  height: number;
  isFixed: boolean;
  left: number;
  top: number;
  width: number;
}

const defaultRect: TargetRect = {
  height: 0,
  isFixed: false,
  left: 0,
  top: 0,
  width: 0,
};

function computeRect(target: string | HTMLElement, spotlightPadding: number): TargetRect {
  const element = getElement(target);

  if (!element) {
    return defaultRect;
  }

  const elementRect = getClientRect(element);
  const isFixed = hasPosition(element);
  const top = getElementPosition(element, spotlightPadding);

  return {
    height: Math.round((elementRect?.height ?? 0) + spotlightPadding * 2),
    isFixed,
    left: Math.round((elementRect?.left ?? 0) - spotlightPadding),
    top,
    width: Math.round((elementRect?.width ?? 0) + spotlightPadding * 2),
  };
}

export default function useTargetPosition(
  target: string | HTMLElement,
  spotlightPadding: number,
): TargetRect {
  const [rect, setRect] = useState<TargetRect>(() => computeRect(target, spotlightPadding));
  const timeoutRef = useRef<number>(undefined);
  const scrollParentRef = useRef<Element | Document | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);

  const updateRect = useCallback(() => {
    clearTimeout(timeoutRef.current);

    timeoutRef.current = window.setTimeout(() => {
      setRect(previous => {
        const next = computeRect(target, spotlightPadding);

        if (
          previous.top === next.top &&
          previous.left === next.left &&
          previous.width === next.width &&
          previous.height === next.height &&
          previous.isFixed === next.isFixed
        ) {
          return previous;
        }

        return next;
      });
    }, 100);
  }, [target, spotlightPadding]);

  useEffect(() => {
    const element = getElement(target);

    scrollParentRef.current = getScrollParent(element ?? document.body, true);

    // Scroll listeners
    if (scrollParentRef.current) {
      scrollParentRef.current.addEventListener('scroll', updateRect, { passive: true });
    }

    window.addEventListener('scroll', updateRect, { passive: true });
    window.addEventListener('resize', updateRect);

    // ResizeObserver on target
    if (element && typeof ResizeObserver !== 'undefined') {
      observerRef.current = new ResizeObserver(updateRect);
      observerRef.current.observe(element);
    }

    // Compute initial rect for this target
    setRect(computeRect(target, spotlightPadding));

    return () => {
      if (scrollParentRef.current) {
        scrollParentRef.current.removeEventListener('scroll', updateRect);
      }

      window.removeEventListener('scroll', updateRect);
      window.removeEventListener('resize', updateRect);

      observerRef.current?.disconnect();
      clearTimeout(timeoutRef.current);
    };
  }, [target, spotlightPadding, updateRect]);

  return rect;
}
