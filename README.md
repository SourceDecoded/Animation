Getting Started with Clarity Animation
===

Install Clarity Animation with npm.
```bash
npm install clarity-animation
```
## Use Cases
Because Clarity Animation uses UMD (Universal Module Declaration) it can work
with a variety of technologies. It can be used with CommonJs, AMD, or SystemJs. Just 
decide which module system works for you and import clarity-animation. This also 
means that if you use transpilers like Babel or Typescript you can also use it.

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

## Animation Configurations
```json
    {
        "target": {
            x: 0,
            y: 0
        },
        "properties":{
            x: {
                from: 0,
                to: 100
            },
            y: {
                from: 0,
                to: 100
            }
        },
        "duration": 1000,
        "easing": "easeOutExpo"
    }
```

## ElementAnimation Configurations
```json
    {
        "target": div,
        "properties":{
           backgroundColor: {
               from: "rgba(255,255,0,1)",
               to: "#ff0000"
           }
        },
        "duration": 1000,
        "easing": "easeOutExpo"
    }
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

```

## play( )
Plays the animation from its current position to the end.
```js
...
animation.play();
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


## playToEndAsync( ):Promise
Plays the animation from its current position to the end, and returns a Promise. When the animation makes it to the end of the animation, the promise is resolved. If any other actions are taken on the animation the promise will not be fulfilled.
```js
...
animation.playToEndAsync();
...

```

## reverse( )
Sends the animation in reverse from its current position to the beginning.
```js
...
animation.reverse();
...

```

## reverseToEndAsync( ):Promise
Sends the animation in reverse from its current position to the beginning. When the animation makes it to the beginning of the animation, the promise is resolved. If any other actions are taken on the animation the promise will not be fulfilled.
```js
...
animation.reverseToEndAsync();
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


