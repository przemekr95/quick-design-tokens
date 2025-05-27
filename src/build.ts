import StyleDictionary from 'style-dictionary';
import { configs } from './config.js';
import { preprocessTokens } from './preformat.js';
import fs from 'fs-extra';
import path from 'path';

// TODO: Rozszerz build o dodatkowe formaty:
// 1. JavaScript/TypeScript:
//    - Dodaj buildowanie dla ESM (dist/js/esm/)
//    - Dodaj buildowanie dla CJS (dist/js/cjs/)
//    - Generuj pliki definicji TypeScript (dist/types/)
// 2. Dodatkowe formaty:
//    - JSON dla web applications
//    - React Native format
//    - iOS/Android formats
// 3. Dodaj minifikację CSS
// 4. Dodaj source maps

async function cleanDistDirectory(): Promise<void> {
  console.log('🧹 Czyszczenie katalogu dist...');
  try {
    await fs.remove('dist');
    await fs.ensureDir('dist');
    console.log('✅ Katalog dist wyczyszczony i utworzony');
  } catch (error) {
    console.error('❌ Błąd podczas czyszczenia dist:', error);
    throw error;
  }
}

async function buildProject(projectName: string): Promise<void> {
  console.log(`🏗️  Budowanie projektu: ${projectName}`);
  
  const config = configs[projectName as keyof typeof configs];
  if (!config) {
    throw new Error(`Nie znaleziono konfiguracji dla projektu: ${projectName}`);
  }

  try {
    // Preprocess tokens przed budowaniem
    console.log(`📂 Przetwarzanie tokenów z ścieżek:`, config.source);
    const processedTokens = await preprocessTokens(config.source);
    console.log(`📊 Przetworzone kategorie tokenów:`, Object.keys(processedTokens));
    
    // Stwórz tymczasowe pliki z przetworzonymi tokenami
    const tempDir = `temp/${projectName}`;
    await fs.ensureDir(tempDir);
    console.log(`📁 Utworzono katalog tymczasowy: ${tempDir}`);
    
    for (const [category, tokens] of Object.entries(processedTokens)) {
      const tempFilePath = `${tempDir}/${category}.json`;
      await fs.writeJson(tempFilePath, tokens, { spaces: 2 });
      console.log(`💾 Zapisano: ${tempFilePath}`);
    }

    // Zaktualizuj source paths do tymczasowych plików
    const updatedConfig = {
      ...config,
      source: [`${tempDir}/**/*.json`]
    };

    // Zbuduj Style Dictionary
    console.log(`📋 Konfiguracja dla ${projectName}:`, JSON.stringify(updatedConfig, null, 2));
    const sd = new StyleDictionary(updatedConfig);
    console.log(`🔨 Budowanie platform dla ${projectName}...`);
    await sd.buildAllPlatforms();
    console.log(`✅ Platformy zbudowane dla ${projectName}`);

    // Wyczyść tymczasowe pliki
    await fs.remove(`temp/${projectName}`);
    
    console.log(`✅ Projekt ${projectName} zbudowany pomyślnie`);
  } catch (error) {
    console.error(`❌ Błąd podczas budowania projektu ${projectName}:`, error);
    throw error;
  }
}

async function generateIndexFiles(): Promise<void> {
  console.log('📝 Generowanie plików index...');
  
  // TODO: Dodaj generowanie index.js, index.d.ts dla głównego eksportu
  // Obecnie skupiamy się na SCSS/CSS
  
  // Generuj index.scss dla każdego projektu
  for (const projectName of Object.keys(configs)) {
    const scssIndexPath = `dist/scss/${projectName}/index.scss`;
    const scssContent = `// ${projectName} design tokens\n@import './variables';\n`;
    
    await fs.ensureDir(path.dirname(scssIndexPath));
    await fs.writeFile(scssIndexPath, scssContent);
  }
  
  // Generuj główny index.scss
  const mainScssContent = Object.keys(configs)
    .map(project => `@import './${project}/variables';`)
    .join('\n');
  
  await fs.writeFile('dist/scss/index.scss', `// All design tokens\n${mainScssContent}\n`);
}

async function copyStaticFiles(): Promise<void> {
  console.log('📋 Kopiowanie plików statycznych...');
  
  // Skopiuj README i package.json do dist (jeśli potrzebne)
  const packageJson = await fs.readJson('package.json');
  
  // Utwórz package.json dla dystrybucji
  const distPackageJson = {
    ...packageJson,
    scripts: undefined, // Usuń scripts z wersji produkcyjnej
    devDependencies: undefined, // Usuń devDependencies
  };
  
  await fs.writeJson('dist/package.json', distPackageJson, { spaces: 2 });
  
  // Skopiuj README
  if (await fs.pathExists('README.md')) {
    await fs.copy('README.md', 'dist/README.md');
  }
}

export async function buildAll(): Promise<void> {
  try {
    console.log('🚀 Rozpoczynanie budowania design tokens...');
    
    await cleanDistDirectory();
    
    // Zbuduj wszystkie projekty
    for (const projectName of Object.keys(configs)) {
      await buildProject(projectName);
    }
    
    await generateIndexFiles();
    await copyStaticFiles();
    
    console.log('🎉 Budowanie zakończone pomyślnie!');
    console.log('📦 Wyniki dostępne w katalogu dist/');
    
  } catch (error) {
    console.error('💥 Błąd podczas budowania:', error);
    process.exit(1);
  }
}

// Uruchom build jeśli plik jest wywoływany bezpośrednio
console.log('🔍 Sprawdzanie warunków uruchomienia...');
console.log('import.meta.url:', import.meta.url);
console.log('process.argv[1]:', process.argv[1]);
console.log('Expected:', `file://${process.argv[1]}`);

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('✅ Warunki spełnione - uruchamiam buildAll()');
  buildAll();
} else {
  console.log('❌ Warunki nie spełnione - buildAll() nie został uruchomiony');
}
