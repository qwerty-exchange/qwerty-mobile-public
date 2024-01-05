module.exports = {
  extends: 'universe/native',
  plugins: ['unused-imports', 'eslint-plugin-import'],
  rules: {
    'no-unused-vars': 'off', // or "@typescript-eslint/no-unused-vars": "off",
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
    ],
    'import/order': [
      'error',
      {
        groups: ['index', 'sibling', 'parent', 'internal', 'external', 'builtin', 'object'],
        pathGroups: [
          {
            pattern: 'react**',
            group: 'external',
            position: 'before',
          },
          {
            pattern: '@react**/**',
            group: 'external',
            position: 'before',
          },
          {
            pattern: '@injectivelabs*/**',
            group: 'external',
            position: 'before',
          },
          {
            pattern: '@tanstack*/**',
            group: 'external',
            position: 'before',
          },
          {
            pattern: '@*/**',
            group: 'builtin',
            position: 'before',
          },
          {
            pattern: './**',
            group: 'builtin',
            position: 'before',
          },
        ],
        distinctGroup: true,
        pathGroupsExcludedImportTypes: ['react'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
  // plugins: ['simple-import-sort'],
  // rules: {
  //   'simple-import-sort/imports': [
  //     'error',
  //     {
  //       groups: [['^react'], ['^@injectivelabs'], ['^@?\\w'], ['@/(.*)'], ['^[./]']],
  //     },
  //   ],
  // },
};
