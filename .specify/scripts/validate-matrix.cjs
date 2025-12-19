#!/usr/bin/env node
'use strict';

/**
 * Validate cross-reference.json against Screen Spec and Domain Spec
 *
 * Complements spec-lint.cjs:
 *   - spec-lint.cjs: Checks that Matrix references exist in Specs (Matrix → Spec)
 *   - validate-matrix.cjs: Checks that Specs are reflected in Matrix (Spec → Matrix)
 *
 * Usage:
 *   node .specify/scripts/validate-matrix.cjs [options]
 *
 * Options:
 *   --screen <path>  Path to Screen Spec (default: .specify/specs/screen/spec.md)
 *   --domain <path>  Path to Domain Spec (default: .specify/specs/domain/spec.md)
 *   --matrix <path>  Path to Matrix JSON (default: .specify/matrix/cross-reference.json)
 *   --fix            Generate suggested additions to stdout
 *   --help           Show this help message
 *
 * Exit codes:
 *   0 - Validation passed (no missing mappings)
 *   1 - Validation failed (missing mappings found)
 *   2 - Error (file not found, etc.)
 */

const fs = require('fs');
const path = require('path');

// Default paths
const DEFAULT_SCREEN_PATH = '.specify/specs/screen/spec.md';
const DEFAULT_DOMAIN_PATH = '.specify/specs/domain/spec.md';
const DEFAULT_MATRIX_PATH = '.specify/matrix/cross-reference.json';

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    screenPath: DEFAULT_SCREEN_PATH,
    domainPath: DEFAULT_DOMAIN_PATH,
    matrixPath: DEFAULT_MATRIX_PATH,
    fix: false,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--screen':
        options.screenPath = args[++i];
        break;
      case '--domain':
        options.domainPath = args[++i];
        break;
      case '--matrix':
        options.matrixPath = args[++i];
        break;
      case '--fix':
        options.fix = true;
        break;
      case '--help':
        console.log(`
Cross-Reference Matrix Validator

Validates that Screen Spec and Domain Spec content is properly reflected in cross-reference.json.
Complements spec-lint.cjs which checks the reverse direction (Matrix → Spec).

Usage: node validate-matrix.cjs [options]

Options:
  --screen <path>  Path to Screen Spec (default: ${DEFAULT_SCREEN_PATH})
  --domain <path>  Path to Domain Spec (default: ${DEFAULT_DOMAIN_PATH})
  --matrix <path>  Path to Matrix JSON (default: ${DEFAULT_MATRIX_PATH})
  --fix            Output suggested Matrix additions as JSON
  --help           Show this help message

Exit codes:
  0 - Validation passed
  1 - Validation failed (missing mappings)
  2 - Error (file not found, etc.)

Examples:
  node .specify/scripts/validate-matrix.cjs
  node .specify/scripts/validate-matrix.cjs --fix > suggestions.json
  node .specify/scripts/validate-matrix.cjs --screen .specify/specs/sample/screen/spec.md --domain .specify/specs/sample/domain/spec.md --matrix .specify/specs/sample/matrix/cross-reference.json
        `);
        process.exit(0);
    }
  }

  return options;
}

// Read file content
function readFile(filePath, required = true) {
  const resolved = path.isAbsolute(filePath)
    ? filePath
    : path.resolve(process.cwd(), filePath);

  if (!fs.existsSync(resolved)) {
    if (required) {
      console.error(`ERROR: File not found: ${resolved}`);
      process.exit(2);
    }
    return null;
  }

  return fs.readFileSync(resolved, 'utf8');
}

// Load Matrix JSON
function loadMatrix(matrixPath) {
  const content = readFile(matrixPath, false);
  if (!content) return null;

  try {
    return JSON.parse(content);
  } catch (e) {
    console.error(`ERROR: Failed to parse Matrix JSON: ${e.message}`);
    process.exit(2);
  }
}

