import { projectTokens } from '../tokens';
import { ProjectKey } from '../types/tokens';

/**
 * Generuje zmienne CSS dla konkretnego projektu
 * @param {string} projectKey - Klucz projektu
 * @returns {string} Ciąg znaków zawierający zmienne CSS dla projektu
 */
export const generateProjectCSSVariables = (projectKey: string) => {
  // Sprawdzamy, czy klucz projektu jest prawidłowy
  if (!isValidProjectKey(projectKey)) {
    throw new Error(`Nieprawidłowy klucz projektu: ${projectKey}`);
  }
  
  // Teraz TypeScript wie, że projectKey jest typu ProjectKey
  const projectSpecificTokens = projectTokens[projectKey];
  
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
  
  return `:root {\n${transformTokensToCSSVars(projectSpecificTokens)}}\n`;
};

/**
 * Sprawdza, czy podany klucz jest prawidłowym kluczem projektu
 * @param {string} key - Klucz do sprawdzenia
 * @returns {boolean} Czy jest prawidłowym kluczem projektu
 */
function isValidProjectKey(key: string): key is ProjectKey {
  return key === 'prPhoto' || key === 'prDev';
}
