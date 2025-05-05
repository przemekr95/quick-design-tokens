import tokens from '../index';
import { DesignTokens, DesignTokensWithProjects } from '../types/tokens';

/**
 * Generuje zmienne SCSS na podstawie globalnych tokenów projektu
 * @returns string z definicjami zmiennych SCSS
 */
export const generateSCSSVariables = (): string => {
  const transformTokensToSCSSVars = (obj: any, prefix = ''): string => {
    let scssVars = '';
    
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object' && value !== null) {
        scssVars += transformTokensToSCSSVars(value, `${prefix}${key}-`);
      } else {
        scssVars += `$${prefix}${key}: ${value};\n`;
      }
    }
    
    return scssVars;
  };
  
  // Generuje zmienne tylko dla globalnych tokenów
  return transformTokensToSCSSVars(tokens.globalTokens);
};

/**
 * Generuje zmienne SCSS dla wybranego projektu, łącząc je z globalnymi
 * @param projectKey - klucz projektu (np. 'prPhoto', 'prDev')
 * @returns string z definicjami zmiennych SCSS
 */
export const generateProjectSCSSVariables = (projectKey: string): string => {
  const tokensWithProjects = tokens as DesignTokensWithProjects;
  
  if (!tokensWithProjects.projects || !tokensWithProjects.projects[projectKey]) {
    throw new Error(`Projekt "${projectKey}" nie istnieje w tokenach`);
  }
  
  const projectTokens = tokensWithProjects.projects[projectKey];
  return transformTokensToSCSSVars(projectTokens);
  
  function transformTokensToSCSSVars(obj: any, prefix = ''): string {
    let scssVars = '';
    
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object' && value !== null) {
        scssVars += transformTokensToSCSSVars(value, `${prefix}${key}-`);
      } else {
        scssVars += `$${prefix}${key}: ${value};\n`;
      }
    }
    
    return scssVars;
  }
};

/**
 * Generuje mapy SCSS dla łatwiejszego dostępu do tokenów w SCSS
 * @returns string z definicjami map SCSS
 */
export const generateSCSSMaps = (): string => {
  const transformTokensToSCSSMaps = (obj: any, mapName: string, depth = 0): string => {
    if (depth > 0 && (typeof obj !== 'object' || obj === null)) {
      return `${obj}`;
    }
    
    let entries: string[] = [];
    
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object' && value !== null) {
        entries.push(`  "${key}": ${transformTokensToSCSSMaps(value, `${mapName}-${key}`, depth + 1)}`);
      } else {
        entries.push(`  "${key}": ${value}`);
      }
    }
    
    // Jeśli jesteśmy na najwyższym poziomie, zwróć pełną definicję mapy
    if (depth === 0) {
      return `$${mapName}: (\n${entries.join(',\n')}\n);\n`;
    }
    
    // W przypadku zagnieżdżonych map
    return `(\n${entries.join(',\n')}\n)`;
  };
  
  let result = '';
  
  // Generowanie map dla globalnych tokenów
  const globalTokens = tokens.globalTokens as DesignTokens;
  
  // Tworzymy osobne mapy dla każdej kategorii tokenów
  result += transformTokensToSCSSMaps(globalTokens.colors, 'colors');
  result += transformTokensToSCSSMaps(globalTokens.typography, 'typography');
  result += transformTokensToSCSSMaps(globalTokens.spacing, 'spacing');
  result += transformTokensToSCSSMaps(globalTokens.borderRadius, 'radius');
  result += transformTokensToSCSSMaps(globalTokens.boxShadow, 'shadow');
  
  return result;
};

/**
 * Generuje funkcje dostępu do tokenów
 * @returns string z definicjami funkcji SCSS
 */
export const generateSCSSFunctions = (): string => {
  return `
// Funkcja dostępu do kolorów
@function color($key) {
  @return map-get($colors, $key);
}

// Funkcja dostępu do typografii
@function typography($category, $key) {
  $category-map: map-get($typography, $category);
  @return map-get($category-map, $key);
}

// Funkcja dostępu do odstępów
@function spacing($key) {
  @return map-get($spacing, $key);
}

// Funkcja dostępu do zaokrągleń
@function radius($key) {
  @return map-get($radius, $key);
}

// Funkcja dostępu do cieni
@function shadow($key) {
  @return map-get($shadow, $key);
}
`;
};

/**
 * Generuje pełny plik SCSS z wszystkimi tokenami
 * @returns string z kompletnym plikiem SCSS
 */
export const generateFullSCSSFile = (): string => {
  return `// Design Tokens wygenerowane automatycznie
// Nie edytuj tego pliku ręcznie

// Zmienne SCSS
${generateSCSSVariables()}

// Mapy SCSS
${generateSCSSMaps()}

// Funkcje pomocnicze
${generateSCSSFunctions()}
`;
};

/**
 * Generuje plik SCSS dla określonego projektu
 * @param projectKey - klucz projektu (np. 'prPhoto', 'prDev')
 * @returns string z kompletnym plikiem SCSS dla projektu
 */
export const generateProjectSCSSFile = (projectKey: string): string => {
  return `// Design Tokens dla projektu ${projectKey}
// Wygenerowane automatycznie, nie edytuj tego pliku ręcznie

// Zmienne SCSS
${generateProjectSCSSVariables(projectKey)}

// Mapy SCSS
${generateSCSSMaps()}

// Funkcje pomocnicze
${generateSCSSFunctions()}
`;
};