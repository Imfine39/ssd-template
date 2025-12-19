---
description: Change Vision, Domain, or Screen Spec (existing M-*/API-*/BR-*/VR-*/SCR-*). Analyzes impact on Features.
handoffs:
  - label: Clarify Changes
    agent: speckit.clarify
    prompt: Clarify the Spec changes
    send: true
  - label: Resume Suspended Work
    agent: speckit.issue
    prompt: Resume the suspended feature implementation
    send: true
---

## User Input

```text
$ARGUMENTS
```

## Purpose

Change existing definitions in Vision Spec, Domain Spec, or Screen Spec.
This command handles **modifications to existing items**, not additions.

**Use this when:**

- Modifying existing M-\* (field changes, constraint changes)
- Modifying existing API-\* (request/response shape changes)
- Modifying existing BR-_/VR-_ (business rule changes)
- Modifying existing SCR-\* (screen layout, navigation, component changes)
- Modifying Vision Spec (purpose, journey, scope changes)

**NOT needed for (Case 2 - handle in Feature Spec creation or `/speckit.design`):**

- Adding new M-\*
- Adding new API-\*
- Adding new BR-_/VR-_
- Adding new SCR-\* (use `/speckit.design` for new screens)

## Triggers

1. User explicitly calls `/speckit.change`
2. Feature Spec creation detects need to modify existing M-_/API-_/BR-\* (Case 3)
3. `/speckit.feedback` determines Spec change is required
4. Implementation reveals spec inconsistency

## Execution Protocol (MUST FOLLOW)

**Before starting:**

1. Use **TodoWrite** to create todos for all main Steps:
   - "Step 1: Identify change target"
   - "Step 2: Impact analysis"
   - "Step 3: Determine Issue requirement"
   - "Step 4: Create Issues (if needed)"
   - "Step 5: Create branch and change Spec"
   - "Step 5.5: Update Cross-Reference Matrix"
   - "Step 6: Lint and review"
   - "Step 7: Create PR"

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

1. **DO NOT use Example content** - The Example section below is for reference ONLY. NEVER output example data (「M-USER」「email 必須化」「S-AUTH-001」etc.) as actual results.

2. **MUST use tools** - You MUST actually:
   - Use the **Read tool** to read Vision/Domain/Screen Spec
   - Use the **Bash tool** to run grep, gh commands, and scripts
   - Use the **Write/Edit tool** to update spec files

3. **Real data only** - All output must come from:
   - Actual Spec content
   - User's $ARGUMENTS (change description)
   - Actual impact analysis from grep results

---

## Steps

### Step 1: Identify Change Target

1. **Parse change description**:
   - Extract from `$ARGUMENTS`
   - If empty, ask: "何を変更しますか？（例: M-USER の email を必須化）"

2. **Determine target Spec**:
   - Vision Spec (`.specify/specs/vision/spec.md`)
   - Domain Spec (`.specify/specs/domain/spec.md`)
   - Screen Spec (`.specify/specs/screen/spec.md`)

3. **Identify specific item**:
   - For Domain: M-_, API-_, BR-_, VR-_
   - For Screen: SCR-\* (layout, navigation, components)
   - For Vision: Purpose, Journey, Scope section

4. **Describe the change**:

   ```
   === 変更内容 ===

   対象: Domain Spec - M-USER
   変更: email フィールドを optional → required に変更
   理由: [ユーザーに確認 or $ARGUMENTS から抽出]
   ```

#### Self-Check (Step 1)

- [ ] 変更対象を $ARGUMENTS から抽出したか
- [ ] 対象 Spec（Vision/Domain/Screen）を特定したか
- [ ] 具体的な変更項目（M-*/API-*/SCR-* 等）を特定したか
- [ ] 変更内容と理由を確認したか

### Step 2: Impact Analysis

5. **Search for references**:

   Use the Grep tool to find Features referencing the changed item:

   ```
   # Find Features referencing the changed item (Domain)
   Grep pattern="M-USER" path=".specify/specs/" glob="**/spec.md"

   # For Screen changes, also find Feature SCR-* references
   Grep pattern="SCR-001" path=".specify/specs/" glob="**/spec.md"
   ```

   Or via bash (cross-platform compatible):
   ```bash
   grep -r "M-USER" .specify/specs/ --include="spec.md"
   grep -r "SCR-001" .specify/specs/ --include="spec.md"
   ```

