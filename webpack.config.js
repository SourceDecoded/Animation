var path = require("path");

module.exports = {
    entry: [
        "./library/main.js"
    ],
    output: {
        filename: 'main.js',
        library: "clarityAnimation",
        libraryTarget: "umd",
        path: './dist'
    }
}