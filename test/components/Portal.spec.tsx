import { cleanup, render, screen } from '~/test-utils';

import Portal from '~/components/Portal';

describe('Portal', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render nothing when element is null', () => {
    const { container } = render(
      <Portal element={null}>
        <div>content</div>
      </Portal>,
    );

    expect(container.innerHTML).toBe('');
  });

  it('should render children into the provided element', () => {
    const portalTarget = document.createElement('div');

    portalTarget.setAttribute('data-testid', 'portal-target');
    document.body.appendChild(portalTarget);

    render(
      <Portal element={portalTarget}>
        <div data-testid="portal-content">content</div>
      </Portal>,
    );

    expect(screen.getByTestId('portal-target')).toContainElement(
      screen.getByTestId('portal-content'),
    );

    portalTarget.remove();
  });
});
