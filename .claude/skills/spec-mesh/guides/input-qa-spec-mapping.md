# Input → QA → Spec マッピングガイド

**目的:** Pre-Input から QA、Spec への情報の流れを明確化する

---

## 設計思想

> **Core Insight:** ユーザーは「書くのが面倒」ではなく「知らないことがある」

```
Pre-Input（ユーザーが知っていること）
    ↓
QA（ユーザーが知らないことを発見）
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

### Input → QA マッピング

| Input セクション | QA 質問 ID | QA カテゴリ | 条件 |
|-----------------|-----------|------------|------|
| バグの概要.何が起きているか | FIX-Q01 | [必須] | 未記入時 |
| バグの概要.期待する動作 | FIX-Q20 | [必須] | 未記入時 |
| 再現手順 | FIX-Q10 | [確認] | 常に確認 |
| 発生環境 | - | - | Spec に直接反映 |
| 影響範囲.影響を受ける機能 | FIX-Q03 | [確認] | 常に |
| 影響範囲.緊急度 | FIX-Q40 | [選択] | 常に |
| 関連情報.エラーメッセージ | - | - | Spec に直接反映 |
| 原因の推測 | FIX-Q30 | [確認] | AI が推測可能な場合 |

### QA → Spec マッピング

| QA セクション | Fix Spec セクション | Notes |
|--------------|---------------------|-------|
| 問題の症状（FIX-Q01, Q02） | 1.1 What is happening | 現象記述 |
| 期待動作（FIX-Q20, Q21） | 1.2 Expected behavior | あるべき姿 |
| 再現手順（FIX-Q10） | 1.3 Steps to reproduce | 番号付きステップ |
| 影響範囲（FIX-Q03） | 2. Impact Analysis | SCR/M/API への影響 |
| 原因推測（FIX-Q30, Q31） | 3. Investigation | Root Cause 候補 |
| 緊急度（FIX-Q40） | 1.5 Severity | Critical/High/Medium/Low |
| 修正アプローチ（FIX-Q41） | 4. Fix Strategy | 修正方針 |

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
| `[提案]` | 不採用として処理 |
| `[選択]` | `[NEEDS CLARIFICATION: 選択が必要: {選択肢}]` を Spec に記入 |

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
3. CLARIFY GATE は `[DEFERRED]` を PASSED_WITH_DEFERRED として処理

### CLARIFY GATE との関係

| マーカー | CLARIFY GATE 結果 |
|---------|------------------|
| `[NEEDS CLARIFICATION]` > 0 | BLOCKED |
| `[NEEDS CLARIFICATION]` = 0, `[DEFERRED]` > 0 | PASSED_WITH_DEFERRED |
| `[NEEDS CLARIFICATION]` = 0, `[DEFERRED]` = 0 | PASSED |

> **SSOT:** [quality-gates.md#clarify-gate](../constitution/quality-gates.md#clarify-gate) 参照

---

## 7. 関連ファイル

| ファイル | 役割 |
|---------|------|
| `templates/inputs/add-input.md` | Feature Input テンプレート |
| `templates/inputs/fix-input.md` | Fix Input テンプレート |
| `templates/inputs/change-input.md` | Change Input テンプレート |
| `templates/inputs/project-setup-input.md` | Project Setup Input テンプレート |
| `workflows/shared/_qa-generation.md` | QA ドキュメント生成ロジック |
| `workflows/shared/_qa-analysis.md` | QA 回答分析ロジック |
| `workflows/shared/_clarify-gate.md` | CLARIFY GATE 運用手順 |
