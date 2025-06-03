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

// Custom format dla klas SCSS z fontami
StyleDictionary.registerFormat({
  name: 'scss/font-classes',
  format: function({ dictionary, options }): string {
    const header = options?.showFileHeader && options?.fileHeader ? 
      options.fileHeader().map((line: string) => `// ${line}`).join('\n') + '\n\n' : '';
    
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
    const header = options?.showFileHeader && options?.fileHeader ? 
      options.fileHeader().map((line: string) => `/* ${line} */`).join('\n') + '\n\n' : '';
    
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

// Custom formaty - można rozszerzyć w przyszłości  
StyleDictionary.registerFormat({
  name: 'scss/variables-with-map',
  format: function({ dictionary, options }): string {
    const header = options?.showFileHeader && options?.fileHeader ? 
      options.fileHeader().map((line: string) => `// ${line}`).join('\n') + '\n\n' : '';
    
    let output = header;
    
    // Generuj zmienne SCSS
    dictionary.allTokens.forEach((token: any) => {
      output += `$${token.name}: ${token.value};\n`;
    });
    
    output += '\n// Token map for programmatic access\n';
    output += '$tokens: (\n';
    dictionary.allTokens.forEach((token: any) => {
      output += `  '${token.name}': ${token.value},\n`;
    });
    output += ');\n';
    
    return output;
  }
});

export default configs;
