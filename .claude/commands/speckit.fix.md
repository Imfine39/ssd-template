---
description: Fix a bug (Entry Point). Creates Issue, Branch, updates Spec.
handoffs:
  - label: Clarify Bug Fix
    agent: speckit.clarify
    prompt: Clarify the bug fix spec updates
    send: true
  - label: Continue to Plan
    agent: speckit.plan
    prompt: Create plan for the fix
    send: true
  - label: Skip to Implement
    agent: speckit.implement
    prompt: Implement the trivial fix directly
    send: true
---

## User Input

```text
$ARGUMENTS
```

## Purpose

**Entry point** for bug fixes when no Issue exists.
Creates Issue → Branch → Spec update. Clarify は別コマンドで実行。

**This command focuses on:** Spec 更新のみ。Clarify は `/speckit.clarify` で実行。

**Use this when:** You found a bug and no Issue exists.
**Use `/speckit.issue` instead when:** Bug Issues already exist.
**Next steps:** `/speckit.clarify` で曖昧点を解消 → `/speckit.plan` または `/speckit.implement`

## Quick Mode

緊急のバグ修正には `--quick` オプションで入力ファイルをスキップできます:

```
/speckit.fix --quick ログインできない
```

この場合、入力ファイル読み込みをスキップし、`$ARGUMENTS` のみで処理を開始します。

## Execution Protocol (MUST FOLLOW)

**Before starting:**

1. Use **TodoWrite** to create todos for all main Steps:
   - "Step 1: Quick Input Collection"
   - "Step 2: Analyze codebase"
   - "Step 3: Identify affected Spec"
   - "Step 4: Create GitHub Issue"
   - "Step 5: Create branch"
   - "Step 6: Update affected Spec"
   - "Step 7: Check if Domain/Screen changes needed"
   - "Step 7.5: Update Cross-Reference Matrix"
   - "Step 8: Run lint"
   - "Step 9: Record Original Input & Reset"
   - "Step 10: Summary & Next Steps"

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

---

## Critical Instructions

**IMPORTANT - MUST READ:**

1. **DO NOT use Example content** - The Example section below is for reference ONLY. NEVER output example data (「特殊文字パスワード」「ログインできない」etc.) as actual results.

2. **MUST use tools** - You MUST actually:
   - Use the **Read tool** to read `.specify/input/fix-input.md` (unless --quick mode)
   - Use the **Bash tool** to run gh commands and scripts
   - Use the **Write/Edit tool** to update spec files

3. **Real data only** - All output must come from:
   - User's input file (`.specify/input/fix-input.md`)
   - User's $ARGUMENTS
   - User's chat responses

---

## Steps

### Step 1: Quick Input Collection

**Goal:** 構造化された入力を収集し、AI が的確なバグ修正 Spec を生成できるようにする。

#### 1.1 Quick Mode 判定

`$ARGUMENTS` に `--quick` フラグが含まれるか確認:

- **`--quick` あり**: Step 1.5 へスキップ（入力ファイル読み込みをスキップ）
- **`--quick` なし**: Step 1.2 へ進む

#### 1.2 入力ファイルの読み込み

**【必須】Read ツールで `.specify/input/fix-input.md` を読み込むこと。**

```
Use the Read tool to read: .specify/input/fix-input.md
```

**DO NOT skip this step. DO NOT assume the file content.**

#### 1.3 入力方式の判定

以下の優先順位で入力を判定:

1. **入力ファイルにユーザー記入がある場合**
   - `.specify/input/fix-input.md` の各項目（バグ概要、再現手順など）に記入がある
   - → その内容を使用して Step 1.5 へ

2. **$ARGUMENTS に十分な情報がある場合**
   - バグの説明が含まれる
   - → その内容を使用して Step 1.5 へ

3. **どちらも不十分な場合**
   - → Step 1.4 で入力ファイルの記入を促す

**入力ファイルが「記入済み」かの判定:**

- 「何が起きているか」が空でない
- → 満たせば「記入済み」と判定

#### 1.4 入力ファイルの記入を促す

```
入力が不足しています。

以下のいずれかの方法で情報を提供してください:

Option A: 入力ファイルを編集
  1. `.specify/input/fix-input.md` をエディタで開く
  2. テンプレートを埋める
  3. `/speckit.fix` を再実行

Option B: チャットで情報を提供
  バグについて教えてください:
  - 何が起きているか
  - 期待する動作
  - 再現手順

Option C: 緊急対応
  `/speckit.fix --quick [バグの説明]` で詳細入力をスキップ
```

**入力ファイルの編集を待つか、チャットでの入力を受け付ける。**

#### 1.5 入力の解析

入力から以下を抽出:

