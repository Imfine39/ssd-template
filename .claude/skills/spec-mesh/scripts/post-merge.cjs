#!/usr/bin/env node
'use strict';

/**
 * Post-Merge Actions Automation
 *
 * Automates mandatory post-merge actions:
 * 1. Update Screen Spec status (Planned → Implemented)
 * 2. Update Feature Index status in Domain Spec
 * 3. Clean up feature branch from state
 *
 * Usage:
 *   node post-merge.cjs --feature S-AUTH-001
 *   node post-merge.cjs --branch feature/123-auth
 *   node post-merge.cjs --feature S-AUTH-001 --delete-branch
 *
 * Error Handling:
 *   Exit Code 0: All updates successful
 *   Exit Code 1: Error occurred (file not found, parse error, etc.)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = process.cwd();
const specsRoot = path.join(root, '.specify', 'specs');

/**
 * Input validation to prevent shell injection.
 * Only allow alphanumeric characters, hyphens, underscores, and slashes (for branch names).
 */
function validateInput(value, fieldName) {
  if (!value) return true;
  const pattern = /^[a-zA-Z0-9_/-]+$/;
  if (!pattern.test(value)) {
    console.error(`ERROR: Invalid ${fieldName}: "${value}"`);
    console.error(`  Only alphanumeric characters, hyphens, underscores, and slashes are allowed.`);
    process.exit(1);
  }
  return true;
}

// Parse arguments
const args = process.argv.slice(2);
let featureId = null;
let branchName = null;
let deleteBranch = false;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--feature' && args[i + 1]) {
    featureId = args[i + 1].toUpperCase();
    i++;
  } else if (args[i] === '--branch' && args[i + 1]) {
    branchName = args[i + 1];
    i++;
  } else if (args[i] === '--delete-branch') {
    deleteBranch = true;
  } else if (args[i] === '--help' || args[i] === '-h') {
    console.log(`
Post-Merge Actions Automation

Usage:
  node post-merge.cjs --feature S-AUTH-001
  node post-merge.cjs --branch feature/123-auth
  node post-merge.cjs --feature S-AUTH-001 --delete-branch

Options:
  --feature <id>     Feature Spec ID (e.g., S-AUTH-001)
  --branch <name>    Branch name (will extract feature from state)
  --delete-branch    Also delete the local git branch
  --help, -h         Show this help
`);
    process.exit(0);
  }
}

if (!featureId && !branchName) {
  console.error('Error: Either --feature or --branch is required');
  process.exit(1);
}

// Validate inputs to prevent shell injection
validateInput(featureId, 'feature');
validateInput(branchName, 'branch');

// If branch provided, try to find feature from state
if (branchName && !featureId) {
  const statePath = path.join(root, '.specify', 'state', 'branch-state.cjson');
  if (fs.existsSync(statePath)) {
    try {
      const stateContent = fs.readFileSync(statePath, 'utf8')
        .replace(/\/\/.*$/gm, '')
        .replace(/,(\s*[}\]])/g, '$1');
      const state = JSON.parse(stateContent);

      if (state.branches && state.branches[branchName]) {
        featureId = state.branches[branchName].featureId;
        console.log(`Found feature ${featureId} for branch ${branchName}`);
      }
    } catch (e) {
      console.warn(`Warning: Could not parse branch-state.cjson: ${e.message}`);
    }
  }
}

if (!featureId) {
  console.error('Error: Could not determine feature ID');
  process.exit(1);
}

console.log(`\n=== Post-Merge Actions for ${featureId} ===\n`);

let hasErrors = false;
const updates = [];

// 1. Find Feature Spec and get SCR-* references
const featureSpecPath = findFeatureSpec(featureId);
let screenRefs = [];

if (featureSpecPath) {
  console.log(`1. Reading Feature Spec: ${path.relative(root, featureSpecPath)}`);
  const content = fs.readFileSync(featureSpecPath, 'utf8');
  screenRefs = Array.from(content.matchAll(/\bSCR-\d{3}\b/gi)).map(m => m[0].toUpperCase());
  screenRefs = [...new Set(screenRefs)]; // Unique
  console.log(`   Found screen references: ${screenRefs.length > 0 ? screenRefs.join(', ') : '(none)'}`);
} else {
  console.warn(`   Warning: Feature Spec not found for ${featureId}`);
}

