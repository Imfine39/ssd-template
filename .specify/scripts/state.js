#!/usr/bin/env node
'use strict';

/**
 * State management script for SSD-Template.
 *
 * Manages two state files:
 * - repo-state.json: Project-level state (Vision/Domain status, phase, features)
 * - branch-state.json: Per-branch work state (step, progress, suspensions)
 *
 * Usage:
 *   node .specify/scripts/state.js init
 *   node .specify/scripts/state.js repo --set-vision-status approved
 *   node .specify/scripts/state.js repo --set-phase development
 *   node .specify/scripts/state.js branch --name feature/5-inventory --set-step implement
 *   node .specify/scripts/state.js suspend --branch feature/5-inventory --reason spec-change --related 20
 *   node .specify/scripts/state.js resume --branch feature/5-inventory
 *   node .specify/scripts/state.js query --repo
 *   node .specify/scripts/state.js query --branch feature/5-inventory
 *   node .specify/scripts/state.js query --suspended
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Paths
const STATE_DIR = path.join(process.cwd(), '.specify', 'state');
const REPO_STATE_PATH = path.join(STATE_DIR, 'repo-state.json');
const BRANCH_STATE_PATH = path.join(STATE_DIR, 'branch-state.json');

// Default schemas
const DEFAULT_REPO_STATE = {
  version: '1.0.0',
  project: {
    name: '',
    createdAt: new Date().toISOString()
  },
  specs: {
    vision: {
      path: '.specify/specs/vision/spec.md',
      status: 'none',
      lastModified: null,
      clarifyComplete: false
    },
    domain: {
      path: '.specify/specs/domain/spec.md',
      status: 'none',
      lastModified: null,
      clarifyComplete: false,
      definitions: {
        masters: [],
        apis: [],
        rules: []
      }
    }
  },
  phase: 'initialization',
  features: {
    total: 0,
    byStatus: {
      backlog: 0,
      inProgress: 0,
      completed: 0
    }
  }
};

const DEFAULT_BRANCH_STATE = {
  version: '1.0.0',
  branches: {},
  suspended: []
};

// Valid values
const VALID_STATUSES = ['none', 'scaffold', 'draft', 'clarified', 'approved'];
const VALID_PHASES = ['initialization', 'vision', 'design', 'foundation', 'development'];
const VALID_STEPS = ['idle', 'spec', 'spec_review', 'plan', 'plan_review', 'tasks', 'implement', 'pr', 'suspended'];
const VALID_TYPES = ['feature', 'fix', 'spec-change', 'spec'];

// Utility functions
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readJson(filepath, defaultValue) {
  try {
    if (fs.existsSync(filepath)) {
      return JSON.parse(fs.readFileSync(filepath, 'utf-8'));
    }
  } catch (e) {
    console.error(`Warning: Could not read ${filepath}: ${e.message}`);
  }
  return defaultValue;
}

function writeJson(filepath, data) {
  ensureDir(path.dirname(filepath));
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

function getCurrentBranch() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString().trim();
  } catch {
    return null;
  }
}

function getProjectName() {
  try {
    const pkgPath = path.join(process.cwd(), 'package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      return pkg.name || path.basename(process.cwd());
    }
  } catch {}
  return path.basename(process.cwd());
}

// Command handlers
function cmdInit() {
  ensureDir(STATE_DIR);

  // Initialize repo-state.json if not exists
  if (!fs.existsSync(REPO_STATE_PATH)) {
    const repoState = { ...DEFAULT_REPO_STATE };
    repoState.project.name = getProjectName();
    repoState.project.createdAt = new Date().toISOString();

    // Check if Vision spec exists
    const visionPath = path.join(process.cwd(), '.specify', 'specs', 'vision', 'spec.md');
    if (fs.existsSync(visionPath)) {
      repoState.specs.vision.status = 'draft';
      repoState.specs.vision.lastModified = new Date().toISOString();
    }

    // Check if Domain spec exists (including legacy overview)
    const domainPath = path.join(process.cwd(), '.specify', 'specs', 'domain', 'spec.md');
    const overviewPath = path.join(process.cwd(), '.specify', 'specs', 'overview', 'spec.md');
    if (fs.existsSync(domainPath) || fs.existsSync(overviewPath)) {
      repoState.specs.domain.status = 'draft';
      repoState.specs.domain.lastModified = new Date().toISOString();
      repoState.specs.domain.path = fs.existsSync(domainPath) ? domainPath : overviewPath;
    }

    writeJson(REPO_STATE_PATH, repoState);
    console.log(`Created ${REPO_STATE_PATH}`);
  } else {
    console.log(`${REPO_STATE_PATH} already exists`);
  }

  // Initialize branch-state.json if not exists
  if (!fs.existsSync(BRANCH_STATE_PATH)) {
    writeJson(BRANCH_STATE_PATH, DEFAULT_BRANCH_STATE);
    console.log(`Created ${BRANCH_STATE_PATH}`);
  } else {
    console.log(`${BRANCH_STATE_PATH} already exists`);
  }

  console.log('State initialization complete.');
}

function cmdRepo(args) {
  const repoState = readJson(REPO_STATE_PATH, DEFAULT_REPO_STATE);
  let modified = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const val = args[i + 1];

    if (arg === '--set-vision-status' && val) {
      if (!VALID_STATUSES.includes(val)) {
        console.error(`Invalid status: ${val}. Valid: ${VALID_STATUSES.join(', ')}`);
        process.exit(1);
      }
      repoState.specs.vision.status = val;
      repoState.specs.vision.lastModified = new Date().toISOString();
      modified = true;
      i++;
    } else if (arg === '--set-domain-status' && val) {
      if (!VALID_STATUSES.includes(val)) {
        console.error(`Invalid status: ${val}. Valid: ${VALID_STATUSES.join(', ')}`);
        process.exit(1);
      }
      repoState.specs.domain.status = val;
      repoState.specs.domain.lastModified = new Date().toISOString();
      modified = true;
      i++;
    } else if (arg === '--set-phase' && val) {
      if (!VALID_PHASES.includes(val)) {
        console.error(`Invalid phase: ${val}. Valid: ${VALID_PHASES.join(', ')}`);
        process.exit(1);
      }
      repoState.phase = val;
      modified = true;
      i++;
    } else if (arg === '--set-vision-clarify') {
      repoState.specs.vision.clarifyComplete = val === 'true';
      modified = true;
      i++;
    } else if (arg === '--set-domain-clarify') {
      repoState.specs.domain.clarifyComplete = val === 'true';
      modified = true;
      i++;
    } else if (arg === '--add-master' && val) {
      if (!repoState.specs.domain.definitions.masters.includes(val)) {
        repoState.specs.domain.definitions.masters.push(val);
        modified = true;
      }
      i++;
    } else if (arg === '--add-api' && val) {
      if (!repoState.specs.domain.definitions.apis.includes(val)) {
        repoState.specs.domain.definitions.apis.push(val);
        modified = true;
      }
      i++;
    } else if (arg === '--add-rule' && val) {
      if (!repoState.specs.domain.definitions.rules.includes(val)) {
        repoState.specs.domain.definitions.rules.push(val);
        modified = true;
      }
      i++;
    } else if (arg === '--set-features-total' && val) {
      repoState.features.total = parseInt(val, 10);
      modified = true;
      i++;
    } else if (arg === '--set-features-backlog' && val) {
      repoState.features.byStatus.backlog = parseInt(val, 10);
      modified = true;
      i++;
    } else if (arg === '--set-features-inprogress' && val) {
      repoState.features.byStatus.inProgress = parseInt(val, 10);
      modified = true;
      i++;
    } else if (arg === '--set-features-completed' && val) {
      repoState.features.byStatus.completed = parseInt(val, 10);
      modified = true;
      i++;
    }
  }

  if (modified) {
    writeJson(REPO_STATE_PATH, repoState);
    console.log('Repo state updated.');
  } else {
    console.log('No changes made to repo state.');
  }
}

function cmdBranch(args) {
  const branchState = readJson(BRANCH_STATE_PATH, DEFAULT_BRANCH_STATE);
  let branchName = null;
  let modified = false;

  // Parse branch name
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--name' && args[i + 1]) {
      branchName = args[i + 1];
      break;
    }
  }

  if (!branchName) {
    branchName = getCurrentBranch();
    if (!branchName) {
      console.error('Could not determine branch. Use --name to specify.');
      process.exit(1);
    }
  }

  // Initialize branch entry if not exists
  if (!branchState.branches[branchName]) {
    branchState.branches[branchName] = {
      type: 'feature',
      issue: null,
      specId: null,
      specPath: null,
      step: 'idle',
      taskProgress: null,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    };
    modified = true;
  }

  const branch = branchState.branches[branchName];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const val = args[i + 1];

    if (arg === '--set-type' && val) {
      if (!VALID_TYPES.includes(val)) {
        console.error(`Invalid type: ${val}. Valid: ${VALID_TYPES.join(', ')}`);
        process.exit(1);
      }
      branch.type = val;
      modified = true;
      i++;
    } else if (arg === '--set-issue' && val) {
      branch.issue = parseInt(val, 10);
      modified = true;
      i++;
    } else if (arg === '--set-parent-issue' && val) {
      branch.parentIssue = parseInt(val, 10);
      modified = true;
      i++;
    } else if (arg === '--set-spec-id' && val) {
      branch.specId = val;
      modified = true;
      i++;
    } else if (arg === '--set-spec-path' && val) {
      branch.specPath = val;
      modified = true;
      i++;
    } else if (arg === '--set-step' && val) {
      if (!VALID_STEPS.includes(val)) {
        console.error(`Invalid step: ${val}. Valid: ${VALID_STEPS.join(', ')}`);
        process.exit(1);
      }
      branch.step = val;
      modified = true;
      i++;
    } else if (arg === '--set-task-progress' && val) {
      const match = val.match(/^(\d+)\/(\d+)$/);
      if (match) {
        branch.taskProgress = {
          total: parseInt(match[2], 10),
          completed: parseInt(match[1], 10),
          current: parseInt(match[1], 10) + 1
        };
        modified = true;
      } else {
        console.error('Invalid task progress format. Use: completed/total (e.g., 3/10)');
        process.exit(1);
      }
      i++;
    } else if (arg === '--delete') {
      delete branchState.branches[branchName];
      modified = true;
    }
  }

  if (modified && branchState.branches[branchName]) {
    branchState.branches[branchName].lastActivity = new Date().toISOString();
  }

  if (modified) {
    writeJson(BRANCH_STATE_PATH, branchState);
    console.log(`Branch state updated for: ${branchName}`);
  } else {
    console.log('No changes made to branch state.');
  }
}

function cmdSuspend(args) {
  const branchState = readJson(BRANCH_STATE_PATH, DEFAULT_BRANCH_STATE);
  let branchName = null;
  let reason = 'unknown';
  let relatedIssue = null;
  let resumeAfter = null;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const val = args[i + 1];

    if (arg === '--branch' && val) {
      branchName = val;
      i++;
    } else if (arg === '--reason' && val) {
      reason = val;
      i++;
    } else if (arg === '--related' && val) {
      relatedIssue = parseInt(val, 10);
      i++;
    } else if (arg === '--resume-after' && val) {
      resumeAfter = val;
      i++;
    }
  }

  if (!branchName) {
    branchName = getCurrentBranch();
    if (!branchName) {
      console.error('Could not determine branch. Use --branch to specify.');
      process.exit(1);
    }
  }

  // Check if already suspended
  const existing = branchState.suspended.find(s => s.branch === branchName);
  if (existing) {
    console.log(`Branch ${branchName} is already suspended.`);
    return;
  }

  // Update branch step to suspended
  if (branchState.branches[branchName]) {
    branchState.branches[branchName].step = 'suspended';
    branchState.branches[branchName].lastActivity = new Date().toISOString();
  }

  // Add to suspended list
  branchState.suspended.push({
    branch: branchName,
    reason: reason,
    relatedIssue: relatedIssue,
    suspendedAt: new Date().toISOString(),
    resumeAfter: resumeAfter
  });

  writeJson(BRANCH_STATE_PATH, branchState);
  console.log(`Suspended branch: ${branchName}`);
  console.log(`  Reason: ${reason}`);
  if (relatedIssue) console.log(`  Related Issue: #${relatedIssue}`);
  if (resumeAfter) console.log(`  Resume after: ${resumeAfter}`);
}

function cmdResume(args) {
  const branchState = readJson(BRANCH_STATE_PATH, DEFAULT_BRANCH_STATE);
  let branchName = null;
  let newStep = 'implement'; // Default step after resume

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const val = args[i + 1];

    if (arg === '--branch' && val) {
      branchName = val;
      i++;
    } else if (arg === '--step' && val) {
      newStep = val;
      i++;
    }
  }

  if (!branchName) {
    branchName = getCurrentBranch();
    if (!branchName) {
      console.error('Could not determine branch. Use --branch to specify.');
      process.exit(1);
    }
  }

  // Remove from suspended list
  const idx = branchState.suspended.findIndex(s => s.branch === branchName);
  if (idx === -1) {
    console.log(`Branch ${branchName} is not suspended.`);
    return;
  }

  branchState.suspended.splice(idx, 1);

  // Update branch step
  if (branchState.branches[branchName]) {
    branchState.branches[branchName].step = newStep;
    branchState.branches[branchName].lastActivity = new Date().toISOString();
  }

  writeJson(BRANCH_STATE_PATH, branchState);
  console.log(`Resumed branch: ${branchName}`);
  console.log(`  New step: ${newStep}`);
}

function cmdQuery(args) {
  let queryRepo = false;
  let queryBranch = null;
  let querySuspended = false;
  let queryAll = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const val = args[i + 1];

    if (arg === '--repo') {
      queryRepo = true;
    } else if (arg === '--branch') {
      queryBranch = val || getCurrentBranch();
      i++;
    } else if (arg === '--suspended') {
      querySuspended = true;
    } else if (arg === '--all') {
      queryAll = true;
    }
  }

  if (queryRepo || queryAll) {
    const repoState = readJson(REPO_STATE_PATH, null);
    if (repoState) {
      console.log('\n=== Repo State ===');
      console.log(`Project: ${repoState.project.name}`);
      console.log(`Phase: ${repoState.phase}`);
      console.log(`\nVision Spec:`);
      console.log(`  Status: ${repoState.specs.vision.status}`);
      console.log(`  Clarify Complete: ${repoState.specs.vision.clarifyComplete}`);
      console.log(`\nDomain Spec:`);
      console.log(`  Status: ${repoState.specs.domain.status}`);
      console.log(`  Clarify Complete: ${repoState.specs.domain.clarifyComplete}`);
      console.log(`  Masters: ${repoState.specs.domain.definitions.masters.join(', ') || '(none)'}`);
      console.log(`  APIs: ${repoState.specs.domain.definitions.apis.join(', ') || '(none)'}`);
      console.log(`  Rules: ${repoState.specs.domain.definitions.rules.join(', ') || '(none)'}`);
      console.log(`\nFeatures:`);
      console.log(`  Total: ${repoState.features.total}`);
      console.log(`  Backlog: ${repoState.features.byStatus.backlog}`);
      console.log(`  In Progress: ${repoState.features.byStatus.inProgress}`);
      console.log(`  Completed: ${repoState.features.byStatus.completed}`);
    } else {
      console.log('Repo state not initialized. Run: node .specify/scripts/state.js init');
    }
  }

  if (queryBranch || queryAll) {
    const branchState = readJson(BRANCH_STATE_PATH, null);
    if (branchState) {
      if (queryAll) {
        console.log('\n=== All Branches ===');
        for (const [name, data] of Object.entries(branchState.branches)) {
          console.log(`\n${name}:`);
          console.log(`  Type: ${data.type}`);
          console.log(`  Issue: ${data.issue || '(none)'}`);
          console.log(`  Spec ID: ${data.specId || '(none)'}`);
          console.log(`  Step: ${data.step}`);
          if (data.taskProgress) {
            console.log(`  Task Progress: ${data.taskProgress.completed}/${data.taskProgress.total}`);
          }
        }
      } else if (queryBranch) {
        const data = branchState.branches[queryBranch];
        if (data) {
          console.log(`\n=== Branch: ${queryBranch} ===`);
          console.log(`Type: ${data.type}`);
          console.log(`Issue: ${data.issue || '(none)'}`);
          console.log(`Spec ID: ${data.specId || '(none)'}`);
          console.log(`Spec Path: ${data.specPath || '(none)'}`);
          console.log(`Step: ${data.step}`);
          if (data.taskProgress) {
            console.log(`Task Progress: ${data.taskProgress.completed}/${data.taskProgress.total}`);
          }
          console.log(`Created: ${data.createdAt}`);
          console.log(`Last Activity: ${data.lastActivity}`);
        } else {
          console.log(`Branch ${queryBranch} not found in state.`);
        }
      }
    } else {
      console.log('Branch state not initialized. Run: node .specify/scripts/state.js init');
    }
  }

  if (querySuspended || queryAll) {
    const branchState = readJson(BRANCH_STATE_PATH, null);
    if (branchState) {
      console.log('\n=== Suspended Branches ===');
      if (branchState.suspended.length === 0) {
        console.log('(none)');
      } else {
        for (const s of branchState.suspended) {
          console.log(`\n${s.branch}:`);
          console.log(`  Reason: ${s.reason}`);
          console.log(`  Related Issue: ${s.relatedIssue ? '#' + s.relatedIssue : '(none)'}`);
          console.log(`  Suspended At: ${s.suspendedAt}`);
          console.log(`  Resume After: ${s.resumeAfter || '(not specified)'}`);
        }
      }
    }
  }
}

// Main
function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const restArgs = args.slice(1);

  switch (command) {
    case 'init':
      cmdInit();
      break;
    case 'repo':
      cmdRepo(restArgs);
      break;
    case 'branch':
      cmdBranch(restArgs);
      break;
    case 'suspend':
      cmdSuspend(restArgs);
      break;
    case 'resume':
      cmdResume(restArgs);
      break;
    case 'query':
      cmdQuery(restArgs);
      break;
    default:
      console.log(`
SSD-Template State Management

Usage:
  node .specify/scripts/state.js <command> [options]

Commands:
  init                          Initialize state files
  repo                          Update repo state
  branch                        Update branch state
  suspend                       Suspend a branch
  resume                        Resume a suspended branch
  query                         Query state

Repo Options:
  --set-vision-status <status>  Set Vision spec status (none|scaffold|draft|clarified|approved)
  --set-domain-status <status>  Set Domain spec status
  --set-phase <phase>           Set project phase (initialization|vision|design|foundation|development)
  --set-vision-clarify <bool>   Set Vision clarify complete (true|false)
  --set-domain-clarify <bool>   Set Domain clarify complete
  --add-master <id>             Add master definition (e.g., M-USER)
  --add-api <id>                Add API definition (e.g., API-USER-CREATE)
  --add-rule <id>               Add rule definition (e.g., BR-001)
  --set-features-total <n>      Set total feature count
  --set-features-backlog <n>    Set backlog feature count
  --set-features-inprogress <n> Set in-progress feature count
  --set-features-completed <n>  Set completed feature count

Branch Options:
  --name <branch>               Branch name (defaults to current)
  --set-type <type>             Set branch type (feature|fix|spec-change|spec)
  --set-issue <num>             Set associated issue number
  --set-parent-issue <num>      Set parent issue number
  --set-spec-id <id>            Set spec ID (e.g., S-INVENTORY-001)
  --set-spec-path <path>        Set spec file path
  --set-step <step>             Set workflow step (idle|spec|spec_review|plan|plan_review|tasks|implement|pr|suspended)
  --set-task-progress <n/m>     Set task progress (e.g., 3/10)
  --delete                      Remove branch from state

Suspend Options:
  --branch <branch>             Branch to suspend (defaults to current)
  --reason <reason>             Suspension reason
  --related <issue>             Related issue number
  --resume-after <text>         Condition to resume

Resume Options:
  --branch <branch>             Branch to resume (defaults to current)
  --step <step>                 Step to resume to (default: implement)

Query Options:
  --repo                        Show repo state
  --branch [name]               Show branch state (defaults to current)
  --suspended                   Show suspended branches
  --all                         Show all state
`);
      process.exit(command ? 1 : 0);
  }
}

main();
