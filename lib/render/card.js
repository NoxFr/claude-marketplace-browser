'use strict';

const { escapeHtml } = require('./layout');
const { renderComponentLabels, getPrimaryMeta } = require('./badge');

const COMPONENT_TYPE_KEYS = ['skills', 'commands', 'agents', 'hooks', 'mcpServers', 'lspServers'];
const TYPE_DATA_ATTRS = {
  skills: 'data-type-skills',
  commands: 'data-type-commands',
  agents: 'data-type-agents',
  hooks: 'data-type-hooks',
  mcpServers: 'data-type-mcp-servers',
  lspServers: 'data-type-lsp-servers',
};

function buildTypeDataAttrs(agent) {
  return COMPONENT_TYPE_KEYS
    .filter(k => {
      const v = agent[k];
      return v && (Array.isArray(v) ? v.length > 0 : Object.keys(v).length > 0);
    })
    .map(k => `${TYPE_DATA_ATTRS[k]}="true"`)
    .join(' ');
}

function renderAgentCard(agent) {
  const meta = getPrimaryMeta(agent);
  const typeAttrs = buildTypeDataAttrs(agent);
  return `<article class="group bg-slate-800 border border-slate-700 p-6 rounded-lg cursor-pointer hover:border-vibrant-blue transition-all"
  data-name="${escapeHtml((agent.name || '').toLowerCase())}"
  data-description="${escapeHtml((agent.description || '').toLowerCase())}"
  data-category="${escapeHtml((agent.category || '').toLowerCase())}"
  ${typeAttrs}>
  <a class="block h-full no-underline text-inherit" href="/agents/${encodeURIComponent(agent.name)}">
    <div class="flex justify-between items-start mb-4">
      <div class="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center border border-slate-700 group-hover:border-vibrant-blue transition-colors">
        <span class="material-symbols-outlined text-${meta.color}">${meta.icon}</span>
      </div>
      ${agent.version ? `<span class="font-code-sm text-code-sm text-slate-400">v${escapeHtml(String(agent.version))}</span>` : ''}
    </div>
    <h3 class="font-headline-md text-headline-md text-on-surface mb-2 group-hover:text-vibrant-blue transition-colors">${escapeHtml(agent.name)}</h3>
    <p class="font-body-sm text-body-sm text-on-surface-variant mb-4 line-clamp-2">${escapeHtml(agent.description || '')}</p>
    ${agent.category ? `<div class="mb-4"><span class="inline-block px-2 py-0.5 bg-slate-700 text-slate-300 font-code-sm text-code-sm rounded">${escapeHtml(agent.category.charAt(0).toUpperCase() + agent.category.slice(1))}</span></div>` : ''}
    <div class="flex flex-wrap gap-2 mt-auto">
      ${renderComponentLabels(agent)}
    </div>
  </a>
</article>`;
}

module.exports = { renderAgentCard };
