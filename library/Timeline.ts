import Animation from "./Animation";
import animationStateManager from "./animationStateManager";

interface AnimationItem {
    offset: number;
    duration: number;
    animation: Animation;
    startAt: number;
    endAt: number;
}

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
        } else if (aValue < bValue) {
            return -1;
        } else if (aValue > bValue) {
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
        } else if (aValue > bValue) {
            return -1;
        } else if (aValue < bValue) {
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

export default class Timeline extends Animation {
    animationItems: Map<AnimationItem, AnimationItem>;
    iterationCount;
    lastCurrentTime;
    forwardArrayAnimations;
    reverseArrayAnimations;
    _duration;

    constructor(config?) {
        super(config);
        this.animationItems = new Map<AnimationItem, AnimationItem>();
        this.iterationCount = 1;
        this.lastCurrentTime = 0;

        this._duration = 0;

        Object.defineProperty(this, "duration", {
            get: () => {
                return this._duration;
            },
            set: (value) => {
                var oldValue = this._duration;

                this.animationItems.forEach((animationItem) => {
                    var offsetRatio = animationItem.offset / oldValue;
                    var offsetDuration = animationItem.animation.duration;

                    animationItem.offset = offsetRatio * value;
                    animationItem.animation.duration = offsetDuration * value;
                });

                this._duration = value;
            }
        });
    }

    calculateDuration() {
        return Array.from(this.animationItems.values()).reduce(function (duration, animationItem) {
            var animationTotalDuration = animationItem.offset + animationItem.animation.duration;
            if (animationTotalDuration > duration) {
                return animationTotalDuration;
            }
            return duration;
        }, 0);
    }

    add(...allAnimationItems) {
        var animationItems = Array.prototype.slice.call(arguments, 0);
        var self = this;

        animationItems.forEach(function (animationItem) {
            if (typeof animationItem.offset !== "number") {
                throw new Error("animationItem needs to have an offset property set.");
            }

            if (!(animationItem.animation instanceof Animation)) {
                throw new Error("animationItem needs to have an animation property set thats an instanceof Animation.");
            }

            self.animationItems.set(animationItem, animationItem);
        });

        this._duration = this.calculateDuration();

        this.forwardArrayAnimations = Array.from(this.animationItems.values());
        this.reverseArrayAnimations = this.forwardArrayAnimations.slice(0);

        orderBy(this.forwardArrayAnimations, renderByOffset);
        orderByDesc(this.reverseArrayAnimations, renderByOffsetAndDuration);
    }

    remove(animationItem) {
        this.animationItems.delete(animationItem);
        this.forwardArrayAnimations = Array.from(this.animationItems.values());
        this.reverseArrayAnimations = this.forwardArrayAnimations.slice(0);

        orderBy(this.forwardArrayAnimations, renderByOffset);
        orderByDesc(this.reverseArrayAnimations, renderByOffsetAndDuration);
    }

    render() {
        var progress = this.progress;
        var timelineDuration = this._duration;
        var currentTime = progress * timelineDuration;
        var timeScale = this.timeScale;
        var now = Date.now();
        var currentState = this.currentState;
        var animationItems;

        if (this.currentState === animationStateManager.reverseState ||
            this.currentState === animationStateManager.reversePausedState) {
            animationItems = this.reverseArrayAnimations;
        } else {
            animationItems = this.forwardArrayAnimations;
        }

        animationItems.forEach(function (animationItem) {
            var duration = animationItem.animation.duration;
            var offset = animationItem.offset;
            var animation = animationItem.animation;

            if (currentState === animationStateManager.reverseState) {
                animation.currentState = animationStateManager.reversePausedState;
            } else {
                animation.currentState = animationStateManager.forwardPausedState;
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
                } else {
                    animation.stop();
                    animation.seek(1);
                }
            }

            if (currentTime < offset && animation.progress !== 0) {
                if (animation.progress > 0) {
                    animation.seek(0);
                    animation.stop();
                } else {
                    animation.stop();
                    animation.seek(0);
                }
            }

        });

        return this;
    }
}
