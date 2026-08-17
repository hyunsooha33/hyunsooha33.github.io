(() => {
  document.documentElement.style.scrollBehavior = 'auto';

  const publicationEntry = document.querySelector('#publication .publication-entry');
  if (publicationEntry) {
    const links = publicationEntry.querySelector('.paper-links');

    if (links && !publicationEntry.querySelector('[aria-controls="coercive-origin-abstract"]')) {
      const abstractButton = document.createElement('button');
      abstractButton.className = 'abstract-toggle';
      abstractButton.type = 'button';
      abstractButton.textContent = 'Abstract';
      abstractButton.setAttribute('aria-expanded', 'false');
      abstractButton.setAttribute('aria-controls', 'coercive-origin-abstract');
      links.prepend(abstractButton);

      const abstractPanel = document.createElement('div');
      abstractPanel.className = 'abstract-panel';
      abstractPanel.id = 'coercive-origin-abstract';
      abstractPanel.setAttribute('aria-hidden', 'true');

      const abstractInner = document.createElement('div');
      abstractInner.className = 'abstract-panel-inner';

      const abstractText = document.createElement('p');
      abstractText.textContent = 'Detrimental effects of monopolistic banks are evident in social welfare losses and selective law enforcement resulting from bureaucratic corruption. Despite its significance as a driver of socioeconomic reconfiguration, the economic sanctions literature to date has not addressed the impact of sanctions on bank competition, although it implies a potential correlation between the two. We argue that sanctions reduce bank competition in target states as large, efficient banks better survive and adopt aggressive merger and acquisition strategies to enhance productivity under sanctions. Political pressures are also imposed on foreign banks to leave the target economies, which further increases concentration in the targets’ banking industries. Examining an original sanctions dataset for 117 countries from 1996 to 2014, we find that financial sanctions significantly reduce bank competition in target economies. This research contributes by illuminating an external political intervention through which the competitive dynamics of banking industries are determined.';

      abstractInner.appendChild(abstractText);
      abstractPanel.appendChild(abstractInner);
      publicationEntry.appendChild(abstractPanel);
    }
  }

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