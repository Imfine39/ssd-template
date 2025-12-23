#!/usr/bin/env node
'use strict';

/**
 * Generate cross-reference.md from cross-reference.json
 *
 * Error Handling:
 *   Exit Code 0: Success or help shown
 *   Exit Code 1: File/Parse error
 *     - Matrix JSON file not found
 *     - JSON parse error
 *
 * Common Errors:
 *   - "ERROR: Matrix file not found: X" - Create cross-reference.json first
 *   - "ERROR: Failed to parse JSON" - Fix JSON syntax in cross-reference.json
 *
 * Usage:
 *   node .claude/skills/spec-mesh/scripts/generate-matrix-view.cjs [options] [path-to-json]
 *
 * Options:
 *   --project <name>  Project name (default: sample)
 *   --help            Show this help message
 *
 * If no path provided, uses .specify/specs/{project}/overview/matrix/cross-reference.json
 * Output is written to same directory as cross-reference.md
 */

const fs = require('fs');
const path = require('path');

// Default project
const DEFAULT_PROJECT = 'sample';

// Get default JSON path for a project
function getDefaultJsonPath(project) {
  return `.specify/specs/${project}/overview/matrix/cross-reference.json`;
}

// Legacy paths for backward compatibility
const LEGACY_JSON_PATHS = [
  '.specify/matrix/cross-reference.json'
];

// Find existing path from candidates
function findExistingPath(candidates) {
  for (const p of candidates) {
    const resolved = path.isAbsolute(p) ? p : path.resolve(process.cwd(), p);
    if (fs.existsSync(resolved)) {
      return p;
    }
  }
  return null;
}

function loadJson(jsonPath) {
  if (!fs.existsSync(jsonPath)) {
    console.error(`ERROR: Matrix file not found: ${jsonPath}`);
    process.exit(1);
  }

  try {
    const content = fs.readFileSync(jsonPath, 'utf8');
    return JSON.parse(content);
  } catch (e) {
    console.error(`ERROR: Failed to parse JSON: ${e.message}`);
    process.exit(1);
  }
}

function generateScreenTable(screens) {
  if (!screens || Object.keys(screens).length === 0) {
    return '*No screens defined*\n';
  }

  let md = '| Screen ID | Name | Masters | APIs |\n';
  md += '|-----------|------|---------|------|\n';

  const sortedIds = Object.keys(screens).sort();
  for (const id of sortedIds) {
    const s = screens[id];
    const masters = (s.masters || []).join(', ') || '-';
    const apis = (s.apis || []).join(', ') || '-';
    md += `| ${id} | ${s.name || ''} | ${masters} | ${apis} |\n`;
  }

  return md;
}

function generateFeatureTable(features) {
  if (!features || Object.keys(features).length === 0) {
    return '*No features defined*\n';
  }

  let md = '| Feature ID | Title | Screens | Masters | APIs | Rules |\n';
  md += '|------------|-------|---------|---------|------|-------|\n';

  const sortedIds = Object.keys(features).sort();
  for (const id of sortedIds) {
    const f = features[id];
    const screens = (f.screens || []).join(', ') || '-';
    const masters = (f.masters || []).join(', ') || '-';
    const apis = (f.apis || []).join(', ') || '-';
    const rules = (f.rules || []).join(', ') || '-';
    md += `| ${id} | ${f.title || ''} | ${screens} | ${masters} | ${apis} | ${rules} |\n`;
  }

  return md;
}

function generateReverseMasterLookup(data) {
  const { screens, features } = data;
  const masterUsage = {};

  // Collect from screens
  if (screens) {
    for (const [scrId, scrData] of Object.entries(screens)) {
      for (const m of (scrData.masters || [])) {
        if (!masterUsage[m]) masterUsage[m] = { screens: [], features: [] };
        masterUsage[m].screens.push(scrId);
      }
    }
  }

  // Collect from features
  if (features) {
    for (const [featId, featData] of Object.entries(features)) {
      for (const m of (featData.masters || [])) {
        if (!masterUsage[m]) masterUsage[m] = { screens: [], features: [] };
        if (!masterUsage[m].features.includes(featId)) {
          masterUsage[m].features.push(featId);
        }
      }
    }
  }

  if (Object.keys(masterUsage).length === 0) {
    return '*No masters defined*\n';
  }

  let md = '| Master | Used by Screens | Used by Features |\n';
  md += '|--------|-----------------|------------------|\n';

  const sortedMasters = Object.keys(masterUsage).sort();
  for (const m of sortedMasters) {
    const u = masterUsage[m];
    const screens = u.screens.length > 0 ? u.screens.sort().join(', ') : '-';
    const features = u.features.length > 0 ? u.features.sort().join(', ') : '-';
    md += `| ${m} | ${screens} | ${features} |\n`;
  }

  return md;
}

function generateReverseApiLookup(data) {
  const { screens, features } = data;
  const apiUsage = {};

  // Collect from screens
  if (screens) {
    for (const [scrId, scrData] of Object.entries(screens)) {
      for (const api of (scrData.apis || [])) {
        if (!apiUsage[api]) apiUsage[api] = { screens: [], features: [] };
        apiUsage[api].screens.push(scrId);
      }
    }
  }

  // Collect from features
  if (features) {
    for (const [featId, featData] of Object.entries(features)) {
      for (const api of (featData.apis || [])) {
        if (!apiUsage[api]) apiUsage[api] = { screens: [], features: [] };
        if (!apiUsage[api].features.includes(featId)) {
          apiUsage[api].features.push(featId);
        }
      }
    }
  }

  if (Object.keys(apiUsage).length === 0) {
    return '*No APIs defined*\n';
  }

  let md = '| API | Used by Screens | Used by Features |\n';
  md += '|-----|-----------------|------------------|\n';

  const sortedApis = Object.keys(apiUsage).sort();
  for (const api of sortedApis) {
    const u = apiUsage[api];
    const screens = u.screens.length > 0 ? u.screens.sort().join(', ') : '-';
    const features = u.features.length > 0 ? u.features.sort().join(', ') : '-';
    md += `| ${api} | ${screens} | ${features} |\n`;
  }

  return md;
}

