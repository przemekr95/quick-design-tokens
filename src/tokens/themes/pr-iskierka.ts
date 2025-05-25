import { ThemeTokens } from '../../types/tokens.js';
import { coreTokens } from '../core/index.js';
import merge from 'lodash.merge';

export const prIskierka: ThemeTokens = merge({}, coreTokens, {
  colors: {
    primary: '#e83e8c',
    secondary: '#4a148c',
    accent: '#ff6d00',
  }
});
