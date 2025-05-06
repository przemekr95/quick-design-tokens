import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

export default [
  // ESM i CJS bundle dla głównego pliku
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/esm/index.js',
        format: 'esm',
        sourcemap: true,
        exports: 'named'
      },
      {
        file: 'dist/cjs/index.js',
        format: 'cjs',
        sourcemap: true,
        exports: 'named'
      },
    ],
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        outDir: null, // Wyłącz outDir w typescript plugin, pozwól Rollup kontrolować wyjście
      }),
    ],
    external: ['lodash.merge'],
  },
  
  // ESM bundle dla plików tokenów (aby były dostępne dla skryptu generującego SCSS)
  {
    input: 'src/tokens/index.ts',
    output: {
      dir: 'dist/esm/tokens',
      format: 'esm',
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: 'src/tokens'
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        outDir: null, // Wyłącz outDir w typescript plugin
      }),
    ],
    external: ['lodash.merge'],
  },
  
  // Bundle dla typów TypeScript
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/types/index.d.ts',
      format: 'esm',
    },
    plugins: [dts()],
  },
];
