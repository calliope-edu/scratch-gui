const path = require('path');
module.exports = {
    root: true,
    extends: [
        'scratch',
        'scratch/es6',
        'scratch/react',
        'plugin:import/errors'
    ],
    env: {
        browser: true
    },
    globals: {
        process: true
    },
    rules: {
        'operator-linebreak': 'off',
        'space-before-function-paren': 'off',
        'import/no-mutable-exports': 'error',
        'import/no-commonjs': 'error',
        'import/no-amd': 'error',
        'import/no-nodejs-modules': 'error',
        'react/jsx-no-literals': 'error',
        'react/jsx-max-props-per-line': 'off',
        'no-confusing-arrow': [
            'error',
            {
                allowParens: true
            }
        ]
    },
    settings: {
        'react': {
            version: '16.2' // Prevent 16.3 lifecycle method errors
        },
        'import/resolver': {
            webpack: {
                config: path.resolve(__dirname, '../webpack.config.js')
            }
        }
    }
};
