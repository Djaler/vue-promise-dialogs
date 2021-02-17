const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

/**
 * @type {import('@jest/types').Config.InitialOptions}
 */
module.exports = {
    preset: 'ts-jest/presets/js-with-ts',
    collectCoverageFrom: ['src/**'],
    moduleNameMapper: {
        ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
        vue$: require.resolve('vue/dist/vue.common.js'),
    },
    testMatch: [
        '<rootDir>/tests/**/*.spec.ts',
    ],
};
