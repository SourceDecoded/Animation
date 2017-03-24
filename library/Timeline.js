var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "./Animation", "./animationStateManager"], function (require, exports, Animation_1, animationStateManager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var orderBy = function (array, expr) {
        return array.sort(function (a, b) {
            var aValue = expr(a);
            var bValue = expr(b);
            if (aValue instanceof Date) {
                aValue = aValue.getTime();
            }
            if (bValue instanceof Date) {
                bValue = bValue.getTime();
            }
            if (typeof aValue === "string") {
                aValue = aValue.toLowerCase();
            }
            if (typeof bValue === "string") {
                bValue = bValue.toLowerCase();
            }
            if (typeof aValue === "number" && isNaN(aValue) && typeof bValue === "number" && isNaN(bValue)) {
                return 0;
            }
            if (aValue === bValue) {
                return 0;
            }
            else if (aValue < bValue) {
                return -1;
            }
            else if (aValue > bValue) {
                return 1;
            }
        });
    };
    var orderByDesc = function (array, expr) {
        return array.sort(function (a, b) {
            var aValue = expr(a);
            var bValue = expr(b);
            if (aValue instanceof Date) {
                aValue = aValue.getTime();
            }
            if (bValue instanceof Date) {
                bValue = bValue.getTime();
            }
            if (typeof aValue === "string") {
                aValue = aValue.toLowerCase();
            }
            if (typeof bValue === "string") {
                bValue = bValue.toLowerCase();
            }
            if (typeof aValue === "number" && isNaN(aValue) && typeof bValue === "number" && isNaN(bValue)) {
                return 0;
            }
            if (aValue === bValue) {
                return 0;
            }
            else if (aValue > bValue) {
                return -1;
            }
            else if (aValue < bValue) {
                return 1;
            }
        });
    };
    var renderByOffset = function (animationItem) {
        return animationItem.offset;
    };
    var renderByOffsetAndDuration = function (animationItem) {
        return animationItem.offset + animationItem.animation.duration;
    };
    var Timeline = (function (_super) {
        __extends(Timeline, _super);
        function Timeline(config) {
            var _this = _super.call(this, config) || this;
            _this.animationItems = new Map();
            _this.iterationCount = 1;
            _this.lastCurrentTime = 0;
            _this._duration = 0;
            Object.defineProperty(_this, "duration", {
                get: function () {
                    return _this._duration;
                },
                set: function (value) {
                    var oldValue = _this._duration;
                    _this.animationItems.forEach(function (animationItem) {
                        var offsetRatio = animationItem.offset / oldValue;
                        var offsetDuration = animationItem.animation.duration / oldValue;
                        animationItem.offset = offsetRatio * value;
                        animationItem.animation.duration = offsetDuration * value;
                    });
                    _this._duration = value;
                },
                configurable: true
            });
            return _this;
        }
        Timeline.prototype.calculateDuration = function () {
            return Array.from(this.animationItems.values()).reduce(function (duration, animationItem) {
                var animationTotalDuration = animationItem.offset + animationItem.animation.duration;
                if (animationTotalDuration > duration) {
                    return animationTotalDuration;
                }
                return duration;
            }, 0);
        };
        Timeline.prototype.cacheDirection = function () {
            this.forwardArrayAnimations = Array.from(this.animationItems.values());
            this.reverseArrayAnimations = this.forwardArrayAnimations.slice(0);
            orderBy(this.forwardArrayAnimations, renderByOffset);
            orderByDesc(this.reverseArrayAnimations, renderByOffsetAndDuration);
        };
        Timeline.prototype.add = function () {
            var allAnimationItems = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                allAnimationItems[_i] = arguments[_i];
            }
            var animationItems = Array.prototype.slice.call(arguments, 0);
            var self = this;
            animationItems.forEach(function (animationItem) {
                if (typeof animationItem.offset !== "number") {
                    throw new Error("animationItem needs to have an offset property set.");
                }
                if (!(animationItem.animation instanceof Animation_1.default)) {
                    throw new Error("animationItem needs to have an animation property set thats an instanceof Animation.");
                }
                self.animationItems.set(animationItem, animationItem);
            });
            this._duration = this.calculateDuration();
            this.cacheDirection();
        };
        Timeline.prototype.remove = function (animationItem) {
            this.animationItems.delete(animationItem);
            this.forwardArrayAnimations = Array.from(this.animationItems.values());
            this.reverseArrayAnimations = this.forwardArrayAnimations.slice(0);
            orderBy(this.forwardArrayAnimations, renderByOffset);
            orderByDesc(this.reverseArrayAnimations, renderByOffsetAndDuration);
        };
        Timeline.prototype.render = function () {
            var progress = this.progress;
            var timelineDuration = this._duration;
            var currentTime = progress * timelineDuration;
            var timeScale = this.timeScale;
            var now = Date.now();
            var currentState = this.currentState;
            var animationItems;
            if (this.currentState === animationStateManager_1.default.reverseState ||
                this.currentState === animationStateManager_1.default.reversePausedState) {
                animationItems = this.reverseArrayAnimations;
            }
            else {
                animationItems = this.forwardArrayAnimations;
            }
            animationItems.forEach(function (animationItem) {
                var duration = animationItem.animation.duration;
                var offset = animationItem.offset;
                var animation = animationItem.animation;
                if (currentState === animationStateManager_1.default.reverseState) {
                    animation.currentState = animationStateManager_1.default.reversePausedState;
                }
                else {
                    animation.currentState = animationStateManager_1.default.forwardPausedState;
                }
                animation.setTimeScale(timeScale);
                if (currentTime >= offset && currentTime <= offset + duration) {
                    var difference = currentTime - offset;
                    var animationProgress = difference / duration;
                    animation.seek(animationProgress, now);
                }
                if (currentTime > offset + duration && animation.progress !== 1) {
                    if (animation.progress < 1) {
                        animation.seek(1);
                        animation.stop();
                    }
                    else {
                        animation.stop();
                        animation.seek(1);
                    }
                }
                if (currentTime < offset && animation.progress !== 0) {
                    if (animation.progress > 0) {
                        animation.seek(0);
                        animation.stop();
                    }
                    else {
                        animation.stop();
                        animation.seek(0);
                    }
                }
            });
            return this;
        };
        return Timeline;
    }(Animation_1.default));
    exports.default = Timeline;
});
//# sourceMappingURL=Timeline.js.map