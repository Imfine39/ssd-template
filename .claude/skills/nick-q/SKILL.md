---
name: nick-q
description: |
  Spec-Driven Development (SSD) orchestrator for managing specifications, features, and implementation workflows.
  Use when the user wants to create Vision/Domain/Screen/Feature specs, add features, fix bugs,
  create implementation plans, or manage PR workflows. Triggers on keywords like "spec", "feature",
  "vision", "domain", "implement", "plan", "PR", or Japanese equivalents like "仕様", "機能追加", "バグ修正".
---

# NICK-Q - SSD Orchestrator

Spec-Driven Development の全工程を管理するオーケストレーター。

---

## 1. Entry（開発開始）

すべての開発依頼はこのセクションで処理される。

### 1.1 依頼タイプの判定

ユーザーの発言からタイプを判定：

| キーワード | タイプ |
|-----------|--------|
| 「機能を追加」「〇〇を作りたい」「新機能」 | add |
| 「バグ」「エラー」「修正」「直して」 | fix |
| 「Spec を変更」「M-* を修正」「定義を変更」 | change |
| 「Issue #N」「Issue から」 | issue |
| 「小さな変更」「ちょっと」「Quick」 | quick |
| 「プロジェクトを始める」「新規プロジェクト」 | setup |

**判定できない場合:** AskUserQuestion で確認

### 1.2 Input 確認

| タイプ | Input ファイル | 必須？ |
|--------|---------------|--------|
| add | `.specify/input/add-input.md` | 必須 |
| fix | `.specify/input/fix-input.md` | 必須 |
| change | `.specify/input/change-input.md` | 必須 |
| issue | - | 状態依存（1.5 参照） |
| quick | - | 不要 |
| setup | `.specify/input/project-setup-input.md` | 必須 |

**Input 必須タイプで未記入の場合:**
1. 該当 Input ファイルのパスをユーザーに提示
2. 「記入後に再度依頼してください」と案内
3. ワークフロー終了

### 1.3 共通前処理

1. **状態確認:**
   ```bash
   node .claude/skills/nick-q/scripts/state.cjs query --all
   ```

2. **前提条件チェック:**
   - setup 以外: Vision Spec が存在するか
   - add/fix: Domain Spec が存在するか（警告のみ）

3. **ブランチ状態確認:**
   - 既存の作業中ブランチがあれば警告

### 1.4 タイプ別処理

| タイプ | 処理 |
|--------|------|
| **add** | Input 読み込み → Issue 作成 → `feature.md` へ |
| **fix** | Input 読み込み → Impact Guard 判定（1.6 参照） → 小: `implement.md` / 大: `fix.md` へ |
| **change** | Input 読み込み → `change.md` へ |
| **issue** | 状態判定（1.5 参照） → 適切なワークフローへ |
| **quick** | Impact Guard 判定（1.6 参照） → 小: `implement.md` / 大: add/fix へ誘導 |
| **setup** | Input 読み込み → `project-setup.md` へ |

### 1.5 issue タイプの状態判定

Issue には複数の状態があり、それぞれ処理が異なる。

| 状態 | 処理 |
|------|------|
| **Draft Spec あり** | Draft 読み込み → 詳細 QA → Spec 更新 → Multi-Review → SPEC GATE |
| **Clarified Spec あり** | → `plan.md` へ（Spec 作成は完了済み） |
| **In Review Spec あり** | Multi-Review から再開 → SPEC GATE |
| **Spec なし + Input あり** | Input 読み込み → `feature.md` or `fix.md` へ |
| **Spec なし + Input なし** | 「Input に記入してから再度依頼してください」と案内 |

**Draft Spec の検出:**
```bash
# Issue body から Draft パスを抽出、または
ls .specify/specs/features/*/spec.md  # Status: Draft のものを探す
```

### 1.6 Impact Guard（Quick 判定）

> **SSOT:** [shared/_impact-guard.md](workflows/shared/_impact-guard.md)

| 基準 | 小規模（直接実装） | 大規模（Spec 経由） |
|------|-------------------|-------------------|
| 影響ファイル数 | 1-3 ファイル | 4+ ファイル |
| Spec 変更 | なし | あり |
| テスト影響 | 既存テストで OK | 新規テスト必要 |
| API 変更 | なし | あり |
| DB スキーマ変更 | なし | あり |

**判定結果:**
- 小規模（すべて「小規模」列）→ 直接 `implement.md` へ
- 大規模（1つでも「大規模」列）→ `feature.md` or `fix.md` へ

---

## 2. Workflow Routing（Entry 以外）

Entry で処理されない依頼は以下のワークフローへ直接ルーティング：

