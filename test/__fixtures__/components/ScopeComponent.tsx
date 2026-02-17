import { useEffect, useRef } from 'react';

import ScopeClass from '~/modules/scope';

interface Props {
  Scope: typeof ScopeClass;
  setScope: (scope: ScopeClass) => void;
  tabbable?: boolean;
  useSelector?: boolean;
}

export default function ScopeComponent(props: Props) {
  const { Scope, setScope, tabbable = true, useSelector = false } = props;
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scope = new Scope(componentRef.current as HTMLElement, {
      selector: useSelector ? '[data-test-id=primary]' : null,
    });

    setScope(scope);

    return () => {
      scope.removeScope();
    };
  }, [Scope, setScope, useSelector]);

  return (
    <div ref={componentRef} className="component">
      <h2>Title</h2>
      <p>My awesome content</p>
      {tabbable && (
        <>
          <footer>
            <button data-test-id="skip" type="button">
              SKIP
            </button>
            <button data-test-id="back" type="button">
              BACK
            </button>
            <button data-test-id="primary" type="button">
              GO
            </button>
          </footer>
          <a data-test-id="close" href="#close">
            X
          </a>
        </>
      )}
    </div>
  );
}
