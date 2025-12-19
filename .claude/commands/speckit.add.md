---
description: Add a new feature (Entry Point). Creates Issue, Branch, Spec.
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

## User Input

```text
$ARGUMENTS
```

## Purpose

**Entry point** for new features when no Issue exists.
Creates Issue → Branch → Spec. Clarify は別コマンドで実行。

**This command focuses on:** Spec 作成のみ。Clarify は `/speckit.clarify` で実行。

**Use this when:** You want to add something new and no Issue exists.
**Use `/speckit.issue` instead when:** Issues already exist (from `/speckit.design` or human creation).
**Next steps:** `/speckit.clarify` で曖昧点を解消 → `/speckit.plan` で実装計画

## Execution Protocol (MUST FOLLOW)

**Before starting:**

1. Use **TodoWrite** to create todos for all main Steps:
   - "Step 1: Quick Input Collection"
   - "Step 2: Check prerequisites"
   - "Step 3: Create GitHub Issue"
   - "Step 4: Create branch"
   - "Step 5: Analyze codebase"
   - "Step 6: Create Feature Spec"
   - "Step 6.5: Update Screen Spec First (Spec-First)"
   - "Step 7: Check M-*/API-* Requirements"
   - "Step 8: Update Domain Spec Feature Index"
   - "Step 8.5: Update Cross-Reference Matrix"
   - "Step 9: Run lint"
   - "Step 10: Record Original Input & Reset"
   - "Step 11: Summary & Clarify 推奨"

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

1. **DO NOT use Example content** - The Example section below is for reference ONLY. NEVER output example data (「PDFエクスポート」「一覧画面からPDF出力」etc.) as actual results.

2. **MUST use tools** - You MUST actually:
   - Use the **Read tool** to read `.specify/input/add-input.md`
   - Use the **Bash tool** to run gh commands and scaffold scripts
   - Use the **Write/Edit tool** to create/modify spec files

3. **Real data only** - All output must come from:
   - User's input file (`.specify/input/add-input.md`)
   - User's $ARGUMENTS
   - User's chat responses

---

## Steps

### Step 1: Quick Input Collection

**Goal:** 構造化された入力を収集し、AI が的確な Feature Spec を生成できるようにする。

#### 1.1 入力ファイルの読み込み

**【必須】Read ツールで `.specify/input/add-input.md` を読み込むこと。**

```
Use the Read tool to read: .specify/input/add-input.md
```

**DO NOT skip this step. DO NOT assume the file content.**

#### 1.2 入力方式の判定

以下の優先順位で入力を判定:

1. **入力ファイルにユーザー記入がある場合**
   - `.specify/input/add-input.md` の各項目（機能名、課題など）に記入がある
   - → その内容を使用して Step 1.4 へ

2. **$ARGUMENTS に十分な情報がある場合**
   - 機能名、解決したい課題、期待する動作が含まれる
   - → その内容を使用して Step 1.4 へ

3. **どちらも不十分な場合**
   - → Step 1.3 で入力ファイルの記入を促す

**入力ファイルが「記入済み」かの判定:**

- 「機能名」が空でない
- 「期待する動作」に1つ以上の項目がある
- → 両方満たせば「記入済み」と判定

#### 1.3 入力ファイルの記入を促す

```
入力が不足しています。

以下のいずれかの方法で情報を提供してください:

Option A: 入力ファイルを編集（推奨）
  1. `.specify/input/add-input.md` をエディタで開く
  2. テンプレートを埋める
  3. `/speckit.add` を再実行

Option B: チャットで情報を提供
  追加したい機能について教えてください:
  - 機能名
  - 解決したい課題
  - 期待する動作（3-5個）
```

**入力ファイルの編集を待つか、チャットでの入力を受け付ける。**

#### 1.4 入力の解析

入力から以下を抽出:

| 項目             | 抽出先                                              |
| ---------------- | --------------------------------------------------- |
| 機能名           | Feature Spec タイトル, Issue タイトル               |
| 解決したい課題   | Section 1 (Purpose)                                 |
| 誰が使うか       | Section 3 (Actors)                                  |
| 期待する動作     | Section 4-5 (User Stories, Functional Requirements) |
| 関連する既存機能 | Section 2 (Domain Dependencies)                     |
| 制約             | Section 8 (Non-Functional Requirements)             |

