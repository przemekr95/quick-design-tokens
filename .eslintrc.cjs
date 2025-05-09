module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
  ],
  plugins: ['@typescript-eslint', 'react'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    node: true,
  },
  settings: {
    react: {
      version: 'detect', // Automatycznie wykryj wersję React
    },
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'off', // Wyłączenie ostrzeżeń o użyciu 'any'
    '@typescript-eslint/no-inferrable-types': 'off', // Wyłączenie ostrzeżeń o oczywistych typach
  },
  ignorePatterns: ['dist/**/*', 'node_modules/**/*'], // Ignoruj pliki w folderze dist i node_modules
};
