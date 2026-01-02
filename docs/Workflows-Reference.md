# Workflows Reference 🐱

NICK-Q の全ワークフロー詳細リファレンスです。

---

## Overview

| カテゴリ | ワークフロー | 概要 |
|---------|-------------|------|
| **初期化** | project-setup | プロジェクト立ち上げ（Vision/Domain/Screen） |
| **開発** | feature, fix, change | 開発エントリーポイント |
| **実装** | plan, tasks, implement, pr | 実装フロー |
| **品質** | review, clarify, lint, analyze, checklist, feedback | 品質管理 |
| **テスト** | test-scenario, e2e | テスト |

---

## Project Initialization

### project-setup

**目的:** Vision Spec + Domain Spec + Screen Spec を作成

**入力:**
- Quick Input: `.specify/input/project-setup-input.md`（任意）
- または Claude との対話
- ワイヤーフレーム画像/ファイル（任意）

**出力:**
- `.specify/specs/{project}/overview/vision/spec.md`
- `.specify/specs/{project}/overview/domain/spec.md`
- `.specify/specs/{project}/overview/screen/spec.md`
- `.specify/matrix/cross-reference.json`

**フロー:**
1. Quick Input または対話で情報収集
2. ワイヤーフレーム処理（あれば）
3. QA 生成（動的に質問を作成）
4. QA 分析 + AskUserQuestion（残りの曖昧点を対話で解消）
5. Vision Spec 作成
6. Multi-Review（3観点並列）
7. Lint 実行
8. SPEC GATE チェック
9. [HUMAN_CHECKPOINT]
10. Domain Spec + Screen Spec 作成
11. Cross-Reference Matrix 生成
12. Foundation Issue 作成
13. 状態更新

**依頼例:**
```
「新しいプロジェクトを始めたい」
「Vision Spec を作成して」
「顧客管理システムの Vision を作って」
```

---

## Development Entry Points

### feature

**目的:** 新機能を追加（Feature Spec 作成 → 開発フロー）

**入力:**
- Quick Input: `.specify/input/add-input.md`（任意）
- または対話での機能説明
- ワイヤーフレーム画像/ファイル（任意）

**出力:**
- GitHub Issue
- `.specify/specs/{project}/features/{feature}/spec.md`

**フロー:**
1. Quick Input または対話で情報収集
2. 入力検証（必須項目確認）
3. ワイヤーフレーム処理（あれば）
4. QA 生成
5. QA 分析 + AskUserQuestion
6. Feature Spec 作成
7. Multi-Review
8. Lint 実行
9. SPEC GATE チェック
10. [HUMAN_CHECKPOINT]
11. GitHub Issue 作成
12. Feature ブランチ作成
13. 状態更新

**依頼例:**
```
「ユーザー検索機能を追加したい」
「CSV エクスポート機能を追加して」
```

---

### fix

**目的:** バグを修正（Impact Guard による判定 → Fix Spec or 直接実装）

**入力:**
- Quick Input: `.specify/input/fix-input.md`（任意）
- または対話でのバグ説明

**出力:**
- GitHub Issue
- `.specify/specs/{project}/fixes/{fix}/spec.md`（大規模の場合）

**フロー:**
1. Quick Input または対話で情報収集
2. 入力検証
3. **Impact Guard による判定**
   - 小規模 → implement ワークフローへ
   - 大規模 → Fix Spec 作成
4. （大規模の場合）QA 生成 → QA 分析
5. Fix Spec 作成（原因調査・修正方針）
6. Multi-Review
7. SPEC GATE チェック
8. [HUMAN_CHECKPOINT]
9. Issue & ブランチ作成

**Impact Guard 判定基準:**

| 基準 | 小規模（直接実装） | 大規模（Spec 作成） |
|------|-------------------|-------------------|
| 影響ファイル数 | 1-3 | 4+ |
| Spec 変更 | なし | 必要 |
| テスト影響 | 既存で十分 | 新規テスト必要 |
| API 変更 | なし | あり |
| DB スキーマ変更 | なし | あり |

