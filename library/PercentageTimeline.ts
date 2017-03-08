import Timeline from "./Timeline";
import Animation from "./Animation";

export default class PercentageTimeline extends Timeline {
    _duration;

    constructor(duration) {
        super();
        this._duration = duration;

        Object.defineProperty(this, "duration", {
            get: () => {
                return this._duration;
            },
            set: (value) => {
                this._duration = value;
                this._calculateAnimations();
            },
            configurable: true
        });
    }

    _calculateAnimations() {
        this.animationItems.forEach((animationItem) => {
            var offset = animationItem.startAt * this._duration;
            var duration = (animationItem.endAt * this._duration) - offset;

            animationItem.offset = offset;
            animationItem.animation.duration = duration;
        });
    }

    add() {
        var self = this;
        var animationItems = Array.prototype.slice.call(arguments, 0);

        animationItems.forEach((animationItem) => {
            if (typeof animationItem.startAt !== "number") {
                throw new Error("animationItem needs to have an startAt percentage property set.");
            }

            if (typeof animationItem.endAt !== "number") {
                throw new Error("animationItem needs to have an endAt percentage property set.");
            }

            if (!(animationItem.animation instanceof Animation)) {
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

            this.animationItems.set(animationItem, animationItem);

            this.cacheDirection();

        });

    }
}


