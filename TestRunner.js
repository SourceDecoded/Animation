var fs = require("fs");
var path = require("path");

fs.readdir("tests", function (err, files) {
    if (err == null) {

        files.forEach((file) => {
            if (path.extname(file) === ".js") {
                var tests = require(path.resolve(__dirname, "tests", file));
                Object.keys(tests).forEach(function (testName) {
                    try {
                        tests[testName]();
                    } catch (error) {
                        console.log(error);
                    }
                });
            }
        });
    }
});