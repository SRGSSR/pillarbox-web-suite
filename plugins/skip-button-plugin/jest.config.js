/** @type {import('jest').Config} */
const conf = {
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    userAgent: 'Mozilla/5.0 (linux) AppleWebKit/537.36 (KHTML, like Gecko) jsdom/11.12.0',
  }
};

export default conf;
