#!/usr/bin/env node
'use strict';

/**
 * Scaffold Vision, Domain, Screen, Feature, or Fix specs from templates.
 *
 * Error Handling:
 *   Exit Code 0: Success
 *   Exit Code 1: Invalid arguments or missing dependencies
 *     - Missing required parameters (--kind, --id, --title)
 *     - Invalid kind value
 *     - Feature kind without --domain
 *     - Test-scenario kind without --feature
 *     - Template file not found
 *     - Feature directory not found (for test-scenario)
 *
 * Common Errors:
 *   - "ERROR: --kind, --id, --title are required" - All three are mandatory
 *   - "ERROR: Invalid kind X" - Use: vision, domain, screen, feature, fix, test-scenario
 *   - "ERROR: Feature requires --domain" - Feature specs must reference a Domain Spec
 *   - "ERROR: Test-scenario requires --feature" - Test scenarios need a feature directory
 *   - "ERROR: Template not found: X" - Template file missing from templates/
 *   - "ERROR: Feature directory not found: X" - Create feature first before test-scenario
 *   - "WARNING: Domain spec should reference a Vision spec" - Add --vision for traceability
 *   - "WARNING: Screen spec should reference a Domain spec" - Add --domain for traceability
 *
 * Examples:
 *   node .claude/skills/spec-mesh/scripts/scaffold-spec.cjs --kind vision --id S-VISION-001 --title "Project Vision"
 *
 *   node .claude/skills/spec-mesh/scripts/scaffold-spec.cjs --kind domain --id S-DOMAIN-001 --title "System Domain"
 *     --vision S-VISION-001 --masters M-CLIENT,M-ORDER --apis API-ORDER-LIST
 *
 *   node .claude/skills/spec-mesh/scripts/scaffold-spec.cjs --kind screen --id S-SCREEN-001 --title "System Screens"
 *     --vision S-VISION-001 --domain S-DOMAIN-001
 *
 *   node .claude/skills/spec-mesh/scripts/scaffold-spec.cjs --kind feature --id S-SALES-001 --title "Basic Sales Recording"
 *     --domain S-DOMAIN-001 --uc UC-001:Record sale,UC-002:Adjust sale --masters M-CLIENT --apis API-ORDER-LIST
 *
 *   node .claude/skills/spec-mesh/scripts/scaffold-spec.cjs --kind fix --id F-AUTH-001 --title "Login Error Fix"
 *     --issue 50
 *
 *   node .claude/skills/spec-mesh/scripts/scaffold-spec.cjs --kind test-scenario --id TS-SALES-001 --title "Sales Recording Tests"
 *     --feature ssales001-basic-sales-recording
 *
 * Directory structure:
 *   .specify/specs/
 *   ├── overview/           # vision, domain, screen, matrix
 *   │   ├── vision/
 *   │   ├── domain/
 *   │   └── screen/
 *   ├── features/           # feature specs
 *   └── fixes/              # fix specs
 *
 * Legacy support:
 *   --kind overview  → treated as --kind domain
 *   --overview       → treated as --domain
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const VALID_KINDS = ['vision', 'domain', 'screen', 'feature', 'fix', 'overview', 'test-scenario'];

/**
 * Input validation to prevent shell injection.
 * Allow alphanumeric characters, hyphens, underscores, and spaces (for titles).
 */
function validateId(value, fieldName) {
  if (!value) return true;
  const pattern = /^[a-zA-Z0-9_-]+$/;
  if (!pattern.test(value)) {
    console.error(`ERROR: Invalid ${fieldName}: "${value}"`);
    console.error(`  Only alphanumeric characters, hyphens, and underscores are allowed.`);
    process.exit(1);
  }
  return true;
}

/**
 * Validate title - more permissive but still safe.
 * Allow alphanumeric, spaces, hyphens, underscores, and common punctuation.
 */
