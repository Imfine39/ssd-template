---
description: Start from existing Issue (Entry Point). Selects Issue, creates Branch, Spec with clarify loop.
handoffs:
  - label: Continue to Plan
    agent: speckit.plan
    prompt: Create plan for the approved spec
    send: true
---

## Purpose

**Entry point** for existing Issues (from bootstrap, human creation, etc.).
Lists Issues → User selects → Creates Branch → Creates Feature Spec → Clarify loop.

**Use this when:** Issues already exist and you want to start working on one.
**Use `/speckit.add` or `/speckit.fix` instead when:** No Issue exists yet.

**Prerequisites:**
- Domain spec must exist and be sufficiently clarified (M-*, API-* defined)
- If Domain is still a scaffold, prompt user to run `/speckit.design` first

## Steps

### Step 1: Check Prerequisites

1) **Check repo state** (warning-based):
   ```bash
   node .specify/scripts/state.js query --repo
   ```
   - Check Domain status
   - If status is not "approved" or "clarified":
     ```
     WARNING: Domain Spec がまだ精密化されていません（status: [status]）。
     Feature 開発を始める前に `/speckit.design` で Domain を完成させることを推奨します。
     続行しますか？ (y/N)
     ```
   - Human can choose to proceed

2) **Verify Domain Spec exists and is clarified**:
   - Check `.specify/specs/domain/spec.md` exists (or legacy `.specify/specs/overview/spec.md`)
   - Check Domain has M-* and API-* definitions (not just placeholders)
   - If Domain is scaffold or missing M-*/API-*:
     ```
     Domain Spec がまだ精密化されていません。
     Feature 開発を始める前に `/speckit.design` で Domain を完成させてください。

     必要な定義:
     - マスターデータ (M-*)
     - API 契約 (API-*)
     - ビジネスルール
     ```

### Step 2: Fetch and Display Issues

3) **Fetch open issues**:
   ```bash
   gh issue list --state open --limit 30 --json number,title,labels,body
   ```

4) **Categorize and display**:
   ```
   === Open Issues ===

   Backlog Features:
     #2 [backlog] S-INVENTORY-001: 在庫一覧・検索
     #3 [backlog] S-RECEIVING-001: 入荷処理

   Backlog Bugs:
     #10 [backlog] ログイン時に特殊文字でエラー

   In Progress:
     #5 [in-progress] S-STOCKTAKE-001: 棚卸し

   Other:
     #15 タイポ修正

   どの Issue を選択しますか？
   ```

### Step 3: Validate Selection

5) **Validate selection**:
   - If `in-progress`: Warn "既に作業中です。続行しますか？"
   - If closed: Warn "この Issue は閉じられています"

6) **Determine workflow type**:
   - Labels `bug`, `fix`, `defect` → Bug fix workflow
   - Labels `feature`, `enhancement` → Feature workflow
   - If unclear, analyze title/body or ask human

### Step 4: Setup Branch

7) **Update Issue label**:
   ```bash
   gh issue edit <num> --remove-label backlog --add-label in-progress
   ```

8) **Create branch**:
   - Feature: `node .specify/scripts/branch.js --type feature --slug <slug> --issue <num>`
   - Bug fix: `node .specify/scripts/branch.js --type fix --slug <slug> --issue <num>`
   - Note: branch.js automatically updates branch-state.json

### Step 5: Analyze Codebase

9) **Analyze codebase** (context collection):
   - Use Serena to explore existing code structure
   - Identify related components, patterns, dependencies
   - Use context7 for library documentation if needed

### Step 6: Create Feature Spec

10) **Read Domain spec**:
   - Extract defined M-* (master data)
   - Extract defined API-* (API contracts)
   - Extract business rules and constraints

10) **Scaffold Feature spec**:
    ```bash
    node .specify/scripts/scaffold-spec.js --kind feature --id S-XXX-001 --title "..." --domain S-DOMAIN-001
    ```

