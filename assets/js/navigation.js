(() => {
  document.documentElement.style.scrollBehavior = 'auto';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let animationFrame = null;

  function animateScrollTo(targetY, duration = 500) {
    if (animationFrame) cancelAnimationFrame(animationFrame);

    const startY = window.scrollY;
    const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const endY = Math.min(Math.max(0, targetY), maxY);
    const distance = endY - startY;

    if (prefersReducedMotion || Math.abs(distance) < 1) {
      window.scrollTo(0, endY);
      return;
    }

    const startTime = performance.now();
    const easeInOut = (t) => t < 0.5
      ? 2 * t * t
      : 1 - Math.pow(-2 * t + 2, 2) / 2;

    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      window.scrollTo(0, startY + distance * easeInOut(progress));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      } else {
        animationFrame = null;
      }
    }

    animationFrame = requestAnimationFrame(step);
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    const href = link.getAttribute('href');

    if (href === '#') {
      link.addEventListener('click', (event) => event.preventDefault());
      return;
    }

    const target = document.querySelector(href);
    if (!target) return;

    link.addEventListener('click', (event) => {
      event.preventDefault();

      const header = document.querySelector('.site-header');
      const headerOffset = header ? header.offsetHeight : 0;
      const targetY = href === '#top'
        ? 0
        : target.getBoundingClientRect().top + window.scrollY - headerOffset;

      animateScrollTo(targetY, 500);
    });
  });
})();