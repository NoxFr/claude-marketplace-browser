'use strict';

const { marked } = require('marked');
const { escapeHtml, layout } = require('./layout');
const { renderBadge, getPrimaryMeta } = require('./badge');

function slugify(name) {
  return String(name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function getInstallCommand(pluginName, marketplaceName) {
  const marketplaceSlug = marketplaceName ? slugify(marketplaceName) : 'marketplace';
  return `claude plugin install ${pluginName}@${marketplaceSlug}`;
}

function renderComponentAccordions(components) {
  if (!components || components.length === 0) return '';

  const COMPONENT_ICON = {
    Skills: { icon: 'bolt', color: 'skill-label' },
    Commands: { icon: 'terminal', color: 'status-warning' },
    Agents: { icon: 'smart_toy', color: 'primary' },
    Hooks: { icon: 'anchor', color: 'status-success' },
    'MCP Servers': { icon: 'dns', color: 'mcp-label' },
    'LSP Servers': { icon: 'code', color: 'secondary' },
  };

  return `
    <section class="space-y-stack-md">
      <h2 class="font-headline-md text-headline-md text-on-surface mb-stack-md">Components</h2>
      ${components.map(group => {
        const meta = COMPONENT_ICON[group.label] || { icon: 'extension', color: 'slate-400' };
        return group.files.map(file => `
          <details class="group bg-slate-800 border border-slate-700 rounded-xl overflow-hidden" open>
            <summary class="flex justify-between items-center px-gutter py-stack-md cursor-pointer hover:bg-surface-container transition-colors list-none">
              <div class="flex items-center gap-stack-md">
                <span class="material-symbols-outlined text-${meta.color}">${meta.icon}</span>
                <div>
                  <span class="font-body-base text-body-base font-bold text-on-surface">${escapeHtml(file.name)}</span>
                  <span class="ml-2">${renderBadge(group.label, meta.color)}</span>
                </div>
              </div>
              <span class="material-symbols-outlined text-slate-400 chevron-icon transition-transform duration-200">expand_more</span>
            </summary>
            <div class="px-gutter py-stack-md bg-slate-900 border-t border-slate-700">
              <div class="prose-detail">${marked(file.content)}</div>
            </div>
          </details>`).join('');
      }).join('')}
    </section>`;
}

function renderDetailPage(agent, readmeHtml, components, marketplaceName) {
  const meta = getPrimaryMeta(agent);
  const installCommand = getInstallCommand(agent.name, marketplaceName);

  const body = `
    <nav class="mb-stack-lg">
      <a class="inline-flex items-center gap-stack-sm text-slate-400 hover:text-vibrant-blue transition-colors font-body-sm text-body-sm no-underline" href="/">
        <span class="material-symbols-outlined text-[18px]">arrow_back</span>
        Back to list
      </a>
    </nav>

    <div class="max-w-[1100px] mx-auto">
      <section class="mb-stack-lg">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-stack-md mb-stack-md">
          <div>
            <div class="flex items-center gap-stack-sm mb-stack-sm">
              ${renderBadge(meta.label.toUpperCase(), meta.color)}
              ${agent.version ? `<span class="font-code-sm text-code-sm text-slate-400">v${escapeHtml(String(agent.version))}</span>` : ''}
            </div>
            <h1 class="font-headline-lg text-headline-lg text-primary">${escapeHtml(agent.name)}</h1>
          </div>
          <button
            class="px-stack-md py-stack-sm bg-vibrant-blue text-white font-body-base text-body-base rounded-lg hover:opacity-90 transition-opacity flex items-center gap-stack-sm"
            data-command="${escapeHtml(installCommand)}"
            data-icon-default="download"
            data-label-default="Install Plugin"
            data-label-copied="Copied!">
            <span class="material-symbols-outlined text-[18px]">download</span>
            Install Plugin
          </button>
        </div>
        ${agent.description ? `<p class="font-body-base text-body-base text-on-surface-variant max-w-2xl">${escapeHtml(agent.description)}</p>` : ''}
      </section>

      ${(agent.category || agent.version || agent.author) ? `
      <div class="grid grid-cols-2 md:grid-cols-4 gap-gutter p-stack-md bg-slate-800/50 border border-slate-700 rounded-xl mb-stack-lg">
        ${agent.category ? `
        <div class="flex flex-col">
          <span class="font-label-caps text-label-caps text-slate-400 uppercase mb-1">Category</span>
          <span class="font-body-base text-body-base text-on-surface">${escapeHtml(agent.category)}</span>
        </div>` : ''}
        ${agent.author ? `
        <div class="flex flex-col">
          <span class="font-label-caps text-label-caps text-slate-400 uppercase mb-1">Author</span>
          <span class="font-body-base text-body-base text-on-surface">${escapeHtml(agent.author)}</span>
        </div>` : ''}
        ${agent.version ? `
        <div class="flex flex-col">
          <span class="font-label-caps text-label-caps text-slate-400 uppercase mb-1">Version</span>
          <span class="font-code-sm text-code-sm text-on-surface">${escapeHtml(String(agent.version))}</span>
        </div>` : ''}
      </div>` : ''}

      ${readmeHtml ? `
      <section class="mb-stack-lg">
        <h2 class="font-headline-md text-headline-md text-on-surface mb-stack-md">Description &amp; Examples</h2>
        <div class="bg-slate-900 border border-slate-700 rounded-xl p-gutter prose-detail">
          ${readmeHtml}
        </div>
      </section>` : ''}

      ${renderComponentAccordions(components)}
    </div>`;

  return layout(agent.name, body);
}

module.exports = { renderDetailPage };
