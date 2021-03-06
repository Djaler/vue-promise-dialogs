module.exports = {
    root: true,
    extends: ['@djaler/typescript'],
    parserOptions: {
        project: './tsconfig.lint.json',
    },
    settings: {
        'import/resolver': {
            typescript: {},
        },
    },
    rules: {
        'import/no-extraneous-dependencies': ['error', {
            devDependencies: [
                'tests/**',
                'jest.config.js',
                'vite.config.ts',
            ],
        }],
    },
};
