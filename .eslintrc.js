module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: ['plugin:react/recommended', 'standard-with-typescript', 'prettier'],
  rules: {
    'object-curly-spacing': ['error', 'always'],
    '@typescript-eslint/dot-notation': 'error',
    'react/react-in-jsx-scope': 'off',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['react', '@typescript-eslint'],
};
