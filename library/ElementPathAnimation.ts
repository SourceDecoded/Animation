import Animation from './Animation.js';

const isVector = function (vector) {
    if (typeof vector.x !== "number" &&
        typeof vector.y !== "number" &&
        typeof vector.z !== "number"
    ) {
        return false;
    }

    return true;
};

const assertVector = function (vector) {
    let vectorString;

    if (!isVector(vector)) {

        try {
            vectorString = JSON.stringify(vector);
        } catch (e) {
            vectorString = "Couldn't stringify the vector because of recursive objects.";
        }

        throw new Error("Invalid vector: " + vectorString);
    }

};

const assertControlsAreVectors = function (controls) {
    if (!Array.isArray(controls)) {
        throw new Error("The animations controls need to be an array of vectors.");
    }

    let passed = controls.every(isVector);

    if (!passed) {
        throw new Error("Invalid control vectors.");
    }
};

const normalizeVector = function (vector) {
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

const calculatePosition = function (from, to, percent) {
    return ((to - from) * percent) + from;
};

export default class ElementPathAnimation extends Animation {

    duration;
    unit;
    from;
    to;
    controls;
    points;
    calculationMatrix;
    change;

    constructor(config) {
        super(config);

        config = config || {};

        this.target = config.target;
        this.duration = config.duration;
        this.unit = config.unit;
        this.from = config.from;
        this.to = config.to;
        this.controls = config.controls || [];
        this.points = [];
        this.calculationMatrix = [];

        if (!(this.target instanceof Element)) {
            throw new Error("The target must be an Element.");
        }

        if (typeof this.duration !== "number") {
            throw new Error("The animation's duration must be a number.");
        }

        if (typeof this.unit !== "string") {
            throw new Error("The animation's unit should be a string");
        }

        assertVector(this.from);
        assertVector(this.to);
        assertControlsAreVectors(this.controls);

        this.change = {
            x: this.to.x - this.from.x,
            y: this.to.y - this.from.y,
            z: this.to.z - this.from.z
        };

        this.points = this.controls.slice(0);
        this.points.unshift(this.from);
        this.points.push(this.to);

        this.points.forEach(normalizeVector);

        this.prepareTransformValues(this.target);
    }


    prepareTransformValues(element) {
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
    }

    applyTransform() {
        let element = this.target;
        let transform = "scaleX(" + element._scaleX + ") scaleY(" + element._scaleY + ") scaleZ(" + element._scaleZ + ")";
        transform += " rotateX(" + element._rotateX + ") rotateY(" + element._rotateY + ") rotateZ(" + element._rotateZ + ")";
        transform += " translateX(" + element._translateX + ") translateY(" + element._translateY + ") translateZ(" + element._translateZ + ")";

        element.style.webkitTransform = transform;
        element.style.mozTransform = transform;
        element.style.msTransform = transform;
        element.style.transform = transform;
    }

    reduce(points, percent, index, easing) {
        if (typeof index === "undefined") {
            index = 0;
        }

        let easingPercent = easing(this.progress * this.duration, 0, 1, this.duration);

        this.calculationMatrix[index] = points;
        let reducedPoints = this.calculationMatrix[index + 1] || [];

        points.reduce(function (reducedPoints, currentValue, index) {
            if (index !== points.length - 1) {
                let vector = reducedPoints[index] = reducedPoints[index] || { x: 0, y: 0, z: 0 };
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
    }

    render() {
        let target = this.target;
        let unit = this.unit;
        let progress = this.progress;
        let easing = this.easingFunction;
        let currentPosition = this.reduce(this.points, progress, 0, easing);

        target._translateX = currentPosition[0].x + unit;
        target._translateY = currentPosition[0].y + unit;

        // According to spec, translateZ cannot be any unit but px.
        target._translateZ = currentPosition[0].z + "px";

        this.applyTransform();

        return this;
    }

}