function generatePermissionTable(permissions) {
  if (!permissions || Object.keys(permissions).length === 0) {
    return '*No permissions defined*\n';
  }

  // Collect all roles
  const allRoles = new Set();
  for (const roles of Object.values(permissions)) {
    for (const role of roles) {
      allRoles.add(role);
    }
  }
  const sortedRoles = Array.from(allRoles).sort();

  let md = '| API | ' + sortedRoles.join(' | ') + ' |\n';
  md += '|-----|' + sortedRoles.map(() => '---').join('|') + '|\n';

  const sortedApis = Object.keys(permissions).sort();
  for (const api of sortedApis) {
    const apiRoles = permissions[api] || [];
    const cells = sortedRoles.map(role => apiRoles.includes(role) ? '✓' : '-');
    md += `| ${api} | ${cells.join(' | ')} |\n`;
  }

  return md;
}

function generateMarkdown(data, jsonPath) {
  const now = new Date().toISOString().split('T')[0];

  let md = `# Cross Reference Matrix

> ⚠️ **AUTO-GENERATED** from \`${path.basename(jsonPath)}\`. Do not edit directly.
>
> Generated: ${now}
> Source: \`${jsonPath}\`
> Regenerate: \`node .claude/skills/spec-mesh/scripts/generate-matrix-view.cjs\`

---

## 1. Screen → Domain

Which Masters and APIs each screen uses.

${generateScreenTable(data.screens)}

---

## 2. Feature → Domain

Which Screens, Masters, APIs, and Rules each feature uses.

${generateFeatureTable(data.features)}

---

## 3. Reverse Lookup: Master → Usage

Find all screens and features that use a specific Master.

${generateReverseMasterLookup(data)}

---

## 4. Reverse Lookup: API → Usage

Find all screens and features that use a specific API.

${generateReverseApiLookup(data)}

---

## 5. Permission Matrix

Role-based API permissions.

${generatePermissionTable(data.permissions)}

---

## 6. Statistics

| Metric | Count |
|--------|-------|
| Total Screens | ${Object.keys(data.screens || {}).length} |
| Total Features | ${Object.keys(data.features || {}).length} |
| Total Masters Referenced | ${new Set([...(Object.values(data.screens || {}).flatMap(s => s.masters || [])), ...(Object.values(data.features || {}).flatMap(f => f.masters || []))]).size} |
| Total APIs Referenced | ${new Set([...(Object.values(data.screens || {}).flatMap(s => s.apis || [])), ...(Object.values(data.features || {}).flatMap(f => f.apis || []))]).size} |
| Total Rules Referenced | ${new Set(Object.values(data.features || {}).flatMap(f => f.rules || [])).size} |

---

*This file is auto-generated. To update, edit \`${path.basename(jsonPath)}\` and run the generator script.*
`;

  return md;
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  let project = DEFAULT_PROJECT;
  let jsonPath = null;

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--project':
        project = args[++i];
        break;
      case '--help':
        console.log(`
Cross-Reference Matrix View Generator

Generates a Markdown view (cross-reference.md) from cross-reference.json.

Usage:
  node .claude/skills/spec-mesh/scripts/generate-matrix-view.cjs [options] [path-to-json]

Options:
  --project <name>  Project name (default: ${DEFAULT_PROJECT})
  --help            Show this help message

If no path is provided, uses:
  .specify/specs/{project}/overview/matrix/cross-reference.json

Examples:
  node .claude/skills/spec-mesh/scripts/generate-matrix-view.cjs
  node .claude/skills/spec-mesh/scripts/generate-matrix-view.cjs --project myproject
  node .claude/skills/spec-mesh/scripts/generate-matrix-view.cjs .specify/specs/sample/overview/matrix/cross-reference.json
        `);
        process.exit(0);
      default:
        // Assume any non-option argument is the JSON path
        if (!args[i].startsWith('--')) {
          jsonPath = args[i];
        }
    }
  }

  // Determine JSON path: explicit > existing project path > existing legacy path > default project path
  const projectPath = getDefaultJsonPath(project);
  if (!jsonPath) {
    jsonPath = findExistingPath([projectPath, ...LEGACY_JSON_PATHS]) || projectPath;
  }

  return { project, jsonPath };
}

function main() {
  const { project, jsonPath: inputPath } = parseArgs();

  // Resolve to absolute path
  let jsonPath = inputPath;
  if (!path.isAbsolute(jsonPath)) {
    jsonPath = path.resolve(process.cwd(), jsonPath);
  }

  console.log(`Project: ${project}`);
  console.log(`Reading: ${jsonPath}`);
  const data = loadJson(jsonPath);

  const mdPath = jsonPath.replace(/\.json$/, '.md');
  const markdown = generateMarkdown(data, inputPath);

  fs.writeFileSync(mdPath, markdown, 'utf8');
  console.log(`Generated: ${mdPath}`);

  // Print summary
  console.log('');
  console.log('=== Summary ===');
  console.log(`Screens: ${Object.keys(data.screens || {}).length}`);
  console.log(`Features: ${Object.keys(data.features || {}).length}`);
  console.log(`Permissions: ${Object.keys(data.permissions || {}).length} APIs`);
}

main();
