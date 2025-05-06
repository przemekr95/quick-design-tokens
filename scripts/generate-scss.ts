import fs from 'fs';
import path from 'path';
import tokens from '../src/index';
import { ProjectKey } from '../src/types/tokens';

/**
 * Transformuje obiekt tokenów do formatu map SCSS
 * @param obj - Obiekt tokenów do transformacji
 * @param mapName - Nazwa mapy SCSS
 * @param depth - Aktualna głębokość zagnieżdżenia (do formatowania)
 * @returns Ciąg znaków reprezentujący mapę SCSS
 */
export const transformTokensToSCSSMaps = (
  obj: Record<string, any> | null | undefined, 
  mapName: string, 
  depth: number = 0
): string => {
  // Handle null or undefined objects
  if (!obj || typeof obj !== 'object') {
    return '()';
  }

  const indent = '  '.repeat(depth);
  const entries: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null) {
      // Rekurencyjne przetwarzanie zagnieżdżonych obiektów
      entries.push(`  "${key}": ${transformTokensToSCSSMaps(value, `${mapName}-${key}`, depth + 1)}`);
    } else {
      // Dla wartości końcowych
      entries.push(`  "${key}": ${JSON.stringify(value)}`);
    }
  }

  return `(\n${indent}${entries.join(',\n' + indent)}\n${indent})`;
};

/**
 * Generuje zmienne SCSS dla globalnych tokenów
 * @returns Ciąg znaków zawierający zmienne SCSS
 */
export const generateSCSSVariables = (): string => {
  let scss = '';
  
  // Przetwarzanie globalnych tokenów
  for (const [key, value] of Object.entries(tokens.globalTokens)) {
    if (typeof value === 'object' && value !== null) {
      scss += `$${key}: ${transformTokensToSCSSMaps(value, key)};\n\n`;
    }
  }
  
  return scss;
};

/**
 * Generuje zmienne SCSS dla określonego projektu
 * @param projectKey - Klucz projektu
 * @returns Ciąg znaków zawierający zmienne SCSS dla projektu
 */
export const generateProjectSCSSVariables = (projectKey: string): string => {
  // Sprawdzamy, czy klucz projektu jest prawidłowy
  if (!isValidProjectKey(projectKey)) {
    throw new Error(`Nieprawidłowy klucz projektu: ${projectKey}`);
  }
  
  let scss = '';
  const projectSpecificTokens = tokens.projects[projectKey];
  
  // Przetwarzanie tokenów projektu
  for (const [key, value] of Object.entries(projectSpecificTokens)) {
    if (typeof value === 'object' && value !== null) {
      scss += `$${projectKey}-${key}: ${transformTokensToSCSSMaps(value, `${projectKey}-${key}`)};\n\n`;
    }
  }
  
  return scss;
};

/**
 * Sprawdza, czy podany klucz jest prawidłowym kluczem projektu
 * @param key - Klucz do sprawdzenia
 * @returns Czy jest prawidłowym kluczem projektu
 */
function isValidProjectKey(key: string): key is ProjectKey {
  return key === 'prPhoto' || key === 'prDev';
}

// Główna funkcja do uruchomienia
function main() {
  // Utwórz katalog dla plików SCSS, jeśli nie istnieje
  const scssDir = path.resolve('./dist/scss');
  if (!fs.existsSync(scssDir)) {
    fs.mkdirSync(scssDir, { recursive: true });
  }
  
  // Generuj i zapisz główny plik SCSS z globalnymi tokenami
  const mainScssContent = generateSCSSVariables();
  fs.writeFileSync(path.join(scssDir, 'tokens.scss'), mainScssContent);
  console.log('✓ Wygenerowano główny plik SCSS z globalnymi tokenami');
  
  // Generuj i zapisz pliki SCSS dla poszczególnych projektów
  const projectKeys: ProjectKey[] = ['prPhoto', 'prDev'];
  projectKeys.forEach(projectKey => {
    const projectScssContent = generateProjectSCSSVariables(projectKey);
    fs.writeFileSync(path.join(scssDir, `${projectKey}.scss`), projectScssContent);
    console.log(`✓ Wygenerowano plik SCSS dla projektu ${projectKey}`);
  });
  
  console.log('Zakończono generowanie plików SCSS!');
}

// Uruchom główną funkcję
main();
