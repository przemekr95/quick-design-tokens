import { ThemeTokens } from '../../types/tokens.js';
import { coreTokens } from '../core/index.js';
import merge from 'lodash.merge';

export const prDev: ThemeTokens = merge({}, coreTokens, {
  colors: {
    primary: '#ff9900',
    secondary: '#0066cc',
    accent: '#ff5500',
  }
});
