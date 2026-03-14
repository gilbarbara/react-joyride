import config from '@gilbarbara/eslint-config';
import testingLibrary from '@gilbarbara/eslint-config/testing-library';
import vitest from '@gilbarbara/eslint-config/vitest';

export default [
  ...config,
  ...vitest,
  ...testingLibrary,
  { ignores: ['node_modules', 'dist', '**/*.snap'] },
  {
    rules: {
      'react-hooks/exhaustive-deps': [
        'warn',
        {
          additionalHooks: '(use.*Effect.*)',
        },
      ],
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    files: ['e2e/*.spec.*'],
    rules: {
      'testing-library/prefer-screen-queries': 'off',
    },
  },
  {
    files: ['test/**/*.{ts,tsx}'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    files: ['test/**/*.spec.*', '**/*.test.*'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@testing-library/react',
              message: "Import from '~/test-utils' instead.",
            },
          ],
        },
      ],
    },
  },
];
