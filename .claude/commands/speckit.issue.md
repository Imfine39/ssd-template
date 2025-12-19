---
description: Start from existing Issue (Entry Point). Selects Issue, creates Branch, Spec.
handoffs:
  - label: Clarify Feature
    agent: speckit.clarify
    prompt: Clarify the Feature Spec
    send: true
  - label: Skip to Plan
    agent: speckit.plan
    prompt: Create plan for the approved spec
    send: true
---

## Purpose

**Entry point** for existing Issues (from `/speckit.design`, human creation, etc.).
Lists Issues → User selects → Creates Branch → Creates Feature Spec. Clarify は別コマンドで実行。

**This command focuses on:** Spec 作成のみ。Clarify は `/speckit.clarify` で実行。

**Use this when:** Issues already exist and you want to start working on one.
**Use `/speckit.add` or `/speckit.fix` instead when:** No Issue exists yet.
**Next steps:** `/speckit.clarify` で曖昧点を解消 → `/speckit.plan` で実装計画

## Execution Protocol (MUST FOLLOW)

**Before starting:**

1. Use **TodoWrite** to create todos for all main Steps:
   - "Step 1: Check prerequisites"
   - "Step 2: Fetch and display issues"
   - "Step 3: Validate selection"
   - "Step 4: Setup branch"
   - "Step 5: Analyze codebase"
   - "Step 6: Create Feature Spec (including 6.5, 6.6, 6.6.5, 6.7)"
   - "Step 7: Run lint"
   - "Step 8: Summary & Clarify 推奨"
   - "Step 9: Update state"

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

**Prerequisites:**

- Domain spec must exist and be sufficiently clarified (M-_, API-_ defined)
- If Domain is still a scaffold, prompt user to run `/speckit.design` first

## Critical Instructions

**IMPORTANT - MUST READ:**

1. **DO NOT use Example content** - The Example section below is for reference ONLY. NEVER output example data (「在庫一覧・検索」「S-INVENTORY-001」「M-PRODUCTS」etc.) as actual results.

2. **MUST use tools** - You MUST actually:
   - Use the **Read tool** to read Domain Spec, Screen Spec, and existing specs
   - Use the **Bash tool** to run gh commands and scaffold scripts
   - Use the **Write/Edit tool** to create/modify spec files

3. **Real data only** - All output must come from:
   - Actual Domain/Screen Spec content
   - Actual GitHub Issues (fetched via gh command)
   - User's selections
   - Actual codebase analysis

---

## Steps

### Step 1: Check Prerequisites

1. **Check repo state** (warning-based):

   ```bash
   node .specify/scripts/state.cjs query --repo
   ```

   - Check Domain status
   - If status is not "approved" or "clarified":
     ```
     WARNING: Domain Spec がまだ精密化されていません（status: [status]）。
     Feature 開発を始める前に `/speckit.design` で Domain を完成させることを推奨します。
     続行しますか？ (y/N)
     ```
   - Human can choose to proceed

2. **Verify Domain Spec exists and is clarified**:
   - Check `.specify/specs/domain/spec.md` exists (or legacy `.specify/specs/overview/spec.md`)
   - Check Domain has M-_ and API-_ definitions (not just placeholders)
   - If Domain is scaffold or missing M-_/API-_:

     ```
     Domain Spec がまだ精密化されていません。
     Feature 開発を始める前に `/speckit.design` で Domain を完成させてください。

     必要な定義:
     - マスターデータ (M-*)
     - API 契約 (API-*)
     - ビジネスルール
     ```

3. **Check Screen Spec exists (optional but recommended)**:
   - Check `.specify/specs/screen/spec.md` exists
   - If not found: Warning only (続行可能)
     ```
     WARNING: Screen Spec が見つかりません。
     `/speckit.design` で Screen + Domain Spec を同時に作成することを推奨します。
     続行しますか？ (y/N)
     ```
   - If found: Extract Screen Index (SCR-\*) for later use in Step 6.7

#### Self-Check (Step 1)

- [ ] state.cjs query --repo を実行したか
- [ ] Domain Spec を Read ツールで読み込んだか
- [ ] Screen Spec の存在を確認したか
- [ ] M-*/API-* 定義が存在するか確認したか

