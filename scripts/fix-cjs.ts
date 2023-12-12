import { replaceContent, type ReplaceContentOptions } from '@gilbarbara/node-helpers';

export const fixCjsDts = async (options?: Partial<ReplaceContentOptions>) => {
  return replaceContent({
    pattern: '**/*.d.{ts,cts}',
    ...options,
    name: 'fix-cjs-dts',

    callback: content => {
      const result = /(?<toReplace>\n\}\n\n(?<code>export .+))/u.exec(content);
      const { code, toReplace } = result?.groups ?? {};

      const exportEqual = 'export = ReactJoyride;';

      if (code) {
        const statement = `}

declare namespace ReactJoyride {
  ${code}
}

${exportEqual}`;

        if (!content.endsWith(exportEqual)) {
          return content.replace(toReplace, '') + statement;
        }
      }

      return false;
    },
  });
};

export const fixCjsExports = async (options?: Partial<ReplaceContentOptions>) => {
  const statement = `
// fix-cjs-exports
if (module.exports.default) {
  Object.assign(module.exports.default, module.exports);
  module.exports = module.exports.default;
  delete module.exports.default;
}
`;

  return replaceContent({
    pattern: '**/*.js',
    ...options,
    name: 'fix-cjs-exports',

    callback: content => {
      if (content.includes('module.exports = __toCommonJS') && !content.endsWith(statement)) {
        return content + statement;
      }

      return false;
    },
  });
};

fixCjsDts();
fixCjsExports();
