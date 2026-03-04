/* eslint-disable testing-library/no-render-in-lifecycle */
import { useState } from 'react';

import useFocusTrap from '~/hooks/useFocusTrap';
import { render, screen } from '~/test-utils';

interface Props {
  selector?: string | null;
  tabbable?: boolean;
}

function dispatch(container: HTMLElement, options: KeyboardEventInit = {}) {
  container.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, ...options }));
}

function FocusTrapComponent({ selector = null, tabbable = true }: Props) {
  const [element, setElement] = useState<HTMLElement | null>(null);

  useFocusTrap(element, selector);

  return (
    <div ref={setElement} data-testid="container">
      <h2>Title</h2>
      <p>My awesome content</p>
      {tabbable && (
        <>
          <footer>
            <button data-testid="skip" type="button">
              SKIP
            </button>
            <button data-testid="back" type="button">
              BACK
            </button>
            <button data-testid="primary" type="button">
              GO
            </button>
          </footer>
          <a data-testid="close" href="#close">
            X
          </a>
        </>
      )}
    </div>
  );
}

describe('hooks/useFocusTrap', () => {
  describe('with tabbable children', () => {
    let container: HTMLElement;
    let unmount: () => void;

    beforeEach(() => {
      ({ unmount } = render(<FocusTrapComponent />));
      container = screen.getByTestId('container');
    });

    afterEach(() => {
      unmount();
    });

    it('should focus the first button on Tab', () => {
      dispatch(container);

      expect(screen.getByTestId('skip') === document.activeElement).toBeTrue();
    });

    it('should cycle through buttons with Tab', () => {
      dispatch(container);
      expect(screen.getByTestId('skip') === document.activeElement).toBeTrue();

      dispatch(container);
      expect(screen.getByTestId('back') === document.activeElement).toBeTrue();

      dispatch(container);
      expect(screen.getByTestId('primary') === document.activeElement).toBeTrue();

      dispatch(container);
      expect(screen.getByTestId('close') === document.activeElement).toBeTrue();
    });

    it('should wrap from last to first', () => {
      dispatch(container);
      dispatch(container);
      dispatch(container);
      dispatch(container);
      expect(screen.getByTestId('close') === document.activeElement).toBeTrue();

      dispatch(container);
      expect(screen.getByTestId('skip') === document.activeElement).toBeTrue();
    });

    it('should cycle backward with Shift+Tab', () => {
      dispatch(container);
      expect(screen.getByTestId('skip') === document.activeElement).toBeTrue();

      dispatch(container, { shiftKey: true });
      expect(screen.getByTestId('close') === document.activeElement).toBeTrue();
    });

    it('should ignore non-Tab keys', () => {
      container.dispatchEvent(new KeyboardEvent('keydown', { key: 'Space', bubbles: true }));

      expect(screen.getByTestId('skip') === document.activeElement).toBeFalse();
      expect(screen.getByTestId('close') === document.activeElement).toBeFalse();
    });
  });

  describe('with selector', () => {
    it('should focus the matching element', async () => {
      const { unmount } = render(<FocusTrapComponent selector="[data-testid=primary]" />);

      await vi.waitFor(() => {
        expect(screen.getByTestId('primary') === document.activeElement).toBeTrue();
      });

      unmount();
    });
  });

  describe('with restore focus', () => {
    it('should restore focus to the previously focused element on unmount', () => {
      const button = document.createElement('button');

      document.body.appendChild(button);
      button.focus();

      expect(document.activeElement).toBe(button);

      const { unmount } = render(<FocusTrapComponent />);

      unmount();

      expect(document.activeElement).toBe(button);
      document.body.removeChild(button);
    });
  });

  describe('without tabbable children', () => {
    it('should not focus anything on Tab', () => {
      render(<FocusTrapComponent tabbable={false} />);

      const container = screen.getByTestId('container');
      const activeElementBefore = document.activeElement;

      dispatch(container);

      expect(document.activeElement).toBe(activeElementBefore);
    });
  });

  describe('with null element', () => {
    function NullComponent() {
      useFocusTrap(null);

      return <div>empty</div>;
    }

    it('should not focus anything on Tab', () => {
      render(<NullComponent />);

      const activeElementBefore = document.activeElement;

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));

      expect(document.activeElement).toBe(activeElementBefore);
    });
  });
});