function validateTitle(value) {
  if (!value) return true;
  // Disallow shell-dangerous characters
  const dangerousPattern = /[`$;|&<>()\\]/;
  if (dangerousPattern.test(value)) {
    console.error(`ERROR: Invalid title contains dangerous characters: "${value}"`);
    console.error(`  Avoid shell special characters: \` $ ; | & < > ( ) \\`);
    process.exit(1);
  }
  return true;
}

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {
    kind: null,
    id: null,
    title: null,
    vision: null,
    domain: null,
    issue: null,
    feature: null,
    masters: [],
    apis: [],
    uc: []
  };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--kind') out.kind = args[++i];
    else if (a === '--id') out.id = args[++i];
    else if (a === '--title') out.title = args[++i];
    else if (a === '--vision') out.vision = args[++i];
    else if (a === '--domain' || a === '--overview') out.domain = args[++i]; // --overview for legacy
    else if (a === '--project') { args[++i]; /* ignored for backward compatibility */ }
    else if (a === '--issue') out.issue = args[++i];
    else if (a === '--feature') out.feature = args[++i];
    else if (a === '--masters') out.masters = args[++i].split(',').map((s) => s.trim()).filter(Boolean);
    else if (a === '--apis') out.apis = args[++i].split(',').map((s) => s.trim()).filter(Boolean);
    else if (a === '--uc') out.uc = args[++i].split(',').map((s) => s.trim()).filter(Boolean);
  }

  // Legacy: overview → domain
  if (out.kind === 'overview') {
    console.log('NOTE: --kind overview is deprecated, use --kind domain');
    out.kind = 'domain';
  }

  if (!out.kind || !out.id || !out.title) {
    console.error('ERROR: --kind, --id, --title are required');
    console.error('  --kind: vision | domain | screen | feature | fix | test-scenario');
    process.exit(1);
  }
  if (!VALID_KINDS.includes(out.kind)) {
    console.error(`ERROR: Invalid kind "${out.kind}". Must be: vision, domain, screen, feature, fix, or test-scenario`);
    process.exit(1);
  }
  if (out.kind === 'domain' && !out.vision) {
    console.log('WARNING: Domain spec should reference a Vision spec (--vision)');
  }
  if (out.kind === 'screen' && !out.domain) {
    console.log('WARNING: Screen spec should reference a Domain spec (--domain)');
  }
  if (out.kind === 'feature' && !out.domain) {
    console.error('ERROR: Feature requires --domain (Domain Spec ID)');
    process.exit(1);
  }
  if (out.kind === 'test-scenario' && !out.feature) {
    console.error('ERROR: Test-scenario requires --feature (Feature directory name)');
    process.exit(1);
  }

  // Validate inputs to prevent shell injection
  validateId(out.id, 'id');
  validateId(out.vision, 'vision');
  validateId(out.domain, 'domain');
  validateId(out.issue, 'issue');
  validateId(out.feature, 'feature');
  validateTitle(out.title);

  // Validate masters and apis (each item)
  out.masters.forEach((m, i) => validateId(m, `masters[${i}]`));
  out.apis.forEach((a, i) => validateId(a, `apis[${i}]`));

  return out;
}

function getTemplatePath(kind) {
  const templateMap = {
    vision: 'vision-spec.md',
    domain: 'domain-spec.md',
    screen: 'screen-spec.md',
    feature: 'feature-spec.md',
    fix: 'fix-spec.md',
    'test-scenario': 'test-scenario-spec.md'
  };
  const templateFile = templateMap[kind];
  if (!templateFile) {
    console.error(`ERROR: No template for kind "${kind}"`);
    process.exit(1);
  }
  return path.join(process.cwd(), '.claude', 'skills', 'spec-mesh', 'templates', templateFile);
}

