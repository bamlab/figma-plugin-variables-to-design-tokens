// @ts-check
const packagesToTransform = [
    // Believe it or not there are two packages, rgb-hex and hex-rgb
    'rgb-hex',
    'hex-rgb',
    '@create-figma-plugin(.*)',
  ];
  
  /** @type {import('@jest/types').Config.InitialOptions} */
  const config = {
    setupFiles: ['./src/testing/jest-setup.ts'],
    setupFilesAfterEnv: ['./src/testing/jest-setupAfterEnv.ts'],
    clearMocks: true,
    // module resolution
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    // moduleNameMapper: {
    //   'src/(.*)': '<rootDir>/src/$1',
    // },
    testRegex: '\\.test\\.[jt]sx?$',
    transformIgnorePatterns: [`node_modules/(?!(${packagesToTransform.join('|')})/)`],
    cacheDirectory: '.cache/jest',
  };
  
  module.exports = config;
  