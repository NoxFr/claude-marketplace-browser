'use strict';

const { escapeHtml } = require('./layout');
const { renderComponentLabels, getPrimaryMeta } = require('./badge');

function renderAgentCard(agent) {
  const meta = getPrimaryMeta(agent);
  return `<article class="group bg-slate-800 border border-slate-700 p-6 rounded-lg cursor-pointer hover:border-vibrant-blue transition-all">
  <a class="block h-full no-underline text-inherit" href="/agents/${encodeURIComponent(agent.name)}">
    <div class="flex justify-between items-start mb-4">
      <div class="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center border border-slate-700 group-hover:border-vibrant-blue transition-colors">
        <span class="material-symbols-outlined text-${meta.color}">${meta.icon}</span>
      </div>
      ${agent.version ? `<span class="font-code-sm text-code-sm text-slate-400">v${escapeHtml(String(agent.version))}</span>` : ''}
    </div>
    <h3 class="font-headline-md text-headline-md text-on-surface mb-2 group-hover:text-vibrant-blue transition-colors">${escapeHtml(agent.name)}</h3>
    <p class="font-body-sm text-body-sm text-on-surface-variant mb-6 line-clamp-2">${escapeHtml(agent.description || '')}</p>
    <div class="flex flex-wrap gap-2 mt-auto">
      ${renderComponentLabels(agent)}
    </div>
  </a>
</article>`;
}

module.exports = { renderAgentCard };
