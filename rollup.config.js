import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import packageJSON from './package.json';

export default {
  input: 'src/index.js',
  output: {
    file: 'es/index.js',
    format: 'es',
    exports: 'named',
  },
  sourcemap: false,
  external: [
    ...Object.keys(packageJSON.peerDependencies),
    ...Object.keys(packageJSON.dependencies),
  ],
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    commonjs(),
  ],
};
