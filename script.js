const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});

nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const lazyVideos = document.querySelectorAll('video[data-lazy-video]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (lazyVideos.length) {
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const video = entry.target;
      video.querySelectorAll('source[data-src]').forEach((source) => {
        source.src = source.dataset.src;
        source.removeAttribute('data-src');
      });

      video.load();
      if (!reduceMotion) video.play().catch(() => {});
      videoObserver.unobserve(video);
    });
  }, { rootMargin: '320px 0px', threshold: 0.01 });

  lazyVideos.forEach((video) => videoObserver.observe(video));
}

document.getElementById('year').textContent = new Date().getFullYear();
