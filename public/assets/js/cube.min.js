////////////////////////
// THE CUBE

/* global localResizers */

var animId;
var mouseAnimId;
var mousePrevTime;
var tinyCube = false;
var transformProp = 'transform';

// $(document).ready(function() {
  if ($("#theBlackBox").length) {

    if (window.innerWidth < 500) {
        tinyCube = true;
        Cube.resize(window.innerWidth);
    }

    if (Modernizr.touch) {
      Cube.autoRotate = true;
      // Disable CSS transition for RAF-driven auto-rotate
      $('.cube')[0].style.transition = 'none';

      var touchEl = $(".cube");
      touchEl.on("touchstart", function(e){
        if($(e.target).is('a, iframe')) {
            return true;
        }
        e.stopPropagation();
        touchEl.addClass("pulse");
        setTimeout(function(){
          touchEl.removeClass("pulse");
        }, 2000);
      });

      var drawPrevTime;
      function draw(timestamp){
        if (!drawPrevTime) drawPrevTime = timestamp;
        var deltaTime = timestamp - drawPrevTime;
        drawPrevTime = timestamp;
        Cube.viewport.move(deltaTime);
        animId = requestAnimationFrame(draw);
      }
      animId = requestAnimationFrame(draw);
    }

  }
// });

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

var Cube = {
    startX: -20.0,
    startY: 45.0,
    xRange: 30.0,
    yRange: 35.0,
    spinSpeed: 0.2,
    autoRotate: false,
    currentX: -20.0,
    currentY: 45.0,
    targetX: -20.0,
    targetY: 45.0,
    viewport: {},
    viewCenter: {
        x: window.innerWidth/2,
        y: $("#theBlackBox").offset().top + ($("#theBlackBox").height()/2)
    }
};

Cube.viewport = {
    posVector: new Vector2d(Cube.startX, Cube.startY),
    el: $('.cube')[0],
    move: function(deltaTime) {
        // Used for touch auto-rotate only
        var dt = Math.min(deltaTime || 16.67, 50) / 16.67;
        this.posVector.y += (Cube.spinSpeed/2) * dt;
        if (this.posVector.y >= Cube.startY+(36000)) {
            this.posVector.y = Cube.startY;
        }
        this.el.style[transformProp] = "rotateX("+this.posVector.x+"deg) rotateY("+this.posVector.y+"deg)";
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
        ratio = ratio.clamp(0.75,1.0);

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


// Proportional lerp loop for mouse tracking.
// Moves a fraction of remaining distance each frame — never overshoots,
// naturally decelerates as it approaches target. Factor of 0.05 per 16.67ms
// frame means ~1.5s to visually settle at target.
function mouseLerpLoop(timestamp) {
    if (!mousePrevTime) mousePrevTime = timestamp;
    var deltaTime = timestamp - mousePrevTime;
    mousePrevTime = timestamp;

    var dt = Math.min(deltaTime || 16.67, 50) / 16.67;
    // Delta-time correct lerp factor — consistent feel at 60Hz and 120Hz
    var factor = 1 - Math.pow(1 - 0.05, dt);

    Cube.currentX += (Cube.targetX - Cube.currentX) * factor;
    Cube.currentY += (Cube.targetY - Cube.currentY) * factor;

    Cube.viewport.el.style[transformProp] = "rotateX("+Cube.currentX+"deg) rotateY("+Cube.currentY+"deg)";

    // Stop loop once cube has settled
    if (Math.abs(Cube.targetX - Cube.currentX) < 0.01 && Math.abs(Cube.targetY - Cube.currentY) < 0.01) {
        Cube.currentX = Cube.targetX;
        Cube.currentY = Cube.targetY;
        mouseAnimId = null;
        mousePrevTime = null;
        return;
    }

    mouseAnimId = requestAnimationFrame(mouseLerpLoop);
}

$("#theBlackBox").mouseenter(function(e){
    $(document).on('mousemove.cube', function(event) {
        var movementScaleFactor = 10;
        Cube.targetX = (Cube.startX + (Cube.viewCenter.y - event.pageY) / movementScaleFactor)
            .clamp(Cube.startX - Cube.xRange, Cube.startX + Cube.xRange);
        Cube.targetY = (Cube.startY - (Cube.viewCenter.x - event.pageX) / movementScaleFactor)
            .clamp(Cube.startY - Cube.yRange, Cube.startY + Cube.yRange);

        if (!mouseAnimId) {
            mousePrevTime = null;
            mouseAnimId = requestAnimationFrame(mouseLerpLoop);
        }
    });
});

$("#theBlackBox").mouseleave(function(e){
    $(document).off('mousemove.cube');
    Cube.targetX = Cube.startX;
    Cube.targetY = Cube.startY;

    if (!mouseAnimId) {
        mousePrevTime = null;
        mouseAnimId = requestAnimationFrame(mouseLerpLoop);
    }
});


//Extend JS with clamp function
Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
};
