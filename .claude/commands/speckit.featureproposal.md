---
description: Propose additional Features and create Issues. Use after initial design phase.
handoffs:
  - label: Start Feature
    agent: speckit.issue
    prompt: Start implementing a feature from the backlog
    send: true
---

## User Input

```text
$ARGUMENTS
```

## Purpose

Propose additional Features based on user intent and create GitHub Issues.

**This command only creates Issues, NOT Feature specs.**

**Use this when:**

- After initial `/speckit.design` to add more features
- Anytime during development to expand the backlog
- User wants AI to suggest new features

**Use `/speckit.add` instead when:**

- You already know exactly what feature you want (no proposal needed)

## Prerequisites

- Domain Spec should exist (warning if not)
- Existing Feature Issues are checked to avoid duplication

## Execution Protocol (MUST FOLLOW)

**Before starting:**

1. Use **TodoWrite** to create todos for all main Steps:
   - "Step 1: Check context"
   - "Step 2: Generate proposals"
   - "Step 3: Create Issues"
   - "Step 4: Present results"

**During execution:**

2. Before each Step: Mark the corresponding todo as `in_progress`
3. After each Step:
   - Run the **Self-Check** at the end of that Step
   - Only if Self-Check passes: Mark todo as `completed`
   - Output: `✓ Step N 完了: [1-line summary]`

**Rules:**

- **DO NOT** skip any Step
- **DO NOT** mark a Step as completed before its Self-Check passes
- If a Self-Check fails: Fix the issue before proceeding

## Critical Instructions

**IMPORTANT - MUST READ:**

1. **DO NOT use Example content** - The Example section below is for reference ONLY. NEVER output example data (「レポート機能」「S-REPORTS-001」「在庫レポート」etc.) as actual results.

2. **MUST use tools** - You MUST actually:
   - Use the **Read tool** to read Domain Spec and Vision Spec
   - Use the **Bash tool** to fetch existing Issues via gh command
   - Use the **Bash tool** to create new Issues

3. **Real data only** - All output must come from:
   - Actual Domain/Vision Spec content
   - User's $ARGUMENTS (feature hints)
   - Actual existing Issues (fetched via gh command)

4. **Generate proposals based on actual context** - Feature proposals must be based on actual Vision journeys and Domain definitions, NOT from examples.

---

## Steps

### Step 1: Check Context

1. **Check Domain Spec**:
   - Look for `.specify/specs/domain/spec.md`
   - If not found:
     ```
     WARNING: Domain Spec が見つかりません。
     先に `/speckit.design` を実行することを推奨します。
     続行しますか？ (y/N)
     ```
   - If found: Extract M-_/API-_ for reference

2. **Check Vision Spec** (optional):
   - Look for `.specify/specs/vision/spec.md`
   - If found: Extract journeys and scope for context

3. **Fetch existing Feature Issues**:

   ```bash
   gh issue list --state all --label feature --json number,title,state
   ```

   - Identify existing Feature IDs to avoid duplication

#### Self-Check (Step 1)

- [ ] Domain Spec を Read ツールで確認したか
- [ ] Vision Spec を Read ツールで確認したか（存在する場合）
- [ ] gh issue list で既存 Issue を取得したか
- [ ] 重複を避けるため既存 Feature ID を確認したか

### Step 2: Generate Proposals

4. **Parse user intent**:
   - Extract hints from `$ARGUMENTS`
   - If empty, ask: "どのような機能を追加したいですか？"

5. **Generate Feature proposals**:
   - Based on user intent and existing domain
   - Generate 2-5 Feature proposals
   - Each proposal includes:
     - Feature ID (avoid duplicates)
     - Title
     - Brief description
     - Expected M-_/API-_ dependencies (from Domain Spec)
   - Consider gaps in current feature set

