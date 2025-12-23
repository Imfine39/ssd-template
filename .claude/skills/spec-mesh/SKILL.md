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

ARGUMENTS に基づいて適切な workflow を実行します。

| ARGUMENTS | Workflow | Description |
|-----------|----------|-------------|
| vision | workflows/vision.md | Vision Spec 作成（プロジェクト初期化） |
| design | workflows/design.md | Screen + Domain + Matrix 同時作成 |
| add | workflows/add.md | 新機能追加（Issue → Spec → 開発） |
| fix | workflows/fix.md | バグ修正（調査 → Fix Spec → 修正） |
| issue | workflows/issue.md | 既存 Issue から開発開始 |
| plan | workflows/plan.md | 実装計画作成 |
| tasks | workflows/tasks.md | タスク分割 |
| implement | workflows/implement.md | 実装実行 |
| pr | workflows/pr.md | PR 作成 |
| clarify | workflows/clarify.md | 曖昧点解消（4問バッチ） |
| change | workflows/change.md | Spec 変更（Vision/Domain/Screen） |
| **review** | workflows/review.md | **Multi-Review（3観点並列レビュー）** |
| lint | workflows/lint.md | Spec 整合性チェック |
| analyze | workflows/analyze.md | 実装 vs Spec 分析 |
| checklist | workflows/checklist.md | 要件品質チェックリスト |
| feedback | workflows/feedback.md | Spec へのフィードバック記録 |
| featureproposal | workflows/featureproposal.md | Feature 提案 |
| spec | workflows/spec.md | Spec 直接操作（上級者向け） |
| (none/help) | Show available commands |

## Instructions

1. **Parse ARGUMENTS**: 最初の単語を workflow 名として取得
2. **Route to workflow**: 対応する `workflows/{name}.md` を Read tool で読み込む
3. **Execute**: workflow の指示に従って実行

## Spec Creation Flow

Spec 作成は以下のフローで品質を担保：

```
Input → Spec 作成 → Multi-Review (3観点並列) → 修正 → Lint → [HUMAN_CHECKPOINT]
                          ↓
                    問題あり → Clarify (ユーザー対話)
```

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
| reviewer | 品質検証 | Multi-Review、Clarify、Lint、Analyze、Checklist |
| developer | 開発フロー | Plan、Tasks、Implement、PR、Feedback |

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
| Analyze | 実装完了後 | 実装 vs Spec 差分分析 |

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

## If No Arguments

利用可能なコマンド一覧を表示：

```
=== Spec-Mesh Commands ===

[プロジェクト初期化]
/spec-mesh vision      - Vision Spec 作成
/spec-mesh design      - Screen + Domain + Matrix 作成

[開発エントリーポイント]
/spec-mesh add         - 新機能追加
/spec-mesh fix         - バグ修正
/spec-mesh issue       - 既存 Issue から開始
/spec-mesh change      - Spec 変更

[開発フロー]
/spec-mesh plan        - 実装計画作成
/spec-mesh tasks       - タスク分割
/spec-mesh implement   - 実装実行
/spec-mesh pr          - PR 作成

[品質管理]
/spec-mesh review      - Multi-Review（3観点並列）
/spec-mesh clarify     - 曖昧点解消
/spec-mesh lint        - 整合性チェック
/spec-mesh analyze     - 実装分析
/spec-mesh checklist   - 品質チェックリスト
/spec-mesh feedback    - フィードバック記録
```
