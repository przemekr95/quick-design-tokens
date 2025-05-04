import StyleDictionary from 'style-dictionary';

// Funkcja tworząca konfigurację
const makeConfig = (projectName) => ({
  source: [
    'tokens/global/**/*.json',
    `tokens/projects/${projectName}/**/*.json`,
  ],
  platforms: {
    js: {
      transformGroup: 'js',
      buildPath: `build/${projectName}/js/`,
      files: [{ destination: 'tokens.js', format: 'javascript/es6' }],
    },
    dts: {
      transformGroup: 'js',
      buildPath: `build/${projectName}/types/`,
      files: [
        {
          destination: 'tokens.d.ts',
          format: 'typescript/module-declarations',
        },
      ],
    },
    css: {
      transformGroup: 'css',
      buildPath: `build/${projectName}/css/`,
      files: [{ destination: 'variables.css', format: 'css/variables' }],
    },
    scss: {
      transformGroup: 'scss',
      buildPath: `build/${projectName}/scss/`,
      files: [{ destination: '_variables.scss', format: 'scss/variables' }],
    },
  },
});

// Lista projektów
const projects = ['pr-photo', 'pr-dev'];

// Budowanie tokenów dla każdego projektu
for (const project of projects) {
  const config = makeConfig(project);

  // Użycie nowego API StyleDictionary
  const sd = new StyleDictionary(config);

  // Logujemy projekt
  console.log(`🔧 Building tokens for "${project}"...`);

  // Uruchamiamy budowanie wszystkich platform
  await sd.buildAllPlatforms();
}
