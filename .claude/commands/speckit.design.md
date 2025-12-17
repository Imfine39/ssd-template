---
description: Create Domain Spec (M-*/API-*) with Feature proposal. Technical design phase after Vision.
handoffs:
  - label: Clarify Domain
    agent: speckit.clarify
    prompt: Clarify the Domain Spec
    send: true
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

**Technical design phase** that creates **Screen Spec + Domain Spec simultaneously**:

1. **Screen Spec**: 画面一覧、画面遷移、SCR-* ID 割り当て
2. **Domain Spec**: M-*/API-* 定義、ビジネスルール
3. **Feature Issues**: Vision の Journey から Feature 候補を作成
4. **Screen ↔ Domain 対応**: 相互参照を両 Spec に記載

**This command focuses on:** Spec 作成のみ。Clarify は別コマンドで実行。

**Use this when:** Vision is clarified and ready to start technical design.
**Use `/speckit.vision` first if:** No Vision Spec exists.
**Next steps:** `/speckit.clarify` で曖昧点を解消 → `/speckit.issue` to start Foundation

**Key principle:**
> Screen と Domain を同時に作成することで、ID の相互参照が可能になり、整合性が保証される。

## Prerequisites

- Vision Spec should exist (warning if not)

## Critical Instructions

**IMPORTANT - MUST READ:**

1. **DO NOT use Example content** - The Example section below is for reference ONLY. NEVER output example data (「在庫管理」「S-INVENTORY-001」「M-PRODUCT」etc.) as actual results.

2. **MUST use tools** - You MUST actually:
   - Use the **Read tool** to read Vision Spec (including Screen Hints section)
   - Use the **Bash tool** to run gh commands and scaffold scripts
   - Use the **Write/Edit tool** to create/modify spec files

3. **Real data only** - All output must come from:
   - Actual Vision Spec content (including Screen Hints)
   - User's $ARGUMENTS
   - User's chat responses
   - Actual codebase analysis

---

## Steps

### Step 1: Check Prerequisites

1) **Check repo state** (warning-based):
   ```bash
   node .specify/scripts/state.cjs query --repo
   ```
   - Check Vision status
   - If status is not "approved" or "clarified":
     ```
     WARNING: Vision Spec がまだ承認されていません（status: [status]）。
     技術設計の前に `/speckit.vision` + `/speckit.clarify` を推奨します。
     続行しますか？ (y/N)
     ```

2) **Check Vision Spec exists**:
   - Look for `.specify/specs/vision/spec.md`
   - If not found:
     ```
     WARNING: Vision Spec が見つかりません。
     `/speckit.vision` を先に実行してください。
     ```

3) **Read Vision Spec** (if exists):
   - Extract system purpose
   - Extract user journeys
   - Extract scope boundaries
   - **Extract Screen Hints (Section 5)** - 画面リスト、遷移、デザイン希望

### Step 2: Screen Information Collection

4) **Check Screen Hints**:
   - Vision Spec の Section 5 (Screen Hints) を確認
   - **Screen Hints がある場合**: そのまま使用して Step 3 へ
   - **Screen Hints が空の場合**: Step 2.1 で入力を促す

#### 2.1 Screen 情報の入力を促す（Screen Hints が空の場合のみ）

```
Screen 情報がありません。

画面設計を進めるために、以下の情報を提供してください:

1. 主要な画面リスト（3-10画面程度）
   例: ログイン画面、ダッシュボード、一覧画面、詳細画面...

2. 画面遷移（わかっている範囲）
   例: ログイン → ダッシュボード → 一覧 → 詳細

3. 各画面の主な要素（わかっている範囲）
   例: ダッシュボード（KPIグラフ、最近のアクション、通知）

または `.specify/input/vision.md` の Part B を編集して
`/speckit.design` を再実行してください。
```

**人間から画面情報を受け取る。**

### Step 3: Feature Proposal

5) **Ensure labels exist**:
   ```bash
   gh label create feature --description "Feature implementation" --color 1D76DB --force
   gh label create backlog --description "In backlog" --color FBCA04 --force
   gh label create in-progress --description "Work in progress" --color 7057FF --force
   ```

6) **Generate Feature proposals from Vision Journeys**:
   - Vision の Journey を Feature 候補に変換
   - 画面情報と組み合わせて Feature の範囲を決定
   - Generate 3-7 Feature proposals
   - Each proposal includes:
     - Feature ID (e.g., S-XXX-001)
     - Title
     - Which Journey it maps to
     - Related Screens (SCR-*)
     - Brief description (1-2 sentences)

