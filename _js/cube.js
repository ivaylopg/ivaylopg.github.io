////////////////////////
// THE CUBE

/* global localResizers */

var animId;
var tinyCube = false;

$(document).ready(function() {
  if ($("#theBlackBox").length) {

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

  }
});

localResizers.push(function() {
  if ($("#theBlackBox").length) {
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

});



/* * * *
  This kickass css/js rotating cube is inspired by a post by Paul Hayes (http://paulrhayes.com),
  and uses a good amout of his code. I made some changes, specifically to the interactivity in
  the JS, but the CSS is all his, and the idea of doing an interactive cube with CSS transforms
  intead of WebGL is his too.
 * * * */

var el = document.createElement('div'),
    transformProps = 'transform WebkitTransform MozTransform OTransform msTransform'.split(' '),
    transformProp = support(transformProps);

/* var transitionDuration = 'transitionDuration WebkitTransitionDuration MozTransitionDuration OTransitionDuration msTransitionDuration'.split(' '),
    transitionDurationProp = support(transitionDuration); //*/



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
