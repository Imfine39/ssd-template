# Implement Workflow

Execute tasks from the plan with tests and adherence to spec.

## Prerequisites

- tasks.md must exist
- On Issue-linked branch

---

## Steps

### Step 1: Verify Context

1. **Check branch:**
   ```bash
   git branch --show-current
   ```
   - Must be `feature/*` or `fix/*`

2. **Read all context:**
   - Spec: `.specify/specs/features/{id}/spec.md`
   - Plan: `.specify/specs/features/{id}/plan.md`
   - Tasks: `.specify/specs/features/{id}/tasks.md`

3. **Confirm Spec IDs** are clear (S-*, UC-*, FR-*)

### Step 2: Load Tasks

1. Parse tasks.md for pending tasks
2. Present task list
3. Confirm implementation order with user

### Step 3: For Each Task

**3.1 Update progress:**
```bash
node .claude/skills/spec-mesh/scripts/state.cjs branch --set-task-progress {completed}/{total}
```

**3.2 Read task requirements:**
- Identify related UC/FR/SC IDs
- Understand acceptance criteria

**3.3 Write tests first** (fail-first):
```typescript
/**
 * @spec S-XXX-001
 * @uc UC-001
 */
describe('Feature behavior', () => {
  it('should do X', () => {
    // Test implementation
  });
});
```

**3.4 Implement code:**
- Small, focused changes
- Follow existing patterns
- Reference Spec IDs in comments where helpful

**3.5 Run tests:**
- All tests should pass
- If fail, classify:
  | Classification | Action |
  |----------------|--------|
  | Spec bug | Need feedback |
  | Test bug | Fix test |
  | Implementation bug | Fix code |
  | Environment bug | Fix config |

**3.6 Check for feedback needs:**
- Technical constraint not in spec?
- Ambiguity that needed decision?
- Deviation from spec required?
- Design decision made during implementation?

**Feedback Approval Flow:**
1. If any of the above apply, **stop and ask human permission**
2. Describe the issue and proposed feedback
3. On approval, use feedback ワークフロー to record:
   ```
   feedback ワークフロー
   ```
4. The feedback workflow will guide you to add Implementation Notes to the appropriate Spec
5. **Never** record feedback without explicit human approval

See `workflows/feedback.md` for detailed feedback recording process.

### Step 4: After All Tasks

1. **Run full test suite:**
   ```bash
   npm test
   ```

2. **Run lint:**
   ```bash
   npm run lint
   node .claude/skills/spec-mesh/scripts/spec-lint.cjs
   ```

3. **Fix any issues**

### Step 5: Summary

Display:
```
=== 実装完了 ===

Feature: {Feature名}
Tasks: {completed}/{total} 完了

Test Results:
- Passed: {N}
- Failed: {N}
- Skipped: {N}

Feedback recorded: {Y/N}

次のステップ: pr ワークフロー で PR 作成
```

### Step 6: Update State

```bash
node .claude/skills/spec-mesh/scripts/state.cjs branch --set-step implement --set-task-progress {total}/{total}
```

---

## Self-Check

- [ ] Spec, Plan, Tasks を読み込んだか
- [ ] テストを先に書いたか（fail-first）
- [ ] 全タスクを実装したか
- [ ] テストが全て pass したか
- [ ] lint を実行したか
- [ ] Feedback が必要な場合、人間に確認したか

---

## Next Steps

**[HUMAN_CHECKPOINT]** 実装結果とテスト結果を確認してから次のステップに進んでください。

| Condition | Command | Description |
|-----------|---------|-------------|
| 実装完了後 | pr ワークフロー | PR 作成 |
| Spec へのフィードバックがある場合 | feedback ワークフロー | Spec へのフィードバック記録 |
