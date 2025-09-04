module.exports = {
  ignorePatterns: [
    'tmp.js',
    'node_modules/',
    'config/',
    'build/',
    'scripts/',
    'public/',
    'docs/',
  ],
  env: {
    node: false,
    browser: true,
    commonjs: true,
    es6: true,
  },
  extends: [
    'plugin:react/recommended',
    'google',
  ],
  rules: {
    'react/display-name': ['off', {

    }],
    'react/prop-types': ['off', {
      ignore: 'ignore',
      customValidators: 'customValidator',
    }],
    'operator-linebreak': ['error', 'before'],
    'require-jsdoc': ['error', {
      require: {
        FunctionDeclaration: false,
        MethodDefinition: false,
        ClassDeclaration: false,
        ArrowFunctionExpression: false,
        FunctionExpression: false,
      },
    }],
    'valid-jsdoc': ['error', {
      requireParamDescription: false,
      requireParamType: false,
      requireReturnDescription: false,
      requireReturnType: false,
      requireReturn: false,
    }],
    'max-len': ['error', {code: 120}],
    'camelcase': ['error', {properties: 'never'}],
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
};
