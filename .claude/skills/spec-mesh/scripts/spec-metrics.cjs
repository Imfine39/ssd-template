#!/usr/bin/env node
'use strict';

/**
 * Specification metrics collector.
 *
 * Generates metrics about the spec-driven development state:
 * - Overview stats (masters, APIs, last modified)
 * - Feature stats (total, by status)
 * - Coverage indicators
 * - Staleness warnings
 *
 * Usage:
 *   node .claude/skills/spec-mesh/scripts/spec-metrics.cjs [--json] [--verbose]
 *
 * Flags:
 *   --json     Output as JSON (for tooling integration)
 *   --verbose  Include detailed breakdowns
 */

const fs = require('fs');
const path = require('path');

const root = process.cwd();
const specsRoot = path.join(root, '.specify', 'specs');

// Parse arguments
const args = process.argv.slice(2);
const jsonOutput = args.includes('--json');
const verbose = args.includes('--verbose');

function rel(p) {
  return path.relative(root, p).replace(/\\/g, '/');
}

function walkForSpecs(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkForSpecs(full));
    } else if (entry.isFile() && entry.name.toLowerCase() === 'spec.md') {
      results.push(full);
    }
  }
  return results;
}

function normalizeSpecType(raw) {
  if (!raw) return null;
  const cleaned = raw.replace(/[\[\]]/g, '').split('|')[0].trim().toUpperCase();
  if (cleaned.startsWith('VISION')) return 'VISION';
  if (cleaned.startsWith('OVERVIEW') || cleaned.startsWith('DOMAIN')) return 'DOMAIN';
  if (cleaned.startsWith('FEATURE')) return 'FEATURE';
  return cleaned || null;
}