6. **Analyze each Feature**:
   - Check if the changed part is actually used
   - Determine impact level:
     - **No Impact**: References item but not the changed part
     - **Spec Update**: Feature Spec needs update
     - **Code Fix**: Implementation already done, code needs fix

7. **Display impact analysis**:

   ```
   === 影響分析: M-USER 変更 ===

   変更内容: email フィールドを optional → required に変更

   影響する Feature:

   1. S-AUTH-001 (認証機能) - Status: Completed
      参照箇所: UC-001 ログイン処理, FR-003 バリデーション
      影響度: 【実装修正必要】
      理由: ログイン時の email 検証ロジック変更が必要

   2. S-PROFILE-001 (プロフィール) - Status: Approved
      参照箇所: UC-001 プロフィール表示
      影響度: 【影響なし】
      理由: 表示のみ、必須チェック不要

   3. S-REGISTRATION-001 (ユーザー登録) - Status: Implementing
      参照箇所: UC-001 登録フォーム, FR-002 入力検証
      影響度: 【Spec更新 + 実装修正必要】
      理由: 登録フォームのバリデーション変更が必要

   合計: 3 Feature 影響
   - Spec 更新のみ: 0
   - 実装修正必要: 2
   - 影響なし: 1
   ```

#### Self-Check (Step 2)

- [ ] Grep ツールまたは grep コマンドで参照を検索したか
- [ ] 影響を受ける Feature を全て特定したか
- [ ] 各 Feature の影響度（影響なし/Spec更新/実装修正必要）を判定したか
- [ ] 影響分析結果を表示したか

### Step 3: Determine Issue Requirement

8. **Check if Issue is needed**:
   - Impact Feature count = 0 → Issue 不要、直接 PR
   - Impact Feature count >= 1 → Issue 必須

9. **If Issue not needed**:
   - Skip to Step 5 (Spec Change)
   - Create PR directly after change

#### Self-Check (Step 3)

- [ ] 影響 Feature 数に基づいて Issue 要否を判定したか
- [ ] 判定結果をユーザーに確認したか

### Step 4: Create Issues (Sub-issue Structure)

10. **Create parent Issue**:

    ```bash
    gh issue create \
      --title "[Spec Change] M-USER: email を必須化" \
      --body "## 変更内容
    M-USER の email フィールドを optional → required に変更

    ## 理由
    [理由]

    ## 影響する Feature
    - S-AUTH-001: 実装修正必要
    - S-REGISTRATION-001: Spec更新 + 実装修正必要

    ## 子 Issue
    - [ ] Spec 更新（Domain + 影響 Feature）
    - [ ] S-AUTH-001 実装修正
    - [ ] S-REGISTRATION-001 実装修正" \
      --label spec-change
    ```

11. **Create child Issue for Spec updates**:

    ```bash
    gh issue create \
      --title "[Spec] M-USER 変更: Domain + Feature Spec 更新" \
      --body "Parent: #[親Issue番号]

    ## 対象
    - Domain Spec: M-USER 定義更新
    - S-AUTH-001: 参照部分更新
    - S-REGISTRATION-001: 参照部分更新

    ## 変更内容
    email フィールドを required に変更し、関連する Feature Spec の
    FR/UC を更新する。" \
      --label spec-change
    ```

12. **Create child Issues for implementation fixes** (for each completed/implementing Feature):

    ```bash
    gh issue create \
      --title "[Fix] S-AUTH-001: M-USER email 必須化対応" \
      --body "Parent: #[親Issue番号]

    ## 背景
    M-USER の email が必須になったため、実装の修正が必要。

    ## 修正内容
    - ログイン時の email 検証ロジック追加
    - エラーメッセージ更新

    ## 関連
    - Spec Change: #[親Issue番号]
    - Feature Spec: .specify/specs/s-auth-001/spec.md" \
      --label fix
    ```

#### Self-Check (Step 4)

- [ ] Issue 作成が必要な場合、親 Issue を作成したか
- [ ] Spec 更新用の子 Issue を作成したか
- [ ] 実装修正が必要な Feature ごとに子 Issue を作成したか

### Step 5: Create Branch and Change Spec

13. **Create branch**:

    ```bash
    node .specify/scripts/branch.cjs --type spec --slug <slug> --issue <spec-issue-num>
    ```

14. **Update Vision or Domain Spec**:
    - Make the specified change
    - Update related sections
    - Add Changelog entry

15. **Update affected Feature Specs**:
    - Update Domain Dependencies section
    - Update affected FR/UC
    - Add Changelog entry noting the change

