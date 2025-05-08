
import { coreTokens, globalTokens } from './core';
import { themes, prPhoto, prDev } from './themes';
import { Tokens } from '../types/tokens';

// Główny obiekt tokenów
export const tokens: Tokens = {
  core: coreTokens,
  themes,
};

// Eksport wszystkich potrzebnych elementów
export { coreTokens, themes, globalTokens };
export * from './core';
export * from './themes';

// Eksport projektowych tokenów (jako zbiorcze obiekty)
export const projectTokens = {
  'pr-photo': prPhoto,
  'pr-dev': prDev
};