### Step 2: Fetch and Display Issues

3. **Fetch open issues**:

   ```bash
   gh issue list --state open --limit 30 --json number,title,labels,body
   ```

4. **Categorize and display**:

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

5. **Validate selection**:
   - If `in-progress`: Warn "既に作業中です。続行しますか？"
   - If closed: Warn "この Issue は閉じられています"

6. **Determine workflow type**:
   - Labels `bug`, `fix`, `defect` → Bug fix workflow
   - Labels `feature`, `enhancement` → Feature workflow
   - If unclear, analyze title/body or ask human

#### Self-Check (Steps 2-3)

- [ ] gh issue list を実行したか
- [ ] Issue 一覧を表示したか
- [ ] ユーザーの Issue 選択を受け付けたか
- [ ] ワークフロータイプ（Feature/Bug）を判定したか

### Step 4: Setup Branch

7. **Update Issue label**:

   ```bash
   gh issue edit <num> --remove-label backlog --add-label in-progress
   ```

8. **Create branch**:
   - Feature: `node .specify/scripts/branch.cjs --type feature --slug <slug> --issue <num>`
   - Bug fix: `node .specify/scripts/branch.cjs --type fix --slug <slug> --issue <num>`
   - Note: branch.cjs automatically updates branch-state.json

#### Self-Check (Step 4)

- [ ] gh issue edit でラベルを更新したか
- [ ] branch.cjs でブランチを作成したか

### Step 5: Analyze Codebase

9. **Analyze codebase** (context collection):
   - Use Serena to explore existing code structure
   - Identify related components, patterns, dependencies
   - Use context7 for library documentation if needed

### Step 6: Create Feature Spec

10. **Read Domain spec**:
    - Extract defined M-\* (master data)
    - Extract defined API-\* (API contracts)
    - Extract business rules and constraints

11. **Scaffold Feature spec**:

    ```bash
    node .specify/scripts/scaffold-spec.cjs --kind feature --id S-XXX-001 --title "..." --domain S-DOMAIN-001
    ```

12. **Fill Feature spec sections**:
    - **Section 1 (Purpose)**: Issue description から抽出
    - **Section 2 (Actors)**: Domain Spec から関連アクターを参照
    - **Section 3 (Domain Dependencies)**: Domain Spec の M-_/API-_ を参照
      - 参照する M-\* を明示: `Depends on: M-CLIENTS, M-PROJECTS`
      - 参照する API-\* を明示: `Uses: API-CLIENTS-LIST, API-PROJECTS-CREATE`
    - **Section 6 (Use Cases)**: Issue から UC を生成
      - UC-XXX-001 形式（XXX は Feature ID の一部）
    - **Section 7 (Functional Requirements)**: UC から FR を導出
    - Mark unclear items as `[NEEDS CLARIFICATION]`

### Step 6.5: Check M-_/API-_ Requirements (Case 2/3 Branching)

13. **Identify required M-_/API-_/BR-\***:
    - List all M-_, API-_, BR-\* that this Feature needs
    - Compare against existing Domain Spec definitions

14. **Classify each requirement**:
    | Case | Situation | Action |
    |------|-----------|--------|
    | Case 1 | Existing M-_/API-_ is sufficient | Add reference to Feature Spec |
    | Case 2 | New M-_/API-_/BR-_ needed | Add to Domain Spec during Feature Spec creation |
    | Case 3 | Existing M-_/API-_/BR-_ needs modification | Trigger `/speckit.change` |

15. **Handle Case 2 (New additions)**:
    - Add new M-_/API-_/BR-\* to Domain Spec
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

16. **Handle Case 3 (Modifications needed)**:
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

17. **Update Feature Index in Domain Spec**:
    - Open `.specify/specs/domain/spec.md`
    - Add or update entry in Section 8 (Feature Index):
      ```markdown
      | S-XXX-001 | [Feature Title] | `.specify/specs/s-xxx-001/` | Draft | [M-*, API-*] |
      ```
    - If entry already exists (from `/speckit.design`), update Status to current state

### Step 6.6.5: Update Cross-Reference Matrix

**Matrix が存在する場合、Feature を追加/更新する。**

