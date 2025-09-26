import StyleDictionary from 'style-dictionary';

function createFontClassesFormat(type: 'scss' | 'css') {
  const commentPrefix = type === 'scss' ? '//' : '/*';
  const commentSuffix = type === 'css' ? ' */' : '';
  
  return function({ dictionary, options }: any): string {
    const header = options?.showFileHeader && typeof options?.fileHeader === 'function'
      ? options.fileHeader().map((line: string) => `${commentPrefix} ${line}${commentSuffix}`).join('\n') + '\n\n'
      : '';
    
    let output = header;
    const fontSizeGroups = new Set<string>();
    
    dictionary.allTokens.forEach((token: any) => {
      if (token.path.includes('font') && 
          token.path.includes('size') && 
          (token.path.includes('fontSize') || token.path.includes('lineHeight'))) {
        const basePath = token.path.slice(0, -1);
        fontSizeGroups.add(basePath.join('-'));
      }
    });
    
    fontSizeGroups.forEach((baseKey) => {
      const fontSizeToken = dictionary.allTokens.find((t: any) => 
        t.path.join('-') === `${baseKey}-fontSize`
      );
      const lineHeightToken = dictionary.allTokens.find((t: any) => 
        t.path.join('-') === `${baseKey}-lineHeight`
      );
      
      if (fontSizeToken && lineHeightToken) {
        output += `.${baseKey} {\n`;
        output += `  font-size: ${fontSizeToken.value};\n`;
        output += `  line-height: ${lineHeightToken.value};\n`;
        output += `}\n\n`;
      }
    });
    
    return output;
  };
}

