////////////////////////
// GLOBAL VARS

var isMobile = false;

var el = document.createElement('div'),
    transformProps = 'transform WebkitTransform MozTransform OTransform msTransform'.split(' '),
    transformProp = support(transformProps);

/* var transitionDuration = 'transitionDuration WebkitTransitionDuration MozTransitionDuration OTransitionDuration msTransitionDuration'.split(' '),
    transitionDurationProp = support(transitionDuration); //*/

var animId;
var tinyCube = false;

////////////////////////
// SETUP ON READY

$(document).ready(function() {

    if (window.innerWidth < 500) {
        tinyCube = true;
        Cube.resize(window.innerWidth);
    }

    if (Modernizr.touch) {
        //console.log("touch enabled device");
        Cube.autoRotate = true;
        var el = $(".cube");
        el.on("touchstart", function(e){
            if($(e.target).is('a, iframe')) {
                return true;
            }
            e.stopPropagation();
            el.addClass("pulse");
            setTimeout(function(){
                el.removeClass("pulse");
            }, 2000);
        });
    }

    $(".hiddenEmail").html(rot13rot5Encode('<n uers="znvygb:pbagnpg@vinlybtrgbi.pbz">pbagnpg@vinlybtrgbi.pbz</n>'));
    $(".hiddenPhone").html(rot13rot5Encode('<n>+6.865.839.1837</n>'));

    function draw(){
        Cube.viewport.move();
        animId = requestAnimationFrame(draw);
    }
    animId = requestAnimationFrame(draw);

});

////////////////////////
// EVENTS

$( window ).load(function() {
    if (jQuery.browser.mobile === true) {
        isMobile = true;
        $("body").addClass("isMobile");
    } else {
        $("body").addClass("isNotMobile");
    }

    if (!isMobile) {
    }
});

on_resize(function() {
    //Throttled on-resize handler
    var winWidth = window.innerWidth;
    if (winWidth < 500) {
        tinyCube = true;
    } else {
        if (tinyCube === true) {
            tinyCube = false;
            Cube.resize(0);
        }
        
    }

    if (Cube !== undefined) {
        Cube.viewCenter = {
            x: winWidth/2,
            y: $("#theBlackBox").offset().top + ($("#theBlackBox").height()/2)
        };
      
        if (tinyCube) {
            Cube.resize(winWidth);
        }
    }
})();

$( window ).resize(function() {
    //Normal on-resize handler
});

$(window).scroll(function(e) {
});

$(document).keydown(function(e) {
    switch(e.keyCode)
    {
        case 27: //esc
            Cube.viewport.reset();
            break;

        default:
            break;
    }
});

$("#theBlackBox").mouseenter(function(e){
    $(document).on('mousemove', function(event) {
        event.preventDefault();
        $('#theBlackBox').trigger('move-viewport', {x: event.pageX, y: event.pageY});
    });
});

$("#theBlackBox").mouseleave(function(e){
    Cube.viewport.reset();
    $(document).off('mousemove');
});



$('#theBlackBox').on('move-viewport', function(e, movedMouse) {
    var movementScaleFactor = 4;

    Cube.viewport.update({
        x: Cube.viewport.posVector.x + parseInt((Cube.viewCenter.y - movedMouse.y)/movementScaleFactor),
        y: Cube.viewport.posVector.y - parseInt((Cube.viewCenter.x - movedMouse.x)/movementScaleFactor)
    });

    //console.log("mouse: ", movedMouse.x,movedMouse.y, "viewCenter: ", viewCenter.x, viewCenter.y, "offset: ", $("#theBlackBox").offset().top, "scroll: ", $(window).scrollTop(), "height: ", $("#theBlackBox").height());
});



////////////////////////
// CUSTOM FUNCTIONS




////////////////////////
// THE CUBE

    /* * * * 
      This kickass css/js rotating cube is inspired by a post by Paul Hayes (http://paulrhayes.com), 
      and uses a good amout of his code. I made some changes, specifically to the interactivity in 
      the JS, but the CSS is all his, and the idea of doing an interactive cube with CSS transforms
      intead of WebGL is his too.
     * * * */