18. **Read `.specify/matrix/cross-reference.json`**

19. **Add or update Feature entry**:
    ```json
    "features": {
      "S-XXX-001": {
        "title": "[Feature Title]",
        "screens": ["SCR-XXX", "SCR-YYY"],
        "masters": ["M-XXX"],
        "apis": ["API-XXX-LIST", "API-XXX-CREATE"],
        "rules": ["BR-XXX"]
      }
    }
    ```

20. **Update Permissions** (if new APIs added):
    ```json
    "permissions": {
      "API-XXX-LIST": ["role1", "role2"],
      "API-XXX-CREATE": ["admin"]
    }
    ```

21. **Regenerate Matrix view**:
    ```bash
    node .specify/scripts/generate-matrix-view.cjs
    ```

### Step 6.7: Update Screen Spec First (Spec-First)

**Screen Spec が存在する場合、Feature Spec 作成前に Screen Spec を更新する。**

22. **Show Screen Index**:

    ```
    === Screen Index ===

    この機能に関連する画面を選択してください:

    | # | Screen ID | Name | Status |
    |---|-----------|------|--------|
    | 1 | SCR-001 | ログイン | Implemented |
    | 2 | SCR-002 | ダッシュボード | Implemented |
    | 3 | SCR-003 | 在庫一覧 | Planned |
    | ...

    関連する画面の番号を入力（複数可、例: 1,3）:
    ```

23. **Check screen requirements**:
    - 既存画面のみ使用（変更なし） → Step 24 へ
    - 既存画面の変更が必要 → Step 25 へ
    - 新規画面が必要 → Step 26 へ

24. **Reference existing screens**:
    - Feature Spec Section 8.1 に SCR-\* 参照を追加
    - 変更なしの場合は Step 27 へ

25. **Update Screen Spec for modifications** (Spec-First):

    ```
    === Screen Spec 更新（Spec-First） ===

    この機能で既存画面に変更が必要です:
    - SCR-003: フィルター機能追加
    - SCR-003: ページネーション追加

    Screen Spec を先に更新します:
    1. Section 2.1 Modification Log に変更を追加
    2. ワイヤーフレームを計画状態に更新
    3. Status: Planned として記録

    更新しますか？ [yes/no]
    ```

    - Screen Spec 更新後、Step 27 へ

26. **Add new screens to Screen Spec** (Spec-First):

    ```
    === 新規画面追加（Spec-First） ===

    この機能には新しい画面が必要です:
    - 在庫詳細画面（個別在庫の詳細表示）

    Screen Spec を先に更新します:
    1. Screen Index に SCR-004 を追加（Status: Planned）
    2. Section 4 に画面詳細・ワイヤーフレームを追加
    3. 遷移図を更新

    更新しますか？ [yes/no]
    ```

    - Screen Spec 更新後、Step 27 へ

27. **Update Feature Spec Section 8**:
    - Section 8.1: 関連する SCR-\* を参照
    - Section 8.3: Screen Spec への参照を記録（変更内容は Screen Spec に記載済み）
    - Set "Related Screen: S-SCREEN-001" in header

#### Self-Check (Step 6)

- [ ] Domain Spec を Read ツールで読み込んだか
- [ ] scaffold-spec.cjs で Feature Spec をスキャフォールドしたか
- [ ] Feature Spec の各セクションを埋めたか
- [ ] M-*/API-* の Case 1/2/3 分岐を判断したか
- [ ] Matrix が存在する場合、Feature を追加/更新したか
- [ ] Screen Spec が存在する場合、画面選択を実施したか
- [ ] 曖昧な項目に [NEEDS CLARIFICATION] マークを付けたか

---

### Step 7: Run Lint

28. **Run lint**:

    ```bash
    node .specify/scripts/spec-lint.cjs
    ```

    - Check Feature correctly references Domain M-_/API-_
    - Check UC IDs are unique
    - Check Feature Index entry exists

### Step 8: Summary & Clarify 推奨

