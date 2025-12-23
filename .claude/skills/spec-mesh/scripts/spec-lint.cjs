#!/usr/bin/env node
'use strict';

/**
 * Specification linter for Vision/Domain/Screen/Feature consistency.
 *
 * Error Handling:
 *   Exit Code 0: Validation passed (may have warnings)
 *   Exit Code 1: Validation failed with errors
 *     - Missing Spec Type or Spec ID
 *     - Duplicate Spec IDs or UC IDs
 *     - Unknown master/API/screen references
 *     - Feature ID not in Domain Feature index
 *     - Feature index path points to missing file
 *     - Matrix references undefined entities
 *     - Superseded spec without successor reference
 *
 * Warnings (exit code still 0):
 *   - Unexpected status value
 *   - Unused masters/APIs/screens
 *   - Missing User Stories or Functional Requirements section
 *   - No UC IDs in non-draft feature spec
 *   - Feature modified before Domain update
 *   - Plan/Tasks don't reference spec IDs
 *   - Deprecated spec without documented reason
 *   - No cross-reference.json found
 *
 * Common Errors:
 *   - "Missing Spec Type in X" - Add "Spec Type: [Type]" to spec metadata
 *   - "Missing Spec ID(s) in X" - Add "Spec ID: S-XXX-001" to spec metadata
 *   - "Spec ID X is duplicated" - Each spec must have unique ID
 *   - "Unknown master/API/screen X referenced in feature" - Add to Domain/Screen spec first
 *   - "Feature ID X is not listed in Domain Feature index" - Update Domain spec's Feature Index table
 * Checks:
 *  - Spec Type and Spec ID presence
 *  - Unique Spec IDs and UC IDs
 *  - Feature specs only reference masters/APIs defined in Domain specs
 *  - Feature specs only reference screens (SCR-*) defined in Screen specs
 *  - Warns on unused masters/APIs defined in Domain
 *  - Warns on unused screens defined in Screen spec
 *  - Screen Index table validation
 *  - Feature spec quality (UC presence, required sections)
 *  - Deprecated/Superseded specs have required metadata
 *  - Plan/Tasks alignment with spec IDs
 *  - Domain freshness vs Feature specs
 */

const fs = require('fs');
const path = require('path');

const root = process.cwd();
const specsRoot = path.join(root, '.specify', 'specs');
const allowedStatus = new Set([
  'DRAFT',
  'BACKLOG',
  'IN REVIEW',
  'APPROVED',
  'IMPLEMENTING',
  'COMPLETED',
  'DEPRECATED',
  'SUPERSEDED',
]);

const errors = [];
const warnings = [];

function rel(p) {
  return path.relative(root, p).replace(/\\/g, '/');
}

function walkForSpecs(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkForSpecs(full));
    } else if (entry.isFile() && entry.name.toLowerCase() === 'spec.md') {
      results.push(full);
    }
  }
  return results;
}

function normalizeSpecType(raw) {
  if (!raw) return null;
  const cleaned = raw.replace(/[\[\]]/g, '').split('|')[0].trim().toUpperCase();
  if (cleaned.startsWith('VISION')) return 'VISION';
  if (cleaned.startsWith('OVERVIEW') || cleaned.startsWith('DOMAIN')) return 'DOMAIN';
  if (cleaned.startsWith('SCREEN')) return 'SCREEN';
  if (cleaned.startsWith('FEATURE')) return 'FEATURE';
  if (cleaned.startsWith('FIX')) return 'FIX';
  return cleaned || null;
}

function extractList(raw) {
  if (!raw) return [];
  return raw
    .replace(/[\[\]]/g, '')
    .split(/[,|]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.toUpperCase());
}

function matchTokens(content, regex) {
  return Array.from(content.matchAll(regex)).map((m) => m[0].toUpperCase());
}