| 項目             | 抽出先                          |
| ---------------- | ------------------------------- |
| 何が起きているか | Issue Body (Actual behavior)    |
| 期待する動作     | Issue Body (Expected behavior)  |
| 再現手順         | Issue Body (Steps to reproduce) |
| 影響範囲         | 影響 Spec の特定に使用          |
| 緊急度           | Issue ラベルの判断に使用        |
| 関連情報         | Issue Body, Spec Changelog      |

#### Self-Check (Step 1)

- [ ] --quick モードか通常モードかを判定したか
- [ ] 通常モードの場合、Read ツールで `.specify/input/fix-input.md` を読み込んだか
- [ ] Example の値（特殊文字パスワード等）を使用していないか
- [ ] 入力が不十分な場合、ユーザーに確認を求めたか

---

### Step 2: Analyze Codebase

- Use Serena to explore related code
- Identify the affected component and its spec
- Search existing specs for related UC/FR

#### Self-Check (Step 2)

- [ ] 関連コードを探索したか
- [ ] 影響を受けるコンポーネントを特定したか

---

### Step 3: Identify Affected Spec

- Ask user to confirm which spec is affected
- If no spec exists, warn: "該当するSpecがありません。新規機能の可能性があります"

#### Self-Check (Step 3)

- [ ] 影響を受ける Spec を特定したか
- [ ] ユーザーに確認を求めたか

---

### Step 4: Create GitHub Issue

```bash
gh issue create --title "[Bug] <description>" --body "..." --label bug
```

Body includes:

- Bug description (何が起きているか)
- Expected behavior (期待する動作, from spec)
- Actual behavior (実際の動作)
- Steps to reproduce (再現手順)
- Affected Spec ID/UC/FR

緊急度が「高」の場合:

```bash
gh label create urgent --description "Urgent fix needed" --color FF0000 --force
gh issue edit <num> --add-label urgent
```

#### Self-Check (Step 4)

- [ ] gh issue create を実行したか
- [ ] Issue 番号を取得したか
- [ ] 緊急度が高い場合、urgent ラベルを追加したか

---

### Step 5: Create Branch

```bash
node .specify/scripts/branch.cjs --type fix --slug <slug> --issue <num>
```

#### Self-Check (Step 5)

- [ ] branch.cjs でブランチを作成したか

---

### Step 6: Update Affected Spec

- Add Changelog entry: `| [DATE] | Bug Fix | [Description] | #[Issue] |`
- If fix requires FR changes, note in Implementation Notes
- Mark unclear items as `[NEEDS CLARIFICATION]`

#### Self-Check (Step 6)

- [ ] Spec の Changelog にエントリを追加したか
- [ ] 曖昧な項目に [NEEDS CLARIFICATION] マークを付けたか

---

### Step 7: Check if Domain/Screen Changes Needed

If bug fix reveals incorrect M-_/API-_/BR-_/SCR-_ definition:

**Domain 変更が必要な場合:**

```
このバグ修正には Domain Spec の変更が必要です:
- M-USER.password: バリデーションルールの変更が必要

`/speckit.change` を実行しますか？ [yes/no]
```

**Screen 変更が必要な場合:**

```
このバグ修正には Screen Spec の変更が必要です:
- SCR-003: フィルターパネルのレイアウト変更が必要

`/speckit.change` を実行しますか？ [yes/no]
```

- If yes: Trigger `/speckit.change`, then resume fix after merge
- If no: Continue with current spec (document limitation)

#### Self-Check (Step 7)

- [ ] Domain/Screen 変更が必要かどうか確認したか
- [ ] 変更が必要な場合、ユーザーに /speckit.change への誘導を行ったか

---

### Step 7.5: Update Cross-Reference Matrix (if screen/API changes)

**Screen や API の変更がある場合、Matrix を更新する。**

1. **Check if Matrix update is needed**:
   - Screen layout/navigation changes → Update `screens` in Matrix
   - New API required → Add to `apis` and `permissions`
   - Existing API changes → Update `permissions` if role access changes

2. **If updates needed, read `.specify/matrix/cross-reference.json`**

3. **Update affected entries**:
   ```json
   "screens": {
     "SCR-XXX": {
       "name": "...",
       "masters": ["M-XXX"],
       "apis": ["API-XXX-LIST", "API-NEW-ENDPOINT"]  // Updated
     }
   }
   ```

4. **Regenerate Matrix view**:
   ```bash
   node .specify/scripts/generate-matrix-view.cjs
   ```

#### Self-Check (Step 7.5)

- [ ] Matrix 更新が必要かどうか確認したか
- [ ] 必要な場合、Matrix を更新したか
- [ ] generate-matrix-view.cjs を実行したか

---

### Step 8: Run Lint

```bash
node .specify/scripts/spec-lint.cjs
```

#### Self-Check (Step 8)

- [ ] spec-lint.cjs を実行したか
- [ ] エラーがあれば修正したか

---

### Step 9: Record Original Input & Reset

入力ファイル（`.specify/input/fix-input.md`）から入力があった場合（`--quick` モードでない場合）:

