import prettierConfig from 'eslint-config-prettier'
import eslintPluginImport from 'eslint-plugin-import'
import prettierPlugin from 'eslint-plugin-prettier'

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        process: 'readonly',
      },
    },
    plugins: {
      prettier: prettierPlugin,
      import: eslintPluginImport,
    },
    rules: {
      'prettier/prettier': ['error'],
      'arrow-parens': ['error'],
      'prefer-arrow-callback': 'error',
      'no-var': 'error',
      'no-console': 'off',
      'quotes': ['error', 'single'],
      'arrow-body-style': ['error', 'as-needed'],
      ...prettierConfig.rules,
      'import/order': [
        'error',
        {
          'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          'alphabetize': {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
  },
]