| ユーザーの意図 | Workflow | Description |
|---------------|----------|-------------|
| 「実装計画」「Plan を作成」 | workflows/plan.md | 実装計画作成 |
| 「タスク分割」 | workflows/tasks.md | タスク分割 |
| 「実装して」 | workflows/implement.md | 実装実行 |
| 「PR を作成」 | workflows/pr.md | PR 作成 |
| 「曖昧点を解消」 | workflows/clarify.md | 曖昧点解消 |
| 「レビュー」「品質チェック」 | workflows/review.md | Multi-Review |
| 「Lint 実行」 | workflows/lint.md | Spec 整合性チェック |
| 「実装と Spec を比較」 | workflows/analyze.md | 実装 vs Spec 分析 |
| 「品質スコアを測定」 | workflows/checklist.md | 要件品質チェックリスト |
| 「フィードバックを記録」 | workflows/feedback.md | Spec へのフィードバック記録 |
| 「Feature を提案して」 | workflows/featureproposal.md | Feature 提案 |
| 「Spec を直接編集」 | workflows/spec.md | Spec 直接操作（上級者向け） |
| 「テストシナリオを作成」 | workflows/test-scenario.md | Test Scenario Spec 作成 |
| 「E2E テスト実行」 | workflows/e2e.md | E2E テスト実行 |

## Instructions

1. **Parse user intent**: ユーザーの発言から意図を判断
2. **Entry チェック**: Section 1 の Entry タイプに該当するか確認
3. **Route to workflow**: 対応する `workflows/{name}.md` を Read tool で読み込む
4. **Execute**: workflow の指示に従って実行

## Spec Creation Flow

Spec 作成は以下のフローで品質を担保：

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. Entry Point (add/fix/issue)                                  │
│    ↓                                                            │
│ 2. 入力検証（厳格）                                             │
│    ├─ 必須項目不足 → ユーザーに追加入力を要求 → Step 2 へ戻る  │
│    └─ OK → 次へ                                                 │
│    ↓                                                            │
│ 3. Spec 作成                                                    │
│    ├─ Case 3（Overview 変更必要）→ [PENDING OVERVIEW CHANGE]    │
│    ↓                                                            │
│ 4. Multi-Review (3観点並列) → AI修正可能な問題を自動修正       │
│    ↓                                                            │
│ 5. Lint 実行                                                    │
│    ↓                                                            │
│ 6. ★ SPEC GATE ★                                                │
│    ├─ [NEEDS CLARIFICATION] > 0 → clarify → Step 4 へ戻る      │
│    ├─ [PENDING OVERVIEW CHANGE] > 0 → Overview Change → Step 4 │
│    └─ 両方 = 0 → [HUMAN_CHECKPOINT]                             │
│                                                                 │
│ ════════════════════════════════════════════════════════════════│
│ ★ SPEC GATE: 曖昧点 = 0 かつ Overview変更 = 0 が Plan の前提   │
│ ════════════════════════════════════════════════════════════════│
│                                                                 │
│ 7. Plan → [HUMAN_CHECKPOINT]                                    │
│    ↓                                                            │
│ 8. Tasks → Implement                                            │
│    ↓                                                            │
│ 9. (Optional) Test Scenario → E2E → [HUMAN_CHECKPOINT]          │
│    ↓                                                            │
│ 10. PR                                                          │
└─────────────────────────────────────────────────────────────────┘

※ Test Scenario / E2E は UI を含む Feature で推奨。API のみの場合はスキップ可。
```

**2段階の曖昧点解消（ハイブリッド方式）**

| 段階 | タイミング | 対象 | 方法 |
|------|-----------|------|------|
| 入力検証 | Spec作成前 | 入力の必須項目・明らかな不足 | ユーザーに追加入力を要求 |
| Spec Clarify | Multi-Review後 | Spec内の[NEEDS CLARIFICATION] | 曖昧点解消ワークフローで解消 |
| Overview Change | SPEC GATE後 | [PENDING OVERVIEW CHANGE] | Overview Change サブワークフローで解消 |

**重要: SPEC GATE**
> **SSOT:** [quality-gates.md#spec-gate](constitution/quality-gates.md#spec-gate) 参照

- **Plan に進む前提条件:**
  - `[NEEDS CLARIFICATION]` マーカーが 0 件
  - `[PENDING OVERVIEW CHANGE]` マーカーが 0 件
- 曖昧点または Overview 変更が残っている状態で Plan に進むことは禁止
- Clarify/Overview Change → Multi-Review → Lint のループを解消まで繰り返す

### Multi-Review (Spec 作成後に自動実行)

> **SSOT:** [quality-gates.md#multi-review](constitution/quality-gates.md#multi-review) 参照

Spec 作成後、`workflows/review.md` を実行して 3 観点から並列レビュー：
A: 構造・形式 | B: 内容・整合性 | C: 完全性・網羅性

## Agent Delegation

複雑なタスクは専門 Agent に委譲：

| Agent | Role | When to use |
|-------|------|-------------|
| reviewer | 品質検証 | Multi-Review、Clarify、Lint、Analyze、Checklist、Test-Scenario |
| developer | 開発フロー | Plan、Tasks、Implement、E2E、PR、Feedback |

**注意:** Spec 作成自体は Main Context で行い、品質検証を Agent に委譲する。

### Multi-Review での Agent 呼び出し

```
Task tool (parallel, subagent_type: reviewer):
  - Reviewer A: 構造・形式チェック
  - Reviewer B: 内容・整合性チェック
  - Reviewer C: 完全性・網羅性チェック
