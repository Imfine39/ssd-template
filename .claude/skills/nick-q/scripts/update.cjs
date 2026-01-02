#!/usr/bin/env node
/**
 * NICK-Q Template Update Script
 *
 * Updates the nick-q framework from the template repository while preserving
 * project-specific files.
 *
 * Usage:
 *   node .claude/skills/nick-q/scripts/update.cjs [options]
 *
 * Options:
 *   --check       Check for updates without applying
 *   --force       Force update even if versions match
 *   --dry-run     Show what would be updated without making changes
 *   --help        Show this help message
 *
 * Updateable (will be overwritten):
 *   - .claude/skills/nick-q/
 *   - .claude/agents/
 *   - .github/workflows/
 *   - docs/
 *
 * Protected (will NOT be touched):
 *   - .specify/specs/
 *   - .specify/input/
 *   - .specify/state/
 *   - .specify/memory/
 *   - CLAUDE.md (project-specific)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

// Configuration
// NOTE: After forking, update templateRepo to your fork (e.g., 'your-username/nick-q')
const CONFIG = {
  templateRepo: 'Imfine39/nick-q',
  branch: 'main',
  versionFile: '.specify/state/template-version.json',
  manifestFile: '.claude/template-manifest.json',

  // Exact paths to update (template-owned files only)
  // Use directory paths ending with / for entire directories
  // Use file paths for specific files
  updateTargets: [
    // Framework core (entire directory)
    '.claude/skills/nick-q/',

    // Template-provided agents (specific files only)
    '.claude/agents/reviewer.md',
    '.claude/agents/developer.md',

    // CI/CD workflows
    '.github/workflows/',

    // Documentation
    'docs/',
  ],

  // Paths that are NEVER updated even if in updateTargets
  // (for project customizations within template directories)
  neverUpdate: [
    // Add project-specific overrides here if needed
  ],

  // These are always protected (informational - never in updateTargets)
  protectedPaths: [
    '.specify/specs/',
    '.specify/input/',
    '.specify/state/',
    '.specify/memory/',
    '.claude/settings.json',
    '.claude/settings.local.json',
    'CLAUDE.md',
  ],
};

// Helpers
function log(msg, type = 'info') {
  const prefix = {
    info: '\x1b[36mℹ\x1b[0m',
    success: '\x1b[32m✓\x1b[0m',
    warn: '\x1b[33m⚠\x1b[0m',
    error: '\x1b[31m✗\x1b[0m',
  };
  console.log(`${prefix[type] || ''} ${msg}`);
}

function findRepoRoot() {
  let dir = process.cwd();
  while (dir !== path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, '.git'))) {
      return dir;
    }
    dir = path.dirname(dir);
  }
  throw new Error('Not inside a git repository');
}

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'nick-q-updater' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return httpsGet(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}: ${url}`));
        return;
      }
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
  });
}

function httpsGetBuffer(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'nick-q-updater' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return httpsGetBuffer(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}: ${url}`));
        return;
      }
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    });
    req.on('error', reject);
  });
}

async function getLatestCommit() {
  const url = `https://api.github.com/repos/${CONFIG.templateRepo}/commits/${CONFIG.branch}`;
  const data = await httpsGet(url);
  const commit = JSON.parse(data);
  return {
    sha: commit.sha,
    date: commit.commit.committer.date,
    message: commit.commit.message.split('\n')[0],
  };
}

function getCurrentVersion(repoRoot) {
  const versionPath = path.join(repoRoot, CONFIG.versionFile);
  if (fs.existsSync(versionPath)) {
    try {
      return JSON.parse(fs.readFileSync(versionPath, 'utf-8'));
    } catch {
      return null;
    }
  }
  return null;
}

function saveVersion(repoRoot, version) {
  const versionPath = path.join(repoRoot, CONFIG.versionFile);
  const dir = path.dirname(versionPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(versionPath, JSON.stringify(version, null, 2) + '\n');
}

async function downloadAndExtract(repoRoot, dryRun = false) {
  const zipUrl = `https://github.com/${CONFIG.templateRepo}/archive/refs/heads/${CONFIG.branch}.zip`;
  log(`Downloading from ${zipUrl}...`);

  const zipBuffer = await httpsGetBuffer(zipUrl);
  const tempDir = path.join(repoRoot, '.update-temp');
  const zipPath = path.join(tempDir, 'template.zip');

  if (dryRun) {
    log('Dry run: Would download and extract template', 'info');
    return null;
  }

  // Create temp directory
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true });
  }
  fs.mkdirSync(tempDir, { recursive: true });

  // Write zip file
  fs.writeFileSync(zipPath, zipBuffer);

  // Extract using tar (works on Windows with Git Bash) or PowerShell
  try {
    if (process.platform === 'win32') {
      execSync(`powershell -Command "Expand-Archive -Path '${zipPath}' -DestinationPath '${tempDir}' -Force"`, {
        stdio: 'pipe',
      });
    } else {
      execSync(`unzip -q "${zipPath}" -d "${tempDir}"`, { stdio: 'pipe' });
    }
  } catch (err) {
    throw new Error(`Failed to extract zip: ${err.message}`);
  }

  // Find extracted directory (usually repo-branch)
  const extracted = fs.readdirSync(tempDir).find((f) => f.startsWith('nick-q') || f.startsWith('ssd-template'));
  if (!extracted) {
    throw new Error('Could not find extracted template directory');
  }

  return path.join(tempDir, extracted);
}

function isInNeverUpdate(filePath, repoRoot) {
  const relativePath = path.relative(repoRoot, filePath).replace(/\\/g, '/');
  return CONFIG.neverUpdate.some((pattern) => {
    if (pattern.endsWith('/')) {
      return relativePath.startsWith(pattern);
    }
    return relativePath === pattern;
  });
}

function copyFile(src, dest, repoRoot, dryRun = false) {
  // Check neverUpdate
  if (isInNeverUpdate(dest, repoRoot)) {
    return null;
  }

  // Check if file changed
  let changed = true;
  if (fs.existsSync(dest)) {
    const srcContent = fs.readFileSync(src);
    const destContent = fs.readFileSync(dest);
    changed = !srcContent.equals(destContent);
  }

  if (changed) {
    if (!dryRun) {
      const destDir = path.dirname(dest);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      fs.copyFileSync(src, dest);
    }
    return dest;
  }
  return null;
}

function copyDirectory(src, dest, repoRoot, dryRun = false) {
  const updated = [];

  if (!fs.existsSync(src)) {
    return updated;
  }

  if (!dryRun && !fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      updated.push(...copyDirectory(srcPath, destPath, repoRoot, dryRun));
    } else {
      const result = copyFile(srcPath, destPath, repoRoot, dryRun);
      if (result) {
        updated.push(result);
      }
    }
  }

  return updated;
}

function cleanup(repoRoot) {
  const tempDir = path.join(repoRoot, '.update-temp');
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true });
  }
}

/**
 * Merge CLAUDE.md by replacing only the template section
 * Template section is marked with:
 *   <!-- SSD-MESH-TEMPLATE-START -->
 *   ... template content ...
 *   <!-- SSD-MESH-TEMPLATE-END -->
 */
