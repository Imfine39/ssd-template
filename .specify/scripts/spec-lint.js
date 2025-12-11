#!/usr/bin/env node
'use strict';

/**
 * Specification linter for Overview/Feature consistency.
 * Checks:
 *  - Spec Type and Spec ID presence
 *  - Unique Spec IDs and UC IDs
 *  - Feature specs only reference masters/APIs defined in Overview specs
 *  - Warns on unused masters/APIs defined in Overview
 */

const fs = require('fs');
const path = require('path');

const root = process.cwd();
const specsRoot = path.join(root, '.specify', 'specs');

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
  if (cleaned.startsWith('OVERVIEW')) return 'OVERVIEW';
  if (cleaned.startsWith('FEATURE')) return 'FEATURE';
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
  const idsMatch = content.match(/Spec ID\(s\):\s*([^\n\r]+)/i);

  const specType = normalizeSpecType(typeMatch && typeMatch[1]);
  const specIds = extractList(idsMatch && idsMatch[1]);
  const ucIds = matchTokens(content, /\bUC-[A-Z0-9_-]+\b/gi);
  const masters = matchTokens(content, /\bM-[A-Z0-9_-]+\b/gi);
  const apis = matchTokens(content, /\bAPI-[A-Z0-9_-]+\b/gi);

  return {
    file,
    relFile: rel(file),
    specType,
    specIds,
    ucIds,
    masters,
    apis,
  };
}

if (!fs.existsSync(specsRoot)) {
  console.log('No specs directory found at .specify/specs; nothing to lint.');
  process.exit(0);
}

const specFiles = walkForSpecs(specsRoot);
if (specFiles.length === 0) {
  console.log('No spec.md files found under .specify/specs; nothing to lint.');
  process.exit(0);
}

const specs = specFiles.map(parseSpec);

// Basic presence checks
for (const spec of specs) {
  if (!spec.specType) {
    errors.push(`Missing Spec Type in ${spec.relFile}`);
  }
  if (!spec.specIds.length) {
    errors.push(`Missing Spec ID(s) in ${spec.relFile}`);
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

// Collect Overview definitions
const overviewMasters = new Set();
const overviewApis = new Set();
for (const spec of specs.filter((s) => s.specType === 'OVERVIEW')) {
  spec.masters.forEach((m) => overviewMasters.add(m));
  spec.apis.forEach((a) => overviewApis.add(a));
}

// Validate Feature references
const usedMasters = new Set();
const usedApis = new Set();
for (const spec of specs.filter((s) => s.specType === 'FEATURE')) {
  for (const m of spec.masters) {
    usedMasters.add(m);
    if (!overviewMasters.has(m)) {
      errors.push(`Unknown master "${m}" referenced in feature ${spec.relFile}; update Overview first.`);
    }
  }
  for (const a of spec.apis) {
    usedApis.add(a);
    if (!overviewApis.has(a)) {
      errors.push(`Unknown API "${a}" referenced in feature ${spec.relFile}; update Overview first.`);
    }
  }
}

// Warnings for unused Overview entries
for (const m of overviewMasters) {
  if (!usedMasters.has(m)) warnings.push(`Master "${m}" defined in Overview is not referenced by any feature.`);
}
for (const a of overviewApis) {
  if (!usedApis.has(a)) warnings.push(`API "${a}" defined in Overview is not referenced by any feature.`);
}

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