11) **Fill Feature spec sections**:
    - **Section 1 (Purpose)**: Issue description から抽出
    - **Section 2 (Actors)**: Domain Spec から関連アクターを参照
    - **Section 3 (Domain Dependencies)**: Domain Spec の M-*/API-* を参照
      - 参照する M-* を明示: `Depends on: M-CLIENTS, M-PROJECTS`
      - 参照する API-* を明示: `Uses: API-CLIENTS-LIST, API-PROJECTS-CREATE`
    - **Section 6 (Use Cases)**: Issue から UC を生成
      - UC-XXX-001 形式（XXX は Feature ID の一部）
    - **Section 7 (Functional Requirements)**: UC から FR を導出
    - Mark unclear items as `[NEEDS CLARIFICATION]`

### Step 6.5: Check M-*/API-* Requirements (Case 2/3 Branching)

12) **Identify required M-*/API-*/BR-***:
    - List all M-*, API-*, BR-* that this Feature needs
    - Compare against existing Domain Spec definitions

13) **Classify each requirement**:
    | Case | Situation | Action |
    |------|-----------|--------|
    | Case 1 | Existing M-*/API-* is sufficient | Add reference to Feature Spec |
    | Case 2 | New M-*/API-*/BR-* needed | Add to Domain Spec during Feature Spec creation |
    | Case 3 | Existing M-*/API-*/BR-* needs modification | Trigger `/speckit.change` |

14) **Handle Case 2 (New additions)**:
    - Add new M-*/API-*/BR-* to Domain Spec
    - Update Domain Spec's correspondence table
    - Continue with Feature Spec creation
    ```
    === Case 2: 新規定義の追加 ===

    この Feature に必要な新しい定義を Domain Spec に追加します:
    - M-NOTIFICATIONS (新規): 通知データ
    - API-NOTIFICATIONS-SEND (新規): 通知送信 API

    Domain Spec を更新しました。
    Feature Spec の作成を続行します。
    ```

15) **Handle Case 3 (Modifications needed)**:
    - Stop Feature Spec creation
    - Prompt user to run `/speckit.change`
    - After change is merged, resume with `/speckit.issue`
    ```
    === Case 3: 既存定義の変更が必要 ===

    この Feature の要件を満たすには、既存の定義を変更する必要があります:
    - M-USER.email: optional → required への変更が必要

    `/speckit.change` を実行して変更を先に完了してください。
    変更がマージされた後、この Issue で `/speckit.issue` を再実行できます。

    実行しますか？ [yes/no]
    ```

### Step 6.6: Update Domain Spec Feature Index

16) **Update Feature Index in Domain Spec**:
    - Open `.specify/specs/domain/spec.md`
    - Add or update entry in Section 8 (Feature Index):
      ```markdown
      | S-XXX-001 | [Feature Title] | `.specify/specs/s-xxx-001/` | Draft | [M-*, API-*] |
      ```
    - If entry already exists (from `/speckit.design`), update Status to current state

---

### Step 7: Run Lint

17) **Run lint**:
    ```bash
    node .specify/scripts/spec-lint.js
    ```
    - Check Feature correctly references Domain M-*/API-*
    - Check UC IDs are unique
    - Check Feature Index entry exists

### Step 8: Clarify Loop

18) **Clarify loop** (uses `/speckit.clarify` logic):
    - While `[NEEDS CLARIFICATION]` items exist:
      - Show 1 question at a time with recommended option
      - Wait for answer
      - Update spec immediately
      - Re-run lint
    - Continue until all resolved

### Step 9: Request Human Review

19) **Request human review**:
    - Show spec summary (UC/FR/SC counts)
    - Show referenced Domain elements (M-*, API-*)
    - Wait for approval

### Step 10: Update State

20) **Update branch state** (on approval):
    ```bash
    node .specify/scripts/state.js branch --set-spec-id S-XXX-001 --set-spec-path .specify/specs/s-xxx-001/spec.md --set-step spec_review
    ```

