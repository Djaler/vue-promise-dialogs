import replace from '@rollup/plugin-replace';
import { resolve } from 'path';
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
        replace({
            'Vue.extend': '/*#__PURE__*/ Vue.extend',
        }),
    ],
    resolve: {
        alias: [
            {
                find: /^@\/(.*)/,
                replacement: `${resolve(__dirname, 'src')}/$1`,
            },
        ],
    },
});
