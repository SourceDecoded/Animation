var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "./Animation.js"], function (require, exports, Animation_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
    exports.default = ElementPathAnimation;
});
//# sourceMappingURL=ElementPathAnimation.js.map