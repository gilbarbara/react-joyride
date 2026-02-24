import { type Page } from '@playwright/test';

export function waitForScrollEnd(page: Page) {
  return page.waitForFunction(() => {
    return new Promise(resolve => {
      const getPositions = () => [
        document.scrollingElement?.scrollTop ?? 0,
        document.querySelector('.scroll-content')?.scrollTop ?? 0,
      ];

      let stableCount = 0;
      let last = [-1, -1];

      const check = () => {
        const pos = getPositions();

        if (pos[0] === last[0] && pos[1] === last[1]) {
          stableCount++;

          if (stableCount >= 3) {
            resolve(true);

            return;
          }
        } else {
          stableCount = 0;
        }

        last = pos;
        setTimeout(check, 100);
      };

      setTimeout(check, 400);
    });
  });
}
