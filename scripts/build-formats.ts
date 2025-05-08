// scripts/build-formats.ts
import path from 'path';
import { tokens } from '../src/tokens';
import { generateOutputFormats } from '../src/generators';

// Ścieżka do katalogu wyjściowego
const outputDir = path.resolve(__dirname, '../dist');

// Generuj wszystkie formaty
generateOutputFormats(outputDir, tokens.core, tokens.themes);

console.log('✓ Wygenerowano wszystkie formaty wyjściowe!');

// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

export default [
  // ESM i CJS bundle
  {
    input: 'src/index.ts',
    output: [
      {
        dir: 'dist/js/esm',
        format: 'esm',
        sourcemap: true,
        preserveModules: true,
        preserveModulesRoot: 'src'
      },
      {
        dir: 'dist/js/cjs',
        format: 'cjs',
        sourcemap: true,
        preserveModules: true,
        preserveModulesRoot: 'src'
      }
    ],
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        outDir: null
      }),
    ],
    external: ['lodash.merge'],
  },
  
  // Bundle dla typów TypeScript
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist/types',
      format: 'esm',
      preserveModules: true,
      preserveModulesRoot: 'src'
    },
    plugins: [dts()],
  },
];
