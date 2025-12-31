---
name: spec-mesh-develop
description: |
  SSD 開発フローワークフロー。実装計画、タスク分割、実装、フィードバック記録を担当。
  トリガー: 「実装計画」「Plan を作成」「タスク分割」「実装して」「フィードバックを記録」
---

# spec-mesh-develop

CLARIFY GATE 通過後の開発フローを提供。Plan → Tasks → Implement → Feedback の順次チェーン。

---

## Development Flow

```
★ CLARIFY GATE 通過 ★
    ↓
[HUMAN_CHECKPOINT] Spec 承認
    ↓
Plan 作成 → [HUMAN_CHECKPOINT]
    ↓
Tasks 分割
    ↓
Implement（実装）
    ↓
Feedback 記録（必要時）
    ↓
Test / PR へ
```

---

## Workflows

| Workflow | Description | Trigger |
|----------|-------------|---------|
| [plan.md](workflows/plan.md) | 実装計画作成 | 「実装計画」「Plan を作成」 |
| [tasks.md](workflows/tasks.md) | タスク分割 | 「タスク分割」 |
| [implement.md](workflows/implement.md) | 実装実行 | 「実装して」 |
| [feedback.md](workflows/feedback.md) | Spec へのフィードバック記録 | 「フィードバックを記録」 |

---

## Constitution References

| File | When to Read |
|------|--------------|
| [core.md](../spec-mesh/constitution/core.md) | 常時（必須） |
| [spec-creation.md](../spec-mesh/constitution/spec-creation.md) | Feedback 記録時 |
| [quality-gates.md](../spec-mesh/constitution/quality-gates.md) | HUMAN_CHECKPOINT 確認時 |

---

## Cross-Skill References

| Target Skill | Workflow | When |
|--------------|----------|------|
| spec-mesh-quality | [review.md](../spec-mesh-quality/workflows/review.md) | Plan レビュー時 |
| spec-mesh-test | [test-scenario.md](../spec-mesh-test/workflows/test-scenario.md) | 実装完了後（UI機能） |
| spec-mesh-test | [e2e.md](../spec-mesh-test/workflows/e2e.md) | テスト実行時 |
| spec-mesh-meta | [pr.md](../spec-mesh-meta/workflows/pr.md) | 実装完了後 |

---

## Shared Resources

| Resource | Path |
|----------|------|
| Templates | `../spec-mesh/templates/` |
| Guides | `../spec-mesh/guides/` |
| Scripts | `../spec-mesh/scripts/` |
