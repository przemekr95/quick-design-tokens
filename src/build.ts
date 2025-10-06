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
      generateProjectIndex('css', projectName),
      generateJSIndex('esm', projectName),
      generateJSIndex('cjs', projectName),
      generateTSIndex(projectName)
    ])
  );
  
  await Promise.all([
    generateMainIndex('scss', projects),
    generateMainIndex('css', projects),
    generateMainJSIndex('esm', projects),
    generateMainJSIndex('cjs', projects),
    generateMainTSIndex(projects)
  ]);
}

async function generateProjectIndex(type: 'scss' | 'css', projectName: string): Promise<void> {
  const extension = type === 'scss' ? 'scss' : 'css';
  const importPrefix = type === 'css' ? '@import ' : '@use ';
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
  const importPrefix = type === 'css' ? '@import ' : '@use ';
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

async function generateJSIndex(type: 'esm' | 'cjs', projectName: string): Promise<void> {
  const indexPath = `dist/js/${type}/${projectName}/index.js`;
  const content = type === 'esm' 
    ? `export { tokens as default, tokens } from './tokens.js';\n`
    : `const { tokens } = require('./tokens.js');\nmodule.exports = tokens;\nmodule.exports.tokens = tokens;\n`;
  
  await fs.ensureDir(path.dirname(indexPath));
  await fs.writeFile(indexPath, content);
}

async function generateTSIndex(projectName: string): Promise<void> {
  const indexPath = `dist/types/${projectName}/index.d.ts`;
  const content = `export { tokens as default, tokens, DesignTokens, FontSizeToken } from './tokens.js';\n`;
  
  await fs.ensureDir(path.dirname(indexPath));
  await fs.writeFile(indexPath, content);
}

async function generateMainJSIndex(type: 'esm' | 'cjs', projects: string[]): Promise<void> {
  const indexPath = `dist/js/${type}/index.js`;
  
  if (type === 'esm') {
    const imports = projects
      .map(project => {
        const safeName = project.replace(/-/g, '_');
        return `import ${safeName}Tokens from './${project}/tokens.js';`;
      })
      .join('\n');
    
    const exports = projects
      .map(project => {
        const safeName = project.replace(/-/g, '_');
        return `  "${project}": ${safeName}Tokens`;
      })
      .join(',\n');
    
    const content = [
      '// All design tokens',
      imports,
      '',
      'export const tokens = {',
      exports,
      '};',
      '',
      'export default tokens;',
      ''
    ].join('\n');
    
    await fs.writeFile(indexPath, content);
  } else {
    const requires = projects
      .map(project => {
        const safeName = project.replace(/-/g, '_');
        return `const ${safeName}Tokens = require('./${project}/tokens.js');`;
      })
      .join('\n');
    
    const exports = projects
      .map(project => {
        const safeName = project.replace(/-/g, '_');
        return `  "${project}": ${safeName}Tokens`;
      })
      .join(',\n');
    
    const content = [
      '// All design tokens',
      requires,
      '',
      'const tokens = {',
      exports,
      '};',
      '',
      'module.exports = tokens;',
      'module.exports.tokens = tokens;',
      ''
    ].join('\n');
    
    await fs.writeFile(indexPath, content);
  }
}

async function generateMainTSIndex(projects: string[]): Promise<void> {
  const indexPath = `dist/types/index.d.ts`;
  
  const imports = projects
    .map(project => {
      const safeName = project.replace(/-/g, '_');
      return `import { DesignTokens as ${safeName}Tokens } from './${project}/tokens.js';`;
    })
    .join('\n');
  
  const tokenInterface = projects
    .map(project => {
      const safeName = project.replace(/-/g, '_');
      return `  "${project}": ${safeName}Tokens;`;
    })
    .join('\n');
  
  const content = [
    '// All design tokens types',
    imports,
    '',
    'export interface AllTokens {',
    tokenInterface,
    '}',
    '',
    'declare const tokens: AllTokens;',
    'export default tokens;',
    'export { tokens };',
    ''
  ].join('\n');
  
  await fs.writeFile(indexPath, content);
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
    
    // Convert ESM to CommonJS for cjs platform
    const cjsTokensPath = `dist/js/cjs/${projectName}/tokens.js`;
    if (await fs.pathExists(cjsTokensPath)) {
      let content = await fs.readFile(cjsTokensPath, 'utf8');
      content = content.replace('export const tokens = ', 'const tokens = ');
      content = content.replace('export default tokens;', 'module.exports = tokens;\nmodule.exports.tokens = tokens;\nmodule.exports.default = tokens;');
      await fs.writeFile(cjsTokensPath, content);
    }
    
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
