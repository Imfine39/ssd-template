---
description: "[DEPRECATED] Use /speckit.vision + /speckit.design instead."
---

## DEPRECATED

**このコマンドは廃止されました。**

新しいフローを使用してください：

### 新規プロジェクトの場合

```
/speckit.vision   → Vision Spec 作成（目的、ジャーニー）
/speckit.design   → Feature 提案 + Domain Spec 作成 + Foundation Issue
/speckit.issue    → 基盤構築から開始
```

### 追加 Feature の場合

```
/speckit.featureproposal  → 追加 Feature 提案
```

---

## Legacy Purpose (参考)

This command previously handled:

1. **New Project (No Overview)**: Full onboarding - creates Overview spec (scaffold), proposes Features, batch-creates Issues
2. **Existing Project (Overview exists)**: Proposes additional Features based on user intent, batch-creates Issues

This has been replaced by:
- `/speckit.vision` - Project purpose and journeys
- `/speckit.design` - Feature proposal + Domain Spec (M-*/API-*)
- `/speckit.featureproposal` - Additional feature proposals

## Steps

### Step 1: Check for existing Overview

- Look for Overview spec in `.specify/specs/overview/`
- If found: **Additional Features mode** (skip to Step 5)
- If not found: **Full Bootstrap mode** (continue to Step 2)

---

### Full Bootstrap Mode (No Overview)

2) **Parse system purpose**:
   - Extract domain, actors, outcomes, core objects from `$ARGUMENTS`
   - Identify external systems and compliance needs
   - If unclear, ask clarifying questions (max 3)

3) **Create Overview Issue and Branch**:
   ```bash
   gh label create spec --description "Specification work" --color 0E8A16 --force
   gh label create feature --description "Feature implementation" --color 1D76DB --force
   gh label create backlog --description "In backlog" --color FBCA04 --force
   gh label create in-progress --description "Work in progress" --color 7057FF --force
   ```
   ```bash
   gh issue create --title "Define System Overview Spec" --body "## Purpose
   [システム概要の説明]

   ## Scope
   - Domain: [ドメイン]
   - Actors: [アクター]
   - Core entities: [主要エンティティ（予定）]

   ## Next Steps
   1. Overview Spec を作成
   2. /speckit.clarify で詳細化
   3. Feature 開発を開始" --label spec
   ```
   ```bash
   node .specify/scripts/branch.js --type spec --slug overview --issue <num>
   ```

4) **Scaffold Overview spec**:
   ```bash
   node .specify/scripts/scaffold-spec.js --kind overview --id S-OVERVIEW-001 --title "[System Name] Overview"
   ```
   - At this point, Overview is a **scaffold** (template with placeholders)
   - Do NOT fill in details yet - that's done in `/speckit.clarify`

---

### Common Steps (Both Modes)

5) **Propose Feature candidates**:
   - Generate 3-7 Feature proposals based on domain/user intent
   - Each proposal includes:
     - Feature ID (e.g., S-FEATURE-001)
     - Title
     - Brief description (1-2 sentences)
     - Expected dependencies on masters/APIs (tentative, will be confirmed after Overview clarify)
   - Present numbered list to human

6) **Ask human for adoption**:
   ```
   どの Feature を採用しますか？
   - 「全部」: 全 Feature 採用
   - 「1,3,5」: 番号指定で採用
   - 「なし」: Issue 作成をスキップ
   ```

7) **Batch-create Feature Issues** (Issues only, NO spec scaffold):
   - For each adopted Feature:
     ```bash
     gh issue create \
       --title "[Feature] S-XXX-001: タイトル" \
       --body "## Summary
     [説明]

     ## Spec ID
     S-XXX-001

     ## Dependencies (tentative)
     - Masters: (to be defined in Overview)
     - APIs: (to be defined in Overview)

     ## Status
     Waiting for Overview spec to be finalized.

     ## Next Steps
     1. Complete Overview spec clarification
     2. Start this Feature with /speckit.issue" \
       --label feature --label backlog
     ```
   - Collect all created Issue numbers

