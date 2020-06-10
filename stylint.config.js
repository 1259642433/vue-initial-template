module.exports = {
  ignoreFiles: ['src/assets/scss/sprite.scss'],
  extends: ['stylelint-config-standard', 'stylelint-config-prettier'],
  rules: {
    'no-empty-source': null,
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['extend']
      }
    ]
  }
}