var Cube = {
    startX: -20.0,
    startY: 45.0,
    xRange: 30.0,
    yRange: 35.0,
    spinSpeed: 0.2,
    autoRotate: false,
    viewport: {},
    viewCenter: {
        x: window.innerWidth/2,
        y: $("#theBlackBox").offset().top + ($("#theBlackBox").height()/2)
    }
};

Cube.viewport = {
    posVector: new Vector2d(Cube.startX, Cube.startY),
    targVector: new Vector2d(Cube.startX, Cube.startY),
    speed: Cube.spinSpeed,
    el: $('.cube')[0],
    update: function(coords) {
        if(coords && (typeof coords.x === "number" && typeof coords.y === "number")) {
            this.targVector.x = coords.x.clamp(Cube.startX-Cube.xRange, Cube.startX+Cube.xRange);
            this.targVector.y = coords.y.clamp(Cube.startY-Cube.yRange, Cube.startY+Cube.yRange);
        }
        //console.log(Math.floor(coords.x),Math.floor(coords.y));
    },
    move: function() {
        if (!Cube.autoRotate){
            var dirVector = new Vector2d(this.targVector.x - this.posVector.x, this.targVector.y - this.posVector.y);
            if (dirVector.mag() > this.speed) {
                 dirVector.setMag(this.speed);
            }
            this.posVector.add(dirVector);
        } else {
            this.posVector.y += Cube.spinSpeed/2;
        }
        

        if (this.posVector.y >= Cube.startY+(36000)) {
            this.posVector.y = Cube.startY;
        }
        this.el.style[transformProp] = "rotateX("+this.posVector.x+"deg) rotateY("+this.posVector.y+"deg)";
    },
    reset: function() {
        this.update({x: Cube.startX, y: Cube.startY});
    }
};

Cube.resize = function(winWidth){
    // The CSS cube stops centering correctly at widths < ~400px.
    // I'm sure there's a better way to do this in CSS, but this 
    // way works without noticeable slowdown or overhead, so....yeah.

    if (winWidth === 0) {
        $(".cube").removeAttr("style");
        $(".cube div").removeAttr("style");
        $('.cube')[0].style[transformProp] = "rotateX("+Cube.viewport.posVector.x+"deg) rotateY("+Cube.viewport.posVector.y+"deg)";
    } else {
        var ratio = (winWidth/500);
        ratio.clamp(0.75,1.0);

        $(".cube").css({
            "height": 400 * ratio + "px",
            "width": 400 * ratio +"px"
        });
        $(".cube > div").css({
            "height": 360 * ratio + "px",
            "width": 360 * ratio +"px",
            "padding": 20 * ratio +"px"
        });

        $(".cube > div:first-child")[0].style[transformProp] = "rotateX(90deg) translateZ("+200 * ratio+"px)";
        $(".cube > div:nth-child(2)")[0].style[transformProp] = "translateZ("+200 * ratio+"px)";
        $(".cube > div:nth-child(3)")[0].style[transformProp] = "rotateY(90deg) translateZ("+200 * ratio+"px)";
        $(".cube > div:nth-child(4)")[0].style[transformProp] = "rotateY(180deg) translateZ("+200 * ratio+"px)";
        $(".cube > div:nth-child(5)")[0].style[transformProp] = "rotateY(-90deg) translateZ("+200 * ratio+"px)";
        $(".cube > div:nth-child(6)")[0].style[transformProp] = "rotateX(-90deg) rotate(180deg) translateZ("+200 * ratio+"px)";
    }
    
};


////////////////////////
// UTILITIES

// debulked onresize handler
function on_resize(c,t){onresize=function(){clearTimeout(t);t=setTimeout(c,250);};return c;}


// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());



// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// MIT license
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || 
                                      window[vendors[x]+'CancelRequestAnimationFrame'];
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

function support(props) {
    for(var i = 0, l = props.length; i < l; i++) {
        if(typeof el.style[props[i]] !== "undefined") {
            return props[i];
        }
    }
}


//Extend JS with clamp function
Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
};