#### Self-Check (Step 1)

- [ ] Read ツールで `.specify/input/add-input.md` を読み込んだか
- [ ] Example の値（PDFエクスポート等）を使用していないか
- [ ] 入力方式を正しく判定したか（入力ファイル/ARGUMENTS/不十分）
- [ ] 入力が不十分な場合、ユーザーに確認を求めたか

---

### Step 2: Check Prerequisites

1. **Check Domain Spec exists and is clarified**:
   - Look for Domain spec in `.specify/specs/domain/` (or legacy `.specify/specs/overview/`)
   - If not found: "Domain Spec が見つかりません。先に `/speckit.design` を実行してください"
   - Check Domain has M-_ and API-_ definitions (not just placeholders)
   - If Domain is scaffold or missing M-_/API-_:
     "Domain Spec がまだ精密化されていません。先に `/speckit.design` を完了してください"

2. **Check Screen Spec exists (optional but recommended)**:
   - Look for Screen spec in `.specify/specs/screen/`
   - If not found: Warning only (続行可能)
     "WARNING: Screen Spec が見つかりません。`/speckit.design` で画面設計を含めて作成することを推奨します。"
   - If found: Extract Screen Index for Step 6.5

#### Self-Check (Step 2)

- [ ] Domain Spec を Read ツールで確認したか
- [ ] M-*/API-* 定義が存在するか確認したか
- [ ] Screen Spec の存在を確認したか

---

### Step 3: Create GitHub Issue

```bash
gh issue create --title "[Feature] <title>" --body "..." --label feature
```

#### Self-Check (Step 3)

- [ ] gh issue create を実行したか
- [ ] Issue 番号を取得したか

---

### Step 4: Create Branch

```bash
node .specify/scripts/branch.cjs --type feature --slug <slug> --issue <num>
```

#### Self-Check (Step 4)

- [ ] branch.cjs でブランチを作成したか

---

### Step 5: Analyze Codebase

- Use Serena to explore existing code structure
- Identify related components, patterns, dependencies
- Use context7 for library documentation if needed

#### Self-Check (Step 5)

- [ ] コードベースを探索したか
- [ ] 関連コンポーネント/パターンを特定したか

---

### Step 6: Create Feature Spec

- Scaffold: `node .specify/scripts/scaffold-spec.cjs --kind feature --id S-XXX-001 --title "..." --domain S-DOMAIN-001`
- Fill sections: Purpose, Actors, Domain Model (M-_, API-_), UC, FR, SC, Edge Cases, NFR
- Reference analyzed code patterns and constraints
- Mark unclear items as `[NEEDS CLARIFICATION]`

#### Self-Check (Step 6)

- [ ] scaffold-spec.cjs で Feature Spec をスキャフォールドしたか
- [ ] 各セクションを埋めたか
- [ ] 曖昧な項目に [NEEDS CLARIFICATION] マークを付けたか

---

### Step 6.5: Update Screen Spec First (Spec-First)

**Screen Spec が存在する場合、Feature Spec 作成前に Screen Spec を更新する。**

1. **Show Screen Index**:

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

2. **Check screen requirements**:
   - 既存画面のみ使用 → 6.5.3 へ
   - 既存画面の変更が必要 → 6.5.4 へ
   - 新規画面が必要 → 6.5.5 へ

3. **Reference existing screens** (6.5.3):
   - Feature Spec Section 8.1 に SCR-\* 参照を追加
   - 変更なしの場合はそのまま Feature Spec 作成へ

4. **Update Screen Spec for modifications** (6.5.4, Spec-First):

   ```
   === Screen Spec 更新（Spec-First） ===

   この機能で既存画面に変更が必要です:
   - SCR-002: 「エクスポート」ボタン追加

   Screen Spec を先に更新します:
   1. Section 2.1 Modification Log に変更を追加
   2. 必要に応じてワイヤーフレームを更新
   3. Status: Planned として記録

   更新しますか？ [yes/no]
   ```

   - Screen Spec 更新後、Feature Spec 作成を続行

