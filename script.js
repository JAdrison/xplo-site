const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const header = document.querySelector('[data-header]');
const floatingWhatsapp = document.querySelector('.floating-whatsapp');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

const updateChrome = () => {
  header?.classList.toggle('scrolled', window.scrollY > 24);
  floatingWhatsapp?.classList.toggle('visible', window.scrollY > window.innerHeight * 0.7);
};

updateChrome();
window.addEventListener('scroll', updateChrome, { passive: true });

if (menuButton && nav) {
  const closeMenu = () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  };

  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
  });

  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  window.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });
}

const revealItems = document.querySelectorAll('.reveal');
if (reduceMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('visible'));
} else {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -35px' });
  revealItems.forEach((item) => revealObserver.observe(item));
}

const journeyTabs = [...document.querySelectorAll('.journey-tab')];
const journeyPanels = [...document.querySelectorAll('.journey-panel')];

const activateJourney = (panelId) => {
  journeyTabs.forEach((tab) => {
    const active = tab.dataset.panel === panelId;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    if (active && tab.parentElement) {
      const scroller = tab.parentElement;
      const left = tab.offsetLeft - (scroller.clientWidth - tab.clientWidth) / 2;
      scroller.scrollTo({ left, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  });

  journeyPanels.forEach((panel) => {
    const active = panel.id === panelId;
    panel.hidden = !active;
    panel.classList.toggle('active', active);
    const video = panel.querySelector('video');
    if (!video) return;
    if (active && !reduceMotion) video.play().catch(() => {});
    else video.pause();
  });
};

journeyTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateJourney(tab.dataset.panel));
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const next = (index + direction + journeyTabs.length) % journeyTabs.length;
    activateJourney(journeyTabs[next].dataset.panel);
    journeyTabs[next].focus();
  });
});

const requestedJourney = new URLSearchParams(window.location.search).get('journey');
if (requestedJourney && journeyPanels.some((panel) => panel.id === requestedJourney)) {
  activateJourney(requestedJourney);
}

const labMotion = document.querySelector('[data-lab-motion]');
if (labMotion) {
  const loadLabMotion = () => {
    if (labMotion.dataset.loaded === 'true') return;
    labMotion.querySelectorAll('source[data-src]').forEach((source) => {
      source.src = source.dataset.src;
      source.removeAttribute('data-src');
    });
    labMotion.dataset.loaded = 'true';
    labMotion.load();
  };

  if (!('IntersectionObserver' in window)) {
    loadLabMotion();
  } else {
    const motionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        loadLabMotion();
        if (!reduceMotion) labMotion.play().catch(() => {});
        motionObserver.disconnect();
      });
    }, { rootMargin: '400px 0px', threshold: 0.01 });
    motionObserver.observe(labMotion);
  }
}

const phoneInput = document.querySelector('input[name="whatsapp"]');
phoneInput?.addEventListener('input', () => {
  const digits = phoneInput.value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) phoneInput.value = digits;
  else if (digits.length <= 7) phoneInput.value = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  else phoneInput.value = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
});

const form = document.getElementById('lead-form');
const formStatus = document.getElementById('form-status');

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const data = new FormData(form);
  const message = [
    'Olá! Quero receber o diagnóstico da operação de reservas da XPLO.',
    '',
    `Nome: ${data.get('nome')}`,
    `WhatsApp: ${data.get('whatsapp')}`,
    `Hospedagem: ${data.get('hospedagem')}`,
    `Principal gargalo: ${data.get('gargalo')}`
  ].join('\n');

  formStatus.textContent = 'Tudo certo. Abrindo o WhatsApp…';
  const url = `https://wa.me/5585999899213?text=${encodeURIComponent(message)}`;
  const popup = window.open(url, '_blank', 'noopener,noreferrer');
  if (!popup) window.location.href = url;
});

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
