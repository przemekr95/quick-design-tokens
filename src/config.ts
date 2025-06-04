import StyleDictionary from 'style-dictionary';

// TODO: Dodaj konfigurację dla formatów CJS/ESM:
// - Dodaj format 'javascript/es6' dla ESM
// - Dodaj format 'javascript/cjs' dla CommonJS
// - Dodaj format 'typescript/es6-declarations' dla typów TypeScript
// - Rozważ dodanie custom formatów dla React Native, iOS, Android

interface FileOptions {
  destination: string;
  format: string;
  options?: {
    showFileHeader?: boolean;
    fileHeader?: () => string[];
  };
}

interface ProjectConfig {
  name: string;
  source: string[];
  platforms: {
    scss: {
      transformGroup: string;
      buildPath: string;
      files: FileOptions[];
    };
    css: {
      transformGroup: string;
      buildPath: string;
      files: FileOptions[];
    };
  };
}

const createProjectConfig = (projectName: string, sources: string[]): ProjectConfig => ({
  name: projectName,
  source: sources,
  platforms: {
    scss: {
      transformGroup: 'scss',
      buildPath: `dist/scss/${projectName}/`,
      files: [
        {
          destination: 'variables.scss',
          format: 'scss/variables',
          options: {
            showFileHeader: true,
            fileHeader: () => [
              `Design tokens for ${projectName} project`,
              'Generated automatically - do not edit directly',
              `Built on: ${new Date().toISOString()}`
            ]
          }
        },
        {
          destination: 'classes.scss',
          format: 'scss/font-classes',
          options: {
            showFileHeader: true,
            fileHeader: () => [
              `Font utility classes for ${projectName} project`,
              'Generated automatically - do not edit directly',
              `Built on: ${new Date().toISOString()}`
            ]
          }
        }
      ]
    },
    css: {
      transformGroup: 'css',
      buildPath: `dist/css/${projectName}/`,
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables',
          options: {
            showFileHeader: true,
            fileHeader: () => [
              `Design tokens for ${projectName} project`,
              'Generated automatically - do not edit directly',
              `Built on: ${new Date().toISOString()}`
            ]
          }
        },
        {
          destination: 'classes.css',
          format: 'css/font-classes',
          options: {
            showFileHeader: true,
            fileHeader: () => [
              `Font utility classes for ${projectName} project`,
              'Generated automatically - do not edit directly',
              `Built on: ${new Date().toISOString()}`
            ]
          }
        }
      ]
    }
  }
});

// Konfiguracje dla różnych projektów
export const configs = {
  global: createProjectConfig('global', [
    'figma-export/global/**/*.json'
  ]),
  'pr-dev': createProjectConfig('pr-dev', [
    'figma-export/global/**/*.json',
    'figma-export/pr-dev/**/*.json'
  ]),
  'pr-photo': createProjectConfig('pr-photo', [
    'figma-export/global/**/*.json',
    'figma-export/pr-photo/**/*.json'
  ])
};

// Helper function to safely get file header
function getFileHeader(options: any): string {
  if (options?.showFileHeader && typeof options?.fileHeader === 'function') {
    return options.fileHeader().map((line: string) => `// ${line}`).join('\n') + '\n\n';
  }
  return '';
}

// Helper function to safely get CSS file header
function getCssFileHeader(options: any): string {
  if (options?.showFileHeader && typeof options?.fileHeader === 'function') {
    return options.fileHeader().map((line: string) => `/* ${line} */`).join('\n') + '\n\n';
  }
  return '';
}

// Custom format dla klas SCSS z fontami
StyleDictionary.registerFormat({
  name: 'scss/font-classes',
  format: function({ dictionary, options }): string {
    const header = getFileHeader(options);
    
    let output = header;
    
    // Znajdź tokeny font size (te które mają fontSize i lineHeight)
    const fontSizeTokens = dictionary.allTokens.filter((token: any) => 
      token.path.includes('font') && 
      token.path.includes('size') && 
      !token.path.includes('fontSize') && 
      !token.path.includes('lineHeight')
    );
    
    fontSizeTokens.forEach((token: any) => {
      const sizeKey = token.path.join('-');
      const fontSizeToken = dictionary.allTokens.find((t: any) => 
        t.path.join('-') === `${sizeKey}-fontSize`
      );
      const lineHeightToken = dictionary.allTokens.find((t: any) => 
        t.path.join('-') === `${sizeKey}-lineHeight`
      );
      
      if (fontSizeToken && lineHeightToken) {
        output += `.${sizeKey} {\n`;
        output += `  font-size: ${fontSizeToken.value};\n`;
        output += `  line-height: ${lineHeightToken.value};\n`;
        output += `}\n\n`;
      }
    });
    
    return output;
  }
});

// Custom format dla klas CSS z fontami
StyleDictionary.registerFormat({
  name: 'css/font-classes',
  format: function({ dictionary, options }): string {
    const header = getCssFileHeader(options);
    
    let output = header;
    
    // Znajdź tokeny font size (te które mają fontSize i lineHeight)
    const fontSizeTokens = dictionary.allTokens.filter((token: any) => 
      token.path.includes('font') && 
      token.path.includes('size') && 
      !token.path.includes('fontSize') && 
      !token.path.includes('lineHeight')
    );
    
    fontSizeTokens.forEach((token: any) => {
      const sizeKey = token.path.join('-');
      const fontSizeToken = dictionary.allTokens.find((t: any) => 
        t.path.join('-') === `${sizeKey}-fontSize`
      );
      const lineHeightToken = dictionary.allTokens.find((t: any) => 
        t.path.join('-') === `${sizeKey}-lineHeight`
      );
      
      if (fontSizeToken && lineHeightToken) {
        output += `.${sizeKey} {\n`;
        output += `  font-size: ${fontSizeToken.value};\n`;
        output += `  line-height: ${lineHeightToken.value};\n`;
        output += `}\n\n`;
      }
    });
    
    return output;
  }
});


// Poprawiona funkcja dla scss/font-classes w config.ts

StyleDictionary.registerFormat({
  name: 'scss/font-classes',
  format: function({ dictionary, options }): string {
    const header = getFileHeader(options);
    
    let output = header;
    
    // Znajdź unikalne rozmiary fontów (bez fontSize/lineHeight suffix)
    const fontSizeGroups = new Set<string>();
    
    dictionary.allTokens.forEach((token: any) => {
      if (token.path.includes('font') && 
          token.path.includes('size') && 
          (token.path.includes('fontSize') || token.path.includes('lineHeight'))) {
        
        // Usuń ostatni element (fontSize lub lineHeight) z ścieżki
        const basePath = token.path.slice(0, -1);
        const baseKey = basePath.join('-');
        fontSizeGroups.add(baseKey);
      }
    });
    
    // Generuj klasy dla każdej grupy
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
  }
});

// Analogiczna poprawka dla css/font-classes
StyleDictionary.registerFormat({
  name: 'css/font-classes',
  format: function({ dictionary, options }): string {
    const header = getCssFileHeader(options);
    
    let output = header;
    
    // Znajdź unikalne rozmiary fontów
    const fontSizeGroups = new Set<string>();
    
    dictionary.allTokens.forEach((token: any) => {
      if (token.path.includes('font') && 
          token.path.includes('size') && 
          (token.path.includes('fontSize') || token.path.includes('lineHeight'))) {
        
        const basePath = token.path.slice(0, -1);
        const baseKey = basePath.join('-');
        fontSizeGroups.add(baseKey);
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
  }
});

export default configs;
