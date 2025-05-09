import { coreTokens, globalTokens } from './core/index.js';
import { themes, prPhoto, prDev } from './themes/index.js';
import { Tokens } from '../types/tokens.js';

// Główny obiekt tokenów
export const tokens: Tokens = {
  core: coreTokens,
  themes,
};

// Eksport wszystkich potrzebnych elementów
export { coreTokens, themes, globalTokens };
export * from './core/index.js';
export * from './themes/index.js';

// Eksport projektowych tokenów (jako zbiorcze obiekty)
export const projectTokens = {
  'pr-photo': prPhoto,
  'pr-dev': prDev
};
