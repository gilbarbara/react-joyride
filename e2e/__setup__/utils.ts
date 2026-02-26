import { type Page } from '@playwright/test';

export function getScrollTop(page: Page, selector?: string): Promise<number> {
  if (selector) {
    return page.locator(selector).evaluate(el => Math.round(el.scrollTop));
  }

  return page.evaluate(() => Math.round(document.scrollingElement?.scrollTop ?? 0));
}

export function waitForScrollEnd(page: Page, containerSelector?: string) {
  return page.waitForFunction((selector: string | undefined) => {
    return new Promise(resolve => {
      const getPositions = () => [
        document.scrollingElement?.scrollTop ?? 0,
        selector ? (document.querySelector(selector)?.scrollTop ?? 0) : 0,
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
  }, containerSelector);
}
