# Scripts Error Reference

This guide documents common errors across all spec-mesh scripts and how to troubleshoot them.

---

## Requirements

**Node.js Version:** 18.x or higher (LTS recommended)

All scripts use ES modules features and modern JavaScript syntax. Tested with:
- Node.js 18.x (LTS)
- Node.js 20.x (LTS)
- Node.js 22.x

**Check version:**
```bash
node --version  # Should be v18.0.0 or higher
```

---

## Scope

This guide covers:
- Script-specific error messages and exit codes
- Troubleshooting procedures for each script
- Complete reset and recovery workflows

**Related guides:**
- `error-recovery.md` - Workflow-level errors (spec, plan, implementation, PR)
- `parallel-development.md` - Team coordination issues during parallel development

---

## Exit Code Summary

All scripts use consistent exit codes:

| Exit Code | Meaning | Action | Scripts |
|-----------|---------|--------|---------|
| 0 | Success / Help / Passed | Continue workflow | All |
| 1 | Validation/Argument Error | Fix input and retry | All |
| 2 | File/Parse Error | Check file paths, fix JSON | validate-matrix, generate-matrix-view |

**Note:** Exit code 2 is only used by file-processing scripts that may encounter parse errors.

---

## Script-by-Script Error Reference

### state.cjs

State management for repo and branch tracking.

**Exit Codes:**
- `0`: Success or help shown
- `1`: Invalid arguments or validation error

**Common Errors:**

| Error Message | Cause | Solution |
|--------------|-------|----------|
| `Invalid status: X` | Status value not in allowed list | Use: `none`, `scaffold`, `draft`, `clarified`, `approved` |
| `Invalid phase: X` | Phase value not in allowed list | Use: `initialization`, `vision`, `design`, `foundation`, `development` |
| `Invalid step: X` | Step value not in allowed list | Use: `idle`, `spec`, `spec_review`, `plan`, `plan_review`, `tasks`, `implement`, `pr`, `suspended` |
| `Invalid type: X` | Type value not in allowed list | Use: `feature`, `fix`, `spec-change`, `spec` |
| `Invalid task progress format` | Format not N/M | Use format like `3/10` (completed/total) |
| `Could not determine branch` | Not in git repo or git failed | Run from git repo or use `--name` flag |
| `Warning: Could not read X` | State file corrupted | Will use defaults; optionally delete and re-init |

**Recovery:**
```bash
# Reinitialize state if corrupted
rm -rf .specify/state/
node .claude/skills/spec-mesh/scripts/state.cjs init
```

---

### scaffold-spec.cjs

Scaffolds new specs from templates.

**Exit Codes:**
- `0`: Success
- `1`: Invalid arguments or missing dependencies

**Common Errors:**

| Error Message | Cause | Solution |
|--------------|-------|----------|
| `ERROR: --kind, --id, --title are required` | Missing mandatory parameters | Provide all three: `--kind`, `--id`, `--title` |
| `ERROR: Invalid kind "X"` | Unknown spec kind | Use: `vision`, `domain`, `screen`, `feature`, `fix`, `test-scenario` |
| `ERROR: Feature requires --domain` | Feature without domain reference | Add `--domain S-DOMAIN-001` |
| `ERROR: Test-scenario requires --feature` | Test scenario without feature | Add `--feature <feature-dir-name>` |
| `ERROR: Template not found: X` | Missing template file | Check `.claude/skills/spec-mesh/templates/` exists |
| `ERROR: Feature directory not found: X` | Feature dir doesn't exist | Create feature spec first with add ワークフロー |

**Recovery:**
```bash
# Check templates exist
ls .claude/skills/spec-mesh/templates/

# Create feature first, then test-scenario
node .claude/skills/spec-mesh/scripts/scaffold-spec.cjs --kind feature --id S-XXX-001 --title "Feature" --domain S-DOMAIN-001
node .claude/skills/spec-mesh/scripts/scaffold-spec.cjs --kind test-scenario --id TS-XXX-001 --title "Tests" --feature sxxx001-feature
```

---

### spec-lint.cjs

Validates spec consistency across the project.

**Exit Codes:**
- `0`: Validation passed (may have warnings)
- `1`: Validation failed with errors

**Errors (Exit 1):**

