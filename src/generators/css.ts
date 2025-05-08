// src/generators/css.ts
import { CoreTokens, ThemeTokens } from '../types/tokens';

/**
 * Transformuje tokeny do zmiennych CSS
 */
export const transformToCssVars = (
  obj: Record<string, any>, 
  prefix = ''
): string => {
  let cssVars = '';
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null) {
      cssVars += transformToCssVars(value, `${prefix}${key}-`);
    } else {
      cssVars += `  --${prefix}${key}: ${value};\n`;
    }
  }
  
  return cssVars;
};

/**
 * Generuje zmienne CSS dla tokenów rdzenia
 */
export const generateCoreCss = (coreTokens: CoreTokens): string => {
  return `:root {\n${transformToCssVars(coreTokens)}}\n`;
};

/**
 * Generuje zmienne CSS dla motywu
 */
export const generateThemeCss = (
  themeKey: string, 
  themeTokens: ThemeTokens
): string => {
  return `.${themeKey} {\n${transformToCssVars(themeTokens)}}\n`;
};
