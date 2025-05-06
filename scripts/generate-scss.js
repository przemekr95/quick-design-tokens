// This file converts your design tokens to SCSS variables
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Ustaw poprawne ścieżki dla ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Zaimportuj tokeny - najpierw musimy zbudować projekt, aby te pliki istniały
// Możemy użyć zaimportowanego obiektu tokenów bezpośrednio z kodu źródłowego
// Uwaga: Ten import zadziała tylko po zbudowaniu projektu przez rollup
import * as tokenModule from '../dist/esm/index.js';
const tokens = tokenModule.default;

/**
 * Transformuje obiekt tokenów do formatu map SCSS
 * @param {Object} obj - Obiekt tokenów do transformacji
 * @param {string} mapName - Nazwa mapy SCSS
 * @param {number} depth - Aktualna głębokość zagnieżdżenia (do formatowania)
 * @returns {string} Ciąg znaków reprezentujący mapę SCSS
 */
const transformTokensToSCSSMaps = (obj, mapName, depth = 0) => {
  if (!obj || typeof obj !== 'object') {
    return '()';
  }

  const indent = '  '.repeat(depth);
  const entries = [];

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null) {
      // Rekurencyjne przetwarzanie zagnieżdżonych obiektów
      entries.push(
        `  "${key}": ${transformTokensToSCSSMaps(
          value,
          `${mapName}-${key}`,
          depth + 1
        )}`
      );
    } else {
      // Dla wartości końcowych
      entries.push(`  "${key}": ${JSON.stringify(value)}`);
    }
  }

  return `(\n${indent}${entries.join(',\n' + indent)}\n${indent})`;
};

/**
 * Generuje zmienne SCSS dla globalnych tokenów
 * @returns {string} Ciąg znaków zawierający zmienne SCSS
 */
const generateSCSSVariables = () => {
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
 * @param {string} projectKey - Klucz projektu
 * @returns {string} Ciąg znaków zawierający zmienne SCSS dla projektu
 */
const generateProjectSCSSVariables = (projectKey) => {
  // Sprawdzamy, czy klucz projektu jest prawidłowy
  if (!isValidProjectKey(projectKey)) {
    throw new Error(`Nieprawidłowy klucz projektu: ${projectKey}`);
  }

  let scss = '';
  const projectSpecificTokens = tokens.projects[projectKey];

  // Przetwarzanie tokenów projektu
  for (const [key, value] of Object.entries(projectSpecificTokens)) {
    if (typeof value === 'object' && value !== null) {
      scss += `$${projectKey}-${key}: ${transformTokensToSCSSMaps(
        value,
        `${projectKey}-${key}`
      )};\n\n`;
    }
  }

  return scss;
};

/**
 * Sprawdza, czy podany klucz jest prawidłowym kluczem projektu
 * @param {string} key - Klucz do sprawdzenia
 * @returns {boolean} Czy jest prawidłowym kluczem projektu
 */
function isValidProjectKey(key) {
  return key === 'prPhoto' || key === 'prDev';
}

// Utwórz katalog dla plików SCSS, jeśli nie istnieje
const scssDir = path.resolve(rootDir, 'dist/scss');
if (!fs.existsSync(scssDir)) {
  fs.mkdirSync(scssDir, { recursive: true });
}

// Generuj i zapisz główny plik SCSS z globalnymi tokenami
const mainScssContent = generateSCSSVariables();
fs.writeFileSync(path.join(scssDir, 'tokens.scss'), mainScssContent);
console.log('✓ Wygenerowano główny plik SCSS z globalnymi tokenami');

// Generuj i zapisz pliki SCSS dla poszczególnych projektów
const projectKeys = ['prPhoto', 'prDev'];
projectKeys.forEach((projectKey) => {
  const projectScssContent = generateProjectSCSSVariables(projectKey);
  fs.writeFileSync(
    path.join(scssDir, `${projectKey}.scss`),
    projectScssContent
  );
  console.log(`✓ Wygenerowano plik SCSS dla projektu ${projectKey}`);
});

console.log('Zakończono generowanie plików SCSS!');
