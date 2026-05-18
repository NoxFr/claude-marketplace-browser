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

const TAILWIND_CONFIG = `
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "surface": "#0b1326",
        "surface-dim": "#0b1326",
        "surface-bright": "#31394d",
        "surface-container-lowest": "#060e20",
        "surface-container-low": "#131b2e",
        "surface-container": "#171f33",
        "surface-container-high": "#222a3d",
        "surface-container-highest": "#2d3449",
        "on-surface": "#dae2fd",
        "on-surface-variant": "#c2c6d6",
        "outline": "#8c909f",
        "outline-variant": "#424754",
        "primary": "#adc6ff",
        "primary-container": "#4d8eff",
        "on-primary": "#002e6a",
        "secondary": "#89ceff",
        "secondary-container": "#00a2e6",
        "on-secondary-container": "#00344e",
        "inverse-surface": "#dae2fd",
        "inverse-on-surface": "#283044",
        "surface-variant": "#2d3449",
        "vibrant-blue": "#3B82F6",
        "slate-400": "#94A3B8",
        "slate-700": "#334155",
        "slate-800": "#1E293B",
        "slate-900": "#0F172A",
        "status-success": "#10B981",
        "status-warning": "#F59E0B",
        "status-error": "#EF4444",
        "mcp-label": "#A855F7",
        "skill-label": "#EC4899"
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
      spacing: {
        "margin-mobile": "1rem",
        "stack-sm": "0.5rem",
        "stack-md": "1rem",
        "stack-lg": "2rem",
        "gutter": "1.5rem",
        "container-max": "1280px"
      },
      fontFamily: {
        "body-base": ["Inter", "sans-serif"],
        "body-sm": ["Inter", "sans-serif"],
        "headline-lg": ["Hanken Grotesk", "sans-serif"],
        "headline-md": ["Hanken Grotesk", "sans-serif"],
        "label-caps": ["JetBrains Mono", "monospace"],
        "code-sm": ["JetBrains Mono", "monospace"]
      },
      fontSize: {
        "body-base": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "body-sm": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "label-caps": ["12px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "600" }],
        "code-sm": ["13px", { lineHeight: "18px", fontWeight: "400" }]
      }
    }
  }
}`;

function buildSidebarNav(activeNav) {
  const items = [
    { key: 'explore',    href: '/',                    icon: 'explore',   label: 'Explore' },
    { key: 'agents',     href: '/?type=agents',         icon: 'smart_toy', label: 'Agents' },
    { key: 'mcp',        href: '/?type=mcpServers',     icon: 'dns',       label: 'MCP Servers' },
    { key: 'docs',       href: GITHUB_URL,              icon: 'description', label: 'Documentation' },
  ];

  const links = items.map(({ key, href, icon, label }) => {
    const isActive = key === activeNav;
    const cls = isActive
      ? 'flex items-center gap-3 px-4 py-3 bg-secondary-container text-on-secondary-container font-bold rounded-lg transition-all duration-200'
      : 'flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-variant rounded-lg transition-all duration-200';
    const target = href.startsWith('http') ? ' target="_blank" rel="noopener"' : '';
    return `<a class="${cls}" href="${href}"${target}>
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

  return items.map(({ key, href, label, external }) => {
    const isActive = key === activeNav;
    const cls = isActive
      ? 'font-label-caps text-label-caps text-vibrant-blue font-bold hover:text-vibrant-blue transition-colors no-underline'
      : 'font-label-caps text-label-caps text-on-surface-variant hover:text-vibrant-blue transition-colors no-underline';
    const target = external ? ' target="_blank" rel="noopener"' : '';
    return `<a class="${cls}" href="${href}"${target}>${label}</a>`;
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
  <script src="https://cdn.tailwindcss.com?plugins=forms"></script>
  <script id="tailwind-config">${TAILWIND_CONFIG}</script>
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
</body>
</html>`;
}

module.exports = { escapeHtml, layout, GITHUB_URL };
