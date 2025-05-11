import path from 'path';
import { fileURLToPath } from 'url';
import { tokens } from '../src/tokens/index.js';
import { generateOutputFormats } from '../src/generators/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.resolve(__dirname, '../dist');

generateOutputFormats(outputDir, tokens.core, tokens.themes);

console.log('✓ All output formats have been generated!');