#### Self-Check (Step 5)

- [ ] branch.cjs でブランチを作成したか
- [ ] Vision/Domain/Screen Spec を更新したか
- [ ] 影響を受ける Feature Spec を更新したか
- [ ] 各 Spec に Changelog エントリを追加したか

### Step 5.5: Update Cross-Reference Matrix

16. **Check if Matrix update is needed**:

    Matrix が存在する場合（`.specify/matrix/cross-reference.json`）、以下を確認:

    | 変更種別 | Matrix 更新内容 |
    |---------|----------------|
    | M-\* 変更 | `masters` の参照整合性を確認 |
    | API-\* 変更 | `apis` の参照整合性を確認、`permissions` 更新 |
    | SCR-\* 変更 | `screens` のエントリ更新（masters/apis 参照変更時） |
    | 新規 ID 追加 | 該当カテゴリに新エントリ追加 |

17. **Update Matrix** (if needed):

    ```bash
    # Matrix を更新
    # 例: Screen に新しい API 参照を追加
    {
      "screens": {
        "SCR-003": {
          "name": "在庫一覧",
          "masters": ["M-PRODUCT", "M-WAREHOUSE"],
          "apis": ["API-INVENTORY-LIST", "API-INVENTORY-FILTER"]  // 変更
        }
      }
    }
    ```

18. **Regenerate Matrix view**:

    ```bash
    node .specify/scripts/generate-matrix-view.cjs
    ```

19. **曖昧点の検出**:
    - If change introduces ambiguity, mark as `[NEEDS CLARIFICATION]`
    - 推奨: `/speckit.clarify` で曖昧点を解消

#### Self-Check (Step 5.5)

- [ ] Matrix 更新が必要かどうか確認したか
- [ ] 必要な場合、Matrix を更新したか
- [ ] generate-matrix-view.cjs を実行したか

### Step 6: Lint and Review

20. **Run lint**:

    ```bash
    node .specify/scripts/spec-lint.cjs
    ```

21. **Show summary**:

    ```
    === Spec Change 完了 ===

    親 Issue: #20 [Spec Change] M-USER: email を必須化

    子 Issues:
    - #21 [Spec] Domain + Feature Spec 更新 ← 現在のブランチ
    - #22 [Fix] S-AUTH-001 実装修正 (後で対応)
    - #23 [Fix] S-REGISTRATION-001 実装修正 (後で対応)

    変更した Spec:
    - .specify/specs/domain/spec.md
    - .specify/specs/s-auth-001/spec.md
    - .specify/specs/s-registration-001/spec.md

    Matrix 更新:
    - cross-reference.json: 該当なし / 更新済み

    次のステップ:
    1. PR を作成してレビューを受ける
    2. マージ後、#22, #23 の実装修正に取り掛かる
    ```

#### Self-Check (Step 6)

- [ ] spec-lint.cjs を実行したか
- [ ] エラーがあれば修正したか
- [ ] サマリーを出力したか

### Step 7: Create PR

22. **Create PR**:

    ```bash
    gh pr create \
      --title "[Spec] M-USER: email 必須化 - Spec 更新" \
      --body "## Summary
    M-USER の email フィールドを必須化し、影響する Feature Spec を更新。

    ## Changes
    - Domain Spec: M-USER.email を required に変更
    - S-AUTH-001: FR-003 バリデーションルール更新
    - S-REGISTRATION-001: FR-002 入力検証ルール更新

    ## Related Issues
    - Parent: #20
    - Closes #21

    ## Follow-up
    実装修正は別 PR で対応:
    - #22 S-AUTH-001
    - #23 S-REGISTRATION-001"
    ```

#### Self-Check (Step 7)

- [ ] gh pr create で PR を作成したか
- [ ] 次のステップ（実装修正 Issue）を提示したか
- [ ] 全ての Step が完了し、todo を全て `completed` にマークしたか

## Output

- Parent Issue number (if created)
- Child Issue numbers
- Branch name
- Changed Spec files
- Matrix update status (該当なし / 更新済み)
- PR (if created)
- Next steps for implementation fixes

## Human Checkpoints

1. Confirm change description and reason
2. Review impact analysis
3. Approve Issue creation
4. Review Spec changes
5. Approve PR

## Integration with Suspended Work

When `/speckit.change` is triggered from Feature implementation (Case 3):