6. **Present to human**:

   ```
   === 追加 Feature 提案 ===

   既存の Features:
   - S-INVENTORY-001: 在庫一覧・検索
   - S-RECEIVING-001: 入荷処理
   - ...

   新規 Feature 候補:

   1. S-REPORTS-001: レポート出力
      説明: 在庫レポート、入出荷レポートの生成
      依存: M-INVENTORY, M-SHIPMENT, API-REPORTS-*

   2. S-EXPORT-001: データエクスポート
      説明: CSV/Excel 形式でのデータ出力
      依存: M-PRODUCT, M-INVENTORY

   どの Feature を採用しますか？
   - 「全部」: 全 Feature 採用
   - 「1,2」: 番号指定で採用
   - 「なし」: キャンセル
   - 「追加: [説明]」: 別の Feature を追加提案
   ```

#### Self-Check (Step 2)

- [ ] $ARGUMENTS からユーザーの意図を抽出したか
- [ ] Example の値（レポート機能等）を使用していないか
- [ ] 実際の Domain Spec に基づいて提案を生成したか
- [ ] ユーザーに提案を提示したか

### Step 3: Create Issues

7. **Batch-create Feature Issues**:
   - For each adopted Feature:

     ```bash
     gh issue create \
       --title "[Feature] S-XXX-001: タイトル" \
       --body "## Summary
     [説明]

     ## Spec ID
     S-XXX-001

     ## Dependencies
     - Masters: [M-* from Domain Spec]
     - APIs: [API-* from Domain Spec]

     ## Status
     Backlog

     ## Next Steps
     /speckit.issue でこの Feature を選択して開始してください。" \
       --label feature --label backlog
     ```

8. **Update Domain Spec Feature Index**:
   - Add new Features to Feature Index table
   - Status: Draft

#### Self-Check (Step 3)

- [ ] ユーザーが採用した Feature ごとに gh issue create を実行したか
- [ ] Domain Spec の Feature Index を更新したか

### Step 4: Present Results

9. **Show summary**:

   ```
   === Feature Issues 作成完了 ===

   作成した Issues:
   - #10 [feature][backlog] S-REPORTS-001: レポート出力
   - #11 [feature][backlog] S-EXPORT-001: データエクスポート

   Domain Spec の Feature Index を更新しました。

   次のステップ:
   `/speckit.issue` で Feature を選択して開始してください。
   ```

#### Self-Check (Step 4)

- [ ] 作成した Issue 一覧を表示したか
- [ ] 次のステップ（/speckit.issue）を提示したか
- [ ] 全ての Step が完了し、todo を全て `completed` にマークしたか

## Output

- List of created Feature Issue numbers and titles
- Updated Feature Index in Domain Spec
- Next step recommendation

## Human Checkpoints

1. Confirm to proceed without Domain Spec (if missing)
2. Select which Features to adopt

## Example

> ⚠️ **WARNING: REFERENCE ONLY**
>
> The following examples are for understanding the workflow ONLY.
> **DO NOT copy or output these example values** (レポート機能, S-REPORTS-001, 在庫レポート, M-PRODUCT, etc.).
> Always generate proposals based on ACTUAL Domain Spec and user input.

```
Human: /speckit.featureproposal レポート機能を追加したい

AI: Domain Spec を確認中...
    .specify/specs/domain/spec.md が見つかりました。

    === 既存の Features ===
    - #2 S-INVENTORY-001: 在庫一覧・検索 [Implementing]
    - #3 S-RECEIVING-001: 入荷処理 [Backlog]
    - #4 S-SHIPPING-001: 出荷処理 [Backlog]

    === 追加 Feature 提案 ===

    ご要望の「レポート機能」に基づいて提案します:

    1. S-REPORTS-001: 在庫レポート
       説明: 現在庫、在庫推移、アラート一覧のレポート生成
       依存: M-PRODUCT, M-INVENTORY

    2. S-REPORTS-002: 入出荷レポート
       説明: 期間指定での入出荷履歴レポート
       依存: M-RECEIVING, M-SHIPPING

    3. S-EXPORT-001: データエクスポート
       説明: レポートの CSV/Excel 出力
       依存: 上記レポート機能

    どの Feature を採用しますか？ [全部/番号指定/なし/追加]
```
