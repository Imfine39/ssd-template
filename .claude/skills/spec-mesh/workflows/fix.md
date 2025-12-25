# Fix Workflow

Entry point for bug fixes. Creates Issue → Branch → Fix Spec (調査報告書).

## Prerequisites

- None (bugs can happen anytime)

## Quick Mode

For urgent fixes, use `--quick` flag:
```
「ログインできないバグを直して」
```

## Quick Input

**Input file:** `.specify/input/fix-input.md`

Required fields:
- 何が起きているか (non-empty)
- 期待する動作 (non-empty)

---

## Steps

### Step 1: Input Collection

1. **Check Quick Mode:**
   - If ARGUMENTS contains `--quick` → Skip to Step 1.3
   - Otherwise → Read input file

2. **Read input file:**
   ```
   Read tool: .specify/input/fix-input.md
   ```

3. **Extract:**
   | Input | Target |
   |-------|--------|
   | 何が起きているか | Issue Body, Fix Spec Section 1 |
   | 期待する動作 | Issue Body, Fix Spec Section 1 |
   | 再現手順 | Issue Body, Fix Spec Section 1 |
   | 影響範囲 | Fix Spec Section 2 |
   | 緊急度 | Issue label |

### Step 2: Create GitHub Issue

```bash
gh issue create --title "[Bug] {概要}" --body "..." --label "bug"
```

### Step 3: Create Branch

```bash
node .claude/skills/spec-mesh/scripts/branch.cjs --type fix --slug {slug} --issue {issue_num}
```

### Step 4: Investigate Root Cause

Use codebase exploration to:
- Identify affected files
- Trace error path
- Find root cause
- Assess impact scope

Document findings in Fix Spec.

### Step 5: Create Fix Spec

1. **Run scaffold:**
   ```bash
   node .claude/skills/spec-mesh/scripts/scaffold-spec.cjs --kind fix --id F-XXX-001 --title "{バグ概要}"
   ```

2. **Fill sections:**
   - Section 1: Problem Description (症状、再現手順、期待動作)
   - Section 2: Root Cause Analysis (原因、影響範囲)
   - Section 3: Proposed Fix (修正方針、影響するファイル)
   - Section 4: Verification Plan (テスト方法)

3. **Check Screen impact** (if UI affected):
   - Add to Screen Modification Log with status `Planned`

### Step 6: Multi-Review (3観点並列レビュー)

Fix Spec の品質を担保するため Multi-Review を実行：

1. **Read review workflow:**
   ```
   Read tool: .claude/skills/spec-mesh/workflows/review.md
   ```

2. **Execute Multi-Review:**
   - 3 つの reviewer agent を並列で起動
   - フィードバック統合
   - AI 修正可能な問題を修正

3. **Handle results:**
   - すべてパス → Step 7 へ
   - Critical 未解決 → 問題をリストし対応を促す

### Step 7: Run Lint

```bash
node .claude/skills/spec-mesh/scripts/spec-lint.cjs
```

### Step 8: Preserve & Reset Input

If input file was used:
1. **Preserve input to spec directory:**
   ```bash
   node .claude/skills/spec-mesh/scripts/preserve-input.cjs fix --fix {fix-dir}
   ```
   - Saves to: `.specify/specs/fixes/{fix-dir}/input.md`

2. **Reset input file:**
   ```bash
   node .claude/skills/spec-mesh/scripts/reset-input.cjs fix
   ```

### Step 9: Summary

Display:
```
=== Fix Spec 作成完了 ===

Bug: {概要}
Issue: #{issue_num}
Branch: fix/{issue_num}-{slug}
Spec: .specify/specs/fixes/{id}/spec.md

Root Cause: {原因の要約}
Impact: {影響範囲}

=== 曖昧点 ===
[NEEDS CLARIFICATION]: {N} 箇所
- [List of ambiguous items]

=== 次のステップ ===
緊急度に応じて選択:
- Trivial: implement ワークフロー で直接修正
- Standard: plan ワークフロー → tasks ワークフロー → implement ワークフロー
```

---

## Self-Check

- [ ] Read tool で入力ファイルを読み込んだか（--quick 以外）
- [ ] gh issue create を実行したか
- [ ] branch.cjs でブランチを作成したか
- [ ] 原因調査を実施したか
- [ ] Fix Spec に Root Cause を記載したか
- [ ] **Multi-Review を実行したか（3観点並列）**
- [ ] spec-lint.cjs を実行したか

---

## Next Steps

**[HUMAN_CHECKPOINT]**
- [ ] Root Cause Analysis が正確か
- [ ] Proposed Fix が問題を解決するか
- [ ] 影響範囲が適切に評価されているか
- [ ] Verification Plan が十分か

承認後、次のステップへ進んでください。

| Condition | Command | Description |
|-----------|---------|-------------|
| 詳細確認が必要な場合 | clarify ワークフロー | 詳細確認 |
| 標準フローで修正する場合 | plan ワークフロー | 修正計画作成 |
| Trivial fix の場合 | implement ワークフロー | 直接修正 |
