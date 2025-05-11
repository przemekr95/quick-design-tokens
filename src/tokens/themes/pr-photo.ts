import { ThemeTokens } from '../../types/tokens.js';
import { coreTokens } from '../core/index.js';
import merge from 'lodash.merge';

export const prPhoto: ThemeTokens = merge({}, coreTokens, {
  colors: {
    primary: '#0066cc',
    secondary: '#ff9900',
    accent: '#ff5500',
  },
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
