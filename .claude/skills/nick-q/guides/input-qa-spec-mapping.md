# Input → QA → Spec マッピングガイド

**目的:** Pre-Input から QA、Spec への情報の流れを明確化する

---

## Scope

This guide is the **authoritative reference** for the data flow from Input files through QA documents to Specs.

**Related guides:**
- `id-naming.md` - QA Question ID (Q-*) naming conventions
- `judgment-criteria.md` - Judgment criteria for ambiguous expressions

**Related workflows:**
- `workflows/shared/_qa-generation.md` - QA document generation logic
- `workflows/shared/_qa-followup.md` - QA follow-up (response analysis + proposals)

---

## 設計思想

> **Core Insight:** ユーザーは「書くのが面倒」ではなく「知らないことがある」

```
Pre-Input（ユーザーが知っていること）
    ↓
QA（ユーザーが知らないことを発見 + AI からの提案）
├─ [必須] / [確認] / [選択]（質問）
└─ [提案]（10 観点からの能動的提案）
    ↓
QA フォローアップ（回答ベースの追加確認・追加提案）
    ↓
Spec（完成した仕様）
```

---

## 1. add（Feature）タイプ

### Input → QA マッピング

| Input セクション | QA 質問 ID | QA カテゴリ | 条件 |
|-----------------|-----------|------------|------|
| 機能概要.機能名 | - | - | 記入済みなら QA スキップ |
| 機能概要.一言で説明 | - | - | 記入済みなら QA スキップ |
| なぜ必要か.解決したい課題 | ADD-Q03 | [確認] | 常に確認 |
| なぜ必要か.誰が使うか | ADD-Q02 | [必須] | 未記入時 |
| なぜ必要か.どんな価値 | ADD-Q03 | [確認] | 常に確認 |
| データと処理.入力データ | ADD-Q20 | [確認] | フォームがある場合 |
| データと処理.出力データ | ADD-Q21 | [確認] | 常に |
| データと処理.保存するデータ | ADD-Q30 | [確認] | 常に |
| データと処理.主な処理ロジック | ADD-Q22 | [確認] | 入力がある場合 |
| 画面イメージ | ADD-Q31 | [確認] | 常に |
| 関連する既存機能 | ADD-Q30 | [確認] | 常に |
| 制約・注意点 | - | - | Spec に直接反映 |

### QA → Spec マッピング

| QA セクション | Feature Spec セクション | Notes |
|--------------|------------------------|-------|
| 機能目的（ADD-Q01〜Q03） | 1.1 Feature Description | What & Why |
| 対象ユーザー（ADD-Q02） | 3. Actors | ユーザーロール |
| ユースケース（ADD-Q10, Q11） | 4. Use Cases | UC-* として展開 |
| 入力/出力（ADD-Q20, Q21） | 5. Functional Requirements | FR-* として展開 |
| バリデーション（ADD-Q22） | 5. Functional Requirements | FR-RULE-* |
| 使用データ（ADD-Q30） | 2. Domain Reference | M-*, API-* 参照 |
| 関連画面（ADD-Q31） | 8. Screen Dependencies | SCR-* 参照 |
| パフォーマンス（ADD-Q40） | 10. Non-Functional Requirements | NFR-* |
| 権限（ADD-Q41） | 3. Actors, 9. Feature-Specific Rules | ACL 設計 |

---

## 2. fix タイプ

> **Note:** fix ワークフローは QA ドキュメントを使用せず、簡易 AskUserQuestion で直接確認します。

### Input → Spec マッピング（直接）

| Input セクション | Fix Spec セクション | Notes |
|-----------------|---------------------|-------|
| バグの概要.何が起きているか | 1.1 What is happening | 現象記述 |
| バグの概要.期待する動作 | 1.2 Expected behavior | あるべき姿 |
| 再現手順 | 1.3 Steps to reproduce | 番号付きステップ |
| 発生環境 | 1.4 Environment | 環境情報 |
| 影響範囲.影響を受ける機能 | 2. Impact Analysis | SCR/M/API への影響 |
| 影響範囲.緊急度 | 1.5 Severity | Critical/High/Medium/Low |
| 関連情報.エラーメッセージ | 1.6 Error Details | エラー詳細 |
| 原因の推測 | 3. Investigation | Root Cause 候補 |

### 簡易 AskUserQuestion で確認する項目

| 項目 | 条件 | 質問例 |
|------|------|--------|
| 発生頻度 | 常に | 「常に発生？高頻度？低頻度？」 |
| 緊急度 | Input で未記入時 | 「緊急（本番障害）？高？中？低？」 |
| 再現手順 | Input で不明瞭時 | 「再現手順を確認」 |

---

## 3. change タイプ

### Input → Workflow マッピング

| Input セクション | 使用先 | Notes |
|-----------------|--------|-------|
| 変更対象.対象 Spec | change.md Step 1 | 変更対象 Spec の特定 |
| 変更対象.対象 ID | change.md Step 1 | M-*, API-*, SCR-* 等 |
| 変更内容.現在の定義 | Impact Analysis | 差分計算の基準 |
| 変更内容.変更後の定義 | Spec 更新 | 新しい定義内容 |
| 変更内容.変更理由 | Clarifications/Changelog | トレーサビリティ |
| 影響範囲 | Impact Analysis | AI 分析の補完情報 |

