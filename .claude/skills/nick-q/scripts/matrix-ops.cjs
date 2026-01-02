#!/usr/bin/env node
'use strict';

/**
 * Cross-Reference Matrix operations tool.
 * Combines generate and validate functionality.
 *
 * Usage:
 *   node matrix-ops.cjs generate [path-to-json]
 *   node matrix-ops.cjs validate [options]
 *   node matrix-ops.cjs --help
 *
 * Exit Codes:
 *   0: Success (or validation passed)
 *   1: Validation failed (missing mappings)
 *   2: File/Parse error
 */

const fs = require('fs');
const path = require('path');
const { readFile, readJson } = require('./lib/index.cjs');
const {
  DEFAULT_MATRIX_PATH,
  loadMatrixJson,
  generateMarkdown
} = require('./lib/matrix-utils.cjs');

// Paths for validation
const DEFAULT_SCREEN_PATH = '.specify/specs/overview/screen/spec.md';
const DEFAULT_DOMAIN_PATH = '.specify/specs/overview/domain/spec.md';

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const result = {
    command: null,
    jsonPath: null,
    screenPath: null,
    domainPath: null,
    matrixPath: null,
    fix: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--help':
      case '-h':
        showHelp();
        process.exit(0);
      case '--screen':
        result.screenPath = args[++i];
        break;
      case '--domain':
        result.domainPath = args[++i];
        break;
      case '--matrix':
        result.matrixPath = args[++i];
        break;
      case '--fix':
        result.fix = true;
        break;
      case 'generate':
      case 'validate':
        result.command = arg;
        break;
      default:
        // For generate command, non-option argument is the JSON path
        if (!arg.startsWith('--') && !result.jsonPath && result.command === 'generate') {
          result.jsonPath = arg;
        }
    }
  }

  return result;
}

function showHelp() {
  console.log(`
Cross-Reference Matrix Operations Tool

Usage:
  node matrix-ops.cjs <command> [options]

Commands:
  generate [path]   Generate cross-reference.md from JSON
  validate          Validate matrix against Specs

Generate Options:
  [path]            Path to cross-reference.json (default: ${DEFAULT_MATRIX_PATH})

Validate Options:
  --screen <path>   Path to Screen Spec (default: ${DEFAULT_SCREEN_PATH})
  --domain <path>   Path to Domain Spec (default: ${DEFAULT_DOMAIN_PATH})
  --matrix <path>   Path to Matrix JSON (default: ${DEFAULT_MATRIX_PATH})
  --fix             Output suggested additions as JSON

Exit Codes:
  0 - Success (or validation passed)
  1 - Validation failed (missing mappings)
  2 - Error (file not found, etc.)

Examples:
  node matrix-ops.cjs generate
  node matrix-ops.cjs validate
  node matrix-ops.cjs validate --fix > suggestions.json
`);
}

// ==================== GENERATE COMMAND ====================

function generate(args) {
  let jsonPath = args.jsonPath || DEFAULT_MATRIX_PATH;

  if (!path.isAbsolute(jsonPath)) {
    jsonPath = path.resolve(process.cwd(), jsonPath);
  }

  console.log(`Reading: ${jsonPath}`);
  const data = loadMatrixJson(jsonPath);

  const mdPath = jsonPath.replace(/\.json$/, '.md');
  const markdown = generateMarkdown(data, args.jsonPath || DEFAULT_MATRIX_PATH, 'matrix-ops.cjs generate');

  fs.writeFileSync(mdPath, markdown, 'utf8');
  console.log(`Generated: ${mdPath}`);

  console.log('');
  console.log('=== Summary ===');
  console.log(`Screens: ${Object.keys(data.screens || {}).length}`);
  console.log(`Features: ${Object.keys(data.features || {}).length}`);
  console.log(`Permissions: ${Object.keys(data.permissions || {}).length} APIs`);
}

// ==================== VALIDATE COMMAND ====================

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

function extractMasterIds(domainContent) {
  const masters = new Set();
  const masterPattern = /### (M-[A-Z][A-Z0-9_-]*)/g;
  let match;

  while ((match = masterPattern.exec(domainContent)) !== null) {
    const normalized = match[1].replace(/-\d+$/, '');
    masters.add(normalized);
  }

  return Array.from(masters);
}

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

