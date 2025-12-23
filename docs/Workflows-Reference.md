# Workflows Reference

spec-mesh Skill の全ワークフローリファレンスです。

> **Note:** Claude Code v2.0.73 以降では、コマンド（Commands）ではなくスキル（Skills）+ ワークフロー（Workflows）アーキテクチャを採用しています。
> 詳細は [[Core-Concepts#11. Skills Architecture]] を参照してください。

---

## Workflow Categories

| Category               | Workflows                                   |
| ---------------------- | ------------------------------------------- |
| Project Initialization | vision, design                              |
| Development Entry      | issue, add, fix, featureproposal, change    |
| Development Flow       | spec, plan, tasks, implement, pr            |
| Utilities              | clarify, lint, analyze, checklist, feedback |

---

## Project Initialization

### `/spec-mesh vision`

**Purpose:** Vision Spec 作成（プロジェクト開始時の最初のステップ）

**Usage:**

```
/spec-mesh vision [プロジェクト説明]
```

**Example:**

```
/spec-mesh vision 中小企業向けの在庫管理システム
```

**Creates:**

- `.specify/specs/{project}/overview/vision/spec.md`（Screen Hints セクション含む）

**Input:**
統合 Quick Input（`.specify/input/vision-input.md`）:

- Part A: ビジョン（必須）
- Part B: 画面イメージ（推奨）→ Screen Hints に保存
- Part C: デザイン希望（任意）

**Next:** `/spec-mesh design`

---

### `/spec-mesh design`

**Purpose:** **Screen + Domain Spec 同時作成** + Feature Issues + Foundation Issue

**Prerequisites:** Vision Spec（警告のみ、続行可能）

**Usage:**

```
/spec-mesh design
```

**Creates:**

- Feature Issues (GitHub)
- `.specify/specs/{project}/overview/screen/spec.md`（M-_/API-_ 対応表付き）
- `.specify/specs/{project}/overview/domain/spec.md`（Screen 参照付き）
- Foundation Issue

**Flow:**

1. Vision Spec の Screen Hints から画面情報を取得
2. 空の場合は画面情報の入力を促す
3. Feature 提案 → 人間が採用を選択
4. SCR-_ ID 割り当て、M-_/API-\* 導出
5. Screen Spec + Domain Spec を同時作成
6. 対応表を両 Spec に記載

**Screen ↔ Domain 対応:**

- Screen Index に `APIs`, `Masters` 列
- M-\* 定義に `Used by screens: SCR-XXX`
- API-\* 定義に `Used by screens: SCR-XXX`

**Next:** `/spec-mesh issue` (Foundation)

---

## Development Entry Points

### `/spec-mesh issue`

**Purpose:** 既存 Issue を選択して開発開始

**Usage:**

```
/spec-mesh issue
```

**Flow:**

1. Issue 一覧表示
2. 選択された Issue の Branch 作成
3. Feature Spec 作成
4. Clarify ループ
5. Feature Index 更新

**Next:** `/spec-mesh plan`

---

### `/spec-mesh add`

**Purpose:** 新機能追加（Issue 自動作成）

**Usage:**

```
/spec-mesh add [機能説明]
```

**Example:**

```
/spec-mesh add ユーザー認証機能を追加
```

**Creates:**

- GitHub Issue
- Feature Branch
- Feature Spec

**Next:** `/spec-mesh plan`

---

### `/spec-mesh fix`

**Purpose:** バグ修正（Issue 自動作成）

**Usage:**

```
/spec-mesh fix [バグ説明]
```

**Example:**

```
/spec-mesh fix ログイン時にエラーが発生する
```

**Creates:**

- Bug Issue
- Fix Branch
- 既存 Spec の Changelog 更新

**Next:** `/spec-mesh plan` or `/spec-mesh implement`

---

### `/spec-mesh featureproposal`

**Purpose:** AI に Feature 候補を提案させる

**Usage:**

```
/spec-mesh featureproposal [ヒント]
```

**Example:**

```
/spec-mesh featureproposal レポート機能を追加したい
```

**Output:**

- Feature 候補リスト
- 選択された Feature の Issue 作成

**Next:** `/spec-mesh issue`

---

### `/spec-mesh change`

**Purpose:** Vision/Domain Spec の変更

**Usage:**

```
/spec-mesh change [変更内容]
```

**Example:**

```
/spec-mesh change M-PRODUCT に新しいフィールドを追加
```

**Flow:**

1. 現在のブランチを suspend（必要に応じて）
2. Spec 変更 Issue 作成
3. Spec 変更 Branch 作成
4. Spec 更新 + 影響分析
5. PR 作成 & マージ
6. 元のブランチを resume

---

## Development Flow

### `/spec-mesh spec`

**Purpose:** Spec 作成/更新

**Usage:**

```
/spec-mesh spec
```

**Options:**

- Vision/Domain/Feature Spec を作成または更新
- `[NEEDS CLARIFICATION]` マークを付ける

---

### `/spec-mesh plan`

**Purpose:** 実装計画作成

**Prerequisites:** Feature Spec が承認済み

**Usage:**

```
/spec-mesh plan
```

**Creates:**

- `.specify/specs/{project}/features/<feature-id>/plan.md`

**Contains:**

- 技術選定
- ディレクトリ構造
- 実装方針
- Constitution チェック

**Human Checkpoint:** Plan レビュー・承認

**Next:** `/spec-mesh tasks`

---

### `/spec-mesh tasks`

**Purpose:** タスク分割

**Prerequisites:** Plan が承認済み

**Usage:**

```
/spec-mesh tasks
```

**Creates:**

- `.specify/specs/{project}/features/<feature-id>/tasks.md`

**Contains:**

- UC ベースのタスク分割
- 各タスクの見積もり
- 依存関係

**Next:** `/spec-mesh implement`

---

### `/spec-mesh implement`

**Purpose:** 実装

**Prerequisites:** Tasks が存在

**Usage:**

```
/spec-mesh implement
```

**Flow:**

1. Tasks 読み込み
2. 各タスクを順番に実装
3. テスト作成
4. タスク進捗更新

**Next:** `/spec-mesh pr`

---

### `/spec-mesh pr`

**Purpose:** PR 作成

**Prerequisites:** 実装完了

**Usage:**

```
/spec-mesh pr
```

**Flow:**

1. `spec-lint` 自動実行
2. PR 作成（Issue 自動リンク）
3. PR テンプレート適用

---

## Utility Workflows

### `/spec-mesh clarify`

**Purpose:** 要件の曖昧点を解消

**Usage:**

```
/spec-mesh clarify
```

**Flow:**

1. `[NEEDS CLARIFICATION]` を検索
2. 4問ずつバッチで質問（推奨オプション付き）
3. 回答ごとに Spec 即時更新
4. すべて解消されるまで繰り返し

**Note:** Clarify は独立したワークフローとして分離されています。各ワークフロー（vision, design, add, fix）の後に明示的に実行してください。

---

### `/spec-mesh lint`

**Purpose:** Spec 整合性チェック

**Usage:**

```
/spec-mesh lint
```

**Checks:**

- Vision/Domain/Feature の整合性
- M-_/API-_ 参照の妥当性
- Plan/Tasks の存在確認
- ID 重複チェック

**Script:**

```bash
node .claude/skills/spec-mesh/scripts/spec-lint.cjs
```

---

### `/spec-mesh analyze`

**Purpose:** 実装と Spec の整合性分析（PR 前の安心確認）

**Usage:**

```
/spec-mesh analyze
```

**Checks:**

- Spec の要件が実装されているか
- テストカバレッジ
- 未実装の UC/FR

---

### `/spec-mesh checklist`

**Purpose:** 要件品質チェックリスト生成（Unit Tests for English）

**Usage:**

```
/spec-mesh checklist
```

**Creates:**

- `.specify/specs/{project}/features/<feature-id>/checklist.md`

**Contains:**

- UC ごとのチェック項目
- FR の検証項目
- Edge case の確認項目

---

### `/spec-mesh feedback`

**Purpose:** 実装中の発見を Spec に記録

**Usage:**

```
/spec-mesh feedback [発見内容]
```

**Example:**

```
/spec-mesh feedback 認証 API のレスポンス形式を変更した方が良い
```

**Updates:**

- Feature Spec の Implementation Notes セクション
- 必要に応じて Domain Spec への提案

---

## Workflow Flow Diagram

```
New Project:
  /spec-mesh vision → /spec-mesh design → /spec-mesh issue → /spec-mesh plan → /spec-mesh tasks → /spec-mesh implement → /spec-mesh pr

Add Feature:
  /spec-mesh add → /spec-mesh plan → /spec-mesh tasks → /spec-mesh implement → /spec-mesh pr

Fix Bug:
  /spec-mesh fix → /spec-mesh plan (optional) → /spec-mesh implement → /spec-mesh pr

Domain/Screen Change:
  /spec-mesh change → /spec-mesh plan → /spec-mesh implement → /spec-mesh pr
```

---

## Related Pages

- [[Workflow-New-Project]] - 新規プロジェクトフロー
- [[Workflow-Add-Feature]] - 機能追加フロー
- [[Scripts-Reference]] - スクリプトリファレンス
