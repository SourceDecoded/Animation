var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./Timeline", "./Animation"], function (require, exports, Timeline_1, Animation_1) {
    "use strict";
    var PercentageTimeline = (function (_super) {
        __extends(PercentageTimeline, _super);
        function PercentageTimeline(duration) {
            var _this = _super.call(this) || this;
            _this._duration = duration;
            Object.defineProperty(_this, "duration", {
                get: function () {
                    return _this._duration;
                },
                set: function (value) {
                    _this._duration = value;
                    _this._calculateAnimations();
                },
                configurable: true
            });
            return _this;
        }
        PercentageTimeline.prototype._calculateAnimations = function () {
            var _this = this;
            this.animationItems.forEach(function (animationItem) {
                var offset = animationItem.startAt * _this._duration;
                var duration = (animationItem.endAt * _this._duration) - offset;
                animationItem.offset = offset;
                animationItem.animation.duration = duration;
            });
        };
        PercentageTimeline.prototype.add = function () {
            var _this = this;
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
                var offset = animationItem.startAt * self._duration;
                var duration = (animationItem.endAt * self._duration) - offset;
                animationItem.offset = offset;
                animationItem.animation.duration = duration;
                _this.animationItems.set(animationItem, animationItem);
                _this.cacheDirection();
            });
        };
        return PercentageTimeline;
    }(Timeline_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = PercentageTimeline;
});
//# sourceMappingURL=PercentageTimeline.js.map