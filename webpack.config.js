var path = require("path");

var distribution = {
    entry: [
        "./library/main.js"
    ],
    output: {
        filename: 'main.js',
        library: "clarityAnimation",
        libraryTarget: "umd",
        path: path.resolve(__dirname, 'dist')
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
        path: path.resolve('docs/scripts')
    }
};

module.exports = [
    distribution,
    website
]