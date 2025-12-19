---
description: Create implementation plan from spec. Human reviews before proceeding to tasks.
handoffs:
  - label: Continue to Tasks
    agent: speckit.tasks
    prompt: Create tasks from the approved plan
    send: true
  - label: Clarify Requirements
    agent: speckit.clarify
    prompt: Clarify unclear points in the plan
    send: true
---

## Purpose

Create an implementation plan from an approved Spec.
**Human must review and approve the plan before proceeding to tasks.**

This is a **base command** that can be:

- Called automatically after `/speckit.add`, `/speckit.fix`, `/speckit.issue`
- Called directly to restart from this step

## Execution Protocol (MUST FOLLOW)

**Before starting:**

1. Use **TodoWrite** to create todos for all main Steps:
   - "Step 1: Load context"
   - "Step 2: Fill required sections"
   - "Step 3: Use tools for codebase exploration"
   - "Step 4: Save plan"
   - "Step 5: Run lint"
   - "Step 6: Request human review"
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
   - Feature Spec + Domain Spec
   - Constitution (`.specify/memory/constitution.md`)
   - Plan template (`.specify/templates/plan-template.md`)

2. **Fill required sections**:
   - Summary (Spec IDs, target UCs)
   - In/Out of scope
   - High-Level Design, data/schema, APIs
   - Dependencies (other Features, external systems)
   - Testing strategy (fail-first approach)
   - Observability/operations
   - Risks/trade-offs
   - Open questions/approvals needed
   - Rollout/migration plan
   - Constitution Check (Spec/UC IDs → tasks/PR/tests mapping)
   - Work breakdown (high-level)

3. **Use tools**:
   - Serena: explore codebase for paths/structure
   - context7: library documentation if needed

#### Self-Check (Steps 1-3)

- [ ] Read tool で Feature Spec と Domain Spec を読み込んだか
- [ ] Plan template を読み込んだか
- [ ] 必要に応じてコードベースを探索したか

4. **Save plan**:
   - Save to `plan.md` in the Feature directory
   - Keep IDs and headings; remove unused sections

5. **Run lint**:
   - Execute: `node .specify/scripts/spec-lint.cjs`

#### Self-Check (Steps 4-5)

- [ ] Write tool で plan.md を保存したか
- [ ] spec-lint.cjs を実行したか
- [ ] lint エラーがあれば修正したか

6. **Request human review**:
   - Show plan summary
   - List any open questions or risks
   - **Wait for human approval before proceeding to tasks**

7. **Update branch state** (on approval):
   ```bash
   node .specify/scripts/state.cjs branch --set-step plan_review
   ```
   After human approval:
   ```bash
   node .specify/scripts/state.cjs branch --set-step tasks
   ```

#### Self-Check (Steps 6-7)

- [ ] Plan サマリーを出力したか
- [ ] Open Questions を提示したか
- [ ] 人間の承認を待ったか
- [ ] 承認後に state.cjs を実行したか
- [ ] 全ての Step が完了し、todo を全て `completed` にマークしたか

## Output

- Plan file path
- Summary of design decisions
- Open questions (if any)
- Next step: `/speckit.tasks` (after approval)

## Human Checkpoint

Human MUST review and approve the plan before tasks are created.
If changes are needed, update the plan and re-review.

## Example

```
AI: Plan を作成しました: .specify/specs/s-auth-001/plan.md

    設計概要:
    - JWT認証 + Refresh Token方式
    - Redis セッションストア
    - Rate limiting 実装

    Open Questions:
    - Token有効期限: 15分 or 30分？

    Planをレビューしてください。
    問題なければ「OK」と伝えてください。

人間: Token有効期限は15分で

AI: Plan を更新しました。
    レビューをお願いします。

人間: OK

AI: /speckit.tasks を実行します...
```
