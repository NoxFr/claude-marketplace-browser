'use strict';

const { escapeHtml, layout } = require('./layout');
const { renderAgentCard } = require('./card');

const TYPE_TO_NAV = {
  agents:     'agents',
  mcpServers: 'mcp',
};

function renderMarketplaceBanner(marketplaceUrl) {
  const source = marketplaceUrl || '&lt;path-or-url&gt;';
  const addCommand = `claude plugin marketplace add ${marketplaceUrl || '<path-or-url>'}`;
  const updateCommand = `claude plugin marketplace update`;
  const displayAddCommand = `claude plugin marketplace add ${source}`;
  const displayUpdateCommand = `claude plugin marketplace update`;
  return `
    <div class="flex flex-col gap-stack-sm px-gutter py-stack-md bg-slate-800/50 border border-slate-700 rounded-xl mb-stack-lg">
      <div class="flex items-center justify-between gap-stack-md">
        <div class="flex items-center gap-stack-md min-w-0">
          <span class="material-symbols-outlined text-vibrant-blue shrink-0">add_circle</span>
          <div class="min-w-0">
            <span class="font-label-caps text-label-caps text-slate-400 uppercase block mb-1">Add this marketplace to Claude Code</span>
            <code class="font-code-sm text-code-sm text-on-surface truncate block">${displayAddCommand}</code>
          </div>
        </div>
        <button
          class="shrink-0 flex items-center gap-stack-sm px-stack-md py-stack-sm bg-surface-container border border-slate-700 text-on-surface-variant hover:text-on-surface hover:border-vibrant-blue font-code-sm text-code-sm rounded-lg transition-colors"
          data-command="${escapeHtml(addCommand)}"
          data-icon-default="content_copy"
          data-label-default="Copy"
          data-label-copied="Copied!">
          <span class="material-symbols-outlined text-[16px]">content_copy</span>
          Copy
        </button>
      </div>
       <div class="flex items-center justify-between gap-stack-md">
        <span class="font-label-caps text-label-caps text-slate-400 uppercase block mb-1">OR</span>
      </div>
      <div class="flex items-center justify-between gap-stack-md">
        <div class="flex items-center gap-stack-md min-w-0">
          <span class="material-symbols-outlined text-slate-400 shrink-0">update</span>
          <div class="min-w-0">
            <span class="font-label-caps text-label-caps text-slate-400 uppercase block mb-1">Update plugins from this marketplace</span>
            <code class="font-code-sm text-code-sm text-on-surface truncate block">${displayUpdateCommand}</code>
          </div>
        </div>
        <button
          class="shrink-0 flex items-center gap-stack-sm px-stack-md py-stack-sm bg-surface-container border border-slate-700 text-on-surface-variant hover:text-on-surface hover:border-vibrant-blue font-code-sm text-code-sm rounded-lg transition-colors"
          data-command="${escapeHtml(updateCommand)}"
          data-icon-default="content_copy"
          data-label-default="Copy"
          data-label-copied="Copied!">
          <span class="material-symbols-outlined text-[16px]">content_copy</span>
          Copy
        </button>
      </div>
    </div>`;
}

function renderListPage(agents, categories, type, marketplaceUrl) {
  const activeNav = TYPE_TO_NAV[type] || 'explore';

  const categoryOptions = categories
    .map(c => {
      const label = c.charAt(0).toUpperCase() + c.slice(1);
      return `<option value="${escapeHtml(c)}">${escapeHtml(label)}</option>`;
    })
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
      ${renderMarketplaceBanner(marketplaceUrl)}
      <div class="flex flex-col md:flex-row gap-4 p-4 bg-slate-900 border border-slate-700 rounded-lg">
        ${typeInput}
        <div class="flex-grow relative">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">search</span>
          <input
            id="search-input" name="q" type="search"
            placeholder="Search by name or description…"
            class="w-full bg-surface-container-lowest border border-slate-700 rounded-lg py-3 pl-12 pr-4 text-on-surface font-code-sm text-code-sm focus:border-vibrant-blue focus:ring-2 focus:ring-vibrant-blue/20 outline-none transition-all">
        </div>
        <div class="flex gap-2">
          <select
            id="category-select" name="category"
            class="bg-surface-container-lowest border border-slate-700 text-slate-400 rounded-lg px-4 py-3 font-code-sm text-code-sm outline-none cursor-pointer hover:border-vibrant-blue transition-colors">
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

module.exports = { renderListPage };
