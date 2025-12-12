# Commands Reference

全 speckit コマンドのリファレンスです。

---

## Command Categories

| Category | Commands |
|----------|----------|
| Project Initialization | vision, design |
| Development Entry | issue, add, fix, featureproposal, change |
| Development Flow | spec, plan, tasks, implement, pr |
| Utilities | clarify, lint, analyze, checklist, feedback |
| Deprecated | bootstrap |

---

## Project Initialization

### `/speckit.vision`

**Purpose:** Vision Spec 作成（プロジェクト開始時の最初のステップ）

**Usage:**
```
/speckit.vision [プロジェクト説明]
```

**Example:**
```
/speckit.vision 中小企業向けの在庫管理システム
```

**Creates:**
- `.specify/specs/vision/spec.md`

**Next:** `/speckit.design`

---

### `/speckit.design`

**Purpose:** Feature 提案 + Domain Spec 作成 + Foundation Issue 作成

**Prerequisites:** Vision Spec（警告のみ、続行可能）

**Usage:**
```
/speckit.design
```

**Creates:**
- Feature Issues (GitHub)
- `.specify/specs/domain/spec.md`
- Foundation Issue

**Next:** `/speckit.issue` (Foundation)

---

## Development Entry Points

### `/speckit.issue`

**Purpose:** 既存 Issue を選択して開発開始

**Usage:**
```
/speckit.issue
```

**Flow:**
1. Issue 一覧表示
2. 選択された Issue の Branch 作成
3. Feature Spec 作成
4. Clarify ループ
5. Feature Index 更新

**Next:** `/speckit.plan`

---

### `/speckit.add`

**Purpose:** 新機能追加（Issue 自動作成）

**Usage:**
```
/speckit.add [機能説明]
```

**Example:**
```
/speckit.add ユーザー認証機能を追加
```

**Creates:**
- GitHub Issue
- Feature Branch
- Feature Spec

**Next:** `/speckit.plan`

---

### `/speckit.fix`

**Purpose:** バグ修正（Issue 自動作成）

**Usage:**
```
/speckit.fix [バグ説明]
```

**Example:**
```
/speckit.fix ログイン時にエラーが発生する
```

**Creates:**
- Bug Issue
- Fix Branch
- 既存 Spec の Changelog 更新

**Next:** `/speckit.plan` or `/speckit.implement`

---

### `/speckit.featureproposal`

**Purpose:** AI に Feature 候補を提案させる

**Usage:**
```
/speckit.featureproposal [ヒント]
```

**Example:**
```
/speckit.featureproposal レポート機能を追加したい
```

**Output:**
- Feature 候補リスト
- 選択された Feature の Issue 作成

**Next:** `/speckit.issue`

---

### `/speckit.change`

**Purpose:** Vision/Domain Spec の変更

**Usage:**
```
/speckit.change [変更内容]
```

**Example:**
```
/speckit.change M-PRODUCT に新しいフィールドを追加
```

**Flow:**
1. 現在のブランチを suspend（必要に応じて）
2. Spec 変更 Issue 作成
3. Spec 変更 Branch 作成
4. Spec 更新 + 影響分析
5. PR 作成 & マージ
6. 元のブランチを resume

---

## Development Flow Commands

### `/speckit.spec`

**Purpose:** Spec 作成/更新

**Usage:**
```
/speckit.spec
```

**Options:**
- Vision/Domain/Feature Spec を作成または更新
- `[NEEDS CLARIFICATION]` マークを付ける

---

### `/speckit.plan`

**Purpose:** 実装計画作成

**Prerequisites:** Feature Spec が承認済み

**Usage:**
```
/speckit.plan
```

**Creates:**
- `.specify/specs/<feature-id>/plan.md`

**Contains:**
- 技術選定
- ディレクトリ構造
- 実装方針
- Constitution チェック

**Human Checkpoint:** Plan レビュー・承認

**Next:** `/speckit.tasks`

---

### `/speckit.tasks`

**Purpose:** タスク分割

**Prerequisites:** Plan が承認済み

**Usage:**
```
/speckit.tasks
```

**Creates:**
- `.specify/specs/<feature-id>/tasks.md`

**Contains:**
- UC ベースのタスク分割
- 各タスクの見積もり
- 依存関係

**Next:** `/speckit.implement`

---

### `/speckit.implement`

**Purpose:** 実装

**Prerequisites:** Tasks が存在

**Usage:**
```
/speckit.implement
```

**Flow:**
1. Tasks 読み込み
2. 各タスクを順番に実装
3. テスト作成
4. タスク進捗更新

**Next:** `/speckit.pr`

---

### `/speckit.pr`

**Purpose:** PR 作成

**Prerequisites:** 実装完了

**Usage:**
```
/speckit.pr
```

**Flow:**
1. `spec-lint` 自動実行
2. PR 作成（Issue 自動リンク）
3. PR テンプレート適用

---

## Utility Commands

### `/speckit.clarify`

**Purpose:** 要件の曖昧点を解消

**Usage:**
```
/speckit.clarify
```

**Flow:**
1. `[NEEDS CLARIFICATION]` を検索
2. 1問ずつ質問（推奨オプション付き）
3. 回答ごとに Spec 即時更新
4. すべて解消されるまで繰り返し

---

### `/speckit.lint`

**Purpose:** Spec 整合性チェック

**Usage:**
```
/speckit.lint
```

**Checks:**
- Vision/Domain/Feature の整合性
- M-*/API-* 参照の妥当性
- Plan/Tasks の存在確認
- ID 重複チェック

**Script:**
```bash
node .specify/scripts/spec-lint.js
```

---

### `/speckit.analyze`

**Purpose:** 実装と Spec の整合性分析（PR 前の安心確認）

**Usage:**
```
/speckit.analyze
```

**Checks:**
- Spec の要件が実装されているか
- テストカバレッジ
- 未実装の UC/FR

---

### `/speckit.checklist`

**Purpose:** 要件品質チェックリスト生成（Unit Tests for English）

**Usage:**
```
/speckit.checklist
```

**Creates:**
- `.specify/specs/<feature-id>/checklist.md`

**Contains:**
- UC ごとのチェック項目
- FR の検証項目
- Edge case の確認項目

---

### `/speckit.feedback`

**Purpose:** 実装中の発見を Spec に記録

**Usage:**
```
/speckit.feedback [発見内容]
```

**Example:**
```
/speckit.feedback 認証 API のレスポンス形式を変更した方が良い
```

**Updates:**
- Feature Spec の Implementation Notes セクション
- 必要に応じて Domain Spec への提案

---

## Deprecated

### `/speckit.bootstrap`

**Status:** DEPRECATED

**Replacement:**
```
/speckit.vision → /speckit.design
```

---

## Command Flow Diagram

```
New Project:
  /speckit.vision → /speckit.design → /speckit.issue → ...

Add Feature:
  /speckit.add → /speckit.plan → /speckit.tasks → /speckit.implement → /speckit.pr

Fix Bug:
  /speckit.fix → /speckit.plan (optional) → /speckit.implement → /speckit.pr

Domain Change:
  /speckit.change → /speckit.plan → /speckit.implement → /speckit.pr
```

---

## Related Pages

- [[Workflow-New-Project]] - 新規プロジェクトフロー
- [[Workflow-Add-Feature]] - 機能追加フロー
- [[Scripts-Reference]] - スクリプトリファレンス
