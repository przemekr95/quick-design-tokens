import StyleDictionary from 'style-dictionary';

const makeConfig = (projectName) => ({
  source: [
    'tokens/global/**/*.json',
    `tokens/projects/${projectName}/**/*.json`,
  ],
  platforms: {
    js: {
      transformGroup: 'js',
      buildPath: `dist/build/${projectName}/js/`,
      files: [{ destination: 'tokens.js', format: 'javascript/es6' }],
    },
    dts: {
      transformGroup: 'js',
      buildPath: `dist/build/${projectName}/types/`,
      files: [
        {
          destination: 'tokens.d.ts',
          format: 'typescript/module-declarations',
        },
      ],
    },
    css: {
      transformGroup: 'css',
      buildPath: `dist/build/${projectName}/css/`,
      files: [{ destination: 'variables.css', format: 'css/variables' }],
    },
    scss: {
      transformGroup: 'scss',
      buildPath: `dist/build/${projectName}/scss/`,
      files: [{ destination: '_variables.scss', format: 'scss/variables' }],
    },
  },
});

const projects = ['pr-photo', 'pr-dev'];

for (const project of projects) {
  const config = makeConfig(project);

  const sd = new StyleDictionary(config);

  console.log(`🔧 Building tokens for "${project}"...`);

  await sd.buildAllPlatforms();
}
