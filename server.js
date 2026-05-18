'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const { readAgents, readAgentDetail } = require('./lib/data');
const { escapeHtml, layout, renderGrid, renderListPage, renderDetailPage } = require('./lib/render');

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

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
  res.end(layout('404', `
    <div class="error-page">
      <h2>Page introuvable</h2>
      <a class="back-link" href="/">← Retour à la liste</a>
    </div>`));
});

server.listen(PORT, () => {
  console.log(`[marketplace] Server running at http://localhost:${PORT}`);
  console.log(`[marketplace] Using marketplace: ${path.resolve(require('./browser.config').MARKETPLACE_PATH)}`);
});
