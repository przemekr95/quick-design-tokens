// config/style-dictionary.config.mjs
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
      buildPath: `dist/build/${projectName}/js/`, // Zmiana z build/ na dist/build/
      files: [{ destination: 'tokens.js', format: 'javascript/es6' }],
    },
    dts: {
      transformGroup: 'js',
      buildPath: `dist/build/${projectName}/types/`, // Zmiana z build/ na dist/build/
      files: [
        {
          destination: 'tokens.d.ts',
          format: 'typescript/module-declarations',
        },
      ],
    },
    css: {
      transformGroup: 'css',
      buildPath: `dist/build/${projectName}/css/`, // Zmiana z build/ na dist/build/
      files: [{ destination: 'variables.css', format: 'css/variables' }],
    },
    scss: {
      transformGroup: 'scss',
      buildPath: `dist/build/${projectName}/scss/`, // Zmiana z build/ na dist/build/
      files: [{ destination: '_variables.scss', format: 'scss/variables' }],
    },
  },
});

// Lista projektów
const projects = ['pr-photo', 'pr-dev'];

// Budowanie tokenów dla każdego projektu
for (const project of projects) {
  const config = makeConfig(project);

  // Użycie API StyleDictionary
  const sd = new StyleDictionary(config);

  // Logujemy projekt
  console.log(`🔧 Building tokens for "${project}"...`);

  // Uruchamiamy budowanie wszystkich platform
  await sd.buildAllPlatforms();
}
