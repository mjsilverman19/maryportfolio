/* Selected-work carousel: prev/next + scroll progress. */

(function () {
  var root = document.querySelector('.strip');
  if (!root) return;

  var track = root.querySelector('.strip__track');
  var prev = root.querySelector('[data-strip-prev]');
  var next = root.querySelector('[data-strip-next]');
  var progress = root.querySelector('[data-strip-progress]');
  if (!track || !prev || !next) return;

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
    var max = maxScroll();
    var left = track.scrollLeft;

    prev.disabled = left <= 2;
    next.disabled = max <= 2 || left >= max - 2;

    if (progress) {
      var ratio = max <= 0 ? 1 : Math.min(1, Math.max(0, left / max));
      var thumb = max <= 0 ? 100 : Math.max(18, (track.clientWidth / track.scrollWidth) * 100);
      var travel = 100 - thumb;
      progress.style.width = thumb + '%';
      progress.style.marginLeft = (ratio * travel) + '%';
    }
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