5. **Add new screens to Screen Spec** (6.5.5, Spec-First):

   ```
   === 新規画面追加（Spec-First） ===

   この機能には新しい画面が必要です:
   - [新規画面の説明]

   Screen Spec を先に更新します:
   1. Screen Index に新規 SCR-* を追加（Status: Planned）
   2. Section 4 に画面詳細を追加
   3. 遷移図を更新

   更新しますか？ [yes/no]
   ```

   - Screen Spec 更新後、Feature Spec 作成を続行

6. **Update Feature Spec Section 8**:
   - Section 8.1: 関連する SCR-\* を参照
   - Section 8.3: Screen Spec への参照を記録（変更内容は Screen Spec に記載済み）

#### Self-Check (Step 6.5)

- [ ] Screen Spec が存在する場合、画面選択を実施したか
- [ ] 既存画面の変更がある場合、Screen Spec を先に更新したか
- [ ] 新規画面がある場合、Screen Spec に追加したか
- [ ] Feature Spec Section 8 を更新したか

---

### Step 7: Check M-_/API-_ Requirements

Identify all M-_, API-_, BR-\* that this Feature needs and classify:

| Case   | Situation                                   | Action                        |
| ------ | ------------------------------------------- | ----------------------------- |
| Case 1 | Existing M-_/API-_ is sufficient            | Add reference to Feature Spec |
| Case 2 | New M-_/API-_/BR-\* needed                  | Add to Domain Spec, continue  |
| Case 3 | Existing M-_/API-_/BR-\* needs modification | Trigger `/speckit.change`     |

**Case 2 handling**:

- Add new definitions to Domain Spec
- Update correspondence table
- Continue with Feature Spec creation

**Case 3 handling**:

- Stop Feature Spec creation
- Prompt: "既存の [M-xxx] の変更が必要です。`/speckit.change` を実行しますか？"
- After change merged, resume with `/speckit.issue`

#### Self-Check (Step 7)

- [ ] M-*/API-*/BR-* の必要性を特定したか
- [ ] Case 1/2/3 の分類を行ったか
- [ ] Case 2 の場合、Domain Spec に新規定義を追加したか
- [ ] Case 3 の場合、/speckit.change への誘導を行ったか

---

### Step 8: Update Domain Spec Feature Index

Open `.specify/specs/domain/spec.md` and add entry in Section 8 (Feature Index):

```markdown
| S-XXX-001 | [Feature Title] | `.specify/specs/s-xxx-001/` | Draft | [M-*, API-*] |
```

---

### Step 8.5: Update Cross-Reference Matrix

**Matrix が存在する場合、Feature を追加する。**

1. **Read `.specify/matrix/cross-reference.json`**

2. **Add Feature entry**:
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

3. **Update Permissions** (if new APIs added):
   ```json
   "permissions": {
     "API-XXX-LIST": ["role1", "role2"],
     "API-XXX-CREATE": ["admin"]
   }
   ```

4. **Regenerate Matrix view**:
   ```bash
   node .specify/scripts/generate-matrix-view.cjs
   ```

#### Self-Check (Steps 8-8.5)

- [ ] Domain Spec の Feature Index を更新したか
- [ ] Matrix が存在する場合、Feature エントリを追加したか
- [ ] generate-matrix-view.cjs を実行したか

---

### Step 9: Run Lint

```bash
node .specify/scripts/spec-lint.cjs
```

- Check Feature correctly references Domain M-_/API-_
- Check Feature Index entry exists

#### Self-Check (Step 9)

- [ ] spec-lint.cjs を実行したか
- [ ] エラーがあれば修正したか

---

### Step 10: Record Original Input & Reset

入力ファイル（`.specify/input/add-input.md`）から入力があった場合:

1. **Spec の末尾に「Original Input」セクションを追加**:

   ```markdown
   ---

   ## Original Input

   > 以下は `/speckit.add` 実行時に `.specify/input/add-input.md` から取得した元の入力です。

   [入力ファイルの内容をそのまま引用]
   ```

