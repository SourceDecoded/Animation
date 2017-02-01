var path = require("path");

var distribution = {
    entry: [
        "./library/main.js"
    ],
    output: {
        filename: 'main.js',
        library: "clarityAnimation",
        libraryTarget: "umd",
        path: './dist'
    }
};

var website = {
    entry: [
        "./library/main.js"
    ],
    output: {
        filename: 'clarity-animation.js',
        library: "clarityAnimation",
        libraryTarget: "umd",
        path: './docs/scripts'
    }
};

module.exports = [
    distribution,
    website    
]