```

## Quality Tools Relationship

| Tool | タイミング | 目的 |
|------|-----------|------|
| Multi-Review | Spec 作成直後 | 3観点からの問題発見 + 修正 |
| Lint | Review 後 | 自動構造検証 |
| Checklist | Review 後（任意） | 品質スコア測定（50点満点） |
| Clarify | 曖昧点発見時 | ユーザー対話で解消 |
| Test-Scenario | Feature Spec 承認後 | テストケース作成 |
| Analyze | 実装完了後 | 実装 vs Spec 差分分析 |
| E2E | 実装完了後 | ブラウザ操作による実動作テスト |

## State Management: TodoWrite vs state.cjs

2つの状態管理ツールの役割を明確に区別する：

| ツール | スコープ | 用途 | 永続性 |
|--------|---------|------|--------|
| **TodoWrite** | セッション内 | ワークフローステップの進捗追跡 | 会話終了で消失 |
| **state.cjs** | プロジェクト全体 | Phase/Spec ステータス/ブランチ状態 | ファイルに永続化 |

### TodoWrite の使い方

- ワークフロー開始時に Todo Template を登録
- 各ステップ完了時に `completed` に更新
- ユーザーへの進捗可視化が目的

### state.cjs の使い方

```bash
# 現在の状態を確認
node .claude/skills/nick-q/scripts/state.cjs query --all

# Phase を更新
node .claude/skills/nick-q/scripts/state.cjs repo --set-phase design

# ブランチ作業開始
node .claude/skills/nick-q/scripts/state.cjs branch --start feature/123-auth

# ブランチ作業完了
node .claude/skills/nick-q/scripts/state.cjs branch --complete feature/123-auth
```

### 使い分けの原則

1. **同期は不要**: TodoWrite と state.cjs は独立して動作
2. **TodoWrite**: 「今このセッションで何をしているか」
3. **state.cjs**: 「プロジェクト全体の状態」
4. **新セッション開始時**: `state.cjs query --all` で前回の状態を確認

## Core Rules

1. **Spec-First**: 画面変更は Screen Spec 更新後に Feature Spec
2. **Constitution 遵守**: constitution/ の Engineering Constitution が最優先
3. **Multi-Review 必須**: Spec 作成後は必ず 3観点レビューを実行
4. **HUMAN_CHECKPOINT**: Plan 承認、Spec 承認は必ず人間確認

## Quick Reference

- Constitution: [constitution/core.md](constitution/core.md)
- Templates: `templates/` ディレクトリ
- Guides: `guides/` ディレクトリ
- Agents: `.claude/agents/` ディレクトリ

## Available Workflows

利用可能なワークフロー一覧：

```
=== Entry（SKILL.md Section 1 で処理） ===

add    →「機能を追加したい」    → feature.md
fix    →「バグを修正して」      → fix.md or implement.md
change →「Spec を変更して」     → change.md
issue  →「Issue #N から開始」   → 状態に応じて分岐
quick  →「小さな変更」          → implement.md or 誘導
setup  →「プロジェクト開始」    → project-setup.md


=== Spec 作成ワークフロー ===

project-setup.md    - Overview Specs + Feature Drafts 作成
feature.md          - Feature Spec 作成
fix.md              - Fix Spec 作成
change.md           - Spec 変更


=== 実装ワークフロー ===

plan.md             - 実装計画作成
tasks.md            - タスク分割
implement.md        - 実装実行
pr.md               - PR 作成


=== 品質ワークフロー ===

review.md           - Multi-Review（3観点並列）
clarify.md          - 曖昧点解消
lint.md             - 整合性チェック


=== テストワークフロー ===

test-scenario.md    - Test Scenario Spec 作成
e2e.md              - E2E テスト実行


=== その他 ===

analyze.md          - 実装 vs Spec 分析
checklist.md        - 品質チェックリスト
feedback.md         - フィードバック記録
featureproposal.md  - Feature 提案
spec.md             - Spec 直接編集（上級者向け）
```