function createSpacingClassesFormat(type: 'scss' | 'css') {
  const commentPrefix = type === 'scss' ? '//' : '/*';
  const commentSuffix = type === 'css' ? ' */' : '';
  
  return function({ dictionary, options }: any): string {
    const header = options?.showFileHeader && typeof options?.fileHeader === 'function'
      ? options.fileHeader().map((line: string) => `${commentPrefix} ${line}${commentSuffix}`).join('\n') + '\n\n'
      : '';
    
    let output = header;
    
    // Only generate practical spacing values (commonly used in web development)
    const practicalSizes = ['0', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16'];
    
    // Generate margin classes (optimized range)
    output += `${commentPrefix} Margin utility classes (optimized for common usage)${commentSuffix}\n`;
    dictionary.allTokens.forEach((token: any) => {
      if (token.path[0] === 'spacing' && practicalSizes.includes(token.path[1])) {
        const size = token.path[1];
        output += `.m-${size} { margin: ${token.value}; }\n`;
        output += `.mt-${size} { margin-top: ${token.value}; }\n`;
        output += `.mr-${size} { margin-right: ${token.value}; }\n`;
        output += `.mb-${size} { margin-bottom: ${token.value}; }\n`;
        output += `.ml-${size} { margin-left: ${token.value}; }\n`;
        output += `.mx-${size} { margin-left: ${token.value}; margin-right: ${token.value}; }\n`;
        output += `.my-${size} { margin-top: ${token.value}; margin-bottom: ${token.value}; }\n`;
        output += `\n`;
      }
    });
    
    // Generate padding classes (optimized range)
    output += `${commentPrefix} Padding utility classes (optimized for common usage)${commentSuffix}\n`;
    dictionary.allTokens.forEach((token: any) => {
      if (token.path[0] === 'spacing' && practicalSizes.includes(token.path[1])) {
        const size = token.path[1];
        output += `.p-${size} { padding: ${token.value}; }\n`;
        output += `.pt-${size} { padding-top: ${token.value}; }\n`;
        output += `.pr-${size} { padding-right: ${token.value}; }\n`;
        output += `.pb-${size} { padding-bottom: ${token.value}; }\n`;
        output += `.pl-${size} { padding-left: ${token.value}; }\n`;
        output += `.px-${size} { padding-left: ${token.value}; padding-right: ${token.value}; }\n`;
        output += `.py-${size} { padding-top: ${token.value}; padding-bottom: ${token.value}; }\n`;
        output += `\n`;
      }
    });
    
    output += `${commentPrefix} Note: For larger spacing values (20-64), use CSS variables:${commentSuffix}\n`;
    output += `${commentPrefix} margin: var(--spacing-24); /* 96px */${commentSuffix}\n`;
    output += `${commentPrefix} padding: var(--spacing-32); /* 128px */${commentSuffix}\n`;
    
    return output;
  };
}

StyleDictionary.registerFormat({
  name: 'scss/font-classes',
  format: createFontClassesFormat('scss')
});

StyleDictionary.registerFormat({
  name: 'css/font-classes',
  format: createFontClassesFormat('css')
});

StyleDictionary.registerFormat({
  name: 'scss/spacing-classes',
  format: createSpacingClassesFormat('scss')
});

StyleDictionary.registerFormat({
  name: 'css/spacing-classes',
  format: createSpacingClassesFormat('css')
});

// Register enhanced CSS variables format matching SCSS approach
StyleDictionary.registerFormat({
  name: 'css/variables-enhanced',
  format: function({ dictionary, options }: any): string {
    const header = options?.showFileHeader && typeof options?.fileHeader === 'function'
      ? options.fileHeader().map((line: string) => ` * ${line}`).join('\n')
      : '';
    
    let output = header ? `/**\n${header}\n */\n\n` : '';
    output += ':root {\n';
    
    // Group font size tokens
    const fontSizeGroups = new Map<string, { fontSize?: string, lineHeight?: string }>();
    
    dictionary.allTokens.forEach((token: any) => {
      const path = token.path;
      
      // Handle font sizes specially - collect fontSize and lineHeight pairs
      if (path.includes('font') && path.includes('size')) {
        const sizeName = path[path.length - 2];
        const property = path[path.length - 1];
        
        if (!fontSizeGroups.has(sizeName)) {
          fontSizeGroups.set(sizeName, {});
        }
        
        const group = fontSizeGroups.get(sizeName)!;
        if (property === 'fontSize') {
          group.fontSize = token.value;
        } else if (property === 'lineHeight') {
          group.lineHeight = token.value;
        }
        return; // Skip adding to regular tokens
      }
      
      // Convert path to CSS variable name
      const cssVarName = path.join('-');
      output += `  --${cssVarName}: ${token.value};\n`;
    });
    
    // Add modern typography CSS variables (v1.0.0 style)
    fontSizeGroups.forEach((group, sizeName) => {
      if (group.fontSize && group.lineHeight) {
        // Individual variables (like CSS --font-md, --line-md)
        output += `  --font-${sizeName}: ${group.fontSize};\n`;
        output += `  --line-${sizeName}: ${group.lineHeight};\n`;
      }
    });
    
    output += '}\n';
    return output;
  }
});

// Register enhanced JS format matching SCSS approach
StyleDictionary.registerFormat({
  name: 'javascript/es6-enhanced',
  format: function({ dictionary, options }: any): string {
    const header = options?.showFileHeader && typeof options?.fileHeader === 'function'
      ? options.fileHeader().map((line: string) => `// ${line}`).join('\n') + '\n\n'
      : '';
    
    const tokens: Record<string, any> = {};
    
    // Group font size tokens
    const fontSizeGroups = new Map<string, { fontSize?: string, lineHeight?: string }>();
    
    dictionary.allTokens.forEach((token: any) => {
      const path = token.path;
      
      // Handle font sizes specially - collect fontSize and lineHeight pairs
      if (path.includes('font') && path.includes('size')) {
        const sizeName = path[path.length - 2];
        const property = path[path.length - 1];
        
        if (!fontSizeGroups.has(sizeName)) {
          fontSizeGroups.set(sizeName, {});
        }
        
        const group = fontSizeGroups.get(sizeName)!;
        if (property === 'fontSize') {
          group.fontSize = token.value;
        } else if (property === 'lineHeight') {
          group.lineHeight = token.value;
        }
        return; // Skip adding to regular tokens
      }
      
      // Convert path to camelCase token name
      const tokenName = path.map((part: string, index: number) => 
        index === 0 ? part.charAt(0).toUpperCase() + part.slice(1) : 
        part.charAt(0).toUpperCase() + part.slice(1)
      ).join('');
      
      tokens[tokenName] = token.value;
    });
    
    // Add modern typography tokens (v1.0.0 style)
    fontSizeGroups.forEach((group, sizeName) => {
      if (group.fontSize && group.lineHeight) {
        const capitalizedSize = sizeName.charAt(0).toUpperCase() + sizeName.slice(1);
        
        // Combined text variable (like SCSS $text-md)
        tokens[`Text${capitalizedSize}`] = `${group.fontSize}/${group.lineHeight}`;
        // Individual variables (like SCSS $font-md, $line-md)
        tokens[`Font${capitalizedSize}`] = group.fontSize;
        tokens[`Line${capitalizedSize}`] = group.lineHeight;
      }
    });
    
    return header + `export const tokens = ${JSON.stringify(tokens, null, 2)};\n\n` +
           `export default tokens;\n`;
  }
});

StyleDictionary.registerFormat({
  name: 'typescript/es6-declarations-enhanced',
  format: function({ dictionary, options }: any): string {
    const header = options?.showFileHeader && typeof options?.fileHeader === 'function'
      ? options.fileHeader().map((line: string) => `// ${line}`).join('\n') + '\n\n'
      : '';
    
    return header + `/**
 * Modern Design Tokens v1.0.0
 * 
 * Typography tokens follow clean API:
 * - TextXs: "12px/16px" (combined font-size/line-height for CSS font property)
 * - FontXs: "12px" (individual font-size)
 * - LineXs: "16px" (individual line-height)
 */

export interface DesignTokens {
  // Colors
  ColorPrimary: string;
  ColorSecondary: string;
  ColorNeutral: string;
  ColorBackground: string;
  ColorText: string;
  ColorSuccess: string;
  ColorWarning: string;
  ColorError: string;
  [key: \`Color\${string}\`]: string;
  
  // Font families
  FontFamilyPrimary: string;
  FontFamilyMono: string;
  FontFamilyDisplay: string;
  
  // Font weights
  FontWeightLight: string;
  FontWeightRegular: string;
  FontWeightMedium: string;
  FontWeightSemibold: string;
  FontWeightBold: string;
  
  // Modern typography (v1.0.0)
  TextXs: string;    // "12px/16px" - for CSS font shorthand
  FontXs: string;    // "12px" - individual font-size
  LineXs: string;    // "16px" - individual line-height
  
  TextSm: string;    // "14px/20px"
  FontSm: string;    // "14px"
  LineSm: string;    // "20px"
  
  TextMd: string;    // "16px/24px"
  FontMd: string;    // "16px"
  LineMd: string;    // "24px"
  
  TextLg: string;    // "18px/28px"
  FontLg: string;    // "18px"
  LineLg: string;    // "28px"
  
  TextXl: string;    // "20px/28px"
  FontXl: string;    // "20px"
  LineXl: string;    // "28px"
  
  Text2xl: string;   // "24px/32px"
  Font2xl: string;   // "24px"
  Line2xl: string;   // "32px"
  
  Text3xl: string;   // "30px/36px"
  Font3xl: string;   // "30px"
  Line3xl: string;   // "36px"
  
  // Spacing scale (unified for margin/padding/gap/etc)
  Spacing0: string;
  Spacing1: string;
  Spacing2: string;
  Spacing3: string;
  Spacing4: string;
  Spacing5: string;
  Spacing6: string;
  Spacing8: string;
  Spacing10: string;
  Spacing12: string;
  Spacing16: string;
  Spacing20: string;
  Spacing24: string;
  Spacing32: string;
  Spacing40: string;
  Spacing48: string;
  Spacing56: string;
  Spacing64: string;
}

declare const tokens: DesignTokens;
export default tokens;
export { tokens };
export type { DesignTokens };
`;
  }
});

// Register enhanced SCSS format with short names
StyleDictionary.registerFormat({
  name: 'scss/variables-enhanced',
  format: function({ dictionary, options }: any): string {
    const header = options?.showFileHeader && typeof options?.fileHeader === 'function'
      ? options.fileHeader().map((line: string) => `// ${line}`).join('\n') + '\n\n'
      : '';
    
    let output = header;
    
    // Group font size tokens
    const fontSizeGroups = new Map<string, { fontSize?: string, lineHeight?: string }>();
    
    dictionary.allTokens.forEach((token: any) => {
      const path = token.path;
      
      // Handle font sizes specially
      if (path.includes('font') && path.includes('size')) {
        const sizeName = path[path.length - 2];
        const property = path[path.length - 1];
        
        if (!fontSizeGroups.has(sizeName)) {
          fontSizeGroups.set(sizeName, {});
        }
        
        const group = fontSizeGroups.get(sizeName)!;
        if (property === 'fontSize') {
          group.fontSize = token.value;
        } else if (property === 'lineHeight') {
          group.lineHeight = token.value;
        }
      }
    });
    
    // Generate clean variables (v1.0.0 - no legacy variables)
    dictionary.allTokens.forEach((token: any) => {
      const path = token.path;
      
      // Skip generating old font-size variables - we'll use new format only
      if (path.includes('font') && path.includes('size') && 
          (path.includes('fontSize') || path.includes('lineHeight'))) {
        return; // Skip old format
      }
      
      const name = path.join('-');
      output += `$${name}: ${token.value};\n`;
    });
    
    output += '\n// Modern typography variables (v1.0.0)\n';
    
    // Generate only new short font variables
    fontSizeGroups.forEach((group, sizeName) => {
      if (group.fontSize && group.lineHeight) {
        // Combined variable (primary approach)
        output += `$text-${sizeName}: "#{${group.fontSize}}/#{${group.lineHeight}}";\n`;
        // Individual variables for flexibility
        output += `$font-${sizeName}: ${group.fontSize};\n`;
        output += `$line-${sizeName}: ${group.lineHeight};\n`;
      }
    });
    
    return output;
  }
});

const createProjectConfig = (projectName: string, sources: string[]) => ({
  name: projectName,
  source: sources,
  platforms: {
    scss: {
      transformGroup: 'scss',
      buildPath: `dist/scss/${projectName}/`,
      files: [
        {
          destination: 'variables.scss',
          format: 'scss/variables-enhanced',
          options: { showFileHeader: true, fileHeader: () => getFileHeaderLines(projectName) }
        },
        {
          destination: 'classes.scss',
          format: 'scss/font-classes',
          options: { showFileHeader: true, fileHeader: () => getFileHeaderLines(projectName, 'Font utility classes') }
        },
        {
          destination: 'spacing.scss',
          format: 'scss/spacing-classes',
          options: { showFileHeader: true, fileHeader: () => getFileHeaderLines(projectName, 'Spacing utility classes') }
        }
      ]
    },
    css: {
      transformGroup: 'css',
      buildPath: `dist/css/${projectName}/`,
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables-enhanced',
          options: { showFileHeader: true, fileHeader: () => getFileHeaderLines(projectName) }
        },
        {
          destination: 'classes.css',
          format: 'css/font-classes',
          options: { showFileHeader: true, fileHeader: () => getFileHeaderLines(projectName, 'Font utility classes') }
        },
        {
          destination: 'spacing.css',
          format: 'css/spacing-classes',
          options: { showFileHeader: true, fileHeader: () => getFileHeaderLines(projectName, 'Spacing utility classes') }
        }
      ]
    },
    js: {
      transformGroup: 'js',
      buildPath: `dist/js/esm/${projectName}/`,
      files: [
        {
          destination: 'tokens.js',
          format: 'javascript/es6-enhanced',
          options: { showFileHeader: true, fileHeader: () => getFileHeaderLines(projectName, 'Design tokens') }
        }
      ]
    },
    'js-cjs': {
      transformGroup: 'js',
      buildPath: `dist/js/cjs/${projectName}/`,
      files: [
        {
          destination: 'tokens.js',
          format: 'javascript/es6-enhanced',
          options: { showFileHeader: true, fileHeader: () => getFileHeaderLines(projectName, 'Design tokens') }
        }
      ]
    },
    ts: {
      transformGroup: 'js',
      buildPath: `dist/types/${projectName}/`,
      files: [
        {
          destination: 'tokens.d.ts',
          format: 'typescript/es6-declarations-enhanced',
          options: { showFileHeader: true, fileHeader: () => getFileHeaderLines(projectName, 'TypeScript definitions') }
        }
      ]
    }
  }
});

function getFileHeaderLines(projectName: string, type = 'Design tokens'): string[] {
  return [
    `${type} for ${projectName} project`,
    'Generated automatically - do not edit directly',
    `Built on: ${new Date().toISOString()}`
  ];
}

export const configs = {
  global: createProjectConfig('global', ['figma-export/global/**/*.json']),
  'pr-dev': createProjectConfig('pr-dev', [
    'figma-export/global/**/*.json',
    'figma-export/pr-dev/**/*.json'
  ]),
  'pr-photo': createProjectConfig('pr-photo', [
    'figma-export/global/**/*.json',
    'figma-export/pr-photo/**/*.json'
  ]),
  'pr-iskierka': createProjectConfig('pr-iskierka', [
    'figma-export/global/**/*.json',
    'figma-export/pr-iskierka/**/*.json'
  ])
};