function mergeCLAUDEmd(templateDir, repoRoot, dryRun = false) {
  const TEMPLATE_START = '<!-- SSD-MESH-TEMPLATE-START -->';
  const TEMPLATE_END = '<!-- SSD-MESH-TEMPLATE-END -->';

  const templatePath = path.join(templateDir, '.claude/skills/nick-q/templates/CLAUDE.template.md');
  const targetPath = path.join(repoRoot, 'CLAUDE.md');

  if (!fs.existsSync(templatePath)) {
    log('CLAUDE.template.md not found, skipping CLAUDE.md merge', 'warn');
    return null;
  }

  // Read template content
  const templateContent = fs.readFileSync(templatePath, 'utf-8');

  // Read current CLAUDE.md
  if (!fs.existsSync(targetPath)) {
    // No existing CLAUDE.md, create new one with template section
    const newContent = `${TEMPLATE_START}\n<!-- このセクションは update.cjs で自動更新されます。直接編集しないでください。 -->\n\n${templateContent}\n${TEMPLATE_END}\n\n---\n\n## Project-Specific Rules\n\nこのセクション以降はプロジェクト固有の設定です。\nテンプレート更新時も保持されます。\n\n### Additional Rules\n\n<!-- プロジェクト固有のルールをここに追加 -->\n`;
    if (!dryRun) {
      fs.writeFileSync(targetPath, newContent);
    }
    return targetPath;
  }

  const currentContent = fs.readFileSync(targetPath, 'utf-8');

  // Find template section markers
  const startIdx = currentContent.indexOf(TEMPLATE_START);
  const endIdx = currentContent.indexOf(TEMPLATE_END);

  if (startIdx === -1 || endIdx === -1) {
    log('CLAUDE.md does not have template markers, skipping merge', 'warn');
    log('Add <!-- SSD-MESH-TEMPLATE-START --> and <!-- SSD-MESH-TEMPLATE-END --> markers to enable auto-update', 'info');
    return null;
  }

  // Build new content: before + template + after
  const before = currentContent.substring(0, startIdx);
  const after = currentContent.substring(endIdx + TEMPLATE_END.length);

  const newTemplateSection = `${TEMPLATE_START}\n<!-- このセクションは update.cjs で自動更新されます。直接編集しないでください。 -->\n\n${templateContent}\n${TEMPLATE_END}`;

  const newContent = before + newTemplateSection + after;

  // Check if content changed
  if (newContent === currentContent) {
    return null;
  }

  if (!dryRun) {
    fs.writeFileSync(targetPath, newContent);
  }

  return targetPath;
}

