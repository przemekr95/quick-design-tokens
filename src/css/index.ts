import tokens from '../index';

export const generateCSSVariables = () => {
  const transformTokensToCSSVars = (obj: any, prefix = '') => {
    let cssVars = '';
    
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object' && value !== null) {
        cssVars += transformTokensToCSSVars(value, `${prefix}${key}-`);
      } else {
        cssVars += `  --${prefix}${key}: ${value};\n`;
      }
    }
    
    return cssVars;
  };
  
  return `:root {\n${transformTokensToCSSVars(tokens.globalTokens)}}\n`;
};