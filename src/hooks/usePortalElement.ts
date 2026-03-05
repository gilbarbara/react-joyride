import { useEffect, useState } from 'react';
import is from 'is-lite';

import { PORTAL_ELEMENT_ID } from '~/literals';

import type { SelectorOrElement } from '~/types';

export function usePortalElement(portalElement?: SelectorOrElement) {
  const [element, setElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let createdElement: HTMLElement | null = null;
    let isExternal = false;

    if (portalElement) {
      if (is.domElement(portalElement)) {
        createdElement = portalElement;
        isExternal = true;
      } else {
        const portal = document.querySelector(portalElement);

        if (portal) {
          createdElement = portal as HTMLElement;
        }
      }
    } else {
      const portal = document.createElement('div');

      portal.id = PORTAL_ELEMENT_ID;

      document.body.appendChild(portal);
      createdElement = portal;
    }

    setElement(createdElement);

    return () => {
      if (!createdElement || isExternal) {
        return;
      }

      if (createdElement.parentNode === document.body) {
        document.body.removeChild(createdElement);
      }
    };
  }, [portalElement]);

  return element;
}
