import StyleDictionary from 'style-dictionary';
import { configs } from './config.js';
import fs from 'fs-extra';
import path from 'path';

async function generateIndexFiles(): Promise<void> {
  console.log('📝 Generating index files...');
  
  const projects = Object.keys(configs);
  
  await Promise.all(
    projects.flatMap(projectName => [
      generateProjectIndex('scss', projectName),
      generateProjectIndex('css', projectName)
    ])
  );
  
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
    `${importPrefix}'./spacing${importSuffix}';`,
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

  const spacingImports = projects
    .map(project => `${importPrefix}'./${project}/spacing${importSuffix}';`)
    .join('\n');
  
  const content = [
    `${commentPrefix} All design tokens${commentSuffix}`,
    variableImports,
    '',
    `${commentPrefix} All utility classes${commentSuffix}`,
    classImports,
    '',
    `${commentPrefix} All spacing classes${commentSuffix}`,
    spacingImports,
    ''
  ].join('\n');
  
  await fs.writeFile(`dist/${type}/index.${extension}`, content);
}

async function buildProject(projectName: string): Promise<void> {
  console.log(`🏗️  Building project: ${projectName}`);
  
  const config = configs[projectName as keyof typeof configs];
  if (!config) {
    throw new Error(`No configuration found for project: ${projectName}`);
  }

  try {
    const { preprocessTokens } = await import('./preformat.js');
    const processedTokens = await preprocessTokens(config.source);

    const tempDir = `temp/${projectName}`;
    await fs.ensureDir(tempDir);
    
    await Promise.all(
      Object.entries(processedTokens).map(([category, tokens]) =>
        fs.writeJson(`${tempDir}/${category}.json`, tokens, { spaces: 2 })
      )
    );

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

async function build(): Promise<void> {
  console.log('🚀 Starting build process...');
  
  try {
    await fs.remove('dist');
    await fs.remove('temp');
    
    const projects = Object.keys(configs);
    await Promise.all(projects.map(buildProject));
    
    await generateIndexFiles();
    
    console.log('✅ Build completed successfully!');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

console.log('🚀 Starting build process...');
build().catch((error) => {
  console.error('❌ Build failed:', error);
  process.exit(1);
});

export { build, buildProject, generateIndexFiles };