// Extract screens from Screen Spec Section 2 (Screen Index table)
function extractScreenIds(screenContent) {
  const screenIds = [];

  const section2Match = screenContent.match(
    /## 2\. Screen Index[\s\S]*?\n\|[^\n]+\|\n\|[-|\s]+\|\n([\s\S]*?)(?=\n##|\n\*\*Status values|\n### 2\.1|$)/
  );

  if (!section2Match) return screenIds;

  const tableContent = section2Match[1];
  const rows = tableContent.split('\n').filter((line) => line.trim().startsWith('|'));

  for (const row of rows) {
    const cells = row.split('|').map((c) => c.trim()).filter((c) => c);
    if (cells.length >= 1 && cells[0].match(/^SCR-\d+$/)) {
      screenIds.push(cells[0]);
    }
  }

  return screenIds;
}

// Extract masters (M-*) from Domain Spec Section 3
function extractMasterIds(domainContent) {
  const masters = new Set();
  const masterPattern = /### (M-[A-Z][A-Z0-9_-]*)/g;
  let match;

  while ((match = masterPattern.exec(domainContent)) !== null) {
    // Normalize: remove -001 suffix
    const normalized = match[1].replace(/-\d+$/, '');
    masters.add(normalized);
  }

  return Array.from(masters);
}

