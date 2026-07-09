import type { Root } from 'hast';
import { visit } from 'unist-util-visit';

/**
 * Captures raw code text from <pre><code> and stores it as a `raw` property on <pre>.
 * Must run BEFORE rehype-pretty-code.
 *
 * Default export so it can be referenced by string path in next.config.ts (required by Turbopack).
 */
export default function rehypeCaptureRaw() {
  return (tree: Root) => {
    visit(tree, 'element', node => {
      if (node.tagName !== 'pre') return;

      const code = node.children?.[0];

      if (
        code &&
        'tagName' in code &&
        code.tagName === 'code' &&
        code.children?.[0]?.type === 'text'
      ) {
        // eslint-disable-next-line no-param-reassign
        node.properties.raw = code.children[0].value;
      }
    });
  };
}
