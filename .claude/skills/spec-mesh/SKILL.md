---
name: spec-mesh
description: |
  Spec-Driven Development (SSD) orchestrator for managing specifications, features, and implementation workflows.
  Use when the user wants to create Vision/Domain/Screen/Feature specs, add features, fix bugs,
  create implementation plans, or manage PR workflows. Triggers on keywords like "spec", "feature",
  "vision", "domain", "implement", "plan", "PR", or Japanese equivalents like "仕様", "機能追加", "バグ修正".
---

# Spec-Mesh - SSD Orchestrator

Spec-Driven Development の全工程を管理するオーケストレーター。

## Routing

ユーザーの意図に基づいて適切な workflow を実行します。

| ユーザーの意図 | Workflow | Description |
|---------------|----------|-------------|
| 「Vision を作成」「プロジェクトを始めたい」 | workflows/vision.md | Vision Spec 作成（プロジェクト初期化） |
| 「画面設計」「Design を作成」 | workflows/design.md | Screen + Domain + Matrix 同時作成 |
| 「機能を追加」「〇〇機能を作りたい」 | workflows/add.md | 新機能追加（Issue → Spec → 開発） |
| 「バグを修正」「エラーを直して」 | workflows/fix.md | バグ修正（調査 → Fix Spec → 修正） |
| 「Issue #N から開始」 | workflows/issue.md | 既存 Issue から開発開始 |
| 「実装計画」「Plan を作成」 | workflows/plan.md | 実装計画作成 |
| 「タスク分割」 | workflows/tasks.md | タスク分割 |
| 「実装して」 | workflows/implement.md | 実装実行 |
| 「PR を作成」 | workflows/pr.md | PR 作成 |
| 「曖昧点を解消」 | workflows/clarify.md | 曖昧点解消（4問バッチ） |
| 「Spec を変更」「M-* を修正」 | workflows/change.md | Spec 変更（Vision/Domain/Screen） |
| 「レビュー」「品質チェック」 | workflows/review.md | Multi-Review（3観点並列レビュー） |
| 「Lint 実行」 | workflows/lint.md | Spec 整合性チェック |
| 「実装と Spec を比較」 | workflows/analyze.md | 実装 vs Spec 分析 |
| 「品質スコアを測定」 | workflows/checklist.md | 要件品質チェックリスト |
| 「フィードバックを記録」 | workflows/feedback.md | Spec へのフィードバック記録 |
| 「Feature を提案して」 | workflows/featureproposal.md | Feature 提案 |
| 「Spec を直接編集」 | workflows/spec.md | Spec 直接操作（上級者向け） |
| 「テストシナリオを作成」 | workflows/test-scenario.md | Test Scenario Spec 作成 |
| 「E2E テスト実行」 | workflows/e2e.md | E2E テスト実行（Chrome 拡張） |

## Instructions

1. **Parse user intent**: ユーザーの発言から意図を判断
2. **Route to workflow**: 対応する `workflows/{name}.md` を Read tool で読み込む
3. **Execute**: workflow の指示に従って実行

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
│    ↓                                                            │
│ 4. Multi-Review (3観点並列) → AI修正可能な問題を自動修正       │
│    ↓                                                            │
│ 5. Lint 実行                                                    │
│    ↓                                                            │
│ 6. [HUMAN_CHECKPOINT] ← Spec 内容を確認                         │
│    ↓                                                            │
│    [NEEDS CLARIFICATION] あり?                                  │
│    ├─ YES → Spec Clarify → Step 4 へ戻る（ループ）             │
│    │                                                            │
│    └─ NO → ★ CLARIFY GATE 通過 ★                               │
│                                                                 │
│ ════════════════════════════════════════════════════════════════│
│ ★ CLARIFY GATE: [NEEDS CLARIFICATION] = 0 が Plan の前提条件   │
│ ════════════════════════════════════════════════════════════════│
│                                                                 │
│ 7. Plan → [HUMAN_CHECKPOINT]                                    │
│    ↓                                                            │
│ 8. Tasks → Implement → PR                                       │
└─────────────────────────────────────────────────────────────────┘
```

**2段階の曖昧点解消（ハイブリッド方式）**

| 段階 | タイミング | 対象 | 方法 |
|------|-----------|------|------|
| 入力検証 | Spec作成前 | 入力の必須項目・明らかな不足 | ユーザーに追加入力を要求 |
| Spec Clarify | Multi-Review後 | Spec内の[NEEDS CLARIFICATION] | 曖昧点解消ワークフローで解消 |

**重要: CLARIFY GATE**
- **Plan に進む前提条件:** `[NEEDS CLARIFICATION]` マーカーが 0 件であること
- 曖昧点が残っている状態で Plan に進むことは禁止
- Clarify → Multi-Review → Lint のループを曖昧点解消まで繰り返す

### Multi-Review (Spec 作成後に自動実行)

Spec 作成後、`workflows/review.md` を実行して 3 つの観点から並列レビュー：

| Reviewer | 観点 | チェック内容 |
|----------|------|-------------|
| A | 構造・形式 | Template準拠、ID命名、Markdown構文 |
| B | 内容・整合性 | 入力との一致、矛盾、用語統一 |
| C | 完全性・網羅性 | 入力網羅、スコープ欠落、カバレッジ |

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

## Core Rules

1. **Spec-First**: 画面変更は Screen Spec 更新後に Feature Spec
2. **Constitution 遵守**: constitution.md の Engineering Constitution が最優先
3. **Multi-Review 必須**: Spec 作成後は必ず 3観点レビューを実行
4. **HUMAN_CHECKPOINT**: Plan 承認、Spec 承認は必ず人間確認

## Quick Reference

- Constitution: [constitution.md](constitution.md)
- Templates: `templates/` ディレクトリ
- Guides: `guides/` ディレクトリ
- Agents: `.claude/agents/` ディレクトリ

## Available Workflows

利用可能なワークフロー一覧：

```
=== Spec-Mesh Workflows ===

[プロジェクト初期化]
「Vision を作成して」      - Vision Spec 作成
「画面設計して」          - Screen + Domain + Matrix 作成

[開発エントリーポイント]
「機能を追加したい」      - 新機能追加
「バグを修正して」        - バグ修正
「Issue #N から開始」     - 既存 Issue から開始
「Spec を変更して」       - Spec 変更

[開発フロー]
「実装計画を作成」        - 実装計画作成
「タスク分割して」        - タスク分割
「実装して」              - 実装実行
「PR を作成」             - PR 作成

[品質管理]
「レビューして」          - Multi-Review（3観点並列）
「曖昧点を解消」          - 曖昧点解消
「Lint 実行」             - 整合性チェック
「実装を分析」            - 実装分析
「品質チェック」          - 品質チェックリスト
「フィードバック記録」    - フィードバック記録

[テスト]
「テストシナリオ作成」    - Test Scenario Spec 作成
「E2E テスト実行」        - E2E テスト実行（Chrome 拡張）
```
