import { ThemeTokens } from '../../types/tokens.js';
import { coreTokens } from '../core/index.js';
import merge from 'lodash.merge';

export const prIskierka: ThemeTokens = merge({}, coreTokens, {
  colors: {
    primary: '#e83e8c',
    secondary: '#4a148c',
    accent: '#ff6d00',
  },
  lighting: {
    ambient: {
      soft: 'rgba(232, 62, 140, 0.1)',
      medium: 'rgba(232, 62, 140, 0.25)',
      strong: 'rgba(232, 62, 140, 0.4)'
    },
    glow: {
      subtle: '0 0 5px rgba(232, 62, 140, 0.3)',
      medium: '0 0 10px rgba(232, 62, 140, 0.5)',
      intense: '0 0 15px rgba(232, 62, 140, 0.7)'
    }
  }
});