2. **入力ファイルをリセット**:
   ```bash
   node .specify/scripts/reset-input.cjs add
   ```

#### Self-Check (Step 10)

- [ ] 入力ファイルから入力があった場合、Original Input セクションを追加したか
- [ ] reset-input.cjs を実行したか

---

### Step 11: Summary & Clarify 推奨

#### 11.1 Spec Summary 表示

```
=== Feature Spec 作成完了 ===

Issue: #[N] [Feature] [タイトル]
Branch: feature/[N]-[slug]
Spec: .specify/specs/s-xxx-001/spec.md

概要:
- UC (User Stories): [N] 個
- FR (Functional Requirements): [N] 個
- SC (Success Criteria): [N] 個
- Domain Dependencies: [M-*, API-*, BR-* のリスト]
- Screen Dependencies: [SCR-* のリスト]
```

#### 11.2 曖昧点レポート

```
=== 曖昧点 ===

[NEEDS CLARIFICATION] マーク: [N] 箇所

- Section 4: UC-001 のエッジケースが未定義
- Section 5: FR-003 の具体的な処理が不明
- Section 7: パフォーマンス要件が未定義

推奨: `/speckit.clarify` で曖昧点を解消してください。
```

#### 11.3 次のステップ提示

```
次のステップ:

1. [推奨] `/speckit.clarify` - 曖昧点を解消
2. `/speckit.plan` - 曖昧点を残したまま計画作成（非推奨）

Clarify をスキップすると、実装中の手戻りリスクが高まります。
```

#### Self-Check (Step 11)

- [ ] Spec Summary を出力したか
- [ ] 曖昧点レポートを出力したか
- [ ] 次のステップ（/speckit.clarify 推奨）を提示したか
- [ ] 全ての Step が完了し、todo を全て `completed` にマークしたか

## Output

- Issue number and URL
- Branch name
- Spec path
- Spec summary
- 曖昧点レポート
- Next step recommendation: `/speckit.clarify`

## Human Checkpoints

1. 入力ファイルを埋める（または情報を提供）
2. Approve Case 3 redirect to `/speckit.change` (if needed)
3. Review Spec Summary
4. → `/speckit.clarify` で曖昧点を解消

## Example

> ⚠️ **WARNING: REFERENCE ONLY**
>
> The following examples are for understanding the workflow ONLY.
> **DO NOT copy or output these example values** (PDFエクスポート, 一覧画面からPDF出力, etc.).
> Always use ACTUAL user input from `.specify/input/add-input.md` or $ARGUMENTS.

### Example A: 入力ファイルから読み込み

```
Human: /speckit.add

AI: `.specify/input/add-input.md` を読み込みます...

    入力ファイルから情報を取得しました:
    - 機能名: PDFエクスポート
    - 課題: レポートをPDFで共有したい
    - 期待する動作: 一覧画面からPDF出力、A4サイズ、ヘッダー/フッター付き

    Issue を作成中...
    Issue #45 を作成しました: [Feature] PDFエクスポート機能
    Branch feature/45-pdf-export を作成しました

    Feature Spec を作成中...

    === Feature Spec 作成完了 ===

    Issue: #45 [Feature] PDFエクスポート機能
    Branch: feature/45-pdf-export
    Spec: .specify/specs/s-pdf-export-001/spec.md

    概要:
    - UC: 2個
    - FR: 5個
    - SC: 2個

    === 曖昧点 ===

    [NEEDS CLARIFICATION] マーク: 2 箇所

    - Section 5: FR-003 ページレイアウトの詳細が未定義
    - Section 7: 大量データ時のパフォーマンス要件が未定義

    推奨: `/speckit.clarify` で曖昧点を解消してください。

    入力ファイルをリセットしました。
```

### Example B: チャットから入力

```
Human: /speckit.add ユーザーがPDFエクスポートできる機能

AI: `.specify/input/add-input.md` を読み込みます...
    入力ファイルは空のため、$ARGUMENTS を確認します。

    追加で確認させてください:
    - **解決したい課題**: [未入力]
    - **期待する動作**: [未入力]

    上記を教えてください。
```
