////////////////////////
// GLOBAL VARS

var isMobile = false;
var localResizers = []

////////////////////////
// SETUP ON READY

$(document).ready(function() {

  if ($("body").hasClass("projectPage")) {
    $(".projPageContent a").each(function(){
      $(this).attr("target", "_blank");
      $(this).not(":has(img)").addClass("bolder linkAnim");
    });
    createCaptions();
    createVids();
    $(".vidContainer").fitVids();
  } else if ($("body").hasClass("homePage")) {
    showGifThumbnails();
  }

  if ($("section").first().hasClass("tagPage")) {
    var tag = ""
    setTagHeading("");
    var url = window.location.hash;
    if (url.indexOf("#") != -1) {
      tag = url.substring(url.indexOf("#")+1);
      filterTags(tag);
    }
  }

  $('#cvBody .cvLink').each(function(){
    var link = $(this)
    if(link.attr('href') == ""){
      link.addClass('noPoint');
    }
  });

  $(".hiddenEmail").html(rot13rot5Encode('<n pynff="yvaxNavz" uers="znvygb:pbagnpg@vinlybtrgbi.pbz">pbagnpg@vinlybtrgbi.pbz</n>'));
  $(".hiddenPhone").html(rot13rot5Encode('<n uers="gry:+68658391837" pynff="yvaxNavz">556.865.839.1837</n>'));

  var credWidth = 0;
  $(".creditsRow .left").each(function(elements){
    if (this.clientWidth > credWidth) {
      credWidth = this.clientWidth;
    }
  })

  $(".creditsRow .left").css('width', credWidth + 10);

  var nameWidth = 0;
  $(".creditsRow .right").each(function(elements){
    if (this.clientWidth > nameWidth) {
      nameWidth = this.clientWidth;
    }
  })
  $(".creditsRow .right").css('width', nameWidth + 10);

});

////////////////////////
// EVENTS

// jQuery 4 fix: $(window).load() removed; use $(window).on('load', ...)
$(window).on('load', function() {
    // jQuery.browser.mobile is set by jquery.detectmobile (loaded via tools.min.js)
    if (jQuery.browser && jQuery.browser.mobile === true) {
        isMobile = true;
        $("body").addClass("isMobile");
    } else {
        $("body").addClass("isNotMobile");
    }
    document.documentElement.classList.remove('page-loading');
});

on_resize(function() {
    //Throttled on-resize handler
    for (var i = localResizers.length - 1; i >= 0; i--) {

      if (typeof localResizers[i] === 'function') {
        localResizers[i]()
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
            break;

        default:
            break;
    }
});

$(".scrollLink").click(function(e){
    e.preventDefault();
    var dest = $(this).attr("href");
    var target;
    if (dest == "#" || dest == "") {
        target=0;
    } else {
        target = Math.floor($(dest).offset().top);
    }
    var speed = Math.floor((target - $(window).scrollTop())/3);
    // jQuery 4 fix: animate scrollTop on $("html, body") instead of $("body") alone
    $("html, body").animate({
        scrollTop: target
    }, Math.abs(speed));
});

$(".tagLink").click(function(e){
  e.preventDefault();
  var url = $(this).attr("href");
  var tag = "";
  if (url.indexOf("#") !== -1) {
    tag = url.substring(url.indexOf("#")+1);
  }
  filterTags(tag);
});


////////////////////////
// CUSTOM FUNCTIONS

function filterTags(tag) {
  if (tag === undefined || tag === null || tag === "") {
    setTagHeading(tag);
    restoreAllTags();
  } else {
    if ($(".tagHider").html() === "") {
      $(".tagHider").html($(".projects").html())
    }
    $(".projects").html("");
    setTagHeading(tag);
    setHash(tag)
    $(".tagHider .projectEntry").each(function(){
      if ($(this).hasClass(tag)) {
        $(this).clone().appendTo(".projects");
      }
    });
  }
}

function restoreAllTags(){
  if ($(".tagHider").html() !== "") {
    $(".projects").html($(".tagHider").html())
  }
  removeHash();
}

function setHash(tag) {
  if (window.location.href.indexOf("tagged") !== -1) {
    window.location.hash = tag;
  }
}

function removeHash () {
  if (window.location.href.indexOf("tagged") !== -1) {
    var loc = window.location;
    if ("pushState" in history)
      history.pushState("", document.title, loc.pathname + loc.search);
    else {
      loc.hash = "";
    }
  }
}

function setTagHeading(tag) {
  if (tag === undefined || tag === null || tag === "") {
    $(".tagHeading").text("")
  } else {
    $(".tagHeading").text("/"+tag.toUpperCase())
  }
}

function showGifThumbnails() {
  if ($("body").hasClass("isMobile")) { return; }

  $('.projEntryBackground').each(function(){
    var gifThumb = $(this).attr('data-thumbnailgif');
    if (gifThumb !== undefined) {
      preloadAndReplace(gifThumb, this);
    }
  });
}

function preloadAndReplace(imgSrc, imgDest) {
  var image = new Image();
  image.onload = function() {
    imgDest.style.background = 'url(' + imgSrc + ')';
  };

  image.onerror = function(){
    console.log("Could not load " + imgSrc);
  };
  image.src = imgSrc;
}

function createCaptions() {
  $('img.captioned').each(function() {
    var el = $(this);
    var elSource = el.attr('src');
    var classes = el.attr('class');
    var captionClasses = el.attr('data-captionClasses');
    var caption = el.attr('data-caption');
    el.replaceWith('<div class="imageWithCaption" style="position:relative"><img src="' + elSource + '" class="' + classes + '"><div class="captionElement ' + captionClasses + '">' + caption + '</div></div>');
  });
}

function createVids() {
  if ($("body").hasClass("isMobile")) { return; }

  $('.makeVid').each(function() {
    var videoSource = $(this);
    var vidSrc = videoSource.attr('data-vid');
    var imgSrc = videoSource.attr('src');

    var container = $("<div>", {"class": "fullWidth vidContainer"});

    container.html('<video src="' + vidSrc + '" poster="' + imgSrc + '" type="video/mp4" loop="true" autoplay></video>');
    videoSource.replaceWith(container);
  });
}


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


//Extend JS with clamp function
Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
};
