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
define(["require", "exports", "./CustomRenderAnimation"], function (require, exports, CustomRenderAnimation_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
            var render = config.render || config.renderer;
            config.render = function (values) {
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
                if (typeof render === "function") {
                    render(target);
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
    exports.default = CssAnimation;
});
//# sourceMappingURL=CssAnimation.js.map