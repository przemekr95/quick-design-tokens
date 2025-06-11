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
    
    // Generate margin classes
    output += `${commentPrefix} Margin utility classes${commentSuffix}\n`;
    dictionary.allTokens.forEach((token: any) => {
      if (token.path[0] === 'margin') {
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
    
    // Generate padding classes
    output += `${commentPrefix} Padding utility classes${commentSuffix}\n`;
    dictionary.allTokens.forEach((token: any) => {
      if (token.path[0] === 'padding') {
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
          format: 'css/variables',
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