async function main() {
  const args = process.argv.slice(2);
  const checkOnly = args.includes('--check');
  const force = args.includes('--force');
  const dryRun = args.includes('--dry-run');
  const help = args.includes('--help') || args.includes('-h');

  if (help) {
    console.log(`
NICK-Q Template Update Script

Usage:
  node .claude/skills/nick-q/scripts/update.cjs [options]

Options:
  --check       Check for updates without applying
  --force       Force update even if versions match
  --dry-run     Show what would be updated without making changes
  --help        Show this help message

Updateable:
  ${CONFIG.updateTargets.join('\n  ')}
  CLAUDE.md (template section between markers only)

Protected (never touched):
  ${CONFIG.protectedPaths.join('\n  ')}
  CLAUDE.md Project-Specific section
`);
    return;
  }

  try {
    const repoRoot = findRepoRoot();
    log(`Repository root: ${repoRoot}`);

    // Get current and latest versions
    log('Checking versions...');
    const current = getCurrentVersion(repoRoot);
    const latest = await getLatestCommit();

    if (current) {
      log(`Current version: ${current.sha.slice(0, 7)} (${current.date})`);
    } else {
      log('Current version: Not tracked (first update)', 'warn');
    }
    log(`Latest version:  ${latest.sha.slice(0, 7)} (${latest.date})`);
    log(`Latest commit:   ${latest.message}`);

    // Check if update needed
    if (current && current.sha === latest.sha && !force) {
      log('Already up to date!', 'success');
      return;
    }

    if (checkOnly) {
      if (!current || current.sha !== latest.sha) {
        log('Update available!', 'warn');
        console.log(`\nRun without --check to apply update.`);
      }
      return;
    }

    // Download and extract
    const templateDir = await downloadAndExtract(repoRoot, dryRun);

    if (dryRun) {
      log('Dry run: Would update the following:', 'info');
      CONFIG.updateTargets.forEach((t) => console.log(`  - ${t}`));
      console.log(`  - CLAUDE.md (template section only)`);
      return;
    }

    // Update each target
    log('Updating files...');
    const allUpdated = [];

    for (const target of CONFIG.updateTargets) {
      const src = path.join(templateDir, target);
      const dest = path.join(repoRoot, target);

      if (!fs.existsSync(src)) {
        continue;
      }

      // Check if target is a directory (ends with /) or a file
      if (target.endsWith('/')) {
        // Directory: copy entire directory
        const updated = copyDirectory(src, dest, repoRoot, false);
        allUpdated.push(...updated.map((f) => path.relative(repoRoot, f)));
      } else {
        // File: copy single file
        const result = copyFile(src, dest, repoRoot, false);
        if (result) {
          allUpdated.push(path.relative(repoRoot, result));
        }
      }
    }

    // Merge CLAUDE.md (section-based update)
    log('Updating CLAUDE.md...');
    const claudeMdResult = mergeCLAUDEmd(templateDir, repoRoot, false);
    if (claudeMdResult) {
      allUpdated.push('CLAUDE.md');
    }

    // Save version
    saveVersion(repoRoot, {
      sha: latest.sha,
      date: latest.date,
      message: latest.message,
      updatedAt: new Date().toISOString(),
    });

    // Cleanup
    cleanup(repoRoot);

    // Report
    if (allUpdated.length > 0) {
      log(`Updated ${allUpdated.length} files:`, 'success');
      allUpdated.slice(0, 20).forEach((f) => console.log(`  - ${f}`));
      if (allUpdated.length > 20) {
        console.log(`  ... and ${allUpdated.length - 20} more`);
      }
    } else {
      log('No files changed (content identical)', 'success');
    }

    log(`\nUpdate complete! Version: ${latest.sha.slice(0, 7)}`, 'success');

  } catch (err) {
    log(err.message, 'error');
    process.exit(1);
  }
}

main();
