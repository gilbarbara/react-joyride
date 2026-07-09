import type { Root } from 'hast';
import { visit } from 'unist-util-visit';

/**
 * Forwards the `raw` property from <figure data-rehype-pretty-code-figure> to its child <pre>.
 * Must run AFTER rehype-pretty-code (which wraps <pre> in a <figure>).
 *
 * Default export so it can be referenced by string path in next.config.ts (required by Turbopack).
 */
export default function rehypeForwardRaw() {
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