7) **Present to human**:
   ```
   === Feature 提案 ===

   Vision の Journey と画面情報から以下の Feature を提案します:

   [x] S-FOUNDATION-001: 基盤構築 (必須)
   [x] S-XXX-001: [機能名] ← Journey 1, SCR-001, SCR-002
   [x] S-YYY-001: [機能名] ← Journey 2, SCR-003
   [x] S-ZZZ-001: [機能名] ← Journey 3, SCR-004, SCR-005

   どの Feature を採用しますか？
   - 「全部」: 全 Feature 採用
   - 「1,3,5」: 番号指定で採用
   - 「なし」: Issue 作成をスキップ
   - 「追加: [説明]」: 別の Feature を追加提案
   ```

8) **Batch-create Feature Issues**:
   - For each adopted Feature:
     ```bash
     gh issue create \
       --title "[Feature] S-XXX-001: タイトル" \
       --body "## Summary
     [説明]

     ## Spec ID
     S-XXX-001

     ## Related Screens
     - SCR-XXX
     - SCR-YYY

     ## Status
     Backlog - waiting for Screen + Domain Spec and Feature Spec creation." \
       --label feature --label backlog
     ```

### Step 4: Simultaneous Screen + Domain Spec Creation

> **重要**: Screen と Domain を同時に作成することで、ID の相互参照が可能になる。

#### 4.1 SCR-* ID の割り当て

9) **画面リストから SCR-* ID を割り当て**:

   | # | Screen Name (from input) | SCR ID |
   |---|--------------------------|--------|
   | 1 | ログイン画面 | SCR-001 |
   | 2 | ダッシュボード | SCR-002 |
   | 3 | 一覧画面 | SCR-003 |
   | ... | ... | ... |

#### 4.2 画面から M-*/API-* を導出

10) **各画面の要素から必要な M-*/API-* を特定**:

    **導出ルール:**
    - 「〇〇一覧を表示」→ M-XXX (master), API-XXX-LIST (read API)
    - 「〇〇を編集可能」→ API-XXX-UPDATE (write API)
    - 「〇〇を作成」→ API-XXX-CREATE (write API)
    - 「〇〇を削除」→ API-XXX-DELETE (write API)
    - 「〇〇から△△に移行」→ API-XXX-CONVERT (action API), M-△△ (target master)

    **例:**
    ```
    SCR-003 (リード案件一覧)
      → 表示: M-LEAD (master data)
      → 一覧取得: API-LEAD-LIST
      → 詳細画面への遷移: API-LEAD-GET

    SCR-004 (リード案件詳細)
      → 編集: API-LEAD-UPDATE
      → 受注移行: API-LEAD-CONVERT, M-PROJECT
    ```

#### 4.3 Scaffold 実行

11) **Screen Spec と Domain Spec を scaffold**:
    ```bash
    node .specify/scripts/scaffold-spec.cjs --kind screen --id S-SCREEN-001 --title "[Project Name] Screen" --vision S-VISION-001
    node .specify/scripts/scaffold-spec.cjs --kind domain --id S-DOMAIN-001 --title "[Project Name] Domain" --vision S-VISION-001
    ```

#### 4.4 Screen Spec の作成

12) **Screen Spec sections を埋める**:
    - **Section 1** (Screen Overview): Purpose, Design Principles
    - **Section 2** (Screen Index): 全画面一覧 + M-*/API-* 対応表

      | Screen ID | Name | Journey | Feature ID | APIs | Masters | Status |
      |-----------|------|---------|------------|------|---------|--------|
      | SCR-001 | ログイン | - | S-AUTH-001 | API-AUTH-* | M-USER | Planned |
      | SCR-002 | ダッシュボード | J-1 | S-DASHBOARD-001 | API-SUMMARY-* | M-LEAD, M-PROJECT | Planned |
      | ... | ... | ... | ... | ... | ... | ... |

    - **Section 3** (Screen Transition): Mermaid diagram + Transition Matrix
    - **Section 4** (Screen Details): 各画面の詳細（Purpose, Actions, Layout Overview）
    - **Section 5** (Shared Components): 共通コンポーネント
    - **Section 6-7** (Design Tokens, Responsive): デザイン希望から

#### 4.5 Domain Spec の作成

