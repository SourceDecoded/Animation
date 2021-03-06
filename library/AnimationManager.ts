﻿
(function () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
            || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        (<any>window).requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
}());

export default class AnimationManager {
    private _currentRequestAnimationFrame;
    private _animations;
    private _lastTime;
    private _fps;
    private _refreshRateInMilliseconds;
    private _timer;
    private _requestCallback;

    constructor(timer?) {
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

            } else {
                this._currentRequestAnimationFrame = null;
            }
        } else {
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