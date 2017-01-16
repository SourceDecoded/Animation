"use strict";
const main_1 = require("./../main");
const assert = require("assert");
var tests = exports;
tests["Animation: Number."] = function () {
    var animation = new main_1.Animation({
        target: {
            number: 0
        },
        properties: {
            number: {
                from: 0,
                to: 100
            }
        },
        duration: 100
    });
    animation.playToEndAsync().then(() => {
        assert.ok(true);
    }).catch(() => {
        assert.ok(false, "Unknown error.");
    });
};
//# sourceMappingURL=Animation.js.map