**依頼例:**
```
「ログインボタンが効かないバグを直して」
「このエラーを修正して: [エラー内容]」
```

---

### change

**目的:** 既存の Spec を変更（Vision/Domain/Screen）

**入力:**
- Quick Input: `.specify/input/change-input.md`（任意）
- 変更対象の Spec
- 変更内容

**出力:**
- 更新された Spec
- 影響分析結果
- 影響を受ける Feature Spec の更新

**フロー:**
1. 変更対象選択
2. 現在の Spec 読み込み
3. 影響分析（cascade-update）
4. [HUMAN_CHECKPOINT] 影響確認
5. 変更適用
6. Matrix 更新
7. 影響を受ける Feature Spec 更新
8. Multi-Review
9. Lint 実行

**依頼例:**
```
「M-USER に email フィールドを追加して」
「SCR-002 にフィルター機能を追加して」
```

---

## Implementation Flow

### plan

**目的:** 実装計画を作成

**前提条件:**
- Feature Spec が存在し、SPEC GATE を通過していること
- `[NEEDS CLARIFICATION]` が 0 件

**入力:**
- Feature Spec
- 既存コード分析結果

**出力:**
- `.specify/specs/{project}/features/{feature}/plan.md`

**フロー:**
1. Feature Spec 読み込み
2. SPEC GATE チェック（曖昧点 = 0 必須）
3. 既存コード分析
4. 実装計画作成
   - 影響範囲
   - 実装ステップ
   - リスク評価
5. [HUMAN_CHECKPOINT] 承認

**依頼例:**
```
「実装計画を作成して」
「Plan を作って」
```

---

### tasks

**目的:** Plan を具体的なタスクに分割

**前提条件:**
- Plan が承認されていること

**入力:**
- Plan

**出力:**
- `.specify/specs/{project}/features/{feature}/tasks.md`

**フロー:**
1. Plan 読み込み
2. タスク分割
   - 各タスクの詳細
   - 依存関係
   - 完了条件
3. タスク一覧表示

**依頼例:**
```
「タスク分割して」
「Tasks を作成して」
```

---

### implement

**目的:** 実装を行う

**前提条件:**
- Tasks が作成されていること（大規模の場合）
- または Impact Guard で小規模と判定された場合

**入力:**
- Tasks
- Feature Spec
- Screen Spec / Domain Spec

**出力:**
- 実装されたコード
- テストコード

**フロー:**
1. Tasks 読み込み
2. タスクごとに実装
   - Context7 でライブラリドキュメント参照
   - Serena で既存コード解析
3. Lint・TypeCheck 実行
4. テスト実行
5. 進捗更新

**依頼例:**
```
「実装して」
「このタスクを実装して」
```

---

### pr

**目的:** Pull Request を作成

**前提条件:**
- 実装が完了していること
- テストがパスしていること

**入力:**
- 変更内容
- Feature Spec

**出力:**
- GitHub Pull Request

**フロー:**
1. 変更内容分析
2. コミット（未コミットがあれば）
3. プッシュ
4. PR 作成
   - タイトル
   - 本文（Feature Spec へのリンク）
   - テスト結果
5. PR URL 表示

**依頼例:**
```
「PR を作成して」
「プルリクエストを作って」
```

---

## Quality Assurance

### review

**目的:** Spec を 3 観点から並列レビュー（Multi-Review）

**入力:**
- レビュー対象の Spec

**出力:**
- レビュー結果
- 修正された Spec（AI 修正可能な問題）

**レビュー観点:**

| Reviewer | 観点 | チェック内容 |
|----------|------|-------------|
| A | 構造・形式 | Template 準拠、ID 命名、Markdown 構文 |
| B | 内容・整合性 | 入力との一致、矛盾、用語統一 |
| C | 完全性・網羅性 | 入力網羅、スコープ欠落、カバレッジ |

