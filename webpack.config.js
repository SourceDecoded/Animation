var path = require("path");

module.exports = {
    entry: [
        "./main.js"
    ],
    output: {
        filename: 'main.js',
        library: "clarity-animation",
        libraryTarget: "umd",
        path: './dist'
    }
}