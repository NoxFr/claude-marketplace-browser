'use strict';

const COMPONENT_META = {
  skills:     { label: 'Skill',    color: 'skill-label',   icon: 'bolt' },
  commands:   { label: 'Command',  color: 'status-warning', icon: 'terminal' },
  agents:     { label: 'Agent',    color: 'primary',        icon: 'smart_toy' },
  hooks:      { label: 'Hook',     color: 'status-success', icon: 'anchor' },
  mcpServers: { label: 'MCP',      color: 'mcp-label',      icon: 'dns' },
  lspServers: { label: 'LSP',      color: 'secondary',      icon: 'code' },
};

const PLUGIN_DEFAULT_META = { label: 'Plugin', color: 'slate-400', icon: 'extension' };

function hasItems(value) {
  return value && (Array.isArray(value) ? value.length > 0 : Object.keys(value).length > 0);
}

function renderBadge(label, color) {
  return `<span class="px-2 py-0.5 border border-${color}/40 bg-${color}/10 text-${color} font-label-caps text-label-caps rounded">${label}</span>`;
}

function renderComponentLabels(plugin) {
  const active = Object.entries(COMPONENT_META)
    .filter(([field]) => hasItems(plugin[field]))
    .map(([, meta]) => renderBadge(meta.label, meta.color));

  return active.length > 0
    ? active.join('')
    : renderBadge(PLUGIN_DEFAULT_META.label, PLUGIN_DEFAULT_META.color);
}

function getPrimaryMeta(plugin) {
  const entry = Object.entries(COMPONENT_META).find(([field]) => hasItems(plugin[field]));
  return entry ? entry[1] : PLUGIN_DEFAULT_META;
}

module.exports = { renderComponentLabels, getPrimaryMeta, renderBadge };
