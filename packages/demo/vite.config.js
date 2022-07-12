import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
    base: '/vue-promise-dialogs/',
    plugins: [
        vue(),
    ],
    optimizeDeps: {
        exclude: [
            'vue-demi',
        ],
    },
});
