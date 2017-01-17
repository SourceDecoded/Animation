import Animation from "./Animation";
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
var mapping = {
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
    rotateX: { handler: "unitTransformHandler", alias: "rotateX" },
    rotateY: { handler: "unitTransformHandler", alias: "rotateY" },
    rotateZ: { handler: "unitTransformHandler", alias: "rotateX" },
    scaleX: { handler: "decimalTransformHandler", alias: "scaleX" },
    scaleY: { handler: "decimalTransformHandler", alias: "scaleY" },
    scaleZ: { handler: "decimalTransformHandler", alias: "scaleZ" },
    translateX: { handler: "unitTransformHandler", alias: "translateX" },
    translateY: { handler: "unitTransformHandler", alias: "translateY" },
    translateZ: { handler: "unitTransformHandler", alias: "translateZ" },
};
export default class StyleAnimation extends Animation {
    constructor(config) {
        super(config);
        this.prepareTransformValues();
        this.mapping = mapping;
    }
    render() {
        var progress = this.progress;
        var properties = this.properties;
        var propertyHandlerName;
        var property;
        var value;
        for (property in properties) {
            propertyHandlerName = this.mapping[property].handler;
            var handler = this[propertyHandlerName];
            if (typeof handler !== "function") {
                throw new Error("Doesn't support '" + property + "' style animations.");
            }
            this[propertyHandlerName](property, progress);
        }
        return this;
    }
    getEndingValue(property) {
        var endingValue = this.properties[property];
        if (typeof endingValue === "object" && endingValue !== null) {
            endingValue = endingValue.to;
        }
        return endingValue;
    }
    getBeginningValue(property) {
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
    }
    calculateColor(property, progress) {
        var value;
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
    }
    colorHandler(property, progress) {
        var value = this.calculateColor(property, progress);
        value = this.properties[property].isImportant ? value + " !important" : value;
        this.target[property] = value;
    }
    numberHandler(beginningValue, endingValue, progress, duration, easingFunction) {
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
    }
    decimalTransformHandler(property, progress) {
        var target = this.target;
        var beginningValue = parseFloat(this.getBeginningValue(property));
        var endingValue = parseFloat(this.getEndingValue(property));
        var duration = this.duration;
        var easingFunction = this.easingFunction;
        var value = this.numberHandler(beginningValue, endingValue, progress, duration, easingFunction);
        target[property] = value;
        this.applyTransform();
    }
    unitTransformHandler(property, progress) {
        var target = this.target;
        var value;
        value = this.calculateNumberUnit(property, progress);
        target[property] = value;
        this.applyTransform();
    }
    calculateNumberUnit(property, progress) {
        var value;
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
    }
    numberUnitHandler(property, progress) {
        var value = this.calculateNumberUnit(property, progress);
        value = this.properties[property].isImportant ? value + " !important" : value;
        this.target[property] = value;
    }
    caclulateDecimal(property, progress) {
        var value;
        var beginningValue = this.getBeginningValue(property);
        var endingValue = this.getEndingValue(property);
        var duration = this.duration;
        var easingFunction = this.easingFunction;
        beginningValue = parseFloat(beginningValue);
        endingValue = parseFloat(endingValue);
        return this.numberHandler(beginningValue, endingValue, progress, duration, easingFunction);
    }
    decimalHandler(property, progress) {
        var value = this.caclulateDecimal(property, progress);
        value = this.properties[property].isImportant ? value + " !important" : value;
        this.target[property] = value;
    }
    rgbaHandler(beginningValue, endingValue, progress, duration, easingFunction) {
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
    }
    ;
    rgbHandler(beginningValue, endingValue, progress, duration, easingFunction) {
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
    }
    prepareTransformValues() {
        var target = this.target;
        target.scaleX = target.scaleX || "1";
        target.scaleY = target.scaleY || "1";
        target.scaleZ = target.scaleZ || "1";
        target.rotateX = target.rotateX || "0deg";
        target.rotateY = target.rotateY || "0deg";
        target.rotateZ = target.rotateZ || "0deg";
        target.translateX = target.translateX || "0";
        target.translateY = target.translateY || "0";
        target.translateZ = target.translateZ || "0";
    }
    ;
    applyTransform() {
        var target = this.target;
        var transform = "scaleX(" + target.scaleX + ") scaleY(" + target.scaleY + ") scaleZ(" + target.scaleZ + ")";
        transform += " rotateX(" + target.rotateX + ") rotateY(" + target.rotateY + ") rotateZ(" + target.rotateZ + ")";
        transform += " translateX(" + target.translateX + ") translateY(" + target.translateY + ") translateZ(" + target.translateZ + ")";
        this.target["webkitTransform"] = transform;
        this.target["mozTransform"] = transform;
        this.target["msTransform"] = transform;
        this.target["transform"] = transform;
    }
}
//# sourceMappingURL=StyleAnimation.js.map