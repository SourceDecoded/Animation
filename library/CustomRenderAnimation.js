var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./Animation"], function (require, exports, Animation_1) {
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
});
//# sourceMappingURL=CustomRenderAnimation.js.map