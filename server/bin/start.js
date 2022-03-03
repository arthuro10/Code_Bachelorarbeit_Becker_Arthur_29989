// Transpile all code following this line with babel and use 'env' (aka ES6) preset.
require('babel-register')({
    presets: ['env', 'react-app'],
    plugins: ['react-html-attrs', 'transform-decorators-legacy', 'transform-class-properties'],
    ignore: function(filepath) {
        return /(node_modules)/.test(filepath) || /(dist)/.test(filepath) || /(images)/.test(filepath);
    },

});

// Import the rest of our application.
module.exports = require('./www');