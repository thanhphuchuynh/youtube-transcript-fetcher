/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      useESM: true,
    }],
  },
  reporters: [
    'default',
    ['jest-html-reporter', {
      pageTitle: 'Youtube Transcript Fetcher Test Report',
      outputPath: './coverage/test-report.html',
      includeFailureMsg: true,
      includeConsoleLog: true
    }]
  ],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'text', 'text-summary'],
};

export default config;
