'use strict';
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const { MARKETPLACE_PATH } = require('../browser.config');

const COMPONENT_TYPES = [
  { field: 'skills',     dir: 'skills',   label: 'Skills' },
  { field: 'commands',   dir: 'commands', label: 'Commands' },
  { field: 'agents',     dir: 'agents',   label: 'Agents' },
  { field: 'hooks',      dir: 'hooks',    label: 'Hooks' },
  { field: 'mcpServers', dir: 'mcp',      label: 'MCP Servers' },
  { field: 'lspServers', dir: 'lsp',      label: 'LSP Servers' },
];

function stripFrontmatter(content) {
  return content.replace(/^---[\s\S]*?---\n?/, '');
}

function readComponentFiles(pluginDir, dirName, names) {
  return names.reduce((acc, name) => {
    if (name === './') {
      for (const filename of ['SKILL.md', 'README.md']) {
        try {
          const content = stripFrontmatter(fs.readFileSync(path.join(pluginDir, filename), 'utf8'));
          acc.push({ name: filename.replace('.md', ''), content });
          break;
        } catch (err) {
          if (err.code !== 'ENOENT') throw err;
        }
      }
    } else {
      try {
        const content = stripFrontmatter(fs.readFileSync(path.join(pluginDir, '.claude', dirName, `${name}.md`), 'utf8'));
        acc.push({ name, content });
      } catch (err) {
        if (err.code !== 'ENOENT') throw err;
      }
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

  const agentDir = agent.source
    ? path.resolve(MARKETPLACE_PATH, agent.source)
    : path.resolve(MARKETPLACE_PATH, name);

  let readmeHtml = null;
  for (const filename of ['SKILL.md', 'README.md']) {
    try {
      const content = stripFrontmatter(fs.readFileSync(path.join(agentDir, filename), 'utf8'));
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

function filterByType(agents, type) {
  if (!type) return agents;
  return agents.filter(a => {
    const val = a[type];
    return val && (Array.isArray(val) ? val.length > 0 : Object.keys(val).length > 0);
  });
}

module.exports = { readAgents, readAgentDetail, filterByType };
