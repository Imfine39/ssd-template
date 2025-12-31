---
name: spec-mesh
description: |
  Spec-Driven Development (SSD) ハブスキル。共有リソースを保持し、子スキルへルーティングする。
  トリガー: "spec", "feature", "vision", "domain", "implement", "plan", "PR", "仕様", "機能追加", "バグ修正"
---

# Spec-Mesh - SSD Hub Skill

Spec-Driven Development の共有リソースを保持し、子スキルへルーティングするハブ。

---

## Skill Routing

ユーザーの意図に基づいて適切な子スキルへルーティング：

| ユーザーの意図 | 子スキル | ワークフロー |
|---------------|----------|-------------|
| Vision作成、Design、機能追加、バグ修正、Issue開始 | [spec-mesh-entry](../spec-mesh-entry/SKILL.md) | vision, design, add, fix, issue, quick |
| 実装計画、タスク分割、実装、フィードバック | [spec-mesh-develop](../spec-mesh-develop/SKILL.md) | plan, tasks, implement, feedback |
| レビュー、Lint、曖昧点解消、品質チェック | [spec-mesh-quality](../spec-mesh-quality/SKILL.md) | review, clarify, lint, checklist, analyze |
| テストシナリオ、E2Eテスト | [spec-mesh-test](../spec-mesh-test/SKILL.md) | test-scenario, e2e |
| PR作成、Spec変更、Feature提案 | [spec-mesh-meta](../spec-mesh-meta/SKILL.md) | pr, change, featureproposal |

---

## Spec Creation Flow

```
Entry (vision/design/add/fix/issue)
    ↓
入力検証（必須項目確認）
    ↓
Spec 作成
    ↓
深掘りインタビュー（必須）← AskUserQuestion で潜在課題を発掘
    ↓
Multi-Review（3観点並列） → AI修正
    ↓
Lint
    ↓
[NEEDS CLARIFICATION] あり? → YES: Clarify → Multi-Review へ戻る
    ↓ NO
★ CLARIFY GATE 通過 ★
    ↓
[HUMAN_CHECKPOINT] Spec 承認
    ↓
Plan → Tasks → Implement → PR
```

---

## Constitution (分割済み)

| File | Purpose | When to Read |
|------|---------|--------------|
| [core.md](constitution/core.md) | 最重要ルール、Spec Creation Flow | 常時（必須） |
| [spec-creation.md](constitution/spec-creation.md) | Spec作成ルール、テンプレート | Spec作成時 |
| [quality-gates.md](constitution/quality-gates.md) | CLARIFY GATE、Multi-Review、HUMAN_CHECKPOINT | Review/Clarify時 |
| [git-workflow.md](constitution/git-workflow.md) | ブランチ、PR、マージ | Git操作時 |
| [terminology.md](constitution/terminology.md) | ID形式、ステータス値 | 参照時 |

---

## Shared Resources

このハブスキルは以下の共有リソースを保持：

| Resource | Path | Description |
|----------|------|-------------|
| Constitution | `constitution/` | 分割された Constitution ファイル |
| Templates | `templates/` | Spec テンプレート |
| Guides | `guides/` | 詳細ガイド |
| Scripts | `scripts/` | 自動化スクリプト |
| Shared Workflows | `workflows/shared/` | 共通コンポーネント |

---

## Agent Delegation

| Agent | Role | When to use |
|-------|------|-------------|
| reviewer | 品質検証 | Multi-Review、Clarify、Lint、Analyze、Checklist |
| developer | 開発フロー | Plan、Tasks、Implement、E2E、PR |

---

## State Management

| ツール | スコープ | 用途 |
|--------|---------|------|
| **TodoWrite** | セッション内 | ワークフローステップの進捗追跡 |
| **state.cjs** | プロジェクト全体 | Phase/Spec ステータス/ブランチ状態 |

```bash
# 状態確認
node .claude/skills/spec-mesh/scripts/state.cjs query --all
```

---

## Core Rules

1. **Spec-First**: すべての変更は仕様から
2. **Constitution 遵守**: [core.md](constitution/core.md) が最優先
3. **Multi-Review 必須**: Spec 作成後は必ず 3観点レビュー
4. **深掘りインタビュー必須**: Spec 作成後、Multi-Review 前に実施
5. **HUMAN_CHECKPOINT**: 重要な判断は人間確認
