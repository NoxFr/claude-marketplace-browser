'use strict';

const { escapeHtml } = require('./layout');
const { renderComponentLabels } = require('./badge');

function renderAgentCard(agent) {
  return `<a class="card" href="/agents/${encodeURIComponent(agent.name)}">
  <div class="card-header">
    <span class="card-name">${escapeHtml(agent.name)}</span>
    ${agent.version ? `<span class="card-version">v${escapeHtml(String(agent.version))}</span>` : ''}
  </div>
  <p class="card-description">${escapeHtml(agent.description || '')}</p>
  <div class="card-footer">
    <span class="card-category">${escapeHtml(agent.category || '')}</span>
    <div class="badges">${renderComponentLabels(agent)}</div>
  </div>
</a>`;
}

module.exports = { renderAgentCard };
