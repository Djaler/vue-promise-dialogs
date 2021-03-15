/**
 * @type {import('@stryker-mutator/api/src-generated/stryker-core').StrykerOptions}
 */
module.exports = {
    plugins: ['@stryker-mutator/jest-runner'],
    testRunner: 'jest',
    coverageAnalysis: 'perTest',
    tempDirName: 'stryker-tmp',
    disableTypeChecks: '{src,tests}/**/*.{j,t}s',
};
