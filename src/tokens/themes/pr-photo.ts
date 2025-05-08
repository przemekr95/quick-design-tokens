import { ThemeTokens } from '../../types/tokens';
import { coreTokens } from '../core';
import merge from 'lodash.merge';

// Definicja tokenów dla jednego motywu w pojedynczym pliku
export const prPhoto: ThemeTokens = merge({}, coreTokens, {
  colors: {
    primary: '#0066cc',
    secondary: '#ff9900',
    accent: '#ff5500',
  },
  // Dodatkowe tokeny specyficzne dla motywu, których nie ma w core
  photoFilters: {
    sepia: 'sepia(0.4)',
    grayscale: 'grayscale(0.5)',
    vibrance: {
      low: 'saturate(1.2)',
      medium: 'saturate(1.5)',
      high: 'saturate(1.8)'
    }
  }
});