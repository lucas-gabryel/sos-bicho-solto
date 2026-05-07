module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json'
  },
  plugins: ['@typescript-eslint', 'simple-import-sort', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'next/core-web-vitals',
    'plugin:prettier/recommended'
  ],
  settings: {
    react: { version: 'detect' },
    'import/resolver': {
      typescript: {}
    }
  },
  rules: {
    'prettier/prettier': ['error', { tabWidth: 2, singleQuote: true, trailingComma: 'all', printWidth: 100 }],
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          ["^\\u0000"],
          ["^@?\\w"],
          ["^@/"],
          ["^\\.\\./"],
          ["^\\./"],
          ["^.+\\.(css|scss)$"]
        ]
      }
    ],
    'simple-import-sort/exports': 'error',
    'sort-imports': 'off',
    'import/order': 'off'
  }
};
