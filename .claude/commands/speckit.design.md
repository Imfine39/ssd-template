---
description: Create Domain Spec (M-*/API-*) with Feature proposal. Technical design phase after Vision.
handoffs:
  - label: Start Foundation
    agent: speckit.issue
    prompt: Start implementing the foundation (S-FOUNDATION-001)
    send: true
  - label: Propose More Features
    agent: speckit.featureproposal
    prompt: Propose additional features
    send: true
---

## User Input

```text
$ARGUMENTS
```

## Purpose

**Technical design phase** that includes:
1. Feature proposal based on Vision (→ Issues 作成)
2. Domain Spec creation (M-*/API-*, business rules)
3. Foundation Issue creation (S-FOUNDATION-001)

**Use this when:** Vision is approved and ready to start technical design.
**Use `/speckit.vision` first if:** No Vision Spec exists.
**Next steps:** `/speckit.issue` to start Foundation, then Features.

## Prerequisites

- Vision Spec should exist (warning if not)

## Steps

### Step 1: Check Prerequisites

1) **Check repo state** (warning-based):
   ```bash
   node .specify/scripts/state.js query --repo
   ```
   - Check Vision status
   - If status is not "approved":
     ```
     WARNING: Vision Spec がまだ承認されていません（status: [status]）。
     技術設計の前に `/speckit.vision` でプロジェクトの目的を明確にすることを推奨します。
     続行しますか？ (y/N)
     ```
   - Human can choose to proceed

2) **Check Vision Spec exists**:
   - Look for `.specify/specs/vision/spec.md`
   - If not found:
     ```
     WARNING: Vision Spec が見つかりません。
     技術設計の前に `/speckit.vision` でプロジェクトの目的を明確にすることを推奨します。
     続行しますか？ (y/N)
     ```

3) **Read Vision Spec** (if exists):
   - Extract system purpose
   - Extract user journeys
   - Extract scope boundaries

### Step 2: Analyze Codebase

3) **Explore existing code** (if any):
   - Use Serena to identify existing patterns
   - Identify existing entities and relationships
   - Use context7 for library documentation if needed

### Step 3: Feature Proposal (uses featureproposal logic)

4) **Ensure labels exist**:
   ```bash
   gh label create feature --description "Feature implementation" --color 1D76DB --force
   gh label create backlog --description "In backlog" --color FBCA04 --force
   gh label create in-progress --description "Work in progress" --color 7057FF --force
   ```

5) **Generate Feature proposals**:
   - Based on Vision journeys and scope
   - Generate 3-7 Feature proposals
   - Each proposal includes:
     - Feature ID (e.g., S-XXX-001)
     - Title
     - Brief description (1-2 sentences)
     - Expected M-*/API-* dependencies (tentative)

6) **Present to human**:
   ```
   === Feature 提案 ===

   Vision に基づいて以下の Feature を提案します:

   1. S-INVENTORY-001: 在庫一覧・検索
      説明: 在庫の一覧表示と検索機能

   2. S-RECEIVING-001: 入荷処理
      説明: 商品の入荷登録と在庫更新

   [...]

   どの Feature を採用しますか？
   - 「全部」: 全 Feature 採用
   - 「1,3,5」: 番号指定で採用
   - 「なし」: Issue 作成をスキップ
   - 「追加: [説明]」: 別の Feature を追加提案
   ```

7) **Batch-create Feature Issues**:
   - For each adopted Feature:
     ```bash
     gh issue create \
       --title "[Feature] S-XXX-001: タイトル" \
       --body "## Summary
     [説明]

     ## Spec ID
     S-XXX-001

     ## Status
     Backlog - waiting for Domain Spec and Feature Spec creation." \
       --label feature --label backlog
     ```

### Step 4: Create Domain Spec

8) **Scaffold Domain spec**:
   ```bash
   node .specify/scripts/scaffold-spec.js --kind domain --id S-DOMAIN-001 --title "[Project Name] Domain" --vision S-VISION-001
   ```

9) **Fill Domain spec sections**:
   - Section 1 (Domain Overview): System context, boundaries
   - Section 2 (Actors): Roles and permissions
   - Section 3 (Master Data - M-*): Define shared entities based on proposed Features
   - Section 4 (API Contracts - API-*): Define shared APIs
   - Section 5 (Business Rules): BR-*, VR-*, CR-*
   - Section 6 (NFR): Performance, security, reliability
   - Section 7 (Technology Decisions): Stack, dependencies
   - Section 8 (Feature Index): Populate from created Feature Issues
   - Mark unclear items as `[NEEDS CLARIFICATION]`

### Step 5: Run Lint

10) **Run lint**:
    ```bash
    node .specify/scripts/spec-lint.js
    ```

### Step 6: Clarify Loop

