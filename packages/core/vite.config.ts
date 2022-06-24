import replace from '@rollup/plugin-replace';
import { defineConfig, Plugin } from 'vite';

import packageJson from './package.json';

export default defineConfig({
    build: {
        lib: {
            entry: 'src/index.ts',
            formats: ['es', 'cjs'],
            fileName: (format) => {
                switch (format) {
                    case 'es':
                        return 'index.mjs';
                    case 'cjs':
                        return 'index.js';
                    default:
                        throw new Error(`Unexpected format: ${format}`);
                }
            },
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
        }) as Plugin,
    ],
});
