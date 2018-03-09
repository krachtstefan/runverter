module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  extends: 'eslint:recommended',
  env: {
    browser: true
  },
  rules: {
  },
  globals: {
    "require" : true,
    "BigNumber" : true,
    "Decimal" : true,
    "ga" : true
  }
};