11) **Clarify loop** (Domain-focused taxonomy):
    - While `[NEEDS CLARIFICATION]` items exist:
      - Show **1 question at a time** with recommended option
      - Focus on:
        - Entity relationships and constraints
        - API request/response shapes
        - Business rule details
        - Technology choices
      - Wait for answer
      - Update spec **immediately**
      - Re-run lint
    - Continue until all resolved

### Step 7: Create Foundation Issue

12) **Create Foundation Issue**:
    ```bash
    gh issue create \
      --title "[Feature] S-FOUNDATION-001: 基盤構築" \
      --body "## Summary
    プロジェクトの基盤部分を構築します。

    ## Includes
    - 認証基盤
    - DB セットアップ
    - 基本ディレクトリ構造
    - 共通コンポーネント/ユーティリティ

    ## Spec ID
    S-FOUNDATION-001

    ## Status
    Ready - Domain Spec が完成したため、実装開始可能です。

    ## Next Steps
    /speckit.issue でこの Issue を選択して開始してください。" \
      --label feature --label backlog
    ```

### Step 8: Request Human Review

13) **Show summary**:
    ```
    === Design 完了 ===

    Feature Issues 作成:
    - #2 [feature][backlog] S-INVENTORY-001: 在庫一覧・検索
    - #3 [feature][backlog] S-RECEIVING-001: 入荷処理
    - ...

    Domain Spec:
    - Master Data: M-XXX-001, M-XXX-002, ...
    - API Contracts: API-XXX-001, API-XXX-002, ...
    - Business Rules: [Count]
    - Feature Index: [Count] features

    Foundation Issue:
    - #X [feature][backlog] S-FOUNDATION-001: 基盤構築

    Spec: .specify/specs/domain/spec.md

    次のステップ:
    `/speckit.issue` で #X (基盤構築) を選択して開始してください。
    基盤完了後、他の Feature に取り掛かれます。
    ```

14) **Request approval**:
    - Wait for human to review and approve
    - Offer to adjust based on feedback

### Step 9: Update State

15) **Update repo state** (on approval):
    ```bash
    # Update domain status
    node .specify/scripts/state.js repo --set-domain-status approved --set-domain-clarify true --set-phase design

    # Add defined masters/APIs (repeat for each)
    node .specify/scripts/state.js repo --add-master M-PRODUCT --add-master M-INVENTORY
    node .specify/scripts/state.js repo --add-api API-PRODUCT-LIST --add-api API-INVENTORY-UPDATE

    # Update feature counts
    node .specify/scripts/state.js repo --set-features-total 5 --set-features-backlog 5
    ```

## Output

- Feature Issues (numbers and titles)
- Domain spec path
- Summary of M-*, API-*, rules
- Foundation Issue number
- Next step: `/speckit.issue` to start Foundation

## Human Checkpoints

1. Confirm to proceed without Vision (if missing)
2. Select which Features to adopt
3. Answer clarification questions (in loop)
4. Review and approve Domain spec

## Clarify Taxonomy (Domain)

Focus areas for Domain clarification:

1. **Master Data (M-*)**
   - Entity purpose and scope
   - Required vs optional fields
   - Relationships between entities
   - Uniqueness constraints
   - Lifecycle (creation, update, deletion)

2. **API Contracts (API-*)**
   - Request/response shapes
   - Error conditions and codes
   - Authentication/authorization
   - Pagination and filtering
   - Rate limiting

3. **Business Rules**
   - Validation rules (VR-*)
   - Calculation rules (CR-*)
   - Domain invariants (BR-*)
   - Cross-entity constraints

4. **Technology**
   - Stack choices
   - External dependencies
   - Integration patterns

5. **Non-Functional**
   - Performance targets
   - Security requirements
   - Audit requirements

## Example

```
Human: /speckit.design

AI: Vision Spec を確認中...
    .specify/specs/vision/spec.md が見つかりました。

    === Vision Summary ===
    Purpose: 中小企業向け在庫管理システム
    Main Journeys:
    1. 在庫確認・検索
    2. 入出荷処理
    3. 棚卸し

    Feature Issues を取得中...
    - #2 S-INVENTORY-001: 在庫一覧・検索
    - #3 S-RECEIVING-001: 入荷処理
    - #4 S-SHIPPING-001: 出荷処理

    Domain Spec を作成中...

    === Clarify: Domain (Q1/8) ===

    **Master Data について確認します。**

    **質問**: 商品マスタ (M-PRODUCT) に必要な主要フィールドは？

    **Recommended:** Option A - 基本的な在庫管理に必要なフィールド

    | Option | Description |
    |--------|-------------|
    | A | SKU, 商品名, カテゴリ, 単価 |
    | B | A + バーコード, ロット管理 |
    | C | B + 賞味期限, シリアル番号 |
    | Other | 別の構成 |