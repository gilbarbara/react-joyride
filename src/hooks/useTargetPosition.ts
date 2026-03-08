import { useCallback, useEffect, useRef, useState } from 'react';

import {
  getClientRect,
  getElement,
  getElementPosition,
  getScrollParent,
  hasPosition,
} from '~/modules/dom';

import type { SpotlightPadding, StepTarget } from '~/types';

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

function computeRect(target: StepTarget, spotlightPadding: Required<SpotlightPadding>): TargetRect {
  const element = getElement(target);

  if (!element) {
    return defaultRect;
  }

  const elementRect = getClientRect(element);
  const isFixed = hasPosition(element);
  const top = getElementPosition(element, spotlightPadding.top);

  return {
    height: Math.round((elementRect?.height ?? 0) + spotlightPadding.top + spotlightPadding.bottom),
    isFixed,
    left: Math.round((elementRect?.left ?? 0) - spotlightPadding.left),
    top,
    width: Math.round((elementRect?.width ?? 0) + spotlightPadding.left + spotlightPadding.right),
  };
}

export default function useTargetPosition(
  target: StepTarget,
  spotlightPadding: Required<SpotlightPadding>,
  force: boolean,
): TargetRect {
  const [rect, setRect] = useState<TargetRect>(() => computeRect(target, spotlightPadding));
  const timeoutRef = useRef<number>(undefined);
  const scrollParentRef = useRef<Element | Document | null>(null);
  const previousForceRef = useRef(force);
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
    let mutationObserver: MutationObserver | null = null;

    const setup = (element: HTMLElement) => {
      scrollParentRef.current = getScrollParent(element, true);

      if (scrollParentRef.current) {
        scrollParentRef.current.addEventListener('scroll', updateRect, { passive: true });
      }

      window.addEventListener('scroll', updateRect, { passive: true });
      window.addEventListener('resize', updateRect);

      if (typeof ResizeObserver !== 'undefined') {
        observerRef.current = new ResizeObserver(updateRect);
        observerRef.current.observe(element);
      }

      setRect(computeRect(target, spotlightPadding));
    };

    const element = getElement(target);

    if (element) {
      setup(element);
    } else {
      // Target not in DOM yet — watch for it
      mutationObserver = new MutationObserver(() => {
        const el = getElement(target);

        if (el) {
          mutationObserver?.disconnect();
          mutationObserver = null;
          setup(el);
        }
      });

      mutationObserver.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      mutationObserver?.disconnect();

      if (scrollParentRef.current) {
        scrollParentRef.current.removeEventListener('scroll', updateRect);
      }

      window.removeEventListener('scroll', updateRect);
      window.removeEventListener('resize', updateRect);

      observerRef.current?.disconnect();
      clearTimeout(timeoutRef.current);
    };
  }, [target, spotlightPadding, updateRect]);

  // Persist to state and track transitions after render
  useEffect(() => {
    if (previousForceRef.current && !force) {
      setRect(computeRect(target, spotlightPadding));
    }

    previousForceRef.current = force;
  }, [force, target, spotlightPadding]);

  // Synchronous override: when scrolling just ended, return fresh rect immediately
  let finalRect = rect;

  if (previousForceRef.current && !force) {
    finalRect = computeRect(target, spotlightPadding);
  }

  return finalRect;
}
