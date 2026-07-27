/* Mary Nunes portfolio — self-contained interactivity.
   Ported from the design-tool export's component logic (hover, typing,
   work carousel, and draw-on-scroll doodles) with no framework or CDN. */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── Hover styles ─────────────────────────────────────────────
     The export authored hovers as `style-hover="prop: val; …"`. Base
     look lives in each element's inline `style`, so we apply the hover
     declarations on enter and restore the original style string on leave. */
  function initHovers() {
    document.querySelectorAll("[style-hover]").forEach(function (el) {
      var base = el.getAttribute("style") || "";
      var decls = el.getAttribute("style-hover").split(";")
        .map(function (d) { return d.trim(); })
        .filter(Boolean)
        .map(function (d) {
          var i = d.indexOf(":");
          return [d.slice(0, i).trim(), d.slice(i + 1).trim()];
        });

      el.addEventListener("mouseenter", function () {
        decls.forEach(function (pair) { el.style.setProperty(pair[0], pair[1]); });
      });
      el.addEventListener("mouseleave", function () {
        el.setAttribute("style", base);
      });
    });
  }

  /* ── Typing tagline ───────────────────────────────────────────── */
  var roles = [
    "brand voice & messaging",
    "campaign & launch copy",
    "editorial & long-form",
    "product & packaging",
    "thought leadership",
    "email & social"
  ];

  /* Reserve the tallest height the tagline needs across all roles, so the
     brief empty moment between words can't collapse it a line and bump
     every section below. Re-measured on resize. */
  function reserveTagline() {
    var el = document.getElementById("type-role");
    if (!el) return;
    var para = el.closest("p");
    if (!para) return;
    var saved = el.textContent;
    para.style.minHeight = "";
    var max = 0;
    roles.forEach(function (r) {
      el.textContent = r;
      if (para.offsetHeight > max) max = para.offsetHeight;
    });
    el.textContent = saved;
    para.style.minHeight = max + "px";
  }

  function initTyping() {
    var el = document.getElementById("type-role");
    if (!el || reduceMotion) return; // leave the first role in place

    var i = 0, pos = 0, deleting = false;
    function tick() {
      var word = roles[i];
      pos += deleting ? -1 : 1;
      el.textContent = word.slice(0, pos);
      var delay = deleting ? 45 : 85;
      if (!deleting && pos === word.length) { delay = 1600; deleting = true; }
      else if (deleting && pos === 0) { deleting = false; i = (i + 1) % roles.length; delay = 320; }
      setTimeout(tick, delay);
    }
    setTimeout(tick, 1600);
  }

  /* ── Work carousel ────────────────────────────────────────────── */
  function initCarousel() {
    var track = document.getElementById("work-track");
    var bar = document.getElementById("work-bar");
    var prev = document.getElementById("work-prev");
    var next = document.getElementById("work-next");
    if (!track) return;

    function step() {
      var card = track.firstElementChild;
      var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return card ? card.getBoundingClientRect().width + gap : track.clientWidth * 0.8;
    }

    function updateBar() {
      if (!bar) return;
      var max = track.scrollWidth - track.clientWidth;
      var visible = track.clientWidth / Math.max(track.scrollWidth, 1);
      var width = Math.min(1, Math.max(0.14, visible));
      bar.style.width = (width * 100).toFixed(2) + "%";
      var p = max > 0 ? track.scrollLeft / max : 0;
      bar.style.left = (p * (100 - width * 100)).toFixed(2) + "%";
    }

    function scrollByDir(dir) {
      track.scrollBy({ left: dir * step(), behavior: "smooth" });
    }

    if (prev) prev.addEventListener("click", function () { scrollByDir(-1); });
    if (next) next.addEventListener("click", function () { scrollByDir(1); });
    track.addEventListener("scroll", updateBar, { passive: true });
    window.addEventListener("resize", updateBar);
    updateBar();
  }

  /* ── Draw-on-scroll doodles ───────────────────────────────────── */
  function initDoodles() {
    if (reduceMotion || !("IntersectionObserver" in window)) return; // stay fully drawn

    var svgs = document.querySelectorAll("svg[data-doodle]");
    if (!svgs.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        draw(e.target);
        io.unobserve(e.target);
      });
    }, { threshold: 0, rootMargin: "0px 0px -24px 0px" });

    svgs.forEach(function (svg) {
      var primed = 0;
      svg.querySelectorAll("path").forEach(function (p) {
        if (typeof p.getTotalLength !== "function") return;
        var len = p.getTotalLength();
        if (!len) return;
        p.style.strokeDasharray = len;
        p.style.strokeDashoffset = len;
        primed++;
      });
      if (primed) io.observe(svg);
    });
  }

  function draw(svg) {
    var ease = "cubic-bezier(0.45, 0.05, 0.25, 1)";
    var kind = svg.getAttribute("data-doodle");

    if (kind === "sun") {
      var core = svg.querySelector('[data-part="core"] path');
      if (core) {
        core.style.transition = "stroke-dashoffset 0.5s " + ease;
        core.style.strokeDashoffset = "0";
      }
      var rays = svg.querySelector('[data-part="rays"]');
      svg.querySelectorAll('[data-part="rays"] path').forEach(function (p, i) {
        p.style.transition = "stroke-dashoffset 0.4s " + ease + " " + (0.4 + i * 0.06).toFixed(2) + "s";
        p.style.strokeDashoffset = "0";
      });
      if (rays) setTimeout(function () { rays.style.animation = "sun-spin 54s linear infinite"; }, 1400);
      return;
    }

    svg.querySelectorAll("path").forEach(function (p, i) {
      var delay = (kind === "arrow" && i === 1) ? "0.55s" : "0s";
      p.style.transition = "stroke-dashoffset 1s " + ease + " " + delay;
      p.style.strokeDashoffset = "0";
    });

    if (kind === "arrow") {
      setTimeout(function () { svg.style.animation = "arrow-nudge 3.2s ease-in-out infinite"; }, 1900);
    }
  }

  function init() {
    initHovers();
    reserveTagline();
    initTyping();
    initCarousel();
    initDoodles();

    // The reserved height depends on how the text wraps, which changes once
    // the Inter web font swaps in — so re-measure after fonts are ready (and
    // again on full load) rather than trusting the fallback-font layout.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(reserveTagline);
    }
    window.addEventListener("load", reserveTagline);

    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(reserveTagline, 150);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