function readTemplate(kind) {
  const templatePath = getTemplatePath(kind);
  if (!fs.existsSync(templatePath)) {
    console.error(`ERROR: Template not found: ${templatePath}`);
    process.exit(1);
  }
  return fs.readFileSync(templatePath, 'utf8');
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function featureDirFromId(id, title) {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return `${id.replace(/[^A-Z0-9]+/gi, '').toLowerCase()}-${slug}`.slice(0, 80);
}

function buildSpecContent(template, args, relDir) {
  const now = new Date().toISOString().slice(0, 10);
  let content = template;

  // Common replacements
  content = content.replace('[PROJECT_NAME]', args.title);
  content = content.replace('[TITLE]', args.title);
  content = content.replace(/\{date\}/g, now);
  content = content.replace(/Status: \[Draft[^\]]*\]/, 'Status: Draft');
  content = content.replace('Author: [OWNER]', 'Author: [OWNER]');

  // Kind-specific replacements
  if (args.kind === 'vision') {
    content = content.replace('Spec ID: S-VISION-001', `Spec ID: ${args.id}`);
  } else if (args.kind === 'domain') {
    content = content.replace('Spec ID: S-DOMAIN-001', `Spec ID: ${args.id}`);
    if (args.vision) {
      content = content.replace('Related Vision: S-VISION-001', `Related Vision: ${args.vision}`);
    }
  } else if (args.kind === 'screen') {
    content = content.replace('Spec ID: S-SCREEN-001', `Spec ID: ${args.id}`);
    if (args.vision) {
      content = content.replace('Related Vision: S-VISION-001', `Related Vision: ${args.vision}`);
    }
    if (args.domain) {
      content = content.replace('Related Domain: S-DOMAIN-001', `Related Domain: ${args.domain}`);
    }
  } else if (args.kind === 'feature') {
    content = content.replace('Spec ID: S-{XXX}-001', `Spec ID: ${args.id}`);
    if (args.domain) {
      content = content.replace('Related Domain: S-DOMAIN-001', `Related Domain: ${args.domain}`);
    }
    content = content.replace('Related Issue(s): [#123]', 'Related Issue(s): ');
  } else if (args.kind === 'fix') {
    content = content.replace('Spec ID: F-{XXX}-001', `Spec ID: ${args.id}`);
    if (args.issue) {
      content = content.replace('Related Issue: [#N]', `Related Issue: #${args.issue}`);
    }
  } else if (args.kind === 'test-scenario') {
    content = content.replace('Spec ID: TS-{FEATURE_ID}', `Spec ID: ${args.id}`);
    content = content.replace('[FEATURE_NAME]', args.title);
    if (args.feature) {
      content = content.replace('Feature: S-{XXX}-001', `Feature: ${args.feature}`);
      content = content.replace('.specify/specs/features/{feature}/spec.md', `${relDir}/spec.md`);
      content = content.replace(/\.specify\/specs\/features\/\{feature\}/g, relDir);
    }
  }

  return content;
}

function ensureFeatureTable(text) {
  const marker = '| Feature ID | Title | Path | Status | Related M-*/API-* |';
  if (text.includes(marker)) return text;

  // Try new Domain Spec format first
  const featureIndex = '## 8. Feature Index';
  let idx = text.indexOf(featureIndex);
  if (idx !== -1) {
    const insertAt = text.indexOf('\n\n', idx);
    if (insertAt !== -1) {
      const table = `\n${marker}\n|------------|-------|------|--------|-------------------|\n`;
      return text.slice(0, insertAt + 1) + table + text.slice(insertAt + 1);
    }
  }

  // Fallback to old Overview format
  const trace = '## 16. Traceability';
  idx = text.indexOf(trace);
  if (idx === -1) return text;
  const insertAt = text.indexOf('\n', idx);
  const table = `\n| Feature ID | Title | Path | Status |\n| ---------- | ----- | ---- | ------ |\n`;
  return text.slice(0, insertAt + 1) + table + text.slice(insertAt + 1);
}

function appendFeatureIndexRow(domainPath, featureEntry) {
  let text = fs.readFileSync(domainPath, 'utf8');
  text = ensureFeatureTable(text);
  if (!text.includes(featureEntry)) {
    // Try new format first
    let separator = '|------------|-------|------|--------|-------------------|';
    if (!text.includes(separator)) {
      // Fallback to old format
      separator = '| ---------- | ----- | ---- | ------ |';
    }
    text = text.replace(separator, `${separator}\n${featureEntry}`);
  }
  fs.writeFileSync(domainPath, text, 'utf8');
}

function fixDirFromId(id, title) {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return `${id.replace(/[^A-Z0-9]+/gi, '').toLowerCase()}-${slug}`.slice(0, 80);
}

// Record changelog entry for spec creation
function recordChangelog(specPath, specId, kind, title) {
  try {
    const changelogScript = path.join(__dirname, 'changelog.cjs');
    if (!fs.existsSync(changelogScript)) {
      return; // Skip if changelog script doesn't exist
    }

    const description = `${kind.charAt(0).toUpperCase() + kind.slice(1)} Spec 作成: ${title}`;
    const specArg = kind === 'feature' || kind === 'fix' ? `--feature ${specId}` : `--spec ${specPath}`;

    execSync(
      `node "${changelogScript}" record ${specArg} --type create --description "${description}"`,
      { stdio: 'pipe', cwd: process.cwd() }
    );
    console.log('Changelog entry recorded');
  } catch (e) {
    // Non-critical, just log warning
    console.log('Note: Could not record changelog entry');
  }
}

