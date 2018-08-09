module.exports = {
  name: 'netlify-cms-widget-components',
  testURL: 'http://localhost',
  verbose: true,
  // globalSetup: '<rootDir>/test/setup-global.js',
  setupFiles: [
    '<rootDir>/test/setup-test.js',
    'jest-prop-type-error',
  ],
  setupTestFrameworkScriptFile: '<rootDir>test/setup-framework.js',
  testPathIgnorePatterns: [
    '.cache',
    'environment',
  ],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/test/assetsTransformer.js',
    '\\.(css|less)$': '<rootDir>/test/assetsTransformer.js',
  },
  // unmockedModulePathPatterns: [
  //   'node_modules/react/',
  //   'node_modules/enzyme/',
  // ],
}
