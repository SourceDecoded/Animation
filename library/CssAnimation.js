define(["require", "exports", "./CustomRenderAnimation"], function (require, exports, CustomRenderAnimation_1) {
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
    class CssAnimation extends CustomRenderAnimation_1.default {
        constructor(config) {
            config.originalRenderer = config.renderer;
            config.renderer = (values) => {
                var target = this.target;
                var hasTransform = false;
                Object.keys(values).forEach((key) => {
                    if (transformMappings[key]) {
                        hasTransform = true;
                        return;
                    }
                    target[key] = values[key];
                });
                if (hasTransform) {
                    this.handleTransforms(values, target);
                }
                if (config.target == null && typeof config.originalRenderer === "function") {
                    config.originalRenderer(target);
                }
            };
            super(config);
            this.target = config.target || {};
        }
        handleTransforms(values, target) {
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
                let transform = "scaleX(" + values.scaleX + ") scaleY(" + values.scaleY + ") scaleZ(" + values.scaleZ + ")";
                transform += " rotateX(" + values.rotateX + ") rotateY(" + values.rotateY + ") rotateZ(" + values.rotateZ + ")";
                transform += " translateX(" + values.translateX + ") translateY(" + values.translateY + ") translateZ(" + values.translateZ + ")";
                this.target["webkitTransform"] = transform;
                this.target["mozTransform"] = transform;
                this.target["msTransform"] = transform;
                this.target["transform"] = transform;
            }
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CssAnimation;
});
//# sourceMappingURL=CssAnimation.js.map