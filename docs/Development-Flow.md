# Development Flow

SSD-MESH における理想的な開発フローを解説します。

---

## Overview

SSD-MESH は「仕様駆動開発（Spec-Driven Development）」を実現するフレームワークです。
すべての変更は仕様から始まり、仕様に基づいて実装されます。

```
仕様（Spec）→ 計画（Plan）→ 実装（Implement）→ 検証（Test）→ PR
```

---

## Spec Hierarchy

4 層の Spec 構造：

```
┌─────────────────────────────────────────┐
│           Vision Spec                    │  プロジェクト全体の目的・ゴール
│  (プロジェクトの北極星)                   │
└────────────────┬────────────────────────┘
                 │
     ┌───────────┴───────────┐
     ▼                       ▼
┌─────────────┐       ┌─────────────┐
│ Screen Spec │ ←───→ │ Domain Spec │  設計層（相互参照）
│ (画面設計)   │       │ (データ・API) │
└──────┬──────┘       └──────┬──────┘
       │                     │
       └──────────┬──────────┘
                  ▼
         ┌───────────────┐
         │ Feature Spec  │  個別機能の詳細仕様
         │ (機能仕様)     │
         └───────┬───────┘
                 ▼
         ┌───────────────┐
         │ Test Scenario │  テストケース定義
         │    Spec       │
         └───────────────┘
```

---

## Phase 1: Project Initialization

### 1.1 Vision 作成

**目的:** プロジェクトの目的・ゴール・ユーザージャーニーを定義

```
人間: 「顧客管理システムを作りたい」
Claude: Vision Spec を作成
```

**フロー:**
```
Quick Input 記入（任意）
    ↓
Vision Spec 作成
    ↓
Multi-Review（3観点並列）
    ↓
[HUMAN_CHECKPOINT] 確認
    ↓
Clarify（曖昧点があれば）
    ↓
Vision 承認
```

**成果物:**
- `.specify/specs/{project}/overview/vision/spec.md`

### 1.2 Design（Screen + Domain）

**目的:** 画面設計とデータ・API 設計を同時に行い、整合性を確保

```
人間: 「Design を作成して」
Claude: Screen Spec + Domain Spec + Matrix を作成
```

**フロー:**
```
Vision Spec 読み込み
    ↓
Screen Spec 作成（画面一覧・遷移・ワイヤーフレーム）
    ↓
Domain Spec 作成（M-*、API-*、BR-*/VR-*）
    ↓
Cross-Reference Matrix 作成
    ↓
Multi-Review
    ↓
[HUMAN_CHECKPOINT] 確認
    ↓
Clarify
    ↓
Feature Issues 作成
    ↓
Foundation Issue 作成
```

**成果物:**
- `.specify/specs/{project}/overview/screen/spec.md`
- `.specify/specs/{project}/overview/domain/spec.md`
- `.specify/specs/{project}/overview/matrix/cross-reference.json`
- GitHub Issues（Feature ごと）

---

## Phase 2: Feature Development

### 2.1 Feature Spec 作成（add/fix/issue）

**エントリーポイント:**

| 状況 | ワークフロー | 説明 |
|------|-------------|------|
| 新機能追加 | add | Issue 作成 → Feature Spec |
| バグ修正 | fix | Issue 作成 → Fix Spec |
| 既存 Issue から | issue | Issue 読み込み → Feature Spec |

**フロー:**
```
入力検証（必須項目確認）
    ↓
Feature Spec 作成
    ↓
Multi-Review（3観点並列）
    ↓
Lint 実行
    ↓
[HUMAN_CHECKPOINT] 確認
    ↓
[NEEDS CLARIFICATION] あり?
    ├── YES → Clarify → Multi-Review へ戻る
    └── NO → CLARIFY GATE 通過
```

**CLARIFY GATE:**
- `[NEEDS CLARIFICATION]` が 0 件であることが Plan の前提条件
- 曖昧点が残った状態で実装に進むことは禁止

### 2.2 Test Scenario 作成

**目的:** Feature Spec に基づいてテストケースを定義

```
人間: 「テストシナリオを作成して」
Claude: Test Scenario Spec を作成
```

**フロー:**
```
Feature Spec 読み込み
    ↓
Test Scenario Spec 作成
    - TC-*: 単体テストケース
    - TC-N*: 異常系テストケース
    - TC-J*: ジャーニーテスト
    ↓
Multi-Review
    ↓
[HUMAN_CHECKPOINT] 確認
```

**成果物:**
- `.specify/specs/{project}/features/{feature}/test-scenarios.md`

### 2.3 Plan 作成

**目的:** 実装計画を立てる

```
人間: 「実装計画を作成して」
Claude: Plan を作成
```

**フロー:**
```
Feature Spec 読み込み
    ↓
既存コード分析（analyze）
    ↓
Plan 作成
    - 影響範囲分析
    - 実装ステップ
    - リスク評価
    ↓
[HUMAN_CHECKPOINT] 承認
```

### 2.4 Tasks 分割

