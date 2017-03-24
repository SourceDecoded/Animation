import CssAnimation from "./CssAnimation";

export default class ElementAnimation extends CssAnimation {
    element: HTMLElement;

    constructor(config) {
        var element = config.target;
        config.target = null;
        config.render = function (values) {
            Object.keys(values).forEach((property) => {
                element.style[property] = values[property];
            });
        };
        super(config);
    }
}