function extractList(raw) {
  if (!raw) return [];
  return raw
    .replace(/[\[\]]/g, '')
    .split(/[,|]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function matchTokens(content, regex) {
  return Array.from(content.matchAll(regex)).map((m) => m[0].toUpperCase());
}

function parseSpec(file) {
  const content = fs.readFileSync(file, 'utf8');
  const stat = fs.statSync(file);

  const typeMatch = content.match(/Spec Type:\s*([^\n\r]+)/i);
  const idsMatch = content.match(/Spec ID\(s\):\s*([^\n\r]+)/i);
  const statusMatch = content.match(/Status:\s*([^\n\r]+)/i);
  const titleMatch = content.match(/^#\s+(.+)/m);

  const specType = normalizeSpecType(typeMatch && typeMatch[1]);
  const specIds = extractList(idsMatch && idsMatch[1]);
  const ucIds = matchTokens(content, /\bUC-[A-Z0-9_-]+\b/gi);
  const frIds = matchTokens(content, /\bFR-[A-Z0-9_-]+\b/gi);
  const scIds = matchTokens(content, /\bSC-[A-Z0-9_-]+\b/gi);
  const masters = matchTokens(content, /\bM-[A-Z0-9_-]+\b/gi);
  const apis = matchTokens(content, /\bAPI-[A-Z0-9_-]+\b/gi);
  const status = statusMatch ? statusMatch[1].trim().toUpperCase() : 'UNKNOWN';
  const title = titleMatch ? titleMatch[1].replace(/^Specification:\s*/i, '').trim() : 'Untitled';

  return {
    file,
    relFile: rel(file),
    specType,
    specIds,
    title,
    ucIds,
    frIds,
    scIds,
    masters,
    apis,
    status,
    lastModified: stat.mtime,
    size: stat.size,
  };
}

function checkForPlanAndTasks(specFile) {
  const dir = path.dirname(specFile);
  return {
    hasPlan: fs.existsSync(path.join(dir, 'plan.md')),
    hasTasks: fs.existsSync(path.join(dir, 'tasks.md')),
  };
}

// Main execution
if (!fs.existsSync(specsRoot)) {
  if (jsonOutput) {
    console.log(JSON.stringify({ error: 'No specs directory found' }, null, 2));
  } else {
    console.log('No specs directory found at .specify/specs');
  }
  process.exit(0);
}

const specFiles = walkForSpecs(specsRoot);
if (specFiles.length === 0) {
  if (jsonOutput) {
    console.log(JSON.stringify({ error: 'No spec files found' }, null, 2));
  } else {
    console.log('No spec.md files found under .specify/specs');
  }
  process.exit(0);
}

const specs = specFiles.map(parseSpec);
const visionSpecs = specs.filter((s) => s.specType === 'VISION');
const domainSpecs = specs.filter((s) => s.specType === 'DOMAIN');
const featureSpecs = specs.filter((s) => s.specType === 'FEATURE');

// Calculate metrics
const metrics = {
  timestamp: new Date().toISOString(),
  vision: {
    count: visionSpecs.length,
    lastModified: visionSpecs.length > 0
      ? new Date(Math.max(...visionSpecs.map((s) => s.lastModified.getTime()))).toISOString()
      : null,
  },
  domain: {
    count: domainSpecs.length,
    masters: [...new Set(domainSpecs.flatMap((s) => s.masters))],
    apis: [...new Set(domainSpecs.flatMap((s) => s.apis))],
    lastModified: domainSpecs.length > 0
      ? new Date(Math.max(...domainSpecs.map((s) => s.lastModified.getTime()))).toISOString()
      : null,
  },
  features: {
    total: featureSpecs.length,
    byStatus: {},
    withPlan: 0,
    withTasks: 0,
  },
  coverage: {
    totalUCs: 0,
    totalFRs: 0,
    totalSCs: 0,
    ucsPerFeature: [],
  },
  staleness: {
    featuresOlderThanOverview: [],
    specsWithoutUCs: [],
    specsInDraftOver30Days: [],
  },
  health: {
    score: 100,
    issues: [],
  },
};

// Feature stats by status
const statusCounts = {};
for (const spec of featureSpecs) {
  statusCounts[spec.status] = (statusCounts[spec.status] || 0) + 1;

  const { hasPlan, hasTasks } = checkForPlanAndTasks(spec.file);
  if (hasPlan) metrics.features.withPlan++;
  if (hasTasks) metrics.features.withTasks++;

  metrics.coverage.totalUCs += spec.ucIds.length;
  metrics.coverage.totalFRs += spec.frIds.length;
  metrics.coverage.totalSCs += spec.scIds.length;
  metrics.coverage.ucsPerFeature.push({
    id: spec.specIds[0] || spec.relFile,
    ucs: spec.ucIds.length,
  });
}
metrics.features.byStatus = statusCounts;

// Staleness checks
const domainMtime = domainSpecs.length > 0
  ? Math.max(...domainSpecs.map((s) => s.lastModified.getTime()))
  : 0;
const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

for (const spec of featureSpecs) {
  // Check if feature is older than domain
  if (domainMtime > 0 && spec.lastModified.getTime() < domainMtime) {
    const daysDiff = Math.floor((domainMtime - spec.lastModified.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff > 7 && !['DEPRECATED', 'SUPERSEDED', 'COMPLETED'].includes(spec.status)) {
      metrics.staleness.featuresOlderThanOverview.push({
        id: spec.specIds[0] || spec.relFile,
        daysBehind: daysDiff,
      });
    }
  }

  // Check for specs without UCs
  if (spec.ucIds.length === 0 && spec.status !== 'DRAFT') {
    metrics.staleness.specsWithoutUCs.push(spec.specIds[0] || spec.relFile);
  }

  // Check for old drafts
  if (spec.status === 'DRAFT' && spec.lastModified.getTime() < thirtyDaysAgo) {
    const daysOld = Math.floor((Date.now() - spec.lastModified.getTime()) / (1000 * 60 * 60 * 24));
    metrics.staleness.specsInDraftOver30Days.push({
      id: spec.specIds[0] || spec.relFile,
      daysOld,
    });
  }
}

// Calculate health score
let healthDeductions = 0;
const healthIssues = [];

// Deduct for missing domain
if (domainSpecs.length === 0 && featureSpecs.length > 0) {
  healthDeductions += 20;
  healthIssues.push('No Domain spec found');
}

// Deduct for stale features
if (metrics.staleness.featuresOlderThanOverview.length > 0) {
  healthDeductions += Math.min(metrics.staleness.featuresOlderThanOverview.length * 5, 15);
  healthIssues.push(`${metrics.staleness.featuresOlderThanOverview.length} feature(s) may be outdated`);
}

// Deduct for specs without UCs
if (metrics.staleness.specsWithoutUCs.length > 0) {
  healthDeductions += Math.min(metrics.staleness.specsWithoutUCs.length * 5, 15);
  healthIssues.push(`${metrics.staleness.specsWithoutUCs.length} spec(s) have no UCs defined`);
}

// Deduct for old drafts
if (metrics.staleness.specsInDraftOver30Days.length > 0) {
  healthDeductions += Math.min(metrics.staleness.specsInDraftOver30Days.length * 3, 10);
  healthIssues.push(`${metrics.staleness.specsInDraftOver30Days.length} draft(s) over 30 days old`);
}

// Deduct for features without plans (if in Implementing status)
const implementingWithoutPlan = featureSpecs.filter(
  (s) => s.status === 'IMPLEMENTING' && !checkForPlanAndTasks(s.file).hasPlan
);
if (implementingWithoutPlan.length > 0) {
  healthDeductions += implementingWithoutPlan.length * 5;
  healthIssues.push(`${implementingWithoutPlan.length} implementing spec(s) without plan`);
}

metrics.health.score = Math.max(0, 100 - healthDeductions);
metrics.health.issues = healthIssues;

// Output
if (jsonOutput) {
  console.log(JSON.stringify(metrics, null, 2));
} else {
  console.log('='.repeat(60));
  console.log('SPECIFICATION METRICS');
  console.log('='.repeat(60));
  console.log(`Generated: ${metrics.timestamp}`);
  console.log();

  console.log('VISION');
  console.log('-'.repeat(40));
  console.log(`  Count: ${metrics.vision.count}`);
  if (metrics.vision.lastModified) {
    console.log(`  Last modified: ${metrics.vision.lastModified.split('T')[0]}`);
  }
  console.log();

  console.log('DOMAIN');
  console.log('-'.repeat(40));
  console.log(`  Count: ${metrics.domain.count}`);
  console.log(`  Masters defined: ${metrics.domain.masters.length}`);
  console.log(`  APIs defined: ${metrics.domain.apis.length}`);
  if (metrics.domain.lastModified) {
    console.log(`  Last modified: ${metrics.domain.lastModified.split('T')[0]}`);
  }
  console.log();

  console.log('FEATURES');
  console.log('-'.repeat(40));
  console.log(`  Total: ${metrics.features.total}`);
  console.log('  By status:');
  for (const [status, count] of Object.entries(metrics.features.byStatus)) {
    console.log(`    ${status}: ${count}`);
  }
  console.log(`  With plan.md: ${metrics.features.withPlan}`);
  console.log(`  With tasks.md: ${metrics.features.withTasks}`);
  console.log();

  console.log('COVERAGE');
  console.log('-'.repeat(40));
  console.log(`  Total UCs: ${metrics.coverage.totalUCs}`);
  console.log(`  Total FRs: ${metrics.coverage.totalFRs}`);
  console.log(`  Total SCs: ${metrics.coverage.totalSCs}`);
  if (verbose && metrics.coverage.ucsPerFeature.length > 0) {
    console.log('  UCs per feature:');
    for (const item of metrics.coverage.ucsPerFeature) {
      console.log(`    ${item.id}: ${item.ucs}`);
    }
  }
  console.log();

  console.log('HEALTH');
  console.log('-'.repeat(40));
  const scoreColor = metrics.health.score >= 80 ? '' : metrics.health.score >= 60 ? '' : '';
  console.log(`  Score: ${metrics.health.score}/100`);
  if (metrics.health.issues.length > 0) {
    console.log('  Issues:');
    for (const issue of metrics.health.issues) {
      console.log(`    - ${issue}`);
    }
  } else {
    console.log('  No issues found!');
  }
  console.log();

  if (verbose) {
    console.log('STALENESS DETAILS');
    console.log('-'.repeat(40));
    if (metrics.staleness.featuresOlderThanOverview.length > 0) {
      console.log('  Features older than Domain:');
      for (const item of metrics.staleness.featuresOlderThanOverview) {
        console.log(`    ${item.id}: ${item.daysBehind} days behind`);
      }
    }
    if (metrics.staleness.specsWithoutUCs.length > 0) {
      console.log('  Specs without UCs:');
      for (const id of metrics.staleness.specsWithoutUCs) {
        console.log(`    ${id}`);
      }
    }
    if (metrics.staleness.specsInDraftOver30Days.length > 0) {
      console.log('  Old drafts:');
      for (const item of metrics.staleness.specsInDraftOver30Days) {
        console.log(`    ${item.id}: ${item.daysOld} days old`);
      }
    }
  }

  console.log('='.repeat(60));
}
