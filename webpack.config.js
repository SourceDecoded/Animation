var path = require("path");

module.exports = {
    entry: [
        "babel-polyfill",
        "./main.js"
    ],
    output: {
        filename: 'index.js',
        path: './'
    },
    loaders: [{
        loader: "babel-loader",
        include: [path.resolve(__dirname, "library")],
        test: /\.js$/,
        query: {
            presets: ["env"]
        }
    }]
}