import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs', 'iife'],
  globalName: 'taivuta',
  dts: true,
  clean: true,
  sourcemap: true,
  treeshake: true,
  minify: false,
  splitting: false,
  outExtension({ format }) {
    if (format === 'iife') {
      return { js: '.global.js' };
    }
    return {
      js: format === 'esm' ? '.mjs' : '.cjs'
    };
  }
});
