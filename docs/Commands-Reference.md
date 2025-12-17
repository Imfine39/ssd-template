# Commands Reference

全 speckit コマンドのリファレンスです。

---

## Command Categories

| Category               | Commands                                    |
| ---------------------- | ------------------------------------------- |
| Project Initialization | vision, design                              |
| Development Entry      | issue, add, fix, featureproposal, change    |
| Development Flow       | spec, plan, tasks, implement, pr            |
| Utilities              | clarify, lint, analyze, checklist, feedback |

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

- `.specify/specs/vision/spec.md`（Screen Hints セクション含む）

**Input:**
統合 Quick Input（`.specify/input/vision-input.md`）:

- Part A: ビジョン（必須）
- Part B: 画面イメージ（推奨）→ Screen Hints に保存
- Part C: デザイン希望（任意）

**Next:** `/speckit.design`

---

### `/speckit.design`

**Purpose:** **Screen + Domain Spec 同時作成** + Feature Issues + Foundation Issue

**Prerequisites:** Vision Spec（警告のみ、続行可能）

**Usage:**

```
/speckit.design
```

**Creates:**

- Feature Issues (GitHub)
- `.specify/specs/screen/spec.md`（M-_/API-_ 対応表付き）
- `.specify/specs/domain/spec.md`（Screen 参照付き）
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
2. 4問ずつバッチで質問（推奨オプション付き）
3. 回答ごとに Spec 即時更新
4. すべて解消されるまで繰り返し

**Note:** Clarify は独立したコマンドとして分離されています。各コマンド（vision, design, add, fix）の後に明示的に実行してください。

---

### `/speckit.lint`

**Purpose:** Spec 整合性チェック

**Usage:**

```
/speckit.lint
```

**Checks:**

- Vision/Domain/Feature の整合性
- M-_/API-_ 参照の妥当性
- Plan/Tasks の存在確認
- ID 重複チェック

**Script:**

```bash
node .specify/scripts/spec-lint.cjs
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

## Command Flow Diagram

```
New Project:
  /speckit.vision → /speckit.design → /speckit.issue → /speckit.plan → /speckit.tasks → /speckit.implement → /speckit.pr

Add Feature:
  /speckit.add → /speckit.plan → /speckit.tasks → /speckit.implement → /speckit.pr

Fix Bug:
  /speckit.fix → /speckit.plan (optional) → /speckit.implement → /speckit.pr

Domain/Screen Change:
  /speckit.change → /speckit.plan → /speckit.implement → /speckit.pr
```

---

## Related Pages

- [[Workflow-New-Project]] - 新規プロジェクトフロー
- [[Workflow-Add-Feature]] - 機能追加フロー
- [[Scripts-Reference]] - スクリプトリファレンス
