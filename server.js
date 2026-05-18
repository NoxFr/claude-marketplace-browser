'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const { readAgents, readAgentDetail, filterByType, readMarketplaceMeta } = require('./lib/data');
const { escapeHtml, layout, renderGrid, renderListPage, renderDetailPage } = require('./lib/render');

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const { MARKETPLACE_URL } = require('./browser.config');

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  if (req.method === 'GET' && pathname === '/') {
    const type = url.searchParams.get('type') || '';
    let agents = readAgents();
    if (type) agents = filterByType(agents, type);
    const categories = [...new Set(agents.map(a => a.category).filter(Boolean))].sort();
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(renderListPage(agents, categories, type, MARKETPLACE_URL));
    return;
  }

  if (req.method === 'GET' && pathname === '/search') {
    const q = (url.searchParams.get('q') || '').toLowerCase().trim();
    const category = (url.searchParams.get('category') || '').trim();
    const type = (url.searchParams.get('type') || '').trim();
    let agents = readAgents();
    if (type) agents = filterByType(agents, type);
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
      res.end(layout('Plugin not found', `
        <div class="text-center py-16">
          <h2 class="font-headline-lg text-headline-lg text-status-error mb-4">Plugin not found</h2>
          <p class="font-body-base text-body-base text-on-surface-variant mb-6">The plugin <strong>${escapeHtml(name)}</strong> does not exist in this marketplace.</p>
          <a class="inline-flex items-center gap-2 text-slate-400 hover:text-vibrant-blue transition-colors font-body-sm text-body-sm no-underline" href="/">
            <span class="material-symbols-outlined text-[18px]">arrow_back</span>Back to list
          </a>
        </div>`));
      return;
    }
    const { name: marketplaceName } = readMarketplaceMeta();
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(renderDetailPage(result.agent, result.readmeHtml, result.components, marketplaceName));
    return;
  }

  if (req.method === 'GET' && pathname === '/styles.css') {
    const cssPath = path.join(__dirname, 'public', 'styles.css');
    try {
      const content = fs.readFileSync(cssPath);
      res.writeHead(200, { 'Content-Type': 'text/css; charset=utf-8' });
      res.end(content);
    } catch (_) {
      res.writeHead(404);
      res.end('not found');
    }
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
  res.end(layout('404 — Not found', `
    <div class="text-center py-16">
      <h2 class="font-headline-lg text-headline-lg text-status-error mb-4">Page not found</h2>
      <a class="inline-flex items-center gap-2 text-slate-400 hover:text-vibrant-blue transition-colors font-body-sm text-body-sm no-underline" href="/">
        <span class="material-symbols-outlined text-[18px]">arrow_back</span>Back to list
      </a>
    </div>`));
});

server.listen(PORT, () => {
  console.log(`[marketplace] Server running at http://localhost:${PORT}`);
  console.log(`[marketplace] Using marketplace: ${path.resolve(require('./browser.config').MARKETPLACE_PATH)}`);
});
