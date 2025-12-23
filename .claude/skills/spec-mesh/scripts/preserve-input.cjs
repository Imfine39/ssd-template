#!/usr/bin/env node
'use strict';

/**
 * Preserve input files to spec directories for future reference.
 *
 * Error Handling:
 *   Exit Code 0: Success or skipped (empty/template-only input)
 *   Exit Code 1: Invalid arguments or missing files
 *     - Missing type argument
 *     - Unknown type value
 *     - Missing --feature for add type
 *     - Missing --fix for fix type
 *     - Input file not found
 *
 * Common Errors:
 *   - "ERROR: Type is required" - Provide type: vision, add, fix, or design
 *   - "ERROR: Unknown type X" - Use one of: vision, add, fix, design
 *   - "ERROR: --feature is required for add type" - Specify feature directory name
 *   - "ERROR: --fix is required for fix type" - Specify fix directory name
 *   - "ERROR: Input file not found: X" - Ensure input file exists in .specify/input/
 *   - "NOTE: Input file appears to be empty" - No content to preserve, skipped
 *
 * Usage:
 *   node .claude/skills/spec-mesh/scripts/preserve-input.cjs vision --project sample
 *   node .claude/skills/spec-mesh/scripts/preserve-input.cjs add --project sample --feature s-lead-001
 *   node .claude/skills/spec-mesh/scripts/preserve-input.cjs fix --project sample --fix f-auth-001
 *   node .claude/skills/spec-mesh/scripts/preserve-input.cjs design --project sample
 *
 * Input file is copied (not moved) to the spec directory as input.md
 */

const fs = require('fs');
const path = require('path');

// Use current working directory as repo root (script should be run from repo root)
const REPO_ROOT = process.cwd();
const INPUT_DIR = path.join(REPO_ROOT, '.specify', 'input');
const SPECS_BASE = path.join(REPO_ROOT, '.specify', 'specs');

const INPUT_FILES = {
  vision: 'vision-input.md',
  add: 'add-input.md',
  fix: 'fix-input.md',
  design: 'vision-input.md'  // design uses vision input (Part B)
};

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {
    type: null,
    project: 'sample',
    feature: null,
    fix: null
  };

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--project') out.project = args[++i];
    else if (a === '--feature') out.feature = args[++i];
    else if (a === '--fix') out.fix = args[++i];
    else if (!a.startsWith('--')) out.type = a.toLowerCase();
  }

  if (!out.type) {
    console.error('ERROR: Type is required (vision, add, fix, design)');
    showHelp();
    process.exit(1);
  }

  if (!INPUT_FILES[out.type]) {
    console.error(`ERROR: Unknown type '${out.type}'`);
    console.error('Valid types: vision, add, fix, design');
    process.exit(1);
  }

  return out;
}

function showHelp() {
  console.log('Usage: node preserve-input.cjs <type> [options]');
  console.log('');
  console.log('Types:');
  console.log('  vision   - Preserve to .specify/specs/{project}/overview/vision/input.md');
  console.log('  add      - Preserve to .specify/specs/{project}/features/{feature}/input.md');
  console.log('  fix      - Preserve to .specify/specs/{project}/fixes/{fix}/input.md');
  console.log('  design   - Preserve to .specify/specs/{project}/overview/domain/input.md');
  console.log('');
  console.log('Options:');
  console.log('  --project <name>   Project name (default: sample)');
  console.log('  --feature <id>     Feature directory name (required for add)');
  console.log('  --fix <id>         Fix directory name (required for fix)');
}

function getDestinationPath(args) {
  const projectDir = path.join(SPECS_BASE, args.project);

  switch (args.type) {
    case 'vision':
      return path.join(projectDir, 'overview', 'vision', 'input.md');

    case 'design':
      // Design input goes to domain directory (covers both screen and domain)
      return path.join(projectDir, 'overview', 'domain', 'input.md');

    case 'add':
      if (!args.feature) {
        console.error('ERROR: --feature is required for add type');
        process.exit(1);
      }
      return path.join(projectDir, 'features', args.feature, 'input.md');

    case 'fix':
      if (!args.fix) {
        console.error('ERROR: --fix is required for fix type');
        process.exit(1);
      }
      return path.join(projectDir, 'fixes', args.fix, 'input.md');

    default:
      console.error(`ERROR: Unknown type '${args.type}'`);
      process.exit(1);
  }
}

function main() {
  const args = parseArgs();
  const inputFile = INPUT_FILES[args.type];
  const sourcePath = path.join(INPUT_DIR, inputFile);
  const destPath = getDestinationPath(args);

  // Check source exists
  if (!fs.existsSync(sourcePath)) {
    console.error(`ERROR: Input file not found: ${sourcePath}`);
    process.exit(1);
  }

  // Read source content
  const content = fs.readFileSync(sourcePath, 'utf8');

  // Check if content is empty or just template
  const lines = content.split('\n').filter(line => {
    const trimmed = line.trim();
    return trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('---') && !trimmed.startsWith('-') && trimmed !== '';
  });

  if (lines.length < 3) {
    console.log('NOTE: Input file appears to be empty or template-only. Skipping preservation.');
    return;
  }

  // Ensure destination directory exists
  const destDir = path.dirname(destPath);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  // Add metadata header
  const timestamp = new Date().toISOString();
  const header = `<!-- Preserved Input -->\n<!-- Source: ${inputFile} -->\n<!-- Date: ${timestamp} -->\n\n`;

  // Copy content to destination
  fs.writeFileSync(destPath, header + content, 'utf8');

  const relPath = path.relative(REPO_ROOT, destPath).replace(/\\/g, '/');
  console.log(`Preserved: ${relPath}`);
}

main();
