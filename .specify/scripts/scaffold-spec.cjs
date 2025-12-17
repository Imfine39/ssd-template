#!/usr/bin/env node
'use strict';

/**
 * Scaffold Vision, Domain, Screen, or Feature specs from templates.
 *
 * Examples:
 *   node .specify/scripts/scaffold-spec.cjs --kind vision --id S-VISION-001 --title "Project Vision"
 *
 *   node .specify/scripts/scaffold-spec.cjs --kind domain --id S-DOMAIN-001 --title "System Domain"
 *     --vision S-VISION-001 --masters M-CLIENTS,M-ORDERS --apis API-ORDERS-LIST
 *
 *   node .specify/scripts/scaffold-spec.cjs --kind screen --id S-SCREEN-001 --title "System Screens"
 *     --vision S-VISION-001 --domain S-DOMAIN-001
 *
 *   node .specify/scripts/scaffold-spec.cjs --kind feature --id S-SALES-001 --title "Basic Sales Recording"
 *     --domain S-DOMAIN-001 --uc UC-001:Record sale,UC-002:Adjust sale --masters M-CLIENTS --apis API-ORDERS-LIST
 *
 * Legacy support:
 *   --kind overview  → treated as --kind domain
 *   --overview       → treated as --domain
 */

const fs = require('fs');
const path = require('path');

const VALID_KINDS = ['vision', 'domain', 'screen', 'feature', 'overview'];

function parseArgs() {
  const args = process.argv.slice(2);
  const out = { kind: null, id: null, title: null, vision: null, domain: null, masters: [], apis: [], uc: [] };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--kind') out.kind = args[++i];
    else if (a === '--id') out.id = args[++i];
    else if (a === '--title') out.title = args[++i];
    else if (a === '--vision') out.vision = args[++i];
    else if (a === '--domain' || a === '--overview') out.domain = args[++i]; // --overview for legacy
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
    console.error('  --kind: vision | domain | screen | feature');
    process.exit(1);
  }
  if (!VALID_KINDS.includes(out.kind)) {
    console.error(`ERROR: Invalid kind "${out.kind}". Must be: vision, domain, screen, or feature`);
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
  return out;
}

function getTemplatePath(kind) {
  const templateMap = {
    vision: 'vision-spec-template.md',
    domain: 'domain-spec-template.md',
    screen: 'screen-spec-template.md',
    feature: 'feature-spec-template.md'
  };
  const templateFile = templateMap[kind];
  if (!templateFile) {
    console.error(`ERROR: No template for kind "${kind}"`);
    process.exit(1);
  }
  return path.join(process.cwd(), '.specify', 'templates', templateFile);
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
  content = content.replace(/\[DATE\]/g, now);
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
    content = content.replace('Spec ID: S-[XXX]-001', `Spec ID: ${args.id}`);
    if (args.domain) {
      content = content.replace('Related Domain: S-DOMAIN-001', `Related Domain: ${args.domain}`);
    }
    content = content.replace('Related Issue(s): [#123]', 'Related Issue(s): ');
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

function main() {
  const args = parseArgs();
  const template = readTemplate(args.kind);

  if (args.kind === 'vision') {
    const dir = path.join(process.cwd(), '.specify', 'specs', 'vision');
    ensureDir(dir);
    const outPath = path.join(dir, 'spec.md');
    const content = buildSpecContent(template, args, 'vision');
    fs.writeFileSync(outPath, content, 'utf8');
    console.log(`Created Vision spec at ${path.relative(process.cwd(), outPath)}`);
    return;
  }

  if (args.kind === 'domain') {
    const dir = path.join(process.cwd(), '.specify', 'specs', 'domain');
    ensureDir(dir);
    const outPath = path.join(dir, 'spec.md');
    const content = buildSpecContent(template, args, 'domain');
    fs.writeFileSync(outPath, content, 'utf8');
    console.log(`Created Domain spec at ${path.relative(process.cwd(), outPath)}`);
    return;
  }

  if (args.kind === 'screen') {
    const dir = path.join(process.cwd(), '.specify', 'specs', 'screen');
    ensureDir(dir);
    const outPath = path.join(dir, 'spec.md');
    const content = buildSpecContent(template, args, 'screen');
    fs.writeFileSync(outPath, content, 'utf8');
    console.log(`Created Screen spec at ${path.relative(process.cwd(), outPath)}`);
    return;
  }

  // Feature
  const featureDir = featureDirFromId(args.id, args.title);
  const dir = path.join(process.cwd(), '.specify', 'specs', featureDir);
  ensureDir(dir);
  const outPath = path.join(dir, 'spec.md');
  const relDir = path.relative(process.cwd(), dir).replace(/\\/g, '/');
  const content = buildSpecContent(template, args, relDir);
  fs.writeFileSync(outPath, content, 'utf8');
  console.log(`Created Feature spec at ${path.relative(process.cwd(), outPath)}`);

  // Append to Domain index if present (preferred) or Overview (legacy)
  const domainPath = path.join(process.cwd(), '.specify', 'specs', 'domain', 'spec.md');
  const overviewPath = path.join(process.cwd(), '.specify', 'specs', 'overview', 'spec.md');
  const targetPath = fs.existsSync(domainPath) ? domainPath : (fs.existsSync(overviewPath) ? overviewPath : null);

  if (targetPath) {
    const masters = args.masters.length > 0 ? args.masters.join(', ') : '-';
    const entry = `| ${args.id} | ${args.title} | ${relDir}/spec.md | Draft | ${masters} |`;
    appendFeatureIndexRow(targetPath, entry);
    console.log(`Updated feature index in ${path.relative(process.cwd(), targetPath)}`);
  }
}

main();
