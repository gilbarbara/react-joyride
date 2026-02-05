import config from '@gilbarbara/eslint-config';
import testingLibrary from '@gilbarbara/eslint-config/testing-library';
import vitest from '@gilbarbara/eslint-config/vitest';

export default [
  ...config,
  ...vitest,
  ...testingLibrary,
  {
    rules: {
      'react-hooks/exhaustive-deps': [
        'warn',
        {
          additionalHooks: '(use.*Effect.*)',
        },
      ],
      'no-restricted-syntax': [
        'warn',
        {
          message: "Don't forget to remove calls to  logger before committing.",
          selector: "CallExpression[callee.name='logger']",
        },
      ],
    },
  },
  {
    files: ['test/**'],
    rules: {
      'no-console': 'off',
    },
  },
];
