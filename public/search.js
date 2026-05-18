'use strict';

const TYPE_DATASET_KEY = {
  agents: 'typeAgents',
  mcpServers: 'typeMcpServers',
};

class FilterState {
  constructor(q = '', category = '', type = '') {
    this.q = q.toLowerCase().trim();
    this.category = category.trim().toLowerCase();
    this.type = type.trim();
  }
}

class CardMatcher {
  static matches(dataset, state) {
    if (state.q && !dataset.name.includes(state.q) && !dataset.description.includes(state.q)) return false;
    if (state.category && dataset.category !== state.category) return false;
    if (state.type) {
      const key = TYPE_DATASET_KEY[state.type];
      if (key && dataset[key] !== 'true') return false;
    }
    return true;
  }
}

class DOMUpdater {
  constructor(cards, noResultsEl) {
    this.cards = cards;
    this.noResultsEl = noResultsEl;
  }

  update(state) {
    let visible = 0;
    this.cards.forEach(card => {
      const show = CardMatcher.matches(card.dataset, state);
      card.classList.toggle('hidden', !show);
      if (show) visible++;
    });
    if (this.noResultsEl) {
      this.noResultsEl.classList.toggle('hidden', visible > 0);
    }
  }
}

class SearchController {
  constructor() {
    this.searchInput = document.getElementById('search-input');
    this.categorySelect = document.getElementById('category-select');
    const grid = document.getElementById('grid');
    if (!grid) return;

    this.cards = Array.from(grid.querySelectorAll('article'));

    // Normalize strings once at load time, not on every keystroke
    this.cards.forEach(card => {
      card.dataset.name = (card.dataset.name || '').toLowerCase();
      card.dataset.description = (card.dataset.description || '').toLowerCase();
      card.dataset.category = (card.dataset.category || '').toLowerCase();
    });

    this.noResultsEl = document.createElement('div');
    this.noResultsEl.className = 'hidden text-center py-16 text-on-surface-variant font-body-base text-body-base col-span-full';
    this.noResultsEl.textContent = 'Aucun résultat pour cette recherche';
    grid.appendChild(this.noResultsEl);

    this.updater = new DOMUpdater(this.cards, this.noResultsEl);
    this._timer = null;

    if (this.searchInput) {
      this.searchInput.addEventListener('input', () => {
        clearTimeout(this._timer);
        this._timer = setTimeout(() => this._apply(), 150);
      });
    }
    if (this.categorySelect) {
      this.categorySelect.addEventListener('change', () => this._apply());
    }

    this._apply();

    if (this.searchInput && new URLSearchParams(window.location.search).get('type')) {
      this.searchInput.focus();
    }
  }

  _apply() {
    const params = new URLSearchParams(window.location.search);
    const state = new FilterState(
      this.searchInput ? this.searchInput.value : '',
      this.categorySelect ? this.categorySelect.value : '',
      params.get('type') || ''
    );
    this.updater.update(state);
  }
}

document.addEventListener('DOMContentLoaded', () => new SearchController());