function parseSpec(file) {
  const content = fs.readFileSync(file, 'utf8');
  const typeMatch = content.match(/Spec Type:\s*([^\n\r]+)/i);
  const idsMatch = content.match(/Spec ID(?:\(s\))?:\s*([^\n\r]+)/i);
  const statusMatch = content.match(/Status:\s*([^\n\r]+)/i);

  const specType = normalizeSpecType(typeMatch && typeMatch[1]);
  const specIds = extractList(idsMatch && idsMatch[1]);
  const ucIds = matchTokens(content, /\bUC-[A-Z0-9_-]+\b/gi);
  const masters = matchTokens(content, /\bM-[A-Z0-9_-]+\b/gi);
  const apis = matchTokens(content, /\bAPI-[A-Z0-9_-]+\b/gi);
  const screens = matchTokens(content, /\bSCR-[A-Z0-9_-]+\b/gi);
  const status = statusMatch ? statusMatch[1].trim().toUpperCase() : null;

  return {
    file,
    relFile: rel(file),
    specType,
    specIds,
    ucIds,
    masters,
    apis,
    screens,
    status,
  };
}

if (!fs.existsSync(specsRoot)) {
  console.log('No specs directory found; nothing to lint.');
  process.exit(0);
}

const specFiles = walkForSpecs(specsRoot);
if (specFiles.length === 0) {
  console.log('No spec.md files found under .specify/specs; nothing to lint.');
  process.exit(0);
}

const specs = specFiles.map(parseSpec);
const fileContentCache = new Map(
  specFiles.map((f) => [f, fs.readFileSync(f, 'utf8')])
);

// Basic presence checks
for (const spec of specs) {
  if (!spec.specType) {
    errors.push(`Missing Spec Type in ${spec.relFile}`);
  }
  if (!spec.specIds.length) {
    errors.push(`Missing Spec ID(s) in ${spec.relFile}`);
  }
  if (spec.status && !allowedStatus.has(spec.status)) {
    warnings.push(`Unexpected Status "${spec.status}" in ${spec.relFile}. Allowed: ${Array.from(allowedStatus).join(', ')}`);
  }
}

// Uniqueness checks
const specIdCounts = new Map();
const ucIdCounts = new Map();
for (const spec of specs) {
  for (const id of spec.specIds) {
    specIdCounts.set(id, (specIdCounts.get(id) || 0) + 1);
  }
  for (const uc of spec.ucIds) {
    ucIdCounts.set(uc, (ucIdCounts.get(uc) || 0) + 1);
  }
}
for (const [id, count] of specIdCounts.entries()) {
  if (count > 1) errors.push(`Spec ID "${id}" is duplicated ${count} times`);
}
for (const [uc, count] of ucIdCounts.entries()) {
  if (count > 1) errors.push(`Use Case ID "${uc}" is duplicated ${count} times`);
}

// Collect specs by type
const domainSpecs = specs.filter((s) => s.specType === 'DOMAIN');
const screenSpecs = specs.filter((s) => s.specType === 'SCREEN');
const featureSpecs = specs.filter((s) => s.specType === 'FEATURE');

// Presence checks for domain vs feature
if (featureSpecs.length > 0 && domainSpecs.length === 0) {
  errors.push('Feature specs exist but no Domain spec found. Create a Domain spec first.');
}

const domainMasters = new Set();
const domainApis = new Set();
for (const spec of domainSpecs) {
  spec.masters.forEach((m) => domainMasters.add(m));
  spec.apis.forEach((a) => domainApis.add(a));
}

// Validate Feature references
const usedMasters = new Set();
const usedApis = new Set();
for (const spec of featureSpecs) {
  for (const m of spec.masters) {
    usedMasters.add(m);
    if (!domainMasters.has(m)) {
      errors.push(`Unknown master "${m}" referenced in feature ${spec.relFile}; update Domain spec first.`);
    }
  }
  for (const a of spec.apis) {
    usedApis.add(a);
    if (!domainApis.has(a)) {
      errors.push(`Unknown API "${a}" referenced in feature ${spec.relFile}; update Domain spec first.`);
    }
  }
}

// Warnings for unused Domain entries
for (const m of domainMasters) {
  if (!usedMasters.has(m)) warnings.push(`Master "${m}" defined in Domain is not referenced by any feature.`);
}
for (const a of domainApis) {
  if (!usedApis.has(a)) warnings.push(`API "${a}" defined in Domain is not referenced by any feature.`);
}

// ============================================================================
// Screen Spec Validation
// ============================================================================

