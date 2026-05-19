#!/usr/bin/env node
'use strict';

// Set env vars before requiring browser.config.js (read at require time)
(function parseArgs() {
  const args = process.argv.slice(2);
  if (!args.includes('--marketplace-path')) {
    const positional = args.find(a => !a.startsWith('-'));
    if (positional) process.env.MARKETPLACE_PATH = positional;
  }
  if (!args.includes('--marketplace-url')) {
    const positionals = args.filter(a => !a.startsWith('-'));
    if (positionals[1]) process.env.MARKETPLACE_URL = positionals[1];
  }
})();

const fs = require('fs');
const path = require('path');
const { readAgents, readAgentDetail, readMarketplaceMeta } = require('../lib/data');
const { renderListPage, renderDetailPage } = require('../lib/render');
const { MARKETPLACE_PATH, MARKETPLACE_URL } = require('../browser.config');

const DIST_DIR = path.join(process.cwd(), 'dist');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// Rewrite absolute paths for root index.html (dist/index.html)
function rewriteForIndex(html) {
  return html
    .replace(/href="\/styles\.css"/g, 'href="styles.css"')
    .replace(/src="\/search\.js"/g, 'src="search.js"')
    .replace(/href="\/agents\/([^"]+)"/g, (_, name) => `href="agents/${name}/index.html"`)
    .replace(/href="\/((\?[^"]*)?)"/g, (_, qs) => `href="index.html${qs}"`);
}

// Rewrite absolute paths for agent detail pages (dist/agents/{name}/index.html)
function rewriteForAgent(html) {
  return html
    .replace(/href="\/styles\.css"/g, 'href="../../styles.css"')
    .replace(/src="\/search\.js"/g, 'src="../../search.js"')
    .replace(/href="\/agents\/([^"]+)"/g, (_, name) => `href="../../agents/${name}/index.html"`)
    .replace(/href="\/((\?[^"]*)?)"/g, (_, qs) => `href="../../index.html${qs}"`);
}

function build() {
  const agents = readAgents();
  const categories = [...new Set(agents.map(a => a.category).filter(Boolean))].sort();
  const { name: marketplaceName } = readMarketplaceMeta();

  console.log(`\n🏪  Building marketplace: ${marketplaceName}`);
  console.log(`📂  Source : ${path.resolve(MARKETPLACE_PATH)}`);
  console.log(`📦  Output : ${DIST_DIR}\n`);

  fs.mkdirSync(DIST_DIR, { recursive: true });
  fs.mkdirSync(path.join(DIST_DIR, 'agents'), { recursive: true });

  const indexHtml = rewriteForIndex(renderListPage(agents, categories, '', MARKETPLACE_URL));
  fs.writeFileSync(path.join(DIST_DIR, 'index.html'), indexHtml);
  console.log('  ✅ index.html');

  const built = [];
  for (const agent of agents) {
    const result = readAgentDetail(agent.name);
    if (!result) continue;
    const slug = encodeURIComponent(agent.name);
    const agentDir = path.join(DIST_DIR, 'agents', slug);
    fs.mkdirSync(agentDir, { recursive: true });
    const html = rewriteForAgent(renderDetailPage(result.agent, result.readmeHtml, result.components, marketplaceName));
    fs.writeFileSync(path.join(agentDir, 'index.html'), html);
    built.push(agent.name);
  }

  fs.copyFileSync(path.join(PUBLIC_DIR, 'styles.css'), path.join(DIST_DIR, 'styles.css'));
  fs.copyFileSync(path.join(PUBLIC_DIR, 'search.js'), path.join(DIST_DIR, 'search.js'));

  if (built.length === 0) {
    console.warn('⚠️  No plugins found in marketplace.json');
  } else {
    console.log(`\n🧩  ${built.length} plugin${built.length !== 1 ? 's' : ''}:`);
    for (const name of built) console.log(`     · ${name}`);
  }

  const indexPath = path.join(DIST_DIR, 'index.html');
  console.log(`\n🚀  Open: \x1b]8;;file://${indexPath}\x1b\\file://${indexPath}\x1b]8;;\x1b\\\n`);
}

build();
