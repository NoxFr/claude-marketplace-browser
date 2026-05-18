'use strict';

const { marked } = require('marked');
const { escapeHtml, layout } = require('./layout');
const { renderComponentLabels } = require('./badge');

function renderComponentAccordions(components) {
  if (!components || components.length === 0) return '';
  return `
    <div class="detail-components">
      ${components.map(group => `
        <div class="component-group">
          <h3 class="component-group-title">${escapeHtml(group.label)}</h3>
          ${group.files.map(file => `
            <details class="component-accordion" open>
              <summary class="component-summary">${escapeHtml(file.name)}</summary>
              <div class="component-content">${marked(file.content)}</div>
            </details>`).join('')}
        </div>`).join('')}
    </div>`;
}

function renderDetailPage(agent, readmeHtml, components) {
  const body = `
    <a class="back-link" href="/">← Retour à la liste</a>
    <div class="detail-header">
      <div class="detail-title">${escapeHtml(agent.name)}</div>
      <div class="detail-meta">
        ${agent.version ? `<span>Version ${escapeHtml(String(agent.version))}</span>` : ''}
        ${agent.category ? `<span>Catégorie : ${escapeHtml(agent.category)}</span>` : ''}
        <div class="badges">${renderComponentLabels(agent)}</div>
      </div>
      ${agent.description ? `<p class="detail-description">${escapeHtml(agent.description)}</p>` : ''}
    </div>
    ${readmeHtml ? `<div class="detail-readme">${readmeHtml}</div>` : ''}
    ${renderComponentAccordions(components)}`;

  return layout(agent.name, body);
}

module.exports = { renderDetailPage };
