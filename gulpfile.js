var gulp = require("gulp");
var exec = require("child_process").exec;
var jsdoc = require("gulp-jsdoc3");
var uglify = require("gulp-uglify");

gulp.task("typescript", function (callback) {
    exec("tsc", function (err) {
        if (err != null) {
            callback(err);
            return;
        }
        callback();
    });
});

gulp.task("webpack", ["typescript"], function (callback) {
    exec("webpack", function (err) {
        if (err != null) {
            callback(err);
            return;
        }
        callback();
    });
});

gulp.task("jsdoc", ["webpack"], function (callback) {
    gulp.src(["./README.md", "./library/**/*.js"], { read: false }).pipe(jsdoc(callback));
});

gulp.task("minify", ["webpack"], function () {
    gulp.src("./dist/main.js").pipe(uglify()).pipe(gulp.dest("./dist/"));
});

gulp.task("default", ["webpack", "typescript", "jsdoc", "minify"]);