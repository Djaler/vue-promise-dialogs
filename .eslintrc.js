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
};