// Extract APIs (API-*) from Domain Spec Section 4
function extractApiIds(domainContent) {
  const apis = [];
  const section4Match = domainContent.match(/## 4\. API Contracts[\s\S]*?(?=\n## 5\.|$)/);
  if (!section4Match) return apis;

  const apiPattern = /### (API-[A-Z][A-Z0-9_-]*)/g;
  let match;

  while ((match = apiPattern.exec(section4Match[0])) !== null) {
    apis.push(match[1]);
  }

  return apis;
}

// Extract feature IDs from Domain Spec Section 8
function extractFeatureIds(domainContent) {
  const features = [];

  const section8Match = domainContent.match(
    /## 8\. Feature Index[\s\S]*?\n\|[^\n]+\|\n\|[-|\s]+\|\n([\s\S]*?)(?=\n\*\*Status values|\n## \d+|$)/
  );

  if (!section8Match) return features;

  const tableContent = section8Match[1];
  const rows = tableContent.split('\n').filter((line) => line.trim().startsWith('|'));

  for (const row of rows) {
    const cells = row.split('|').map((c) => c.trim()).filter((c) => c);
    if (cells.length >= 1 && cells[0].match(/^S-[A-Z]+-\d+$/)) {
      features.push(cells[0]);
    }
  }

  return features;
}

// Compare and find missing items
function findMissing(expected, actual, label) {
  const missing = [];
  const actualSet = new Set(actual.map((a) => a.toUpperCase()));

  for (const item of expected) {
    if (!actualSet.has(item.toUpperCase())) {
      missing.push(item);
    }
  }

  return missing;
}

// Main validation logic
function validate(options) {
  console.log('=== Cross-Reference Matrix Validator ===\n');

  // Load files
  console.log('Loading files...');
  const screenContent = readFile(options.screenPath);
  const domainContent = readFile(options.domainPath);
  const matrix = loadMatrix(options.matrixPath);

  if (!matrix) {
    console.log(`\nMatrix file not found: ${options.matrixPath}`);
    console.log('Run AI-based Matrix generation during /speckit.design or create manually.');
    process.exit(1);
  }

  console.log(`  Screen: ${options.screenPath}`);
  console.log(`  Domain: ${options.domainPath}`);
  console.log(`  Matrix: ${options.matrixPath}`);

  // Extract from Specs
  console.log('\nExtracting from Specs...');
  const specScreens = extractScreenIds(screenContent);
  const specMasters = extractMasterIds(domainContent);
  const specApis = extractApiIds(domainContent);
  const specFeatures = extractFeatureIds(domainContent);

  console.log(`  Screens in Spec: ${specScreens.length}`);
  console.log(`  Masters in Spec: ${specMasters.length}`);
  console.log(`  APIs in Spec: ${specApis.length}`);
  console.log(`  Features in Spec: ${specFeatures.length}`);

  // Extract from Matrix
  console.log('\nExtracting from Matrix...');
  const matrixScreens = Object.keys(matrix.screens || {});
  const matrixFeatures = Object.keys(matrix.features || {});
  const matrixPermissionApis = Object.keys(matrix.permissions || {});

  // Collect all masters and APIs referenced in matrix
  const matrixMasters = new Set();
  const matrixApis = new Set();

  for (const scrData of Object.values(matrix.screens || {})) {
    (scrData.masters || []).forEach((m) => matrixMasters.add(m.toUpperCase()));
    (scrData.apis || []).forEach((a) => matrixApis.add(a.toUpperCase()));
  }
  for (const featData of Object.values(matrix.features || {})) {
    (featData.masters || []).forEach((m) => matrixMasters.add(m.toUpperCase()));
    (featData.apis || []).forEach((a) => matrixApis.add(a.toUpperCase()));
  }

  console.log(`  Screens in Matrix: ${matrixScreens.length}`);
  console.log(`  Features in Matrix: ${matrixFeatures.length}`);
  console.log(`  Masters referenced: ${matrixMasters.size}`);
  console.log(`  APIs referenced: ${matrixApis.size}`);

  // Find missing items
  console.log('\n=== Validation Results ===\n');

  const issues = {
    missingScreens: findMissing(specScreens, matrixScreens),
    missingFeatures: findMissing(specFeatures, matrixFeatures),
    missingMasters: findMissing(specMasters, Array.from(matrixMasters)),
    missingApis: findMissing(specApis, Array.from(matrixApis)),
    missingPermissions: findMissing(specApis, matrixPermissionApis),
  };

  let hasIssues = false;

  // Report missing screens
  if (issues.missingScreens.length > 0) {
    hasIssues = true;
    console.log('Missing Screens in Matrix:');
    issues.missingScreens.forEach((s) => console.log(`  - ${s}`));
    console.log('');
  }

  // Report missing features
  if (issues.missingFeatures.length > 0) {
    hasIssues = true;
    console.log('Missing Features in Matrix:');
    issues.missingFeatures.forEach((f) => console.log(`  - ${f}`));
    console.log('');
  }

  // Report unreferenced masters
  if (issues.missingMasters.length > 0) {
    hasIssues = true;
    console.log('Masters in Spec but not referenced in Matrix:');
    issues.missingMasters.forEach((m) => console.log(`  - ${m}`));
    console.log('');
  }

  // Report unreferenced APIs
  if (issues.missingApis.length > 0) {
    hasIssues = true;
    console.log('APIs in Spec but not referenced in Matrix:');
    issues.missingApis.forEach((a) => console.log(`  - ${a}`));
    console.log('');
  }

  // Report missing permissions
  if (issues.missingPermissions.length > 0) {
    hasIssues = true;
    console.log('APIs without permissions in Matrix:');
    issues.missingPermissions.forEach((a) => console.log(`  - ${a}`));
    console.log('');
  }

  // Summary
  if (!hasIssues) {
    console.log('All Spec items are reflected in Matrix.');
    console.log('Validation PASSED.');
    return 0;
  }

  console.log('---');
  console.log('Validation FAILED - Matrix is incomplete.');
  console.log('');
  console.log('Recommendations:');
  console.log('  1. Update Matrix manually to add missing items');
  console.log('  2. Or re-run /speckit.design to regenerate Matrix');
  console.log('  3. Use --fix to see suggested additions');

  // Generate fix suggestions if requested
  if (options.fix) {
    console.log('\n=== Suggested Additions (--fix) ===\n');

    const suggestions = {
      screens: {},
      features: {},
      permissions: {},
    };

    // Suggest screen entries
    for (const scrId of issues.missingScreens) {
      suggestions.screens[scrId] = {
        name: '[TODO: Add screen name]',
        masters: [],
        apis: [],
      };
    }

    // Suggest feature entries
    for (const featId of issues.missingFeatures) {
      suggestions.features[featId] = {
        title: '[TODO: Add feature title]',
        screens: [],
        masters: [],
        apis: [],
        rules: [],
      };
    }

    // Suggest permission entries
    for (const apiId of issues.missingPermissions) {
      suggestions.permissions[apiId] = ['[TODO: Add roles]'];
    }

    console.log(JSON.stringify(suggestions, null, 2));
    console.log('\nMerge these into your cross-reference.json and fill in the TODOs.');
  }

  return 1;
}

// Main
const options = parseArgs();
const exitCode = validate(options);
process.exit(exitCode);
