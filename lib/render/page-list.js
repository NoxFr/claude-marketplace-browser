'use strict';

const { escapeHtml, layout } = require('./layout');
const { renderAgentCard } = require('./card');

const TYPE_TO_NAV = {
  agents:     'agents',
  mcpServers: 'mcp',
};

function renderGrid(agents) {
  if (agents.length === 0) {
    return '<div class="text-center py-16 text-on-surface-variant font-body-base text-body-base">No results found</div>';
  }
  return agents.map(renderAgentCard).join('\n');
}

function renderListPage(agents, categories, type) {
  const activeNav = TYPE_TO_NAV[type] || 'explore';

  const categoryOptions = categories
    .map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`)
    .join('');

  const typeInput = type
    ? `<input type="hidden" id="type-input" name="type" value="${escapeHtml(type)}">`
    : '';

  const body = `
    <section class="mb-stack-lg">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-stack-md mb-stack-lg">
        <div>
          <h2 class="font-headline-lg text-headline-lg text-on-surface mb-2">Plugin Marketplace</h2>
          <p class="font-body-base text-body-base text-on-surface-variant max-w-2xl">Discover and deploy modular AI tools, MCP servers, and custom skills for your stack.</p>
        </div>
      </div>
      <div class="flex flex-col md:flex-row gap-4 p-4 bg-slate-900 border border-slate-700 rounded-lg">
        ${typeInput}
        <div class="flex-grow relative">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">search</span>
          <input
            id="search-input" name="q" type="search"
            placeholder="Search by name or description…"
            class="w-full bg-surface-container-lowest border border-slate-700 rounded-lg py-3 pl-12 pr-4 text-on-surface font-code-sm text-code-sm focus:border-vibrant-blue focus:ring-2 focus:ring-vibrant-blue/20 outline-none transition-all"
            hx-get="/search" hx-trigger="input delay:200ms" hx-target="#grid" hx-include="#category-select,#type-input">
        </div>
        <div class="flex gap-2">
          <select
            id="category-select" name="category"
            class="bg-surface-container-lowest border border-slate-700 text-slate-400 rounded-lg px-4 py-3 font-code-sm text-code-sm outline-none cursor-pointer hover:border-vibrant-blue transition-colors"
            hx-get="/search" hx-trigger="change" hx-target="#grid" hx-include="#search-input,#type-input">
            <option value="">All categories</option>
            ${categoryOptions}
          </select>
        </div>
      </div>
    </section>
    ${agents.length === 0
      ? '<div class="text-center py-16 text-on-surface-variant font-body-base text-body-base">No plugins available in this marketplace</div>'
      : `<section class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" id="grid">${agents.map(renderAgentCard).join('\n')}</section>`
    }`;

  return layout('Plugin Marketplace', body, { activeNav });
}

module.exports = { renderGrid, renderListPage };
