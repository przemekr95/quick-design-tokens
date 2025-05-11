import { coreTokens, globalTokens } from './core/index.js';
import { themes, prPhoto, prDev } from './themes/index.js';
import { Tokens } from '../types/tokens.js';

export const tokens: Tokens = {
  core: coreTokens,
  themes,
};

export { coreTokens, themes, globalTokens };
export * from './core/index.js';
export * from './themes/index.js';

export const projectTokens = {
  'pr-photo': prPhoto,
  'pr-dev': prDev
};
