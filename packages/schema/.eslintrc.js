module.exports = {
  root: true,
  extends: ['curvenote'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    project: ['./src/tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
};
