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

if 未回答の [確認] > 0:
    → AI の推測をデフォルトとして採用
    → ただし重要な項目は AskUserQuestion で確認

if 未回答の [提案] > 0:
    → 不採用として処理

if 未回答の [選択] > 0:
    → AskUserQuestion で確認
```

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

採用された提案を Spec に反映：

```markdown
### 採用された提案

| ID | 提案内容 | 反映先 |
|----|---------|--------|
| P4.1 | 検索機能追加 | Feature Hints に追加 |
| P4.3 | ログ設計 | 非機能要件に追加 |
```

## 出力

分析完了後、以下を出力：

```markdown
=== QA 分析完了 ===

回答状況:
- [必須]: 5/5 (100%)
- [確認]: 3/4 (75%) - 1件は AI 推測採用
- [提案]: 2/3 採用
- [選択]: 2/2 (100%)

採用された提案:
- P4.1: 検索機能追加
- P4.3: ログ設計

Spec 作成に進みます。
```

## 次のステップ

分析完了 → Spec 作成（Vision/Feature/Fix）
