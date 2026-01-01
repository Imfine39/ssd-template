/**
 * Spec-mesh shared library.
 * Central export for utility modules.
 *
 * ## Usage
 *
 * Import specific functions (recommended):
 *   const { INPUT_DIR, readFile, ensureDir } = require('./lib/index.cjs');
 *
 * ## Active Usage (as of 2025-12-31)
 *
 * | Module | Used By | Functions Used |
 * |--------|---------|----------------|
 * | paths.cjs | input.cjs | INPUT_DIR, INPUT_PATHS, TEMPLATES_DIR, SPECS_ROOT |
 * | file-utils.cjs | input.cjs, matrix-ops.cjs | ensureDir, readFile, writeFile, fileExists, readJson |
 * | matrix-utils.cjs | matrix-ops.cjs, generate-matrix-view.cjs | All functions |
 *
 * ## Available (not actively used)
 *
 * | Module | Functions |
 * |--------|-----------|
 * | cli-utils.cjs | run, runSilent, getCurrentBranch, parseArgs, etc. |
 * | spec-parser.cjs | parseSpec, extractSection, extractMasterIds, etc. |
 * | paths.cjs | getTemplatePath, findSpecPath, slugFromIdAndTitle, etc. |
 * | file-utils.cjs | writeJson, hashFile, walkForSpecs, listDirs, listFiles, copyFile, deleteFile |
 */
'use strict';

// =============================================================================
// ACTIVELY USED EXPORTS
// =============================================================================

const paths = require('./paths.cjs');
const fileUtils = require('./file-utils.cjs');
const matrixUtils = require('./matrix-utils.cjs');

// Paths - actively used by input.cjs
const {
  INPUT_DIR,
  INPUT_PATHS,
  TEMPLATES_DIR,
  SPECS_ROOT
} = paths;

// File utils - actively used by input.cjs, matrix-ops.cjs
const {
  ensureDir,
  readFile,
  writeFile,
  fileExists,
  readJson
} = fileUtils;

// =============================================================================
// AVAILABLE MODULES (for future use)
// =============================================================================

// Load only when needed to avoid overhead
let cliUtils = null;
let specParser = null;

function getCliUtils() {
  if (!cliUtils) {
    cliUtils = require('./cli-utils.cjs');
  }
  return cliUtils;
}

function getSpecParser() {
  if (!specParser) {
    specParser = require('./spec-parser.cjs');
  }
  return specParser;
}

// =============================================================================
// EXPORTS
// =============================================================================

module.exports = {
  // Actively used - paths
  INPUT_DIR,
  INPUT_PATHS,
  TEMPLATES_DIR,
  SPECS_ROOT,

  // Actively used - file utils
  ensureDir,
  readFile,
  writeFile,
  fileExists,
  readJson,

  // Actively used - matrix utils
  ...matrixUtils,

  // Lazy-loaded module accessors (for future use)
  getCliUtils,
  getSpecParser,

  // Full module access (for scripts that need everything)
  paths,
  fileUtils,
  matrixUtils
};
