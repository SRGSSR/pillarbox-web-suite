/** @type {import('jest').Config} */
const conf = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  projects: ['<rootDir>/plugins/*'],
  verbose: true
};

export default conf;
