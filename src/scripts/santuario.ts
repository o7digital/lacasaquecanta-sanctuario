import { translations } from '../lib/santuario/i18n';

let activeRoot: HTMLElement | null = null;
let controller: AbortController | null = null;

function initializeSantuario() {
  const root = document.querySelector<HTMLElement>('body.santuario');
  if (root === activeRoot) return;
  controller?.abort();
  activeRoot = root;
  if (!root) return;
  controller = new AbortController();
  const { signal } = controller;
  const lang = document.documentElement.lang === 'es' ? 'es' : 'en';
  const copy = translations[lang];

  const languageSwitch = root.querySelector<HTMLElement>('.language-switch');
  const languageButton = root.querySelector<HTMLButtonElement>('#menu-button');
  const languageMenu = root.querySelector<HTMLElement>('#lang-menu');
  const languageLink = languageMenu?.querySelector<HTMLAnchorElement>('a');
  function setLanguageMenu(open: boolean, focus = false) {
    languageButton?.setAttribute('aria-expanded', String(open));
    if (languageMenu) languageMenu.hidden = !open;
    if (languageLink) languageLink.tabIndex = open ? 0 : -1;
    if (open) setMenu(false);
    if (open && focus) languageLink?.focus();
  }
  languageButton?.addEventListener('click', () => setLanguageMenu(languageButton.getAttribute('aria-expanded') !== 'true'), { signal });
  languageButton?.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      setLanguageMenu(true, true);
    }
  }, { signal });
  languageSwitch?.addEventListener('focusout', event => {
    if (!languageSwitch.contains(event.relatedTarget as Node | null)) setLanguageMenu(false);
  }, { signal });
  document.addEventListener('click', event => {
    if (!languageSwitch?.contains(event.target as Node)) setLanguageMenu(false);
  }, { signal });
  languageLink?.addEventListener('click', () => {
    const destination = new URL(languageLink.href);
    destination.search = location.search;
    destination.hash = location.hash;
    languageLink.href = destination.href;
  }, { signal });

  const menu = root.querySelector<HTMLButtonElement>('.mobile-menu');
  const mobileNav = root.querySelector<HTMLElement>('#mobile-nav');
  function setMenu(open: boolean) {
    menu?.setAttribute('aria-expanded', String(open));
    menu?.setAttribute('aria-label', open ? copy.closeMenu : copy.openMenu);
    if (mobileNav) mobileNav.hidden = !open;
    if (open) setLanguageMenu(false);
  }
  menu?.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'), { signal });
  mobileNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false), { signal }));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && languageMenu && !languageMenu.hidden) {
      setLanguageMenu(false);
      languageButton?.focus();
    }
    if (event.key === 'Escape' && mobileNav && !mobileNav.hidden) {
      setMenu(false);
      menu?.focus();
    }
  }, { signal });

  const filters = [...root.querySelectorAll<HTMLButtonElement>('[data-filter]')];
  const stories = [...root.querySelectorAll<HTMLElement>('.stories .story')];
  const more = root.querySelector<HTMLButtonElement>('#more-stories');
  const grid = root.querySelector('.stories');
  let expanded = false;
  let current = 'all';

  function filterStories() {
    let visible = 0;
    stories.forEach((story, index) => {
      const show = current === 'all' ? (expanded || index < 3) : story.dataset.category === current;
      story.hidden = !show;
      if (show) visible++;
    });
    grid?.classList.toggle('filtered', current !== 'all');
    if (more) more.hidden = current !== 'all' || expanded;
    const status = root?.querySelector('#filter-status');
    const label = filters.find(filter => filter.dataset.filter === current)?.textContent?.trim().replace(/\s+\d+$/, '') ?? copy.allStories;
    if (status) status.textContent = `${visible} ${copy.storiesIn} ${label.toLowerCase()}`;
  }
  filters.forEach(button => button.addEventListener('click', () => {
    current = button.dataset.filter ?? 'all';
    filters.forEach(filter => {
      const selected = filter === button;
      filter.classList.toggle('active', selected);
      filter.setAttribute('aria-pressed', String(selected));
    });
    filterStories();
  }, { signal }));
  more?.addEventListener('click', () => {
    expanded = true;
    filterStories();
    stories[3]?.querySelector('a')?.focus({ preventScroll: true });
    stories[3]?.scrollIntoView({
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      block: 'start',
    });
  }, { signal });

  const save = root.querySelector<HTMLButtonElement>('.save-story');
  if (save) {
    const key = `santuario-saved-${save.dataset.slug}`;
    function update(saved: boolean) {
      save!.setAttribute('aria-pressed', String(saved));
      save!.innerHTML = `<span aria-hidden="true">${saved ? '♥' : '♡'}</span> ${saved ? copy.saved : copy.save}`;
    }
    try { update(localStorage.getItem(key) === '1'); } catch { /* Reading remains available without storage. */ }
    save.addEventListener('click', () => {
      const saved = save.getAttribute('aria-pressed') !== 'true';
      try {
        localStorage.setItem(key, saved ? '1' : '0');
        update(saved);
      } catch { save.textContent = copy.saveError; }
    }, { signal });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeSantuario, { once: true });
} else {
  initializeSantuario();
}

// Also works when imported into an Astro site that uses ClientRouter.
document.addEventListener('astro:page-load', initializeSantuario);
document.addEventListener('astro:before-swap', () => {
  controller?.abort();
  activeRoot = null;
});
