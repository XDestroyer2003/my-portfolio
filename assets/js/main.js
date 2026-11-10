/*=============== HOME SPLIT TEXT ===============*/
const splitText = () => {
  const homeTitle = document.querySelector('.home__title');

  if (!homeTitle) return;

  const textNodes = [];
  const walker = document.createTreeWalker(homeTitle, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) textNodes.push(walker.currentNode);

  const chars = [];
  textNodes.forEach((textNode) => {
    [...textNode.textContent].forEach((char) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.display = 'inline-block';
      span.style.opacity = '0';
      span.style.transform = 'translateY(12px)';
      span.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
      span.style.transitionDelay = `${chars.length * 35}ms`;
      textNode.parentNode.insertBefore(span, textNode);
      chars.push(span);
    });
    textNode.remove();
  });

  requestAnimationFrame(() => {
    chars.forEach((char) => {
      char.style.opacity = '1';
      char.style.transform = 'translateY(0)';
    });
  });

  if (window.anime && typeof window.anime === 'function') {
    window.anime({
      targets: chars,
      opacity: [0, 1],
      translateY: [12, 0],
      delay: (el, i) => 30 * i,
      duration: 700,
      easing: 'easeOutExpo'
    });
  }
};

/*=============== SWIPER PROJECTS ===============*/
const initProjectsSwiper = () => {
  const swiperEl = document.querySelector('.projects__container');

  if (!swiperEl || !window.Swiper) return;

  new Swiper('.projects__container', {
    loop: false,
    spaceBetween: 24,
    grabCursor: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      640: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 }
    }
  });
};

/*=============== WORK TABS ===============*/
const initWorkTabs = () => {
  const tabButtons = document.querySelectorAll('.work__tab');
  const tabPanels = document.querySelectorAll('.work__content');

  if (!tabButtons.length || !tabPanels.length) return;

  const activateTab = (button, moveFocus = false) => {
    const target = button.dataset.target;
    const panel = [...tabPanels].find((item) => item.id === target);

    if (!panel) return;

    tabButtons.forEach((tab) => {
      const selected = tab === button;
      tab.classList.toggle('active-tab', selected);
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });

    tabPanels.forEach((item) => {
      const selected = item === panel;
      item.classList.toggle('show-work', selected);
      item.hidden = !selected;
    });

    if (moveFocus) button.focus();
  };

  tabButtons.forEach((button, index) => {
    button.addEventListener('click', () => activateTab(button));

    button.addEventListener('keydown', (event) => {
      let nextIndex;

      switch (event.key) {
        case 'ArrowRight':
          nextIndex = (index + 1) % tabButtons.length;
          break;
        case 'ArrowLeft':
          nextIndex = (index - 1 + tabButtons.length) % tabButtons.length;
          break;
        case 'Home':
          nextIndex = 0;
          break;
        case 'End':
          nextIndex = tabButtons.length - 1;
          break;
        default:
          return;
      }

      event.preventDefault();
      activateTab(tabButtons[nextIndex], true);
    });
  });
};

/*=============== SERVICES ACCORDION ===============*/
const initAccordion = () => {
  const items = document.querySelectorAll('.services__item');

  if (!items.length) return;

  items.forEach((item) => {
    const button = item.querySelector('.services__button');
    const content = item.querySelector('.services__content');

    if (!button || !content) return;

    button.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      items.forEach((entry) => {
        entry.classList.remove('open');
        const panel = entry.querySelector('.services__content');
        if (panel) panel.style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('open');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
};

/*=============== COPY EMAIL IN CONTACT ===============*/
const initCopyEmail = () => {
  const buttons = document.querySelectorAll('[data-copy-email]');

  if (!buttons.length) return;

  buttons.forEach((button) => {
    button.addEventListener('click', async () => {
      const target = document.querySelector(button.dataset.copyEmail) || document.body;
      const text = target.textContent.trim();

      try {
        await navigator.clipboard.writeText(text);
        const original = button.textContent;
        button.textContent = 'Copied!';
        setTimeout(() => {
          button.textContent = original;
        }, 1200);
      } catch (error) {
        console.warn('Clipboard copy failed:', error);
      }
    });
  });
};

/*=============== CURRENT YEAR OF THE FOOTER ===============*/
const setCurrentYear = () => {
  const yearEl = document.querySelector('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
};

/*=============== MOBILE NAV TOGGLE ===============*/
const initMobileNav = () => {
  const navMenu = document.getElementById('nav-menu');
  const navToggle = document.getElementById('nav-toggle');

  if (!navMenu || !navToggle) return;

  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('show-menu');
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => navMenu.classList.remove('show-menu'));
  });
};

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const initScrollActiveLink = () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link, a[href^="#"]');

  if (!sections.length || !navLinks.length) return;

  const setActiveLink = () => {
    let current = 'home';

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 120) current = section.id;
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      const isActive = href === `#${current}` || (current === 'home' && href === '#home');
      link.classList.toggle('active-link', isActive);
    });
  };

  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();
};

/*=============== CUSTOM CURSOR ===============*/
const initCustomCursor = () => {
  const cursor = document.createElement('div');
  const cursorDot = document.createElement('div');

  cursor.className = 'cursor';
  cursorDot.className = 'cursor-dot';

  document.body.appendChild(cursor);
  document.body.appendChild(cursorDot);

  const moveCursor = (event) => {
    cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
    cursorDot.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
  };

  window.addEventListener('mousemove', moveCursor);

  document.querySelectorAll('a, button, input, textarea, .services__button, .work__tab').forEach((element) => {
    element.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor--active');
    });
    element.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor--active');
    });
  });

  document.querySelectorAll('a, button').forEach((link) => {
    link.addEventListener('click', () => {
      cursor.classList.add('cursor--click');
      setTimeout(() => cursor.classList.remove('cursor--click'), 180);
    });
  });
};

/* Hide custom cursor on links */
const hideCustomCursorOnMobile = () => {
  if (window.matchMedia('(max-width: 768px)').matches) {
    document.body.classList.add('cursor-hidden');
  }
};

/*=============== SCROLL REVEAL ANIMATION ===============*/
const initScrollReveal = () => {
  if (!window.ScrollReveal) return;

  const sr = window.ScrollReveal({
    origin: 'bottom',
    distance: '60px',
    duration: 2500,
    delay: 300,
  });

  sr.reveal('.home__content, .about__content, .projects__container, .work__content, .services__item, .education__card, .contact__content, .footer');
};

/*=============== INITIALIZE ===============*/
document.addEventListener('DOMContentLoaded', () => {
  splitText();
  initProjectsSwiper();
  initWorkTabs();
  initAccordion();
  initCopyEmail();
  setCurrentYear();
  initMobileNav();
  initScrollActiveLink();
  initCustomCursor();
  hideCustomCursorOnMobile();
  initScrollReveal();
});
