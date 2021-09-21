const packages = require('./package.json');
const schemaVersion = packages.devDependencies['@curvenote/schema'];
const isValid = !schemaVersion.startsWith('file');
if (!isValid) {
  console.log(
    '[Commit Error] comitting invalid yalc schema version. Please fix it and commit again.',
  );
  process.exit(1);
}
