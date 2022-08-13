module.exports = {
  env: {
    es2021: true,
    node: true,
    mocha: true
  },
  extends: ['standard', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'no-use-before-define': 0,
    'no-useless-constructor': 0
  }
}