29. **Spec Summary 表示**:

    ```
    === Feature Spec 作成完了 ===

    Issue: #[N] [タイトル]
    Branch: feature/[N]-[slug]
    Spec: .specify/specs/s-xxx-001/spec.md

    概要:
    - UC (User Stories): [N] 個
    - FR (Functional Requirements): [N] 個
    - SC (Success Criteria): [N] 個
    - Domain Dependencies: [M-*, API-*, BR-* のリスト]
    - Screen Dependencies: [SCR-* のリスト]
    ```

30. **曖昧点レポート**:

    ```
    === 曖昧点 ===

    [NEEDS CLARIFICATION] マーク: [N] 箇所

    - Section 4: UC-001 のエッジケースが未定義
    - Section 5: FR-003 の具体的な処理が不明
    - ...

    推奨: `/speckit.clarify` で曖昧点を解消してください。
    ```

31. **次のステップ提示**:

    ```
    次のステップ:

    1. [推奨] `/speckit.clarify` - 曖昧点を解消
    2. `/speckit.plan` - 曖昧点を残したまま計画作成（非推奨）

    Clarify をスキップすると、実装中の手戻りリスクが高まります。
    ```

#### Self-Check (Steps 7-8)

- [ ] spec-lint.cjs を実行したか
- [ ] Spec Summary を出力したか
- [ ] 曖昧点レポートを出力したか
- [ ] 次のステップ（/speckit.clarify 推奨）を提示したか

### Step 9: Update State

32. **Update branch state** (on approval):

    ```bash
    node .specify/scripts/state.cjs branch --set-spec-id S-XXX-001 --set-spec-path .specify/specs/s-xxx-001/spec.md --set-step spec_review
    ```

33. **Update repo state** (if Case 2 occurred):
    ```bash
    # Add new definitions that were added during Feature Spec creation
    node .specify/scripts/state.cjs repo --add-master M-NEW-ENTITY --add-api API-NEW-ENDPOINT
    ```

#### Self-Check (Step 9)

- [ ] state.cjs branch --set-spec-id を実行したか
- [ ] Case 2 が発生した場合、state.cjs repo を更新したか
- [ ] 全ての Step が完了し、todo を全て `completed` にマークしたか

## Output

- Selected Issue number and type
- Branch name
- Spec path
- Domain references (M-_, API-_)
- Spec summary (UC/FR count)
- 曖昧点レポート
- Next step recommendation: `/speckit.clarify`

## Human Checkpoints

1. Select Issue to work on
2. Approve Case 3 redirect to `/speckit.change` (if needed)
3. Review Spec Summary
4. → `/speckit.clarify` で曖昧点を解消

---

## Example

> ⚠️ **WARNING: REFERENCE ONLY**
>
> The following examples are for understanding the workflow ONLY.
> **DO NOT copy or output these example values** (在庫一覧・検索, S-INVENTORY-001, M-PRODUCTS, etc.).
> Always use ACTUAL data from Domain Spec and GitHub Issues.

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

    === Feature Spec 作成完了 ===

    Issue: #2 S-INVENTORY-001: 在庫一覧・検索
    Branch: feature/2-inventory
    Spec: .specify/specs/s-inventory-001/spec.md

    概要:
    - UC (User Stories): 3 個
    - FR (Functional Requirements): 8 個
    - SC (Success Criteria): 3 個
    - Domain Dependencies: M-PRODUCTS, M-INVENTORY, 4 APIs

    === 曖昧点 ===

    [NEEDS CLARIFICATION] マーク: 3 箇所

    - Section 6: UC-INV-001 の検索対象フィールドが未定義
    - Section 7: FR-INV-002 のページネーション仕様が未定義
    - Section 8: パフォーマンス要件が未定義

    推奨: `/speckit.clarify` で曖昧点を解消してください。

    次のステップ:
    1. [推奨] `/speckit.clarify` - 曖昧点を解消
    2. `/speckit.plan` - 曖昧点を残したまま計画作成（非推奨）
```

---

## Notes

- **Domain 必須**: Feature spec は必ず Domain Spec の M-_/API-_ を参照する
- **Domain が未精密化の場合**: `/speckit.design` を促して中断する（Feature 作成を続行しない）
- **Bug fix の場合**: 既存 Feature spec の Changelog セクションを更新
- **新しい M-_/API-_ が必要な場合**: Domain Spec を先に更新するよう促す
