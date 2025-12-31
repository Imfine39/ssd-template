---
name: spec-mesh-meta
description: |
  SSD メタ操作ワークフロー。PR作成、Spec変更、Feature提案を担当。
  トリガー: 「PR を作成」「Spec を変更」「M-* を修正」「Feature を提案して」
---

# spec-mesh-meta

仕様に関するメタ操作ワークフローを提供。

---

## Meta Operations

| Operation | Description |
|-----------|-------------|
| PR 作成 | 実装完了後の Pull Request 作成 |
| Spec 変更 | Vision/Domain/Screen Spec の変更（影響分析含む） |
| Feature 提案 | Vision/Domain から Feature 候補を提案 |

---

## Workflows

| Workflow | Description | Trigger |
|----------|-------------|---------|
| [pr.md](workflows/pr.md) | PR 作成 | 「PR を作成」 |
| [change.md](workflows/change.md) | Spec 変更（影響分析含む） | 「Spec を変更」「M-* を修正」 |
| [featureproposal.md](workflows/featureproposal.md) | Feature 提案 | 「Feature を提案して」 |

---

## Constitution References

| File | When to Read |
|------|--------------|
| [core.md](../spec-mesh/constitution/core.md) | 常時（必須） |
| [spec-creation.md](../spec-mesh/constitution/spec-creation.md) | Spec 変更時 |
| [git-workflow.md](../spec-mesh/constitution/git-workflow.md) | PR 作成時 |

---

## Cross-Skill References

| Target Skill | Workflow | When |
|--------------|----------|------|
| spec-mesh-quality | [review.md](../spec-mesh-quality/workflows/review.md) | Spec 変更時のレビュー |

---

## Impact Analysis

Spec 変更時は影響分析が必須:

```
M-*/API-*/BR-*/VR-* 変更
    ↓
影響を受ける Feature Spec を特定
    ↓
[HUMAN_CHECKPOINT] 影響範囲確認
    ↓
変更実行
```

詳細: [impact-analysis.md](../spec-mesh/workflows/shared/impact-analysis.md)

---

## Shared Resources

| Resource | Path |
|----------|------|
| Templates | `../spec-mesh/templates/` |
| Guides | `../spec-mesh/guides/` |
| Scripts | `../spec-mesh/scripts/` |
