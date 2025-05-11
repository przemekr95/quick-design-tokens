import { CoreTokens, ThemeTokens } from '../types/tokens.js';

const isColorValue = (value: string): boolean => {
  return typeof value === 'string' && (
    /^#([0-9A-F]{3}){1,2}$/i.test(value) ||
    /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/i.test(value) ||
    /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/i.test(value) ||
    /^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/i.test(value) ||
    /^hsla\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*,\s*[\d.]+\s*\)$/i.test(value)
  );
};

export const transformToScssMaps = (
  obj: Record<string, any>,
  mapName: string,
  depth = 0
): string => {
  if (!obj || typeof obj !== 'object') {
    return '()';
  }

  const indent = '  '.repeat(depth);
  const entries: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null) {
      entries.push(`  "${key}": ${transformToScssMaps(value, `${mapName}-${key}`, depth + 1)}`);
    } else if (typeof value === 'string' && isColorValue(value)) {
      entries.push(`  "${key}": ${value}`);
    } else {
      entries.push(`  "${key}": ${JSON.stringify(value)}`);
    }
  }

  return `(\n${indent}${entries.join(',\n' + indent)}\n${indent})`;
};

export const generateCoreScss = (coreTokens: CoreTokens): string => {
  let scss = '// Auto-generated index of SCSS files\n\n';
  
  for (const [key, value] of Object.entries(coreTokens)) {
    if (typeof value === 'object' && value !== null) {
      scss += `$${key}: ${transformToScssMaps(value, key)};\n\n`;
    }
  }
  
  return scss;
};

export const generateThemeScss = (
  themeKey: string, 
  themeTokens: ThemeTokens
): string => {
  let scss = `// Auto-generated index of SCSS files ${themeKey}\n\n`;
  scss += '// Import core tokens\n';
  scss += '@import "./core";\n\n';
  
  for (const [key, value] of Object.entries(themeTokens)) {
    if (typeof value === 'object' && value !== null) {
      scss += `$${themeKey}-${key}: ${transformToScssMaps(value, `${themeKey}-${key}`)};\n\n`;
    }
  }
  
  return scss;
};
