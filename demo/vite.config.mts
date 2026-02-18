import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite'

import tsconfigPaths from 'vite-tsconfig-paths';

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

export default defineConfig({
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
  plugins: [tsconfigPaths(), react(), tailwindcss()],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  server: {
    port,
    host: true,
  },
});
