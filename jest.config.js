module.exports = {
  collectCoverage: false,
  collectCoverageFrom: ['src/**/*.{js,jsx}'],
  coverageThreshold: {
    global: {
      branches: 15,
      functions: 15,
      lines: 15,
      statements: 15,
    },
  },
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '^.+\\.(css|scss)$': '<rootDir>/test/__setup__/styleMock.js',
    '^.+\\.(jpe?g|png|gif|ttf|eot|svg|md)$': '<rootDir>/test/__setup__/fileMock.js',
  },
  setupFiles: ['<rootDir>/test/__setup__/setupFiles.js'],
  setupFilesAfterEnv: ['<rootDir>/test/__setup__/setupTests.js'],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    resources: 'usable',
    url: 'http://localhost:3000',
  },
  testRegex: '/test/.*?\\.(test|spec)\\.js$',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  verbose: false,
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
};
