import path from 'node:path';

import createMDX from '@next/mdx';
import type { NextConfig } from 'next';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkGfm from 'remark-gfm';

import { rehypeCaptureRaw, rehypeForwardRaw } from './src/modules/rehype-raw-code';

// @next/mdx bypasses Next.js's vendored React aliases in the RSC bundle,
// causing MDX files to load the user-installed React instead of the vendored
// RSC copy. This leads to a missing __SERVER_INTERNALS crash in dev mode.
const vendoredRsc = path.resolve(
  import.meta.dirname,
  'node_modules/next/dist/server/route-modules/app-page/vendored/rsc',
);

const nextConfig: NextConfig = {
  output: 'standalone',
  pageExtensions: ['ts', 'tsx'],
  reactStrictMode: true,
  outputFileTracingRoot: path.resolve(import.meta.dirname, '..'),
  webpack: (config, { isServer }) => {
    if (isServer) {
      // eslint-disable-next-line no-param-reassign
      config.resolve.alias = {
        ...config.resolve.alias,
        react$: path.join(vendoredRsc, 'react.js'),
        'react/jsx-runtime$': path.join(vendoredRsc, 'react-jsx-runtime.js'),
        'react/jsx-dev-runtime$': path.join(vendoredRsc, 'react-jsx-dev-runtime.js'),
        'react/compiler-runtime$': path.join(vendoredRsc, 'react-compiler-runtime.js'),
      };
    }

    return config;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        ],
      },
    ];
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeCaptureRaw,
      [
        rehypePrettyCode,
        {
          theme: { dark: 'one-dark-pro', light: 'github-light' },
          defaultLang: 'tsx',
          bypassInlineCode: true,
        },
      ],
      rehypeForwardRaw,
    ],
  },
});

export default withMDX(nextConfig);
