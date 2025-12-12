# Error Recovery Guide

This guide provides procedures for recovering from common errors and exceptions
in the spec-driven development workflow.

---

## 1. Spec Errors

### 1.1 Spec Contains Incorrect Requirements

**Symptoms**: Implementation reveals that the spec describes impossible or
incorrect behavior.

**Recovery steps**:

1. **Stop implementation** - Do not proceed with incorrect requirements.
2. **Create an Issue** - Document the problem:
   - Title: `Spec correction: S-XXX-001 - [brief description]`
   - Body: Describe what's wrong, what the correct behavior should be, and
     the impact on existing work.
3. **Create a spec branch** - `spec/<issue>-fix-<spec-id>`
4. **Update the spec**:
   - Run `/speckit.spec` to correct the specification.
   - Update the Changelog section with the correction.
   - Update affected UC, FR, and SC.
5. **Update dependent artifacts**:
   - Update Plan if technical approach changes.
   - Update Tasks if work breakdown changes.
   - Update tests to match corrected spec.
6. **Resume implementation** after spec correction is approved.

### 1.2 Spec Is Ambiguous or Incomplete

**Symptoms**: Multiple valid interpretations exist; implementation cannot
proceed confidently.

**Recovery steps**:

1. **Do not guess** - This is a constitutional rule.
2. **Run `/speckit.clarify`** - Generate clarification questions.
3. **Create an Issue** (if needed) - For significant ambiguities:
   - Title: `Clarification needed: S-XXX-001 - [topic]`
   - List the ambiguous points and proposed interpretations.
4. **Wait for resolution** - Get stakeholder input before proceeding.
5. **Update spec** - Document the clarified requirements.

### 1.3 Spec Conflicts with Another Spec

**Symptoms**: Two specs define contradictory behavior for the same scenario.

**Recovery steps**:

1. **Identify the conflict** - Document both spec IDs and the conflicting statements.
2. **Determine precedence**:
   - Domain spec takes precedence over Feature specs.
   - Later-approved specs generally take precedence.
   - Business-critical specs take precedence over convenience features.
3. **Create an Issue** - Title: `Spec conflict: S-XXX vs S-YYY`
4. **Resolve in the correct spec**:
   - If Domain is wrong, fix Domain first, then update Features.
   - If Feature is wrong, update the Feature spec.
5. **Update Feature index** if status changes.

---

## 2. Plan/Tasks Errors

### 2.1 Plan Is Technically Infeasible

**Symptoms**: The planned approach cannot be implemented due to technical
constraints discovered during implementation.

**Recovery steps**:

1. **Document the constraint** - Add to the spec's Implementation Notes section.
2. **Assess impact**:
   - Can the spec still be achieved with a different approach?
   - Does the spec need to be modified?
3. **If approach can change**:
   - Update `plan.md` with the new approach.
   - Update `tasks.md` if work breakdown changes.
   - Note the change in PR description.
4. **If spec must change**:
   - Follow the "Spec Contains Incorrect Requirements" procedure above.

### 2.2 Tasks Are Outdated After Spec Change

**Symptoms**: Spec was updated but tasks still reflect the old requirements.

**Recovery steps**:

1. **Re-run `/speckit.tasks`** to regenerate task list.
2. **Review generated tasks** against new spec requirements.
3. **Update task status**:
   - Mark obsolete tasks as cancelled (remove from list).
   - Mark new tasks as pending.
   - Update in-progress tasks if scope changed.

---

## 3. Implementation Errors

### 3.1 Implementation Diverges from Spec

**Symptoms**: Code review reveals that implementation doesn't match spec.

**Recovery steps**:

1. **Determine the cause**:
   - Was the spec misunderstood? → Clarify and fix implementation.
   - Was the spec impossible to implement exactly? → Update spec and implementation.
   - Was it an oversight? → Fix implementation.
2. **Fix in the correct order**:
   - If spec is correct: Fix implementation, then tests.
   - If spec is wrong: Fix spec first, then implementation, then tests.
3. **Document in PR** - Explain the divergence and resolution.

### 3.2 Tests Fail After Implementation

**Symptoms**: Tests that were passing now fail, or new tests don't pass.

**Recovery steps**:

1. **Classify the failure** (per constitution VII):
   - **Spec bug**: Spec describes wrong behavior.
   - **Test bug**: Test encodes wrong expectations.
   - **Implementation bug**: Code doesn't match spec.
   - **Environment bug**: Test data or config is wrong.
