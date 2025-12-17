---
description: Create or update a Spec (Vision, Domain, or Feature).
handoffs:
  - label: Clarify Spec
    agent: speckit.clarify
    prompt: Clarify the Spec
    send: true
  - label: Skip to Plan
    agent: speckit.plan
    prompt: Create implementation plan from this spec
    send: true
---

## User Input

```text
$ARGUMENTS
```

## Purpose

Create or update a Spec. This is a **base command** that can be:
- Called by entry points (`/speckit.add`, `/speckit.fix`, `/speckit.issue`)
- Called directly to create/update a spec manually

**This command focuses on:** Spec 作成のみ。Clarify は `/speckit.clarify` で実行。
**Next steps:** `/speckit.clarify` で曖昧点を解消 → `/speckit.plan` で実装計画

## Modes

### Mode 1: Scaffold (empty or minimal spec)

Use scaffold script for initial creation:

**Vision:**
```bash
node .specify/scripts/scaffold-spec.cjs --kind vision --id S-VISION-001 --title "Project Vision"
```

**Domain:**
```bash
node .specify/scripts/scaffold-spec.cjs --kind domain --id S-DOMAIN-001 --title "System Domain" --vision S-VISION-001
```

**Feature:**
```bash
node .specify/scripts/scaffold-spec.cjs --kind feature --id S-FEATURE-001 --title "Feature Title" --domain S-DOMAIN-001
```

### Mode 2: Full Spec Generation

Generate detailed spec content from description.

## Steps

1) **Parse input**:
   - Extract feature/bug description from `$ARGUMENTS`
   - If empty, ask for description

2) **Identify elements**:
   - Actors and their goals
   - Actions and workflows
   - Data entities (reference Overview masters by ID)
   - Constraints and business rules
   - Mark unclear items as `[NEEDS CLARIFICATION]`

3) **Fill spec sections**:
   - Purpose and Scope
   - Actors and Context
   - Domain Model (reference Domain IDs: M-*, API-*)
   - User Stories (UC-XXX)
   - Functional Requirements (FR-XXX)
   - Success Criteria (SC-XXX)
   - Edge Cases
   - Non-Functional Requirements
   - Traceability (link to Domain)

4) **Save spec**:
   - Write to `.specify/specs/<id>/spec.md`
   - For Feature: auto-update Domain's Feature index table

5) **Run lint**:
   - Execute: `node .specify/scripts/spec-lint.cjs`

6) **Summary & Clarify 推奨**:
   ```
   === Spec 作成完了 ===

   Spec: [ファイルパス]

   概要:
   - UC: [N] 個
   - FR: [N] 個
   - SC: [N] 個

   === 曖昧点 ===

   [NEEDS CLARIFICATION] マーク: [N] 箇所
   - [曖昧点のリスト]

   推奨: `/speckit.clarify` で曖昧点を解消してください。

   次のステップ:
   1. [推奨] `/speckit.clarify` - 曖昧点を解消
   2. `/speckit.plan` - 曖昧点を残したまま計画作成（非推奨）
   ```

## Output

- Spec file path
- Spec summary (UC/FR/SC counts)
- 曖昧点レポート
- Next step recommendation: `/speckit.clarify`

## Example

```
AI: Feature Spec を作成しました: .specify/specs/s-auth-001/spec.md

    概要:
    - UC: 3個
    - FR: 8個
    - SC: 4個

    === 曖昧点 ===

    [NEEDS CLARIFICATION] マーク: 2 箇所

    - FR-002: パスワードの最小文字数が未定義
    - FR-005: ログイン失敗時のロック条件が未定義

    推奨: `/speckit.clarify` で曖昧点を解消してください。

    次のステップ:
    1. [推奨] `/speckit.clarify` - 曖昧点を解消
    2. `/speckit.plan` - 曖昧点を残したまま計画作成（非推奨）
```
