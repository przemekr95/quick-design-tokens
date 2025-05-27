import StyleDictionary, { Dictionary } from 'style-dictionary';

// TODO: Dodaj konfigurację dla formatów CJS/ESM:
// - Dodaj format 'javascript/es6' dla ESM
// - Dodaj format 'javascript/cjs' dla CommonJS
// - Dodaj format 'typescript/es6-declarations' dla typów TypeScript
// - Rozważ dodanie custom formatów dla React Native, iOS, Android

interface ProjectConfig {
  name: string;
  source: string[];
  platforms: {
    scss: {
      transformGroup: string;
      buildPath: string;
      files: Array<{
        destination: string;
        format: string;
        options?: {
          showFileHeader?: boolean;
          fileHeader?: string;
        };
      }>;
    };
    css: {
      transformGroup: string;
      buildPath: string;
      files: Array<{
        destination: string;
        format: string;
        options?: {
          showFileHeader?: boolean;
          fileHeader?: string;
        };
      }>;
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
            fileHeader: `Design tokens for ${projectName} project`
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
            fileHeader: `Design tokens for ${projectName} project`
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

// Custom formaty - można rozszerzyć w przyszłości
StyleDictionary.registerFormat({
  name: 'scss/variables-with-map',
  format: function({ dictionary, options }: { dictionary: Dictionary; options?: any }) {
    const header = options?.showFileHeader ? 
      `// ${options.fileHeader || 'Design tokens'}\n// Generated automatically - do not edit\n\n` : '';
    
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
