"use strict";
const Timeline_1 = require("./Timeline");
const Animation_1 = require("./Animation");
class PercentageTimeline extends Timeline_1.default {
    constructor(duration) {
        super();
        this.duration = duration;
    }
    _calculateAnimations() {
        var self = this;
        self.animationItems.forEach(function (animationItem) {
            var offset = animationItem.startAt * self.duration;
            var duration = (animationItem.endAt * self.duration) - offset;
            animationItem.offset = offset;
            animationItem.animation.duration = duration;
        });
    }
    add() {
        var self = this;
        var animationItems = Array.prototype.slice.call(arguments, 0);
        animationItems.forEach(function (animationItem) {
            if (typeof animationItem.startAt !== "number") {
                throw new Error("animationItem needs to have an startAt percentage property set.");
            }
            if (typeof animationItem.endAt !== "number") {
                throw new Error("animationItem needs to have an endAt percentage property set.");
            }
            if (!(animationItem.animation instanceof Animation_1.default)) {
                throw new Error("animationItem needs to have an animation property set thats an instanceof Animation.");
            }
            if ((animationItem.startAt < 0 && animationItem.startAt > 1) || (animationItem.endAt < 0 && animationItem.endAt > 1)) {
                throw new Error("startAt and endAt need to be within 0-1.");
            }
            if (animationItem.startAt > animationItem.endAt) {
                throw new Error("endAt needs to be greater than startAt.");
            }
            self.animationItems.set(animationItem, animationItem);
            self._calculateAnimations();
            if (animationItem.animation instanceof Timeline_1.default) {
                animationItem.animation._calculateAnimations();
            }
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PercentageTimeline;
//# sourceMappingURL=PercentageTimeline.js.map