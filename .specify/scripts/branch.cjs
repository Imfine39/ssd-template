#!/usr/bin/env node
'use strict';

/**
 * Branch creation helper.
 *
 * Usage:
 *   node .specify/scripts/branch.cjs --type feature --slug user-auth --issue 123
 *
 * Behavior:
 * - Computes branch name:
 *     if --issue: <type>/<issue>-<slug>
 *     else: <type>/<N>-<slug> where N is next number found across local branches and specs dirs
 * - Creates and checks out the branch if it does not already exist.
 * - Updates branch-state.cjson with the new branch entry.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// State management paths
const STATE_DIR = path.join(process.cwd(), '.specify', 'state');
const BRANCH_STATE_PATH = path.join(STATE_DIR, 'branch-state.cjson');

function run(cmd) {
  return execSync(cmd, { stdio: ['ignore', 'pipe', 'inherit'] }).toString().trim();
}

function listLocalBranches() {
  try {
    return run('git branch --format="%(refname:short)"').split('\n').map((s) => s.trim()).filter(Boolean);
  } catch {
    return [];
  }
}

function listSpecDirs() {
  const root = path.join(process.cwd(), '.specify', 'specs');
  if (!fs.existsSync(root)) return [];
  const dirs = [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (entry.isDirectory()) dirs.push(entry.name);
  }
  return dirs;
}

function parseArgs() {
  const args = process.argv.slice(2);
  const out = { type: 'feature', slug: null, issue: null };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--type' && args[i + 1]) out.type = args[++i];
    else if (a === '--slug' && args[i + 1]) out.slug = args[++i];
    else if (a === '--issue' && args[i + 1]) out.issue = args[++i];
  }
  if (!out.slug) {
    console.error('ERROR: --slug is required');
    process.exit(1);
  }
  return out;
}

function nextNumber(slug, type) {
  const pattern = new RegExp(`^${type}/(\\d+)-${slug}$`);
  let max = 0;
  for (const b of listLocalBranches()) {
    const m = b.match(pattern);
    if (m) max = Math.max(max, parseInt(m[1], 10));
  }
  for (const dir of listSpecDirs()) {
    const m = dir.match(/^(\d+)-(.+)$/);
    if (m && m[2] === slug) {
      max = Math.max(max, parseInt(m[1], 10));
    }
  }
  return max + 1;
}

function branchExists(name) {
  try {
    run(`git rev-parse --verify ${name}`);
    return true;
  } catch {
    return false;
  }
}

function updateBranchState(branchName, type, issue) {
  try {
    // Ensure state directory exists
    if (!fs.existsSync(STATE_DIR)) {
      fs.mkdirSync(STATE_DIR, { recursive: true });
    }

    // Read or initialize branch state
    let branchState = { version: '1.0.0', branches: {}, suspended: [] };
    if (fs.existsSync(BRANCH_STATE_PATH)) {
      branchState = JSON.parse(fs.readFileSync(BRANCH_STATE_PATH, 'utf-8'));
    }

    // Add or update branch entry
    branchState.branches[branchName] = {
      type: type,
      issue: issue ? parseInt(issue, 10) : null,
      specId: null,
      specPath: null,
      step: 'spec',
      taskProgress: null,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    };

    // Write updated state
    fs.writeFileSync(BRANCH_STATE_PATH, JSON.stringify(branchState, null, 2) + '\n', 'utf-8');
    console.log(`Updated branch state for: ${branchName}`);
  } catch (e) {
    console.error(`Warning: Could not update branch state: ${e.message}`);
  }
}

function main() {
  const { type, slug, issue } = parseArgs();
  let branch;
  if (issue) {
    branch = `${type}/${issue}-${slug}`;
  } else {
    const n = nextNumber(slug, type);
    branch = `${type}/${n}-${slug}`;
  }

  if (branchExists(branch)) {
    console.log(`Branch already exists: ${branch}`);
    run(`git checkout ${branch}`);
    console.log(`Checked out ${branch}`);
    return;
  }

  run(`git checkout -b ${branch}`);
  console.log(`Created and checked out ${branch}`);

  // Update branch state
  updateBranchState(branch, type, issue);
}

main();