1. **影響を受けた Spec の Changelog に入力内容を記録**
   - Already handled in Step 6

2. **入力ファイルをリセット**:
   ```bash
   node .specify/scripts/reset-input.cjs fix
   ```

**Note:** `--quick` モードの場合はリセット不要（入力ファイルを使用していないため）。

#### Self-Check (Step 9)

- [ ] 通常モードの場合、reset-input.cjs を実行したか

---

### Step 10: Summary & Next Steps

#### 10.1 Fix Summary 表示

```
=== Bug Fix Spec 更新完了 ===

Issue: #[N] [Bug] [説明]
Branch: fix/[N]-[slug]
Affected Spec: .specify/specs/s-xxx-001/spec.md

影響範囲:
- UC-001: [ユースケース名]
- FR-003: [要件名]

Changelog 追加:
| [DATE] | Bug Fix | [説明] | #[N] |
```

#### 10.2 曖昧点レポート

```
=== 曖昧点 ===

[NEEDS CLARIFICATION] マーク: [N] 箇所

- 再現条件の詳細が不明
- 影響する他の機能が未特定

推奨: `/speckit.clarify` で曖昧点を解消してください。
```

#### 10.3 次のステップ提示

```
次のステップ:

修正の規模に応じて選択:

[小さな修正の場合]
1. `/speckit.clarify` - 曖昧点を解消（推奨）
2. `/speckit.implement` - 直接実装（曖昧点がなければ）

[大きな修正の場合]
1. `/speckit.clarify` - 曖昧点を解消（推奨）
2. `/speckit.plan` - 実装計画を作成
```

#### Self-Check (Step 10)

- [ ] Fix Summary を出力したか
- [ ] 曖昧点レポートを出力したか
- [ ] 次のステップを提示したか
- [ ] 全ての Step が完了し、todo を全て `completed` にマークしたか

---

## Output

- Issue number and URL
- Branch name
- Affected spec path
- Changelog entry
- 曖昧点レポート
- Next step recommendation

## Human Checkpoints

1. 入力ファイルを埋める（または `--quick` で緊急対応）
2. Confirm affected spec
3. Approve Domain change redirect to `/speckit.change` (if needed)
4. Review Fix Summary
5. → `/speckit.clarify` で曖昧点を解消

---

## Example

> ⚠️ **WARNING: REFERENCE ONLY**
>
> The following examples are for understanding the workflow ONLY.
> **DO NOT copy or output these example values** (特殊文字パスワード, S-AUTH-001, etc.).
> Always use ACTUAL user input from `.specify/input/fix-input.md` or $ARGUMENTS.

### Example A: 入力ファイルから読み込み

```
Human: /speckit.fix

AI: `.specify/input/fix-input.md` を読み込みます...

    入力ファイルから情報を取得しました:
    - 何が起きているか: 特殊文字パスワードでログインエラー
    - 期待する動作: 特殊文字を含むパスワードでもログインできる
    - 再現手順: 1. @を含むパスワードで登録 2. ログイン試行 3. エラー
    - 影響範囲: 認証機能
    - 緊急度: 中

    コードベースを分析中...
    関連するSpecを検索中...
    S-AUTH-001 (認証機能) が該当しそうです。確認してください。

Human: それで合ってる

AI: Issue #50 を作成しました: [Bug] 特殊文字パスワードでログインエラー
    Branch fix/50-special-char-password を作成しました

    S-AUTH-001 の Changelog を更新しました。

    === Bug Fix Spec 更新完了 ===

    Issue: #50 [Bug] 特殊文字パスワードでログインエラー
    Branch: fix/50-special-char-password
    Affected Spec: .specify/specs/s-auth-001/spec.md

    === 曖昧点 ===

    [NEEDS CLARIFICATION] マーク: 1 箇所

    - どの特殊文字でエラーが発生するか不明

    推奨: `/speckit.clarify` で曖昧点を解消してください。

    入力ファイルをリセットしました。
```

### Example B: --quick モード（緊急対応）

```
Human: /speckit.fix --quick ログインできない

AI: Quick モードで開始します（入力ファイル読み込みスキップ）

    コードベースを分析中...
    関連するSpecを検索中...
    S-AUTH-001 (認証機能) が該当しそうです。確認してください。

Human: OK

AI: Issue #51 を作成しました: [Bug] ログインできない
    Branch fix/51-login-failure を作成しました

    S-AUTH-001 の Changelog を更新しました。

    === Bug Fix Spec 更新完了 ===

    Issue: #51 [Bug] ログインできない
    Branch: fix/51-login-failure
    Affected Spec: .specify/specs/s-auth-001/spec.md

    === 曖昧点 ===

    [NEEDS CLARIFICATION] マーク: 3 箇所

    - 再現手順が不明
    - エラーメッセージが不明
    - 発生環境が不明

    緊急対応のため曖昧点が多いです。
    小さな修正なら `/speckit.implement` で直接実装可能です。
```
