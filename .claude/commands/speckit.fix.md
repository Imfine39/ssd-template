---
description: Fix a bug (Entry Point). Creates Issue, Branch, updates Spec with clarify loop.
handoffs:
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
Creates Issue → Branch → Spec update, then loops clarify until all ambiguities are resolved.

**Use this when:** You found a bug and no Issue exists.
**Use `/speckit.issue` instead when:** Bug Issues already exist.

## Steps

1) **Parse bug description**:
   - Extract from `$ARGUMENTS`
   - If empty, ask user to describe the bug

2) **Analyze codebase** (context collection):
   - Use Serena to explore related code
   - Identify the affected component and its spec
   - Search existing specs for related UC/FR

3) **Identify affected spec**:
   - Ask user to confirm which spec is affected
   - If no spec exists, warn: "該当するSpecがありません。新規機能の可能性があります"

4) **Create GitHub Issue**:
   ```bash
   gh issue create --title "[Bug] <description>" --body "..." --label bug
   ```
   - Body includes: Bug description, Expected behavior (from spec), Actual behavior, Affected Spec ID/UC/FR

5) **Create branch**:
   ```bash
   node .specify/scripts/branch.js --type fix --slug <slug> --issue <num>
   ```

6) **Update affected spec**:
   - Add Changelog entry: `| [DATE] | Bug Fix | [Description] | #[Issue] |`
   - If fix requires FR changes, note in Implementation Notes
   - Mark unclear items as `[NEEDS CLARIFICATION]`

7) **Check if Domain changes needed**:
   - If bug fix reveals incorrect M-*/API-*/BR-* definition:
     ```
     このバグ修正には Domain Spec の変更が必要です:
     - M-USER.password: バリデーションルールの変更が必要

     `/speckit.change` を実行しますか？ [yes/no]
     ```
   - If yes: Trigger `/speckit.change`, then resume fix after merge
   - If no: Continue with current spec (document limitation)

8) **Run lint**:
   ```bash
   node .specify/scripts/spec-lint.js
   ```

9) **Clarify loop** (uses `/speckit.clarify` logic):
   - While `[NEEDS CLARIFICATION]` items exist:
     - Show **1 question at a time** with recommended option
     - Wait for answer
     - Update spec **immediately**
     - Re-run lint
   - Continue until all resolved

10) **Request human review**:
    - Show Issue URL, branch, affected spec
    - Show impact scope (UC/FR affected)
    - For trivial fixes: Offer to skip to `/speckit.implement`
    - For larger fixes: Suggest `/speckit.plan`

## Output

- Issue number and URL
- Branch name
- Affected spec path
- Changelog entry
- Next step recommendation

## Human Checkpoints

1. Confirm affected spec
2. Approve Domain change redirect to `/speckit.change` (if needed)
3. Answer clarification questions (in loop)
4. Choose plan vs direct implement

## Example

```
人間: /speckit.fix ログイン画面で特殊文字パスワードがエラーになる

AI: コードベースを分析中...
    関連するSpecを検索中...
    S-AUTH-001 (認証機能) が該当しそうです。確認してください。

人間: それで合ってる

AI: Issue #50 を作成しました: [Bug] 特殊文字パスワードでログインエラー
    Branch fix/50-special-char-password を作成しました

    S-AUTH-001 の Changelog を更新しました:
    | 2025-01-15 | Bug Fix | 特殊文字パスワード対応 | #50 |

    [NEEDS CLARIFICATION]:
    1. どの特殊文字でエラーが発生しますか？

人間: @, #, $ など記号全般

AI: Spec を更新しました。
    [NEEDS CLARIFICATION] はすべて解決しました。

    影響範囲:
    - UC-001: ログイン処理
    - FR-003: パスワードバリデーション

    小さな修正です。
    - 直接実装: /speckit.implement
    - 計画作成: /speckit.plan

人間: implement で

AI: /speckit.implement を実行します...
```
