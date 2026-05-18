'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 3001;
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const MARKETPLACE_PATH = process.env.MARKETPLACE_PATH || path.join(__dirname, '..', 'example');

const DEMO_BANNER = `
<div style="background:#f59e0b;color:#1a1a2e;text-align:center;padding:0.6rem 1rem;font-size:0.875rem;font-weight:500;">
  Static demo — search and navigation require the
  <a href="https://github.com/NoxFr/claude-marketplace-browser" style="color:#1a1a2e;font-weight:700;">local server</a>.
</div>`;

function fetch(urlPath) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:${PORT}${urlPath}`, (res) => {
      let body = '';
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => resolve(body));
    }).on('error', reject);
  });
}

function waitForServer(retries = 20) {
  return new Promise((resolve, reject) => {
    const attempt = () => {
      http.get(`http://localhost:${PORT}/`, (res) => {
        res.resume();
        resolve();
      }).on('error', () => {
        if (retries-- <= 0) return reject(new Error('Server did not start'));
        setTimeout(attempt, 300);
      });
    };
    attempt();
  });
}

function injectBanner(html) {
  return html.replace('<body', `${DEMO_BANNER}<body`);
}

function rewriteLinksForIndex(html) {
  return html
    .replace(/href="\/agents\/([^"]+)"/g, (_, name) => `href="agents/${name}.html"`)
    .replace(/src="https:\/\/unpkg\.com\/htmx[^"]*"/g, '')
    .replace(/onerror="[^"]*"\/vendor\/htmx\.min\.js[^"]*"/g, '');
}

function rewriteLinksForAgent(html) {
  return html
    .replace(/href="\/agents\/([^"]+)"/g, (_, name) => `href="${name}.html"`)
    .replace(/href="\/"/g, 'href="../index.html"')
    .replace(/src="https:\/\/unpkg\.com\/htmx[^"]*"/g, '')
    .replace(/onerror="[^"]*"\/vendor\/htmx\.min\.js[^"]*"/g, '');
}

async function readPluginNames() {
  const marketplaceFile = path.join(MARKETPLACE_PATH, '.claude-plugin', 'marketplace.json');
  const data = JSON.parse(fs.readFileSync(marketplaceFile, 'utf8'));
  return (data.plugins || []).map(p => p.name);
}

async function build() {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  fs.mkdirSync(path.join(PUBLIC_DIR, 'agents'), { recursive: true });

  const serverEnv = { ...process.env, MARKETPLACE_PATH, PORT: String(PORT) };
  const serverPath = path.join(__dirname, '..', 'server.js');

  const child = spawn(process.execPath, [serverPath, '--marketplace', MARKETPLACE_PATH], {
    env: serverEnv,
    stdio: 'pipe',
  });

  child.stderr.pipe(process.stderr);

  try {
    await waitForServer();

    const indexHtml = await fetch('/');
    fs.writeFileSync(path.join(PUBLIC_DIR, 'index.html'), injectBanner(rewriteLinksForIndex(indexHtml)));
    console.log('  index.html');

    const plugins = await readPluginNames();
    for (const name of plugins) {
      const encoded = encodeURIComponent(name);
      const html = await fetch(`/agents/${encoded}`);
      const filename = `${name}.html`;
      fs.writeFileSync(path.join(PUBLIC_DIR, 'agents', filename), injectBanner(rewriteLinksForAgent(html)));
      console.log(`  agents/${filename}`);
    }
  } finally {
    child.kill();
  }

  console.log(`\nStatic site written to ${PUBLIC_DIR}`);
}

build().catch(err => { console.error(err); process.exit(1); });
