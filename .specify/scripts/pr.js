#!/usr/bin/env node
'use strict';

/**
 * PR helper: runs spec lint (and optional tests), then opens a PR via gh.
 *
 * Usage:
 *   node .specify/scripts/pr.js --title "feat: add sales" --body "Fixes #123\nImplements S-SALES-001\nTests: lint, unit"
 *
 * Flags:
 *   --title   PR title (required)
 *   --body    PR body (required; include Issues/Spec IDs/Tests)
 *   --no-lint Skip spec-lint
 *   --test "<command>" Run a test command before PR; abort on failure
 */

const { execSync } = require('child_process');

function run(cmd, opts = {}) {
  return execSync(cmd, { stdio: 'inherit', ...opts });
}

function parseArgs() {
  const args = process.argv.slice(2);
  const out = { title: null, body: null, lint: true, test: null };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--title' && args[i + 1]) out.title = args[++i];
    else if (a === '--body' && args[i + 1]) out.body = args[++i];
    else if (a === '--no-lint') out.lint = false;
    else if (a === '--test' && args[i + 1]) out.test = args[++i];
  }
  if (!out.title || !out.body) {
    console.error('ERROR: --title and --body are required');
    process.exit(1);
  }
  return out;
}

function main() {
  const { title, body, lint, test } = parseArgs();
  if (lint) {
    console.log('Running spec lint...');
    run('node .specify/scripts/spec-lint.js');
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
  run(`gh pr create --fill --title "${title.replace(/"/g, '\\"')}" --body "${body.replace(/"/g, '\\"')}"`);
}

main();
