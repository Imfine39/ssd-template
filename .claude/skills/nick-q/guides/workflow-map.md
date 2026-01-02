# Workflow Map

Spec-Mesh ワークフローの全体像と遷移図。

---

## 1. ワークフロー一覧

### Entry Workflows（エントリポイント）

**SKILL.md Entry セクションで処理:**

| タイプ | トリガー | 入力 | 処理 |
|--------|---------|------|------|
| add | 機能追加依頼 | add-input.md | Input → Issue → feature.md |
| fix | バグ修正依頼 | fix-input.md | Input → Impact Guard → fix.md or implement |
| change | Spec 変更依頼 | change-input.md | Input → change.md |
| issue | Issue # 指定 | GitHub Issue | 状態判定 → feature.md or fix.md or plan.md |
| quick | 軽微な変更 | 変更内容 | Impact Guard → implement or add/fix へ |
| setup | プロジェクト開始 | project-setup-input.md | Input → project-setup.md |

### Spec 作成ワークフロー

| ワークフロー | トリガー | 入力 | 出力 | 次のステップ |
|-------------|---------|------|------|-------------|
| project-setup.md | 新規プロジェクト | project-setup-input.md | Vision + Domain + Screen + Feature Drafts | issue |
| feature.md | add タイプ | add-input.md | Feature Spec | plan |
| fix.md | fix タイプ | fix-input.md | Fix Spec | plan/implement |
| change.md | change タイプ | change-input.md | 更新済み Spec | plan (必要時) |

### Develop Workflows（開発フロー）

| ワークフロー | トリガー | 入力 | 出力 | 次のステップ |
|-------------|---------|------|------|-------------|
| plan.md | Spec 承認後 | Feature/Fix Spec | Plan | tasks |
| tasks.md | Plan 承認後 | Plan | Tasks リスト | implement |
| implement.md | Tasks 確定後 | Tasks | 実装コード | test/pr |
| feedback.md | テスト失敗時 | テスト結果 | Spec/実装修正 | implement |

### Quality Workflows（品質管理）

| ワークフロー | トリガー | 入力 | 出力 | 次のステップ |
|-------------|---------|------|------|-------------|
| review.md | Spec 作成後 | Spec | レビュー結果 | lint |
| lint.md | Review 後 | Spec | Lint 結果 | spec-gate |
| clarify.md | SPEC GATE BLOCKED_CLARIFY / [DEFERRED] 解消時 | Spec + 曖昧点 | 解消済み Spec | review |
| analyze.md | 実装中 | Spec + 実装 | 差分レポート | - |
| checklist.md | 任意 | Spec | 品質スコア | - |

### Test Workflows（テスト）

| ワークフロー | トリガー | 入力 | 出力 | 次のステップ |
|-------------|---------|------|------|-------------|
| test-scenario.md | 実装完了後 | Feature Spec | テストシナリオ | e2e |
| e2e.md | シナリオ作成後 | テストシナリオ | テスト結果 | pr |

### Meta Workflows（メタ操作）

| ワークフロー | トリガー | 入力 | 出力 | 次のステップ |
|-------------|---------|------|------|-------------|
| pr.md | 実装完了 | 変更ファイル | Pull Request | - |
| change.md | Spec 変更依頼 | 既存 Spec | 更新済み Spec | review |
| featureproposal.md | 機能提案 | アイデア | Feature 候補 | add |

---

## 2. 共有コンポーネント

| コンポーネント | 役割 | 呼び出し元 |
|---------------|------|-----------|
| _quality-flow.md | QA分析 → Multi-Review → Lint → SPEC GATE | project-setup, feature, fix |
| _qa-generation.md | QA 動的生成 | feature, fix, project-setup |
| _qa-followup.md | QA フォローアップ（回答分析 + 提案確認） | project-setup, feature |
| _spec-gate.md | マーカーチェック＆ゲートキーピング（CLARIFY/OVERVIEW/DEFERRED） | 全 Spec 作成ワークフロー |
| _overview-change.md | Overview Spec 変更サブワークフロー | SPEC GATE BLOCKED_OVERVIEW 時 |
| _cascade-update.md | Spec 間の連鎖更新 | feature, fix, change |
| _finalize.md | HUMAN_CHECKPOINT 実装 | 全ワークフロー |
| _impact-guard.md | Quick 判定 / Impact Guard | SKILL.md Entry (quick, fix) |
| impact-analysis.md | 影響範囲分析 | feature, fix, change |

---

## 3. 遷移図

