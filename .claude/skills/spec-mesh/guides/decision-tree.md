# Workflow Selection Decision Tree

ワークフロー選択のための決定木。ユーザー依頼から適切なワークフローを特定する。

---

## 1. メイン決定木

```
ユーザー依頼を受領
    │
    ▼
┌────────────────────────────────┐
│ SKILL.md Entry                 │
│ Step 1: プロジェクト状態確認   │
└────────────────┬───────────────┘
                 │
    ┌────────────┴────────────┐
    │                         │
    ▼                         ▼
Vision Spec 存在？        Issue # 指定あり？
    │                         │
    ├─ NO → setup タイプ      ├─ YES → issue タイプ
    │       → project-setup   │        → 状態判定へ
    │                         │
    ▼ YES                     ▼ NO
    │                         │
依頼内容を分類          依頼内容を分類
（Step 2 へ）            （Step 2 へ）
```

---

## 2. 依頼内容分類（Step 2）

### 2.1 トリガーワード優先順位

| 優先度 | トリガーワード | タイプ | 遷移先 | 備考 |
|--------|---------------|-------|--------|------|
| 1 | Issue #N, #123 | issue | 状態判定 | GitHub Issue 指定 |
| 2 | バグ, エラー, 修正, 直して | fix | fix.md | 不具合対応 |
| 3 | 機能, 追加, 〇〇したい, 新規 | add | feature.md | 新機能実装 |
| 4 | Spec を変更, M-* を修正 | change | change.md | Spec 変更 |
| 5 | typo, 軽微, ちょっと | quick | Impact Guard | 軽微な変更 |
| 6 | プロジェクト開始, 新規プロジェクト | setup | project-setup.md | 新規プロジェクト |
| 7 | Plan, 計画, 実装計画 | - | plan.md | 実装計画作成 |
| 8 | レビュー, 確認, チェック | - | review.md | Spec レビュー |
| 9 | PR, プルリクエスト | - | pr.md | PR 作成 |

### 2.2 分類フローチャート

```
依頼内容を分析
    │
    ├─ "Issue #" または "#数字" を含む？
    │   └─ YES → issue タイプ → 状態判定
    │
    ├─ "バグ" "エラー" "動かない" "壊れた" を含む？
    │   └─ YES → fix タイプ → fix.md
    │
    ├─ "機能" "追加" "したい" "新規" "実装" を含む？
    │   └─ YES → add タイプ → feature.md
    │
    ├─ "Spec を変更" "M-* を修正" "定義を変更" を含む？
    │   └─ YES → change タイプ → change.md
    │
    ├─ "typo" "軽微" "ちょっと" "簡単な" を含む？
    │   └─ YES → quick タイプ → Impact Guard (_impact-guard.md)
    │
    ├─ "plan" "計画" "どう実装" を含む？
    │   └─ YES → plan.md（Spec 存在時）
    │
    └─ 判定不能
        └─ AskUserQuestion で確認
```

---

## 3. 状態別ルーティング表

### 3.1 プロジェクトフェーズ別

| phase | 許可ワークフロー | 禁止ワークフロー |
|-------|-----------------|-----------------|
| initialization | vision | add, fix, plan, tasks, implement |
| vision | vision, clarify | add, fix, plan, tasks, implement |
| design | design, clarify | plan, tasks, implement |
| foundation | add, fix, quick, clarify | - |
| development | add, fix, quick, plan, tasks, implement | - |

### 3.2 Spec ステータス別

| ステータス | 次ステップ候補 |
|-----------|---------------|
| none | scaffold-spec.cjs → draft |
| scaffold | 内容記入 → draft |
| draft | review → lint → clarify → clarified |
| clarified | HUMAN_CHECKPOINT 待ち → approved |
| approved | plan, implement へ進行可能 |

### 3.3 CLARIFY GATE 結果別

