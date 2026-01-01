# Git Workflow Rules

Git operations and version control rules for SSD workflow.

---

## Branch Strategy

### Naming Convention

| Type | Pattern | Example |
|------|---------|---------|
| Feature | `feature/{issue}-{slug}` | `feature/123-user-auth` |
| Fix | `fix/{issue}-{slug}` | `fix/456-login-error` |
| Spec | `spec/{issue}-{slug}` | `spec/789-vision-update` |

### Rules
- All branches MUST be linked to a GitHub Issue
- Use `branch.cjs` script for consistent naming:
  ```bash
  node .claude/skills/spec-mesh/scripts/branch.cjs \
    --type feature --slug user-auth --issue 123
  ```

---

## Commit Rules

### Message Format
```
<type>: <short description>

<body - optional>

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `refactor`: Code refactoring
- `test`: Test additions/changes
- `chore`: Maintenance tasks

---

## Pull Request Rules

### Prerequisites
- All tests pass
- Lint checks pass
- Spec is approved (HUMAN_CHECKPOINT passed)
- Plan is approved (if applicable)

### PR Content
- Reference Issue number
- Reference Spec ID
- Summary of changes
- Test plan

### Format
```markdown
## Summary
<1-3 bullet points>

## Test plan
- [ ] Test item 1
- [ ] Test item 2

Closes #123
Related Spec: S-AUTH-001

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

---

## Merge Rules

### Requirements
- **No direct push to `main`** - All changes via PR
- Review approval required
- All CI checks pass

### Strategy
- **Squash merge** for clean history
- Delete branch after merge

---

## Protected Operations

The following operations require HUMAN_CHECKPOINT:
- `git push` (to remote)
- `git merge` (to main/master)
- `git branch -d` (delete branch)
- Force push (strongly discouraged)

See [quality-gates.md](quality-gates.md) for HUMAN_CHECKPOINT details.