function findMissing(expected, actual) {
  const missing = [];
  const actualSet = new Set(actual.map((a) => a.toUpperCase()));

  for (const item of expected) {
    if (!actualSet.has(item.toUpperCase())) {
      missing.push(item);
    }
  }

  return missing;
}

function validate(args) {
  console.log('=== Cross-Reference Matrix Validator ===\n');

  // Determine paths
  const screenPath = args.screenPath || DEFAULT_SCREEN_PATH;
  const domainPath = args.domainPath || DEFAULT_DOMAIN_PATH;
  const matrixPath = args.matrixPath || DEFAULT_MATRIX_PATH;

  console.log('Loading files...');

  // Load files
  const screenContent = readFile(path.resolve(process.cwd(), screenPath));
  if (!screenContent) {
    console.error(`ERROR: File not found: ${screenPath}`);
    process.exit(2);
  }

  const domainContent = readFile(path.resolve(process.cwd(), domainPath));
  if (!domainContent) {
    console.error(`ERROR: File not found: ${domainPath}`);
    process.exit(2);
  }

  const matrix = readJson(path.resolve(process.cwd(), matrixPath));
  if (!matrix) {
    console.error(`\nERROR: Matrix file not found: ${matrixPath}`);
    console.error('Run AI-based Matrix generation during /nick-q design or create manually.');
    process.exit(1);
  }

  console.log(`  Screen: ${screenPath}`);
  console.log(`  Domain: ${domainPath}`);
  console.log(`  Matrix: ${matrixPath}`);

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

  if (issues.missingScreens.length > 0) {
    hasIssues = true;
    console.log('Missing Screens in Matrix:');
    issues.missingScreens.forEach((s) => console.log(`  - ${s}`));
    console.log('');
  }

  if (issues.missingFeatures.length > 0) {
    hasIssues = true;
    console.log('Missing Features in Matrix:');
    issues.missingFeatures.forEach((f) => console.log(`  - ${f}`));
    console.log('');
  }

  if (issues.missingMasters.length > 0) {
    hasIssues = true;
    console.log('Masters in Spec but not referenced in Matrix:');
    issues.missingMasters.forEach((m) => console.log(`  - ${m}`));
    console.log('');
  }

  if (issues.missingApis.length > 0) {
    hasIssues = true;
    console.log('APIs in Spec but not referenced in Matrix:');
    issues.missingApis.forEach((a) => console.log(`  - ${a}`));
    console.log('');
  }

  if (issues.missingPermissions.length > 0) {
    hasIssues = true;
    console.log('APIs without permissions in Matrix:');
    issues.missingPermissions.forEach((a) => console.log(`  - ${a}`));
    console.log('');
  }

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
  console.log('  2. Or re-run /nick-q design to regenerate Matrix');
  console.log('  3. Use --fix to see suggested additions');

  if (args.fix) {
    console.log('\n=== Suggested Additions (--fix) ===\n');

    const suggestions = {
      screens: {},
      features: {},
      permissions: {},
    };

    for (const scrId of issues.missingScreens) {
      suggestions.screens[scrId] = {
        name: '[TODO: Add screen name]',
        masters: [],
        apis: [],
      };
    }

    for (const featId of issues.missingFeatures) {
      suggestions.features[featId] = {
        title: '[TODO: Add feature title]',
        screens: [],
        masters: [],
        apis: [],
        rules: [],
      };
    }

    for (const apiId of issues.missingPermissions) {
      suggestions.permissions[apiId] = ['[TODO: Add roles]'];
    }

    console.log(JSON.stringify(suggestions, null, 2));
    console.log('\nMerge these into your cross-reference.json and fill in the TODOs.');
  }

  return 1;
}

// ==================== MAIN ====================

function main() {
  const args = parseArgs();

  if (!args.command) {
    console.error('ERROR: Command is required (generate or validate)');
    showHelp();
    process.exit(1);
  }

  switch (args.command) {
    case 'generate':
      generate(args);
      break;
    case 'validate':
      const exitCode = validate(args);
      process.exit(exitCode);
      break;
    default:
      console.error(`ERROR: Unknown command '${args.command}'`);
      process.exit(1);
  }
}

main();
