import { useMount, useSetState, useUnmount } from '@gilbarbara/hooks';
import is from 'is-lite';

import { canUseDOM } from '~/modules/dom';

import { PORTAL_ELEMENT_ID } from '~/literals';

import { SelectorOrElement } from '~/types';

interface State {
  element: HTMLElement | null;
  useExternalPortal: boolean;
}

export function usePortalElement(portalElement?: SelectorOrElement) {
  const [{ element, useExternalPortal }, setState] = useSetState<State>({
    useExternalPortal: false,
    element: null,
  });

  useMount(() => {
    if (!canUseDOM()) {
      return;
    }

    if (portalElement) {
      if (is.domElement(portalElement)) {
        setState({ element: portalElement, useExternalPortal: true });
      } else {
        const portal = document.querySelector(portalElement);

        if (portal) {
          setState({ element: portal as HTMLElement });
        }
      }
    }

    if (!portalElement) {
      const portal = document.createElement('div');

      portal.id = PORTAL_ELEMENT_ID;

      document.body.appendChild(portal);
      setState({ element: portal });
    }
  });

  useUnmount(() => {
    if (!canUseDOM() || !element || useExternalPortal) {
      return;
    }

    if (element.parentNode === document.body) {
      document.body.removeChild(element);
    }
  });

  return element as HTMLElement;
}
