'use strict';
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const { MARKETPLACE_PATH } = require('../browser.config');

const COMPONENT_TYPES = [
  { field: 'commands',   dir: 'commands', label: 'Commands' },
  { field: 'agents',     dir: 'agents',   label: 'Agents' },
  { field: 'hooks',      dir: 'hooks',    label: 'Hooks' },
  { field: 'mcpServers', dir: 'mcp',      label: 'MCP Servers' },
  { field: 'lspServers', dir: 'lsp',      label: 'LSP Servers' },
];

function stripFrontmatter(content) {
  return content.replace(/^---[\s\S]*?---\n?/, '');
}

// Returns true when a value is a filesystem path rather than a component name.
function isPath(value) {
  return typeof value === 'string' && (value.startsWith('.') || value.startsWith('/'));
}

// skills field per Anthropic spec: string or array of paths to directories
// that each contain <name>/SKILL.md sub-directories.
// Also supports legacy arrays of skill names resolved against .claude/skills/<name>.md
// or skills/<name>/SKILL.md.
function readSkillFiles(agentDir, skillsField) {
  const entries = Array.isArray(skillsField) ? skillsField : [skillsField];
  const files = [];
  for (const entry of entries) {
    if (isPath(entry)) {
      const dir = path.resolve(agentDir, entry);
      try {
        fs.readdirSync(dir, { withFileTypes: true })
          .filter(e => e.isDirectory())
          .forEach(e => {
            for (const filename of ['SKILL.md', 'README.md']) {
              try {
                const content = stripFrontmatter(fs.readFileSync(path.join(dir, e.name, filename), 'utf8'));
                files.push({ name: e.name, content });
                break;
              } catch (_) {}
            }
          });
      } catch (_) {}
    } else {
      // Legacy: name-based lookup
      for (const candidate of [
        path.join(agentDir, '.claude', 'skills', `${entry}.md`),
        path.join(agentDir, 'skills', entry, 'SKILL.md'),
        path.join(agentDir, 'skills', entry, 'README.md'),
      ]) {
        try {
          const content = stripFrontmatter(fs.readFileSync(candidate, 'utf8'));
          files.push({ name: entry, content });
          break;
        } catch (_) {}
      }
    }
  }
  return files;
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
      const candidates = [
        path.join(pluginDir, '.claude', dirName, `${name}.md`),
        path.join(pluginDir, dirName, name, 'README.md'),
      ];
      for (const candidate of candidates) {
        try {
          const content = stripFrontmatter(fs.readFileSync(candidate, 'utf8'));
          acc.push({ name, content });
          break;
        } catch (err) {
          if (err.code !== 'ENOENT') throw err;
        }
      }
    }
    return acc;
  }, []);
}

function readMarketplaceMeta() {
  const marketplacePath = path.resolve(MARKETPLACE_PATH, '.claude-plugin', 'marketplace.json');
  try {
    const data = JSON.parse(fs.readFileSync(marketplacePath, 'utf8'));
    return { name: data.name || null };
  } catch (_) {
    return { name: null };
  }
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

  const components = [];

  // Skills: only read when declared in marketplace.json
  if (agent.skills) {
    const files = readSkillFiles(agentDir, agent.skills);
    if (files.length > 0) components.push({ label: 'Skills', files });
  }

  // Other component types (name-based)
  for (const { field, dir, label } of COMPONENT_TYPES) {
    const declared = agent[field];
    if (!declared) continue;
    const nameList = Array.isArray(declared) ? declared : Object.keys(declared);
    if (nameList.length === 0) continue;
    const files = readComponentFiles(agentDir, dir, nameList);
    if (files.length > 0) components.push({ label, files });
  }

  // Use first skill file as readme when no root README/SKILL.md found
  if (!readmeHtml && components.length > 0 && components[0].files.length > 0) {
    readmeHtml = marked(components[0].files[0].content);
  }

  return { agent, readmeHtml, components };
}

function filterByType(agents, type) {
  if (!type) return agents;
  return agents.filter(a => {
    const val = a[type];
    return val && (Array.isArray(val) ? val.length > 0 : typeof val === 'object' ? Object.keys(val).length > 0 : true);
  });
}

module.exports = { readAgents, readAgentDetail, filterByType, readMarketplaceMeta };
