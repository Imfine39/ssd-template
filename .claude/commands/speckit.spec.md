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

Create or update a Spec. This is a **base command** (internal/advanced use).

> **Note:** 通常は `/speckit.vision`, `/speckit.add`, `/speckit.fix`, `/speckit.issue` を使用してください。
> このコマンドは内部使用または上級者向けです。

**When to use this command:**
- 他のコマンドから呼び出される内部処理として
- Spec を手動で作成/更新する必要がある上級ユーザー向け

**Recommended alternatives:**
- 新規プロジェクト → `/speckit.vision` → `/speckit.design`
- 新機能追加 → `/speckit.add`
- バグ修正 → `/speckit.fix`
- 既存 Issue から開始 → `/speckit.issue`

**This command focuses on:** Spec 作成のみ。Clarify は `/speckit.clarify` で実行。
**Next steps:** `/speckit.clarify` で曖昧点を解消 → `/speckit.plan` で実装計画

## Execution Protocol (MUST FOLLOW)

**Before starting:**

1. Use **TodoWrite** to create todos for all main Steps:
   - "Step 1: Parse input"
   - "Step 2: Identify elements"
   - "Step 3: Fill spec sections"
   - "Step 4: Save spec"
   - "Step 5: Run lint"
   - "Step 6: Summary & Clarify 推奨"

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

1. **Parse input**:
   - Extract feature/bug description from `$ARGUMENTS`
   - If empty, ask for description

#### Self-Check (Step 1)

- [ ] $ARGUMENTS から説明を抽出したか（または入力を求めたか）
- [ ] Spec の種類（Vision/Domain/Feature）を特定したか

2. **Identify elements**:
   - Actors and their goals
   - Actions and workflows
   - Data entities (reference Overview masters by ID)
   - Constraints and business rules
   - Mark unclear items as `[NEEDS CLARIFICATION]`

#### Self-Check (Step 2)

- [ ] アクター（Actors）とそのゴールを特定したか
- [ ] アクションとワークフローを特定したか
- [ ] データエンティティ（M-\*/API-\*）を特定したか
- [ ] 曖昧な項目に `[NEEDS CLARIFICATION]` をマークしたか

3. **Fill spec sections**:
   - Purpose and Scope
   - Actors and Context
   - Domain Model (reference Domain IDs: M-_, API-_)
   - User Stories (UC-XXX)
   - Functional Requirements (FR-XXX)
   - Success Criteria (SC-XXX)
   - Edge Cases
   - Non-Functional Requirements
   - Traceability (link to Domain)

#### Self-Check (Step 3)

- [ ] 全ての必須セクションを埋めたか
- [ ] UC-XXX, FR-XXX, SC-XXX の ID を適切に付与したか
- [ ] Domain の M-\*/API-\* を正しく参照しているか

4. **Save spec**:
   - Write to `.specify/specs/<id>/spec.md`
   - For Feature: auto-update Domain's Feature index table

#### Self-Check (Step 4)

- [ ] Spec ファイルを `.specify/specs/<id>/spec.md` に保存したか
- [ ] Feature の場合、Domain の Feature Index を更新したか

5. **Run lint**:
   - Execute: `node .specify/scripts/spec-lint.cjs`

#### Self-Check (Step 5)

- [ ] spec-lint.cjs を実行したか
- [ ] エラーがあれば対処したか

6. **Summary & Clarify 推奨**:

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

#### Self-Check (Step 6)

- [ ] Spec サマリー（UC/FR/SC カウント）を表示したか
- [ ] `[NEEDS CLARIFICATION]` マークの数を報告したか
- [ ] 次のステップ（/speckit.clarify）を推奨したか
- [ ] 全ての Step が完了し、todo を全て `completed` にマークしたか

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