8) **Present results and next steps**:
   ```
   === Bootstrap 完了 ===

   Overview:
   - Issue: #1
   - Branch: spec/1-overview
   - Spec (scaffold): .specify/specs/overview/spec.md

   Feature Issues created:
   - #2 [feature][backlog] S-INVENTORY-001: 在庫一覧・検索
   - #3 [feature][backlog] S-RECEIVING-001: 入荷処理
   - ...

   【重要】次のステップ:
   Overview Spec はまだスキャフォールド（テンプレート）状態です。
   Feature 開発を始める前に、以下を実行してください：

   1. `/speckit.clarify` で Overview を詳細化
      - マスターデータ (M-*) の定義
      - API 契約 (API-*) の定義
      - ビジネスルールの定義
   2. Overview Spec をレビュー・承認
   3. `/speckit.issue` で Feature 開発を開始
   ```

## Output

- Overview Issue number and branch (if created)
- Overview spec scaffold path (if created)
- List of created Feature Issue numbers
- Clear instruction to run `/speckit.clarify` next

## Human Checkpoints

1. (Full Bootstrap only) Confirm system understanding
2. Select which Features to adopt
3. **Must run `/speckit.clarify` before starting any Feature**

## What This Command Does NOT Do

- Does NOT create Feature spec files (spec.md)
- Does NOT fill in Overview details (masters, APIs, rules)
- Does NOT start Feature development

These are handled by subsequent commands:
- `/speckit.clarify` - Refine Overview spec
- `/speckit.issue` - Start Feature development (creates Feature spec)

---

## Examples

### Example 1: New Project (Full Bootstrap)

```
人間: /speckit.bootstrap 在庫管理システムを作りたい

AI: Overview が見つかりません。新規プロジェクトとして立ち上げます。

    システム理解:
    - ドメイン: 在庫管理
    - 想定アクター: 倉庫担当、管理者
    - 主要エンティティ: 商品、在庫、入出荷

    Overview Issue #1 を作成しました
    Branch spec/1-overview を作成しました
    Overview Spec (scaffold) を作成しました

    Feature 候補:
    1. S-INVENTORY-001: 在庫一覧・検索
       - 在庫の一覧表示と検索機能
    2. S-RECEIVING-001: 入荷処理
       - 商品の入荷登録と在庫更新
    3. S-SHIPPING-001: 出荷処理
       - 出荷指示と在庫引当
    4. S-STOCKTAKE-001: 棚卸し
       - 実在庫の確認と差異調整

    どの Feature を採用しますか？ [全部/番号指定/なし]

人間: 全部

AI: 4 つの Feature Issue を作成しました:
    - #2 [feature][backlog] S-INVENTORY-001: 在庫一覧・検索
    - #3 [feature][backlog] S-RECEIVING-001: 入荷処理
    - #4 [feature][backlog] S-SHIPPING-001: 出荷処理
    - #5 [feature][backlog] S-STOCKTAKE-001: 棚卸し

    === Bootstrap 完了 ===

    【重要】次のステップ:
    Overview Spec はまだスキャフォールド状態です。

    `/speckit.clarify` を実行して Overview を詳細化してください。
    - マスターデータ (M-PRODUCTS, M-INVENTORY, etc.)
    - API 契約 (API-INVENTORY-LIST, etc.)
    - ビジネスルール

    Overview 承認後、`/speckit.issue` で Feature 開発を開始できます。
```

### Example 2: Existing Project (Additional Features)

```
人間: /speckit.bootstrap レポート機能を追加したい

AI: Overview S-OVERVIEW-001 が見つかりました。追加 Feature 提案モードで実行します。

    現在の Overview:
    - マスター: M-PRODUCTS, M-INVENTORY, M-SHIPMENTS
    - API: 12 個定義済み

    Feature 候補:
    1. S-REPORTS-001: レポート出力
       - 在庫レポート、入出荷レポートの生成
       - 依存: M-INVENTORY, M-SHIPMENTS

    2. S-EXPORT-001: データエクスポート
       - CSV/Excel 形式でのデータ出力
       - 依存: M-PRODUCTS, M-INVENTORY

    どの Feature を採用しますか？ [全部/番号指定/なし]

人間: 1

AI: Feature Issue を作成しました:
    - #10 [feature][backlog] S-REPORTS-001: レポート出力

    次のステップ:
    `/speckit.issue` で #10 を選択して Feature 開発を開始できます。
    （Overview は既に詳細化済みのため、clarify は不要です）
```
