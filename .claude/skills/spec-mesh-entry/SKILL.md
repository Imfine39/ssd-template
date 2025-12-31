---
name: spec-mesh-entry
description: |
  SSD 作業開始ワークフロー。Vision作成、Design、機能追加、バグ修正、Issue開始、Quick変更を担当。
  トリガー: 「Vision を作成」「画面設計」「機能を追加」「バグを修正」「Issue から開始」「Quick Mode」
---

# spec-mesh-entry

作業開始点となるワークフローを提供。すべての開発作業はこのスキルから開始する。

---

## Spec Creation Flow

```
Entry (vision/design/add/fix/issue/quick)
    ↓
入力検証（必須項目確認）
    ↓
Spec 作成
    ↓
深掘りインタビュー（必須）← AskUserQuestion で潜在課題を発掘
    ↓
Multi-Review → Lint → CLARIFY GATE → Plan...
```

---

## Workflows

| Workflow | Description | Trigger |
|----------|-------------|---------|
| [vision.md](workflows/vision.md) | Vision Spec 作成（プロジェクト初期化） | 「Vision を作成」「プロジェクトを始めたい」 |
| [design.md](workflows/design.md) | Screen + Domain + Matrix 同時作成 | 「画面設計」「Design を作成」 |
| [add.md](workflows/add.md) | 新機能追加（Issue → Spec → 開発） | 「機能を追加」「〇〇機能を作りたい」 |
| [fix.md](workflows/fix.md) | バグ修正（調査 → Fix Spec → 修正） | 「バグを修正」「エラーを直して」 |
| [issue.md](workflows/issue.md) | 既存 Issue から開発開始 | 「Issue #N から開始」 |
| [quick.md](workflows/quick.md) | 小規模変更（Spec 簡略化） | 「Quick Mode」「small change」 |

---

## Constitution References

| File | When to Read |
|------|--------------|
| [core.md](../spec-mesh/constitution/core.md) | 常時（必須） |
| [spec-creation.md](../spec-mesh/constitution/spec-creation.md) | Spec 作成時 |
| [git-workflow.md](../spec-mesh/constitution/git-workflow.md) | ブランチ・Issue 作成時 |

---

## Cross-Skill References

| Target Skill | Workflow | When |
|--------------|----------|------|
| spec-mesh-quality | [review.md](../spec-mesh-quality/workflows/review.md) | Multi-Review 実行時 |
| spec-mesh-quality | [clarify.md](../spec-mesh-quality/workflows/clarify.md) | 曖昧点解消時 |
| spec-mesh-quality | [lint.md](../spec-mesh-quality/workflows/lint.md) | Lint 実行時 |
| spec-mesh-develop | [plan.md](../spec-mesh-develop/workflows/plan.md) | CLARIFY GATE 通過後 |

---

## Shared Resources

| Resource | Path |
|----------|------|
| Templates | `../spec-mesh/templates/` |
| Guides | `../spec-mesh/guides/` |
| Scripts | `../spec-mesh/scripts/` |
| Interview Guide | `../spec-mesh/workflows/shared/_interview.md` |
