#!/usr/bin/env node
'use strict';

/**
 * PR helper: runs spec lint (and optional tests), then opens a PR via gh.
 *
 * Usage:
 *   node .claude/skills/spec-mesh/scripts/pr.cjs --title "feat: add sales" --body "Fixes #123\nImplements S-SALES-001"
 *   node .claude/skills/spec-mesh/scripts/pr.cjs --title "feat: add sales" --body-file pr-body.md
 *
 * Flags:
 *   --title     PR title (required)
 *   --body      PR body (include Issues/Spec IDs/Tests)
 *   --body-file Read PR body from file (alternative to --body; supports multiline)
 *   --no-lint   Skip spec-lint
 *   --test "<command>" Run a test command before PR; abort on failure
 */

const { execSync, spawnSync } = require('child_process');
const fs = require('fs');

function run(cmd, opts = {}) {
  return execSync(cmd, { stdio: 'inherit', ...opts });
}

function parseArgs() {
  const args = process.argv.slice(2);
  const out = { title: null, body: null, bodyFile: null, lint: true, test: null };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--title' && args[i + 1]) out.title = args[++i];
    else if (a === '--body' && args[i + 1]) out.body = args[++i];
    else if (a === '--body-file' && args[i + 1]) out.bodyFile = args[++i];
    else if (a === '--no-lint') out.lint = false;
    else if (a === '--test' && args[i + 1]) out.test = args[++i];
  }
  if (!out.title) {
    console.error('ERROR: --title is required');
    process.exit(1);
  }
  if (!out.body && !out.bodyFile) {
    console.error('ERROR: --body or --body-file is required');
    process.exit(1);
  }
  return out;
}

function main() {
  const { title, body, bodyFile, lint, test } = parseArgs();

  // Resolve body content
  let bodyContent = body;
  if (bodyFile) {
    if (!fs.existsSync(bodyFile)) {
      console.error(`ERROR: Body file not found: ${bodyFile}`);
      process.exit(1);
    }
    bodyContent = fs.readFileSync(bodyFile, 'utf8');
  }

  if (lint) {
    console.log('Running spec lint...');
    run('node .claude/skills/spec-mesh/scripts/spec-lint.cjs');
  }
  if (test) {
    console.log(`Running tests: ${test}`);
    try {
      run(test);
    } catch (e) {
      console.error('Test command failed; aborting PR creation.');
      process.exit(1);
    }
  }

  console.log('Creating PR via gh...');
  // Use spawnSync to avoid shell escaping issues
  const result = spawnSync('gh', ['pr', 'create', '--fill', '--title', title, '--body', bodyContent], {
    stdio: 'inherit',
    shell: true,
  });

  if (result.status !== 0) {
    console.error('Failed to create PR');
    process.exit(result.status || 1);
  }
}

main();
