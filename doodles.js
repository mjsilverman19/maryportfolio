/* Hand-drawn doodles: draw themselves in when scrolled into view.
   No JS (or reduced motion) => they simply render fully drawn. */

(function () {
  var doodles = document.querySelectorAll('.doodle');
  if (!doodles.length) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !('IntersectionObserver' in window)) return;

  // Prime each stroke with a dash the length of the path itself, offset out of view.
  Array.prototype.forEach.call(doodles, function (svg) {
    var strokes = svg.querySelectorAll('path');
    var primed = 0;

    Array.prototype.forEach.call(strokes, function (path) {
      if (typeof path.getTotalLength !== 'function') return;
      var len = path.getTotalLength();
      if (!len) return;
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len;
      primed++;
    });

    if (primed) svg.classList.add('doodle--ready');
  });

  // Keep the bottom margin small and absolute. A percentage big enough to feel
  // deliberate parks the footer doodles permanently outside the root once the
  // page is scrolled to the end, so they'd never draw at all.
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-drawn');
      io.unobserve(entry.target);
    });
  }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });

  Array.prototype.forEach.call(doodles, function (svg) { io.observe(svg); });
})();
