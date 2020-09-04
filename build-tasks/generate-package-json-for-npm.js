/**
 * Creates a package.json file for the npm module
 */

const { readJSON, writeFile } = require('./common/files');

const basePackageJson = readJSON('package.json');
delete basePackageJson.devDependencies;
delete basePackageJson.scripts;

writeFile('dist/build/package.json', JSON.stringify(basePackageJson, undefined, 4));
