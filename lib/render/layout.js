'use strict';

const GITHUB_URL = 'https://github.com/NoxFr/claude-marketplace-browser';
const { version: PKG_VERSION } = require('../../package.json');

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}


function buildSidebarNav(activeNav) {
  const items = [
    { key: 'explore',    href: '/',                    icon: 'explore',   label: 'Explore' },
    { key: 'agents',     href: '/?type=agents',         icon: 'smart_toy', label: 'Agents' },
    { key: 'mcp',        href: '/?type=mcpServers',     icon: 'dns',       label: 'MCP Servers' },
    { key: 'docs',       href: GITHUB_URL,              icon: 'description', label: 'Documentation' },
  ];

  const CLS_SIDEBAR_ACTIVE   = 'flex items-center gap-3 px-4 py-3 bg-secondary-container text-on-secondary-container font-bold rounded-lg transition-all duration-200';
  const CLS_SIDEBAR_INACTIVE = 'flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-variant rounded-lg transition-all duration-200';
  const links = items.map(({ key, href, icon, label }) => {
    const isActive = key === activeNav;
    const cls = isActive ? CLS_SIDEBAR_ACTIVE : CLS_SIDEBAR_INACTIVE;
    const target = href.startsWith('http') ? ' target="_blank" rel="noopener"' : '';
    return `<a class="${cls}" href="${href}"${target} data-nav-key="${key}" data-nav-cls-active="${CLS_SIDEBAR_ACTIVE}" data-nav-cls-inactive="${CLS_SIDEBAR_INACTIVE}">
      <span class="material-symbols-outlined">${icon}</span>
      <span class="font-body-base text-body-base">${label}</span>
    </a>`;
  }).join('\n    ');

  return `
<aside class="hidden lg:flex flex-col w-64 shrink-0 sticky top-0 self-start h-screen overflow-y-auto bg-surface-container border-r border-outline-variant p-stack-md z-40">
  <div class="px-4 py-2 mb-4">
    <h2 class="font-label-caps text-label-caps text-outline uppercase">Navigation</h2>
  </div>
  <nav class="flex flex-col gap-1">
    ${links}
  </nav>
</aside>`;
}

function buildHeaderNav(activeNav) {
  const items = [
    { key: 'explore', href: '/',               label: 'Explore' },
    { key: 'agents',  href: '/?type=agents',    label: 'Agents' },
    { key: 'mcp',     href: '/?type=mcpServers', label: 'MCP Servers' },
    { key: 'docs',    href: GITHUB_URL,          label: 'Docs', external: true },
  ];

  const CLS_HEADER_ACTIVE   = 'font-label-caps text-label-caps text-vibrant-blue font-bold hover:text-vibrant-blue transition-colors no-underline';
  const CLS_HEADER_INACTIVE = 'font-label-caps text-label-caps text-on-surface-variant hover:text-vibrant-blue transition-colors no-underline';
  return items.map(({ key, href, label, external }) => {
    const isActive = key === activeNav;
    const cls = isActive ? CLS_HEADER_ACTIVE : CLS_HEADER_INACTIVE;
    const target = external ? ' target="_blank" rel="noopener"' : '';
    return `<a class="${cls}" href="${href}"${target} data-nav-key="${key}" data-nav-cls-active="${CLS_HEADER_ACTIVE}" data-nav-cls-inactive="${CLS_HEADER_INACTIVE}">${label}</a>`;
  }).join('\n        ');
}

function layout(title, body, { activeNav = 'explore' } = {}) {
  return `<!DOCTYPE html>
<html class="dark" lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Hanken+Grotesk:wght@600;700;800&family=JetBrains+Mono:wght@400;600&display=swap">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200">
  <link rel="stylesheet" href="/styles.css">
  <script src="/search.js"></script>
  <script>
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('[data-command]');
    if (!btn) return;
    var cmd = btn.getAttribute('data-command');
    var iconEl = btn.querySelector('.material-symbols-outlined');
    var labelDefault = btn.getAttribute('data-label-default') || 'Copy';
    var labelCopied = btn.getAttribute('data-label-copied') || 'Copied!';
    var iconDefault = btn.getAttribute('data-icon-default') || 'content_copy';
    function applyFeedback() {
      if (iconEl) iconEl.textContent = 'check';
      var textNode = Array.from(btn.childNodes).find(n => n.nodeType === 3 && n.textContent.trim());
      if (textNode) textNode.textContent = ' ' + labelCopied;
      setTimeout(function() {
        if (iconEl) iconEl.textContent = iconDefault;
        if (textNode) textNode.textContent = ' ' + labelDefault;
      }, 1500);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(cmd).then(applyFeedback).catch(function() {});
    } else {
      var ta = document.createElement('textarea');
      ta.value = cmd;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try { document.execCommand('copy'); applyFeedback(); } catch(e) {}
      document.body.removeChild(ta);
    }
  });
  </script>
</head>
<body class="bg-surface text-on-surface font-body-base text-body-base selection:bg-vibrant-blue selection:text-white min-h-screen flex flex-col">
  <header class="sticky top-0 z-50 w-full bg-surface border-b border-outline-variant">
    <div class="flex justify-between items-center px-gutter py-stack-md">
      <a class="flex items-center gap-3 no-underline" href="/">
        <span class="material-symbols-outlined text-vibrant-blue" style="font-variation-settings:'FILL' 1">terminal</span>
        <span class="font-headline-md text-headline-md font-bold text-primary tracking-tight">Claude Marketplace Browser</span>
      </a>
      <nav class="hidden md:flex lg:hidden items-center gap-stack-lg">
        ${buildHeaderNav(activeNav)}
      </nav>
    </div>
  </header>
  <div class="flex flex-1">
    ${buildSidebarNav(activeNav)}
    <div class="flex-1 flex flex-col min-w-0">
      <main class="flex-1 px-gutter py-stack-lg">
        <div class="max-w-container-max mx-auto">
          ${body}
        </div>
      </main>
      <footer class="bg-surface-container-low border-t border-outline-variant">
        <div class="flex flex-col md:flex-row justify-between items-center px-gutter py-stack-lg max-w-container-max mx-auto gap-stack-md">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-vibrant-blue text-sm">terminal</span>
            <span class="font-code-sm text-code-sm text-outline">CLAUDE_MARKETPLACE_BROWSER</span>
            <span class="font-code-sm text-code-sm text-outline opacity-50">v${PKG_VERSION}</span>
          </div>
          <nav class="flex gap-gutter">
            <a class="font-label-caps text-label-caps text-on-surface-variant hover:text-vibrant-blue transition-colors no-underline" href="${GITHUB_URL}" target="_blank" rel="noopener">GitHub</a>
            <a class="font-label-caps text-label-caps text-on-surface-variant hover:text-vibrant-blue transition-colors no-underline" href="${GITHUB_URL}#readme" target="_blank" rel="noopener">Documentation</a>
          </nav>
        </div>
      </footer>
    </div>
  </div>
  <script>
  (function() {
    var TYPE_TO_NAV = { agents: 'agents', mcpServers: 'mcp' };
    var type = new URLSearchParams(window.location.search).get('type') || '';
    var activeKey = TYPE_TO_NAV[type] || 'explore';
    document.querySelectorAll('[data-nav-key]').forEach(function(el) {
      var isActive = el.getAttribute('data-nav-key') === activeKey;
      el.className = isActive ? el.getAttribute('data-nav-cls-active') : el.getAttribute('data-nav-cls-inactive');
    });
  })();
  </script>
</body>
</html>`;
}

module.exports = { escapeHtml, layout, GITHUB_URL };
