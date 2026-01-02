# Development Flow 🐱

NICK-Q における理想的な開発フローを解説します。

---

## Overview

NICK-Q は「仕様駆動開発（Spec-Driven Development）」を実現するフレームワークです。
すべての変更は仕様から始まり、仕様に基づいて実装されます。

```
仕様（Spec）→ 計画（Plan）→ 実装（Implement）→ 検証（Test）→ PR
```

---

## Spec Hierarchy

3 層の Spec 構造：

```
┌─────────────────────────────────────────────────────────────┐
│                    Overview Specs (WHAT)                      │
│                  プロジェクト全体の定義                         │
├───────────────────────────────────────────────────────────────┤
│ S-VISION-001  │ プロジェクトの目的・ゴール・制約               │
│ S-DOMAIN-001  │ Masters (M-*), APIs (API-*), Business Rules   │
│ S-SCREEN-001  │ 画面定義、ナビゲーション                       │
└───────────────────────────────────────────────────────────────┘
                           ↓ Referenced by
┌─────────────────────────────────────────────────────────────┐
│                    Feature Specs (HOW)                        │
│                   個別機能の詳細仕様                           │
├───────────────────────────────────────────────────────────────┤
│ S-{AREA}-{NNN}  │ Feature Spec (機能要件)                     │
│ F-{AREA}-{NNN}  │ Fix Spec (バグ修正仕様)                     │
└───────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                  Test Scenario Specs                          │
├───────────────────────────────────────────────────────────────┤
│ TS-{AREA}-{NNN} │ テストケース定義                            │
└───────────────────────────────────────────────────────────────┘
```

---

## Hybrid Discovery Model 🐱

NICK-Q は「Pre-Input + QA + AskUserQuestion」による要件発見を行います。

```
┌──────────────────────────────────────────────────────────────┐
│ 1. Pre-Input (ユーザーが事前に記入)                            │
│    Purpose: ユーザーが既に知っていることを抽出                  │
│    Structure: 機能ベース（データ、画面）                       │
└──────────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────────┐
│ 🐱 2. QA (AI が動的に生成)                                     │
│    Purpose: ユーザーが知らないことを発見                        │
│    Categories:                                                │
│    [必須] → 未回答 = 🙀 [NEEDS CLARIFICATION]                  │
│    [確認] → AI の仮定を確認                                    │
│    [提案] → 採用/却下を記録                                    │
│    [選択] → 選択肢から選択                                     │
└──────────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────────┐
│ 🐱 3. AskUserQuestion (対話的な曖昧点解消)                     │
│    Purpose: 残りの曖昧点を解消                                 │
│    Method: 選択ベース、最大 4 質問                             │
└──────────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────────┐
│ 4. Spec 作成 (QA 結果を反映)                                   │
└──────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Project Initialization

### 1.1 project-setup ワークフロー

**目的:** Vision Spec + Domain Spec + Screen Spec を作成

```
人間: 「顧客管理システムを作りたい」
Claude: project-setup ワークフローを実行
```

**フロー:**
```
Quick Input 読み込み（.specify/input/project-setup-input.md）
    ↓
ワイヤーフレーム処理（あれば）
    ↓
QA 生成（動的に質問を作成）
    ↓
QA 分析 + AskUserQuestion（残りの曖昧点を対話で解消）
    ↓
Vision Spec 作成
    ↓
Multi-Review（3観点並列）
    ↓
Lint
    ↓
SPEC GATE チェック
    ↓
[HUMAN_CHECKPOINT] 確認
    ↓
Domain Spec + Screen Spec 作成
    ↓
Cross-Reference Matrix 生成
    ↓
Foundation Issue 作成
```

**成果物:**
- `.specify/specs/{project}/overview/vision/spec.md`
- `.specify/specs/{project}/overview/domain/spec.md`
- `.specify/specs/{project}/overview/screen/spec.md`
- `.specify/matrix/cross-reference.json`

---

## Phase 2: Feature Development

### 2.1 Feature Spec 作成（feature / fix）

**エントリーポイント:**

| 状況 | ワークフロー | 説明 |
|------|-------------|------|
| 新機能追加 | feature | Issue 作成 → Feature Spec |
| バグ修正 | fix | [Impact Guard] → Fix Spec or 直接実装 |
| Spec 変更 | change | 影響分析 → Spec 更新 |

**Impact Guard による判定:**

| 基準 | 小規模（直接実装） | 大規模（Spec 作成） |
|------|-------------------|-------------------|
| 影響ファイル数 | 1-3 | 4+ |
| Spec 変更 | なし | 必要 |
| テスト影響 | 既存で十分 | 新規テスト必要 |
| API 変更 | なし | あり |
| DB スキーマ変更 | なし | あり |

**ルール:** どれか一つでも「大規模」なら Spec 作成必須

**フロー:**
```
入力検証（必須項目確認）
    ↓
ワイヤーフレーム処理（あれば）
    ↓
QA 生成（動的）
    ↓
QA 分析 + AskUserQuestion
    ↓
Feature Spec 作成
    ↓
Multi-Review（3観点並列）
    ↓
Lint 実行
    ↓
★ SPEC GATE ★
    ↓
[HUMAN_CHECKPOINT] 確認
    ↓
