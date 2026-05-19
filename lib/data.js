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

const COMPONENT_AUTO_DETECT = [
  { field: 'skills',     dir: 'skills' },
  { field: 'agents',     dir: 'agents' },
  { field: 'commands',   dir: 'commands' },
  { field: 'hooks',      dir: 'hooks' },
  { field: 'mcpServers', dir: 'mcp' },
  { field: 'lspServers', dir: 'lsp' },
];

function stripFrontmatter(content) {
  return content.replace(/^---[\s\S]*?---\n?/, '');
}

function extractReferencedMdPaths(content) {
  const paths = [];
  const backtickRegex = /`([^`]+\.md)`/g;
  const mdLinkRegex = /\[[^\]]*\]\(([^)]+\.md)\)/g;
  let match;
  while ((match = backtickRegex.exec(content)) !== null) paths.push(match[1]);
  while ((match = mdLinkRegex.exec(content)) !== null) paths.push(match[1]);
  return [...new Set(paths)];
}

function resolveReferencedFiles(paths, sourceDir) {
  return paths.reduce((acc, refPath) => {
    const candidate = path.resolve(sourceDir, refPath);
    try {
      const content = stripFrontmatter(fs.readFileSync(candidate, 'utf8'));
      acc.push({ name: refPath, content });
    } catch (_) {}
    return acc;
  }, []);
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
            const skillDir = path.join(dir, e.name);
            for (const filename of ['SKILL.md', 'README.md']) {
              try {
                const content = stripFrontmatter(fs.readFileSync(path.join(skillDir, filename), 'utf8'));
                const referencedFiles = resolveReferencedFiles(extractReferencedMdPaths(content), skillDir);
                files.push({ name: e.name, content, referencedFiles });
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
          const referencedFiles = resolveReferencedFiles(extractReferencedMdPaths(content), path.dirname(candidate));
          files.push({ name: entry, content, referencedFiles });
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
          const filePath = path.join(pluginDir, filename);
          const content = stripFrontmatter(fs.readFileSync(filePath, 'utf8'));
          const referencedFiles = resolveReferencedFiles(extractReferencedMdPaths(content), pluginDir);
          acc.push({ name: filename.replace('.md', ''), content, referencedFiles });
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
          const referencedFiles = resolveReferencedFiles(extractReferencedMdPaths(content), path.dirname(candidate));
          acc.push({ name, content, referencedFiles });
          break;
        } catch (err) {
          if (err.code !== 'ENOENT') throw err;
        }
      }
    }
    return acc;
  }, []);
}

function loadLocalManifest(marketplacesDir, source) {
  const pluginDir = path.resolve(marketplacesDir, source);
  const manifestPath = path.join(pluginDir, '.claude-plugin', 'plugin.json');
  try {
    return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch (_) {
    return null;
  }
}

function detectLocalComponents(pluginDir) {
  const result = {};
  for (const { field, dir } of COMPONENT_AUTO_DETECT) {
    const dirPath = path.join(pluginDir, dir);
    try {
      fs.accessSync(dirPath);
      if (field === 'skills') {
        result[field] = `./${dir}`;
      } else {
        const entries = fs.readdirSync(dirPath, { withFileTypes: true })
          .filter(e => e.isDirectory())
          .map(e => e.name);
        if (entries.length > 0) result[field] = entries;
      }
    } catch (_) {}
  }
  return result;
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
  const marketplacesDir = path.resolve(MARKETPLACE_PATH);
  const marketplacePath = path.resolve(marketplacesDir, '.claude-plugin', 'marketplace.json');
  try {
    const content = fs.readFileSync(marketplacePath, 'utf8');
    const data = JSON.parse(content);
    const plugins = Array.isArray(data.plugins) ? data.plugins : (Array.isArray(data) ? data : []);
    return plugins
      .filter(p => {
        if (!p || !p.name) {
          console.warn('[marketplace] Plugin entry missing required field \'name\'');
          return false;
        }
        if (!p.source) {
          console.warn(`[marketplace] Plugin entry missing required field 'source': ${p.name}`);
          return false;
        }
        return true;
      })
      .map(p => {
        if (!p.source.startsWith('.')) return p;

        const pluginDir = path.resolve(marketplacesDir, p.source);
        const localManifest = loadLocalManifest(marketplacesDir, p.source);

        let merged = { ...p };
        if (localManifest) {
          const componentFields = ['skills', 'agents', 'commands', 'hooks', 'mcpServers', 'lspServers'];
          const overridden = componentFields.filter(f => localManifest[f] !== undefined && p[f] !== undefined);
          if (overridden.length > 0) {
            console.warn(`[marketplace] Local manifest overrides component fields for plugin ${p.name}: ${overridden.join(', ')}`);
          }
          merged = { ...p, ...localManifest };
        }

        const detected = detectLocalComponents(pluginDir);
        for (const [field, value] of Object.entries(detected)) {
          if (merged[field] === undefined) {
            merged[field] = value;
          }
        }

        if (merged.author && typeof merged.author === 'object') {
          merged.author = merged.author.name || null;
        }

        return merged;
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
