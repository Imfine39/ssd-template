---
name: spec-mesh-quality
description: |
  SSD 品質保証ワークフロー。Multi-Review、曖昧点解消、Lint、品質チェック、実装分析を担当。
  トリガー: 「レビュー」「品質チェック」「曖昧点を解消」「Lint 実行」「実装と Spec を比較」「品質スコアを測定」
---

# spec-mesh-quality

品質保証ワークフローを提供。他の多くのワークフローから呼び出される中核スキル。

---

## Quality Flow

```
Spec 作成後
    ↓
Multi-Review（3観点並列）
    ↓
Lint（自動構造検証）
    ↓
[NEEDS CLARIFICATION] あり?
    ├─ YES → Clarify → Multi-Review へ戻る
    └─ NO → ★ CLARIFY GATE 通過 ★
```

---

## Workflows

| Workflow | Description | Trigger |
|----------|-------------|---------|
| [review.md](workflows/review.md) | Multi-Review（3観点並列レビュー） | 「レビュー」「品質チェック」 |
| [clarify.md](workflows/clarify.md) | 曖昧点解消（4問バッチ） | 「曖昧点を解消」 |
| [lint.md](workflows/lint.md) | Spec 整合性チェック | 「Lint 実行」 |
| [checklist.md](workflows/checklist.md) | 要件品質チェックリスト | 「品質スコアを測定」 |
| [analyze.md](workflows/analyze.md) | 実装 vs Spec 分析 | 「実装と Spec を比較」 |

---

## Constitution References

| File | When to Read |
|------|--------------|
| [core.md](../spec-mesh/constitution/core.md) | 常時（必須） |
| [quality-gates.md](../spec-mesh/constitution/quality-gates.md) | 全ワークフローで必須 |

---

## Multi-Review Perspectives

| Reviewer | Focus | Checks |
|----------|-------|--------|
| A: 構造 | Template準拠、形式 | セクション構造、ID命名規則、必須項目 |
| B: 内容 | 整合性、矛盾 | 用語統一、要件間の矛盾、依存関係 |
| C: 完全性 | 網羅性、欠落 | スコープカバレッジ、エッジケース、未定義項目 |

---

## Shared Resources

| Resource | Path |
|----------|------|
| Interview Guide | `../spec-mesh/workflows/shared/_interview.md` |
| Scripts | `../spec-mesh/scripts/` |
