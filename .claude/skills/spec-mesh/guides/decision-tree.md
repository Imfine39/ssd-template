# Workflow Selection Decision Tree

ワークフロー選択のための決定木。ユーザー依頼から適切なワークフローを特定する。

---

## 1. メイン決定木

```
ユーザー依頼を受領
    │
    ▼
┌────────────────────────────────┐
│ Step 1: プロジェクト状態確認   │
└────────────────┬───────────────┘
                 │
    ┌────────────┴────────────┐
    │                         │
    ▼                         ▼
Vision Spec 存在？        Issue # 指定あり？
    │                         │
    ├─ NO → vision.md         ├─ YES → issue.md
    │                         │
    ▼ YES                     ▼ NO
    │                         │
Vision が approved？    依頼内容を分類
    │                   （Step 2 へ）
    ├─ NO → vision.md（継続）
    │
    ▼ YES
    │
Domain/Screen Spec 存在？
    │
    ├─ NO → design.md
    │
    ▼ YES
    │
依頼内容を分類（Step 2 へ）
```

---

## 2. 依頼内容分類（Step 2）

### 2.1 トリガーワード優先順位

| 優先度 | トリガーワード | ワークフロー | 備考 |
|--------|---------------|-------------|------|
| 1 | Issue #N, #123 | issue.md | GitHub Issue 指定 |
| 2 | バグ, エラー, 修正, 直して | fix.md | 不具合対応 |
| 3 | 機能, 追加, 〇〇したい, 新規 | add.md | 新機能実装 |
| 4 | typo, 軽微, ちょっと | quick.md | 軽微な変更（Impact Guard） |
| 5 | 画面設計, Design, デザイン | design.md | 画面仕様作成 |
| 6 | Vision, プロジェクト開始, 新規プロジェクト | vision.md | ビジョン定義 |
| 7 | Plan, 計画, 実装計画 | plan.md | 実装計画作成 |
| 8 | レビュー, 確認, チェック | review.md | Spec レビュー |
| 9 | PR, プルリクエスト | pr.md | PR 作成 |

### 2.2 分類フローチャート

```
依頼内容を分析
    │
    ├─ "Issue #" または "#数字" を含む？
    │   └─ YES → issue.md
    │
    ├─ "バグ" "エラー" "動かない" "壊れた" を含む？
    │   └─ YES → fix.md
    │
    ├─ "機能" "追加" "したい" "新規" "実装" を含む？
    │   └─ YES → add.md
    │
    ├─ "typo" "軽微" "ちょっと" "簡単な" を含む？
    │   └─ YES → quick.md（Impact Guard で判定）
    │
    ├─ "画面" "デザイン" "UI" "UX" を含む？
    │   └─ YES → design.md（Domain 存在時は add.md へ誘導）
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

### 4.1 quick.md BLOCK 時

```
Quick Mode 判定
    │
    ├─ Impact Guard PASS → 直接実装
    │
    └─ Impact Guard BLOCK
        │
        ▼
      理由を分析
        │
        ├─ 影響範囲が広い → add.md へエスカレーション
        ├─ バグ修正要素あり → fix.md へエスカレーション
        └─ Spec 変更必要 → change.md へエスカレーション
```

### 4.2 add.md で Design 未実行の場合

```
add.md 開始
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
        ├─ "Design を先に実行しますか？" → YES → design.md
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

## 5. issue.md 種別判定

### 5.1 判定ロジック

```
Issue 情報取得 (gh issue view #N)
    │
    ▼
ラベルをチェック
    │
    ├─ [Feature] [enhancement] [新機能] → add.md
    ├─ [Bug] [fix] [バグ] → fix.md
    │
    └─ ラベルなし
        │
        ▼
      タイトル/本文を分析
        │
        ├─ "バグ" "エラー" "修正" → fix.md
        ├─ "機能" "追加" "実装" → add.md
        │
        └─ 判定不能
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
    ├─ バグ修正を優先 → fix.md
    └─ 機能追加を優先 → add.md

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

| ユーザー発言 | 即座に選択 |
|-------------|-----------|
| "/vision" または "ビジョンを作成" | vision.md |
| "/add" または "機能を追加" | add.md |
| "/fix" または "バグを修正" | fix.md |
| "/quick" または "軽微な変更" | quick.md |
| "/design" または "画面設計" | design.md |
| "/plan" または "計画を立てて" | plan.md |
| "/pr" または "PRを作成" | pr.md |

---

## 関連ドキュメント

- [Workflow Map](./workflow-map.md) - ワークフロー遷移図
- [Error Recovery Guide](./error-recovery.md) - エラー時の回復手順
- [Parallel Development](./parallel-development.md) - 並列開発ガイド
