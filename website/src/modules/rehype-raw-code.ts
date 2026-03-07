import type { Root } from 'hast';
import { visit } from 'unist-util-visit';

/**
 * Captures raw code text from <pre><code> and stores it as a `raw` property on <pre>.
 * Must run BEFORE rehype-pretty-code.
 */
export function rehypeCaptureRaw() {
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

/**
 * Forwards the `raw` property from <figure data-rehype-pretty-code-figure> to its child <pre>.
 * Must run AFTER rehype-pretty-code (which wraps <pre> in a <figure>).
 */
export function rehypeForwardRaw() {
  return (tree: Root) => {
    visit(tree, 'element', node => {
      if (node.tagName !== 'figure') return;
      if (!('data-rehype-pretty-code-figure' in (node.properties ?? {}))) return;

      for (const child of node.children) {
        if ('tagName' in child && child.tagName === 'pre' && node.properties.raw) {
          child.properties.raw = node.properties.raw;
        }
      }
    });
  };
}