2. **Fix in the correct order**:
   - Spec bug → Fix spec → Fix test → Fix implementation
   - Test bug → Fix test (with documented reason)
   - Implementation bug → Fix implementation
   - Environment bug → Fix environment/config
3. **Never** just change tests to make them pass without understanding why.

---

## 4. PR/Review Errors

### 4.1 PR Is Rejected

**Symptoms**: PR receives blocking feedback that requires significant changes.

**Recovery steps**:

1. **Categorize the feedback**:
   - **Spec-level issues**: Requirements are wrong or incomplete.
   - **Design-level issues**: Technical approach is flawed.
   - **Implementation-level issues**: Code quality or bugs.
2. **For spec-level issues**:
   - Go back to spec phase.
   - Create new Issue if scope significantly changes.
   - Follow "Spec Contains Incorrect Requirements" procedure.
3. **For design-level issues**:
   - Update `plan.md` with revised approach.
   - May need to update `tasks.md`.
   - Revise implementation.
4. **For implementation-level issues**:
   - Fix code and tests.
   - Push additional commits.
   - Request re-review.

### 4.2 Merge Conflicts

**Symptoms**: PR cannot be merged due to conflicts with main.

**Recovery steps**:

1. **Rebase or merge from main**:
   ```bash
   git fetch origin main
   git rebase origin/main  # or git merge origin/main
   ```
2. **Resolve conflicts carefully**:
   - Preserve both your changes and main's changes where appropriate.
   - Re-run tests after resolution.
3. **If spec files conflict**:
   - Review both versions carefully.
   - Ensure IDs remain unique.
   - Update Feature index if needed.
4. **Force-push** (for rebase) or **push** (for merge) after resolution.

---

## 5. Workflow Errors

### 5.1 Wrong Branch or Missing Issue

**Symptoms**: Work was done on wrong branch, or without an Issue.

**Recovery steps**:

1. **If on wrong branch**:
   ```bash
   # Save your work
   git stash
   # Create correct branch
   git checkout -b feature/<issue>-<slug>
   # Apply your work
   git stash pop
   ```
2. **If missing Issue**:
   - Create the Issue now (it's never too late).
   - Update branch name if possible.
   - Reference Issue in PR.
3. **If work was committed to main** (constitutional violation):
   - **Do not force-push main**.
   - Create a revert commit if the change is problematic.
   - Create Issue and proper branch for follow-up work.

### 5.2 Spec Lint Fails in CI

**Symptoms**: CI fails on spec-lint check.

**Recovery steps**:

1. **Run locally**: `node .specify/scripts/spec-lint.js`
2. **Fix reported errors**:
   - Missing Spec Type or ID → Add to spec header.
   - Duplicate IDs → Rename one of the duplicates.
   - Missing Domain → Create Domain spec first.
   - Unknown master/API → Add to Domain or fix typo.
   - Missing Feature index entry → Add to Domain table.
3. **Commit fixes** and push.

---

## 6. Emergency Situations

### 6.1 Production Incident Requiring Immediate Fix

**Recovery steps**:

1. **Create hotfix branch**: `hotfix/<issue>-<brief-description>`
2. **Implement minimal fix** - Only what's needed to resolve the incident.
3. **Create PR** with `[HOTFIX]` prefix in title.
4. **Get expedited review** - Tag on-call reviewers.
5. **Merge and deploy** after approval.
6. **Post-incident** (within 48 hours):
   - Create or update spec to reflect the fix.
   - Add proper tests if hotfix lacked them.
   - Document in incident report.

### 6.2 Spec System Itself Is Broken

**Symptoms**: spec-lint.js crashes, templates are corrupted, etc.

**Recovery steps**:

1. **Check template repo** - Compare with upstream template.
2. **Restore from git history**:
   ```bash
   git log --oneline .specify/
   git checkout <commit> -- .specify/scripts/spec-lint.js
   ```
3. **Report issue** - If it's a template bug, report to template maintainers.

---

## Quick Reference

| Situation | First Step |
|-----------|------------|
| Spec is wrong | Create Issue, then fix spec |
| Spec is ambiguous | Run `/speckit.clarify` |
| Plan is infeasible | Document constraint, update plan |
| Tests fail | Classify cause (spec/test/impl/env) |
| PR rejected | Categorize feedback, fix at correct level |
| Wrong branch | Stash, create correct branch, apply |
| Hotfix needed | Create hotfix branch, fix, document later |

**Key principle**: Always fix problems at the correct level. Never patch a
lower level to hide a problem at a higher level.
