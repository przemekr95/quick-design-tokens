import { ThemeTokens } from '../../types/tokens.js';
import { coreTokens } from '../core/index.js';
import merge from 'lodash.merge';

// Definicja tokenów dla jednego motywu w pojedynczym pliku
export const prDev: ThemeTokens = merge({}, coreTokens, {
  colors: {
    primary: '#ff9900',
    secondary: '#0066cc',
    accent: '#ff5500',
  },
  // Dodatkowe tokeny specyficzne dla motywu, których nie ma w core
  customFeatures: {
    devMode: true,
    codeHighlighting: {
      background: '#f5f5f5',
      text: '#333333',
      keyword: '#0000ff',
      comment: '#008000'
    }
  }
});
