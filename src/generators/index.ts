// src/generators/index.ts
import fs from 'fs';
import path from 'path';
import { CoreTokens, ThemeMap, ThemeTokens } from '../types/tokens';
import { generateCoreScss, generateThemeScss } from './scss';
import { generateCoreCss, generateThemeCss } from './css';

/**
 * Generuje wszystkie formaty wyjściowe
 */
export const generateOutputFormats = (
  outputDir: string,
  coreTokens: CoreTokens,
  themes: ThemeMap
): void => {
  // Utwórz katalogi wyjściowe, jeśli nie istnieją
  const scssDir = path.join(outputDir, 'scss');
  const cssDir = path.join(outputDir, 'css');
  
  fs.mkdirSync(scssDir, { recursive: true });
  fs.mkdirSync(cssDir, { recursive: true });
  
  // Generowanie SCSS
  const coreScss = generateCoreScss(coreTokens);
  fs.writeFileSync(path.join(scssDir, 'core.scss'), coreScss);
  
  // Indeks dla SCSS
  let scssIndex = '// Auto-generowany indeks plików SCSS\n\n';
  scssIndex += '@import "./core";\n';
  
  // CSS dla rdzenia
  const coreCss = generateCoreCss(coreTokens);
  fs.writeFileSync(path.join(cssDir, 'core.css'), coreCss);
  
  // Indeks dla CSS
  let cssIndex = '/* Auto-generowany indeks CSS */\n\n';
  cssIndex += '@import "./core.css";\n';
  
  // Generowanie dla każdego motywu
  Object.entries(themes).forEach(([themeKey, themeTokens]) => {
    // SCSS dla motywu
    const themeScss = generateThemeScss(themeKey, themeTokens as ThemeTokens);
    fs.writeFileSync(path.join(scssDir, `${themeKey}.scss`), themeScss);
    scssIndex += `@import "./${themeKey}";\n`;
    
    // CSS dla motywu
    const themeCss = generateThemeCss(themeKey, themeTokens as ThemeTokens);
    fs.writeFileSync(path.join(cssDir, `${themeKey}.css`), themeCss);
    cssIndex += `@import "./${themeKey}.css";\n`;
  });
  
  // Zapisz pliki indeksu
  fs.writeFileSync(path.join(scssDir, 'index.scss'), scssIndex);
  fs.writeFileSync(path.join(cssDir, 'index.css'), cssIndex);
};
