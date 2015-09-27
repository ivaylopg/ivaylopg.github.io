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

    if ($("body").hasClass("showCube")) {
        console.log("cube!");

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

        function draw(){
            Cube.viewport.move();
            animId = requestAnimationFrame(draw);
        }
        animId = requestAnimationFrame(draw);

    };

    $(".hiddenEmail").html(rot13rot5Encode('<n pynff="yvaxNavz" uers="znvygb:pbagnpg@vinlybtrgbi.pbz">pbagnpg@vinlybtrgbi.pbz</n>'));
    $(".hiddenPhone").html(rot13rot5Encode('<n uers="gry:+68658391837" pynff="yvaxNavz">556.865.839.1837</n>'));

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

    if ($("body").hasClass("showCube")) {
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
            //Cube.viewport.reset();
            break;

        default:
            break;
    }
});


////////////////////////
// CUSTOM FUNCTIONS



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