**Note:** change タイプは QA を省略し、AskUserQuestion で直接確認する。

---

## 4. project-setup タイプ

### Input → QA マッピング

| Input セクション | QA 質問 ID | QA カテゴリ | 条件 |
|-----------------|-----------|------------|------|
| プロジェクト概要.プロジェクト名 | - | - | 必須（Input で必須） |
| プロジェクト概要.一言で説明すると | PS-Q01 | [必須] | 未記入時 |
| プロジェクト概要.解決したい課題 | PS-Q01 | [必須] | 未記入時 |
| 機能リスト.各機能 | PS-Q10 | [確認] | 機能が特定された場合 |
| 機能リスト.各機能.概要 | PS-Q11 | [選択] | 機能 >= 3 の場合（優先順位） |
| 機能リスト.各機能.データ | PS-Q30 | [確認] | データが特定された場合 |
| 機能リスト.各機能.画面イメージ | PS-Q20 | [確認] | 画面が特定された場合 |
| MVP 定義 | PS-Q10 | [確認] | 常に |
| 技術的な制約 | PS-Q40, PS-Q41 | [確認] | 常に |

### QA → Spec マッピング

| QA セクション | Output Spec | Notes |
|--------------|-------------|-------|
| 基本情報（PS-Q01, Q02, Q03） | Vision Spec Section 1-2 | 目的・ゴール |
| 機能要件（PS-Q10, Q11） | Vision Spec Section 3 (Feature Hints) | 機能一覧 |
| 機能要件（PS-Q10, Q11） | Feature Drafts (S-*) | 各機能の Draft |
| 非機能要件（PS-Q40, Q41） | Vision Spec Section 4 | 技術制約 |
| 画面構成（PS-Q20, Q21） | Screen Spec | SCR-* 定義 |
| データ項目（PS-Q30, Q31） | Domain Spec | M-*, API-* 定義 |

---

## 5. [NEEDS CLARIFICATION] マーカー生成

未回答の `[必須]` 項目がある場合、Spec に `[NEEDS CLARIFICATION]` を生成する。

### マーカー生成ルール

| QA カテゴリ | 未回答時の処理 |
|------------|---------------|
| `[必須]` | `[NEEDS CLARIFICATION: {質問内容}]` を Spec に記入 |
| `[確認]` | AI の推測をデフォルトとして採用 |
| `[選択]` | `[NEEDS CLARIFICATION: 選択が必要: {選択肢}]` を Spec に記入 |
| `[提案]` | 未回答は不採用として処理、「後で検討」は `[DEFERRED]` として記録 |

### 提案の採否 → Spec 反映

| 採否 | Spec への反映 |
|------|--------------|
| 採用する | 該当セクションに要件として追加 |
| 後で検討 | `[DEFERRED: {提案内容}]` として記録 |
| 不要 | 反映しない（採否記録のみ保持） |

### マーカーの配置先

| QA 質問タイプ | Spec セクション（例） |
|--------------|---------------------|
| 対象ユーザー | 3. Actors |
| 機能目的 | 1.1 Feature Description |
| 入力/出力 | 5. Functional Requirements |
| 使用データ | 2. Domain Reference |
| パフォーマンス | 10. Non-Functional Requirements |

---

## 6. [DEFERRED] マーカーの取り扱い

`[DEFERRED]` マーカーは clarify ワークフローで意図的に付与されたもの。

### 処理ルール

1. 既存の `[DEFERRED]` マーカーは保持する
2. `[DEFERRED]` を `[NEEDS CLARIFICATION]` に変換しない
3. SPEC GATE は `[DEFERRED]` を PASSED_WITH_DEFERRED として処理

### SPEC GATE との関係

| マーカー | SPEC GATE 結果 |
|---------|------------------|
| `[NEEDS CLARIFICATION]` > 0 | BLOCKED_CLARIFY |
| `[PENDING OVERVIEW CHANGE]` > 0 (Feature/Fix のみ) | BLOCKED_OVERVIEW |
| 上記 = 0, `[DEFERRED]` > 0 | PASSED_WITH_DEFERRED |
| 上記 = 0, `[DEFERRED]` = 0 | PASSED |

> **SSOT:** [quality-gates.md#spec-gate](../constitution/quality-gates.md#spec-gate) 参照

---

## 7. 関連ファイル

| ファイル | 役割 |
|---------|------|
| `templates/inputs/add-input.md` | Feature Input テンプレート |
| `templates/inputs/fix-input.md` | Fix Input テンプレート |
| `templates/inputs/change-input.md` | Change Input テンプレート |
| `templates/inputs/project-setup-input.md` | Project Setup Input テンプレート |
| `workflows/shared/_qa-generation.md` | QA ドキュメント生成ロジック（[提案] 含む） |
| `workflows/shared/_qa-followup.md` | QA フォローアップ（回答分析 + 追加確認 + 追加提案） |
| `workflows/shared/_spec-gate.md` | SPEC GATE 運用手順 |
