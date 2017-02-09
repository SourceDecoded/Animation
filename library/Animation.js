define(["require", "exports", "./animationStateManager", "./AnimationManager", "./easings"], function (require, exports, animationStateManager_1, AnimationManager_1, easings_1) {
    "use strict";
    var delayAsync = function (milliseconds) {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, milliseconds);
        });
    };
    var makeTickPercentageObservers = function (observers) {
        for (var x = 0; x <= 100; x++) {
            observers[x] = [];
        }
    };
    var returnObserver = function (observer) {
        return observer;
    };
    var animationManager = new AnimationManager_1.default();
    /**Stateful Observer */
    class Observer {
        /**
         * Creates an Observer.
         * @param {function} callback - The function that is invoked when the observer is notified.
         * @param {function} unbind - The function that is called when the observer is disposed.
         */
        constructor(callback, unbind) {
            this._callback = callback;
            this._isStopped = false;
            this._isDisposed = false;
            this._unbind = unbind || function () { };
        }
        /**
         * Stops the observing.
         */
        stop() {
            this._isStopped = true;
        }
        /**
         * Starts the observing;
         */
        start() {
            this._isStopped = false;
        }
        /**
         * Notifies the callback with this event.
         * @param {event} event - Emitted event.
         */
        callback(event) {
            if (!this._isStopped && !this._isDisposed) {
                this._callback(event);
            }
        }
        /**
         * Disposes the observer.
         */
        dispose() {
            return this._unbind();
        }
    }
    /**Class to manage an animation.*/
    class Animation {
        /**
         * Creates an animation.
         * #### Possible Configuration
         * - easing : string
         * - duration : number (milliseconds)
         * - target : object
         * - properties : object
         * @param {config} config - Configuration of the animation.
         */
        constructor(config) {
            config = config || {};
            this.target = config.target || {};
            this.currentTime = 0;
            this.timeScale = 1;
            this.duration = config.duration || 0.0001; // This is virtually zero.
            this.progress = 0;
            this.properties = config.properties || {};
            this.beginningValues = {};
            this.startTime = 0;
            this.currentRequestAnimationFrameId = null;
            this.currentState = animationStateManager_1.default.stoppedState;
            this.animationManager = animationManager;
            this.iterations = 0;
            this.repeat = 1;
            this.repeatDirection = 0;
            this.observers = {
                play: [],
                stop: [],
                pause: [],
                restart: [],
                reverse: [],
                seek: [],
                tick: [],
                end: [],
                start: []
            };
            makeTickPercentageObservers(this.observers);
            if (typeof config.easing === "string") {
                this.easingFunction = easings_1.default[config.easing];
            }
            else if (typeof config.easing === "function") {
                this.easingFunction = config.easing;
            }
            else {
                this.easingFunction = easings_1.default.linear;
            }
        }
        _saveBeginningValues() {
            var target = this.target;
            var beginningValues = this.beginningValues;
            var properties = this.properties;
            Object.keys(properties).forEach(function (property) {
                beginningValues[property] = target[property];
            });
        }
        /**
         * Plays the animation forward.
         * @returns {Animation}
         */
        play() {
            return this.currentState.play(this);
        }
        /**
         * Stops the animation.
         * @returns {Animation}
         */
        stop() {
            this.currentState.stop(this);
            return this;
        }
        /**
         * Allows observing on a particular percentage ratio tick.
         * @param {number} ratio - The ratio of completeness between 0-1.
         * @param {function} callback - The function notified at the given ratio.
         * @returns {Observer}
         */
        observeAtTick(ratio, callback) {
            var percentage = ratio * 100;
            if (typeof percentage === "number" && percentage >= 0 && percentage <= 100) {
                percentage = parseInt(percentage);
                return this.observe(percentage.toString(), callback);
            }
            throw new Error("Invalid Argument Exception: percentage must be a decimal, and with in 0-1");
        }
        /**
         * Play the animation to the end.
         * @param {number} [startAt] - What ratio of completeness to start at. (0-1)
         * @returns {Promise}
         */
        playToEndAsync(startAt) {
            if (typeof startAt === "number" && startAt >= 0 && startAt <= 1) {
                this.progress = startAt;
            }
            return this.playToPercentageAsync(100);
        }
        /**
         * Play to the given percentage.
         * @param {number} percentage - The percentage to play to.
         * @returns {Promise}
         */
        playToPercentageAsync(percentage) {
            var self = this;
            var ratio = percentage / 100;
            percentage = parseInt(percentage, 10);
            if (ratio < this.progress) {
                throw new Error("Cannot play to a point less than the current progress.");
            }
            if (typeof percentage !== "number" || percentage < 0 || percentage > 100) {
                throw new Error("Expected fraction to be a number within range (0-100).");
            }
            return new Promise((resolve, reject) => {
                self.stop();
                var disposeAllObservers = function () {
                    reverseObserver.dispose();
                    endObserver.dispose();
                    stopObserver.dispose();
                    self.seek(self.progress).render();
                };
                var endObserver = self.observeAtTick(ratio, function () {
                    disposeAllObservers();
                    self.stop();
                    resolve();
                });
                var stopObserver = self.observe("stop", function (event) {
                    disposeAllObservers();
                });
                var reverseObserver = self.observe("reverse", function (event) {
                    disposeAllObservers();
                });
                self.play();
            }).then(function () {
                return delayAsync(0);
            });
        }
        reverseToStartAsync(startAt) {
            if (typeof startAt === "number" && startAt >= 0 && startAt <= 1) {
                this.progress = startAt;
            }
            return this.reverseToPercentageAsync(0);
        }
        reverseToPercentageAsync(percentage) {
            var self = this;
            var ratio = percentage / 100;
            percentage = parseInt(percentage, 10);
            if (ratio > this.progress) {
                throw new Error("Cannot reverse to a point greater than the current progress.");
            }
            if (typeof percentage !== "number" || percentage < 0 || percentage > 100) {
                throw new Error("Expected fraction to be a number within range (0-100).");
            }
            return new Promise(function (setValue, setError) {
                self.stop();
                var disposeAllObservers = function () {
                    playObserver.dispose();
                    endObserver.dispose();
                    stopObserver.dispose();
                    self.seek(self.progress).render();
                };
                var endObserver = self.observeAtTick(ratio, function () {
                    disposeAllObservers();
                    self.stop();
                    setValue();
                });
                var stopObserver = self.observe("stop", function (event) {
                    disposeAllObservers();
                });
                var playObserver = self.observe("play", function (event) {
                    disposeAllObservers();
                });
                self.reverse();
            }).then(function () {
                return delayAsync(0);
            });
        }
        pause() {
            return this.currentState.pause(this);
        }
        restart() {
            return this.currentState.restart(this);
        }
        reverse() {
            return this.currentState.reverse(this);
        }
        notify(event) {
            var type = event.type;
            if (Array.isArray(this.observers[type])) {
                this.observers[type].forEach(function (observer) {
                    observer.callback(event);
                });
            }
        }
        tick(time) {
            var value = this.currentState.tick(this, time);
            return value;
        }
        invalidate() {
            this.progress = 0;
            this.currentState = animationStateManager_1.default.pausedState;
            return this;
        }
        getProgress() {
            return this.progress;
        }
        setTimeScale(timeScale) {
            this.timeScale = timeScale;
        }
        getTimeScale() {
            return this.timeScale;
        }
        seek(progressValue, now) {
            this.currentState.seek(this, progressValue, now);
            return this;
        }
        observe(type, callback) {
            var self = this;
            if (typeof type !== "string") {
                throw new Error("Need to supply a type.");
            }
            var callbacks = this.observers[type];
            if (typeof callbacks === "undefined") {
                throw new Error("Unknown type to observe to. Here is a list of types to observe to: play, stop, pause, restart, reverse, seek, tick, end, start");
            }
            var observer = new Observer(callback, function () {
                var index = callbacks.indexOf(observer);
                if (index >= 0) {
                    callbacks.splice(index, 1);
                }
            });
            callbacks.push(observer);
            return observer;
        }
        render() {
            var self = this;
            var progress = this.progress;
            var beginningValues = this.beginningValues;
            var endingValues = this.properties;
            var duration = this.duration;
            var easingFunction = this.easingFunction;
            var target = this.target;
            var properties = this.properties;
            var length = properties.length;
            var beginningValue;
            var endingValue;
            var property;
            var value;
            for (property in properties) {
                //beginningValue, endingValue, currentTime, duration, easing
                var beginningValue = beginningValues[property];
                var endingValue = endingValues[property];
                if (typeof endingValue === "object" && endingValue !== null) {
                    beginningValue = endingValue.from;
                    endingValue = endingValue.to;
                }
                if (typeof beginningValue === "undefined") {
                    beginningValues[property] = target[property];
                    beginningValue = target[property];
                }
                if (typeof beginningValue !== "number" || typeof endingValue !== "number") {
                    throw new Error("Default renderer is only able to animate integers. Set the renderer in the config to handle custom values.");
                }
                var change = endingValue - beginningValue;
                var currentTime = progress * duration;
                if (change !== 0) {
                    value = easingFunction(currentTime, beginningValue, change, duration);
                }
                else {
                    value = endingValue;
                }
                // This will be more optimal. Don't set the value unless it changes.
                if (target[property] !== value) {
                    target[property] = value;
                }
            }
            return this;
        }
        static get REPEAT_DEFAULT() {
            return 0;
        }
        static get REPEAT_ALTERNATE() {
            return 1;
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Animation;
});
//# sourceMappingURL=Animation.js.map