import { ThemeTokens } from '../../types/tokens';
import { coreTokens } from '../core';
import merge from 'lodash.merge';

// Definicja tokenów dla jednego motywu w pojedynczym pliku
export const prDev: ThemeTokens = merge({}, coreTokens, {
  colors: {
    primary: '#ff9900',
    secondary: '#0066cc',
    accent: '#ff5500',
  },
  // Można dodać inne nadpisane tokeny
});
