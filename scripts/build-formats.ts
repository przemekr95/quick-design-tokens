// scripts/build-formats.ts
import path from 'path';
import { fileURLToPath } from 'url';
import { tokens } from '../src/tokens/index.js';
import { generateOutputFormats } from '../src/generators/index.js';

// W ESM nie ma __dirname, więc tworzymy jego odpowiednik
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ścieżka do katalogu wyjściowego
const outputDir = path.resolve(__dirname, '../dist');

// Generuj wszystkie formaty
generateOutputFormats(outputDir, tokens.core, tokens.themes);

console.log('✓ Wygenerowano wszystkie formaty wyjściowe!');
