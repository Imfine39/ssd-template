# HUMAN_CHECKPOINT Patterns Guide

> **Policy 定義:** [quality-gates.md#human-checkpoint-policy](../constitution/quality-gates.md#human-checkpoint-policy) 参照
>
> このファイルは HUMAN_CHECKPOINT の**実装パターン**を定義します。

統一されたHUMAN_CHECKPOINTのパターンとテンプレート。

---

## Overview

HUMAN_CHECKPOINT は人間の明示的な承認を必要とするゲートです。

**ルール:**
- CHECKPOINT をスキップして進むことは禁止
- 承認は明示的な返答が必要（Yes/OK/承認）
- 承認後に checkpoint 記録を実行

---

## 5 Patterns

| Pattern | 用途 | Trigger |
|---------|------|---------|
| **Spec Approval** | Spec の最終承認 | CLARIFY GATE 通過後 |
| **Plan Approval** | Plan の承認 | Plan 作成完了後 |
| **Workflow Completion** | ワークフロー結果確認 | 各ワークフロー完了時 |
| **Decision Point** | 重大な決定の確認 | Case 3 等の判断時 |
| **Irreversible Action** | 取り消せない操作の確認 | Push/Merge/Delete 前 |

---

## Pattern 1: Spec Approval

**Trigger:** CLARIFY GATE 通過後（feature.md, fix.md, project-setup.md）

### Template

```markdown
=== [HUMAN_CHECKPOINT] Spec Approval ===

確認事項:
- [ ] Spec の内容が要件を正確に反映しているか
- [ ] スコープが適切か（過大/過小でないか）
- [ ] ビジネス要件と整合しているか

{if PASSED_WITH_DEFERRED}
★ [DEFERRED] 項目の確認:
| # | Section | 項目 | 理由 | 影響 |
|---|---------|------|------|------|
| 1 | {section} | {item} | {reason} | {impact} |

- [ ] [DEFERRED] 項目を確認したか
- [ ] リスクを承知の上で先に進むか
{/if}

承認後、{next_step} へ進みます。
```

### 承認後処理

```bash
node .claude/skills/spec-mesh/scripts/state.cjs branch --add-checkpoint spec_approval
```

---

## Pattern 2: Plan Approval

**Trigger:** Plan 作成完了後（plan.md）

### Template

```markdown
=== [HUMAN_CHECKPOINT] Plan Approval ===

【Plan サマリー】
- 技術アプローチ: {approach}
- 作業項目: {work_count} 件
- リスク: {risk_summary}

確認事項:
- [ ] 技術的アプローチが妥当か
- [ ] Work Breakdown が適切か
- [ ] リスクが許容範囲か

承認後、Tasks 分割へ進みます。
```

### 承認後処理

```bash
node .claude/skills/spec-mesh/scripts/state.cjs branch --add-checkpoint plan_approval
```

---

## Pattern 3: Workflow Completion

**Trigger:** 各ワークフロー完了時（review.md, tasks.md, implement.md 等）

### Template

```markdown
**[HUMAN_CHECKPOINT]** {workflow_name} の結果を確認してから次のステップに進んでください。

【結果サマリー】
{result_summary}

次のステップ: {next_step}
```

### 使用例

```markdown
**[HUMAN_CHECKPOINT]** Multi-Review の結果を確認してから次のステップに進んでください。

【結果サマリー】
- Critical: 0 / Major: 2 / Minor: 5
- AI修正: 2 件
- 要確認: 0 件

次のステップ: Lint 実行
```

---

## Pattern 4: Decision Point

**Trigger:** 重大な決定が必要な時（change.md Case 3 等）

### Template

```markdown
=== [HUMAN_CHECKPOINT] {decision_type} ===

【判断が必要な内容】
{decision_description}

【選択肢】
1. {option_1}: {description_1}
2. {option_2}: {description_2}

【影響範囲】
- 影響する Spec: {affected_specs}
- 影響する Feature: {affected_features}

確認事項:
- [ ] 影響範囲を理解しているか
- [ ] 選択する方針を決定したか

選択を入力してください: [1/2/other]
```

### 承認後処理

```bash
node .claude/skills/spec-mesh/scripts/state.cjs branch --add-checkpoint decision_{type}
```

---

## Pattern 5: Irreversible Action

**Trigger:** Push/Merge/Delete 等の取り消せない操作前（pr.md）

### Template

```markdown
=== [HUMAN_CHECKPOINT] Irreversible Action ===

⚠️ 以下の操作は取り消せません:
- 操作: {action}
- 対象: {target}

確認事項:
- [ ] 変更内容が意図したものか
- [ ] テストが全て pass しているか
- [ ] レビューが完了しているか

承認後、{action} を実行します。
```

---

## Format Rules

### 1. ブロック形式（Spec/Plan/Decision/Irreversible）

重要なCHECKPOINTには `=== [HUMAN_CHECKPOINT] {Type} ===` 形式を使用：

```markdown
=== [HUMAN_CHECKPOINT] {Type} ===

確認事項:
- [ ] ...

承認後、{next} へ進みます。
```

### 2. インライン形式（Workflow Completion）

結果確認のみの場合は `**[HUMAN_CHECKPOINT]**` 形式を使用：

```markdown
**[HUMAN_CHECKPOINT]** {結果}を確認してから次のステップに進んでください。
```

### 3. 確認項目のチェックリスト

必ずチェックリスト形式で具体的な確認項目を提示：

```markdown
確認事項:
- [ ] {具体的な確認項目1}
- [ ] {具体的な確認項目2}
```

### 4. 次のステップの明示

承認後に何が起こるかを必ず記載：

```markdown
承認後、{next_step} へ進みます。
```

---

## Checkpoint Recording

**全ての CHECKPOINT 承認後に記録を実行:**

```bash
node .claude/skills/spec-mesh/scripts/state.cjs branch --add-checkpoint {checkpoint_type}
```

### Checkpoint Types

| Type | 使用タイミング |
|------|--------------|
| `spec_approval` | Spec 承認後 |
| `plan_approval` | Plan 承認後 |
| `decision_{type}` | 重大な判断後 |
| `irreversible_{action}` | 不可逆操作実行後 |

---

## Anti-Patterns

### ❌ 避けるべきパターン

```markdown
# ❌ 確認項目なし
[HUMAN_CHECKPOINT]

# ❌ 次のステップ不明
**[HUMAN_CHECKPOINT]** 確認してください。

# ❌ 曖昧な確認項目
確認事項:
- [ ] 問題ないか

# ❌ Type指定なしのブロック形式
=== [HUMAN_CHECKPOINT] ===
```

### ✅ 正しいパターン

```markdown
# ✅ Pattern 3 (Workflow Completion)
**[HUMAN_CHECKPOINT]** Review 結果を確認してから次のステップに進んでください。

# ✅ Pattern 1 (Spec Approval) - 具体的な確認項目
=== [HUMAN_CHECKPOINT] Spec Approval ===

確認事項:
- [ ] Spec の内容が要件を正確に反映しているか
- [ ] スコープが適切か

承認後、Plan 作成へ進みます。
```

---

## Cross-Reference

| Document | 関連内容 |
|----------|---------|
| [quality-gates.md](../constitution/quality-gates.md) | HUMAN_CHECKPOINT Policy の定義 |
| [_finalize.md](../workflows/shared/_finalize.md) | Spec Approval の実装例 |
| [plan.md](../workflows/plan.md) | Plan Approval の実装例 |
| [pr.md](../workflows/pr.md) | Irreversible Action の実装例 |
