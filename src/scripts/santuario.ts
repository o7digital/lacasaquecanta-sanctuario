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

  const menu = root.querySelector<HTMLButtonElement>('.mobile-menu');
  const mobileNav = root.querySelector<HTMLElement>('#mobile-nav');
  function setMenu(open: boolean) {
    menu?.setAttribute('aria-expanded', String(open));
    menu?.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    if (mobileNav) mobileNav.hidden = !open;
  }
  menu?.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'), { signal });
  mobileNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false), { signal }));
  document.addEventListener('keydown', event => {
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
  let current = 'Todas las historias';

  function filterStories() {
    let visible = 0;
    stories.forEach((story, index) => {
      const show = current === 'Todas las historias' ? (expanded || index < 3) : story.dataset.category === current;
      story.hidden = !show;
      if (show) visible++;
    });
    grid?.classList.toggle('filtered', current !== 'Todas las historias');
    if (more) more.hidden = current !== 'Todas las historias' || expanded;
    const status = root?.querySelector('#filter-status');
    if (status) status.textContent = `${visible} historias en ${current.toLowerCase()}`;
  }
  filters.forEach(button => button.addEventListener('click', () => {
    current = button.dataset.filter ?? 'Todas las historias';
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
      save!.innerHTML = saved ? '<span aria-hidden="true">♥</span> Lectura guardada' : '<span aria-hidden="true">♡</span> Guardar lectura';
    }
    try { update(localStorage.getItem(key) === '1'); } catch { /* Reading remains available without storage. */ }
    save.addEventListener('click', () => {
      const saved = save.getAttribute('aria-pressed') !== 'true';
      try {
        localStorage.setItem(key, saved ? '1' : '0');
        update(saved);
      } catch { save.textContent = 'No se pudo guardar en este navegador'; }
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
