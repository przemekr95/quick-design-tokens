import { configs } from './config.js';
import fs from 'fs-extra';
import path from 'path';

async function generateIndexFiles(): Promise<void> {
  console.log('📝 Generating index files...');
  
  const projects = Object.keys(configs);
  
  // Generuj pliki index dla każdego projektu
  await Promise.all(
    projects.flatMap(projectName => [
      generateProjectIndex('scss', projectName),
      generateProjectIndex('css', projectName)
    ])
  );
  
  // Generuj główne pliki index
  await Promise.all([
    generateMainIndex('scss', projects),
    generateMainIndex('css', projects)
  ]);
}

async function generateProjectIndex(type: 'scss' | 'css', projectName: string): Promise<void> {
  const extension = type === 'scss' ? 'scss' : 'css';
  const importPrefix = type === 'css' ? '@import ' : '@import ';
  const importSuffix = type === 'css' ? '.css' : '';
  const commentPrefix = type === 'scss' ? '//' : '/*';
  const commentSuffix = type === 'css' ? ' */' : '';
  
  const indexPath = `dist/${type}/${projectName}/index.${extension}`;
  const content = [
    `${commentPrefix} ${projectName} design tokens${commentSuffix}`,
    `${importPrefix}'./variables${importSuffix}';`,
    `${importPrefix}'./classes${importSuffix}';`,
    ''
  ].join('\n');
  
  await fs.ensureDir(path.dirname(indexPath));
  await fs.writeFile(indexPath, content);
}

async function generateMainIndex(type: 'scss' | 'css', projects: string[]): Promise<void> {
  const extension = type === 'scss' ? 'scss' : 'css';
  const importPrefix = type === 'css' ? '@import ' : '@import ';
  const importSuffix = type === 'css' ? '.css' : '';
  const commentPrefix = type === 'scss' ? '//' : '/*';
  const commentSuffix = type === 'css' ? ' */' : '';
  
  const variableImports = projects
    .map(project => `${importPrefix}'./${project}/variables${importSuffix}';`)
    .join('\n');
  
  const classImports = projects
    .map(project => `${importPrefix}'./${project}/classes${importSuffix}';`)
    .join('\n');
  
  const content = [
    `${commentPrefix} All design tokens${commentSuffix}`,
    variableImports,
    '',
    `${commentPrefix} All utility classes${commentSuffix}`,
    classImports,
    ''
  ].join('\n');
  
  await fs.writeFile(`dist/${type}/index.${extension}`, content);
}

// Uproszczona funkcja budowania projektu
async function buildProject(projectName: string): Promise<void> {
  console.log(`🏗️  Building project: ${projectName}`);
  
  const config = configs[projectName as keyof typeof configs];
  if (!config) {
    throw new Error(`No configuration found for project: ${projectName}`);
  }

  try {
    const { preprocessTokens } = await import('./preformat.js');
    const processedTokens = await preprocessTokens(config.source);

    // Użyj tymczasowych plików
    const tempDir = `temp/${projectName}`;
    await fs.ensureDir(tempDir);
    
    // Zapisz przetworzone tokeny
    await Promise.all(
      Object.entries(processedTokens).map(([category, tokens]) =>
        fs.writeJson(`${tempDir}/${category}.json`, tokens, { spaces: 2 })
      )
    );

    // Zbuduj z tymczasowych plików
    const sd = new StyleDictionary({
      ...config,
      source: [`${tempDir}/**/*.json`]
    });
    
    await sd.buildAllPlatforms();
    await fs.remove(tempDir);
    
    console.log(`✅ Project ${projectName} built successfully`);
  } catch (error) {
    console.error(`❌ Error building project ${projectName}:`, error);
    throw error;
  }
}
