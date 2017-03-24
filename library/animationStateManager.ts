
var animationStateManager = <any>{};

var emptyFnWithReturnAnimation = function (animation) { return animation; };

var forwardPause = function (animation) {
    animation.notify({
        type: "pause",
        progress: animation.progress
    });

    animation.currentState = animationStateManager.forwardPausedState;
    animation.animationManager.unregister(animation);
    return animation;
};

var reversePause = function (animation) {
    animation.notify({
        type: "pause",
        progress: animation.progress
    });

    animation.currentState = animationStateManager.reversePausedState;
    animation.animationManager.unregister(animation);
    return animation;
};

var play = function (animation) {
    animation.notify({
        type: "play",
        progress: animation.progress
    });

    var now = animation.animationManager.now();
    animation.currentTime = now;
    animation.currentState = animationStateManager.forwardState;
    animation.animationManager.register(animation);

    animation.render();

    return animation;
};

var stop = function (animation) {
    var now = animation.animationManager.now();
    animation.currentTime = now;
    animation.currentState = animationStateManager.stoppedState;
    animation.animationManager.unregister(animation);
    return animation;
};

var stopWithNotifications = function (animation) {
    animation.notify({
        type: "stop",
        progress: animation.progress
    });
    return stop(animation);
};

var reverse = function (animation) {
    animation.notify({
        type: "reverse",
        progress: animation.progress
    });

    var now = animation.animationManager.now();
    animation.currentTime = now;
    animation.currentState = animationStateManager.reverseState;
    animation.animationManager.register(animation);
    return animation;
};

var restartForward = function (animation) {
    animation.notify({
        type: "restart",
        progress: 0
    });

    animation.seek(0);

    animation.play();

    return animation;
};

var restartReverse = function (animation) {
    animation.notify({
        type: "restart",
        progress: 1
    });

    animation.seek(1);
    return animation;
};

var getProgressValueWithBounds = function (progressValue) {
    if (progressValue > 1) {
        progressValue = 1;
    }

    if (progressValue < 0) {
        progressValue = 0;
    }
    return progressValue;
};

var notifyTickForward = function (animation, lastProgress, progress) {
    var lastPercentage = parseInt(<any>(lastProgress * 100));
    var percentage = parseInt(<any>(progress * 100));

    if (lastPercentage === 0 && lastPercentage !== percentage) {
        animation.notify({
            type: lastPercentage
        });
    }

    if (lastPercentage === percentage) {
        animation.notify({
            type: percentage
        });
    }

    for (var p = lastPercentage + 1; p <= percentage; p++) {
        animation.notify({
            type: p
        });
    }

};

var notifyTickReverse = function (animation, lastProgress, progress) {
    var lastPercentage = parseInt(<any>(lastProgress * 100));
    var percentage = parseInt(<any>(progress * 100));
    var p;

    if (lastPercentage === 100 && lastPercentage !== percentage) {
        animation.notify({
            type: lastPercentage
        });
    }

    if (lastPercentage === percentage) {
        animation.notify({
            type: percentage
        });
    }

    for (p = lastPercentage - 1; p >= percentage; p--) {
        animation.notify({
            type: p
        });
    }
};

var render = function (animation, currentTime, progress) {
    var lastProgress = animation.progress;

    progress = getProgressValueWithBounds(progress);
    animation.currentTime = typeof currentTime !== "number" ? animation.animationManager.now() : currentTime;
    animation.progress = progress;
    animation.render();

    animation.notify({
        type: "tick",
        progress: progress,
        lastProgress: lastProgress
    });
};

animationStateManager.forwardPausedState = {
    seek: function (animation, progress, now) {
        var lastProgress = animation.progress;

        if (lastProgress > progress) {
            animation.currentState = animationStateManager.reversePausedState;
            animation.currentState.seek(animation, progress, now);
            return;
        }

        if (animation.progress > 1) {
            return;
        }

        if (animation.progress <= 0) {
            animation.notify({
                type: "start",
                progress: 0
            });
        }

        render(animation, now, progress);
        notifyTickForward(animation, lastProgress, progress);

        if (progress >= 1) {
            animation.notify({
                type: "end",
                progress: 1
            });
        }
    },
    play: play,
    stop: stopWithNotifications,
    pause: emptyFnWithReturnAnimation,
    reverse: reverse,
    tick: emptyFnWithReturnAnimation,
    restart: restartForward
};

animationStateManager.reversePausedState = {
    seek: function (animation, progress, now) {
        var lastProgress = animation.progress;

        if (lastProgress < progress) {
            animation.currentState = animationStateManager.forwardPausedState;
            animation.currentState.seek(animation, progress, now);
            return;
        }

        if (animation.progress < 0) {
            return;
        }

        if (animation.progress >= 1) {
            animation.notify({
                type: "end"
            });
        }

        render(animation, now, progress);
        notifyTickReverse(animation, lastProgress, progress);

        if (progress <= 0) {
            animation.notify({
                type: "start"
            });
        }
    },
    play: play,
    stop: stopWithNotifications,
    pause: emptyFnWithReturnAnimation,
    reverse: reverse,
    tick: emptyFnWithReturnAnimation,
    restart: restartReverse
};

animationStateManager.forwardState = {
    seek: animationStateManager.forwardPausedState.seek,
    play: emptyFnWithReturnAnimation,
    stop: stopWithNotifications,
    pause: forwardPause,
    reverse: reverse,
    tick: function (animation, now) {
        var lastTime = animation.currentTime;

        if (now > lastTime) {
            var change = (now - lastTime) * animation.timeScale;
            var progress = animation.progress + (change / animation.duration);

            if (progress >= 1) {
                progress = 1;
                animation.iterations++;

                if (animation.iterations >= animation.repeat) {
                    this.seek(animation, progress, now);
                    stopWithNotifications(animation);
                } else {
                    this.seek(animation, progress, now);
                    if (animation.repeatDirection === 0) {
                        this.restart(animation);
                    } else {
                        this.reverse(animation);
                    }
                }
            } else {
                this.seek(animation, progress, now);
            }

        }

        return animation;
    },
    restart: restartForward
};

animationStateManager.reverseState = {
    seek: animationStateManager.reversePausedState.seek,
    play: play,
    stop: stopWithNotifications,
    pause: reversePause,
    reverse: emptyFnWithReturnAnimation,
    tick: function (animation, now) {
        var lastTime = animation.currentTime;

        if (now > lastTime) {
            var change = (now - lastTime) * animation.timeScale;
            var progress = animation.progress - (change / animation.duration);


            if (progress <= 0) {
                progress = 0;
                animation.iterations++;

                if (animation.iterations >= animation.repeat) {
                    this.seek(animation, progress, now);
                    stopWithNotifications(animation);
                } else {
                    this.seek(animation, progress, now);
                    if (animation.repeatDirection === 0) {
                        this.restart(animation);
                    } else {
                        this.play(animation);
                    }
                }
            } else {
                this.seek(animation, progress, now);
            }

        }

        return animation;
    },
    restart: restartReverse
};

animationStateManager.stoppedState = {
    seek: function (animation, progress, now) {
        if (progress > 1) {
            progress = 1;
        }

        if (progress < 0) {
            progress = 0;
        }

        animation.progress = progress;
        animation.currentTime = now;
        return animation;
    },
    play: play,
    stop: emptyFnWithReturnAnimation,
    pause: forwardPause,
    reverse: reverse,
    tick: emptyFnWithReturnAnimation,
    restart: restartForward
};

export default animationStateManager;