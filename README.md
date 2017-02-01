Getting Started with Clarity Animation
===
Install Clarity Animation with npm.
```bash
npm install clarity-animation
```

[Examples](https://sourcedecoded.github.io/Animation/)

## Use Cases
Because Clarity Animation uses UMD (Universal Module Declaration) it can work
with a variety of technologies. It can be used with CommonJs, AMD, or SystemJs. Just 
decide which module system works for you and import clarity-animation. This also 
means that if you use transpilers like Babel or Typescript you can also use it. Even if 
you don't use a module system you can still use clarity-animation. It will detect that 
there isn't any module system and assign clarityAnimation to the global object. 
So go out and make applications prettier. Happy animating!

## Clarity Animation Mission
The clarity-animation package wants to solve your complicated animation needs in simplest of patterns. Making a application beautiful shouldn't be hard. So if there is a better way to 
describle animations and timelines let us know, and lets have a great conversation.

## Animations vs Timelines
In clarity-animation there are two basic things you need to use, the Animation classes and Timeline classes.
The animation class gives you the ability to describe the properties to change, the easing, and the duration.
We found early on in our development we needed to be able to compose animations with different easings and durations.
Timelines answer that problem. They allow you to compose animations together in a way that gaurantees the 
animations to remain in sync with one another, forward or backward. Since Timelines are really animations, this also means you can compose timelines with in
timelines. Really the complexity of the animations is limitless but the ease of composing them is simple. 

## Examples
With in the clarity-animation package is an example folder. Please browse through the examples. 
It will teach you many things that documentation wont. They also provide a foundation of ideas
that can be used while building animations.

## Whats included?
* Animation
* CssAnimation
* ElementAnimation
* ElementPathAnimation
* Timeline
* PercentageTimeline

There are six different classes to make animations with. There is the root class Animation, 
from which all classes are derived. CssAnimation animates an object with properties that resemble
css names and understands the units involved with those property names. ElementAnimation animates elements. ElementPathAnimation 
animates elements through bezier curves with points and controls. Timeline allows you to compose many 
animations into a concert of animations using offsets. PercentageTimeline does the same 
as the Timeline but instead uses the principles of startAt and endAt to compose the animations.

## Clarity Animation
```bash
npm install clarity-animation
```
Add a index.html file to the directory so it looks something like this.

    * index.html
    * node_modules
        * clarity-animation
        
Copy the contents of this example and paste it into the index.html file.

```html
<html>
    <head>
        <title>Script Tag Exmaple</title>
        <style>
            .box {
                width: 100px;
                height:100px;
                border: 1px solid #000000;
            }
        </style>
    </head>
    <body>

        <div id="my-box" class="box"></div>

        <script src="./node_modules/clarity-animation/dist/main.js"></script>
        <script>
                var ElementAnimation = clarityAnimation.ElementAnimation;
                var box = document.querySelector("#my-box");

                var animation = new ElementAnimation({
                    target: box,
                    properties: {
                        backgroundColor: {
                            from: "rgba(0,0,0,0)",
                            to: "#ff0000"
                        }
                    },
                    duration: 10000,
                    easing: "easeOutExpo"
                });

                animation.playToEndAsync();
        </script>
    </body>
</html>
```


## Clarity Animation with Reactjs
In the root of your Reactjs folder install Clarity Animation with npm. 
```bash
npm install clarity-animation --save
```
Now that Clarity Animation is installed start using it in one of your components.
```js
import React, { Component } from "react";
import { CssAnimation } from "clarity-animation";

const myStyles = {
    backgroundColor: "rgba(100,100,200,0.5)",
    width: "100px",
    height: "100px"
};

class MyComponent extends Component {
    constructor(props){
        super(props);

        var animation = new CssAnimation({
            target: myStyles,
            properties: {
                backgroundColor: {
                    from: myStyles.backgroundColor,
                    to: "#ff0000"
                }
            },
            duration: 10000,
            easing: "easeOutExpo"
        });

        animation.observe("tick", ()=>{
            this.forceUpdate();
        });

        this.animation = animation;
    }
    componentDidMount(){
        this.animation.playToEndAsync().then(()=>{
            console.log("Finished Animation");
        });
    }
    render(){

        return (
            <div style={myStyles}>
                Hello Animation!
            </div>            
        );

    }

}
```

## Requirejs with Clarity Animation
```bash
npm install clarity-animation
```

After running the npm command, downloading [requirejs](http://requirejs.org/docs/download.html)
, and adding a index.html file, the folder structure would look something like this.

    - index.html
    - require.js
    - node_modules
        -clarity-animation
        
Copy the contents of this example and paste it into the index.html file.

```html
<html>
    <head>
        <title>Using Animation</title>
    </head>
    <body>
        <script src="require.js"></script>
        <script>
            require(["./node_modules/clarity-animation/dist/main.js"], function(clarityAnimation){
                var CssAnimation = clarityAnimation.CssAnimation;

                var target = {
                    backgroundColor: "#123456"
                };

                var animation = new CssAnimation({
                    target: target,
                    properties: {
                        backgroundColor: {
                            from: target.backgroundColor,
                            to: "#ff0000"
                        }
                    },
                    duration: 1000,
                    easing: "easeOutExpo"
                });
                                    
                animation.observe("tick", function(){
                    document.body.style.backgroundColor = target.backgroundColor;
                });

                animation.playToEndAsync();
                });
        </script>
    </body>
</html>
```

Documentation
===

## Animation Easings
* linear (Default)
* easeInQuad
* easeOutQuad
* easeInOutQuad
* easeInCubic
* easeOutCubic
* easeInOutCubic
* easeInQuart
* easeOutQuart
* easeInOutQuart
* easeInQuint
* easeOutQuint
* easeInOutQuint
* easeInSine
* easeOutSine
* easeInOutSine
* easeInExpo
* easeOutExpo
* easeInOutExpo
* easeInCirc
* easeOutCirc
* easeInOutCirc
* easeInElastic
* easeOutElastic
* easeInOutElastic
* easeInBack
* easeOutBack
* easeInOutBack
* easeInBounce
* easeOutBounce
* easeInOutBounce


## Repeating 
There are two properties to control repeating. The first is the "repeat" property on the animation,
and the "repeatDirection". The "repeat" property controls how many times
the animation will repeat. You can use "Infinity" to mean.... well infinity and 
any integer to express the amount of times you would like the animation to repeat.

For "repeatDirection" you can use two values, 0 or 1. We have two static properties on
the Animation class to help remember what is what. 0 is the default repeat which starts from the
beginning, and 1 which is the alternating repeat. Alternating means that the animation will
go back and forward like a swing. 

```js
...
animation.repeat = Infinity;
animation.repeatDirection = Animation.REPEAT_DEFAUT; 
...
// or
animation.repeat = 10;
animation.repeatDirection = Animation.REPEAT_ALTERATE; 
```

Animation
====
This class can animate any property on any object as long as its a number. 
If you would like to animate SVGs this is the class for you. 

```js
var obj = {
    width: 0,
    height: 0
};

var animation = new clarityAnimation.Animation({
    target: obj,
    properties: {
        width: {
            from: 0,
            to: 100
        },
        height: {
            from: 0,
            to: 100
        }
    },
    duration: 1000,
    easing: "easeOutExpo"
});
```

ElementAnimation
===
This section will discuss the possibilities of ElementAnimation.

## List of Animatable Properties for ElementAnimation.
* width
* height
* lineHeight
* top
* right
* bottom
* left
* fontSize
* borderTopWidth
* borderBottomWidth
* borderRightWidth
* borderLeftWidth
* borderTopColor
* borderBottomColor
* borderLeftColor
* borderRightColor
* marginTop
* marginBottom
* marginLeft
* marginRight
* paddingTop
* paddingBottom
* paddingLeft
* paddingRight
* opacity
* color
* backgroundColor
* rotateX
* rotateY
* rotateZ
* scaleX
* scaleY
* scaleZ
* translateX
* translateY
* translateZ

```js
    var div = document.createElement("div");
    var animation = new ElementAnimation({
        target: div,
        properties: {
            backgroundColor: {
                from: "rgba(0,0,0,1)",
                to: "rgba(100,0,100,0.5)"
            }
        },
        duration: 2000,
        easing: "easeOutExpo"
    });

```

Timeline
===
```js
    var div = document.createElement("div");
    var div2 = document.createElement("div");

    var opacityAnimation = new ElementAnimation({
        target: div,
        properties: {
            opacity: {
                from: 0,
                to: 1
            }
        },
        duration: 2000,
        easing: "easing"
    });

    var moveAnimation = new ElementAnimation({
        target: div,
        properties: {
            left: {
                from: "0px",
                to: "100px"
            }
        },
        duration: 2000,
        easing: "easeOutExpo"
    });

    moveDiv2Animation = new ElementAnimation({
        target: div2,
        properties: {
            left: {
                from: "100px",
                to: "200px"
            }
        },
        duration: 2000,
        easing: "easeOutExpo"
    });

    var timeline = new Timeline();
    timeline.add({
        animation: opacityAnimation,
        offset: 0
    },{
        animation: moveAnimation,
        offset: 0
    },{
        animation: moveDiv2Animation,
        offset: 0
    });

    timeline.play();

```

PercentageTimeline
===
PercentageTimeline really works well when thinking about a concert of animations.
You just need to think about when something will start and finish. If you need 
an animation to start at the beginning and end half way through, and another 
animation to start half way through and end three quarters of the way through. This 
is the class for you. After deciding the composition, you can adjust the duration until
its perfect.

```js
    var div = document.createElement("div");
    var div2 = document.createElement("div");

    var opacityAnimation = new ElementAnimation({
        target: div,
        properties: {
            opacity: {
                from: 0,
                to: 1
            }
        },
        duration: 2000,
        easing: "easing"
    });

    var moveAnimation = new ElementAnimation({
        target: div,
        properties: {
            left: {
                from: "0px",
                to: "100px"
            }
        },
        duration: 2000,
        easing: "easeOutExpo"
    });

    moveDiv2Animation = new ElementAnimation({
        target: div2,
        properties: {
            left: {
                from: "100px",
                to: "200px"
            }
        },
        duration: 2000,
        easing: "easeOutExpo"
    });

    var timeline = new PercentageTimeline(2000);
    timeline.add({
        animation: opacityAnimation,
        startAt: 0,
        endAt: 1
    },{
        animation: moveAnimation,
        startAt: 0,
        endAt: 0.5
    },{
        animation: moveDiv2Animation,
        startAt: 0.5,
        endAt: 1
    });

    timeline.play();

```

Methods on Animations and Timelines.
===
## observe(type: string, callback )
Observable Events
* start
* end
* tick
* play
* reverse
* stop
* pause
* restart


```js
...
animation.observe("tick", function(){
    console.log("tick");    
});
...

```

## play( )
Plays the animation from its current position to the end.
```js
...
animation.play();
...

```

## playToEndAsync( ):Promise
Plays the animation from its current position to the end, and returns a Promise. When the animation makes it to the end of the animation, the promise is resolved. If any other actions are taken on the animation the promise will not be fulfilled.
```js
...
animation.playToEndAsync();
...

```

## playToPercentageAsync( percentage: number ):Promise
Plays the animation from its current position to the percentage given, and returns a Promise. When the animation makes it to the end of the animation, the promise is resolved. If any other actions are taken on the animation the promise will not be fulfilled.
The percentage number is expected to be 0-100.
```js
...
animation.playToPercentageAsync(50);
...

```

## pause( )
Pauses the animation.
```js
...
animation.pause();
...

```

## restart( )
Restarts the animation from the beginning.
```js
...
animation.restart();
...
```

## reverse( )
Sends the animation in reverse from its current position to the beginning.
```js
...
animation.reverse();
...

```

## reverseToStartAsync( ):Promise
Sends the animation in reverse from its current position to the beginning. When the animation makes it to the beginning of the animation, the promise is resolved. If any other actions are taken on the animation the promise will not be fulfilled.
```js
...
animation.reverseToStartAsync();
...

```

## reverseToPercentageAsync( percentage: number ):Promise
Sends the animation in reverse from its current position to the percentage given. When the animation makes it to the beginning of the animation, the promise is resolved. If any other actions are taken on the animation the promise will not be fulfilled.
The percentage number is expected to be 0-100.
```js
...
animation.reverseToStartAsync(50);
...

```

## seek( percentage: number )
If you seek when the animation is stopped, it will not render. Use pause then seek instead. 
```js
animation.pause().seek(0.3);
```
Or use 
```js
animation.seek(0.3).render();
```
Use stop and seek if you don't want the viewer to know that animation is positioned to some 
other time then what is rendered.
```js
...
// Seek to this percentage of the animation.
animation.seek(0.5);
...

```

## setTimeScale( percentage: number )
```js
...
// Go twice as fast
animation.setTimeScale(2);
...

```

## getTimeScale()
```js
...
var scale = animation.getTimeScale();
...

```

## getProgress()
```js
...
var progress = animation.getProgress();
...

```

## render()
This forces an update on the properties being animated.
```js
...
animation.render();
...

```