> **SSOT:** [quality-gates.md](../constitution/quality-gates.md#clarify-gate) 参照

| 結果 | 次ステップ |
|------|-----------|
| BLOCKED | clarify.md で曖昧点を解消 → review へ戻る |
| PASSED | [HUMAN_CHECKPOINT] → 承認後 plan/implement へ |
| PASSED_WITH_DEFERRED | [HUMAN_CHECKPOINT]（リスク確認）→ plan/implement へ |

---

## 4. エスカレーションパス

### 4.1 quick タイプ BLOCK 時

```
Quick Mode 判定（_impact-guard.md）
    │
    ├─ Impact Guard PASS → 直接実装（implement.md）
    │
    └─ Impact Guard BLOCK
        │
        ▼
      理由を分析
        │
        ├─ 影響範囲が広い → add タイプへ → feature.md
        ├─ バグ修正要素あり → fix タイプへ → fix.md
        └─ Spec 変更必要 → change タイプへ → change.md
```

### 4.2 add タイプで Overview Spec 未実行の場合

```
add タイプ開始（feature.md）
    │
    ▼
Domain/Screen Spec 存在確認
    │
    ├─ 存在する → 通常フロー継続
    │
    └─ 存在しない
        │
        ▼
      ユーザーに通知
        │
        ├─ "project-setup を先に実行しますか？" → YES → project-setup.md
        │
        └─ NO → Spec なしで進行（非推奨、警告表示）
```

### 4.3 fix.md エスカレーション

```
fix.md 開始
    │
    ▼
Complexity 判定
    │
    ├─ Trivial (単純修正) → 直接実装
    │
    ├─ Standard (計画必要) → plan.md へ
    │
    └─ Complex (Spec 変更必要)
        │
        ▼
      影響範囲を分析
        │
        ├─ 1 Spec のみ → feedback.md → 該当 Spec 修正
        ├─ 複数 Spec → change.md へエスカレーション
        └─ アーキテクチャ変更 → 新規 Feature として再分類
```

### 4.4 plan.md 却下時

```
plan.md 作成 → [HUMAN_CHECKPOINT]
    │
    ├─ 承認 → tasks.md へ
    │
    └─ 却下
        │
        ▼
      却下理由を分析
        │
        ├─ 技術アプローチに問題 → plan.md を再作成
        ├─ Spec に問題 → feedback.md → clarify.md → Multi-Review へ戻る
        └─ 要件自体に問題 → ユーザーと相談 → Spec 更新
```

### 4.5 implement.md で問題発生時

```
implement.md 実行中
    │
    ▼
問題を検出
    │
    ├─ [DEFERRED] 項目に遭遇
    │   ├─ clarify.md で解消
    │   └─ 仮定を置いて続行（Assumption Log）
    │
    ├─ Spec との乖離を発見
    │   └─ feedback.md → ユーザー承認 → Spec 更新 → 続行
    │
    ├─ テスト失敗
    │   ├─ 実装バグ → コード修正
    │   ├─ Spec バグ → feedback.md → clarify.md
    │   └─ テストバグ → テスト修正
    │
    └─ 技術的制約を発見
        └─ feedback.md → Spec に Implementation Notes 追加
```

---

## 5. issue タイプ 状態判定

### 5.1 判定ロジック（SKILL.md Entry）

```
Issue 情報取得 (gh issue view #N)
    │
    ▼
状態を確認
    │
    ├─ Draft Spec あり（Status: Draft）
    │   └─ Draft 読み込み → 詳細 QA → feature.md（Draft 詳細化モード）
    │
    ├─ Clarified Spec あり
    │   └─ plan.md へ（Spec 作成完了済み）
    │
    ├─ In Review Spec あり
    │   └─ Multi-Review から再開
    │
    ├─ 保存済み Input あり
    │   └─ Input 読み込み → ラベルに応じて feature.md or fix.md
    │
    └─ Spec なし + Input なし
        │
        ▼
      ラベルをチェック
        │
        ├─ [Feature] [enhancement] → 「add-input.md に記入後に再度依頼」
        ├─ [Bug] [fix] → 「fix-input.md に記入後に再度依頼」
        │
        └─ ラベルなし
            │
            ▼
          AskUserQuestion:
            "この Issue は機能追加ですか？バグ修正ですか？"
```

### 5.2 ラベル優先順位

| 優先度 | ラベル | 種別 |
|--------|-------|------|
| 1 | bug, fix, バグ | Fix |
| 2 | feature, enhancement, 機能 | Feature |
| 3 | documentation, docs | Quick（ドキュメントのみ） |
| 4 | refactor, リファクタ | Add（既存機能改善） |

---

## 6. 複合依頼の処理

### 6.1 複数ワークフローが該当する場合

```
依頼: "Issue #123 のバグを修正して、ついでに機能も追加"
    │
    ▼
複数種別を検出
    │
    ▼
AskUserQuestion:
  "複数の作業が含まれています。どちらを先に進めますか？"
    │
    ├─ バグ修正を優先 → fix タイプ → fix.md
    └─ 機能追加を優先 → add タイプ → feature.md

（完了後に次のタスクを促す）
```

### 6.2 順序依存がある場合

```
依頼: "認証機能を追加して、その後で在庫管理も追加"
    │
    ▼
依存関係を確認
    │
    ├─ 在庫管理が認証に依存 → 認証を先に実装
    │
    └─ 独立している → 並列開発可能
        └─ parallel-development.md を参照
```

---

## 7. ショートカット

| ユーザー発言 | タイプ | 遷移先 |
|-------------|-------|--------|
| "/setup" または "プロジェクトを始める" | setup | project-setup.md |
| "/add" または "機能を追加" | add | feature.md |
| "/fix" または "バグを修正" | fix | fix.md |
| "/change" または "Spec を変更" | change | change.md |
| "/quick" または "軽微な変更" | quick | _impact-guard.md |
| "/plan" または "計画を立てて" | - | plan.md |
| "/pr" または "PRを作成" | - | pr.md |

---

## 関連ドキュメント

- [Workflow Map](./workflow-map.md) - ワークフロー遷移図
- [Error Recovery Guide](./error-recovery.md) - エラー時の回復手順
- [Parallel Development](./parallel-development.md) - 並列開発ガイド
