---
description: Create or update a Spec (Overview or Feature). Loops clarify until no ambiguity remains.
handoffs:
  - label: Continue to Plan
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
- Called by entry points (`/speckit.add`, `/speckit.fix`, `/speckit.issue`, `/speckit.bootstrap`)
- Called directly to create/update a spec manually

**Important**: After spec creation, automatically loops `/speckit.clarify` until all `[NEEDS CLARIFICATION]` items are resolved.

## Modes

### Mode 1: Scaffold (empty or minimal spec)

Use scaffold script for initial creation:

**Overview:**
```bash
node .specify/scripts/scaffold-spec.js --kind overview --id S-OVERVIEW-001 --title "System Overview"
```

**Feature:**
```bash
node .specify/scripts/scaffold-spec.js --kind feature --id S-FEATURE-001 --title "Feature Title" --overview S-OVERVIEW-001
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
   - Domain Model (reference Overview IDs: M-*, API-*)
   - User Stories (UC-XXX)
   - Functional Requirements (FR-XXX)
   - Success Criteria (SC-XXX)
   - Edge Cases
   - Non-Functional Requirements
   - Traceability (link to Overview)

4) **Save spec**:
   - Write to `.specify/specs/<id>/spec.md`
   - For Feature: auto-update Overview's Feature index table

5) **Run lint**:
   - Execute: `node .specify/scripts/spec-lint.js`

6) **Clarify loop**:
   - If `[NEEDS CLARIFICATION]` items exist:
     - Show items to human
     - Ask for clarification
     - Update spec with answers
     - Repeat until all resolved
   - This loop continues until spec has zero `[NEEDS CLARIFICATION]`

7) **Request human review**:
   - Show final spec summary
   - Wait for approval before proceeding to plan

## Output

- Spec file path
- Spec summary (UC/FR/SC counts)
- Confirmation that all clarifications resolved
- Next step: `/speckit.plan`

## Example

```
AI: Feature Spec を作成しました: .specify/specs/s-auth-001/spec.md

    概要:
    - UC: 3個
    - FR: 8個
    - SC: 4個

    [NEEDS CLARIFICATION]:
    1. パスワードの最小文字数は？
    2. ログイン失敗時のロック条件は？

人間: 1. 8文字以上  2. 5回失敗で30分ロック

AI: Spec を更新しました。
    [NEEDS CLARIFICATION] はすべて解決しました。

    Specをレビューしてください。
    問題なければ「OK」と伝えてください。

人間: OK

AI: /speckit.plan を実行します...
```