Issue & Branch 作成
```

### 2.2 🙀 SPEC GATE

**目的:** 曖昧点が残った状態で実装に進むことを禁止

**通過条件:**

| Status | Condition | Action |
|--------|-----------|--------|
| 😸 PASSED | 🙀 `[NEEDS CLARIFICATION]` = 0 & 😿 `[DEFERRED]` = 0 | Plan へ進行 |
| 😼 PASSED_WITH_DEFERRED | 🙀 `[NEEDS CLARIFICATION]` = 0 & 😿 `[DEFERRED]` ≥ 1 | 😻 Human がリスク確認後進行 |
| 😾 BLOCKED | 🙀 `[NEEDS CLARIFICATION]` ≥ 1 | clarify → 😼 Multi-Review ループ |

### 2.3 Test Scenario 作成

**目的:** Feature Spec に基づいてテストケースを定義

```
人間: 「テストシナリオを作成して」
Claude: test-scenario ワークフローを実行
```

**テストケース種類:**

| 接頭辞 | 種類 | 説明 |
|--------|------|------|
| TC-* | 正常系 | 基本的な動作確認 |
| TC-N* | 異常系 | エラーハンドリング |
| TC-J* | ジャーニー | 連続したフロー |

**成果物:**
- `.specify/specs/{project}/features/{feature}/test-scenarios.md`

### 2.4 Plan 作成

**目的:** 実装計画を立てる

**前提条件:**
- Feature Spec が SPEC GATE を通過していること

```
人間: 「実装計画を作成して」
Claude: plan ワークフローを実行
```

**フロー:**
```
Feature Spec 読み込み
    ↓
SPEC GATE チェック（曖昧点 = 0 必須）
    ↓
既存コード分析
    ↓
Plan 作成
    - 影響範囲
    - 実装ステップ
    - リスク評価
    ↓
[HUMAN_CHECKPOINT] 承認
```

### 2.5 Tasks 分割

**目的:** Plan を具体的なタスクに分割

```
人間: 「タスク分割して」
Claude: tasks ワークフローを実行
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

### 2.6 Implement

**目的:** 実装を行う

```
人間: 「実装して」
Claude: implement ワークフローを実行
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

### 2.7 E2E テスト

**目的:** ブラウザ操作で実動作を検証

```
人間: 「E2E テストを実行して」
Claude: e2e ワークフローを実行
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

### 2.8 PR 作成

**目的:** Pull Request を作成

```
人間: 「PR を作成して」
Claude: pr ワークフローを実行
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

### Multi-Review（3 観点）

| Reviewer | 観点 | チェック内容 |
|----------|------|-------------|
| A | 構造・形式 | Template 準拠、ID 命名、Markdown 構文 |
| B | 内容・整合性 | 入力との一致、矛盾、用語統一 |
| C | 完全性・網羅性 | 入力網羅、スコープ欠落、カバレッジ |

### analyze ワークフロー

**目的:** 実装と Spec の整合性を検証

**チェック項目:**
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

---

## Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Phase 1: Initialization                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  project-setup → 🐱 QA 生成 → 🐱 QA 分析 → Spec 作成                    │
│              → 😼 Multi-Review → Lint → 🙀 SPEC GATE                    │
│              → 😻 [HUMAN] → 😸 Specs 承認                               │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      Phase 2: Feature Development                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  feature/fix → [Impact Guard] → 🐱 QA 生成 → 🐱 QA 分析                 │
│            → Feature Spec → 😼 Multi-Review → Lint                      │
│            → 🙀 ★ SPEC GATE ★                                       │
│            │                                                            │
│            ├─ 😾 BLOCKED → clarify → 😼 Multi-Review ループ             │
│            │                                                            │
│            └─ 😸 PASSED → 😻 [HUMAN] → Spec 承認                        │
│                                                                          │
│  test-scenario → Test Scenario Spec → 😼 Multi-Review → 😻 [HUMAN]      │
│                                                                          │
│  plan → Plan 作成 → 😻 [HUMAN] 承認                                      │
│                                                                          │
│  🐈 tasks → Tasks 分割                                                   │
│                                                                          │
│  🐈 implement → 実装 → Lint/TypeCheck                                    │
│                                                                          │
│  e2e → ブラウザテスト → GIF 記録 → 結果更新                              │
│                                                                          │
│  😽 pr → PR 作成                                                         │
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
node .claude/skills/nick-q/scripts/reset-input.cjs vision
# .specify/input/project-setup-input.md を編集
```

### 2. HUMAN_CHECKPOINT を飛ばさない

重要な判断ポイントでは必ず人間が確認します。

- Spec 承認（Vision/Domain/Screen/Feature）
- Plan 承認
- E2E テスト結果確認

### 3. SPEC GATE を尊重する

曖昧な点は早期に解消することで、手戻りを防ぎます。
`[NEEDS CLARIFICATION]` が残っている状態で Plan に進むことは禁止されています。

### 4. 小さな単位で進める

大きな機能は小さな Feature に分割して、レビューしやすい単位で進めます。

### 5. テストを先に考える

Feature Spec 承認後、実装前に Test Scenario を作成することで、要件の抜け漏れを防ぎます。

---

## Next Steps

- [Workflows Reference](Workflows-Reference.md) - 全ワークフロー詳細
- [Getting Started](Getting-Started.md) - セットアップガイド
