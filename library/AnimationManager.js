import requestAnimationFrame from "./requestAnimationFrame";
export default class AnimationManager {
    constructor(timer) {
        this._currentRequestAnimationFrame = null;
        this._animations = [];
        this._lastTime = 0;
        this._fps = 100;
        this._refreshRateInMilliseconds = 1000 / this._fps;
        this._timer = timer || Date;
        this._requestCallback = function (time) {
            this.tick(this._timer.now());
        };
        this._requestCallback = this._requestCallback.bind(this);
        this.setFramesPerSecond(this._fps);
    }
    setFramesPerSecond(fps) {
        this._fps = fps;
        this._refreshRateInMilliseconds = 1000 / fps;
    }
    getFramesPerSecond() {
        return this._fps;
    }
    checkRequestToStartOrStop() {
        var animations = this._animations;
        if (this._currentRequestAnimationFrame === null && animations.length > 0) {
            this._currentRequestAnimationFrame = requestAnimationFrame(this._requestCallback);
        }
    }
    tick(time) {
        var x;
        var animation;
        var animationsCopy;
        var animations = this._animations;
        var length = animations.length;
        var elapsedTime = time - this._lastTime;
        // Throttle this to be the specified frames per second.
        if (elapsedTime >= this._refreshRateInMilliseconds) {
            this._lastTime = time;
            if (length > 0) {
                animationsCopy = animations.slice(0);
                animationsCopy.forEach((animation) => {
                    animation.tick(time);
                });
                this._currentRequestAnimationFrame = requestAnimationFrame(this._requestCallback);
            }
            else {
                this._currentRequestAnimationFrame = null;
            }
        }
        else {
            this._currentRequestAnimationFrame = requestAnimationFrame(this._requestCallback);
        }
    }
    now() {
        return this._timer.now();
    }
    register(animation) {
        var index = this._animations.indexOf(animation);
        if (index === -1) {
            this._animations.push(animation);
            this.checkRequestToStartOrStop();
        }
    }
    unregister(animation) {
        var index = this._animations.indexOf(animation);
        if (index >= 0) {
            this._animations.splice(index, 1);
        }
    }
}
//# sourceMappingURL=AnimationManager.js.map