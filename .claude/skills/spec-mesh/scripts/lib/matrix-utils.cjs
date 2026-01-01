#!/usr/bin/env node
'use strict';

/**
 * Matrix Utilities - Shared functions for matrix-ops.cjs and generate-matrix-view.cjs
 */

const fs = require('fs');
const path = require('path');

// Default paths
const DEFAULT_MATRIX_PATH = '.specify/specs/overview/matrix/cross-reference.json';
const LEGACY_MATRIX_PATHS = ['.specify/matrix/cross-reference.json'];

/**
 * Find existing path from candidates
 * @param {string[]} candidates - Array of candidate paths
 * @returns {string|null} - First existing path or null
 */
function findExistingPath(candidates) {
  for (const p of candidates) {
    const resolved = path.isAbsolute(p) ? p : path.resolve(process.cwd(), p);
    if (fs.existsSync(resolved)) {
      return p;
    }
  }
  return null;
}

/**
 * Load JSON file for matrix operations
 * @param {string} jsonPath - Path to JSON file
 * @returns {object} - Parsed JSON data
 */
function loadMatrixJson(jsonPath) {
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

/**
 * Generate Screen table markdown
 * @param {object} screens - Screens data from matrix
 * @returns {string} - Markdown table
 */
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

/**
 * Generate Feature table markdown
 * @param {object} features - Features data from matrix
 * @returns {string} - Markdown table
 */
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

/**
 * Generate reverse Master lookup table markdown
 * @param {object} data - Matrix data with screens and features
 * @returns {string} - Markdown table
 */
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
    const screensStr = u.screens.length > 0 ? u.screens.sort().join(', ') : '-';
    const featuresStr = u.features.length > 0 ? u.features.sort().join(', ') : '-';
    md += `| ${m} | ${screensStr} | ${featuresStr} |\n`;
  }

  return md;
}

/**
 * Generate reverse API lookup table markdown
 * @param {object} data - Matrix data with screens and features
 * @returns {string} - Markdown table
 */
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
    const screensStr = u.screens.length > 0 ? u.screens.sort().join(', ') : '-';
    const featuresStr = u.features.length > 0 ? u.features.sort().join(', ') : '-';
    md += `| ${api} | ${screensStr} | ${featuresStr} |\n`;
  }

  return md;
}

/**
 * Generate Permission table markdown
 * @param {object} permissions - Permissions data from matrix
 * @returns {string} - Markdown table
 */
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

/**
 * Generate full markdown view from matrix data
 * @param {object} data - Matrix data
 * @param {string} jsonPath - Source JSON path (for display)
 * @param {string} scriptName - Name of the generator script
 * @returns {string} - Full markdown document
 */
function generateMarkdown(data, jsonPath, scriptName = 'matrix-ops.cjs generate') {
  const now = new Date().toISOString().split('T')[0];

  let md = `# Cross Reference Matrix

> ⚠️ **AUTO-GENERATED** from \`${path.basename(jsonPath)}\`. Do not edit directly.
>
> Generated: ${now}
> Source: \`${jsonPath}\`
> Regenerate: \`node .claude/skills/spec-mesh/scripts/${scriptName}\`

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

module.exports = {
  DEFAULT_MATRIX_PATH,
  LEGACY_MATRIX_PATHS,
  findExistingPath,
  loadMatrixJson,
  generateScreenTable,
  generateFeatureTable,
  generateReverseMasterLookup,
  generateReverseApiLookup,
  generatePermissionTable,
  generateMarkdown
};
