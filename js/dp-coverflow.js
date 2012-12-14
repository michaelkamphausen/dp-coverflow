(function() {

  /*
   * General Setup
   * ToDo: move to a global place
   */
  $ = $ || jQuery;
  Modernizr.addTest('devicemotion', ('DeviceMotionEvent' in window) );
  Modernizr.addTest('orientation', ('orientation' in window) );
  var domTransformProperty = Modernizr.prefixed('transform'),
    cssTransformProperty = domToCss(domTransformProperty),
    domTransitionProperty = Modernizr.prefixed('transition'),
    cssTransitionProperty = domToCss(domTransitionProperty),
    transitionEndEvents = {
      'WebkitTransition': 'webkitTransitionEnd',
      'MozTransition': 'transitionend',
      'OTransition': 'oTransitionEnd',
      'msTransition': 'MSTransitionEnd',
      'transition': 'transitionend'
    },
    transitionEndEvent = transitionEndEvents[domTransitionProperty];
  
  /*
   * Init coverflow variables 
   */
  var $coverflow,
    coverflow,
    $coverflowItems,
    coverflowItems,
    currentCover = 0,
    countCover = 0;
    coverflowWidth = 0;
  
  /*
   * Init coverflow widget
   */
  $(document).ready(function onDocumentReady() {
    setupCoverflowView();
    setupCoverflowControls();
    if (true) {
      setupLight(coverflowItems);
    } else {
      $coverflowItems.css('background-color', "#eee");
    }
    setCoverTransforms(true);
    window.scrollTo(0, window.scrollY);
    
    /*setTimeout(function() {
      var timestamp = new Date;
      for (var i = 0; i < 1000; i++) {
        moveCover(currentCover, (Math.random() - 0.5) * 100);
      }
      console.log([new Date - timestamp].join(", "));
    }, 1000);*/
  });
  
  /*
   * Init view
   */
  function setupCoverflowView() {
    $coverflow = $('.dpCoverflow');
    coverflow = $coverflow[0];
    window.addEventListener("orientationchange", onResize);
    window.addEventListener("resize", onResize);
    $coverflowItems = $coverflow.find('li');
    coverflowItems = coverflow.children;
    coverflowItem = coverflowItems[0];
    coverflowWidth = coverflow.clientWidth;
    countCover = coverflowItems.length;
    currentCover = Math.floor(countCover/2);
  }
  
  function onResize() {
    coverflowWidth = coverflow.clientWidth;
    setCoverTransforms(true);
  }
  
  /*
   * Init control
   */
  function setupCoverflowControls() {
    var startCover = currentCover,
      dragendTime = 0,
      mousewheelX = 0,
      mousewheelTime = 0,
      dragonly = {swipe:false, transform:false, tap:false, tap_double:false, hold:false};
    
    var coverflowHammer = new Hammer(coverflow, dragonly);
    coverflowHammer.ondragstart = function(evt) {
      startCover = currentCover;
    };
    coverflowHammer.ondrag = function(evt) {
      moveCover(startCover, evt.distanceX);
    };
    coverflowHammer.ondragend = function(evt) {
      dragendTime = evt.timeStamp;
    };
    coverflow.addEventListener("mousewheel", function onMousewheel(evt) {
      if (Math.abs(evt.wheelDeltaX) < Math.abs(evt.wheelDeltaY)) return;
      evt.preventDefault();
      if (mousewheelTime + 200 < evt.timeStamp) {
        startCover = currentCover;
        mousewheelX = 0;
      }
      if (!(((currentCover == 0) && (evt.wheelDeltaX < 0)) || 
          ((currentCover == countCover - 1) && (0 < evt.wheelDeltaX)))) {
        mousewheelX += evt.wheelDeltaX;
      }
      moveCover(startCover, mousewheelX / 5);
      mousewheelTime = evt.timeStamp;
    });
    coverflow.addEventListener("mousedown", function onMousedown(evt) {
      evt.preventDefault();
    });
    coverflow.addEventListener("click", function onClick(evt) {
      if (evt.timeStamp < dragendTime + 10) {
        evt.preventDefault();
      }
    });
  }

  /*
   * Determine next front cover
   */
  function moveCover(startCover, distanceX) {
    currentCover = startCover + Math.floor(distanceX / 100);
    currentCover = clamp(currentCover, 0, countCover - 1);
    setCoverTransforms(true);
  }
  
  /*
   * Animate covers
   */
  function setCoverTransforms(animate) {
    //console.markTimeline("trigger render light");
    doRenderLight = true;
    
    //console.markTimeline("calculate coverflow start");
    var width = coverflowWidth,
      vspace = Math.min(width / 9, 100),
      angle = Math.max(90 - width / 30, 60);
    
    for(var i = 0; i < countCover; i++) {
      var offset = Math.abs(currentCover - i),
        direction = currentCover < i ? -1 : currentCover > i ? 1 : 0,
        translateX = (100 + vspace * offset) * direction,
        translateZ = i == currentCover ? 0 : -200,
        rotateY = -angle * direction,
        zIndex = 0 - offset;

      coverflowItems[i].style.cssText = cssTransformProperty + 
        ":translateX(" + translateX +
        "px) translateZ(" + translateZ + 
        "px) rotateY(" + rotateY + "deg); " +
        "z-index:" + zIndex;
    }
    //console.markTimeline("calculate coverflow end");
  }
  
  
  /* ======= "Let there be light" … ======= */
  
  /*
   * Init light variables
   */
  var coverflowFaces = [],
    light = new Photon.Light(0, 20, 100),
    shadeAmount = .3,
    tintAmount = 0,
    doRenderLight = true,
    isLightMoving = false;
    lastAccel = [0, 0, 9.83],
    alpha = 0.3;
      
  /*
   * Init light and light movement when indicated
   */
  function setupLight(coverflowItems) {
    for (var i = 0, maxI = coverflowItems.length; i < maxI; i++) {
      coverflowFaces[i] = new Photon.Face(coverflowItems[i], shadeAmount, tintAmount);
    }
    
    /*$("body").bind("mousemove", function(evt) {
      light.moveTo(evt.clientX - window.innerWidth / 2, evt.clientY - window.innerHeight / 2, 100);
      renderCoverflow();
    });*/
    
    isLightMoving = isLightMoving && Modernizr.devicemotion && Modernizr.orientation;
    if (isLightMoving) {
      window.addEventListener("devicemotion", function onDevicemotion(evt) {
        var acceleration = evt.accelerationIncludingGravity;
        var currentAccel = [acceleration.x, acceleration.y, acceleration.z];
        for (var i = 0; i < 3; i++) {
          lastAccel[i] = lastAccel[i] + alpha * (currentAccel[i] - lastAccel[i]);
        }
        var isPortrait = window.orientation % 180 == 0;
        var upOrDown = ((window.orientation == 0) || (window.orientation == -90)) ? 1 : -1;
        var x = upOrDown * lastAccel[isPortrait ? 0 : 1];
        var y = upOrDown * lastAccel[isPortrait ? 1 : 0];
        light.moveTo(window.innerWidth * -x / 20, 20, 100);
      });
    } else {
      coverflowItem.addEventListener(transitionEndEvent, function onTransitionEnd() {
        doRenderLight = false;
      });
    }
    renderLight();
    doRenderLight = isLightMoving;
  }
  
  /*
   * Shade faces
   */
  function renderLight() {
    window.requestAnimationFrame(renderLight);
    //console.markTimeline("might renderlight");
    if (!doRenderLight) return;
    //console.markTimeline("start renderlight");
    for(var i = 0; i < coverflowFaces.length; i++) {
      coverflowFaces[i].render(light, true);
    }
    //console.markTimeline("end renderlight");
  }
  
  /* ======= … and there was light. ======= */
  
  
  /*
   * Helper functions
   */
  function domToCss(property) {
    var css = property.replace(/([A-Z])/g, function (str, m1) {
      return '-' + m1.toLowerCase();
    }).replace(/^ms-/,'-ms-');
  
    return css;
  }
  
  function clamp(val, min, max) {
      if(val > max) return max;
      if(val < min) return min;
      return val;
  }

})();