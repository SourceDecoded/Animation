define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    (function () {
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
                || window[vendors[x] + 'CancelRequestAnimationFrame'];
        }
        if (!window.requestAnimationFrame)
            window.requestAnimationFrame = function (callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function () { callback(currTime + timeToCall); }, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        if (!window.cancelAnimationFrame)
            window.cancelAnimationFrame = function (id) {
                clearTimeout(id);
            };
    }());
    var AnimationManager = (function () {
        function AnimationManager(timer) {
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
        AnimationManager.prototype.setFramesPerSecond = function (fps) {
            this._fps = fps;
            this._refreshRateInMilliseconds = 1000 / fps;
        };
        AnimationManager.prototype.getFramesPerSecond = function () {
            return this._fps;
        };
        AnimationManager.prototype.checkRequestToStartOrStop = function () {
            var animations = this._animations;
            if (this._currentRequestAnimationFrame === null && animations.length > 0) {
                this._currentRequestAnimationFrame = requestAnimationFrame(this._requestCallback);
            }
        };
        AnimationManager.prototype.tick = function (time) {
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
                    animationsCopy.forEach(function (animation) {
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
        };
        AnimationManager.prototype.now = function () {
            return this._timer.now();
        };
        AnimationManager.prototype.register = function (animation) {
            var index = this._animations.indexOf(animation);
            if (index === -1) {
                this._animations.push(animation);
                this.checkRequestToStartOrStop();
            }
        };
        AnimationManager.prototype.unregister = function (animation) {
            var index = this._animations.indexOf(animation);
            if (index >= 0) {
                this._animations.splice(index, 1);
            }
        };
        return AnimationManager;
    }());
    exports.default = AnimationManager;
});
//# sourceMappingURL=AnimationManager.js.map