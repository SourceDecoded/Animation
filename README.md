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