13) **Domain Spec sections を埋める**:
    - **Section 1** (Domain Overview): System context, boundaries
    - **Section 2** (Actors): Roles and permissions
    - **Section 3** (Master Data - M-*)**: 各 M-* に **Used by screens** を追加

      ```markdown
      ### M-LEAD
      **Purpose:** リード案件情報
      **Used by screens:** SCR-002, SCR-003, SCR-004
      **Fields:** ...
      ```

    - **Section 4** (API Contracts - API-*)**: 各 API-* に **Used by screens** を追加

      ```markdown
      ### API-LEAD-LIST
      **Purpose:** リード案件一覧取得
      **Used by screens:** SCR-003 (リード案件一覧)
      **Endpoint:** GET /api/v1/leads
      ...
      ```

    - **Section 5** (Business Rules): BR-*, VR-*, CR-*
    - **Section 6** (NFR): Performance, security, reliability
    - **Section 7** (Technology Decisions): Stack, dependencies
    - **Section 8** (Feature Index): Populate from created Feature Issues

    Mark unclear items as `[NEEDS CLARIFICATION]`

### Step 5: Cross-Reference Verification

14) **Screen ↔ Domain 整合性チェック**:
    - [ ] 全 SCR-* が少なくとも 1 つの M-* を参照
    - [ ] 全 M-* が少なくとも 1 つの SCR-* から参照
    - [ ] Screen Spec の対応表と Domain Spec の参照が一致
    - [ ] 孤立した API-* がない（どの画面からも使われない API）

15) **Run lint**:
    ```bash
    node .specify/scripts/spec-lint.cjs
    ```

### Step 6: Create Foundation Issue

16) **Create Foundation Issue**:
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
    Ready - Screen + Domain Spec が完成したため、実装開始可能です。

    ## Next Steps
    /speckit.clarify で曖昧点を解消後、/speckit.issue でこの Issue を選択して開始してください。" \
      --label feature --label backlog
    ```

### Step 7: Design Summary & Clarify 推奨

17) **Show summary**:
    ```
    === Design 完了（Screen + Domain 同時作成）===

    Feature Issues 作成:
    - #2 [feature][backlog] S-FOUNDATION-001: 基盤構築
    - #3 [feature][backlog] S-XXX-001: [機能名]
    - ...

    Screen Spec:
    - 画面数: [N] 画面 (SCR-001 〜 SCR-XXX)
    - 遷移定義: 完了
    - M-*/API-* 対応: 完了

    Domain Spec:
    - Master Data: M-XXX, M-YYY, ...
    - API Contracts: API-XXX-*, API-YYY-*, ...
    - Screen 参照: 全 M-*/API-* に SCR-* 参照あり
    - Business Rules: [Count]
    - Feature Index: [Count] features

    Specs:
    - .specify/specs/screen/spec.md
    - .specify/specs/domain/spec.md
    ```

18) **曖昧点レポート**:
    ```
    === 曖昧点 ===

    [NEEDS CLARIFICATION] マーク: [N] 箇所

    Screen Spec:
    - SCR-003: レイアウト詳細が未定義
    - SCR-005: 状態遷移が不明確

    Domain Spec:
    - M-PRODUCT: フィールド詳細が未定義
    - API-AUTH: 認証方式が未定義
    - BR-003: ビジネスルールが曖昧

    推奨: `/speckit.clarify` で曖昧点を解消してください。
    ```

19) **次のステップ提示**:
    ```
    次のステップ:

    1. [推奨] `/speckit.clarify` - Screen + Domain Spec の曖昧点を解消
    2. `/speckit.issue` - 曖昧点を残したまま Foundation 実装開始（非推奨）

    Clarify をスキップすると、実装中の手戻りリスクが高まります。
    ```

### Step 8: Update State

20) **Update repo state**:
    ```bash
    node .specify/scripts/state.cjs repo --set-screen-status draft --set-domain-status draft --set-phase design
    ```

**Note:** Screen/Domain status は `draft`。Clarify 完了後に `clarified`、承認後に `approved` に更新される。

---

## Output

- Feature Issues (numbers and titles)
- **Screen spec: `.specify/specs/screen/spec.md`** (NEW)
- Domain spec: `.specify/specs/domain/spec.md`
- 曖昧点レポート
- Foundation Issue number
- Next step recommendation: `/speckit.clarify`

---

## Human Checkpoints

1. Confirm to proceed without Vision (if missing)
2. Provide screen information (if Screen Hints is empty)
3. Select which Features to adopt
4. Review Screen + Domain Summary
5. → `/speckit.clarify` で曖昧点を解消

---

## Screen ↔ Domain 対応ルール

### ID 命名規則

| Spec | ID Format | Example |
|------|-----------|---------|
| Screen | SCR-XXX | SCR-001 (ログイン), SCR-002 (ダッシュボード) |
| Master | M-XXX | M-USER, M-LEAD, M-PROJECT |
| API | API-XXX-YYY | API-LEAD-LIST, API-LEAD-CREATE |

### 導出ルール（画面要素 → M-*/API-*）

```
「〇〇一覧画面で〇〇情報を表示」
  → M-XXX (master data)
  → API-XXX-LIST (read API)

