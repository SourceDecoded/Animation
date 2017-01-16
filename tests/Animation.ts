import { Animation } from "./../main";
import assert = require("assert");

var tests = <any>exports;

tests["Animation: Number."] = function () {
    var animation = new Animation({
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
