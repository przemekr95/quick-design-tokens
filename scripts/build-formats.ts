// scripts/build-formats.ts
import path from 'path';
import { tokens } from '../src/tokens';
import { generateOutputFormats } from '../src/generators';

// Ścieżka do katalogu wyjściowego
const outputDir = path.resolve(__dirname, '../dist');

// Generuj wszystkie formaty
generateOutputFormats(outputDir, tokens.core, tokens.themes);

console.log('✓ Wygenerowano wszystkie formaty wyjściowe!');
