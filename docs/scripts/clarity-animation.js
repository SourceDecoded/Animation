(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["clarityAnimation"] = factory();
	else
		root["clarityAnimation"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(3), __webpack_require__(7), __webpack_require__(8), __webpack_require__(2), __webpack_require__(9), __webpack_require__(10), __webpack_require__(11), __webpack_require__(6)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Animation_1, Timeline_1, PercentageTimeline_1, ElementAnimation_1, ElementPathAnimation_1, CssAnimation_1, CustomRenderAnimation_1, easings_1) {
	    "use strict";
	    exports.Animation = Animation_1.default;
	    exports.Timeline = Timeline_1.default;
	    exports.PercentageTimeline = PercentageTimeline_1.default;
	    exports.ElementAnimation = ElementAnimation_1.default;
	    exports.ElementPathAnimation = ElementPathAnimation_1.default;
	    exports.CssAnimation = CssAnimation_1.default;
	    exports.CustomRenderAnimation = CustomRenderAnimation_1.default;
	    exports.easings = easings_1.default;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	//# sourceMappingURL=main.js.map

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Animation_1) {
	    "use strict";
	    var numberUnitRegEx = /^(\-?\d*\.?\d+)+(.*?)$/i;
	    var rgbRegEx = /^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i;
	    var rgbaRegEx = /^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+|\d\.\d+)\s*\)$/i;
	    var colorAliases = {
	        "transparent": "rgba(0,0,0,0)"
	    };
	    var parseHex = function (hex) {
	        if (hex.indexOf("#") !== 0) {
	            throw new Error("Invalid Hex.");
	        }
	        var rgb = {
	            red: 0,
	            green: 0,
	            blue: 0,
	            alpha: 1
	        };
	        if (hex.length === 4) {
	            rgb.red = parseInt(hex.charAt(1) + hex.charAt(1), 16);
	            rgb.green = parseInt(hex.charAt(2) + hex.charAt(2), 16);
	            rgb.blue = parseInt(hex.charAt(3) + hex.charAt(3), 16);
	        }
	        else {
	            rgb.red = parseInt(hex.substr(1, 2), 16);
	            rgb.green = parseInt(hex.substr(3, 2), 16);
	            rgb.blue = parseInt(hex.substr(5, 2), 16);
	        }
	        return rgb;
	    };
	    var convertHexToRgb = function (hex) {
	        var rgb = parseHex(hex);
	        return "rgb(" + rgb.red + "," + rgb.green + "," + rgb.blue + ")";
	    };
	    var getRgbWithInRangeValue = function (value) {
	        value = value < 0 ? 0 : value;
	        value = value > 255 ? 255 : value;
	        return value;
	    };
	    var ElementAnimation = (function (_super) {
	        __extends(ElementAnimation, _super);
	        function ElementAnimation(config) {
	            var _this = _super.call(this, config) || this;
	            _this.element = null;
	            if (config.target instanceof Element) {
	                _this.element = config.target;
	                config.target = config.target.style;
	                _this.prepareTransformValues();
	            }
	            _this.currentValues = {};
	            _this.mapping = {
	                width: { handler: "numberUnitHandler", alias: "width" },
	                height: { handler: "numberUnitHandler", alias: "height" },
	                lineHeight: { handler: "numberUnitHandler", alias: "line-height" },
	                top: { handler: "numberUnitHandler", alias: "top" },
	                right: { handler: "numberUnitHandler", alias: "right" },
	                bottom: { handler: "numberUnitHandler", alias: "bottom" },
	                left: { handler: "numberUnitHandler", alias: "left" },
	                fontSize: { handler: "numberUnitHandler", alias: "font-size" },
	                borderTopWidth: { handler: "numberUnitHandler", alias: "border-top-width" },
	                borderBottomWidth: { handler: "numberUnitHandler", alias: "border-bottom-width" },
	                borderRightWidth: { handler: "numberUnitHandler", alias: "border-right-width" },
	                borderLeftWidth: { handler: "numberUnitHandler", alias: "border-left-width" },
	                borderTopColor: { handler: "colorHandler", alias: "border-top-color" },
	                borderBottomColor: { handler: "colorHandler", alias: "border-bottom-color" },
	                borderLeftColor: { handler: "colorHandler", alias: "border-left-color" },
	                borderRightColor: { handler: "colorHandler", alias: "border-right-color" },
	                marginTop: { handler: "numberUnitHandler", alias: "margin-top" },
	                marginBottom: { handler: "numberUnitHandler", alias: "margin-bottom" },
	                marginLeft: { handler: "numberUnitHandler", alias: "margin-left" },
	                marginRight: { handler: "numberUnitHandler", alias: "margin-right" },
	                paddingTop: { handler: "numberUnitHandler", alias: "padding-top" },
	                paddingBottom: { handler: "numberUnitHandler", alias: "padding-bottom" },
	                paddingLeft: { handler: "numberUnitHandler", alias: "padding-left" },
	                paddingRight: { handler: "numberUnitHandler", alias: "padding-right" },
	                opacity: { handler: "decimalHandler", alias: "opacity" },
	                color: { handler: "colorHandler", alias: "color" },
	                backgroundColor: { handler: "colorHandler", alias: "background-color" },
	                rotateX: { handler: "rotateXHandler", alias: "rotateX" },
	                rotateY: { handler: "rotateYHandler", alias: "rotateY" },
	                rotateZ: { handler: "rotateZHandler", alias: "rotateX" },
	                scaleX: { handler: "scaleXHandler", alias: "scaleX" },
	                scaleY: { handler: "scaleYHandler", alias: "scaleY" },
	                scaleZ: { handler: "scaleZHandler", alias: "scaleZ" },
	                translateX: { handler: "translateXHandler", alias: "translateX" },
	                translateY: { handler: "translateYHandler", alias: "translateY" },
	                translateZ: { handler: "translateZHandler", alias: "translateZ" }
	            };
	            _this.scaleYHandler = _this.scaleXHandler;
	            _this.scaleZHandler = _this.scaleXHandler;
	            _this.rotateXHandler = _this.rotateXHandler.bind(_this);
	            _this.rotateYHandler = _this.rotateXHandler.bind(_this);
	            _this.rotateZHandler = _this.rotateXHandler.bind(_this);
	            _this.translateXHandler = _this.rotateXHandler.bind(_this);
	            _this.translateYHandler = _this.rotateXHandler.bind(_this);
	            _this.translateZHandler = _this.rotateXHandler.bind(_this);
	            return _this;
	        }
	        ElementAnimation.prototype.setCssText = function () {
	            var element = this.element;
	            var currentValues = this.currentValues;
	            Object.keys(currentValues).forEach(function (property) {
	                return element.style[property] = currentValues[property];
	            });
	        };
	        ElementAnimation.prototype.setElement = function (element) {
	            this.element = element;
	            this.prepareTransformValues();
	        };
	        ElementAnimation.prototype.render = function () {
	            var progress = this.progress;
	            var properties = this.properties;
	            var propertyHandlerName;
	            var property;
	            for (property in properties) {
	                propertyHandlerName = this.mapping[property].handler;
	                var handler = this[propertyHandlerName];
	                if (typeof handler !== "function") {
	                    throw new Error("Doesn't support '" + property + "' style animations.");
	                }
	                this[propertyHandlerName](property, progress);
	            }
	            this.setCssText();
	            return this;
	        };
	        ElementAnimation.prototype.getEndingValue = function (property) {
	            var endingValue = this.properties[property];
	            if (typeof endingValue === "object" && endingValue !== null) {
	                endingValue = endingValue.to;
	            }
	            return endingValue;
	        };
	        ElementAnimation.prototype.getBeginningValue = function (property) {
	            var beginningValue = this.beginningValues[property];
	            var properties = this.properties;
	            if (typeof beginningValue === "undefined") {
	                // If there isn't a default from get the value off the object.
	                if (typeof properties[property].from !== "undefined") {
	                    beginningValue = properties[property].from;
	                }
	                else {
	                    beginningValue = this.target[property];
	                }
	                if (beginningValue === "" || typeof beginningValue === "undefined") {
	                    throw new Error("Couldn't find beginning value for property '" + property + "'.");
	                }
	                this.beginningValues[property] = beginningValue;
	            }
	            if (typeof beginningValue === "undefined") {
	                throw new Error("Couldn't find beginning value for property: " + property + ". Try setting a 'from' value in the configuration of the aniimation.");
	            }
	            return beginningValue;
	        };
	        ElementAnimation.prototype.rgbaHandler = function (beginningValue, endingValue, progress, duration, easingFunction) {
	            var value;
	            var beginningValues = beginningValue.match(rgbaRegEx);
	            var endingValues = endingValue.match(rgbaRegEx);
	            if (beginningValues === null || endingValues === null) {
	                throw new Error("Cannot parse rgb, rgba isn't supported yet.");
	            }
	            var redBeginningValue = parseInt(beginningValues[1], 10);
	            var redEndingValue = parseInt(endingValues[1], 10);
	            var greenBeginningValue = parseInt(beginningValues[2], 10);
	            var greenEndingValue = parseInt(endingValues[2], 10);
	            var blueBeginningValue = parseInt(beginningValues[3], 10);
	            var blueEndingValue = parseInt(endingValues[3], 10);
	            var red = parseInt(this.numberHandler(redBeginningValue, redEndingValue, progress, duration, easingFunction), 10);
	            var green = parseInt(this.numberHandler(greenBeginningValue, greenEndingValue, progress, duration, easingFunction), 10);
	            var blue = parseInt(this.numberHandler(blueBeginningValue, blueEndingValue, progress, duration, easingFunction), 10);
	            red = getRgbWithInRangeValue(red);
	            green = getRgbWithInRangeValue(green);
	            blue = getRgbWithInRangeValue(blue);
	            value = "rgb(" + red + "," + green + "," + blue + ")";
	            return value;
	        };
	        ElementAnimation.prototype.rgbHandler = function (beginningValue, endingValue, progress, duration, easingFunction) {
	            var value;
	            var beginningValues = beginningValue.match(rgbRegEx);
	            var endingValues = endingValue.match(rgbRegEx);
	            var redBeginningValue;
	            var redEndingValue;
	            var greenBeginningValue;
	            var greenEndingValue;
	            var blueBeginningValue;
	            var blueEndingValue;
	            var beginningAlphaValue;
	            var endingAlphaValue;
	            var red;
	            var green;
	            var blue;
	            var alpha;
	            if (beginningValues === null || endingValues === null) {
	                beginningValues = beginningValues || beginningValue.match(rgbaRegEx);
	                endingValues = endingValues || endingValue.match(rgbaRegEx);
	                if (beginningValues === null || endingValues === null) {
	                    throw new Error("Couldn't parse rgb or rgba from values from one or both: " + beginningValue + ", " + endingValue);
	                }
	                redBeginningValue = parseInt(beginningValues[1], 10);
	                redEndingValue = parseInt(endingValues[1], 10);
	                greenBeginningValue = parseInt(beginningValues[2], 10);
	                greenEndingValue = parseInt(endingValues[2], 10);
	                blueBeginningValue = parseInt(beginningValues[3], 10);
	                blueEndingValue = parseInt(endingValues[3], 10);
	                beginningAlphaValue = parseFloat(beginningValues[4] || 1);
	                endingAlphaValue = parseFloat(endingValues[4] || 1);
	                red = parseInt(this.numberHandler(redBeginningValue, redEndingValue, progress, duration, easingFunction), 10);
	                green = parseInt(this.numberHandler(greenBeginningValue, greenEndingValue, progress, duration, easingFunction), 10);
	                blue = parseInt(this.numberHandler(blueBeginningValue, blueEndingValue, progress, duration, easingFunction), 10);
	                alpha = this.numberHandler(beginningAlphaValue, endingAlphaValue, progress, duration, easingFunction);
	                red = getRgbWithInRangeValue(red);
	                green = getRgbWithInRangeValue(green);
	                blue = getRgbWithInRangeValue(blue);
	                value = "rgba(" + red + "," + green + "," + blue + ", " + alpha + ")";
	                return value;
	            }
	            redBeginningValue = parseInt(beginningValues[1], 10);
	            redEndingValue = parseInt(endingValues[1], 10);
	            greenBeginningValue = parseInt(beginningValues[2], 10);
	            greenEndingValue = parseInt(endingValues[2], 10);
	            blueBeginningValue = parseInt(beginningValues[3], 10);
	            blueEndingValue = parseInt(endingValues[3], 10);
	            red = parseInt(this.numberHandler(redBeginningValue, redEndingValue, progress, duration, easingFunction), 10);
	            green = parseInt(this.numberHandler(greenBeginningValue, greenEndingValue, progress, duration, easingFunction), 10);
	            blue = parseInt(this.numberHandler(blueBeginningValue, blueEndingValue, progress, duration, easingFunction), 10);
	            red = getRgbWithInRangeValue(red);
	            green = getRgbWithInRangeValue(green);
	            blue = getRgbWithInRangeValue(blue);
	            value = "rgb(" + red + "," + green + "," + blue + ")";
	            return value;
	        };
	        ElementAnimation.prototype.prepareTransformValues = function () {
	            var element = this.element;
	            element.scaleX = element.scaleX || "1";
	            element.scaleY = element.scaleY || "1";
	            element.scaleZ = element.scaleZ || "1";
	            element.rotateX = element.rotateX || "0deg";
	            element.rotateY = element.rotateY || "0deg";
	            element.rotateZ = element.rotateZ || "0deg";
	            element.translateX = element.translateX || "0";
	            element.translateY = element.translateY || "0";
	            element.translateZ = element.translateZ || "0";
	        };
	        ElementAnimation.prototype.applyTransform = function () {
	            var element = this.element;
	            var transform = "scaleX(" + element.scaleX + ") scaleY(" + element.scaleY + ") scaleZ(" + element.scaleZ + ")";
	            transform += " rotateX(" + element.rotateX + ") rotateY(" + element.rotateY + ") rotateZ(" + element.rotateZ + ")";
	            transform += " translateX(" + element.translateX + ") translateY(" + element.translateY + ") translateZ(" + element.translateZ + ")";
	            this.currentValues["webkitTransform"] = transform;
	            this.currentValues["mozTransform"] = transform;
	            this.currentValues["msTransform"] = transform;
	            this.currentValues["transform"] = transform;
	        };
	        ElementAnimation.prototype.scaleXHandler = function (property, progress) {
	            var element = this.element;
	            var beginningValue = parseFloat(this.getBeginningValue(property));
	            var endingValue = parseFloat(this.getEndingValue(property));
	            var duration = this.duration;
	            var easingFunction = this.easingFunction;
	            var value = this.numberHandler(beginningValue, endingValue, progress, duration, easingFunction);
	            element[property] = value;
	            this.applyTransform();
	        };
	        ElementAnimation.prototype.rotateXHandler = function (property, progress) {
	            var element = this.element;
	            var value;
	            value = this.calculateNumberUnit(property, progress);
	            element[property] = value;
	            this.applyTransform();
	        };
	        ElementAnimation.prototype.calculateColor = function (property, progress) {
	            var beginningValue = this.getBeginningValue(property);
	            var endingValue = this.getEndingValue(property);
	            var duration = this.duration;
	            var easingFunction = this.easingFunction;
	            beginningValue = colorAliases[beginningValue.toLowerCase()] || beginningValue;
	            endingValue = colorAliases[endingValue.toLowerCase()] || endingValue;
	            if (beginningValue.indexOf("#") === 0) {
	                beginningValue = convertHexToRgb(beginningValue);
	            }
	            if (endingValue.indexOf("#") === 0) {
	                endingValue = convertHexToRgb(endingValue);
	            }
	            return this.rgbHandler(beginningValue, endingValue, progress, duration, easingFunction);
	        };
	        ElementAnimation.prototype.colorHandler = function (property, progress) {
	            var value = this.calculateColor(property, progress);
	            value = this.properties[property].isImportant ? value + " !important" : value;
	            this.currentValues[property] = value;
	        };
	        ElementAnimation.prototype.numberHandler = function (beginningValue, endingValue, progress, duration, easingFunction) {
	            var value;
	            var change = endingValue - beginningValue;
	            var currentTime = progress * duration;
	            if (change !== 0) {
	                value = easingFunction(currentTime, beginningValue, change, duration);
	            }
	            else {
	                value = endingValue;
	            }
	            return value.toFixed(5);
	        };
	        ElementAnimation.prototype.calculateNumberUnit = function (property, progress) {
	            var beginningValue = this.getBeginningValue(property);
	            var endingValue = this.getEndingValue(property);
	            var duration = this.duration;
	            var easingFunction = this.easingFunction;
	            var beginningResults = numberUnitRegEx.exec(beginningValue);
	            var endingResults = numberUnitRegEx.exec(endingValue);
	            var unit = beginningResults[2];
	            if (typeof unit === "undefined") {
	                throw new Error("Please use units for the '" + property + "', e.g. 10px, or 10%, 10em");
	            }
	            // To much precision hurts.
	            var beginningFloat = Math.round(parseFloat(beginningResults[1]) * 100) / 100;
	            var endingFloat = Math.round(parseFloat(endingResults[1]) * 100) / 100;
	            var value = this.numberHandler(beginningFloat, endingFloat, progress, duration, easingFunction);
	            return value += unit;
	        };
	        ElementAnimation.prototype.numberUnitHandler = function (property, progress) {
	            var value = this.calculateNumberUnit(property, progress);
	            value = this.properties[property].isImportant ? value + " !important" : value;
	            this.currentValues[property] = value;
	        };
	        ElementAnimation.prototype.caclulateDecimal = function (property, progress) {
	            var beginningValue = this.getBeginningValue(property);
	            var endingValue = this.getEndingValue(property);
	            var duration = this.duration;
	            var easingFunction = this.easingFunction;
	            beginningValue = parseFloat(beginningValue);
	            endingValue = parseFloat(endingValue);
	            return this.numberHandler(beginningValue, endingValue, progress, duration, easingFunction);
	        };
	        ElementAnimation.prototype.decimalHandler = function (property, progress) {
	            var value = this.caclulateDecimal(property, progress);
	            value = this.properties[property].isImportant ? value + " !important" : value;
	            this.currentValues[property] = value;
	        };
	        return ElementAnimation;
	    }(Animation_1.default));
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = ElementAnimation;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	//# sourceMappingURL=ElementAnimation.js.map

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(4), __webpack_require__(5), __webpack_require__(6)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, animationStateManager_1, AnimationManager_1, easings_1) {
	    "use strict";
	    //import "./../node_modules/babel-polyfill/dist/polyfill";
	    var delayAsync = function (milliseconds) {
	        return new Promise(function (resolve, reject) {
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
	    var Observer = (function () {
	        /**
	         * Creates an Observer.
	         * @param {function} callback - The function that is invoked when the observer is notified.
	         * @param {function} unbind - The function that is called when the observer is disposed.
	         */
	        function Observer(callback, unbind) {
	            this._callback = callback;
	            this._isStopped = false;
	            this._isDisposed = false;
	            this._unbind = unbind || function () { };
	        }
	        /**
	         * Stops the observing.
	         */
	        Observer.prototype.stop = function () {
	            this._isStopped = true;
	        };
	        /**
	         * Starts the observing;
	         */
	        Observer.prototype.start = function () {
	            this._isStopped = false;
	        };
	        /**
	         * Notifies the callback with this event.
	         * @param {event} event - Emitted event.
	         */
	        Observer.prototype.callback = function (event) {
	            if (!this._isStopped && !this._isDisposed) {
	                this._callback(event);
	            }
	        };
	        /**
	         * Disposes the observer.
	         */
	        Observer.prototype.dispose = function () {
	            return this._unbind();
	        };
	        return Observer;
	    }());
	    /**Class to manage an animation.*/
	    var Animation = (function () {
	        /**
	         * Creates an animation.
	         * #### Possible Configuration
	         * - easing : string
	         * - duration : number (milliseconds)
	         * - target : object
	         * - properties : object
	         * @param {config} config - Configuration of the animation.
	         */
	        function Animation(config) {
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
	        Animation.prototype._saveBeginningValues = function () {
	            var target = this.target;
	            var beginningValues = this.beginningValues;
	            var properties = this.properties;
	            Object.keys(properties).forEach(function (property) {
	                beginningValues[property] = target[property];
	            });
	        };
	        /**
	         * Plays the animation forward.
	         * @returns {Animation}
	         */
	        Animation.prototype.play = function () {
	            return this.currentState.play(this);
	        };
	        /**
	         * Stops the animation.
	         * @returns {Animation}
	         */
	        Animation.prototype.stop = function () {
	            this.currentState.stop(this);
	            return this;
	        };
	        /**
	         * Allows observing on a particular percentage ratio tick.
	         * @param {number} ratio - The ratio of completeness between 0-1.
	         * @param {function} callback - The function notified at the given ratio.
	         * @returns {Observer}
	         */
	        Animation.prototype.observeAtTick = function (ratio, callback) {
	            var percentage = ratio * 100;
	            if (typeof percentage === "number" && percentage >= 0 && percentage <= 100) {
	                percentage = parseInt(percentage);
	                return this.observe(percentage.toString(), callback);
	            }
	            throw new Error("Invalid Argument Exception: percentage must be a decimal, and with in 0-1");
	        };
	        /**
	         * Play the animation to the end.
	         * @param {number} [startAt] - What ratio of completeness to start at. (0-1)
	         * @returns {Promise}
	         */
	        Animation.prototype.playToEndAsync = function (startAt) {
	            if (typeof startAt === "number" && startAt >= 0 && startAt <= 1) {
	                this.progress = startAt;
	            }
	            return this.playToPercentageAsync(100);
	        };
	        /**
	         * Play to the given percentage.
	         * @param {number} percentage - The percentage to play to.
	         * @returns {Promise}
	         */
	        Animation.prototype.playToPercentageAsync = function (percentage) {
	            var self = this;
	            var ratio = percentage / 100;
	            percentage = parseInt(percentage, 10);
	            if (ratio < this.progress) {
	                throw new Error("Cannot play to a point less than the current progress.");
	            }
	            if (typeof percentage !== "number" || percentage < 0 || percentage > 100) {
	                throw new Error("Expected fraction to be a number within range (0-100).");
	            }
	            return new Promise(function (resolve, reject) {
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
	        };
	        Animation.prototype.reverseToStartAsync = function (startAt) {
	            if (typeof startAt === "number" && startAt >= 0 && startAt <= 1) {
	                this.progress = startAt;
	            }
	            return this.reverseToPercentageAsync(0);
	        };
	        Animation.prototype.reverseToPercentageAsync = function (percentage) {
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
	        };
	        Animation.prototype.pause = function () {
	            return this.currentState.pause(this);
	        };
	        Animation.prototype.restart = function () {
	            return this.currentState.restart(this);
	        };
	        Animation.prototype.reverse = function () {
	            return this.currentState.reverse(this);
	        };
	        Animation.prototype.notify = function (event) {
	            var type = event.type;
	            if (Array.isArray(this.observers[type])) {
	                this.observers[type].forEach(function (observer) {
	                    observer.callback(event);
	                });
	            }
	        };
	        Animation.prototype.tick = function (time) {
	            var value = this.currentState.tick(this, time);
	            return value;
	        };
	        Animation.prototype.invalidate = function () {
	            this.progress = 0;
	            this.currentState = animationStateManager_1.default.pausedState;
	            return this;
	        };
	        Animation.prototype.getProgress = function () {
	            return this.progress;
	        };
	        Animation.prototype.setTimeScale = function (timeScale) {
	            this.timeScale = timeScale;
	        };
	        Animation.prototype.getTimeScale = function () {
	            return this.timeScale;
	        };
	        Animation.prototype.seek = function (progressValue, now) {
	            this.currentState.seek(this, progressValue, now);
	            return this;
	        };
	        Animation.prototype.observe = function (type, callback) {
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
	        };
	        Animation.prototype.render = function () {
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
	        };
	        Object.defineProperty(Animation, "REPEAT_DEFAULT", {
	            get: function () {
	                return 0;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(Animation, "REPEAT_ALTERNATE", {
	            get: function () {
	                return 1;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        return Animation;
	    }());
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = Animation;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	//# sourceMappingURL=Animation.js.map

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    var animationStateManager = {};
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
	        var lastPercentage = parseInt((lastProgress * 100));
	        var percentage = parseInt((progress * 100));
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
	        var lastPercentage = parseInt((lastProgress * 100));
	        var percentage = parseInt((progress * 100));
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
	                animation.currentState = animationStateManager.forwardPausedState;
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
	                animation.currentState = animationStateManager.reversePausedState;
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
	                    }
	                    else {
	                        this.seek(animation, progress, now);
	                        if (animation.repeatDirection === 0) {
	                            this.restart(animation);
	                        }
	                        else {
	                            this.reverse(animation);
	                        }
	                    }
	                }
	                else {
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
	                    }
	                    else {
	                        this.seek(animation, progress, now);
	                        if (animation.repeatDirection === 0) {
	                            this.restart(animation);
	                        }
	                        else {
	                            this.play(animation);
	                        }
	                    }
	                }
	                else {
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
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = animationStateManager;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	//# sourceMappingURL=animationStateManager.js.map

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
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
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = AnimationManager;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	//# sourceMappingURL=AnimationManager.js.map

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    var easings = {
	        easeInQuad: function (t, b, c, d) {
	            return c * (t /= d) * t + b;
	        },
	        easeOutQuad: function (t, b, c, d) {
	            return -c * (t /= d) * (t - 2) + b;
	        },
	        easeInOutQuad: function (t, b, c, d) {
	            if ((t /= d / 2) < 1)
	                return c / 2 * t * t + b;
	            return -c / 2 * ((--t) * (t - 2) - 1) + b;
	        },
	        easeInCubic: function (t, b, c, d) {
	            return c * (t /= d) * t * t + b;
	        },
	        easeOutCubic: function (t, b, c, d) {
	            return c * ((t = t / d - 1) * t * t + 1) + b;
	        },
	        easeInOutCubic: function (t, b, c, d) {
	            if ((t /= d / 2) < 1)
	                return c / 2 * t * t * t + b;
	            return c / 2 * ((t -= 2) * t * t + 2) + b;
	        },
	        easeInQuart: function (t, b, c, d) {
	            return c * (t /= d) * t * t * t + b;
	        },
	        easeOutQuart: function (t, b, c, d) {
	            return -c * ((t = t / d - 1) * t * t * t - 1) + b;
	        },
	        easeInOutQuart: function (t, b, c, d) {
	            if ((t /= d / 2) < 1)
	                return c / 2 * t * t * t * t + b;
	            return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
	        },
	        easeInQuint: function (t, b, c, d) {
	            return c * (t /= d) * t * t * t * t + b;
	        },
	        easeOutQuint: function (t, b, c, d) {
	            return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
	        },
	        easeInOutQuint: function (t, b, c, d) {
	            if ((t /= d / 2) < 1)
	                return c / 2 * t * t * t * t * t + b;
	            return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
	        },
	        easeInSine: function (t, b, c, d) {
	            return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
	        },
	        easeOutSine: function (t, b, c, d) {
	            return c * Math.sin(t / d * (Math.PI / 2)) + b;
	        },
	        easeInOutSine: function (t, b, c, d) {
	            return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
	        },
	        easeInExpo: function (t, b, c, d) {
	            return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
	        },
	        easeOutExpo: function (t, b, c, d) {
	            return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
	        },
	        easeInOutExpo: function (t, b, c, d) {
	            if (t == 0)
	                return b;
	            if (t == d)
	                return b + c;
	            if ((t /= d / 2) < 1)
	                return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
	            return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
	        },
	        easeInCirc: function (t, b, c, d) {
	            return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
	        },
	        easeOutCirc: function (t, b, c, d) {
	            return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
	        },
	        easeInOutCirc: function (t, b, c, d) {
	            if ((t /= d / 2) < 1)
	                return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
	            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
	        },
	        easeInElastic: function (t, b, c, d) {
	            var s = 1.70158;
	            var p = 0;
	            var a = c;
	            if (t == 0)
	                return b;
	            if ((t /= d) == 1)
	                return b + c;
	            if (!p)
	                p = d * .3;
	            if (a < Math.abs(c)) {
	                a = c;
	                var s = p / 4;
	            }
	            else
	                var s = p / (2 * Math.PI) * Math.asin(c / a);
	            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
	        },
	        easeOutElastic: function (t, b, c, d) {
	            var s = 1.70158;
	            var p = 0;
	            var a = c;
	            if (t == 0)
	                return b;
	            if ((t /= d) == 1)
	                return b + c;
	            if (!p)
	                p = d * .3;
	            if (a < Math.abs(c)) {
	                a = c;
	                var s = p / 4;
	            }
	            else
	                var s = p / (2 * Math.PI) * Math.asin(c / a);
	            return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
	        },
	        easeInOutElastic: function (t, b, c, d) {
	            var s = 1.70158;
	            var p = 0;
	            var a = c;
	            if (t == 0)
	                return b;
	            if ((t /= d / 2) == 2)
	                return b + c;
	            if (!p)
	                p = d * (.3 * 1.5);
	            if (a < Math.abs(c)) {
	                a = c;
	                var s = p / 4;
	            }
	            else
	                var s = p / (2 * Math.PI) * Math.asin(c / a);
	            if (t < 1)
	                return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
	            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
	        },
	        easeInBack: function (t, b, c, d, s) {
	            if (s == undefined)
	                s = 1.70158;
	            return c * (t /= d) * t * ((s + 1) * t - s) + b;
	        },
	        easeOutBack: function (t, b, c, d, s) {
	            if (s == undefined)
	                s = 1.70158;
	            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
	        },
	        easeInOutBack: function (t, b, c, d, s) {
	            if (s == undefined)
	                s = 1.70158;
	            if ((t /= d / 2) < 1)
	                return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
	            return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
	        },
	        easeInBounce: function (t, b, c, d) {
	            return c - easings.easeOutBounce(d - t, 0, c, d) + b;
	        },
	        easeOutBounce: function (t, b, c, d) {
	            if ((t /= d) < (1 / 2.75)) {
	                return c * (7.5625 * t * t) + b;
	            }
	            else if (t < (2 / 2.75)) {
	                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
	            }
	            else if (t < (2.5 / 2.75)) {
	                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
	            }
	            else {
	                return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
	            }
	        },
	        easeInOutBounce: function (t, b, c, d) {
	            if (t < d / 2)
	                return easings.easeInBounce(t * 2, 0, c, d) * .5 + b;
	            return easings.easeOutBounce(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
	        },
	        linear: function (t, b, c, d) {
	            return c * t / d + b;
	        }
	    };
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = easings;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	//# sourceMappingURL=easings.js.map

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(3), __webpack_require__(4)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Animation_1, animationStateManager_1) {
	    "use strict";
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
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = Timeline;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	//# sourceMappingURL=Timeline.js.map

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(7), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Timeline_1, Animation_1) {
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
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	//# sourceMappingURL=PercentageTimeline.js.map

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Animation_js_1) {
	    "use strict";
	    var isVector = function (vector) {
	        if (typeof vector.x !== "number" &&
	            typeof vector.y !== "number" &&
	            typeof vector.z !== "number") {
	            return false;
	        }
	        return true;
	    };
	    var assertVector = function (vector) {
	        var vectorString;
	        if (!isVector(vector)) {
	            try {
	                vectorString = JSON.stringify(vector);
	            }
	            catch (e) {
	                vectorString = "Couldn't stringify the vector because of recursive objects.";
	            }
	            throw new Error("Invalid vector: " + vectorString);
	        }
	    };
	    var assertControlsAreVectors = function (controls) {
	        if (!Array.isArray(controls)) {
	            throw new Error("The animations controls need to be an array of vectors.");
	        }
	        var passed = controls.every(isVector);
	        if (!passed) {
	            throw new Error("Invalid control vectors.");
	        }
	    };
	    var normalizeVector = function (vector) {
	        if (typeof vector.x !== "number") {
	            vector.x = 0;
	        }
	        if (typeof vector.y !== "number") {
	            vector.y = 0;
	        }
	        if (typeof vector.z !== "number") {
	            vector.z = 0;
	        }
	    };
	    var calculatePosition = function (from, to, percent) {
	        return ((to - from) * percent) + from;
	    };
	    var ElementPathAnimation = (function (_super) {
	        __extends(ElementPathAnimation, _super);
	        function ElementPathAnimation(config) {
	            var _this = _super.call(this, config) || this;
	            config = config || {};
	            _this.target = config.target;
	            _this.duration = config.duration;
	            _this.unit = config.unit;
	            _this.from = config.from;
	            _this.to = config.to;
	            _this.controls = config.controls || [];
	            _this.points = [];
	            _this.calculationMatrix = [];
	            if (!(_this.target instanceof Element)) {
	                throw new Error("The target must be an Element.");
	            }
	            if (typeof _this.duration !== "number") {
	                throw new Error("The animation's duration must be a number.");
	            }
	            if (typeof _this.unit !== "string") {
	                throw new Error("The animation's unit should be a string");
	            }
	            assertVector(_this.from);
	            assertVector(_this.to);
	            assertControlsAreVectors(_this.controls);
	            _this.change = {
	                x: _this.to.x - _this.from.x,
	                y: _this.to.y - _this.from.y,
	                z: _this.to.z - _this.from.z
	            };
	            _this.points = _this.controls.slice(0);
	            _this.points.unshift(_this.from);
	            _this.points.push(_this.to);
	            _this.points.forEach(normalizeVector);
	            _this.prepareTransformValues(_this.target);
	            return _this;
	        }
	        ElementPathAnimation.prototype.prepareTransformValues = function (element) {
	            if (typeof element.style.scaleX === "undefined") {
	                element._scaleX = "1";
	                element._scaleY = "1";
	                element._scaleZ = "1";
	                element._rotateX = "0deg";
	                element._rotateY = "0deg";
	                element._rotateZ = "0deg";
	                element._translateX = "0";
	                element._translateY = "0";
	                element._translateZ = "0";
	            }
	        };
	        ElementPathAnimation.prototype.applyTransform = function () {
	            var element = this.target;
	            var transform = "scaleX(" + element._scaleX + ") scaleY(" + element._scaleY + ") scaleZ(" + element._scaleZ + ")";
	            transform += " rotateX(" + element._rotateX + ") rotateY(" + element._rotateY + ") rotateZ(" + element._rotateZ + ")";
	            transform += " translateX(" + element._translateX + ") translateY(" + element._translateY + ") translateZ(" + element._translateZ + ")";
	            element.style.webkitTransform = transform;
	            element.style.mozTransform = transform;
	            element.style.msTransform = transform;
	            element.style.transform = transform;
	        };
	        ElementPathAnimation.prototype.reduce = function (points, percent, index, easing) {
	            if (typeof index === "undefined") {
	                index = 0;
	            }
	            var easingPercent = easing(this.progress * this.duration, 0, 1, this.duration);
	            this.calculationMatrix[index] = points;
	            var reducedPoints = this.calculationMatrix[index + 1] || [];
	            points.reduce(function (reducedPoints, currentValue, index) {
	                if (index !== points.length - 1) {
	                    var vector = reducedPoints[index] = reducedPoints[index] || { x: 0, y: 0, z: 0 };
	                    vector.x = calculatePosition(currentValue.x, points[index + 1].x, easingPercent);
	                    vector.y = calculatePosition(currentValue.y, points[index + 1].y, easingPercent);
	                    vector.z = calculatePosition(currentValue.z, points[index + 1].z, easingPercent);
	                }
	                return reducedPoints;
	            }, reducedPoints);
	            if (reducedPoints.length > 1) {
	                return this.reduce(reducedPoints, percent, index + 1, easing);
	            }
	            return reducedPoints;
	        };
	        ElementPathAnimation.prototype.render = function () {
	            var target = this.target;
	            var unit = this.unit;
	            var progress = this.progress;
	            var easing = this.easingFunction;
	            var currentPosition = this.reduce(this.points, progress, 0, easing);
	            target._translateX = currentPosition[0].x + unit;
	            target._translateY = currentPosition[0].y + unit;
	            // According to spec, translateZ cannot be any unit but px.
	            target._translateZ = currentPosition[0].z + "px";
	            this.applyTransform();
	            return this;
	        };
	        return ElementPathAnimation;
	    }(Animation_js_1.default));
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = ElementPathAnimation;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	//# sourceMappingURL=ElementPathAnimation.js.map

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(11)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, CustomRenderAnimation_1) {
	    "use strict";
	    var transformMappings = {
	        scaleX: true,
	        scaleY: true,
	        scaleZ: true,
	        rotateX: true,
	        rotateY: true,
	        rotateZ: true,
	        translateX: true,
	        translateY: true,
	        translateZ: true
	    };
	    var CssAnimation = (function (_super) {
	        __extends(CssAnimation, _super);
	        function CssAnimation(config) {
	            var _this = this;
	            config.originalRenderer = config.renderer;
	            config.renderer = function (values) {
	                var target = _this.target;
	                var hasTransform = false;
	                Object.keys(values).forEach(function (key) {
	                    if (transformMappings[key]) {
	                        hasTransform = true;
	                        return;
	                    }
	                    target[key] = values[key];
	                });
	                if (hasTransform) {
	                    _this.handleTransforms(values, target);
	                }
	                if (config.target == null && typeof config.originalRenderer === "function") {
	                    config.originalRenderer(target);
	                }
	            };
	            _this = _super.call(this, config) || this;
	            _this.target = config.target || {};
	            return _this;
	        }
	        CssAnimation.prototype.handleTransforms = function (values, target) {
	            if (values.scaleX != null ||
	                values.scaleY != null ||
	                values.scaleZ != null ||
	                values.rotateX != null ||
	                values.rotateY != null ||
	                values.rotateZ != null ||
	                values.translateX != null ||
	                values.translateY != null ||
	                values.translateZ != null) {
	                values.scaleX = values.scaleX || "1";
	                values.scaleY = values.scaleY || "1";
	                values.scaleZ = values.scaleZ || "1";
	                values.rotateX = values.rotateX || "0deg";
	                values.rotateY = values.rotateY || "0deg";
	                values.rotateZ = values.rotateZ || "0deg";
	                values.translateX = values.translateX || "0";
	                values.translateY = values.translateY || "0";
	                values.translateZ = values.translateZ || "0";
	                var transform = "scaleX(" + values.scaleX + ") scaleY(" + values.scaleY + ") scaleZ(" + values.scaleZ + ")";
	                transform += " rotateX(" + values.rotateX + ") rotateY(" + values.rotateY + ") rotateZ(" + values.rotateZ + ")";
	                transform += " translateX(" + values.translateX + ") translateY(" + values.translateY + ") translateZ(" + values.translateZ + ")";
	                this.target["webkitTransform"] = transform;
	                this.target["mozTransform"] = transform;
	                this.target["msTransform"] = transform;
	                this.target["transform"] = transform;
	            }
	        };
	        return CssAnimation;
	    }(CustomRenderAnimation_1.default));
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = CssAnimation;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	//# sourceMappingURL=CssAnimation.js.map

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Animation_1) {
	    "use strict";
	    var numberUnitRegEx = /^(\-?\d*\.?\d+)+(.*?)$/i;
	    var rgbRegEx = /^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i;
	    var rgbaRegEx = /^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+|\d\.\d+)\s*\)$/i;
	    var isColor = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$|^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$|^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+|\d\.\d+)\s*\)$/;
	    var isUnitNumber = /^([0-9]+)([^0-9]+)$/;
	    var colorAliases = {
	        "transparent": "rgba(0,0,0,0)"
	    };
	    var parseHex = function (hex) {
	        if (hex.indexOf("#") !== 0) {
	            throw new Error("Invalid Hex.");
	        }
	        var rgb = {
	            red: 0,
	            green: 0,
	            blue: 0,
	            alpha: 1
	        };
	        if (hex.length === 4) {
	            rgb.red = parseInt(hex.charAt(1) + hex.charAt(1), 16);
	            rgb.green = parseInt(hex.charAt(2) + hex.charAt(2), 16);
	            rgb.blue = parseInt(hex.charAt(3) + hex.charAt(3), 16);
	        }
	        else {
	            rgb.red = parseInt(hex.substr(1, 2), 16);
	            rgb.green = parseInt(hex.substr(3, 2), 16);
	            rgb.blue = parseInt(hex.substr(5, 2), 16);
	        }
	        return rgb;
	    };
	    var convertHexToRgb = function (hex) {
	        if (hex.indexOf("#") === 0) {
	            var rgb = parseHex(hex);
	            return "rgb(" + rgb.red + "," + rgb.green + "," + rgb.blue + ")";
	        }
	        return hex;
	    };
	    var getRgbWithInRangeValue = function (value) {
	        value = value < 0 ? 0 : value;
	        value = value > 255 ? 255 : value;
	        return value;
	    };
	    var valueHandlers = [{
	            test: function (value) {
	                return isUnitNumber.test(value);
	            },
	            map: function (value) {
	                return value;
	            },
	            name: "numberUnitHandler"
	        }, {
	            test: function (value) {
	                return isColor.test(value);
	            },
	            map: function (value) {
	                return convertHexToRgb(value);
	            },
	            name: "colorHandler"
	        }, {
	            test: function (value) {
	                return typeof value === "number";
	            },
	            map: function (value) {
	                return value;
	            },
	            name: "decimalHandler"
	        }];
	    var CustomRenderAnimation = (function (_super) {
	        __extends(CustomRenderAnimation, _super);
	        function CustomRenderAnimation(config) {
	            var _this = _super.call(this, config) || this;
	            _this.element = config.target;
	            _this.target = {};
	            _this.renderer = config.renderer || function (values) { };
	            _this.assignHandlers();
	            return _this;
	        }
	        CustomRenderAnimation.prototype.assignHandlers = function () {
	            var properties = this.properties;
	            Object.keys(properties).forEach(function (name) {
	                var property = properties[name];
	                if (property.to == null) {
	                    throw new Error("Cannot animate \"" + name + "\" without specifying the \"to\" field.");
	                }
	                if (property.from == null) {
	                    throw new Error("Cannot animate \"" + name + "\" without specifying the \"from\" field.");
	                }
	                valueHandlers.some(function (handler) {
	                    if (handler.test(property.from) && handler.test(property.to)) {
	                        property.from = handler.map(property.from);
	                        property.to = handler.map(property.to);
	                        property.handlerName = handler.name;
	                        return true;
	                    }
	                    return false;
	                });
	                if (typeof property.handlerName !== "string") {
	                    property.handlerName = "nullableHandler";
	                }
	            });
	        };
	        CustomRenderAnimation.prototype.render = function () {
	            var _this = this;
	            var progress = this.progress;
	            var properties = this.properties;
	            Object.keys(properties).forEach(function (propertyName) {
	                var property = properties[propertyName];
	                var handlerName = property.handlerName;
	                var handler = _this[handlerName];
	                if (typeof handler !== "function") {
	                    throw new Error("Unassigned Handler.");
	                }
	                var value = handler.apply(_this, [property, progress]);
	                _this.target[propertyName] = value;
	            });
	            this.renderer(this.target);
	            return this;
	        };
	        CustomRenderAnimation.prototype.nullableHandler = function (property, progress) {
	            return property.from;
	        };
	        CustomRenderAnimation.prototype.calculateColor = function (property, progress) {
	            var value;
	            var beginningValue = property.from;
	            var endingValue = property.to;
	            var duration = this.duration;
	            var easingFunction = this.easingFunction;
	            beginningValue = colorAliases[beginningValue.toLowerCase()] || beginningValue;
	            endingValue = colorAliases[endingValue.toLowerCase()] || endingValue;
	            return this.rgbHandler(beginningValue, endingValue, progress, duration, easingFunction);
	        };
	        CustomRenderAnimation.prototype.colorHandler = function (property, progress) {
	            var value = this.calculateColor(property, progress);
	            return value;
	        };
	        CustomRenderAnimation.prototype.numberHandler = function (beginningValue, endingValue, progress, duration, easingFunction) {
	            var value;
	            var change = endingValue - beginningValue;
	            var currentTime = progress * duration;
	            if (change !== 0) {
	                value = easingFunction(currentTime, beginningValue, change, duration);
	            }
	            else {
	                value = endingValue;
	            }
	            return value.toFixed(5);
	        };
	        CustomRenderAnimation.prototype.calculateNumberUnit = function (property, progress) {
	            var value;
	            var beginningValue = property.from;
	            var endingValue = property.to;
	            var duration = this.duration;
	            var easingFunction = this.easingFunction;
	            var beginningResults = numberUnitRegEx.exec(beginningValue);
	            var endingResults = numberUnitRegEx.exec(endingValue);
	            var unit = beginningResults[2];
	            // To much precision hurts.
	            var beginningFloat = Math.round(parseFloat(beginningResults[1]) * 100) / 100;
	            var endingFloat = Math.round(parseFloat(endingResults[1]) * 100) / 100;
	            var value = this.numberHandler(beginningFloat, endingFloat, progress, duration, easingFunction);
	            return value += unit;
	        };
	        CustomRenderAnimation.prototype.numberUnitHandler = function (property, progress) {
	            var value = this.calculateNumberUnit(property, progress);
	            return value;
	        };
	        CustomRenderAnimation.prototype.caclulateDecimal = function (property, progress) {
	            var value;
	            var beginningValue = property.from;
	            var endingValue = property.to;
	            var duration = this.duration;
	            var easingFunction = this.easingFunction;
	            beginningValue = parseFloat(beginningValue);
	            endingValue = parseFloat(endingValue);
	            return this.numberHandler(beginningValue, endingValue, progress, duration, easingFunction);
	        };
	        CustomRenderAnimation.prototype.decimalHandler = function (property, progress) {
	            var value = this.caclulateDecimal(property, progress);
	            return value;
	        };
	        CustomRenderAnimation.prototype.rgbaHandler = function (beginningValue, endingValue, progress, duration, easingFunction) {
	            var value;
	            var beginningValues = beginningValue.match(rgbaRegEx);
	            var endingValues = endingValue.match(rgbaRegEx);
	            if (beginningValues === null || endingValues === null) {
	                throw new Error("Cannot parse rgb, rgba isn't supported yet.");
	            }
	            var redBeginningValue = parseInt(beginningValues[1], 10);
	            var redEndingValue = parseInt(endingValues[1], 10);
	            var greenBeginningValue = parseInt(beginningValues[2], 10);
	            var greenEndingValue = parseInt(endingValues[2], 10);
	            var blueBeginningValue = parseInt(beginningValues[3], 10);
	            var blueEndingValue = parseInt(endingValues[3], 10);
	            var red = parseInt(this.numberHandler(redBeginningValue, redEndingValue, progress, duration, easingFunction), 10);
	            var green = parseInt(this.numberHandler(greenBeginningValue, greenEndingValue, progress, duration, easingFunction), 10);
	            var blue = parseInt(this.numberHandler(blueBeginningValue, blueEndingValue, progress, duration, easingFunction), 10);
	            red = getRgbWithInRangeValue(red);
	            green = getRgbWithInRangeValue(green);
	            blue = getRgbWithInRangeValue(blue);
	            value = "rgb(" + red + "," + green + "," + blue + ")";
	            return value;
	        };
	        ;
	        CustomRenderAnimation.prototype.rgbHandler = function (beginningValue, endingValue, progress, duration, easingFunction) {
	            var value;
	            var beginningValues = beginningValue.match(rgbRegEx);
	            var endingValues = endingValue.match(rgbRegEx);
	            var redBeginningValue;
	            var redEndingValue;
	            var greenBeginningValue;
	            var greenEndingValue;
	            var blueBeginningValue;
	            var blueEndingValue;
	            var beginningAlphaValue;
	            var endingAlphaValue;
	            var red;
	            var green;
	            var blue;
	            var alpha;
	            if (beginningValues === null || endingValues === null) {
	                beginningValues = beginningValues || beginningValue.match(rgbaRegEx);
	                endingValues = endingValues || endingValue.match(rgbaRegEx);
	                if (beginningValues === null || endingValues === null) {
	                    throw new Error("Couldn't parse rgb or rgba from values from one or both: " + beginningValue + ", " + endingValue);
	                }
	                redBeginningValue = parseInt(beginningValues[1], 10);
	                redEndingValue = parseInt(endingValues[1], 10);
	                greenBeginningValue = parseInt(beginningValues[2], 10);
	                greenEndingValue = parseInt(endingValues[2], 10);
	                blueBeginningValue = parseInt(beginningValues[3], 10);
	                blueEndingValue = parseInt(endingValues[3], 10);
	                beginningAlphaValue = parseFloat(beginningValues[4] || 1);
	                endingAlphaValue = parseFloat(endingValues[4] || 1);
	                red = parseInt(this.numberHandler(redBeginningValue, redEndingValue, progress, duration, easingFunction), 10);
	                green = parseInt(this.numberHandler(greenBeginningValue, greenEndingValue, progress, duration, easingFunction), 10);
	                blue = parseInt(this.numberHandler(blueBeginningValue, blueEndingValue, progress, duration, easingFunction), 10);
	                alpha = this.numberHandler(beginningAlphaValue, endingAlphaValue, progress, duration, easingFunction);
	                red = getRgbWithInRangeValue(red);
	                green = getRgbWithInRangeValue(green);
	                blue = getRgbWithInRangeValue(blue);
	                value = "rgba(" + red + "," + green + "," + blue + ", " + alpha + ")";
	                return value;
	            }
	            redBeginningValue = parseInt(beginningValues[1], 10);
	            redEndingValue = parseInt(endingValues[1], 10);
	            greenBeginningValue = parseInt(beginningValues[2], 10);
	            greenEndingValue = parseInt(endingValues[2], 10);
	            blueBeginningValue = parseInt(beginningValues[3], 10);
	            blueEndingValue = parseInt(endingValues[3], 10);
	            red = parseInt(this.numberHandler(redBeginningValue, redEndingValue, progress, duration, easingFunction), 10);
	            green = parseInt(this.numberHandler(greenBeginningValue, greenEndingValue, progress, duration, easingFunction), 10);
	            blue = parseInt(this.numberHandler(blueBeginningValue, blueEndingValue, progress, duration, easingFunction), 10);
	            red = getRgbWithInRangeValue(red);
	            green = getRgbWithInRangeValue(green);
	            blue = getRgbWithInRangeValue(blue);
	            value = "rgb(" + red + "," + green + "," + blue + ")";
	            return value;
	        };
	        return CustomRenderAnimation;
	    }(Animation_1.default));
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = CustomRenderAnimation;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	//# sourceMappingURL=CustomRenderAnimation.js.map

/***/ }
/******/ ])
});
;