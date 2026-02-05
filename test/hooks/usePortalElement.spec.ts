import { usePortalElement } from '~/hooks/usePortalElement';
import { PORTAL_ELEMENT_ID } from '~/literals';
import { renderHook } from '~/test-utils';

describe('usePortalElement', () => {
  beforeEach(() => {
    const portal = document.getElementById(PORTAL_ELEMENT_ID);

    if (portal) {
      portal.remove();
    }
  });

  describe('without portalElement argument', () => {
    it('should create portal element with correct ID', () => {
      const { result } = renderHook(() => usePortalElement());

      expect(result.current).toBeInstanceOf(HTMLDivElement);
      expect(result.current?.id).toBe(PORTAL_ELEMENT_ID);
    });

    it('should append portal to document.body', () => {
      renderHook(() => usePortalElement());

      const portal = document.getElementById(PORTAL_ELEMENT_ID);

      expect(portal).toBeInTheDocument();
      expect(portal?.parentNode).toBe(document.body);
    });

    it('should remove portal on unmount', () => {
      const { unmount } = renderHook(() => usePortalElement());

      expect(document.getElementById(PORTAL_ELEMENT_ID)).toBeInTheDocument();

      unmount();

      expect(document.getElementById(PORTAL_ELEMENT_ID)).not.toBeInTheDocument();
    });

    it('should not error if portal was already removed', () => {
      const { unmount } = renderHook(() => usePortalElement());
      const portal = document.getElementById(PORTAL_ELEMENT_ID);

      expect(portal).toBeInTheDocument();

      // Simulate external removal before unmount
      portal?.remove();

      expect(() => unmount()).not.toThrowError();
    });
  });

  describe('with DOM element', () => {
    it('should use provided DOM element', () => {
      const externalElement = document.createElement('div');

      externalElement.id = 'external-portal';
      document.body.appendChild(externalElement);

      const { result } = renderHook(() => usePortalElement(externalElement));

      expect(result.current).toBe(externalElement);

      externalElement.remove();
    });

    it('should NOT remove external DOM element on unmount', () => {
      const externalElement = document.createElement('div');

      externalElement.id = 'external-portal';
      document.body.appendChild(externalElement);

      const { unmount } = renderHook(() => usePortalElement(externalElement));

      unmount();

      expect(document.getElementById('external-portal')).toBeInTheDocument();

      externalElement.remove();
    });
  });

  describe('with selector string', () => {
    it('should find element by selector', () => {
      const existingElement = document.createElement('div');

      existingElement.id = 'custom-portal';
      document.body.appendChild(existingElement);

      const { result } = renderHook(() => usePortalElement('#custom-portal'));

      expect(result.current).toBe(existingElement);

      existingElement.remove();
    });

    it('should remove found element on unmount', () => {
      const existingElement = document.createElement('div');

      existingElement.id = 'custom-portal';
      document.body.appendChild(existingElement);

      const { unmount } = renderHook(() => usePortalElement('#custom-portal'));

      unmount();

      // Note: selector-found elements are removed, unlike directly-passed DOM elements
      expect(document.getElementById('custom-portal')).not.toBeInTheDocument();
    });

    it('should return null for non-matching selector', () => {
      const { result } = renderHook(() => usePortalElement('#non-existent'));

      expect(result.current).toBeNull();
    });
  });

  describe('re-renders', () => {
    it('should clean up old portal when switching from default to external', () => {
      const { rerender, result } = renderHook(
        ({ portalElement }) => usePortalElement(portalElement),
        { initialProps: { portalElement: undefined as HTMLElement | string | undefined } },
      );

      expect(result.current?.id).toBe(PORTAL_ELEMENT_ID);
      expect(document.getElementById(PORTAL_ELEMENT_ID)).toBeInTheDocument();

      const externalElement = document.createElement('div');

      externalElement.id = 'new-portal';
      document.body.appendChild(externalElement);

      rerender({ portalElement: externalElement });

      expect(result.current).toBe(externalElement);
      expect(document.getElementById(PORTAL_ELEMENT_ID)).not.toBeInTheDocument();

      externalElement.remove();
    });
  });
});
