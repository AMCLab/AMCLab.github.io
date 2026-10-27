(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    const close = (restoreFocus = false) => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = 'Menu';
      if (restoreFocus) toggle.focus();
    };
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? 'Close' : 'Menu';
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') close(true);
    });
    nav.addEventListener('click', event => { if (event.target.closest('a')) close(); });
    const media = matchMedia('(min-width: 901px)');
    media.addEventListener('change', () => close());
  }
  const search = document.querySelector('#publication-search');
  if (!search) return;
  const items = [...document.querySelectorAll('.publication')];
  const filters = [...document.querySelectorAll('[data-filter]')];
  const count = document.querySelector('#result-count');
  const empty = document.querySelector('#empty-results');
  let active = 'all';
  const normalise = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const apply = () => {
    const query = normalise(search.value.trim());
    let visible = 0;
    items.forEach(item => {
      const text = normalise(item.textContent);
      const tags = item.dataset.tags.split(' ');
      const show = (active === 'all' || tags.includes(active)) && (!query || text.includes(query));
      item.hidden = !show;
      if (show) visible++;
    });
    count.textContent = `${visible} of ${items.length} selected publications`;
    empty.hidden = visible !== 0;
  };
  filters.forEach(button => button.addEventListener('click', () => {
    active = button.dataset.filter;
    filters.forEach(other => other.setAttribute('aria-pressed', String(other === button)));
    apply();
  }));
  search.addEventListener('input', apply);
  apply();
})();
