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
define(["require", "exports", "./CssAnimation"], function (require, exports, CssAnimation_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ElementAnimation = (function (_super) {
        __extends(ElementAnimation, _super);
        function ElementAnimation(config) {
            var _this = this;
            var element = config.target;
            config.target = null;
            config.render = function (values) {
                Object.keys(values).forEach(function (property) {
                    element.style[property] = values[property];
                });
            };
            _this = _super.call(this, config) || this;
            return _this;
        }
        return ElementAnimation;
    }(CssAnimation_1.default));
    exports.default = ElementAnimation;
});
//# sourceMappingURL=ElementAnimation.js.map