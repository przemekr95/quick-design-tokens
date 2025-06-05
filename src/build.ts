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
  console.log('🧹 Cleaning the dist directory...');
  try {
    await fs.remove('dist');
    await fs.ensureDir('dist');
    console.log('✅ Dist directory cleared and created...');
  } catch (error) {
    console.error('❌ Error while cleaning dist:', error);
    throw error;
  }
}

async function buildProject(projectName: string): Promise<void> {
  console.log(`🏗️  Building the project: ${projectName}`);
  
  const config = configs[projectName as keyof typeof configs];
  if (!config) {
    throw new Error(`No configuration found for the project: ${projectName}`);
  }

  try {
    const processedTokens = await preprocessTokens(config.source);

    const tempDir = `temp/${projectName}`;
    await fs.ensureDir(tempDir);
    
    for (const [category, tokens] of Object.entries(processedTokens)) {
      const tempFilePath = `${tempDir}/${category}.json`;
      await fs.writeJson(tempFilePath, tokens, { spaces: 2 });
    }

    const updatedConfig = {
      ...config,
      source: [`${tempDir}/**/*.json`]
    };

    const sd = new StyleDictionary(updatedConfig);
    await sd.buildAllPlatforms();

    await fs.remove(`temp/${projectName}`);
    
    console.log(`✅ Project ${projectName} built successfully`);
  } catch (error) {
    console.error(`❌ Error while building a project ${projectName}:`, error);
    throw error;
  }
}

async function generateIndexFiles(): Promise<void> {
  console.log('📝 Generating index files...');

  for (const projectName of Object.keys(configs)) {
    const scssIndexPath = `dist/scss/${projectName}/index.scss`;
    const scssContent = `// ${projectName} design tokens\n@import './variables';\n@import './classes';\n`;
    
    await fs.ensureDir(path.dirname(scssIndexPath));
    await fs.writeFile(scssIndexPath, scssContent);
  }

  const mainScssVariables = Object.keys(configs)
    .map(project => `@import './${project}/variables';`)
    .join('\n');
  
  const mainScssClasses = Object.keys(configs)
    .map(project => `@import './${project}/classes';`)
    .join('\n');
  
  const mainScssContent = `// All design tokens\n${mainScssVariables}\n\n// All utility classes\n${mainScssClasses}\n`;
  
  await fs.writeFile('dist/scss/index.scss', mainScssContent);

  for (const projectName of Object.keys(configs)) {
    const cssIndexPath = `dist/css/${projectName}/index.css`;
    const cssContent = `/* ${projectName} design tokens */\n@import './variables.css';\n@import './classes.css';\n`;
    
    await fs.ensureDir(path.dirname(cssIndexPath));
    await fs.writeFile(cssIndexPath, cssContent);
  }

  const mainCssVariables = Object.keys(configs)
    .map(project => `@import './${project}/variables.css';`)
    .join('\n');
  
  const mainCssClasses = Object.keys(configs)
    .map(project => `@import './${project}/classes.css';`)
    .join('\n');
  
  const mainCssContent = `/* All design tokens */\n${mainCssVariables}\n\n/* All utility classes */\n${mainCssClasses}\n`;
  
  await fs.writeFile('dist/css/index.css', mainCssContent);
}

async function copyStaticFiles(): Promise<void> {
  console.log('📋 Copying static files...');
  
  const packageJson = await fs.readJson('package.json');
  
  const distPackageJson = {
    ...packageJson,
    scripts: undefined,
    devDependencies: undefined,
  };
  
  await fs.writeJson('dist/package.json', distPackageJson, { spaces: 2 });

  if (await fs.pathExists('README.md')) {
    await fs.copy('README.md', 'dist/README.md');
  }
}

export async function buildAll(): Promise<void> {
  try {
    console.log('🚀 Starting to build design tokens...');
    
    await cleanDistDirectory();

    for (const projectName of Object.keys(configs)) {
      await buildProject(projectName);
    }
    
    await generateIndexFiles();
    await copyStaticFiles();
    
    console.log('🎉 Building completed successfully!');
    console.log('📦 Results available in the catalog dist/');
    console.log('📋 Available files:');
    console.log('   • dist/scss/[project]/variables.scss - SCSS variables');
    console.log('   • dist/scss/[project]/classes.scss - SCSS utility classes');
    console.log('   • dist/css/[project]/variables.css - CSS variables');
    console.log('   • dist/css/[project]/classes.css - CSS utility classes');
    console.log('   • dist/scss/index.scss - Main SCSS file');
    console.log('   • dist/css/index.css - Main CSS file');
    
  } catch (error) {
    console.error('💥 Error while building:', error);
    process.exit(1);
  }
}

import { fileURLToPath } from 'url';

const currentFile = fileURLToPath(import.meta.url);
const executedFile = process.argv[1];

const normalizedCurrent = currentFile.replace(/\\/g, '/');
const normalizedExecuted = executedFile.replace(/\\/g, '/');

if (normalizedCurrent === normalizedExecuted) {
  buildAll();
}
