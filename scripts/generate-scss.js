import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

// Ustaw poprawne ścieżki dla ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Utwórz requirera do użycia z dynamicznym importem
const require = createRequire(import.meta.url);

async function main() {
  // Tworzymy ścieżkę docelową dla SCSS, jeśli nie istnieje
  const scssDir = path.resolve(rootDir, 'dist/scss');
  if (!fs.existsSync(scssDir)) {
    fs.mkdirSync(scssDir, { recursive: true });
  }

  try {
    // Zamiast importu dynamicznego, użyjmy importu statycznego
    // lub podejścia require dla modułów CommonJS
    let tokenModule;

    try {
      // Próba załadowania przez require
      tokenModule = require(path.join(rootDir, 'dist/esm/tokens/index.js'));
    } catch (requireError) {
      console.log(
        'Nie udało się załadować przez require, próba importu dynamicznego...'
      );

      // W przypadku problemów z require, próbujemy import dynamiczny z poprawnym URL
      // Konwertuj ścieżkę na format URL z prefiksem file://
      const moduleUrl = new URL(
        `file://${path
          .join(rootDir, 'dist/esm/tokens/index.js')
          .replace(/\\/g, '/')}`
      );
      tokenModule = await import(moduleUrl.href);
    }

    if (!tokenModule) {
      throw new Error('Nie można załadować modułu tokenów');
    }

    // Pobierz tokeny z modułu
    const { globalTokens, projectTokens } = tokenModule;

    if (!globalTokens || !projectTokens) {
      throw new Error('Brak tokenów w zaimportowanym module');
    }

    // Całkowity obiekt tokenów
    const tokens = {
      globalTokens,
      projects: projectTokens,
    };

    // Generuj i zapisz główny plik SCSS z globalnymi tokenami
    const mainScssContent = generateSCSSVariables(tokens.globalTokens);
    fs.writeFileSync(path.join(scssDir, 'tokens.scss'), mainScssContent);
    console.log('✓ Wygenerowano główny plik SCSS z globalnymi tokenami');

    // Generuj i zapisz pliki SCSS dla poszczególnych projektów
    const projectKeys = ['prPhoto', 'prDev'];
    projectKeys.forEach((projectKey) => {
      if (projectTokens[projectKey]) {
        const projectScssContent = generateProjectSCSSVariables(
          projectKey,
          projectTokens
        );
        fs.writeFileSync(
          path.join(scssDir, `${projectKey}.scss`),
          projectScssContent
        );
        console.log(`✓ Wygenerowano plik SCSS dla projektu ${projectKey}`);
      } else {
        console.warn(`⚠ Brak tokenów dla projektu ${projectKey}`);
      }
    });

    // Utwórz plik indeksu, który importuje wszystkie pliki SCSS
    const indexScssContent = createSCSSIndex(projectKeys);
    fs.writeFileSync(path.join(scssDir, 'index.scss'), indexScssContent);
    console.log('✓ Wygenerowano plik indeksu SCSS');

    console.log('Zakończono generowanie plików SCSS!');
  } catch (error) {
    console.error('Wystąpił błąd podczas generowania plików SCSS:');
    console.error(error);
    process.exit(1);
  }
}

/**
 * Transformuje obiekt tokenów do formatu map SCSS
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
 */
const generateSCSSVariables = (globalTokens) => {
  let scss = '// Auto-generowane zmienne SCSS z globalnych tokenów\n\n';

  // Przetwarzanie globalnych tokenów
  for (const [key, value] of Object.entries(globalTokens)) {
    if (typeof value === 'object' && value !== null) {
      scss += `$${key}: ${transformTokensToSCSSMaps(value, key)};\n\n`;
    }
  }

  return scss;
};

/**
 * Generuje zmienne SCSS dla określonego projektu
 */
const generateProjectSCSSVariables = (projectKey, projectTokens) => {
  // Sprawdzamy, czy klucz projektu jest prawidłowy
  if (projectKey !== 'prPhoto' && projectKey !== 'prDev') {
    throw new Error(`Nieprawidłowy klucz projektu: ${projectKey}`);
  }

  let scss = `// Auto-generowane zmienne SCSS dla projektu ${projectKey}\n\n`;
  scss += '// Importuj globalne tokeny\n';
  scss += '@import "./tokens";\n\n';

  const projectSpecificTokens = projectTokens[projectKey];

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
 * Tworzy plik indeksu SCSS, który importuje wszystkie pliki SCSS
 */
const createSCSSIndex = (projectKeys) => {
  let index = '// Auto-generowany indeks plików SCSS\n\n';

  // Import globalnych tokenów
  index += '@import "./tokens";\n';

  // Import tokenów projektów
  projectKeys.forEach((projectKey) => {
    index += `@import "./${projectKey}";\n`;
  });

  return index;
};

// Uruchom główną funkcję
main();
