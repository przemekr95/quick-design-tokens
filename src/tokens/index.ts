import { coreTokens } from './core';
import { themes } from './themes';
import { Tokens } from '../types/tokens';

// Główny obiekt tokenów
export const tokens: Tokens = {
  core: coreTokens,
  themes,
};

// Eksport wszystkich potrzebnych elementów
export { coreTokens, themes };
export * from './core';
export * from './themes';