// Collect SCR-* definitions from Screen specs
const screenDefinitions = new Set();
for (const spec of screenSpecs) {
  spec.screens.forEach((s) => screenDefinitions.add(s));
}

// Validate Feature screen references
const usedScreens = new Set();
for (const spec of featureSpecs) {
  for (const s of spec.screens) {
    usedScreens.add(s);
    if (screenSpecs.length > 0 && !screenDefinitions.has(s)) {
      errors.push(`Unknown screen "${s}" referenced in feature ${spec.relFile}; update Screen spec first.`);
    }
  }
}

// Warnings for unused screens (only if Screen spec exists)
if (screenSpecs.length > 0) {
  for (const s of screenDefinitions) {
    if (!usedScreens.has(s)) warnings.push(`Screen "${s}" defined in Screen spec is not referenced by any feature.`);
  }
}

// Check Screen Index table in Screen spec
// Case-insensitive matching for header
const screenRows = new Map(); // ID -> name
for (const spec of screenSpecs) {
  const text = fileContentCache.get(spec.file);
  const textUpper = text.toUpperCase();
  // Check for Screen Index header (case-insensitive)
  const hasScreenIndex = textUpper.includes('| SCREEN ID') && textUpper.includes('| NAME');
  if (!hasScreenIndex) {
    warnings.push(`Screen ${spec.relFile} is missing Screen Index table header.`);
    continue;
  }
  const lines = text.split(/\r?\n/);
  let inTable = false;
  for (const line of lines) {
    const trimmed = line.trim();
    const trimmedUpper = trimmed.toUpperCase();
    // Case-insensitive header detection
    if (trimmedUpper.includes('| SCREEN ID') && trimmedUpper.includes('| NAME')) {
      inTable = true;
      continue;
    }
    if (inTable) {
      if (!trimmed.startsWith('|')) break;
      if (trimmed.includes('---')) continue; // Skip separator row
      const cells = trimmed.split('|').map((c) => c.trim()).filter(Boolean);
      if (cells.length >= 2 && cells[0].toUpperCase().startsWith('SCR-')) {
        screenRows.set(cells[0].toUpperCase(), cells[1]);
      }
    }
  }
}

// Check Feature index table in Domain spec
// Support both 4-column (legacy) and 5-column (new) formats
const featureIndexHeader4 = '| FEATURE ID | TITLE | PATH | STATUS |';
const featureIndexHeader5 = '| FEATURE ID | TITLE | PATH | STATUS | RELATED M-*/API-* |';
const domainFeatureRows = new Map(); // ID -> {path,status}
for (const spec of domainSpecs) {
  const originalText = fileContentCache.get(spec.file);
  const textUpper = originalText.toUpperCase();
  const has4Col = textUpper.includes(featureIndexHeader4);
  const has5Col = textUpper.includes(featureIndexHeader5);
  if (!has4Col && !has5Col) {
    warnings.push(`Domain ${spec.relFile} is missing Feature index table header.`);
    continue;
  }
  // Use original text for parsing to preserve path case
  const lines = originalText.split(/\r?\n/);
  let inTable = false;
  for (const line of lines) {
    const trimmed = line.trim();
    const trimmedUpper = trimmed.toUpperCase();
    if (trimmedUpper === featureIndexHeader4 || trimmedUpper === featureIndexHeader5) {
      inTable = true;
      continue;
    }
    if (inTable) {
      if (!trimmed.startsWith('|')) break;
      if (trimmed.includes('---')) continue; // Skip separator row
      const cells = trimmed.split('|').map((c) => c.trim()).filter(Boolean);
      if (cells.length >= 4) {
        const id = cells[0].toUpperCase();
        const pathCell = cells[2]; // Keep original case for paths
        const statusCell = cells[3];
        domainFeatureRows.set(id, { path: pathCell, status: statusCell });
      }
    }
  }
}

// Enforce Feature IDs appear in Domain table
for (const spec of featureSpecs) {
  for (const id of spec.specIds) {
    if (!domainFeatureRows.has(id.toUpperCase())) {
      errors.push(`Feature ID "${id}" is not listed in any Domain Feature index table.`);
    }
  }
}

