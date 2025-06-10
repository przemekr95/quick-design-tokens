import StyleDictionary from 'style-dictionary';

// Wspólna logika dla generowania klas fontów
function createFontClassesFormat(type: 'scss' | 'css') {
  const commentPrefix = type === 'scss' ? '//' : '/*';
  const commentSuffix = type === 'css' ? ' */' : '';
  
  return function({ dictionary, options }: any): string {
    const header = options?.showFileHeader && typeof options?.fileHeader === 'function'
      ? options.fileHeader().map((line: string) => `${commentPrefix} ${line}${commentSuffix}`).join('\n') + '\n\n'
      : '';
    
    let output = header;
    const fontSizeGroups = new Set<string>();
    
    // Znajdź wszystkie grupy font-size
    dictionary.allTokens.forEach((token: any) => {
      if (token.path.includes('font') && 
          token.path.includes('size') && 
          (token.path.includes('fontSize') || token.path.includes('lineHeight'))) {
        const basePath = token.path.slice(0, -1);
        fontSizeGroups.add(basePath.join('-'));
      }
    });
    
    // Generuj klasy
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

// Rejestracja formatów
StyleDictionary.registerFormat({
  name: 'scss/font-classes',
  format: createFontClassesFormat('scss')
});

StyleDictionary.registerFormat({
  name: 'css/font-classes',
  format: createFontClassesFormat('css')
});

// Uproszczona konfiguracja projektów
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
          format: 'scss/variables',
          options: { showFileHeader: true, fileHeader: () => getFileHeaderLines(projectName) }
        },
        {
          destination: 'classes.scss',
          format: 'scss/font-classes',
          options: { showFileHeader: true, fileHeader: () => getFileHeaderLines(projectName, 'Font utility classes') }
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
          options: { showFileHeader: true, fileHeader: () => getFileHeaderLines(projectName) }
        },
        {
          destination: 'classes.css',
          format: 'css/font-classes',
          options: { showFileHeader: true, fileHeader: () => getFileHeaderLines(projectName, 'Font utility classes') }
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
  ])
};
