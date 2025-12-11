---
description: Add a new feature (Entry Point). Creates Issue, Branch, Spec with clarify loop.
handoffs:
  - label: Continue to Plan
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
Creates Issue → Branch → Spec, then loops clarify until all ambiguities are resolved.

**Use this when:** You want to add something new and no Issue exists.
**Use `/speckit.issue` instead when:** Issues already exist (from bootstrap or human creation).

## Steps

1) **Parse feature description**:
   - Extract from `$ARGUMENTS`
   - If empty, ask user to describe the feature

2) **Check Overview exists**:
   - Look for Overview spec in `.specify/specs/`
   - If not found: "Overview specが見つかりません。先に `/speckit.bootstrap` を実行してください"

3) **Create GitHub Issue**:
   ```bash
   gh issue create --title "[Feature] <title>" --body "..." --label feature
   ```

4) **Create branch**:
   ```bash
   node .specify/scripts/branch.js --type feature --slug <slug> --issue <num>
   ```

5) **Analyze codebase** (context collection):
   - Use Serena to explore existing code structure
   - Identify related components, patterns, dependencies
   - Use context7 for library documentation if needed

6) **Create spec** (uses `/speckit.spec` logic):
   - Scaffold: `node .specify/scripts/scaffold-spec.js --kind feature --id S-XXX-001 --title "..." --overview S-OVERVIEW-001`
   - Fill sections: Purpose, Actors, Domain Model (M-*, API-*), UC, FR, SC, Edge Cases, NFR
   - Reference analyzed code patterns and constraints
   - Mark unclear items as `[NEEDS CLARIFICATION]`

7) **Run lint**:
   ```bash
   node .specify/scripts/spec-lint.js
   ```

8) **Clarify loop**:
   - While `[NEEDS CLARIFICATION]` items exist:
     - Show items to human
     - Ask for clarification
     - Update spec
     - Re-run lint
   - Continue until all resolved

9) **Request human review**:
   - Show Issue URL, branch, spec path
   - Show spec summary (UC/FR/SC counts)
   - Wait for approval

## Output

- Issue number and URL
- Branch name
- Spec path
- Spec summary
- Next step: `/speckit.plan`

## Human Checkpoints

1. Answer clarification questions (in loop)
2. Review and approve final spec

## Example

```
人間: /speckit.add ユーザーがPDFエクスポートできる機能

AI: Issue #45 を作成しました: [Feature] PDFエクスポート機能
    Branch feature/45-pdf-export を作成しました
    Spec を作成中...

    [NEEDS CLARIFICATION]:
    1. 出力するPDFのページサイズは？ (A4/Letter/指定なし)
    2. ヘッダー/フッターは必要？

人間: 1. A4固定  2. 日付とページ番号をフッターに

AI: Spec を更新しました。
    [NEEDS CLARIFICATION] はすべて解決しました。

    Spec: .specify/specs/s-pdf-export-001/spec.md
    概要:
    - UC: 2個
    - FR: 5個
    - SC: 2個

    レビューしてください。

人間: OK

AI: /speckit.plan を実行します...
```
