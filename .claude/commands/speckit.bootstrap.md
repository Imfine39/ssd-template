---
description: Bootstrap project or propose additional Features. Creates Overview and/or batch-creates Feature Issues.
handoffs:
  - label: Start Feature
    agent: speckit.issue
    prompt: Select and start a feature from the backlog
    send: true
---

## User Input

```text
$ARGUMENTS
```

## Purpose

This command handles two scenarios:

1. **New Project (No Overview)**: Full onboarding - creates Overview spec, proposes Features, batch-creates Issues
2. **Existing Project (Overview exists)**: Proposes additional Features based on user intent, batch-creates Issues

## Steps

### Step 1: Check for existing Overview

- Look for Overview spec in `.specify/specs/`
- If found: **Additional Features mode** (skip to Step 4)
- If not found: **Full Bootstrap mode** (continue to Step 2)

---

### Full Bootstrap Mode (No Overview)

2) **Parse system purpose**:
   - Extract domain, actors, outcomes, core objects
   - Identify external systems and compliance needs
   - If unclear, ask clarifying questions (max 3)

3) **Create Overview Issue and Branch**:
   - Run: `gh issue create --title "Define System Overview Spec" --body "..." --label spec`
   - Run: `node .specify/scripts/branch.js --type spec --slug overview --issue <num>`

4) **Generate Overview spec**:
   - Use `/speckit.spec` (base command) to create Overview:
     - Scaffold: `node .specify/scripts/scaffold-spec.js --kind overview --id S-OVERVIEW-001 --title "System Overview"`
     - Fill: Domain description, Shared masters (M-*), Shared APIs (API-*), Cross-cutting rules, NFRs
   - Run clarify loop until all ambiguities resolved

---

### Common Steps (Both Modes)

5) **Propose Feature candidates**:
   - Generate 3-7 Feature proposals based on domain/user intent
   - Each proposal includes:
     - Feature ID (e.g., S-INVENTORY-001)
     - Title
     - Brief description
     - 1-2 initial UCs
     - Dependencies on masters/APIs (by ID)
   - Present numbered list to human

6) **Ask human for adoption**:
   ```
   どのFeatureを採用しますか？
   - 「全部」: 全Feature採用
   - 「1,3,5」: 番号指定で採用
   - 「なし」: Issue作成をスキップ
   ```

7) **Batch-create Feature Issues**:
   - For each adopted Feature:
     ```bash
     gh issue create \
       --title "[Feature] S-XXX-001: タイトル" \
       --body "## Summary\n[説明]\n\n## Spec ID\nS-XXX-001\n\n## Initial UCs\n- UC-001: ...\n\n## Dependencies\n- M-XXX, API-XXX" \
       --label feature --label backlog
     ```
   - Collect all created Issue numbers

8) **Scaffold Feature specs**:
   - For each adopted Feature:
     ```bash
     node .specify/scripts/scaffold-spec.js --kind feature --id S-XXX-001 --title "..." --overview S-OVERVIEW-001
     ```
   - Overview Feature index table is auto-updated

9) **Run lint**:
   - Execute: `node .specify/scripts/spec-lint.js`

10) **Present results and ask which to start**:
    ```
    Feature Issues created:
      #2 [feature][backlog] S-INVENTORY-001: 在庫一覧・検索
      #3 [feature][backlog] S-RECEIVING-001: 入荷処理

    どのFeatureから開発を始めますか？
    - Issue番号で指定
    - 「後で」: /speckit.issue で後から選択
    ```

11) **Start selected Feature** (if chosen):
    - Use `/speckit.issue` to start the selected Issue
    - This will: update label → create branch → detail spec → continue flow

## Output

- Overview spec path (if created)
- List of created Feature Issues with numbers
- Feature index table updated
- Next step: `/speckit.issue` for selected Feature

## Human Checkpoints

1. (Full Bootstrap only) Review Overview spec
2. Select which Features to adopt
3. Select which Feature to start (or defer)

## Examples

### Example 1: New Project (Full Bootstrap)

```
人間: /speckit.bootstrap 在庫管理システムを作りたい

AI: Overviewが見つかりません。新規プロジェクトとして立ち上げます。

    Overview Issue #1 を作成しました
    Branch spec/1-overview を作成しました
    Overview Spec を作成しました

    Feature候補:
    1. S-INVENTORY-001: 在庫一覧・検索
    2. S-RECEIVING-001: 入荷処理
    3. S-SHIPPING-001: 出荷処理
    4. S-STOCKTAKE-001: 棚卸し

    どのFeatureを採用しますか？ [全部/番号指定/なし]

人間: 全部

AI: 4つのFeature Issueを作成しました:
    #2 [feature][backlog] S-INVENTORY-001: 在庫一覧・検索
    #3 [feature][backlog] S-RECEIVING-001: 入荷処理
    #4 [feature][backlog] S-SHIPPING-001: 出荷処理
    #5 [feature][backlog] S-STOCKTAKE-001: 棚卸し

    どのFeatureから始めますか？

人間: #2

AI: Issue #2 を開始します...
    （/speckit.issue の処理へ）
```

### Example 2: Existing Project (Additional Features)

```
人間: /speckit.bootstrap レポート機能とエクスポート機能を追加したい

AI: Overview S-OVERVIEW-001 が見つかりました。追加Feature提案モードで実行します。

    Feature候補:
    1. S-REPORTS-001: レポート出力
       - UC-001: 日次売上レポート生成
       - 依存: M-SALES, API-SALES-LIST

    2. S-EXPORT-001: データエクスポート
       - UC-001: CSV形式でエクスポート
       - 依存: M-SALES, M-PRODUCTS

    どのFeatureを採用しますか？ [全部/番号指定/なし]

人間: 全部

AI: 2つのFeature Issueを作成しました:
    #10 [feature][backlog] S-REPORTS-001: レポート出力
    #11 [feature][backlog] S-EXPORT-001: データエクスポート

    どのFeatureから始めますか？ (後で /speckit.issue でも選択可能)

人間: 後で

AI: 了解しました。開発を始める時は /speckit.issue で
    backlog の Feature を選択してください。
```
