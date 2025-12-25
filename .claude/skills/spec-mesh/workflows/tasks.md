# Tasks Workflow

Break the approved plan into concrete, reviewable tasks.

## Prerequisites

- Approved plan.md must exist
- On Issue-linked branch

---

## Steps

### Step 1: Load Context

1. **Read Plan:**
   ```
   Read tool: .specify/specs/features/{id}/plan.md
   ```

2. **Verify plan is approved** (check state or ask user)

3. **Read Tasks Template:**
   ```
   Read tool: templates/tasks.md
   ```

### Step 2: Break Down Work

From plan's Work Breakdown section, create atomic tasks:

**Task format:**
```markdown
## Task 1: {タスク名}

**Related:** UC-001, FR-001
**Files:** src/components/Foo.tsx, src/api/bar.ts
**Acceptance Criteria:**
- [ ] 条件1
- [ ] 条件2
**Tests:**
- Unit: foo.test.ts
- E2E: uc-001.e2e.ts
```

**Guidelines:**
- Each task should be completable in 1-2 hours
- Include file paths to modify
- Link to Spec IDs (UC/FR)
- Define clear acceptance criteria
- Specify required tests

### Test Requirements by Task Type

| Task Type | Required Tests | Optional Tests |
|-----------|----------------|----------------|
| API endpoint | Unit tests for handler logic, Integration tests for endpoint | E2E tests |
| UI Component | Unit tests for component behavior, Snapshot tests | Integration tests |
| Data/Schema | Migration tests, Unit tests for validators | - |
| Business Logic | Unit tests for all branches, Edge case tests | Integration tests |
| Bug Fix | Regression test (proves fix), Unit test for edge case | E2E test |

**Test Checklist per Task:**
- [ ] Unit tests cover the main functionality
- [ ] Unit tests cover edge cases and error handling
- [ ] Tests are linked to Spec IDs (@spec, @uc, @fr annotations)
- [ ] Integration tests if the task involves multiple components
- [ ] E2E tests if the task implements a complete UC flow

### Step 3: Save Tasks

Save to feature directory:
```
.specify/specs/features/{id}/tasks.md
```

### Step 4: Update TodoWrite

Create todos for all tasks:
```
- Task 1: {name}
- Task 2: {name}
- ...
```

### Step 5: Summary

Display:
```
=== Tasks 作成完了 ===

Feature: {Feature名}
Tasks: .specify/specs/features/{id}/tasks.md

タスク一覧:
1. [ ] {Task 1}
2. [ ] {Task 2}
3. [ ] {Task 3}
...

合計: {N} タスク

次のステップ: implement ワークフロー で実装を開始
```

### Step 6: Update State

```bash
node .claude/skills/spec-mesh/scripts/state.cjs branch --set-step tasks --set-task-progress 0/{total}
```

---

## Self-Check

- [ ] Plan を読み込んだか
- [ ] Plan が承認済みか確認したか
- [ ] タスクを atomic に分割したか
- [ ] 各タスクに Spec ID をリンクしたか
- [ ] tasks.md を保存したか
- [ ] TodoWrite でタスクを登録したか

---

## Next Steps

**[HUMAN_CHECKPOINT]** タスク分割の内容を確認してから実装を開始してください。

| Condition | Command | Description |
|-----------|---------|-------------|
| タスク確認後 | implement ワークフロー | 実装開始 |
