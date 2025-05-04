import * as prPhotoTokensImport from './dist/build/pr-photo/js/tokens.js';
import * as prDevTokensImport from './dist/build/pr-dev/js/tokens.js';

export const prPhotoTokens = prPhotoTokensImport;
export const prDevTokens = prDevTokensImport;

export const cssPaths = {
  prPhoto: './build/pr-photo/css/variables.css',
  prDev: './build/pr-dev/css/variables.css',
};

export const scssPaths = {
  prPhoto: './build/pr-photo/scss/_variables.scss',
  prDev: './build/pr-dev/scss/_variables.scss',
};
