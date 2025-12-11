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
Lists Issues → User selects → Creates Branch → Creates/enhances Spec with clarify loop.

**Use this when:** Issues already exist and you want to start working on one.
**Use `/speckit.add` or `/speckit.fix` instead when:** No Issue exists yet.

## Steps

1) **Fetch open issues**:
   ```bash
   gh issue list --state open --limit 30 --json number,title,labels,body
   ```

2) **Categorize and display**:
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

   どのIssueを選択しますか？
   ```

3) **Validate selection**:
   - If `in-progress`: Warn "既に作業中です。続行しますか？"
   - If closed: Warn "このIssueは閉じられています"

4) **Determine workflow type**:
   - Labels `bug`, `fix`, `defect` → Bug fix workflow
   - Labels `feature`, `enhancement` → Feature workflow
   - If unclear, analyze title/body or ask human

5) **Update Issue label**:
   ```bash
   gh issue edit <num> --remove-label backlog --add-label in-progress
   ```

6) **Create branch**:
   - Feature: `node .specify/scripts/branch.js --type feature --slug <slug> --issue <num>`
   - Bug fix: `node .specify/scripts/branch.js --type fix --slug <slug> --issue <num>`

7) **Analyze codebase** (context collection):
   - Use Serena to explore existing code structure
   - Identify related components, patterns, dependencies
   - Use context7 for library documentation if needed

8) **Create or enhance spec**:
   - Check if spec scaffold exists (from bootstrap)
   - If exists: Read and enhance with details
   - If not: Scaffold new spec
   - For Feature: Fill UC/FR/SC sections
   - For Bug fix: Update affected spec's Changelog
   - Mark unclear items as `[NEEDS CLARIFICATION]`

9) **Run lint**:
   ```bash
   node .specify/scripts/spec-lint.js
   ```

10) **Clarify loop**:
    - While `[NEEDS CLARIFICATION]` items exist:
      - Show items to human
      - Ask for clarification
      - Update spec
      - Re-run lint
    - Continue until all resolved

11) **Request human review**:
    - Show spec summary (UC/FR/SC counts)
    - Wait for approval

## Output

- Selected Issue number and type
- Branch name
- Spec path
- Spec summary
- Next step: `/speckit.plan`

## Human Checkpoints

1. Select Issue to work on
2. Answer clarification questions (in loop)
3. Review and approve spec

## Example

```
人間: /speckit.issue

AI: === Open Issues ===

    Backlog Features:
      #2 [backlog] S-INVENTORY-001: 在庫一覧・検索
      #3 [backlog] S-RECEIVING-001: 入荷処理

    Backlog Bugs:
      (なし)

    In Progress:
      #5 [in-progress] S-STOCKTAKE-001: 棚卸し

    どのIssueを選択しますか？

人間: 2

AI: Issue #2 "S-INVENTORY-001: 在庫一覧・検索" を選択しました
    種類: Feature

    ラベルを backlog → in-progress に更新しました
    Branch feature/2-inventory を作成しました

    コードベースを分析中...
    既存のSpec scaffoldを拡張します...

    [NEEDS CLARIFICATION]:
    1. 検索対象のフィールドは？ (名前/SKU/カテゴリ等)
    2. ページネーションは必要？

人間: 1. 名前とSKU  2. 20件ずつ

AI: Spec を更新しました。
    [NEEDS CLARIFICATION] はすべて解決しました。

    Spec: .specify/specs/s-inventory-001/spec.md
    概要:
    - UC: 3個
    - FR: 5個
    - SC: 2個

    レビューしてください。

人間: OK

AI: /speckit.plan を実行します...
```
