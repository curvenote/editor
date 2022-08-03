module.exports = {
  root: true,
  extends: ['curvenote'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    project: ['./tsconfig.base.json'],
    tsconfigRootDir: __dirname,
  },
};