| Error Message | Cause | Solution |
|--------------|-------|----------|
| `Missing Spec Type in X` | No `Spec Type:` in metadata | Add `Spec Type: [Vision|Domain|Screen|Feature|Fix]` |
| `Missing Spec ID(s) in X` | No `Spec ID:` in metadata | Add `Spec ID: S-XXX-001` |
| `Spec ID "X" is duplicated N times` | Same ID in multiple specs | Ensure each spec has unique ID |
| `Use Case ID "UC-X" is duplicated` | Same UC ID in multiple specs | Use unique UC IDs per feature |
| `Unknown master "M-X" referenced` | Master not in Domain spec | Add master to Domain spec first |
| `Unknown API "API-X" referenced` | API not in Domain spec | Add API to Domain spec first |
| `Unknown screen "SCR-X" referenced` | Screen not in Screen spec | Add screen to Screen spec first |
| `Feature ID "X" not in Domain Feature index` | Feature not registered | Update Domain spec's Feature Index table |
| `Feature index entry points to missing path` | Path in table is wrong | Fix path in Domain spec Feature Index |
| `Matrix references undefined X` | Matrix has invalid reference | Update Matrix or add to spec |
| `Superseded spec must reference successor` | No "Superseded by:" reference | Add `Superseded by: S-XXX-001` to spec |

**Warnings (Exit 0):**

| Warning Message | Cause | Recommendation |
|----------------|-------|----------------|
| `Unexpected Status "X"` | Status not in allowed list | Use: DRAFT, BACKLOG, IN REVIEW, APPROVED, IMPLEMENTING, COMPLETED, DEPRECATED, SUPERSEDED |
| `Master "M-X" not referenced by any feature` | Unused master defined | Consider removing or implement feature using it |
| `API "API-X" not referenced by any feature` | Unused API defined | Consider removing or implement feature using it |
| `Screen "SCR-X" not referenced by any feature` | Unused screen defined | Consider removing or implement feature using it |
| `Feature X is missing "User Stories" section` | Template section missing | Add `## 4. User Stories` section |
| `Feature X has no UC IDs defined` | No UC-XXX found | Add use cases with UC-XXX IDs |
| `Feature X is missing "Functional Requirements"` | Required for approved specs | Add `## 5. Functional Requirements` section |
| `Plan at X does not reference any IDs` | Plan doesn't link to spec | Add spec ID references to plan |
| `Tasks at X do not reference IDs` | Tasks don't link to spec/UC | Add spec/UC ID references to tasks |
| `Feature X modified N days before Domain update` | May be stale | Review feature against latest Domain spec |
| `No cross-reference.json found` | Matrix not created | Run design ワークフロー to create |

**Recovery:**
```bash
# Run lint to see all issues
node .claude/skills/spec-mesh/scripts/spec-lint.cjs

# Fix one category at a time:
# 1. Fix metadata (Spec Type, Spec ID)
# 2. Add missing definitions to Domain/Screen specs
# 3. Update Feature Index in Domain spec
# 4. Fix Matrix references
```

---

### validate-matrix.cjs

Validates that specs are reflected in the cross-reference matrix.

**Exit Codes:**
- `0`: All spec items in matrix
- `1`: Missing mappings found
- `2`: File/parse error

**Common Errors:**

| Error Message | Cause | Solution |
|--------------|-------|----------|
| `ERROR: File not found: X` | Spec file doesn't exist | Create Screen/Domain spec at expected path |
| `ERROR: Failed to parse Matrix JSON` | Invalid JSON syntax | Fix syntax in `cross-reference.json` |
| `Matrix file not found` | No matrix created | Run design ワークフロー or create manually |
| `Missing Screens in Matrix` | Screens in spec not in matrix | Add screen entries to matrix |
| `Missing Features in Matrix` | Features in spec not in matrix | Add feature entries to matrix |
| `Masters in Spec but not referenced` | Masters not in any matrix entry | Add to screen/feature mappings |
| `APIs in Spec but not referenced` | APIs not in any matrix entry | Add to screen/feature mappings |
| `APIs without permissions in Matrix` | API missing from permissions | Add to `permissions` object |

**Recovery:**
```bash
# Get suggested additions
node .claude/skills/spec-mesh/scripts/validate-matrix.cjs --fix > suggestions.json

# Review and merge suggestions into cross-reference.json
# Then regenerate markdown view
node .claude/skills/spec-mesh/scripts/generate-matrix-view.cjs
```

---

### branch.cjs

Creates and manages git branches for development.

**Exit Codes:**
- `0`: Success
- `1`: Invalid arguments

**Common Errors:**

| Error Message | Cause | Solution |
|--------------|-------|----------|
| `ERROR: --slug is required` | No slug provided | Add `--slug your-branch-name` |
| `Warning: Could not update branch state` | State file issue | Branch still created; fix state manually if needed |

**Notes:**
- If branch exists, checks it out instead of failing
- Git errors (not in repo, etc.) show git's own messages

**Recovery:**
```bash
# If state is out of sync with branches
node .claude/skills/spec-mesh/scripts/state.cjs branch --name feature/123-slug --set-step spec
```

---

### preserve-input.cjs

Preserves input files to spec directories.

