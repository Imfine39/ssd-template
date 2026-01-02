/**
 * Path constants for nick-q scripts.
 * Centralizes all path definitions to ensure consistency.
 */
'use strict';

const path = require('path');

// Base directories
const CWD = process.cwd();
const SPECIFY_ROOT = path.join(CWD, '.specify');
const SKILLS_ROOT = path.join(CWD, '.claude', 'skills', 'nick-q');

// State management
const STATE_DIR = path.join(SPECIFY_ROOT, 'state');
const REPO_STATE_PATH = path.join(STATE_DIR, 'repo-state.cjson');
const BRANCH_STATE_PATH = path.join(STATE_DIR, 'branch-state.cjson');

// Specs directories
const SPECS_ROOT = path.join(SPECIFY_ROOT, 'specs');
const OVERVIEW_DIR = path.join(SPECS_ROOT, 'overview');
const FEATURES_DIR = path.join(SPECS_ROOT, 'features');
const FIXES_DIR = path.join(SPECS_ROOT, 'fixes');

// Overview spec paths (current structure)
const SPEC_PATHS = {
  vision: path.join(OVERVIEW_DIR, 'vision', 'spec.md'),
  domain: path.join(OVERVIEW_DIR, 'domain', 'spec.md'),
  screen: path.join(OVERVIEW_DIR, 'screen', 'spec.md'),
  matrix: path.join(OVERVIEW_DIR, 'matrix', 'cross-reference.json'),
  matrixMd: path.join(OVERVIEW_DIR, 'matrix', 'cross-reference.md')
};

// Legacy spec paths (for backward compatibility)
const LEGACY_SPEC_PATHS = {
  vision: path.join(SPECS_ROOT, 'vision', 'spec.md'),
  domain: path.join(SPECS_ROOT, 'domain', 'spec.md'),
  overview: path.join(SPECS_ROOT, 'overview', 'spec.md'),
  screen: path.join(SPECS_ROOT, 'screen', 'spec.md')
};

// Input files
const INPUT_DIR = path.join(SPECIFY_ROOT, 'input');
const INPUT_PATHS = {
  vision: path.join(INPUT_DIR, 'vision-input.md'),
  add: path.join(INPUT_DIR, 'add-input.md'),
  fix: path.join(INPUT_DIR, 'fix-input.md')
};

// Templates
const TEMPLATES_DIR = path.join(SKILLS_ROOT, 'templates');
const TEMPLATE_MAP = {
  vision: 'vision-spec.md',
  domain: 'domain-spec.md',
  screen: 'screen-spec.md',
  feature: 'feature-spec.md',
  fix: 'fix-spec.md',
  'test-scenario': 'test-scenario-spec.md'
};

// Workflows
const WORKFLOWS_DIR = path.join(SKILLS_ROOT, 'workflows');

// Guides
const GUIDES_DIR = path.join(SKILLS_ROOT, 'guides');

/**
 * Get the template path for a given spec kind.
 * @param {string} kind - vision, domain, screen, feature, fix, test-scenario
 * @returns {string} Full path to template file
 */
function getTemplatePath(kind) {
  const templateFile = TEMPLATE_MAP[kind];
  if (!templateFile) {
    throw new Error(`No template for kind "${kind}"`);
  }
  return path.join(TEMPLATES_DIR, templateFile);
}

/**
 * Get the spec path, checking current and legacy locations.
 * @param {string} type - vision, domain, screen, matrix
 * @returns {string|null} Path if found, null otherwise
 */
function findSpecPath(type) {
  const fs = require('fs');

  // Check current path first
  if (SPEC_PATHS[type] && fs.existsSync(SPEC_PATHS[type])) {
    return SPEC_PATHS[type];
  }

  // Check legacy paths
  if (LEGACY_SPEC_PATHS[type] && fs.existsSync(LEGACY_SPEC_PATHS[type])) {
    return LEGACY_SPEC_PATHS[type];
  }

  return null;
}

/**
 * Generate a directory name from spec ID and title.
 * @param {string} id - Spec ID (e.g., S-SALES-001)
 * @param {string} title - Spec title
 * @returns {string} Directory name (e.g., ssales001-basic-sales)
 */
function slugFromIdAndTitle(id, title) {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return `${id.replace(/[^A-Z0-9]+/gi, '').toLowerCase()}-${slug}`.slice(0, 80);
}

module.exports = {
  // Base directories
  CWD,
  SPECIFY_ROOT,
  SKILLS_ROOT,

  // State
  STATE_DIR,
  REPO_STATE_PATH,
  BRANCH_STATE_PATH,

  // Specs
  SPECS_ROOT,
  OVERVIEW_DIR,
  FEATURES_DIR,
  FIXES_DIR,
  SPEC_PATHS,
  LEGACY_SPEC_PATHS,

  // Input
  INPUT_DIR,
  INPUT_PATHS,

  // Templates
  TEMPLATES_DIR,
  TEMPLATE_MAP,

  // Workflows and Guides
  WORKFLOWS_DIR,
  GUIDES_DIR,

  // Functions
  getTemplatePath,
  findSpecPath,
  slugFromIdAndTitle
};
