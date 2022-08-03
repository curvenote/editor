module.exports = {
  testMatch: ['**/*.spec.ts', '**/*.yml'],
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      tsconfig: './src/tsconfig.json',
    },
  },
};
