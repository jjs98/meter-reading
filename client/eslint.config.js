// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';
import importPlugin from 'eslint-plugin-import';

import { sortAngularComponentImports } from './custom-rules/sort-angular-component-imports.js';

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  ...angular.configs.tsRecommended,

  {
    ignores: ['src/app/api/**'],
  },
  {
    files: ['**/*.ts'],

    processor: angular.processInlineTemplates,

    plugins: {
      import: importPlugin,
      custom: {
        rules: {
          'sort-angular-component-imports': sortAngularComponentImports,
        },
      },
    },
    rules: {
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        { accessibility: 'explicit' },
      ],
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        { allowExpressions: false, allowTypedFunctionExpressions: false },
      ],
      '@typescript-eslint/member-ordering': [
        'error',
        {
          default: [
            'private-static-field',
            'protected-static-field',
            'public-static-field',
            'public-static-method',
            'protected-static-method',
            'private-static-method',
            'private-instance-field',
            'protected-instance-field',
            'public-instance-field',
            'constructor',
            'public-instance-method',
            'protected-instance-method',
            'private-instance-method',
          ],
        },
      ],
      'prefer-const': [
        'error',
        {
          destructuring: 'any',
          ignoreReadBeforeAssign: false,
        },
      ],
      'custom/sort-angular-component-imports': 'error',
    },
  },
  {
    files: ['**/*.html'],
    ...angular.configs.templateRecommended[0],
  },
];
