'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const { MARKETPLACE_PATH } = require('./browser.config');

const PORT = 3000;

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const COMPONENT_TYPES = [
  { field: 'skills',     dir: 'skills',   label: 'Skills' },
  { field: 'commands',   dir: 'commands', label: 'Commands' },
  { field: 'agents',     dir: 'agents',   label: 'Agents' },
  { field: 'hooks',      dir: 'hooks',    label: 'Hooks' },
  { field: 'mcpServers', dir: 'mcp',      label: 'MCP Servers' },
  { field: 'lspServers', dir: 'lsp',      label: 'LSP Servers' },
];

function readComponentFiles(pluginDir, dirName, names) {
  return names.reduce((acc, name) => {
    const filePath = path.join(pluginDir, '.claude', dirName, `${name}.md`);
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      acc.push({ name, content });
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
    }
    return acc;
  }, []);
}

function readAgents() {
  const marketplacePath = path.resolve(MARKETPLACE_PATH, '.claude-plugin', 'marketplace.json');
  try {
    const content = fs.readFileSync(marketplacePath, 'utf8');
    const data = JSON.parse(content);
    const plugins = Array.isArray(data.plugins) ? data.plugins : (Array.isArray(data) ? data : []);
    return plugins.filter(p => {
      if (!p || !p.name) {
        console.warn('[marketplace] Plugin entry without name ignored:', p);
        return false;
      }
      return true;
    });
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.warn(`[marketplace] marketplace.json not found at ${marketplacePath}`);
    } else {
      console.error('[marketplace] Error reading marketplace.json:', err.message);
    }
    return [];
  }
}

function readAgentDetail(name) {
  const agents = readAgents();
  const agent = agents.find(a => a.name === name);
  if (!agent) return null;

  let readmeHtml = null;
  const agentDir = path.resolve(MARKETPLACE_PATH, name);
  for (const filename of ['SKILL.md', 'README.md']) {
    const filePath = path.join(agentDir, filename);
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      readmeHtml = marked(content);
      break;
    } catch (_) {}
  }

  const components = COMPONENT_TYPES.reduce((acc, { field, dir, label }) => {
    const declared = agent[field];
    if (!declared) return acc;
    const nameList = Array.isArray(declared) ? declared : Object.keys(declared);
    if (nameList.length === 0) return acc;
    const files = readComponentFiles(agentDir, dir, nameList);
    if (files.length > 0) acc.push({ label, files });
    return acc;
  }, []);

  return { agent, readmeHtml, components };
}

function renderComponentLabels(plugin) {
  const componentMap = [
    ['skills', 'Skill'],
    ['commands', 'Command'],
    ['agents', 'Agent'],
    ['hooks', 'Hook'],
    ['mcpServers', 'MCP'],
    ['lspServers', 'LSP'],
  ];

  const labels = componentMap
    .filter(([field]) => plugin[field] && (Array.isArray(plugin[field]) ? plugin[field].length > 0 : Object.keys(plugin[field]).length > 0))
    .map(([, label]) => `<span class="badge badge-${label.toLowerCase()}">${label}</span>`);

  if (labels.length === 0) {
    return '<span class="badge badge-plugin">Plugin</span>';
  }

  return labels.join('');
}

