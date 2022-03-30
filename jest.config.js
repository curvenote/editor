module.exports = {
  testMatch: ['**/*.spec.ts', '**/*.yml'],
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/node_modules/', '/.yalc/', '/dist/', 'docs'],
};
