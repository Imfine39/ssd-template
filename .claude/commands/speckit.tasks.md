---
description: Break the plan into tasks using the tasks template (Step 3).
handoffs:
  - label: Start Implementation
    agent: speckit.implement
    prompt: Implement the tasks
    send: true
---

## Purpose

Step 3 of the 6-step workflow. Breaks down the plan into concrete, reviewable tasks.
**Human confirms tasks before proceeding to implementation.**

## Execution Protocol (MUST FOLLOW)

**Before starting:**

1. Use **TodoWrite** to create todos for all main Steps:
   - "Step 1: Load context"
   - "Step 2: Create tasks by UC"
   - "Step 3: Include test tasks"
   - "Step 4: Include tool usage"
   - "Step 5: Keep tasks small"
   - "Step 6: Save tasks"
   - "Step 7: Update branch state"

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

1. **Load context**:
   - Spec from feature directory
   - Plan (`plan.md`)
   - Tasks template (`.specify/templates/tasks-template.md`)

2. **Create tasks by UC**:
   - Group by User Story (UC-XXX)
   - Assign priority (P0/P1/P2)
   - Include Spec/UC references and primary file paths
   - Format: `[T-XXX] [P?] [UC-XXX] [S-XXX] Description (file path)`

3. **Include test tasks**:
   - Test tasks before or alongside implementation (fail-first)
   - Spec annotations in test files

4. **Include tool usage**:
   - Serena for codebase exploration
   - context7 for library documentation

5. **Keep tasks small**:
   - Independently reviewable
   - Avoid cross-story coupling

6. **Save tasks**:
   - Write to `tasks.md` in the feature directory

7. **Update branch state**:
   ```bash
   node .specify/scripts/state.cjs branch --set-step implement
   ```

#### Self-Check (All Steps)

- [ ] Read tool で Spec, Plan, Tasks template を読み込んだか
- [ ] UC ごとにタスクを分類したか
- [ ] 各タスクに優先度（P0/P1/P2）を割り当てたか
- [ ] テストタスクを含めたか
- [ ] Write tool で tasks.md を保存したか
- [ ] state.cjs を実行したか
- [ ] 全ての Step が完了し、todo を全て `completed` にマークしたか

## Output

- Tasks file path
- Task count by phase/UC
- Next step: `/speckit.implement`

## Human Checkpoint

Human confirms tasks are appropriate before implementation begins.