**目的:** Plan を具体的なタスクに分割

```
人間: 「タスク分割して」
Claude: Tasks を作成
```

**フロー:**
```
Plan 読み込み
    ↓
Tasks 作成
    - 各タスクの詳細
    - 依存関係
    - 完了条件
```

### 2.5 Implement

**目的:** 実装を行う

```
人間: 「実装して」
Claude: コードを実装
```

**フロー:**
```
Tasks 読み込み
    ↓
タスクごとに実装
    - Context7 でライブラリドキュメント参照
    - Serena で既存コード解析
    ↓
Lint・TypeCheck 実行
    ↓
実装完了
```

### 2.6 E2E テスト

**目的:** ブラウザ操作で実動作を検証

```
人間: 「E2E テストを実行して」
Claude: Chrome 拡張でテスト実行
```

**フロー:**
```
Test Scenario Spec 読み込み
    ↓
ブラウザセッション開始
    ↓
GIF 記録開始
    ↓
テストケース実行
    - 画面操作
    - 結果検証
    - スクリーンショット
    ↓
GIF エクスポート
    ↓
Test Scenario Spec 更新（結果記録）
    ↓
[HUMAN_CHECKPOINT] 結果確認
```

### 2.7 PR 作成

**目的:** Pull Request を作成

```
人間: 「PR を作成して」
Claude: PR を作成
```

**フロー:**
```
変更内容分析
    ↓
PR 作成
    - タイトル
    - 本文（Feature Spec へのリンク）
    - テスト結果
    ↓
レビュー依頼
```

---

## Phase 3: Quality Assurance

### 継続的な品質管理

| ワークフロー | タイミング | 目的 |
|-------------|-----------|------|
| **review** | Spec 作成直後 | 3観点並列レビュー |
| **lint** | review 後 | 自動構造検証 |
| **clarify** | 曖昧点発見時 | 対話で解消 |
| **checklist** | 任意 | 品質スコア測定 |
| **analyze** | 実装完了後 | Spec vs 実装の差分分析 |
| **feedback** | いつでも | Spec へのフィードバック記録 |

### analyze ワークフロー

**目的:** 実装と Spec の整合性を検証

```
人間: 「実装と Spec を比較して」
Claude: analyze を実行
```

**チェック項目:**
- Feature Spec の要件がすべて実装されているか
- Spec にない機能が追加されていないか
- API 定義と実装の一致
- ビジネスルールの実装確認

**出力:**
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

### checklist ワークフロー

**目的:** 品質スコアを測定（50点満点）

```
人間: 「品質チェックして」
Claude: checklist を実行
```

**評価項目:**
- 要件の明確さ
- 整合性
- 完全性
- テスト可能性
- トレーサビリティ

---

## Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Phase 1: Initialization                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Vision → Multi-Review → [HUMAN] → Clarify → ✅ Vision 承認             │
│                                                                          │
│  Design → Screen Spec ←→ Domain Spec → Matrix                           │
│       → Multi-Review → [HUMAN] → Clarify → ✅ Design 承認               │
│       → Feature Issues 作成                                              │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      Phase 2: Feature Development                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  add/fix/issue → Feature Spec → Multi-Review → Lint                     │
│              → [HUMAN] → Clarify Loop → ✅ CLARIFY GATE 通過            │
│                                                                          │
│  test-scenario → Test Scenario Spec → Multi-Review → [HUMAN]            │
│                                                                          │
│  plan → Plan 作成 → [HUMAN] 承認                                         │
│                                                                          │
│  tasks → Tasks 分割                                                      │
│                                                                          │
│  implement → 実装 → Lint/TypeCheck                                       │
│                                                                          │
│  e2e → ブラウザテスト → GIF 記録 → 結果更新                              │
│                                                                          │
│  pr → PR 作成                                                            │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      Phase 3: Quality Assurance                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  analyze → Spec vs 実装の差分分析                                        │
│                                                                          │
│  checklist → 品質スコア測定                                              │
│                                                                          │
│  feedback → フィードバック記録                                           │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Best Practices

### 1. Quick Input を活用する

事前に入力ファイルを記入することで、より精度の高い Spec が生成されます。

```bash
node .claude/skills/spec-mesh/scripts/reset-input.cjs vision
# .specify/input/vision-input.md を編集
```

### 2. HUMAN_CHECKPOINT を飛ばさない

重要な判断ポイントでは必ず人間が確認します。

- Vision Spec 承認
- Design 承認
- Plan 承認
- E2E テスト結果確認

### 3. Clarify を積極的に活用する

曖昧な点は早期に解消することで、手戻りを防ぎます。

### 4. 小さな単位で進める

大きな機能は小さな Feature に分割して、レビューしやすい単位で進めます。

### 5. テストを先に考える

Feature Spec 承認後、実装前に Test Scenario を作成することで、要件の抜け漏れを防ぎます。

---

## Next Steps

- [Workflows Reference](Workflows-Reference.md) - 全ワークフロー詳細
- [Getting Started](Getting-Started.md) - セットアップガイド
