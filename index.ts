// Rozwiązanie 1: Użyj importu nazwanego zamiast domyślnego
// TypeScript entry point for design tokens

// Tokeny JS z dwóch tematów (pr-photo i pr-dev)
import * as prPhotoTokensImport from './build/pr-photo/js/tokens.js';
import * as prDevTokensImport from './build/pr-dev/js/tokens.js';

export const prPhotoTokens = prPhotoTokensImport;
export const prDevTokens = prDevTokensImport;

// Ścieżki do plików CSS/SCSS — przydatne przy integracji z bundlerami lub frameworkami
export const cssPaths = {
  prPhoto: './build/pr-photo/css/variables.css',
  prDev: './build/pr-dev/css/variables.css',
};

export const scssPaths = {
  prPhoto: './build/pr-photo/scss/_variables.scss',
  prDev: './build/pr-dev/scss/_variables.scss',
};
