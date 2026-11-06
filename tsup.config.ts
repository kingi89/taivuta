import { defineConfig } from 'tsup';

export default defineConfig([
  {
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
  },
  {
    entry: {
      'person/index': 'src/person/index.ts',
      'place/index': 'src/place/index.ts',
      'morphology/index': 'src/morphology/index.ts',
      'template/index': 'src/template/index.ts',
      'preferences/index': 'src/preferences/index.ts'
    },
    format: ['esm', 'cjs'],
    dts: true,
    clean: false,
    sourcemap: true,
    treeshake: true,
    minify: false,
    splitting: false,
    outExtension({ format }) {
      return {
        js: format === 'esm' ? '.mjs' : '.cjs'
      };
    }
  }
]);