// 2. Update Screen Spec status
const screenSpecPath = path.join(specsRoot, 'overview', 'screen', 'spec.md');
if (fs.existsSync(screenSpecPath) && screenRefs.length > 0) {
  console.log(`\n2. Updating Screen Spec status...`);
  let screenContent = fs.readFileSync(screenSpecPath, 'utf8');
  let updatedCount = 0;

  for (const scrId of screenRefs) {
    // Pattern: | SCR-001 | Name | Planned | ...
    // Replace Planned with Implemented for this SCR-*
    const pattern = new RegExp(
      `(\\|\\s*${scrId}\\s*\\|[^|]*\\|\\s*)Planned(\\s*\\|)`,
      'gi'
    );

    if (pattern.test(screenContent)) {
      screenContent = screenContent.replace(pattern, '$1Implemented$2');
      updatedCount++;
      updates.push(`Screen ${scrId}: Planned → Implemented`);
    }
  }

  if (updatedCount > 0) {
    fs.writeFileSync(screenSpecPath, screenContent, 'utf8');
    console.log(`   Updated ${updatedCount} screen(s) to Implemented`);
  } else {
    console.log(`   No screens needed status update`);
  }
} else if (screenRefs.length === 0) {
  console.log(`\n2. Screen Spec update: Skipped (no screen references)`);
} else {
  console.log(`\n2. Screen Spec update: Skipped (file not found)`);
}

// 3. Update Feature Index in Domain Spec
const domainSpecPath = path.join(specsRoot, 'overview', 'domain', 'spec.md');
if (fs.existsSync(domainSpecPath)) {
  console.log(`\n3. Updating Feature Index status...`);
  let domainContent = fs.readFileSync(domainSpecPath, 'utf8');

  // Pattern: | S-AUTH-001 | Title | Path | In Review/Approved | ... → Implemented
  // Status values: Draft, In Review, Clarified, Approved, Implemented (see terminology.md)
  const pattern = new RegExp(
    `(\\|\\s*${featureId}\\s*\\|[^|]*\\|[^|]*\\|\\s*)(Draft|In Review|Clarified|Approved)(\\s*\\|)`,
    'gi'
  );

  if (pattern.test(domainContent)) {
    domainContent = domainContent.replace(pattern, '$1Implemented$3');
    fs.writeFileSync(domainSpecPath, domainContent, 'utf8');
    updates.push(`Feature ${featureId}: Status → Implemented`);
    console.log(`   Updated ${featureId} to Implemented`);
  } else {
    console.log(`   Feature ${featureId} not found in index or already Implemented`);
  }
} else {
  console.log(`\n3. Feature Index update: Skipped (Domain Spec not found)`);
}

// 4. Update Feature Spec status
if (featureSpecPath) {
  console.log(`\n4. Updating Feature Spec status...`);
  let featureContent = fs.readFileSync(featureSpecPath, 'utf8');

  // Pattern: Status: Draft/In Review/Clarified/Approved → Implemented
  // Status values from terminology.md (uses Mixed Case in spec headers)
  const pattern = /^(Status:\s*)(Draft|In Review|Clarified|Approved)/mi;

  if (pattern.test(featureContent)) {
    featureContent = featureContent.replace(pattern, '$1Implemented');
    fs.writeFileSync(featureSpecPath, featureContent, 'utf8');
    updates.push(`Feature Spec ${featureId}: Status → Implemented`);
    console.log(`   Updated Feature Spec status to Implemented`);
  } else {
    console.log(`   Feature Spec already Implemented or status not found`);
  }
}