```
┌─────────────────────────────────────────────────────────────────────┐
│                         ユーザー依頼                                 │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │    SKILL.md Entry      │
                    │   (タイプ判定・前処理)   │
                    └───────────┬───────────┘
                                │
    ┌───────────────────────────┼───────────────────────────┐
    │               │               │               │       │
    ▼               ▼               ▼               ▼       ▼
 Vision なし    add タイプ      fix タイプ    issue タイプ  quick
    │               │               │               │       │
    ▼               ▼               ▼               ▼       ▼
┌───────────┐  ┌─────────┐    ┌─────────┐    ┌──────────┐ Impact
│ project-  │  │ feature │    │   fix   │    │状態判定  │ Guard
│   setup   │  └────┬────┘    └────┬────┘    └────┬─────┘   │
└─────┬─────┘       │               │             │         │
      │             │               │    ┌────────┼─────────┤
      │             │               │    │        │         │
      ▼             ▼               ▼    ▼        ▼         ▼
 Overview      ┌─────────────────────────────┐  plan    implement
 Specs +       │      Quality Flow           │   へ       へ
 Feature       │ (QA + Multi-Review + Lint   │
 Drafts        │  + SPEC GATE)               │
      │        └───────────┬─────────────────┘
      │                    │
      ▼            ├── BLOCKED ──► clarify ──┐
 Issue作成         │                          │
      │            │◄─────────────────────────┘
      ▼            ▼ PASSED / PASSED_WITH_DEFERRED
 issue タイプ  ┌──────────────┐
 へ誘導       │[HUMAN_CHECK- │
              │  POINT]      │
              │ Spec 承認    │
              └──────┬───────┘
                     │
                     ▼
              ┌─────────┐
              │  plan   │
              └────┬────┘
    ┌──────────────┐
    │[HUMAN_CHECK- │
    │  POINT]      │
    │ Plan 承認    │
    └──────┬───────┘
           │
           ▼
    ┌─────────┐
    │  tasks  │
    └────┬────┘
         │
         ▼
    ┌───────────┐
    │ implement │◄────────┐
    └─────┬─────┘         │
          │               │
          ▼               │
    ┌───────────┐         │
    │   test    │         │
    │(scenario +│         │
    │   e2e)    │         │
    └─────┬─────┘         │
          │               │
          ├── FAIL ───► feedback
          │
          ▼ PASS
    ┌──────────────┐
    │[HUMAN_CHECK- │
    │  POINT]      │
    │ テスト結果   │
    └──────┬───────┘
           │
           ▼
    ┌─────────┐
    │   pr    │
    └────┬────┘
         │
         ▼
    ┌─────────┐
    │  merge  │
    └─────────┘
```

---

## 4. 状態遷移

### プロジェクトフェーズ

```
initialization → vision → design → foundation → development
                   │         │           │            │
                   │         │           │            └─ 機能実装中
                   │         │           └─ Domain/Screen 確定後
                   │         └─ Vision 承認後、Design 開始
                   └─ Vision 作成中
```

### Spec ステータス

```
none → scaffold → draft → clarified → approved
         │          │          │          │
         │          │          │          └─ 人間承認済み
         │          │          └─ SPEC GATE 通過
         │          └─ 内容記入済み
         └─ テンプレート生成済み
```

### SPEC GATE 結果

> **SSOT:** [quality-gates.md](../constitution/quality-gates.md#spec-gate) 参照

PASSED / PASSED_WITH_DEFERRED / BLOCKED_CLARIFY / BLOCKED_OVERVIEW の4状態。
- `[NEEDS CLARIFICATION]` = 0 かつ `[PENDING OVERVIEW CHANGE]` = 0 で通過。
- 仮定を置いて続行 → Assumption Log に記録

### ブランチステップ

```
idle → spec → spec_review → plan → plan_review → tasks → implement → pr → (merged)
                                                            │
                                                            ▼
                                                        suspended
```

---

## 5. HUMAN_CHECKPOINT 一覧

| チェックポイント | タイミング | 判断内容 |
|-----------------|-----------|---------|
| Spec Approval | Quality Flow 完了後 | Spec 内容の承認 |
| Plan Approval | plan.md 完了後 | 実装計画の承認 |
| Feedback Recording | 実装中の発見 | Spec への反映判断 |
| Test Result Review | E2E 完了後 | テスト結果の確認 |
| Design Decision | 重要な設計判断 | 複数選択肢からの決定 |

---

## 6. Quick Reference

### ワークフロー選択（SKILL.md Entry）

| ユーザーの言葉 | タイプ | 遷移先 |
|---------------|-------|--------|
| 「新しいプロジェクトを始めたい」 | setup | project-setup.md |
| 「〇〇機能を追加したい」 | add | feature.md |
| 「バグを直したい」「エラーが出る」 | fix | fix.md or implement |
| 「Spec を変更」「M-* を修正」 | change | change.md |
| 「Issue #123 を開始」 | issue | 状態に応じて振り分け |
| 「typo を修正」「軽微な変更」 | quick | implement or add/fix |
| 「レビューして」 | - | review.md |
| 「PR を作成」 | - | pr.md |

### スクリプト対応

| 操作 | スクリプト |
|------|-----------|
| 状態確認 | `state.cjs query --all` |
| Spec 検証 | `spec-lint.cjs` |
| Matrix 生成 | `matrix-ops.cjs generate` |
| Matrix 検証 | `matrix-ops.cjs validate` |
| PR 作成 | `pr.cjs --title "..." --body "..."` |
| ブランチ作成 | `branch.cjs --type feature --slug name` |

---

## 関連ドキュメント

- [Core Constitution](../constitution/core.md)
- [Quality Gates](../constitution/quality-gates.md)
- [ID Naming Guide](./id-naming.md)
- [Error Recovery Guide](./error-recovery.md)