**Exit Codes:**
- `0`: Success or skipped (empty input)
- `1`: Invalid arguments or missing files

**Common Errors:**

| Error Message | Cause | Solution |
|--------------|-------|----------|
| `ERROR: Type is required` | No type argument | Provide: `vision`, `add`, `fix`, or `design` |
| `ERROR: Unknown type 'X'` | Invalid type | Use one of: `vision`, `add`, `fix`, `design` |
| `ERROR: --feature is required for add type` | Feature not specified | Add `--feature <dir-name>` |
| `ERROR: --fix is required for fix type` | Fix not specified | Add `--fix <dir-name>` |
| `ERROR: Input file not found: X` | Input file doesn't exist | Ensure `.specify/input/` contains the input file |
| `NOTE: Input file appears to be empty` | Only template content | Not an error; no content to preserve |

**Recovery:**
```bash
# Reset input to template and fill in content
node .claude/skills/spec-mesh/scripts/reset-input.cjs vision

# Then preserve after adding content
node .claude/skills/spec-mesh/scripts/preserve-input.cjs vision
```

---

### reset-input.cjs

Resets input files to default templates.

**Exit Codes:**
- `0`: Success or help/list shown
- `1`: Invalid arguments or missing files

**Common Errors:**

| Error Message | Cause | Solution |
|--------------|-------|----------|
| `ERROR: Unknown input type 'X'` | Invalid type | Use: `vision`, `add`, `fix`, `all` |
| `ERROR: Template not found: X` | Template missing | Restore template from git or recreate |

**Recovery:**
```bash
# List available types
node .claude/skills/spec-mesh/scripts/reset-input.cjs --list

# Reset all inputs
node .claude/skills/spec-mesh/scripts/reset-input.cjs all
```

---

### generate-matrix-view.cjs

Generates Markdown view from matrix JSON.

**Exit Codes:**
- `0`: Success or help shown
- `1`: File/parse error

**Common Errors:**

| Error Message | Cause | Solution |
|--------------|-------|----------|
| `ERROR: Matrix file not found: X` | JSON file doesn't exist | Create `cross-reference.json` first |
| `ERROR: Failed to parse JSON` | Invalid JSON syntax | Fix syntax errors in JSON file |

**Recovery:**
```bash
# Validate JSON syntax
cat .specify/specs/overview/matrix/cross-reference.json | python -m json.tool

# Or create minimal matrix
echo '{"screens":{},"features":{},"permissions":{}}' > .specify/specs/overview/matrix/cross-reference.json

# Then generate view
node .claude/skills/spec-mesh/scripts/generate-matrix-view.cjs
```

---

## Troubleshooting Workflows

### Complete Reset

If state is corrupted or inconsistent:

```bash
# 1. Backup current state
cp -r .specify/state .specify/state.bak

# 2. Remove state
rm -rf .specify/state

# 3. Reinitialize
node .claude/skills/spec-mesh/scripts/state.cjs init

# 4. Verify
node .claude/skills/spec-mesh/scripts/state.cjs query --all
```

### Lint Failures in CI

```bash
# 1. Run lint locally
node .claude/skills/spec-mesh/scripts/spec-lint.cjs

# 2. Fix errors in order:
#    a. Metadata issues (Spec Type, Spec ID)
#    b. Domain/Screen references
#    c. Feature Index entries
#    d. Matrix alignment

# 3. Validate matrix separately
node .claude/skills/spec-mesh/scripts/validate-matrix.cjs

# 4. Regenerate matrix view if needed
node .claude/skills/spec-mesh/scripts/generate-matrix-view.cjs
```

### Branch State Out of Sync

```bash
# Check current state
node .claude/skills/spec-mesh/scripts/state.cjs query --all

# Update branch manually
node .claude/skills/spec-mesh/scripts/state.cjs branch \
  --name feature/123-my-feature \
  --set-step implement \
  --set-task-progress 3/10

# Remove stale branch from state
node .claude/skills/spec-mesh/scripts/state.cjs branch \
  --name feature/old-branch \
  --delete
```

---

## Quick Reference: All Exit Codes

| Script | Exit 0 | Exit 1 | Exit 2 | Exit 3 |
|--------|--------|--------|--------|--------|
| state.cjs | Success/Help | Invalid args | - | - |
| scaffold-spec.cjs | Success | Invalid args/deps | - | - |
| spec-lint.cjs | Passed (warnings OK) | Failed (errors) | - | - |
| validate-matrix.cjs | Passed | Missing mappings | File/parse error | - |
| branch.cjs | Success | Invalid args | - | - |
| preserve-input.cjs | Success/Skip | Invalid args/file | - | - |
| reset-input.cjs | Success/Help | Invalid args | - | - |
| generate-matrix-view.cjs | Success/Help | File/parse error | - | - |