**フロー:**
1. 3 つの Reviewer Agent を並列起動
2. 各観点からレビュー
3. フィードバック統合
4. AI 修正可能な問題を自動修正
5. 結果サマリー表示

**依頼例:**
```
「この Spec をレビューして」
「Multi-Review を実行して」
```

---

### clarify

**目的:** Spec 内の `[NEEDS CLARIFICATION]` マーカーを対話で解消

**入力:**
- `[NEEDS CLARIFICATION]` を含む Spec

**出力:**
- 曖昧点が解消された Spec

**フロー:**
1. `[NEEDS CLARIFICATION]` マーカーを抽出
2. AskUserQuestion で質問（最大 4 問バッチ）
3. 回答を Spec に反映
4. 再度 Multi-Review
5. 曖昧点 = 0 になるまでループ

**依頼例:**
```
「曖昧な点を解消して」
「Clarify を実行して」
```

---

### lint

**目的:** Spec の構造・整合性を自動検証

**入力:**
- Spec ファイル群

**出力:**
- Lint 結果（エラー・警告）

**チェック内容:**
- ID 命名規則
- 必須セクション
- 参照の整合性
- Matrix との一致

**スクリプト:**
```bash
node .claude/skills/nick-q/scripts/spec-lint.cjs
node .claude/skills/nick-q/scripts/validate-matrix.cjs
```

**依頼例:**
```
「Lint を実行して」
「Spec の整合性をチェックして」
```

---

### analyze

**目的:** 実装と Spec の整合性を検証

**入力:**
- Feature Spec
- 実装されたコード

**出力:**
- 分析結果（カバレッジ、乖離）

**チェック内容:**
- Feature Spec の要件がすべて実装されているか
- Spec にない機能が追加されていないか
- API 定義と実装の一致
- ビジネスルールの実装確認

**出力例:**
```
=== Analyze Results ===

Coverage:
- Requirements: 10/10 (100%)
- APIs: 5/5 (100%)
- Business Rules: 3/3 (100%)

Deviations:
- (none)

Recommendations:
- (none)
```

**依頼例:**
```
「実装と Spec を比較して」
「analyze を実行して」
```

---

### checklist

**目的:** 品質スコアを測定（50 点満点）

**入力:**
- Feature Spec

**出力:**
- 品質スコアと詳細評価

**評価項目:**
- 要件の明確さ（10点）
- 整合性（10点）
- 完全性（10点）
- テスト可能性（10点）
- トレーサビリティ（10点）

**依頼例:**
```
「品質チェックして」
「checklist を実行して」
```

---

### feedback

**目的:** Spec へのフィードバックを記録

**入力:**
- フィードバック内容
- 対象 Spec

**出力:**
- 更新された Spec（フィードバックセクション）

**依頼例:**
```
「この Spec にフィードバックを追加して」
```

---

## Testing

### test-scenario

**目的:** Feature Spec に基づいて Test Scenario Spec を作成

**前提条件:**
- Feature Spec が承認されていること

**入力:**
- Feature Spec
- Screen Spec（画面要素情報）

**出力:**
- `.specify/specs/{project}/features/{feature}/test-scenarios.md`

**テストケース種類:**

| 接頭辞 | 種類 | 説明 |
|--------|------|------|
| TC-* | 正常系 | 基本的な動作確認 |
| TC-N* | 異常系 | エラーハンドリング |
| TC-J* | ジャーニー | 連続したフロー |

**依頼例:**
```
「テストシナリオを作成して」
「Test Scenario Spec を作って」
```

---

### e2e

**目的:** Chrome 拡張を使用して E2E テストを実行

**前提条件:**
- Test Scenario Spec が存在すること
- アプリケーションが起動していること
- Chrome ブラウザが利用可能であること
- Claude in Chrome 拡張がインストールされていること

