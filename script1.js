 
      Shery.imageEffect(".back", {
  style: 5,
  gooey: true,
  config: {
    a: { value: 1.15, range: [0, 30] },
    b: { value: -0.98, range: [-1, 1] },
    zindex: { value: 1 }, // 🧠 FIXED: -9996999 hides it behind everything
    aspect: { value: 1.9223007063572148 },
    ignoreShapeAspect: { value: true },
    shapePosition: { value: { x: 0, y: 0 } },
    shapeScale: { value: { x: 0.5, y: 0.5 } },
    shapeEdgeSoftness: { value: 0, range: [0, 0.5] },
    shapeRadius: { value: 0, range: [0, 2] },
    currentScroll: { value: 0 },
    scrollLerp: { value: 0.07 },
    gooey: { value: true },
    infiniteGooey: { value: true },
    growSize: { value: 4, range: [1, 15] },
    durationOut: { value: 1.41, range: [0.1, 5] },
    durationIn: { value: 1.5, range: [0.1, 5] },
    displaceAmount: { value: 0.5 },
    masker: { value: true },
    maskVal: { value: 1.31, range: [1, 5] },
    scrollType: { value: 0 },
    geoVertex: { range: [1, 64], value: 1 },
    noEffectGooey: { value: true },
    onMouse: { value: 1},
    noise_speed: { value: 0.2, range: [0, 10] },
    metaball: { value: 0.2, range: [0, 2], _gsap: { id: 3 } },
    discard_threshold: { value: 0.5, range: [0, 1] },
    antialias_threshold: { value: 0, range: [0, 0.1] },
    noise_height: { value: 0.5, range: [0, 2] },
    noise_scale: { value: 10, range: [0, 100] }
  }
});

var elms = document.querySelectorAll(".elm");
var index = 0;
var animating = false;

document.querySelector("main").addEventListener("click", function () {
  if (animating) return;
  animating = true;

  elms.forEach(function (elm) {
    var h1s = elm.querySelectorAll("h1");
    var current = h1s[index];
    var next = (index === h1s.length - 1) ? h1s[0] : h1s[index + 1];

    // ✅ Ensure next h1 always starts below before animation
    gsap.set(next, { top: "100%" });

    var tl = gsap.timeline({
      onComplete: function () {
        animating = false;
      }
    });

    
    tl.to(current, {
      top: "-100%",
      ease: "expo.inOut",
      duration: 1,
      onComplete: function () {
        // Reset current below after moving out
        gsap.set(current, { top: "100%" });
      }
    });

   
    tl.to(next, {
      top: "0%",
      ease: "expo.inOut",
      duration: 1
    }, "-=0.8");
  });

 
  index = (index === elms[0].querySelectorAll("h1").length - 1) ? 0 : index + 1;
});


