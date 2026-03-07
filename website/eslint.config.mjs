import config from '@gilbarbara/eslint-config';
import nextPlugin from '@next/eslint-plugin-next';

export default [
  ...config,
  {
    ignores: ['dist/**', 'node_modules/**', 'next-env.d.ts'],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      'react-refresh/only-export-components': 'off',
    },
  },
];