// 5. Clean up branch from state
const statePath = path.join(root, '.specify', 'state', 'branch-state.cjson');
if (branchName && fs.existsSync(statePath)) {
  console.log(`\n5. Cleaning up branch state...`);
  try {
    let stateContent = fs.readFileSync(statePath, 'utf8');
    // Simple removal - find and remove the branch entry
    // This is a simplified approach; a proper implementation would parse and rebuild
    const branchPattern = new RegExp(
      `"${branchName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"\\s*:\\s*\\{[^}]*\\},?`,
      'g'
    );

    if (branchPattern.test(stateContent)) {
      stateContent = stateContent.replace(branchPattern, '');
      // Clean up trailing commas
      stateContent = stateContent.replace(/,(\s*})/g, '$1');
      fs.writeFileSync(statePath, stateContent, 'utf8');
      updates.push(`Branch ${branchName}: Removed from state`);
      console.log(`   Removed ${branchName} from branch-state.cjson`);
    }
  } catch (e) {
    console.warn(`   Warning: Could not clean up branch state: ${e.message}`);
  }
}

// 6. Reset Input files
console.log(`\n6. Resetting Input files...`);
const inputDir = path.join(root, '.specify', 'input');
const resetInputScript = path.join(root, '.claude', 'skills', 'spec-mesh', 'scripts', 'reset-input.cjs');

if (fs.existsSync(resetInputScript)) {
  try {
    // Determine input type from feature/branch
    let inputType = null;
    if (branchName) {
      if (branchName.startsWith('feature/')) {
        inputType = 'add';
      } else if (branchName.startsWith('fix/')) {
        inputType = 'fix';
      } else if (branchName.startsWith('spec/')) {
        // Could be project-setup or change
        inputType = 'vision'; // Default to vision for spec branches
      }
    } else if (featureId) {
      // Infer from ID pattern
      if (featureId.startsWith('F-') || featureId.startsWith('S-')) {
        inputType = 'add';
      } else if (featureId.startsWith('X-') || featureId.startsWith('FIX-')) {
        inputType = 'fix';
      }
    }

    if (inputType) {
      // Validate inputType is one of known values (extra safety)
      const validInputTypes = ['add', 'fix', 'vision', 'change', 'project-setup'];
      if (!validInputTypes.includes(inputType)) {
        console.warn(`   Warning: Unknown input type: ${inputType}`);
      } else {
        execSync(`node "${resetInputScript}" ${inputType}`, { stdio: 'pipe', cwd: root });
        updates.push(`Input reset: ${inputType}-input.md`);
        console.log(`   Reset ${inputType}-input.md`);
      }
    } else {
      console.log(`   Could not determine input type to reset`);
    }
  } catch (e) {
    console.warn(`   Warning: Could not reset input: ${e.message}`);
  }
} else {
  console.log(`   Skipped (reset-input.cjs not found)`);
}

// 7. Delete git branch if requested
if (deleteBranch && branchName) {
  console.log(`\n7. Deleting git branch...`);
  try {
    execSync(`git branch -d "${branchName}"`, { stdio: 'pipe' });
    updates.push(`Git branch ${branchName}: Deleted`);
    console.log(`   Deleted branch ${branchName}`);
  } catch (e) {
    console.warn(`   Warning: Could not delete branch: ${e.message}`);
  }
}

// Summary
console.log(`\n=== Summary ===\n`);
if (updates.length > 0) {
  console.log('Updates applied:');
  updates.forEach(u => console.log(`  ✓ ${u}`));
} else {
  console.log('No updates were necessary.');
}

console.log(`\nPost-merge actions completed${hasErrors ? ' with warnings' : ''}.`);

// Helper function
function findFeatureSpec(id) {
  const featuresDir = path.join(specsRoot, 'features');
  if (!fs.existsSync(featuresDir)) return null;

  // Try direct match first
  const directPath = path.join(featuresDir, id.toLowerCase(), 'spec.md');
  if (fs.existsSync(directPath)) return directPath;

  // Search in subdirectories
  for (const entry of fs.readdirSync(featuresDir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      const specPath = path.join(featuresDir, entry.name, 'spec.md');
      if (fs.existsSync(specPath)) {
        const content = fs.readFileSync(specPath, 'utf8');
        if (content.includes(`Spec ID: ${id}`) || content.includes(`Spec ID(s): ${id}`)) {
          return specPath;
        }
      }
    }
  }

  return null;
}
