module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
        es6: true
    },
    extends: [
        'plugin:vue/essential',
        'eslint:recommended'
    ],
    plugins: [
        'html',
        'vue'
    ],
    rules: {
        'no-console': 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-unused-vars': 'off',
        'semi':['error','always'],
        'indent': ['error', 4]
    },
    parserOptions: {
        parser: 'babel-eslint'
    },
    globals: {
        _hmt: 0
    }
}
  