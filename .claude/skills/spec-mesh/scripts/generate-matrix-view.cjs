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
 *   --help            Show this help message
 *
 * If no path provided, uses .specify/specs/overview/matrix/cross-reference.json
 * Output is written to same directory as cross-reference.md
 */

const fs = require('fs');
const path = require('path');

// Use shared utilities from matrix-utils.cjs
const {
  DEFAULT_MATRIX_PATH,
  LEGACY_MATRIX_PATHS,
  findExistingPath,
  loadMatrixJson,
  generateMarkdown
} = require('./lib/matrix-utils.cjs');

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  let jsonPath = null;

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--project':
        args[++i]; // ignored for backward compatibility
        break;
      case '--help':
        console.log(`
Cross-Reference Matrix View Generator

Generates a Markdown view (cross-reference.md) from cross-reference.json.

Usage:
  node .claude/skills/spec-mesh/scripts/generate-matrix-view.cjs [options] [path-to-json]

Options:
  --help            Show this help message

If no path is provided, uses:
  ${DEFAULT_MATRIX_PATH}

Examples:
  node .claude/skills/spec-mesh/scripts/generate-matrix-view.cjs
  node .claude/skills/spec-mesh/scripts/generate-matrix-view.cjs .specify/specs/overview/matrix/cross-reference.json
        `);
        process.exit(0);
      default:
        // Assume any non-option argument is the JSON path
        if (!args[i].startsWith('--')) {
          jsonPath = args[i];
        }
    }
  }

  // Determine JSON path: explicit > existing default path > existing legacy path > default path
  if (!jsonPath) {
    jsonPath = findExistingPath([DEFAULT_MATRIX_PATH, ...LEGACY_MATRIX_PATHS]) || DEFAULT_MATRIX_PATH;
  }

  return { jsonPath };
}

function main() {
  const { jsonPath: inputPath } = parseArgs();

  // Resolve to absolute path
  let jsonPath = inputPath;
  if (!path.isAbsolute(jsonPath)) {
    jsonPath = path.resolve(process.cwd(), jsonPath);
  }

  console.log(`Reading: ${jsonPath}`);
  const data = loadMatrixJson(jsonPath);

  const mdPath = jsonPath.replace(/\.json$/, '.md');
  const markdown = generateMarkdown(data, inputPath, 'generate-matrix-view.cjs');

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
