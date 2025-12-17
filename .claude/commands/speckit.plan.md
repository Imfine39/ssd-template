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

## Steps

1) **Load context**:
   - Feature Spec + Domain Spec
   - Constitution (`.specify/memory/constitution.md`)
   - Plan template (`.specify/templates/plan-template.md`)

2) **Fill required sections**:
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

3) **Use tools**:
   - Serena: explore codebase for paths/structure
   - context7: library documentation if needed

4) **Save plan**:
   - Save to `plan.md` in the Feature directory
   - Keep IDs and headings; remove unused sections

5) **Run lint**:
   - Execute: `node .specify/scripts/spec-lint.cjs`

6) **Request human review**:
   - Show plan summary
   - List any open questions or risks
   - **Wait for human approval before proceeding to tasks**

7) **Update branch state** (on approval):
   ```bash
   node .specify/scripts/state.cjs branch --set-step plan_review
   ```
   After human approval:
   ```bash
   node .specify/scripts/state.cjs branch --set-step tasks
   ```

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
