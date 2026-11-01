export default {
  extends: ['stylelint-config-standard'],
  ignoreFiles: ['dist/**', 'node_modules/**'],
  rules: {
    'color-function-notation': 'modern',
    'declaration-no-important': true,
    'import-notation': null,
    'max-nesting-depth': 2,
    'no-descending-specificity': true,
    'selector-max-compound-selectors': 3,
    'selector-max-id': 0,
  },
};
