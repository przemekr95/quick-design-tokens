import fs from 'fs';
import path from 'path';
import { CoreTokens, ThemeMap, ThemeTokens } from '../types/tokens.js';
import { generateCoreScss, generateThemeScss } from './scss.js';
import { generateCoreCss, generateThemeCss } from './css.js';

export const generateOutputFormats = (
  outputDir: string,
  coreTokens: CoreTokens,
  themes: ThemeMap
): void => {
  const scssDir = path.join(outputDir, 'scss');
  const cssDir = path.join(outputDir, 'css');
  
  fs.mkdirSync(scssDir, { recursive: true });
  fs.mkdirSync(cssDir, { recursive: true });
  
  const coreScss = generateCoreScss(coreTokens);
  fs.writeFileSync(path.join(scssDir, 'core.scss'), coreScss);
  
  let scssIndex = '// Auto-generated index of SCSS files\n\n';
  scssIndex += '@import "./core";\n';
  
  const coreCss = generateCoreCss(coreTokens);
  fs.writeFileSync(path.join(cssDir, 'core.css'), coreCss);
  
  let cssIndex = '/* Auto-generated index of CSS files */\n\n';
  cssIndex += '@import "./core.css";\n';
  
  Object.entries(themes).forEach(([themeKey, themeTokens]) => {
    const safeThemeKey = themeKey.replace(/-/g, '_');
    
    const themeScss = generateThemeScss(themeKey, themeTokens as ThemeTokens);
    fs.writeFileSync(path.join(scssDir, `${safeThemeKey}.scss`), themeScss);
    scssIndex += `@import "./${safeThemeKey}";\n`;
    
    const themeCss = generateThemeCss(themeKey, themeTokens as ThemeTokens);
    fs.writeFileSync(path.join(cssDir, `${safeThemeKey}.css`), themeCss);
    cssIndex += `@import "./${safeThemeKey}.css";\n`;
  });
  
  fs.writeFileSync(path.join(scssDir, 'index.scss'), scssIndex);
  fs.writeFileSync(path.join(cssDir, 'index.css'), cssIndex);
};
