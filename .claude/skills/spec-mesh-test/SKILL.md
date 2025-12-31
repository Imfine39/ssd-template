---
name: spec-mesh-test
description: |
  SSD テストワークフロー。テストシナリオ作成、E2Eテスト実行を担当。
  トリガー: 「テストシナリオを作成」「E2E テスト実行」
---

# spec-mesh-test

テスト関連ワークフローを提供。UI を含む Feature で推奨。

---

## Test Flow

```
Feature Spec 承認後
    ↓
Test Scenario Spec 作成
    ↓
実装完了後
    ↓
E2E テスト実行（Chrome 拡張）
    ↓
[HUMAN_CHECKPOINT] テスト結果確認
    ↓
PR へ
```

---

## Workflows

| Workflow | Description | Trigger |
|----------|-------------|---------|
| [test-scenario.md](workflows/test-scenario.md) | Test Scenario Spec 作成 | 「テストシナリオを作成」 |
| [e2e.md](workflows/e2e.md) | E2E テスト実行（Chrome 拡張） | 「E2E テスト実行」 |

---

## Constitution References

| File | When to Read |
|------|--------------|
| [core.md](../spec-mesh/constitution/core.md) | 常時（必須） |
| [quality-gates.md](../spec-mesh/constitution/quality-gates.md) | テスト結果判定時 |

---

## Cross-Skill References

| Target Skill | Workflow | When |
|--------------|----------|------|
| spec-mesh-quality | [review.md](../spec-mesh-quality/workflows/review.md) | Test Scenario レビュー時 |
| spec-mesh-meta | [pr.md](../spec-mesh-meta/workflows/pr.md) | テスト完了後 |

---

## MCP Tools (E2E)

```
Claude in Chrome:
  tabs_context_mcp → tabs_create_mcp → navigate → find → form_input → computer
```

- ブラウザ操作、スクリーンショット、GIF 記録

---

## Shared Resources

| Resource | Path |
|----------|------|
| Templates | `../spec-mesh/templates/` |
| Scripts | `../spec-mesh/scripts/` |
