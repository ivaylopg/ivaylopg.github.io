// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());


$(function(){

    /* * * * 
      This kickass css/js rotating cube is inspired by a post by Paul Hayes (http://paulrhayes.com), 
      and uses a good amout of his code. I made some changes, specifically to the interactivity in 
      the JS, but the CSS is all his, and the idea of doing an interactive cube with CSS transforms
      intead of WebGL is his too.
     * * * */

    var el = document.createElement('div'),
        transformProps = 'transform WebkitTransform MozTransform OTransform msTransform'.split(' '),
        transformProp = support(transformProps),
        transitionDuration = 'transitionDuration WebkitTransitionDuration MozTransitionDuration OTransitionDuration msTransitionDuration'.split(' '),
        transitionDurationProp = support(transitionDuration);

    function support(props) {
        for(var i = 0, l = props.length; i < l; i++) {
            if(typeof el.style[props[i]] !== "undefined") {
                return props[i];
            }
        }
    }

    var startX = -20.0;
    var startY = 45.0;
    var xRange = 30.0;
    var yRange = 35.0;
    var dur = 5000;
    var spinSpeed = 0.2;

    var viewCenter = {
        x: window.innerWidth/2,
        y: $("#theBlackBox").offset().top + ($("#theBlackBox").height()/2)
    }
    //$("#theBlackBox").offset().top - $(window).scrollTop() + ($("#theBlackBox").height()/2)

    Number.prototype.clamp = function(min, max) {
        return Math.min(Math.max(this, min), max);
    };


    //USE A TARGET AND INCREMENTAL CHANGES/////////////////////////////////////////////////////////////////
    var Vector2d = function(x,y) {
        this.x = x;
        this.y = y;
    };

    Vector2d.prototype.set = function(x,y) {
        this.x = x;
        this.y = y;
    };

    Vector2d.prototype.magSq =  function() {
        var x = this.x, y = this.y;
        return x * x + y * y;
    };

    Vector2d.prototype.mag = function(){
        return Math.sqrt(this.magSq());
    };

    Vector2d.prototype.add = function (x, y) {
        if (x instanceof Vector2d) {
            this.x += x.x;
            this.y += x.y;
            return this;
        }
        this.x += x;
        this.y += y;
        return this;
    };

    Vector2d.prototype.sub = function (x, y) {
        if (x instanceof Vector2d) {
            this.x -= x.x;
            this.y -= x.y;
            return this;
        }
        this.x -= x;
        this.y -= y;
        return this;
    };

    Vector2d.prototype.div = function (n) {
        this.x /= n;
        this.y /= n;
        return this;
    };

    Vector2d.prototype.mult = function (n) {
        this.x *= n;
        this.y *= n;
        return this;
    };

    Vector2d.prototype.normalize = function () {
        return this.div(this.mag());
    };

    Vector2d.prototype.setMag = function (n) {
        return this.normalize().mult(n);
    };


    var mouse = {
            start : {}
        },
        touch = document.ontouchmove !== undefined,
        viewport = {
            posVector: new Vector2d(startX, startY),
            targVector: new Vector2d(startX, startY),
            speed: spinSpeed,
            el: $('.cube')[0],
            update: function(coords) {
                if(coords && (typeof coords.x === "number" && typeof coords.y === "number")) {
                    this.targVector.x = coords.x.clamp(startX-xRange, startX+xRange);
                    this.targVector.y = coords.y.clamp(startY-yRange, startY+yRange);
                }
                //console.log(Math.floor(coords.x),Math.floor(coords.y));
            },
            move: function() {
                var dirVector = new Vector2d(this.targVector.x - this.posVector.x, this.targVector.y - this.posVector.y);
                if (dirVector.mag() > this.speed) {
                     dirVector.setMag(this.speed);
                }
                this.posVector.add(dirVector);
                this.el.style[transformProp] = "rotateX("+this.posVector.x+"deg) rotateY("+this.posVector.y+"deg)";
            },
            reset: function() {
                this.update({x: startX, y: startY});
                delete mouse.last;
                mouse.start.x = viewCenter.x;
                mouse.start.y = viewCenter.y;
            }
        };

    viewport.duration = function() {
        //viewport.el.style[transitionDurationProp] = dur + "ms";
        return dur;
    }();

    var animId;
    function draw(){
        viewport.move();
        animId = requestAnimationFrame(draw);
    }
    animId = requestAnimationFrame(draw);

    

    $(document).keydown(function(evt) {
        switch(evt.keyCode)
        {
            case 27: //esc
                viewport.reset();
                break;

            default:
                break;
        };
    })

    $("#theBlackBox").mouseenter(function(evt){
        //console.log("IN");

        delete mouse.last;
        

        //mouse.start.x = evt.pageX;
        //mouse.start.y = evt.pageY;

        mouse.start.x = viewCenter.x;
        mouse.start.y = viewCenter.y;
        // console.log(mouse.start);

        ///*
        $(document).bind('mousemove', function(event) {
            event.preventDefault();
            $('#theBlackBox').trigger('move-viewport', {x: event.pageX, y: event.pageY});
        });
        //*/

    });

    $("#theBlackBox").mouseleave(function(evt){
        //console.log("OUT");

        viewport.reset();
        delete mouse.last;
        mouse.start.x = viewCenter.x;
        mouse.start.y = viewCenter.y;

        $(document).unbind('mousemove');
    });



    $('#theBlackBox').bind('move-viewport', function(evt, movedMouse) {
        movementScaleFactor = 4;

        viewport.update({
            x: viewport.posVector.x + parseInt((viewCenter.y - movedMouse.y)/movementScaleFactor),
            y: viewport.posVector.y - parseInt((viewCenter.x - movedMouse.x)/movementScaleFactor)
        });

        //console.log("mouse: ", movedMouse.x,movedMouse.y, "viewCenter: ", viewCenter.x, viewCenter.y, "offset: ", $("#theBlackBox").offset().top, "scroll: ", $(window).scrollTop(), "height: ", $("#theBlackBox").height());
    });

});