```
[Feature 実装中に Case 3 発生]

AI: 既存の M-PRODUCT に変更が必要です。
    /speckit.change を実行しますか？

人間: はい

AI: 現在の作業を中断します。
    - Feature: S-INVENTORY-001
    - Branch: feature/5-inventory
    - Step: implement (tasks 3/10)

    # Suspend the current branch
    node .specify/scripts/state.cjs suspend --branch feature/5-inventory --reason spec-change --related 20 --resume-after "PR #30 merged"

    /speckit.change を開始...

    [change 完了後]

    中断していた作業を再開しますか？
    - S-INVENTORY-001 の Feature Spec も今回の変更で更新されました

人間: はい

AI: # Resume the suspended branch
    node .specify/scripts/state.cjs resume --branch feature/5-inventory --step implement

    feature/5-inventory に切り替えました。
    Feature Spec の変更を確認してください。
    実装を再開します。
```

**State management commands for suspension**:

```bash
# Check for suspended work before starting
node .specify/scripts/state.cjs query --suspended

# Suspend current work
node .specify/scripts/state.cjs suspend --branch <branch> --reason spec-change --related <issue-num>

# Resume after change is merged
node .specify/scripts/state.cjs resume --branch <branch> --step implement
```

## Example

> ⚠️ **WARNING: REFERENCE ONLY**
>
> The following examples are for understanding the workflow ONLY.
> **DO NOT copy or output these example values** (M-USER, email 必須化, S-AUTH-001, S-REGISTRATION-001, etc.).
> Always use ACTUAL data from user input and Spec analysis.

```
人間: /speckit.change M-USER の email を必須にしたい

AI: === 変更内容 ===

    対象: Domain Spec - M-USER
    変更: email フィールドを optional → required

    変更理由を教えてください。

人間: セキュリティ強化のため、全ユーザーにメール認証を必須にする

AI: 影響分析を実行中...

    === 影響分析: M-USER.email 変更 ===

    影響する Feature:

    1. S-AUTH-001 (認証機能) - Status: Completed
       影響度: 【実装修正必要】

    2. S-PROFILE-001 (プロフィール) - Status: Approved
       影響度: 【影響なし】

    3. S-REGISTRATION-001 (ユーザー登録) - Status: Implementing
       影響度: 【Spec更新 + 実装修正必要】

    影響 Feature が 2 件あるため、Issue を作成します。
    よろしいですか？

人間: はい

AI: Issue を作成しました:

    親 Issue #20: [Spec Change] M-USER: email を必須化
    子 Issue #21: [Spec] Domain + Feature Spec 更新
    子 Issue #22: [Fix] S-AUTH-001 実装修正
    子 Issue #23: [Fix] S-REGISTRATION-001 実装修正

    Branch spec/21-user-email-required を作成しました。

    Spec を更新中...

    [Domain Spec 更新]
    [S-AUTH-001 Spec 更新]
    [S-REGISTRATION-001 Spec 更新]

    lint を実行中... OK

    === Spec Change 完了 ===

    PR を作成しますか？

人間: はい

AI: PR #30 を作成しました。
    https://github.com/xxx/yyy/pull/30

    マージ後、以下の実装修正 Issue に取り掛かってください:
    - #22 S-AUTH-001
    - #23 S-REGISTRATION-001
```

## Notes

- Vision Spec の変更は Domain/Screen → Feature と波及するため、影響範囲が大きくなりやすい
- Screen Spec の変更は Feature の UI/UX 部分に影響するため、実装済み画面の修正が必要になる可能性あり
- 変更の規模に関わらず、影響 Feature があれば必ず Issue を作成
- Spec 更新は一括 PR、実装修正は Feature ごとの PR
- Sub-issue 構造で全体の進捗を追跡可能
- **Matrix 更新**: M-\*/API-\*/SCR-\* の変更時は Matrix の整合性を確認し、必要に応じて更新

### Screen Spec 変更の影響分析例

```
=== 影響分析: SCR-003 在庫一覧画面 変更 ===

変更内容: フィルターパネルを左サイドバーからトップバーに移動

影響する Feature:

1. S-INVENTORY-001 (在庫一覧・検索) - Status: Completed
   参照箇所: UC-001 在庫検索, FR-002 フィルター操作
   影響度: 【実装修正必要】
   理由: フィルターコンポーネントの配置変更が必要

2. S-STOCKTAKE-001 (棚卸し) - Status: Approved
   参照箇所: UC-003 在庫表示参照
   影響度: 【影響なし】
   理由: フィルターは使用しない
```