function main() {
  const args = parseArgs();
  const template = readTemplate(args.kind);
  const specsBase = path.join(process.cwd(), '.specify', 'specs');

  // Overview specs: vision, domain, screen
  if (['vision', 'domain', 'screen'].includes(args.kind)) {
    const dir = path.join(specsBase, 'overview', args.kind);
    ensureDir(dir);
    const outPath = path.join(dir, 'spec.md');
    const content = buildSpecContent(template, args, args.kind);
    fs.writeFileSync(outPath, content, 'utf8');
    console.log(`Created ${args.kind.charAt(0).toUpperCase() + args.kind.slice(1)} spec at ${path.relative(process.cwd(), outPath)}`);
    recordChangelog(path.relative(process.cwd(), outPath), args.id, args.kind, args.title);
    return;
  }

  // Fix specs
  if (args.kind === 'fix') {
    const fixDir = fixDirFromId(args.id, args.title);
    const dir = path.join(specsBase, 'fixes', fixDir);
    ensureDir(dir);
    const outPath = path.join(dir, 'spec.md');
    const relDir = path.relative(process.cwd(), dir).replace(/\\/g, '/');
    const content = buildSpecContent(template, args, relDir);
    fs.writeFileSync(outPath, content, 'utf8');
    console.log(`Created Fix spec at ${path.relative(process.cwd(), outPath)}`);
    recordChangelog(path.relative(process.cwd(), outPath), args.id, args.kind, args.title);
    return;
  }

  // Test scenario specs
  if (args.kind === 'test-scenario') {
    const dir = path.join(specsBase, 'features', args.feature);
    if (!fs.existsSync(dir)) {
      console.error(`ERROR: Feature directory not found: ${dir}`);
      console.error('  --feature should be the feature directory name (e.g., ssales001-basic-sales-recording)');
      process.exit(1);
    }
    const outPath = path.join(dir, 'test-scenarios.md');
    const relDir = path.relative(process.cwd(), dir).replace(/\\/g, '/');
    const content = buildSpecContent(template, args, relDir);
    fs.writeFileSync(outPath, content, 'utf8');
    console.log(`Created Test Scenario spec at ${path.relative(process.cwd(), outPath)}`);
    recordChangelog(path.relative(process.cwd(), outPath), args.id, args.kind, args.title);
    return;
  }

  // Feature specs
  const featureDir = featureDirFromId(args.id, args.title);
  const dir = path.join(specsBase, 'features', featureDir);
  ensureDir(dir);
  const outPath = path.join(dir, 'spec.md');
  const relDir = path.relative(process.cwd(), dir).replace(/\\/g, '/');
  const content = buildSpecContent(template, args, relDir);
  fs.writeFileSync(outPath, content, 'utf8');
  console.log(`Created Feature spec at ${path.relative(process.cwd(), outPath)}`);
  recordChangelog(path.relative(process.cwd(), outPath), args.id, 'feature', args.title);

  // Append to Domain index if present
  // Structure: specs/overview/domain/spec.md
  // Legacy: specs/domain/spec.md or specs/overview/spec.md
  const domainPath = path.join(specsBase, 'overview', 'domain', 'spec.md');
  const legacyDomainPath = path.join(specsBase, 'domain', 'spec.md');
  const legacyOverviewPath = path.join(specsBase, 'overview', 'spec.md');

  let targetPath = null;
  if (fs.existsSync(domainPath)) {
    targetPath = domainPath;
  } else if (fs.existsSync(legacyDomainPath)) {
    targetPath = legacyDomainPath;
  } else if (fs.existsSync(legacyOverviewPath)) {
    targetPath = legacyOverviewPath;
  }

  if (targetPath) {
    const masters = args.masters.length > 0 ? args.masters.join(', ') : '-';
    const entry = `| ${args.id} | ${args.title} | ${relDir}/spec.md | Draft | ${masters} |`;
    appendFeatureIndexRow(targetPath, entry);
    console.log(`Updated feature index in ${path.relative(process.cwd(), targetPath)}`);
  }
}

main();