**入力:**
- Test Scenario Spec
- テスト環境 URL

**出力:**
- テスト結果
- スクリーンショット
- GIF 記録
- 更新された Test Scenario Spec

**使用ツール:**

| ツール | 用途 |
|--------|------|
| tabs_context_mcp | ブラウザ接続 |
| tabs_create_mcp | タブ作成 |
| navigate | URL 遷移 |
| find | 要素検索 |
| form_input | フォーム入力 |
| computer | クリック、スクリーンショット |
| gif_creator | GIF 記録 |

**依頼例:**
```
「E2E テストを実行して」
「ブラウザでテストして」
```

---

## Shared Components

ワークフロー間で共有される共通コンポーネント（`workflows/shared/`）：

| コンポーネント | 目的 | 使用ワークフロー |
|---------------|------|-----------------|
| `_quality-flow.md` | 🐱 QA → 😼 Review → Lint → 🙀 SPEC GATE オーケストレーション | project-setup, feature, fix, change |
| `_qa-generation.md` | 🐱 入力ギャップに基づく動的 QA 生成 | feature, fix, project-setup |
| `_qa-analysis.md` | 🐱 QA 回答分析、残りの曖昧点特定 | 全 Spec 作成ワークフロー |
| `_spec-gate.md` | 🙀 ゲートキーピングロジック | Quality flow |
| `_cascade-update.md` | Feature Spec が M-*/API-* を追加した場合の Domain/Screen 更新 | feature, change |
| `_impact-guard.md` | 小規模/大規模スコープ判定 | Entry routing |
| `_wireframe-processing.md` | ワイヤーフレーム画像/ファイル処理 | Spec 作成 |
| `impact-analysis.md` | Feature/Fix/Change の影響範囲分析 | feature, fix, change |

---

## Quick Reference

### ワークフロー選択ガイド

| やりたいこと | ワークフロー |
|-------------|-------------|
| 新規プロジェクト開始 | project-setup |
| 新機能追加 | feature → plan → 🐈 tasks → 🐈 implement → 😽 pr |
| バグ修正 | fix → (Impact Guard) → 🐈 implement → 😽 pr |
| Spec 変更 | change |
| テスト作成 | test-scenario |
| E2E テスト実行 | e2e |
| 品質チェック | 😼 review, lint, analyze, checklist |
| 曖昧点解消 | 🐱 clarify |

### 😻 [HUMAN_CHECKPOINT] 一覧

以下のタイミングで人間の確認が必要：

| タイミング | 確認内容 |
|-----------|---------|
| project-setup 完了後 | Overview Specs（Vision/Domain/Screen）の妥当性 |
| Feature Spec 作成後 | 要件の妥当性、🙀 SPEC GATE |
| Fix Spec 作成後 | 修正方針の妥当性、🙀 SPEC GATE |
| Plan 作成後 | 実装計画の承認 |
| E2E テスト後 | テスト結果の確認 |
| change の影響分析後 | 影響範囲の確認 |

### 🙀 SPEC GATE

| Status | Condition | Action |
|--------|-----------|--------|
| 😾 BLOCKED_CLARIFY | 🙀 `[NEEDS CLARIFICATION]` ≥ 1 | clarify → 😼 Multi-Review ループ |
| 😾 BLOCKED_OVERVIEW | 📋 `[PENDING OVERVIEW CHANGE]` ≥ 1 | Overview Change → 😼 Multi-Review ループ |
| 😼 PASSED_WITH_DEFERRED | 🙀 `[NEEDS CLARIFICATION]` = 0 & 📋 `[PENDING OVERVIEW CHANGE]` = 0 & 😿 `[DEFERRED]` ≥ 1 | 😻 Human がリスク確認後進行 |
| 😸 PASSED | すべてのマーカー = 0 | Plan へ進行 |
