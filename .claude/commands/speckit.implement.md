---
description: Implement tasks from the plan with tests and adherence to spec (Step 4).
handoffs:
  - label: Create PR
    agent: speckit.pr
    prompt: Verify integrity and create PR
    send: true
  - label: Record Feedback
    agent: speckit.feedback
    prompt: Record implementation discoveries to spec
    send: true
---

## Purpose

Step 4 of the 6-step workflow. Implements tasks from the plan while:

- Adhering strictly to the spec
- Writing tests first or alongside code
- Requesting human permission when spec feedback is needed

## Execution Protocol (MUST FOLLOW)

**Before starting:**

1. Use **TodoWrite** to create todos for all main Steps:
   - "Step 1: Verify context"
   - "Step 2: Load tasks"
   - "Step 3: Implement each task"
   - "Step 4: After all tasks - run tests and lint"
   - "Step 5: Recommend next step"

**During execution:**

2. Before each Step: Mark the corresponding todo as `in_progress`
3. After each Step:
   - Run the **Self-Check** at the end of that Step
   - Only if Self-Check passes: Mark todo as `completed`
   - Output: `✓ Step N 完了: [1-line summary]`

**Rules:**

- **DO NOT** skip any Step
- **DO NOT** mark a Step as completed before its Self-Check passes
- If a Self-Check fails: Fix the issue before proceeding

## Steps

1. **Verify context**:
   - Confirm current branch is Issue-linked (feature/_, fix/_)
   - Read: spec, plan, tasks from the feature directory
   - Ensure Spec IDs (S-_, UC-_, FR-\*) are clear

2. **Load tasks**:
   - Parse tasks.md for pending tasks
   - Present task list and confirm implementation order

#### Self-Check (Steps 1-2)

- [ ] Read tool で Spec, Plan, Tasks を読み込んだか
- [ ] ブランチが Issue にリンクされているか確認したか

3. **For each task**:

   **Update task progress**:

   ```bash
   node .specify/scripts/state.cjs branch --set-task-progress <completed>/<total>
   ```

   a) **Read task requirements**:
   - Identify related UC/FR/SC IDs
   - Understand acceptance criteria

   b) **Write tests first** (fail-first when possible):
   - Create test file with spec annotations:
     ```typescript
     /**
      * @spec S-XXX-001
      * @uc UC-001
      */
     ```
   - Tests should fail initially (red phase)

   c) **Implement code**:
   - Small, focused changes
   - Reference spec IDs in comments where helpful
   - Follow existing code patterns (use Serena to explore)

   d) **Run tests**:
   - All tests should pass (green phase)
   - If test fails, classify:
     - Spec bug → Need feedback
     - Test bug → Fix test
     - Implementation bug → Fix code
     - Environment bug → Fix config

   e) **Check for feedback needs**:
   - Did you discover a technical constraint not in spec?
   - Did you find an ambiguity that needed a decision?
   - Did you deviate from spec for a valid reason?

   **If YES to any**:
   - **STOP and ask human for permission**:

     ```
     I discovered something that may need to be recorded in the spec:
     - Type: [constraint/discovery/decision/deviation]
     - Description: [what was found]
     - Affected: [UC-XXX, FR-XXX]

     Should I record this feedback to the spec? [Yes/No]
     ```

   - If human approves → Run `/speckit.feedback` with the details
   - If human declines → Continue without recording

#### Self-Check (Step 3 - 各タスクごと)

- [ ] テストを先に書いたか（fail-first）
- [ ] コードを実装したか
- [ ] テストが通ったか
- [ ] state.cjs でタスク進捗を更新したか
- [ ] Feedback が必要な場合、人間に確認したか

4. **After all tasks**:
   - Run full test suite
   - Run spec-lint: `node .specify/scripts/spec-lint.cjs`
   - Summarize:
     - Tasks completed
     - Tests added/modified
     - Feedback recorded (if any)
     - Any remaining issues

5. **Recommend next step**:
   - If all tasks done and tests pass → Suggest `/speckit.pr`
   - If tasks remain → Continue with next task
   - If blocked → Suggest `/speckit.clarify`

#### Self-Check (Steps 4-5)

- [ ] テストスイートを実行したか
- [ ] spec-lint を実行したか
- [ ] サマリーを出力したか
- [ ] 次のステップを提示したか
- [ ] 全ての Step が完了し、todo を全て `completed` にマークしたか

## Output

- Completed tasks list
- Test results summary
- Code changes summary
- Feedback recorded (if any)
- Next step recommendation

## Human Checkpoints

**Feedback Permission**: When implementation discovers something that should be recorded in spec, AI MUST ask human for permission before running /speckit.feedback.

This ensures humans maintain control over spec changes.
