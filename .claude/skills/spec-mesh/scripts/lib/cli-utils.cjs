/**
 * CLI and Git utilities for spec-mesh scripts.
 * Provides command-line argument parsing and git operations.
 *
 * ## Exit Code Convention
 *
 * All spec-mesh scripts follow this exit code standard:
 *
 * | Code | Meaning | When to Use |
 * |------|---------|-------------|
 * | 0 | Success | Normal completion, help display, nothing to process |
 * | 1 | Validation/Logic Error | Lint failures, invalid input, business logic errors |
 * | 2 | File/System Error | File not found, parse errors, IO errors |
 *
 * Use `exitWithError(message, code)` for consistent error handling.
 */
'use strict';

const { execSync } = require('child_process');

/**
 * Execute a shell command and return trimmed output.
 * @param {string} cmd - Command to execute
 * @param {Object} options - execSync options
 * @returns {string} Trimmed stdout
 */
function run(cmd, options = {}) {
  const defaultOptions = { stdio: ['ignore', 'pipe', 'inherit'] };
  return execSync(cmd, { ...defaultOptions, ...options }).toString().trim();
}

/**
 * Execute a shell command silently, returning null on error.
 * @param {string} cmd - Command to execute
 * @returns {string|null} Trimmed stdout or null on error
 */
function runSilent(cmd) {
  try {
    return execSync(cmd, { stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim();
  } catch (e) {
    return null;
  }
}

/**
 * Get the current git branch name.
 * @returns {string|null} Branch name or null if not in a git repo
 */
function getCurrentBranch() {
  try {
    return run('git rev-parse --abbrev-ref HEAD');
  } catch (e) {
    return null;
  }
}

/**
 * Get the project name from git remote or directory name.
 * @returns {string} Project name
 */
function getProjectName() {
  try {
    const remote = runSilent('git remote get-url origin');
    if (remote) {
      // Extract repo name from URL
      const match = remote.match(/\/([^/]+?)(?:\.git)?$/);
      if (match) {
        return match[1];
      }
    }
  } catch (e) {
    // Fall through to directory name
  }

  // Fallback to current directory name
  const path = require('path');
  return path.basename(process.cwd());
}

/**
 * List local git branches.
 * @returns {string[]} Array of branch names
 */
function listLocalBranches() {
  try {
    return run('git branch --format="%(refname:short)"')
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);
  } catch (e) {
    return [];
  }
}

/**
 * Check if a git branch exists.
 * @param {string} branchName - Branch name to check
 * @returns {boolean}
 */
function branchExists(branchName) {
  try {
    run(`git rev-parse --verify ${branchName}`);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Get the last commit hash.
 * @param {string} ref - Git ref (default: HEAD)
 * @returns {string|null} Commit hash or null
 */
function getLastCommit(ref = 'HEAD') {
  return runSilent(`git rev-parse --short ${ref}`);
}

/**
 * Check if there are uncommitted changes.
 * @returns {boolean}
 */
function hasUncommittedChanges() {
  try {
    const status = runSilent('git status --porcelain');
    return status && status.length > 0;
  } catch (e) {
    return false;
  }
}

/**
 * Parse command-line arguments into an object.
 * Supports --key value and --flag patterns.
 * @param {string[]} argv - Arguments array (default: process.argv.slice(2))
 * @param {Object} defaults - Default values
 * @returns {Object} Parsed arguments
 */
function parseArgs(argv = process.argv.slice(2), defaults = {}) {
  const args = { ...defaults, _positional: [] };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const nextArg = argv[i + 1];

      // Check if next arg is a value or another flag
      if (nextArg && !nextArg.startsWith('--') && !nextArg.startsWith('-')) {
        args[key] = nextArg;
        i++; // Skip the value
      } else {
        args[key] = true; // Flag without value
      }
    } else if (arg.startsWith('-') && arg.length === 2) {
      // Short flag like -h
      const key = arg.slice(1);
      args[key] = true;
    } else {
      // Positional argument
      args._positional.push(arg);
    }
  }

  return args;
}

/**
 * Check if help flag is present.
 * @param {string[]} argv - Arguments array
 * @returns {boolean}
 */
function hasHelpFlag(argv = process.argv.slice(2)) {
  return argv.includes('--help') || argv.includes('-h');
}

/**
 * Print an error message and exit.
 * @param {string} message - Error message
 * @param {number} code - Exit code (default: 1)
 */
function exitWithError(message, code = 1) {
  console.error(`ERROR: ${message}`);
  process.exit(code);
}

/**
 * Print a warning message.
 * @param {string} message - Warning message
 */
function warn(message) {
  console.log(`WARNING: ${message}`);
}

/**
 * Print a note message.
 * @param {string} message - Note message
 */
function note(message) {
  console.log(`NOTE: ${message}`);
}

/**
 * Get today's date in ISO format (YYYY-MM-DD).
 * @returns {string}
 */
function getToday() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Get current timestamp in ISO format.
 * @returns {string}
 */
function getTimestamp() {
  return new Date().toISOString();
}

module.exports = {
  // Shell execution
  run,
  runSilent,

  // Git operations
  getCurrentBranch,
  getProjectName,
  listLocalBranches,
  branchExists,
  getLastCommit,
  hasUncommittedChanges,

  // CLI utilities
  parseArgs,
  hasHelpFlag,
  exitWithError,
  warn,
  note,

  // Date/Time
  getToday,
  getTimestamp
};
