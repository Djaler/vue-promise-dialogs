/* eslint-disable import/no-extraneous-dependencies */
import replace from '@rollup/plugin-replace';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

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
        tsconfigPaths(),
        replace({
            'Vue.extend': '/*#__PURE__*/ Vue.extend',
        }),
    ],
});
