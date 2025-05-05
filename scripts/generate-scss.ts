import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// W środowisku ESM potrzebujemy innej metody do uzyskania ścieżki bieżącego pliku
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import globalnych i projektowych tokenów bezpośrednio z plików źródłowych
import { globalTokens } from '../src/tokens/global/index.js';
import { projectTokens } from '../src/tokens/projects/index.js';

// Ścieżka do folderu wyjściowego
const outputDir = path.resolve(__dirname, '../dist/scss');

// Upewniamy się, że folder wyjściowy istnieje
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Funkcje do generowania SCSS

/**
 * Generuje zmienne SCSS na podstawie tokenów
 */
function generateSCSSVariables(tokens) {
  let scssVars = '';
  
  function transformTokensToSCSSVars(obj, prefix = '') {
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object' && value !== null) {
        transformTokensToSCSSVars(value, `${prefix}${key}-`);
      } else {
        scssVars += `$${prefix}${key}: ${value};\n`;
      }
    }
  }
  
  transformTokensToSCSSVars(tokens);
  return scssVars;
}

/**
 * Generuje mapy SCSS dla łatwiejszego dostępu do tokenów
 */
function generateSCSSMaps(tokens) {
  let result = '';
  
  function transformTokensToSCSSMaps(obj, mapName, depth = 0) {
    if (depth > 0 && (typeof obj !== 'object' || obj === null)) {
      return `${obj}`;
    }
    
    let entries = [];
    
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
  }
  
  // Tworzymy osobne mapy dla każdej kategorii tokenów
  if (tokens.colors) result += transformTokensToSCSSMaps(tokens.colors, 'colors');
  if (tokens.typography) result += transformTokensToSCSSMaps(tokens.typography, 'typography');
  if (tokens.spacing) result += transformTokensToSCSSMaps(tokens.spacing, 'spacing');
  if (tokens.borderRadius) result += transformTokensToSCSSMaps(tokens.borderRadius, 'radius');
  if (tokens.boxShadow) result += transformTokensToSCSSMaps(tokens.boxShadow, 'shadow');
  
  return result;
}

/**
 * Generuje funkcje pomocnicze dla SCSS
 */
function generateSCSSFunctions() {
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
}

/**
 * Generuje kompletny plik SCSS
 */
function generateFullSCSSFile(tokens) {
  return `// Design tokens wygenerowane automatycznie
// Nie edytuj tego pliku ręcznie

// Zmienne SCSS
${generateSCSSVariables(tokens)}

// Mapy SCSS
${generateSCSSMaps(tokens)}

// Funkcje pomocnicze
${generateSCSSFunctions()}
`;
}

// Generowanie głównego pliku SCSS z globalnymi tokenami
const mainScssContent = generateFullSCSSFile(globalTokens);
fs.writeFileSync(path.join(outputDir, 'tokens.scss'), mainScssContent);
console.log('✅ Wygenerowano plik tokens.scss');

// Generowanie plików SCSS dla projektów
Object.keys(projectTokens).forEach(projectKey => {
  const projectScssContent = generateFullSCSSFile(projectTokens[projectKey]);
  fs.writeFileSync(path.join(outputDir, `${projectKey}.scss`), projectScssContent);
  console.log(`✅ Wygenerowano plik ${projectKey}.scss`);
});

console.log('🎉 Generowanie plików SCSS zakończone!');
