/* eslint-disable import/no-extraneous-dependencies */
import replace from '@rollup/plugin-replace';
import tsPathsResolve from 'rollup-plugin-ts-paths-resolve';
import { defineConfig } from 'vite';

import packageJson from './package.json';

export default defineConfig({
    build: {
        lib: {
            entry: 'src/index.ts',
            name: 'vuePromiseDialogs',
        },
        rollupOptions: {
            external: Object.keys(packageJson.peerDependencies),
        },
        target: 'es6',
        minify: false,
    },
    plugins: [
        tsPathsResolve(),
        replace({
            'Vue.extend': '/*#__PURE__*/ Vue.extend',
        }),
    ],
});
