import { CoreTokens, ThemeTokens } from '../types/tokens.js';

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

export const generateCoreCss = (coreTokens: CoreTokens): string => {
  return `:root {\n${transformToCssVars(coreTokens)}}\n`;
};

export const generateThemeCss = (
  themeKey: string, 
  themeTokens: ThemeTokens
): string => {
  return `.${themeKey} {\n${transformToCssVars(themeTokens)}}\n`;
};
