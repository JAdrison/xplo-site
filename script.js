const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
const header = document.querySelector('[data-header]');
const floatingWhatsapp = document.querySelector('.floating-whatsapp');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}

const updateHeader = () => {
  if (header) header.classList.toggle('scrolled', window.scrollY > 24);
  if (floatingWhatsapp) floatingWhatsapp.classList.toggle('visible', window.scrollY > window.innerHeight * 0.65);
};

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

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
  }, { threshold: 0.1, rootMargin: '0px 0px -30px' });

  revealItems.forEach((item) => revealObserver.observe(item));
}

const lazyVideos = document.querySelectorAll('video[data-lazy-video]');

if (lazyVideos.length) {
  const loadVideo = (video) => {
    if (video.dataset.loaded === 'true') return;
    video.querySelectorAll('source[data-src]').forEach((source) => {
      source.src = source.dataset.src;
      source.removeAttribute('data-src');
    });
    video.dataset.loaded = 'true';
    video.load();
  };

  if (!('IntersectionObserver' in window)) {
    lazyVideos.forEach(loadVideo);
  } else {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting) {
          loadVideo(video);
          if (!reduceMotion) video.play().catch(() => {});
        } else if (!video.paused) {
          video.pause();
        }
      });
    }, { rootMargin: '260px 0px', threshold: 0.05 });

    lazyVideos.forEach((video) => videoObserver.observe(video));
  }
}

const labData = [
  {
    image: 'assets/xplo-lab/conversas-seguras.webp',
    alt: 'Atendimento centralizado no XPLO LAB',
    kicker: 'ATENDIMENTO CENTRALIZADO',
    title: 'Todas as conversas, com contexto e responsável.',
    text: 'WhatsApp e outros canais reunidos em uma única caixa de entrada para a equipe acompanhar cada contato sem perder histórico.',
    items: ['Distribuição de atendimentos', 'Histórico completo por contato', 'Equipe e IA no mesmo fluxo']
  },
  {
    image: 'assets/xplo-lab/pipeline-seguro.webp',
    alt: 'Pipeline comercial e CRM do XPLO LAB',
    kicker: 'PIPELINE COMERCIAL',
    title: 'Cada oportunidade com etapa e próximo passo.',
    text: 'O CRM mostra quem acabou de chegar, quem recebeu proposta, quem precisa de retorno e quais reservas estão próximas de fechar.',
    items: ['Funis adaptados à hospedagem', 'Tags, responsáveis e valores', 'Follow-ups e atividades visíveis']
  },
  {
    image: 'assets/xplo-lab/agente-ia-seguro.webp',
    alt: 'Configuração de agente de IA no XPLO LAB',
    kicker: 'AGENTES DE INTELIGÊNCIA ARTIFICIAL',
    title: 'IA treinada com a operação da hospedagem.',
    text: 'Conhecimento, regras e ferramentas são configurados para responder, qualificar e conduzir o cliente sem perder o jeito de atender da marca.',
    items: ['Base de conhecimento própria', 'Regras de comunicação e qualificação', 'Supervisão e continuidade humana']
  },
  {
    image: 'assets/xplo-lab/relatorios.webp',
    alt: 'Relatórios e métricas do XPLO LAB',
    kicker: 'DADOS DA OPERAÇÃO',
    title: 'Marketing e atendimento vistos no mesmo contexto.',
    text: 'Contatos, conversas, tempo de resposta e evolução comercial deixam de ficar espalhados e passam a orientar as próximas decisões.',
    items: ['Volume e origem dos contatos', 'Tempo e qualidade de resposta', 'Evolução do atendimento e conversão']
  }
];

const labTabs = document.querySelectorAll('.lab-tab');
const labImage = document.querySelector('[data-lab-image]');
const labKicker = document.querySelector('[data-lab-kicker]');
const labTitle = document.querySelector('[data-lab-title]');
const labText = document.querySelector('[data-lab-text]');
const labList = document.querySelector('[data-lab-list]');

const renderLabTab = (index) => {
  const item = labData[index];
  if (!item || !labImage || !labKicker || !labTitle || !labText || !labList) return;

  labTabs.forEach((tab, tabIndex) => {
    const active = tabIndex === index;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });

  labImage.classList.remove('switching');
  void labImage.offsetWidth;
  labImage.src = item.image;
  labImage.alt = item.alt;
  labImage.classList.add('switching');
  labKicker.textContent = item.kicker;
  labTitle.textContent = item.title;
  labText.textContent = item.text;
  labList.innerHTML = item.items.map((listItem) => `<li>${listItem}</li>`).join('');
};

labTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => renderLabTab(index));
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const nextIndex = (index + direction + labTabs.length) % labTabs.length;
    renderLabTab(nextIndex);
    labTabs[nextIndex].focus();
  });
});

const phoneInput = document.querySelector('input[name="whatsapp"]');

if (phoneInput) {
  phoneInput.addEventListener('input', () => {
    const digits = phoneInput.value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) phoneInput.value = digits;
    else if (digits.length <= 7) phoneInput.value = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    else phoneInput.value = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  });
}

const form = document.getElementById('lead-form');
const formStatus = document.getElementById('form-status');

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const source = new URLSearchParams(window.location.search).get('utm_source');
    const message = [
      'Olá! Quero receber o Diagnóstico da Operação de Reservas da XPLO.',
      '',
      `Nome: ${data.get('nome')}`,
      `WhatsApp: ${data.get('whatsapp')}`,
      `Hospedagem: ${data.get('hospedagem')}`,
      `Cidade/Estado: ${data.get('cidade')}`,
      `Tipo: ${data.get('tipo')}`,
      `Principal gargalo: ${data.get('gargalo')}`,
      `Cenário atual: ${data.get('cenario') || 'Não informado'}`,
      source ? `Origem: ${source}` : ''
    ].filter(Boolean).join('\n');

    if (typeof window.gtag === 'function') {
      window.gtag('event', 'generate_lead', { form_name: 'diagnostico_operacao_reservas' });
    }

    if (formStatus) formStatus.textContent = 'Tudo certo. Abrindo o WhatsApp para concluir o envio…';
    const whatsappUrl = `https://wa.me/5585999899213?text=${encodeURIComponent(message)}`;
    const newWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    if (!newWindow) window.location.href = whatsappUrl;
  });
}

document.querySelectorAll('a[href*="wa.me"]').forEach((link) => {
  link.addEventListener('click', () => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'contact', { method: 'whatsapp' });
    }
  });
});

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
