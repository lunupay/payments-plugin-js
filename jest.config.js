
module.exports = {
  // preset: "jest-puppeteer",
  transformIgnorePatterns: [
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  testPathIgnorePatterns: [
    '/dist/',
    '/build/',
    '/config/',
    '/build-scripts/',
    '/public/',
    '/coverage',
    '/node_modules/',
  ],
  testEnvironment: 'jest-environment-jsdom-fourteen',
  testRegex: '.*\\.(spec|test)\\.[jt]sx?$',
  setupFiles: [
    'react-app-polyfill/jsdom',
  ],
  moduleFileExtensions: [
    'web.js',
    'js',
    'web.ts',
    'ts',
    'web.tsx',
    'tsx',
    'json',
    'web.jsx',
    'jsx',
    'node',
  ],
  moduleNameMapper: {
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    'app/(.*)': '<rootDir>/src/$1',
  },
};
