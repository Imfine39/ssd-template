# Parallel Development Guide

This guide provides best practices for teams working on multiple features
simultaneously within the spec-driven development workflow.

---

## Scope

This guide covers:
- Feature dependencies and coordination
- Domain modification protocol
- Merge strategies and conflict resolution
- Team communication patterns

**Related guides:**
- `error-recovery.md` - Individual workflow errors and recovery procedures
- `scripts-errors.md` - Script error messages and troubleshooting
- `id-naming.md` - ID conventions for specs, masters, APIs, etc.

---

## 1. Overview

When multiple features are developed in parallel, several challenges arise:

- **Domain conflicts**: Multiple features may need to modify shared masters/APIs.
- **Feature dependencies**: One feature may depend on another being completed first.
- **Merge order**: The order in which PRs are merged affects the final state.
- **Spec drift**: Specs may become inconsistent as parallel changes are made.

This guide provides strategies to address these challenges.

---

## 2. Feature Dependencies

### 2.1 Declaring Dependencies

When creating a Feature spec, explicitly declare dependencies on other features
in the "Domain Model and Dependencies" section:

```markdown
## 3. Domain Model and Dependencies

### 3.1 Domain Dependencies

- Masters: `M-CLIENTS`, `M-ORDERS`
- APIs: `API-ORDERS-LIST`, `API-ORDERS-CREATE`

### 3.2 Feature Dependencies

| Dependency | Type | Description |
|------------|------|-------------|
| S-AUTH-001 | Hard | User authentication must be implemented first |
| S-CLIENTS-001 | Soft | Client management enhances but isn't required |
```

**Dependency types**:

- **Hard**: Cannot start implementation until dependency is completed.
- **Soft**: Can proceed independently, but integration requires dependency.
- **Parallel**: Can be developed simultaneously with coordination.

### 2.2 Visualizing Dependencies

Create a simple dependency graph in the Domain spec or a separate document:

```
S-AUTH-001 ──────────────────────────────┐
                                         │
S-CLIENTS-001 ──► S-ORDERS-001 ──► S-DASHBOARD-001
                       │
S-PRODUCTS-001 ────────┘
```

---

## 3. Domain Modification Protocol

When a feature needs to modify the Domain spec (add/change masters or APIs),
follow this protocol to avoid conflicts:

### 3.1 Announce Intent

Before starting work that will modify the Domain:

1. **Check for conflicts**:
   - Review open Issues and PRs that mention the same masters/APIs.
   - Check the Feature index for features in `Implementing` status.

2. **Announce in the Issue**:
   ```markdown
   ## Domain Impact

   This feature will modify the Domain spec:
   - Add field `priority` to `M-ORDERS`
   - Add new API `API-ORDERS-PRIORITY-UPDATE`

   @team Please flag if this conflicts with your current work.
   ```

3. **Wait for acknowledgment** (24 hours recommended) before proceeding.

### 3.2 Domain-First Workflow

When Domain changes are needed:

1. **Create Domain PR first**:
   - Branch: `spec/<issue>-domain-<change>`
   - Contains ONLY Domain spec changes.
   - No implementation code.

2. **Get Domain PR approved and merged** before proceeding with Feature.

3. **Rebase Feature branch** after Domain merge:
   ```bash
   git fetch origin main
   git rebase origin/main
   ```

4. **Update Feature spec** to reference new Domain IDs.

5. **Continue with Feature implementation**.

### 3.3 Conflict Resolution

If two features need conflicting Domain changes:

1. **Identify the conflict** early through announcements.

2. **Schedule a sync meeting** with both feature owners.

3. **Determine resolution strategy**:
   - **Combine**: Merge both changes into a single Domain PR.
   - **Sequence**: Agree on which change goes first.
   - **Redesign**: Find an approach that avoids the conflict.

4. **Document the decision** in both Issues.

---

## 4. Parallel Feature Development

### 4.1 Independent Features

For features that don't share Domain modifications:

- Develop freely in parallel.
- Merge in any order.
- No special coordination needed.

### 4.2 Related Features (Same Domain Area)

For features that touch the same domain area but don't conflict:

1. **Assign a domain owner** who coordinates changes.

2. **Use feature flags** for gradual rollout:
   ```typescript
   if (featureFlags.isEnabled('new-order-flow')) {
     // new implementation
   } else {
     // existing implementation
   }
   ```

3. **Communicate merge order** in advance.

### 4.3 Dependent Features

For features with hard dependencies:

1. **Implement in dependency order**.

2. **Use interface contracts** to allow parallel work:
   - Define API contracts in Domain.
   - Dependent feature can mock the dependency.
   - Integration happens after dependency is merged.

3. **Consider feature branches off feature branches**:
   ```
   main
   └── feature/123-auth
       └── feature/124-orders (depends on auth)
   ```
   Note: This requires careful rebasing when the base feature changes.

---

## 5. Merge Strategies

### 5.1 Recommended Merge Order

1. **Domain changes** (if any)
2. **Infrastructure/shared code** (types, utilities)
3. **Dependencies** (in dependency order)
4. **Independent features** (any order)
5. **Dependent features** (after dependencies)

### 5.2 Handling Merge Conflicts

When a PR has conflicts with main:

1. **Rebase preferred** for cleaner history:
   ```bash
   git fetch origin main
   git rebase origin/main
   # Resolve conflicts
   git push --force-with-lease
   ```

