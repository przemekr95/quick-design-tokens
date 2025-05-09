import { CoreTokens, ThemeTokens } from '../types/tokens.js';

/**
 * Transformuje obiekt tokenów do formatu map SCSS
 */
export const transformToScssMaps = (
  obj: Record<string, any>,
  mapName: string,
  depth: number = 0
): string => {
  if (!obj || typeof obj !== 'object') {
    return '()';
  }

  const indent = '  '.repeat(depth);
  const entries: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null) {
      entries.push(`  "${key}": ${transformToScssMaps(value, `${mapName}-${key}`, depth + 1)}`);
    } else {
      entries.push(`  "${key}": ${JSON.stringify(value)}`);
    }
  }

  return `(\n${indent}${entries.join(',\n' + indent)}\n${indent})`;
};

/**
 * Generuje zmienne SCSS dla tokenów rdzenia
 */
export const generateCoreScss = (coreTokens: CoreTokens): string => {
  let scss = '// Auto-generowane zmienne SCSS z tokenów rdzeniowych\n\n';
  
  for (const [key, value] of Object.entries(coreTokens)) {
    if (typeof value === 'object' && value !== null) {
      scss += `$${key}: ${transformToScssMaps(value, key)};\n\n`;
    }
  }
  
  return scss;
};

/**
 * Generuje zmienne SCSS dla motywu
 */
export const generateThemeScss = (
  themeKey: string, 
  themeTokens: ThemeTokens
): string => {
  let scss = `// Auto-generowane zmienne SCSS dla motywu ${themeKey}\n\n`;
  scss += '// Importuj rdzeniowe tokeny\n';
  scss += '@import "./core";\n\n';
  
  for (const [key, value] of Object.entries(themeTokens)) {
    if (typeof value === 'object' && value !== null) {
      scss += `$${themeKey}-${key}: ${transformToScssMaps(value, `${themeKey}-${key}`)};\n\n`;
    }
  }
  
  return scss;
};
