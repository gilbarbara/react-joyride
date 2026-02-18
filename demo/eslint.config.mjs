import config from '@gilbarbara/eslint-config';

export default [
  ...config,
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
];
