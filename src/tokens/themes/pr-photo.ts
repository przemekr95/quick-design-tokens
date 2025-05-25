import { ThemeTokens } from '../../types/tokens.js';
import { coreTokens } from '../core/index.js';
import merge from 'lodash.merge';

export const prPhoto: ThemeTokens = merge({}, coreTokens, {
  colors: {
    primary: '#0066cc',
    secondary: '#ff9900',
    accent: '#ff5500',
  }
});
