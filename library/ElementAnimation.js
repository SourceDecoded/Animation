define(["require", "exports", "./Animation"], function (require, exports, Animation_1) {
    "use strict";
    const numberUnitRegEx = /^(\-?\d*\.?\d+)+(.*?)$/i;
    const rgbRegEx = /^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i;
    const rgbaRegEx = /^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+|\d\.\d+)\s*\)$/i;
    const colorAliases = {
        "transparent": "rgba(0,0,0,0)"
    };
    const parseHex = function (hex) {
        if (hex.indexOf("#") !== 0) {
            throw new Error("Invalid Hex.");
        }
        let rgb = {
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
    const convertHexToRgb = function (hex) {
        let rgb = parseHex(hex);
        return "rgb(" + rgb.red + "," + rgb.green + "," + rgb.blue + ")";
    };
    const getRgbWithInRangeValue = function (value) {
        value = value < 0 ? 0 : value;
        value = value > 255 ? 255 : value;
        return value;
    };
    // TODO: 
    const propertyShorthands = {
        borderWidth: function (value, properties) {
        },
        borderColor: function (value, properties) {
        },
        scale: function (value, properties) {
        },
        translate: function (value, properties) {
        },
        rotate: function (value, properties) {
        }
    };
    class ElementAnimation extends Animation_1.default {
        constructor(config) {
            super(config);
            this.element = null;
            if (config.target instanceof Element) {
                this.element = config.target;
                config.target = config.target.style;
                this.prepareTransformValues();
            }
            this.currentValues = {};
            this.mapping = {
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
            this.scaleYHandler = this.scaleXHandler;
            this.scaleZHandler = this.scaleXHandler;
            this.rotateXHandler = this.rotateXHandler.bind(this);
            this.rotateYHandler = this.rotateXHandler.bind(this);
            this.rotateZHandler = this.rotateXHandler.bind(this);
            this.translateXHandler = this.rotateXHandler.bind(this);
            this.translateYHandler = this.rotateXHandler.bind(this);
            this.translateZHandler = this.rotateXHandler.bind(this);
        }
        setCssText() {
            let element = this.element;
            let currentValues = this.currentValues;
            Object.keys(currentValues).forEach(function (property) {
                return element.style[property] = currentValues[property];
            });
        }
        setElement(element) {
            this.element = element;
            this.prepareTransformValues();
        }
        render() {
            let progress = this.progress;
            let properties = this.properties;
            let propertyHandlerName;
            let property;
            for (property in properties) {
                propertyHandlerName = this.mapping[property].handler;
                let handler = this[propertyHandlerName];
                if (typeof handler !== "function") {
                    throw new Error("Doesn't support '" + property + "' style animations.");
                }
                this[propertyHandlerName](property, progress);
            }
            this.setCssText();
            return this;
        }
        getEndingValue(property) {
            let endingValue = this.properties[property];
            if (typeof endingValue === "object" && endingValue !== null) {
                endingValue = endingValue.to;
            }
            return endingValue;
        }
        getBeginningValue(property) {
            let beginningValue = this.beginningValues[property];
            let properties = this.properties;
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
        }
        rgbaHandler(beginningValue, endingValue, progress, duration, easingFunction) {
            let value;
            let beginningValues = beginningValue.match(rgbaRegEx);
            let endingValues = endingValue.match(rgbaRegEx);
            if (beginningValues === null || endingValues === null) {
                throw new Error("Cannot parse rgb, rgba isn't supported yet.");
            }
            let redBeginningValue = parseInt(beginningValues[1], 10);
            let redEndingValue = parseInt(endingValues[1], 10);
            let greenBeginningValue = parseInt(beginningValues[2], 10);
            let greenEndingValue = parseInt(endingValues[2], 10);
            let blueBeginningValue = parseInt(beginningValues[3], 10);
            let blueEndingValue = parseInt(endingValues[3], 10);
            let red = parseInt(this.numberHandler(redBeginningValue, redEndingValue, progress, duration, easingFunction), 10);
            let green = parseInt(this.numberHandler(greenBeginningValue, greenEndingValue, progress, duration, easingFunction), 10);
            let blue = parseInt(this.numberHandler(blueBeginningValue, blueEndingValue, progress, duration, easingFunction), 10);
            red = getRgbWithInRangeValue(red);
            green = getRgbWithInRangeValue(green);
            blue = getRgbWithInRangeValue(blue);
            value = "rgb(" + red + "," + green + "," + blue + ")";
            return value;
        }
        rgbHandler(beginningValue, endingValue, progress, duration, easingFunction) {
            let value;
            let beginningValues = beginningValue.match(rgbRegEx);
            let endingValues = endingValue.match(rgbRegEx);
            let redBeginningValue;
            let redEndingValue;
            let greenBeginningValue;
            let greenEndingValue;
            let blueBeginningValue;
            let blueEndingValue;
            let beginningAlphaValue;
            let endingAlphaValue;
            let red;
            let green;
            let blue;
            let alpha;
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
        }
        prepareTransformValues() {
            let element = this.element;
            element.scaleX = element.scaleX || "1";
            element.scaleY = element.scaleY || "1";
            element.scaleZ = element.scaleZ || "1";
            element.rotateX = element.rotateX || "0deg";
            element.rotateY = element.rotateY || "0deg";
            element.rotateZ = element.rotateZ || "0deg";
            element.translateX = element.translateX || "0";
            element.translateY = element.translateY || "0";
            element.translateZ = element.translateZ || "0";
        }
        applyTransform() {
            let element = this.element;
            let transform = "scaleX(" + element.scaleX + ") scaleY(" + element.scaleY + ") scaleZ(" + element.scaleZ + ")";
            transform += " rotateX(" + element.rotateX + ") rotateY(" + element.rotateY + ") rotateZ(" + element.rotateZ + ")";
            transform += " translateX(" + element.translateX + ") translateY(" + element.translateY + ") translateZ(" + element.translateZ + ")";
            this.currentValues["webkitTransform"] = transform;
            this.currentValues["mozTransform"] = transform;
            this.currentValues["msTransform"] = transform;
            this.currentValues["transform"] = transform;
        }
        scaleXHandler(property, progress) {
            let element = this.element;
            let beginningValue = parseFloat(this.getBeginningValue(property));
            let endingValue = parseFloat(this.getEndingValue(property));
            let duration = this.duration;
            let easingFunction = this.easingFunction;
            let value = this.numberHandler(beginningValue, endingValue, progress, duration, easingFunction);
            element[property] = value;
            this.applyTransform();
        }
        rotateXHandler(property, progress) {
            let element = this.element;
            let value;
            value = this.calculateNumberUnit(property, progress);
            element[property] = value;
            this.applyTransform();
        }
        calculateColor(property, progress) {
            let beginningValue = this.getBeginningValue(property);
            let endingValue = this.getEndingValue(property);
            let duration = this.duration;
            let easingFunction = this.easingFunction;
            beginningValue = colorAliases[beginningValue.toLowerCase()] || beginningValue;
            endingValue = colorAliases[endingValue.toLowerCase()] || endingValue;
            if (beginningValue.indexOf("#") === 0) {
                beginningValue = convertHexToRgb(beginningValue);
            }
            if (endingValue.indexOf("#") === 0) {
                endingValue = convertHexToRgb(endingValue);
            }
            return this.rgbHandler(beginningValue, endingValue, progress, duration, easingFunction);
        }
        colorHandler(property, progress) {
            let value = this.calculateColor(property, progress);
            value = this.properties[property].isImportant ? value + " !important" : value;
            this.currentValues[property] = value;
        }
        numberHandler(beginningValue, endingValue, progress, duration, easingFunction) {
            let value;
            let change = endingValue - beginningValue;
            let currentTime = progress * duration;
            if (change !== 0) {
                value = easingFunction(currentTime, beginningValue, change, duration);
            }
            else {
                value = endingValue;
            }
            return value.toFixed(5);
        }
        calculateNumberUnit(property, progress) {
            let beginningValue = this.getBeginningValue(property);
            let endingValue = this.getEndingValue(property);
            let duration = this.duration;
            let easingFunction = this.easingFunction;
            let beginningResults = numberUnitRegEx.exec(beginningValue);
            let endingResults = numberUnitRegEx.exec(endingValue);
            let unit = beginningResults[2];
            if (typeof unit === "undefined") {
                throw new Error("Please use units for the '" + property + "', e.g. 10px, or 10%, 10em");
            }
            // To much precision hurts.
            let beginningFloat = Math.round(parseFloat(beginningResults[1]) * 100) / 100;
            let endingFloat = Math.round(parseFloat(endingResults[1]) * 100) / 100;
            let value = this.numberHandler(beginningFloat, endingFloat, progress, duration, easingFunction);
            return value += unit;
        }
        numberUnitHandler(property, progress) {
            let value = this.calculateNumberUnit(property, progress);
            value = this.properties[property].isImportant ? value + " !important" : value;
            this.currentValues[property] = value;
        }
        caclulateDecimal(property, progress) {
            let beginningValue = this.getBeginningValue(property);
            let endingValue = this.getEndingValue(property);
            let duration = this.duration;
            let easingFunction = this.easingFunction;
            beginningValue = parseFloat(beginningValue);
            endingValue = parseFloat(endingValue);
            return this.numberHandler(beginningValue, endingValue, progress, duration, easingFunction);
        }
        decimalHandler(property, progress) {
            let value = this.caclulateDecimal(property, progress);
            value = this.properties[property].isImportant ? value + " !important" : value;
            this.currentValues[property] = value;
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ElementAnimation;
});
//# sourceMappingURL=ElementAnimation.js.map