# QA 回答分析

ユーザーの QA ドキュメント回答を分析し、Spec 作成に必要な情報を抽出する共通コンポーネント。

## 使用タイミング

QA ドキュメントにユーザーが回答した後、Spec 作成前に実行。

## 分析フロー

```
QA ドキュメント読み込み
    ↓
回答状況チェック
    ↓
未回答項目あり? → YES → AskUserQuestion で確認
    ↓ NO
回答内容を構造化
    ↓
Spec 作成に渡す
```

## Step 1: 回答状況チェック

### 1.1 マーカー別カウント

```
Grep tool:
  pattern: "\[必須\]"
  path: .specify/qa/{qa-file}.md
  output_mode: count
```

同様に `[確認]`, `[提案]`, `[選択]` もカウント。

### 1.2 回答状況判定

```markdown
| マーカー | 総数 | 回答済 | 未回答 |
|----------|------|--------|--------|
| [必須] | N | n1 | N-n1 |
| [確認] | M | m1 | M-m1 |
| [提案] | P | p1 | P-p1 |
| [選択] | S | s1 | S-s1 |
```

### 1.3 判定ロジック

```
if 未回答の [必須] > 0:
    → AskUserQuestion で確認（必須）
    → それでも未回答の場合:
        → Spec に [NEEDS CLARIFICATION: {質問内容}] を記入
        → ★ CLARIFY GATE でブロックされる

if 未回答の [確認] > 0:
    → AI の推測をデフォルトとして採用
    → ただし重要な項目は AskUserQuestion で確認

if 未回答の [提案] > 0:
    → 不採用として処理

if 未回答の [選択] > 0:
    → AskUserQuestion で確認
    → それでも未回答の場合:
        → Spec に [NEEDS CLARIFICATION: 選択が必要: {選択肢}] を記入
```

### 1.4 [NEEDS CLARIFICATION] マーカー生成

**未回答 [必須] が残った場合の処理:**

```markdown
# Spec 作成時のマーカー生成例

## Before (QA 未回答)
Q1.2: 対象ユーザーは誰ですか？ [必須]
回答: (未記入)

## After (Spec 内)
### 3. Actors
[NEEDS CLARIFICATION: 対象ユーザーの特定が必要。ユーザーロールと権限を明確にしてください。]
```

**重要ルール:**
1. `[NEEDS CLARIFICATION]` は具体的な質問内容を含める
2. どの Spec セクションに配置するかは QA→Spec マッピングに従う
3. マーカーがある Spec は CLARIFY GATE で BLOCKED となる

## Step 2: AskUserQuestion での補完

未回答・不明項目がある場合、最大 4 問ずつバッチで確認：

```
AskUserQuestion:
  questions:
    - question: "{質問1}"
      header: "Q1"
      options:
        - label: "オプションA"
          description: "説明A"
        - label: "オプションB"
          description: "説明B"
      multiSelect: false
    - question: "{質問2}"
      ...
```

### 質問の優先順位

1. **Critical** - Spec 作成に必須な情報
2. **Important** - 設計判断に影響する情報
3. **Nice-to-have** - あれば良い情報

Critical のみ確認し、他は AI が妥当な値を推測。

## Step 3: 回答の構造化

QA 回答を Spec セクションにマッピング：

### Project Setup の場合

| QA セクション | Spec セクション |
|--------------|----------------|
| 基本情報 | Vision Spec Section 1-2 |
| 機能要件 | Vision Spec Section 3 (Feature Hints) |
| 非機能要件 | Vision Spec Section 4 |
| 画面構成 | Screen Spec |
| データ項目 | Domain Spec |

### Add の場合

| QA セクション | Spec セクション |
|--------------|----------------|
| 機能目的 | Feature Spec Section 1 |
| ユーザーストーリー | Feature Spec Section 4 |
| 機能要件 | Feature Spec Section 5 |
| 関連データ | Feature Spec Section 2 |

### Fix の場合

| QA セクション | Spec セクション |
|--------------|----------------|
| 問題の症状 | Fix Spec Section 1 |
| 再現手順 | Fix Spec Section 2 |
| 期待動作 | Fix Spec Section 3 |
| 根本原因 | Fix Spec Section 4 |

## Step 4: 提案の反映

採用された提案を Spec に反映。**採否には必ず理由を記録**する：

```markdown
### 提案の採否決定

| ID | 提案内容 | 採否 | 理由 | 反映先 |
|----|---------|------|------|--------|
| P4.1 | 検索機能追加 | ✅ 採用 | MVP に必要な機能 | Feature Hints に追加 |
| P4.2 | 多言語対応 | ❌ 不採用 | Phase 2 で対応予定 | - |
| P4.3 | ログ設計 | ✅ 採用 | 運用時に必須 | 非機能要件に追加 |
| P4.4 | キャッシュ | 🔶 要検討 | パフォーマンス測定後に判断 | [DEFERRED] |
```

> **重要:** 不採用・要検討の理由は、後の意思決定の参考になるため必ず記録する。

## [DEFERRED] マーカーの取り扱い

**重要:** `[DEFERRED]` マーカーは clarify ワークフローで意図的に付与されたものであり、QA 分析で変更しない。

```
[DEFERRED] の処理ルール:

1. 既存の [DEFERRED] マーカーは保持する
2. [DEFERRED] を [NEEDS CLARIFICATION] に変換しない
3. CLARIFY GATE は [DEFERRED] を PASSED_WITH_DEFERRED として処理

# 例：既存の [DEFERRED] がある Spec
### 4. Non-Functional Requirements
[DEFERRED:PERF-001] パフォーマンス要件は負荷テスト後に決定

→ QA 分析後も上記マーカーは変更せず保持
```

**[DEFERRED] vs [NEEDS CLARIFICATION]:**

| マーカー | 意味 | CLARIFY GATE |
|---------|------|--------------|
| `[NEEDS CLARIFICATION]` | 解消必須の曖昧点 | BLOCKED |
| `[DEFERRED:*]` | 意図的に後回しにした項目 | PASSED_WITH_DEFERRED |

> **SSOT:** [quality-gates.md#clarify-gate](../../constitution/quality-gates.md#clarify-gate) 参照

---

## 出力

分析完了後、以下を出力：

```markdown
=== QA 分析完了 ===

回答状況:
- [必須]: 5/5 (100%)
- [確認]: 3/4 (75%) - 1件は AI 推測採用
- [提案]: 3/4 決定済み (1件 [DEFERRED])
- [選択]: 2/2 (100%)

Spec 反映状況:
- [NEEDS CLARIFICATION]: 0 件
- [DEFERRED]: 1 件（既存を保持）

提案の採否:
| ID | 提案 | 採否 | 理由 |
|----|------|------|------|
| P4.1 | 検索機能追加 | ✅ 採用 | MVP に必要 |
| P4.2 | 多言語対応 | ❌ 不採用 | Phase 2 予定 |
| P4.3 | ログ設計 | ✅ 採用 | 運用必須 |
| P4.4 | キャッシュ | 🔶 要検討 | 測定後判断 |

Spec 作成に進みます。

{[NEEDS CLARIFICATION] > 0 の場合}
⚠️ 未解決の必須項目があります:
- Section X: [NEEDS CLARIFICATION: {質問内容}]

→ Spec 作成後、CLARIFY GATE でブロックされます。
→ clarify ワークフロー で解消してください。
```

## 次のステップ

分析完了 → Spec 作成（Vision/Feature/Fix）