21) **Update repo state** (if Case 2 occurred):
    ```bash
    # Add new definitions that were added during Feature Spec creation
    node .specify/scripts/state.js repo --add-master M-NEW-ENTITY --add-api API-NEW-ENDPOINT
    ```

## Output

- Selected Issue number and type
- Branch name
- Spec path
- Domain references (M-*, API-*)
- Spec summary (UC/FR count)
- Next step: `/speckit.plan`

## Human Checkpoints

1. Select Issue to work on
2. Approve Case 3 redirect to `/speckit.change` (if needed)
3. Answer clarification questions (in loop)
4. Review and approve spec

---

## Example

```
人間: /speckit.issue

AI: Domain Spec を確認中...
    - マスター定義: M-PRODUCTS, M-INVENTORY, M-SHIPMENTS (3個)
    - API 定義: 12個
    - ステータス: Approved

    === Open Issues ===

    Backlog Features:
      #2 [backlog] S-INVENTORY-001: 在庫一覧・検索
      #3 [backlog] S-RECEIVING-001: 入荷処理

    Backlog Bugs:
      (なし)

    In Progress:
      #5 [in-progress] S-STOCKTAKE-001: 棚卸し

    どの Issue を選択しますか？

人間: 2

AI: Issue #2 "S-INVENTORY-001: 在庫一覧・検索" を選択しました
    種類: Feature

    ラベルを backlog → in-progress に更新しました
    Branch feature/2-inventory を作成しました

    コードベースを分析中...
    Feature Spec を作成中...

    Domain Spec から参照:
    - M-PRODUCTS (商品マスタ)
    - M-INVENTORY (在庫)
    - API-INVENTORY-LIST, API-INVENTORY-SEARCH

    === Clarify: S-INVENTORY-001 (Q1/5) ===

    Use Cases について確認します。

    **質問**: 在庫検索の対象フィールドは？

    **Recommended:** Option A - 最も一般的な検索パターンです

    | Option | Description |
    |--------|-------------|
    | A | 商品名 + SKU |
    | B | 商品名 + SKU + カテゴリ |
    | C | 全フィールド（フリーテキスト検索） |
    | Other | 別の組み合わせ |

    回答: オプション文字、"yes"で推奨を採用

人間: B

AI: 回答を記録しました: 商品名 + SKU + カテゴリ

    Spec を更新しました:
    - Section 6: UC-INV-001 に検索対象フィールドを追記
    - Clarifications: Q&A を記録

    === Clarify: S-INVENTORY-001 (Q2/5) ===

    User Interaction について確認します。

    **質問**: 検索結果のページネーションは？

    **Suggested:** 20件ずつ - 一般的なリスト表示の標準値

    回答形式: 短い回答。"yes"で提案を採用

人間: yes

AI: 回答を記録しました: 20件ずつ

    Spec を更新しました:
    - Section 7: FR-INV-002 にページネーション仕様を追記

    === Clarify 完了: S-INVENTORY-001 ===

    質問/回答: 2 問
    残りの項目は十分に明確です。

    Spec: .specify/specs/s-inventory-001/spec.md

    概要:
    - 参照 Domain 要素: M-PRODUCTS, M-INVENTORY, 4 APIs
    - UC: 3個 (UC-INV-001, UC-INV-002, UC-INV-003)
    - FR: 8個
    - SC: 3個

    Spec をレビューしてください。
    問題なければ「OK」と伝えてください。

人間: OK

AI: 承認されました。`/speckit.plan` を実行して実装計画を作成します。
```

---

## Notes

- **Domain 必須**: Feature spec は必ず Domain Spec の M-*/API-* を参照する
- **Domain が未精密化の場合**: `/speckit.design` を促して中断する（Feature 作成を続行しない）
- **Bug fix の場合**: 既存 Feature spec の Changelog セクションを更新
- **新しい M-*/API-* が必要な場合**: Domain Spec を先に更新するよう促す
