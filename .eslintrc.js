module.exports = {
  root: true,
  // parserOptions: {
  //   parser: "babel-eslint",
  //   sourceType: 'module',
  //   ecmaVersion: 8
  // },
  parser: "babel-eslint",
  env: {
    browser: true,
    es2017: true
  },
  extends: 'eslint:recommended',
  rules: {
    'no-console': 0,
    'no-debugger': 2,
    semi: 0,
    'handle-callback-err': 0,
    eqeqeq: ['error', 'smart'],
    'one-var': 'off',
    camelcase: 0,
    'no-var': 2,
    'no-empty': 0,
    'no-unused-vars': 0,
    'no-undef': 0,
    'no-func-assign': 0,
    'prefer-destructuring': 0,
    'no-duplicate-imports': 2,
    'brace-style': ['error', 'stroustrup', { allowSingleLine: true }]
  }
};
