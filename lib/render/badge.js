'use strict';

const COMPONENT_BADGES = [
  ['skills',     'Skill'],
  ['commands',   'Command'],
  ['agents',     'Agent'],
  ['hooks',      'Hook'],
  ['mcpServers', 'MCP'],
  ['lspServers', 'LSP'],
];

function hasItems(value) {
  return value && (Array.isArray(value) ? value.length > 0 : Object.keys(value).length > 0);
}

function renderComponentLabels(plugin) {
  const labels = COMPONENT_BADGES
    .filter(([field]) => hasItems(plugin[field]))
    .map(([, label]) => `<span class="badge badge-${label.toLowerCase()}">${label}</span>`);

  return labels.length > 0 ? labels.join('') : '<span class="badge badge-plugin">Plugin</span>';
}

module.exports = { renderComponentLabels };