// Check paths and status in Feature index table
for (const [id, meta] of domainFeatureRows.entries()) {
  const specMatch = featureSpecs.find((s) => s.specIds.includes(id));
  if (!specMatch) continue;
  if (meta.path) {
    // Remove backticks, normalize slashes, and strip leading ./
    const p = meta.path.replace(/`/g, '').replace(/\\/g, '/').replace(/^\.?\//, '');
    const full = path.join(root, p);
    if (!fs.existsSync(full)) {
      errors.push(`Feature index entry for "${id}" points to missing path: ${meta.path}`);
    }
  }
  if (meta.status) {
    const st = meta.status.toUpperCase();
    if (!allowedStatus.has(st)) {
      warnings.push(`Feature index status "${meta.status}" for "${id}" is not in allowed set: ${Array.from(allowedStatus).join(', ')}`);
    }
  }
}

// ============================================================================
// Extended Quality Checks
// ============================================================================

// Check Feature spec quality (UC presence)
for (const spec of featureSpecs) {
  const content = fileContentCache.get(spec.file);

  // Skip deprecated/superseded specs
  if (spec.status === 'DEPRECATED' || spec.status === 'SUPERSEDED') continue;

  // Check for User Stories section (## 4. in new template, ## 6. in old template)
  const hasUserStoriesSection =
    content.includes('## 4. User Stories') ||
    content.includes('## 6. User Stories') ||
    content.includes('User Stories / Use Cases');
  if (!hasUserStoriesSection) {
    warnings.push(`Feature ${spec.relFile} is missing "User Stories" section`);
  }

  // Check for at least one UC ID in non-draft specs
  if (spec.ucIds.length === 0 && spec.status !== 'DRAFT') {
    warnings.push(`Feature ${spec.relFile} has no UC IDs defined (status: ${spec.status})`);
  }

  // Check for Functional Requirements section in approved+ specs (## 5. in new, ## 7. in old)
  if (['APPROVED', 'IMPLEMENTING', 'COMPLETED'].includes(spec.status)) {
    const hasFRSection =
      content.includes('## 5. Functional Requirements') ||
      content.includes('## 7. Functional Requirements');
    if (!hasFRSection) {
      warnings.push(`Feature ${spec.relFile} is missing "Functional Requirements" section for status ${spec.status}`);
    }
  }
}

// Check Deprecated/Superseded specs have required metadata
for (const spec of specs) {
  const content = fileContentCache.get(spec.file);

  if (spec.status === 'SUPERSEDED') {
    // Must have "Superseded by:" reference
    if (!content.match(/superseded\s+by[:\s]+S-[A-Z0-9_-]+/i)) {
      errors.push(`Superseded spec ${spec.relFile} must reference successor spec ID (e.g., "Superseded by: S-XXX-001")`);
    }
  }

  if (spec.status === 'DEPRECATED') {
    // Should have deprecation reason in changelog or notes
    if (!content.match(/deprecat/i) || content.match(/deprecat/gi).length < 2) {
      warnings.push(`Deprecated spec ${spec.relFile} should document deprecation reason`);
    }
  }
}

// Check Plan/Tasks alignment with spec
for (const spec of specs) {
  const specDir = path.dirname(spec.file);
  const planPath = path.join(specDir, 'plan.md');
  const tasksPath = path.join(specDir, 'tasks.md');

  // Check plan.md references spec IDs
  if (fs.existsSync(planPath)) {
    const planContent = fs.readFileSync(planPath, 'utf8');
    const planSpecRefs = matchTokens(planContent, /\bS-[A-Z0-9_-]+\b/gi);

    // Warn if plan exists but doesn't reference any of the spec's IDs
    const hasMatchingRef = spec.specIds.some((id) => planSpecRefs.includes(id));
    if (!hasMatchingRef && spec.specIds.length > 0) {
      warnings.push(`Plan at ${rel(planPath)} does not reference any IDs from ${spec.relFile}`);
    }
  }

  // Check tasks.md references spec IDs or UC IDs
  if (fs.existsSync(tasksPath)) {
    const tasksContent = fs.readFileSync(tasksPath, 'utf8');
    const tasksSpecRefs = matchTokens(tasksContent, /\bS-[A-Z0-9_-]+\b/gi);
    const tasksUcRefs = matchTokens(tasksContent, /\bUC-[A-Z0-9_-]+\b/gi);

    // Warn if tasks exist but don't reference spec IDs or UCs
    const hasSpecRef = spec.specIds.some((id) => tasksSpecRefs.includes(id));
    const hasUcRef = spec.ucIds.some((uc) => tasksUcRefs.includes(uc));
    if (!hasSpecRef && !hasUcRef && (spec.specIds.length > 0 || spec.ucIds.length > 0)) {
      warnings.push(`Tasks at ${rel(tasksPath)} do not reference IDs from ${spec.relFile}`);
    }
  }
}

// Check Domain freshness vs Feature specs
if (domainSpecs.length > 0) {
  const domainMtimes = domainSpecs.map((s) => fs.statSync(s.file).mtime.getTime());
  const latestDomainMtime = Math.max(...domainMtimes);

  for (const spec of featureSpecs) {
    // Skip deprecated/superseded/completed specs
    if (['DEPRECATED', 'SUPERSEDED', 'COMPLETED'].includes(spec.status)) continue;

    const featureMtime = fs.statSync(spec.file).mtime.getTime();
    if (featureMtime < latestDomainMtime) {
      const daysDiff = Math.floor((latestDomainMtime - featureMtime) / (1000 * 60 * 60 * 24));
      if (daysDiff > 7) {
        warnings.push(
          `Feature ${spec.relFile} was last modified ${daysDiff} days before the latest Domain update; consider reviewing for consistency`
        );
      }
    }
  }
}

// ============================================================================
// Cross-Reference Matrix Validation
// ============================================================================

// Matrix paths - check new structure first, then legacy locations
function findMatrixPath() {
  // New structure: .specify/specs/{project}/overview/matrix/
  const projectDirs = fs.existsSync(specsRoot)
    ? fs.readdirSync(specsRoot, { withFileTypes: true })
        .filter(d => d.isDirectory() && d.name !== 'vision')
        .map(d => d.name)
    : [];

  for (const project of projectDirs) {
    const newPath = path.join(specsRoot, project, 'overview', 'matrix', 'cross-reference.json');
    if (fs.existsSync(newPath)) return newPath;
  }

  // Legacy: .specify/matrix/
  const legacyPath1 = path.join(root, '.specify', 'matrix', 'cross-reference.json');
  if (fs.existsSync(legacyPath1)) return legacyPath1;

  // Legacy: .specify/specs/matrix/
  const legacyPath2 = path.join(specsRoot, 'matrix', 'cross-reference.json');
  if (fs.existsSync(legacyPath2)) return legacyPath2;

  return null;
}

function loadMatrix() {
  const matrixPath = findMatrixPath();
  if (matrixPath) {
    console.log(`Found matrix at: ${rel(matrixPath)}`);
    return JSON.parse(fs.readFileSync(matrixPath, 'utf8'));
  }
  return null;
}

const matrix = loadMatrix();

if (matrix) {
  console.log('Found cross-reference.json, validating matrix consistency...\n');

  // Collect all defined entities from specs
  const definedMasters = domainMasters;
  const definedApis = domainApis;
  const definedScreens = screenDefinitions;
  const definedFeatures = new Set(featureSpecs.flatMap((s) => s.specIds));

  // Validate screens in matrix
  if (matrix.screens) {
    for (const [scrId, scrData] of Object.entries(matrix.screens)) {
      const scrIdUpper = scrId.toUpperCase();

      // Check screen ID exists in Screen spec
      if (screenSpecs.length > 0 && !definedScreens.has(scrIdUpper)) {
        errors.push(`Matrix references undefined screen "${scrId}" - add to Screen spec first`);
      }

      // Check masters referenced by screen exist in Domain spec
      if (scrData.masters) {
        for (const m of scrData.masters) {
          if (!definedMasters.has(m.toUpperCase())) {
            errors.push(`Matrix screen "${scrId}" references undefined master "${m}" - add to Domain spec first`);
          }
        }
      }

      // Check APIs referenced by screen exist in Domain spec
      if (scrData.apis) {
        for (const a of scrData.apis) {
          if (!definedApis.has(a.toUpperCase())) {
            errors.push(`Matrix screen "${scrId}" references undefined API "${a}" - add to Domain spec first`);
          }
        }
      }
    }
  }

  // Validate features in matrix
  if (matrix.features) {
    for (const [featId, featData] of Object.entries(matrix.features)) {
      const featIdUpper = featId.toUpperCase();

      // Check feature ID exists as Feature spec
      if (!definedFeatures.has(featIdUpper) && !domainFeatureRows.has(featIdUpper)) {
        warnings.push(`Matrix references feature "${featId}" which has no spec file yet`);
      }

      // Check screens referenced by feature exist
      if (featData.screens && screenSpecs.length > 0) {
        for (const s of featData.screens) {
          if (!definedScreens.has(s.toUpperCase())) {
            errors.push(`Matrix feature "${featId}" references undefined screen "${s}" - add to Screen spec first`);
          }
        }
      }

      // Check masters referenced by feature exist
      if (featData.masters) {
        for (const m of featData.masters) {
          if (!definedMasters.has(m.toUpperCase())) {
            errors.push(`Matrix feature "${featId}" references undefined master "${m}" - add to Domain spec first`);
          }
        }
      }

      // Check APIs referenced by feature exist
      if (featData.apis) {
        for (const a of featData.apis) {
          if (!definedApis.has(a.toUpperCase())) {
            errors.push(`Matrix feature "${featId}" references undefined API "${a}" - add to Domain spec first`);
          }
        }
      }
    }
  }

  // Validate permissions reference existing APIs
  if (matrix.permissions) {
    for (const apiId of Object.keys(matrix.permissions)) {
      if (!definedApis.has(apiId.toUpperCase())) {
        errors.push(`Matrix permissions reference undefined API "${apiId}" - add to Domain spec first`);
      }
    }
  }

  // Warn about entities in specs not in matrix
  const matrixScreenIds = new Set(Object.keys(matrix.screens || {}).map((s) => s.toUpperCase()));
  const matrixMasters = new Set();
  const matrixApis = new Set();

  if (matrix.screens) {
    for (const scrData of Object.values(matrix.screens)) {
      (scrData.masters || []).forEach((m) => matrixMasters.add(m.toUpperCase()));
      (scrData.apis || []).forEach((a) => matrixApis.add(a.toUpperCase()));
    }
  }
  if (matrix.features) {
    for (const featData of Object.values(matrix.features)) {
      (featData.masters || []).forEach((m) => matrixMasters.add(m.toUpperCase()));
      (featData.apis || []).forEach((a) => matrixApis.add(a.toUpperCase()));
    }
  }

  // Screens in spec but not in matrix
  for (const s of definedScreens) {
    if (!matrixScreenIds.has(s)) {
      warnings.push(`Screen "${s}" defined in Screen spec is not in cross-reference.json`);
    }
  }

  // Masters in Domain but not referenced in matrix
  for (const m of definedMasters) {
    if (!matrixMasters.has(m)) {
      warnings.push(`Master "${m}" defined in Domain spec is not referenced in cross-reference.json`);
    }
  }

  // APIs in Domain but not referenced in matrix
  for (const a of definedApis) {
    if (!matrixApis.has(a)) {
      warnings.push(`API "${a}" defined in Domain spec is not referenced in cross-reference.json`);
    }
  }
} else {
  // Matrix file not found - this is OK for projects that haven't adopted it yet
  if (screenSpecs.length > 0 || domainSpecs.length > 0) {
    warnings.push('No cross-reference.json found. Consider creating one for better traceability.');
  }
}

// ============================================================================
// Output Results
// ============================================================================

if (errors.length) {
  console.error('Spec lint FAILED with errors:');
  errors.forEach((e, i) => console.error(`${i + 1}. ${e}`));
  if (warnings.length) {
    console.error('\nWarnings:');
    warnings.forEach((w) => console.error(`- ${w}`));
  }
  process.exit(1);
}

if (warnings.length) {
  console.warn('Spec lint passed with warnings:');
  warnings.forEach((w) => console.warn(`- ${w}`));
} else {
  console.log('Spec lint passed with no issues.');
}
