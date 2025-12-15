#!/usr/bin/env node
'use strict';

/**
 * Reset Quick Input files to their default template state.
 *
 * Usage:
 *   node .specify/scripts/reset-input.js vision    # Reset vision input only
 *   node .specify/scripts/reset-input.js add       # Reset add input only
 *   node .specify/scripts/reset-input.js fix       # Reset fix input only
 *   node .specify/scripts/reset-input.js all       # Reset all input files
 *   node .specify/scripts/reset-input.js --list    # List available input types
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '../..');
const TEMPLATES_DIR = path.join(REPO_ROOT, '.specify/templates');
const INPUT_DIR = path.join(REPO_ROOT, '.specify/input');

const INPUT_TYPES = {
  vision: {
    template: 'quickinput-vision.md',
    input: 'vision.md',
    description: 'Vision Spec の入力'
  },
  add: {
    template: 'quickinput-add.md',
    input: 'add.md',
    description: 'Feature 追加の入力'
  },
  fix: {
    template: 'quickinput-fix.md',
    input: 'fix.md',
    description: 'Bug Fix の入力'
  },
  screen: {
    template: 'quickinput-screen.md',
    input: 'screen.md',
    description: 'Screen Spec の入力（画面設計）'
  }
};

function showHelp() {
  console.log('Usage: node .specify/scripts/reset-input.js <type>');
  console.log('');
  console.log('Types:');
  console.log('  vision  - Reset vision input file');
  console.log('  add     - Reset add (feature) input file');
  console.log('  fix     - Reset fix (bug) input file');
  console.log('  screen  - Reset screen (UI design) input file');
  console.log('  all     - Reset all input files');
  console.log('  --list  - Show available input types');
  console.log('');
  console.log('Examples:');
  console.log('  node .specify/scripts/reset-input.js vision');
  console.log('  node .specify/scripts/reset-input.js screen');
  console.log('  node .specify/scripts/reset-input.js all');
}

function listTypes() {
  console.log('Available input types:');
  console.log('');
  for (const [type, info] of Object.entries(INPUT_TYPES)) {
    console.log(`  ${type.padEnd(8)} - ${info.description}`);
    console.log(`             Template: .specify/templates/${info.template}`);
    console.log(`             Input:    .specify/input/${info.input}`);
    console.log('');
  }
}

function resetInput(type) {
  const info = INPUT_TYPES[type];
  if (!info) {
    console.error(`ERROR: Unknown input type '${type}'`);
    console.error('Valid types: vision, add, fix, screen, all');
    process.exit(1);
  }

  const templatePath = path.join(TEMPLATES_DIR, info.template);
  const inputPath = path.join(INPUT_DIR, info.input);

  // Check template exists
  if (!fs.existsSync(templatePath)) {
    console.error(`ERROR: Template not found: ${templatePath}`);
    process.exit(1);
  }

  // Ensure input directory exists
  if (!fs.existsSync(INPUT_DIR)) {
    fs.mkdirSync(INPUT_DIR, { recursive: true });
  }

  // Copy template to input
  const content = fs.readFileSync(templatePath, 'utf8');
  fs.writeFileSync(inputPath, content, 'utf8');

  console.log(`✓ Reset: .specify/input/${info.input}`);
}

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    showHelp();
    process.exit(0);
  }

  if (args[0] === '--list') {
    listTypes();
    process.exit(0);
  }

  const type = args[0].toLowerCase();

  if (type === 'all') {
    console.log('Resetting all input files...');
    console.log('');
    for (const t of Object.keys(INPUT_TYPES)) {
      resetInput(t);
    }
    console.log('');
    console.log('All input files have been reset to default.');
  } else {
    resetInput(type);
  }
}

main();
