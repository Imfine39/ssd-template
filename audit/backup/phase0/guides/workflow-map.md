# Workflow Map

Spec-Mesh ワークフローの全体像と遷移図。

---

## 1. ワークフロー一覧

### Entry Workflows（エントリポイント）

| ワークフロー | トリガー | 入力 | 出力 | 次のステップ |
|-------------|---------|------|------|-------------|
| vision.md | 新規プロジェクト開始 | vision-input.md | Vision Spec | design |
| design.md | Vision 承認後 | Vision Spec | Domain/Screen Spec | add/fix/issue |
| add.md | 機能追加依頼 | add-input.md | Feature Spec | plan |
| fix.md | バグ修正依頼 | fix-input.md | Fix Spec | plan/implement |
| issue.md | Issue # 指定 | GitHub Issue | - | add または fix |
| quick.md | 軽微な変更 | 変更内容 | 直接実装 | implement/pr |

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
| lint.md | Review 後 | Spec | Lint 結果 | clarify-gate |
| clarify.md | CLARIFY GATE BLOCKED / [DEFERRED] 解消時 | Spec + 曖昧点 | 解消済み Spec | review |
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
| _quality-flow.md | Deep Interview → Multi-Review → Lint → CLARIFY GATE | vision, design, add, fix |
| _vision-interview.md | Vision 専用 3フェーズインタビュー | vision |
| _deep-interview.md | Feature/Fix 用詳細質問 | add, fix |
| _clarify-gate.md | 曖昧点チェック＆ゲートキーピング | 全 Entry |
| _cascade-update.md | Spec 間の連鎖更新 | add, fix, change |
| _finalize.md | HUMAN_CHECKPOINT 実装 | 全ワークフロー |
| impact-analysis.md | 影響範囲分析 | add, fix, change |

---

## 3. 遷移図

```
┌─────────────────────────────────────────────────────────────────────┐
│                         ユーザー依頼                                 │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │   プロジェクト状態確認   │
                    └───────────┬───────────┘
                                │
          ┌─────────────────────┼─────────────────────┐
          │                     │                     │
          ▼                     ▼                     ▼
    Vision なし           Vision あり            Issue 指定
          │              Domain なし                  │
          │                     │                     │
          ▼                     ▼                     ▼
    ┌─────────┐           ┌─────────┐           ┌─────────┐
    │ vision  │           │ design  │           │  issue  │
    └────┬────┘           └────┬────┘           └────┬────┘
         │                     │                     │
         │    ┌────────────────┘                     │
         │    │                              ┌───────┴───────┐
         │    │                              │               │
         ▼    ▼                              ▼               ▼
    ┌─────────────┐                     ┌─────────┐    ┌─────────┐
    │Quality Flow │                     │   add   │    │   fix   │
    │ (3観点Review│                     └────┬────┘    └────┬────┘
    │  + Lint     │                          │               │
    │  + CLARIFY) │                          │               │
    └──────┬──────┘                          │               │
           │                                 │               │
           ├──────── BLOCKED ──────► clarify │               │
           │                           │     │               │
           │◄──────────────────────────┘     │               │
           │                                 │               │
           ▼ PASSED / PASSED_WITH_DEFERRED   ▼               ▼
    ┌──────────────┐                    ┌─────────────────────────┐
    │[HUMAN_CHECK- │                    │      Quality Flow       │
    │  POINT]      │                    │ (Deep Interview +       │
    │ Spec 承認    │                    │  Multi-Review + Lint +  │
    └──────┬───────┘                    │  CLARIFY GATE)          │
           │                            └───────────┬─────────────┘
           │                                        │
           ▼                                        ▼ PASSED
    ┌─────────┐                              ┌──────────────┐
    │  plan   │◄─────────────────────────────│[HUMAN_CHECK- │
    └────┬────┘                              │  POINT]      │
         │                                   │ Spec 承認    │
         ▼                                   └──────────────┘
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
         │          │          └─ CLARIFY GATE 通過
         │          └─ 内容記入済み
         └─ テンプレート生成済み
```

### CLARIFY GATE 結果

> **SSOT:** [quality-gates.md](../constitution/quality-gates.md#clarify-gate) 参照

PASSED / PASSED_WITH_DEFERRED / BLOCKED の3状態。[NEEDS CLARIFICATION]=0 で通過。
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

### ワークフロー選択

| ユーザーの言葉 | 選択ワークフロー |
|---------------|-----------------|
| 「新しいプロジェクトを始めたい」 | vision.md |
| 「画面設計をしたい」 | design.md |
| 「〇〇機能を追加したい」 | add.md |
| 「バグを直したい」「エラーが出る」 | fix.md |
| 「Issue #123 を開始」 | issue.md |
| 「typo を修正」「軽微な変更」 | quick.md |
| 「レビューして」 | review.md |
| 「PR を作成」 | pr.md |

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