「〇〇詳細画面で編集可能」
  → API-XXX-UPDATE (write API)

「〇〇詳細画面で△△へ移行」
  → API-XXX-CONVERT (action API)
  → M-△△ (移行先 master)
```

### 整合性検証（/speckit.lint で追加チェック）

- [ ] 全 SCR-* が少なくとも 1 つの M-* を参照
- [ ] 全 M-* が少なくとも 1 つの SCR-* から参照
- [ ] Screen Spec の対応表と Domain Spec の参照が一致
- [ ] 孤立した API-* がない

---

## Clarify Taxonomy (Design)

Screen + Domain Spec の clarify で Focus する領域（`/speckit.clarify` で使用）:

### Screen 関連

1. **Screen Layout**
   - 各画面のレイアウト詳細
   - コンポーネント配置
   - レスポンシブ対応

2. **Screen Transitions**
   - 遷移条件
   - 状態遷移（ローディング、エラー等）

3. **UI/UX**
   - デザインスタイル
   - インタラクション

### Domain 関連

4. **Master Data (M-*)**
   - Entity purpose and scope
   - Required vs optional fields
   - Relationships between entities

5. **API Contracts (API-*)**
   - Request/response shapes
   - Error conditions and codes
   - Authentication/authorization

6. **Business Rules**
   - Validation rules (VR-*)
   - Calculation rules (CR-*)
   - Domain invariants (BR-*)

7. **Technology**
   - Stack choices
   - External dependencies

8. **Non-Functional**
   - Performance targets
   - Security requirements

---

## Example

> ⚠️ **WARNING: REFERENCE ONLY**
>
> The following examples are for understanding the workflow ONLY.
> **DO NOT copy or output these example values** (在庫管理, S-INVENTORY-001, M-PRODUCT, etc.).
> Always use ACTUAL data from Vision Spec and user input.

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

    === Screen Hints ===
    画面リスト: 5 画面定義済み
    - ログイン画面
    - ダッシュボード
    - 在庫一覧画面
    - 在庫詳細画面
    - 棚卸し画面

    === Feature 提案 ===
    Vision の Journey と画面情報から以下の Feature を提案します:

    [x] S-FOUNDATION-001: 基盤構築 (必須)
    [x] S-INVENTORY-001: 在庫一覧・検索 ← Journey 1, SCR-003
    [x] S-RECEIVING-001: 入荷処理 ← Journey 2, SCR-004
    [x] S-SHIPPING-001: 出荷処理 ← Journey 2, SCR-004
    [x] S-STOCKTAKE-001: 棚卸し ← Journey 3, SCR-005

    採用する Feature を選択（全部 / 番号指定 / 追加提案）

人間: 全部

AI: Feature Issues を作成中...
    - #2 S-FOUNDATION-001: 基盤構築
    - #3 S-INVENTORY-001: 在庫一覧・検索
    - ...

    Screen Spec + Domain Spec を同時に作成中...

    [SCR-* ID 割り当て]
    SCR-001: ログイン画面 → M-USER, API-AUTH-*
    SCR-002: ダッシュボード → M-INVENTORY, API-SUMMARY-*
    SCR-003: 在庫一覧画面 → M-PRODUCT, M-INVENTORY, API-INVENTORY-LIST
    SCR-004: 在庫詳細画面 → M-PRODUCT, API-INVENTORY-UPDATE
    SCR-005: 棚卸し画面 → M-INVENTORY, API-STOCKTAKE-*

    [M-*/API-* 定義 with Screen 参照]
    M-PRODUCT: Used by SCR-003, SCR-004
    M-INVENTORY: Used by SCR-002, SCR-003, SCR-004, SCR-005
    API-INVENTORY-LIST: Used by SCR-003
    ...

    === Design 完了（Screen + Domain 同時作成）===

    Feature Issues:
    - #2 S-FOUNDATION-001: 基盤構築
    - #3 S-INVENTORY-001: 在庫一覧・検索
    - ...

    Screen Spec:
    - 画面数: 5 画面 (SCR-001 〜 SCR-005)
    - M-*/API-* 対応: 完了

    Domain Spec:
    - Master Data: M-USER, M-PRODUCT, M-INVENTORY
    - API Contracts: API-AUTH-*, API-INVENTORY-*, API-STOCKTAKE-*
    - Screen 参照: 全 M-*/API-* に SCR-* 参照あり

    === 曖昧点 ===
    [NEEDS CLARIFICATION] マーク: 6 箇所
    ...

    次のステップ:
    1. [推奨] `/speckit.clarify` - 曖昧点を解消
    2. `/speckit.issue` - Foundation 実装開始（非推奨）
```
