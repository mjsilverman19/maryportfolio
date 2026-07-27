/* Selected-work carousel: reveal prev/next when the track overflows. */

(function () {
  var root = document.querySelector('.strip');
  if (!root) return;

  var track = root.querySelector('.strip__track');
  var controls = root.querySelector('.strip__controls');
  var prev = root.querySelector('[data-strip-prev]');
  var next = root.querySelector('[data-strip-next]');
  if (!track || !controls || !prev || !next) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function itemStep() {
    var item = track.querySelector('.strip__item');
    if (!item) return track.clientWidth * 0.8;
    var styles = window.getComputedStyle(track);
    var gap = parseFloat(styles.columnGap || styles.gap) || 0;
    return item.getBoundingClientRect().width + gap;
  }

  function maxScroll() {
    return Math.max(0, track.scrollWidth - track.clientWidth);
  }

  function update() {
    var overflow = maxScroll() > 4;
    controls.hidden = !overflow;
    if (!overflow) return;

    var left = track.scrollLeft;
    prev.disabled = left <= 2;
    next.disabled = left >= maxScroll() - 2;
  }

  function scrollByDir(dir) {
    track.scrollBy({
      left: itemStep() * dir,
      behavior: reduced ? 'auto' : 'smooth'
    });
  }

  prev.addEventListener('click', function () { scrollByDir(-1); });
  next.addEventListener('click', function () { scrollByDir(1); });

  track.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);

  track.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      scrollByDir(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      scrollByDir(1);
    }
  });

  if ('ResizeObserver' in window) {
    var ro = new ResizeObserver(update);
    ro.observe(track);
  }

  update();
})();
