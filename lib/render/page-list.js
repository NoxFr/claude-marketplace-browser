'use strict';

const { escapeHtml, layout } = require('./layout');
const { renderAgentCard } = require('./card');

function renderGrid(agents) {
  if (agents.length === 0) {
    return '<div class="empty">Aucun résultat pour cette recherche</div>';
  }
  return agents.map(renderAgentCard).join('\n');
}

function renderListPage(agents, categories) {
  const categoryOptions = categories
    .map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`)
    .join('');

  const body = `
    <div class="search-bar">
      <input id="search-input" name="q" type="search" placeholder="Rechercher un plugin…"
        hx-get="/search" hx-trigger="input delay:200ms" hx-target="#grid" hx-include="#category-select">
      <select id="category-select" name="category"
        hx-get="/search" hx-trigger="change" hx-target="#grid" hx-include="#search-input">
        <option value="">Toutes les catégories</option>
        ${categoryOptions}
      </select>
    </div>
    ${agents.length === 0
      ? '<div class="empty">Aucun plugin disponible dans ce marketplace</div>'
      : `<div class="grid" id="grid">${agents.map(renderAgentCard).join('\n')}</div>`
    }`;

  return layout('Claude Marketplace Browser', body);
}

module.exports = { renderGrid, renderListPage };