2. **For spec file conflicts**:
   - Carefully review both versions.
   - Ensure no ID duplicates are introduced.
   - Run `node .claude/skills/spec-mesh/scripts/spec-lint.cjs` after resolution.

3. **For code conflicts**:
   - Understand both changes before resolving.
   - Re-run all tests after resolution.

### 5.3 Big Bang vs. Incremental

**Incremental (Recommended)**:
- Merge features as they complete.
- Smaller PRs, easier reviews.
- Faster feedback.

**Big Bang (When Necessary)**:
- All related features merge together.
- Use when features are tightly coupled.
- Requires coordination and potentially a release branch.

---

## 6. Communication Patterns

### 6.1 Daily Standups

Include in standups:
- Which specs are being modified.
- Any Domain changes planned.
- Any blockers related to dependencies.

### 6.2 Spec Sync Meetings

For complex parallel development:
- Weekly or bi-weekly sync.
- Review Feature index status.
- Discuss upcoming Domain changes.
- Resolve conflicts proactively.

### 6.3 Async Communication

Use Issue comments and PR descriptions to communicate:
- Dependency status: "Blocked on #123"
- Coordination needs: "Please merge #123 before this PR"
- Conflict alerts: "This may conflict with #124"

---

## 7. Tooling Support

### 7.1 Feature Index as Coordination Tool

Keep the Domain's Feature index up to date:

```markdown
| Feature ID | Title | Path | Status | Owner | Depends On |
|------------|-------|------|--------|-------|------------|
| S-AUTH-001 | Authentication | .specify/specs/auth/spec.md | Implementing | @alice | - |
| S-ORDERS-001 | Order Management | .specify/specs/orders/spec.md | Approved | @bob | S-AUTH-001 |
| S-DASHBOARD-001 | Dashboard | .specify/specs/dashboard/spec.md | Draft | @carol | S-ORDERS-001 |
```

#### 7.1.1 Feature Index Update Procedure

When working in parallel, follow this procedure to update the Feature Index:

**When to update**:
1. **Creating new Feature Spec**: Add entry with `Draft` status
2. **Spec approval**: Update status to `Approved`
3. **Starting implementation**: Update status to `Implementing`
4. **PR merged**: Update status to `Implemented`

**Update procedure**:

1. **Before updating**: Check for concurrent changes
   ```bash
   git fetch origin main
   git log origin/main -- .specify/specs/{project}/overview/domain/spec.md
   ```

2. **If no conflicts**: Update directly in your feature branch
   ```markdown
   # In Domain Spec's Feature Index section:
   | S-MYFEATURE-001 | My Feature | .specify/specs/{project}/features/my-feature/spec.md | Draft | @you | S-AUTH-001 |
   ```

3. **If conflicts likely**: Create a separate spec branch
   ```bash
   git checkout -b spec/<issue>-update-feature-index
   # Make minimal change to Feature Index only
   git commit -m "chore: Add S-MYFEATURE-001 to Feature Index"
   git push && gh pr create
   ```

4. **After merge**: Rebase your feature branch
   ```bash
   git fetch origin main
   git rebase origin/main
   ```

**Best practices**:
- Update Feature Index as early as possible (at Draft stage)
- Include `Depends On` column when declaring dependencies
- Use `Owner` column for parallel work coordination
- Keep status current to prevent conflicts

### 7.2 Labels for Coordination

Use GitHub labels to track coordination needs:
- `domain-change`: PR modifies Domain spec.
- `has-dependency`: Feature depends on another.
- `coordination-needed`: Requires sync with other work.

### 7.3 Branch Naming for Visibility

Use descriptive branch names:
- `feature/123-orders-basic` - Independent feature
- `spec/124-domain-add-priority` - Domain change
- `feature/125-orders-priority-depends-124` - Dependent feature

---

## 8. Anti-Patterns to Avoid

### 8.1 Long-Running Feature Branches

**Problem**: Feature branch diverges significantly from main.

**Solution**:
- Keep features small.
- Merge to main frequently.
- Rebase regularly.

### 8.2 Silent Domain Changes

**Problem**: Modifying Domain without announcement.

**Solution**:
- Always announce in Issue.
- Get acknowledgment before proceeding.

### 8.3 Dependency Cycles

**Problem**: Feature A depends on B, B depends on A.

**Solution**:
- Identify shared requirements.
- Extract to a third feature or Domain change.
- Break the cycle before implementation.

### 8.4 Ignoring Spec Lint

**Problem**: Merging despite spec-lint warnings.

**Solution**:
- Treat spec-lint errors as blockers.
- Address warnings before merge.
- Investigate freshness warnings.

---

## 9. Checklist for Parallel Development

Before starting a new feature:

- [ ] Check Feature index for related work in progress.
- [ ] Identify if Domain changes are needed.
- [ ] Declare dependencies in Feature spec.
- [ ] Announce in Issue if Domain changes are planned.

Before creating a PR:

- [ ] Rebase on latest main.
- [ ] Run spec-lint and fix any issues.
- [ ] Note any coordination needs in PR description.
- [ ] Tag related PRs/Issues.

Before merging:

- [ ] All dependencies are merged.
- [ ] No unresolved conflicts with other PRs.
- [ ] Feature index is updated.
- [ ] Team is aware of the merge.