function layout(title, body) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <script src="https://unpkg.com/htmx.org@1.9.10/dist/htmx.min.js" onerror="this.onerror=null;this.src='/vendor/htmx.min.js'"></script>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f7fa; color: #1a1a2e; min-height: 100vh; display: flex; flex-direction: column; }
    header { background: #16213e; color: white; padding: 1.5rem 2rem; }
    header h1 { font-size: 1.5rem; font-weight: 700; letter-spacing: -0.5px; }
    header p { font-size: 0.875rem; opacity: 0.7; margin-top: 0.25rem; }
    main { flex: 1; padding: 2rem; max-width: 1200px; margin: 0 auto; width: 100%; }
    footer { background: #16213e; color: rgba(255,255,255,0.6); text-align: center; padding: 1rem; font-size: 0.8rem; }
    .search-bar { display: flex; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap; }
    .search-bar input { flex: 1; min-width: 200px; padding: 0.75rem 1rem; border: 1px solid #dde3ed; border-radius: 8px; font-size: 0.95rem; outline: none; }
    .search-bar input:focus { border-color: #4361ee; box-shadow: 0 0 0 3px rgba(67,97,238,0.1); }
    .search-bar select { padding: 0.75rem 1rem; border: 1px solid #dde3ed; border-radius: 8px; font-size: 0.95rem; background: white; outline: none; cursor: pointer; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.25rem; }
    .card { background: white; border-radius: 12px; padding: 1.5rem; border: 1px solid #eaecf0; text-decoration: none; color: inherit; display: block; transition: box-shadow 0.2s, transform 0.2s; }
    .card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.08); transform: translateY(-2px); }
    .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem; }
    .card-name { font-size: 1rem; font-weight: 600; color: #16213e; }
    .card-version { font-size: 0.75rem; color: #6b7280; background: #f3f4f6; padding: 0.2rem 0.5rem; border-radius: 4px; white-space: nowrap; }
    .card-description { font-size: 0.875rem; color: #4b5563; line-height: 1.5; margin-bottom: 1rem; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; min-height: 3.9rem; }
    .card-footer { display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; }
    .card-category { font-size: 0.75rem; color: #6b7280; white-space: nowrap; }
    .badges { display: flex; flex-wrap: wrap; gap: 0.35rem; justify-content: flex-end; }
    .badge { font-size: 0.7rem; font-weight: 600; padding: 0.2rem 0.5rem; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
    .badge-skill { background: #dbeafe; color: #1d4ed8; }
    .badge-command { background: #d1fae5; color: #065f46; }
    .badge-agent { background: #ede9fe; color: #5b21b6; }
    .badge-hook { background: #fef3c7; color: #92400e; }
    .badge-mcp { background: #fce7f3; color: #9d174d; }
    .badge-lsp { background: #e0f2fe; color: #0369a1; }
    .badge-plugin { background: #f3f4f6; color: #374151; }
    .empty { text-align: center; padding: 4rem 2rem; color: #9ca3af; font-size: 1rem; }
    .detail-header { margin-bottom: 2rem; }
    .detail-title { font-size: 2rem; font-weight: 700; margin-bottom: 0.75rem; }
    .detail-meta { display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; color: #6b7280; font-size: 0.875rem; margin-bottom: 1rem; }
    .detail-description { font-size: 1rem; color: #4b5563; line-height: 1.6; margin-bottom: 1.5rem; }
    .detail-readme { background: white; border: 1px solid #eaecf0; border-radius: 12px; padding: 2rem; line-height: 1.6; }
    .detail-readme h1, .detail-readme h2, .detail-readme h3 { margin: 1.5rem 0 0.75rem; color: #16213e; }
    .detail-readme h1:first-child, .detail-readme h2:first-child { margin-top: 0; }
    .detail-readme p { margin-bottom: 1rem; color: #4b5563; }
    .detail-readme ul, .detail-readme ol { margin: 0 0 1rem 1.5rem; color: #4b5563; }
    .detail-readme li { margin-bottom: 0.25rem; }
    .detail-readme code { background: #f3f4f6; padding: 0.1rem 0.35rem; border-radius: 4px; font-size: 0.875em; font-family: 'SFMono-Regular', Consolas, monospace; }
    .detail-readme pre { background: #1a1a2e; color: #e2e8f0; padding: 1.25rem; border-radius: 8px; overflow-x: auto; margin-bottom: 1rem; }
    .detail-readme pre code { background: none; color: inherit; padding: 0; }
    .back-link { display: inline-flex; align-items: center; gap: 0.4rem; color: #4361ee; text-decoration: none; font-size: 0.875rem; margin-bottom: 1.5rem; }
    .back-link:hover { text-decoration: underline; }
    .error-page { text-align: center; padding: 4rem 2rem; }
    .error-page h2 { font-size: 2rem; color: #ef4444; margin-bottom: 1rem; }
    .error-page p { color: #6b7280; margin-bottom: 1.5rem; }
    .detail-components { margin-top: 2rem; }
    .component-group { margin-bottom: 1.5rem; }
    .component-group-title { font-size: 0.75rem; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.75px; margin-bottom: 0.5rem; }
    .component-accordion { background: white; border: 1px solid #eaecf0; border-radius: 8px; margin-bottom: 0.5rem; overflow: hidden; }
    .component-summary { padding: 0.875rem 1rem; cursor: pointer; font-weight: 500; color: #16213e; display: flex; align-items: center; gap: 0.5rem; list-style: none; user-select: none; }
    .component-summary::-webkit-details-marker { display: none; }
    .component-summary::before { content: '▶'; font-size: 0.6em; color: #9ca3af; transition: transform 0.15s; flex-shrink: 0; }
    details[open] > .component-summary::before { transform: rotate(90deg); }
    .component-content { padding: 1.5rem; border-top: 1px solid #eaecf0; }
  </style>
</head>
<body hx-boost="true">
  <header>
    <h1>Claude Marketplace Browser</h1>
    <p>Explorez et découvrez les plugins disponibles</p>
  </header>
  <main>
    ${body}
  </main>
  <footer>Made with ❤️ by Mathieu Durand</footer>
</body>
</html>`;
}

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

function renderGrid(agents) {
  if (agents.length === 0) {
    return '<div class="empty">Aucun résultat pour cette recherche</div>';
  }
  return `<div class="grid" id="grid">${agents.map(renderAgentCard).join('\n')}</div>`;
}

function renderListPage(agents, categories) {
  const categoryOptions = categories
    .map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`)
    .join('');

  const body = `
    <div class="search-bar">
      <input id="search-input" name="q" type="search" placeholder="Rechercher un plugin…"
        hx-get="/search" hx-trigger="input delay:200ms" hx-target="#grid" hx-include="#category-select">
      <select id="category-select" name="category"
        hx-get="/search" hx-trigger="change" hx-target="#grid" hx-include="#search-input">
        <option value="">Toutes les catégories</option>
        ${categoryOptions}
      </select>
    </div>
    ${agents.length === 0
      ? '<div class="empty">Aucun plugin disponible dans ce marketplace</div>'
      : `<div class="grid" id="grid">${agents.map(renderAgentCard).join('\n')}</div>`
    }`;

  return layout('Claude Marketplace Browser', body);
}

function renderDetailPage(agent, readmeHtml, components) {
  const componentsHtml = components && components.length > 0 ? `
    <div class="detail-components">
      ${components.map(group => `
        <div class="component-group">
          <h3 class="component-group-title">${escapeHtml(group.label)}</h3>
          ${group.files.map(file => `
            <details class="component-accordion" open>
              <summary class="component-summary">${escapeHtml(file.name)}</summary>
              <div class="component-content detail-readme">${marked(file.content)}</div>
            </details>`).join('')}
        </div>`).join('')}
    </div>` : '';

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
    ${componentsHtml}`;

  return layout(agent.name, body);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  if (req.method === 'GET' && pathname === '/') {
    const agents = readAgents();
    const categories = [...new Set(agents.map(a => a.category).filter(Boolean))].sort();
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(renderListPage(agents, categories));
    return;
  }

  if (req.method === 'GET' && pathname === '/search') {
    const q = (url.searchParams.get('q') || '').toLowerCase().trim();
    const category = (url.searchParams.get('category') || '').trim();
    let agents = readAgents();
    if (q) {
      agents = agents.filter(a =>
        (a.name && a.name.toLowerCase().includes(q)) ||
        (a.description && a.description.toLowerCase().includes(q))
      );
    }
    if (category) {
      agents = agents.filter(a => a.category === category);
    }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(renderGrid(agents));
    return;
  }

  if (req.method === 'GET' && pathname.startsWith('/agents/')) {
    const name = decodeURIComponent(pathname.slice('/agents/'.length));
    const result = readAgentDetail(name);
    if (!result) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(layout('Plugin introuvable', `
        <div class="error-page">
          <h2>Plugin introuvable</h2>
          <p>Le plugin <strong>${escapeHtml(name)}</strong> n'existe pas dans ce marketplace.</p>
          <a class="back-link" href="/">← Retour à la liste</a>
        </div>`));
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(renderDetailPage(result.agent, result.readmeHtml, result.components));
    return;
  }

  if (req.method === 'GET' && pathname === '/vendor/htmx.min.js') {
    const vendorPath = path.join(__dirname, 'vendor', 'htmx.min.js');
    try {
      const content = fs.readFileSync(vendorPath);
      res.writeHead(200, { 'Content-Type': 'application/javascript' });
      res.end(content);
    } catch (_) {
      res.writeHead(404);
      res.end('not found');
    }
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(layout('404', `
    <div class="error-page">
      <h2>Page introuvable</h2>
      <a class="back-link" href="/">← Retour à la liste</a>
    </div>`));
});

server.listen(PORT, () => {
  console.log(`[marketplace] Server running at http://localhost:${PORT}`);
  console.log(`[marketplace] Using marketplace: ${path.resolve(MARKETPLACE_PATH)}`);
});
