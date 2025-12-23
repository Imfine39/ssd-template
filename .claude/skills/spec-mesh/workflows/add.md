# Add Workflow

Entry point for new features when no Issue exists. Creates Issue → Branch → Feature Spec.

## Prerequisites

- Domain Spec should exist (warning if not)
- Screen Spec recommended

## Quick Input

**Input file:** `.specify/input/add-input.md`

Required fields:
- 機能名 (non-empty)
- 期待する動作 (at least 1 item)

---

## Steps

### Step 1: Input Collection

1. **Read input file:**
   ```
   Read tool: .specify/input/add-input.md
   ```

2. **Determine input source:**
   - If input file has content → Use it
   - If ARGUMENTS has content → Use it
   - If both empty → Prompt user

3. **Extract:**
   | Input | Target |
   |-------|--------|
   | 機能名 | Feature title, Issue title |
   | 解決したい課題 | Section 1 (Purpose) |
   | 誰が使うか | Section 3 (Actors) |
   | 期待する動作 | Section 4-5 (User Stories, FR) |
   | 関連する既存機能 | Section 2 (Domain Dependencies) |

### Step 2: Prerequisites Check

```bash
node .claude/skills/spec-mesh/scripts/state.cjs query --repo
```

- Check Domain status → Warning if not clarified
- Verify Domain has M-*/API-* definitions

### Step 3: Create GitHub Issue

```bash
gh issue create --title "[Feature] {機能名}" --body "..."
```

### Step 4: Create Branch

```bash
node .claude/skills/spec-mesh/scripts/branch.cjs --type feature --slug {slug} --issue {issue_num}
```

### Step 5: Analyze Codebase

- Identify existing patterns
- Find related components
- Note reusable code

### Step 6: Create Feature Spec

1. **Run scaffold:**
   ```bash
   node .claude/skills/spec-mesh/scripts/scaffold-spec.cjs --kind feature --id S-XXX-001 --title "{機能名}"
   ```

2. **Spec-First: Update Screen Spec** (if UI changes needed)
   - Add to Screen Index with status `Planned`
   - Or add to Modification Log

3. **Fill spec sections from input**

4. **Check M-*/API-* requirements (Case 1/2/3):**
   - Case 1: All exist → Reference only
   - Case 2: Need new → Add to Domain
   - Case 3: Need change → Recommend `/spec-mesh change`

5. **Update Domain Spec Feature Index**

6. **Update Cross-Reference Matrix**

### Step 7: Multi-Review (3観点並列レビュー)

Feature Spec の品質を担保するため Multi-Review を実行：

1. **Read review workflow:**
   ```
   Read tool: .claude/skills/spec-mesh/workflows/review.md
   ```

2. **Execute Multi-Review:**
   - 3 つの reviewer agent を並列で起動
   - フィードバック統合
   - AI 修正可能な問題を修正

3. **Handle results:**
   - すべてパス → Step 8 へ
   - 曖昧点あり → `/spec-mesh clarify` を推奨
   - Critical 未解決 → 問題をリストし対応を促す

### Step 8: Run Lint

```bash
node .claude/skills/spec-mesh/scripts/spec-lint.cjs
```

### Step 9: Preserve & Reset Input

If input file was used:
1. **Preserve input to spec directory:**
   ```bash
   node .claude/skills/spec-mesh/scripts/preserve-input.cjs add --project {project} --feature {feature-dir}
   ```
   - Saves to: `.specify/specs/{project}/features/{feature-dir}/input.md`

2. **Reset input file:**
   ```bash
   node .claude/skills/spec-mesh/scripts/reset-input.cjs add
   ```

### Step 10: Summary

Display:
```
=== Feature Spec 作成完了 ===

Feature: {機能名}
Issue: #{issue_num}
Branch: feature/{issue_num}-{slug}
Spec: .specify/specs/{project}/features/{id}/spec.md

=== 曖昧点 ===
[NEEDS CLARIFICATION]: [N] 箇所
- [List of ambiguous items]

推奨: `/spec-mesh clarify` で曖昧点を解消してください。
```

---

## Self-Check

- [ ] Read tool で入力ファイルを読み込んだか
- [ ] gh issue create を実行したか
- [ ] branch.cjs でブランチを作成したか
- [ ] scaffold-spec.cjs で spec を作成したか
- [ ] Screen Spec を先に更新したか（Spec-First）
- [ ] M-*/API-* の Case 判定を行ったか
- [ ] **Multi-Review を実行したか（3観点並列）**
- [ ] spec-lint.cjs を実行したか

---

## Next Steps

**[HUMAN_CHECKPOINT]** Feature Spec の内容を確認してから次のステップに進んでください。

| Action | Command | Description |
|--------|---------|-------------|
| Clarify | `/spec-mesh clarify` | 曖昧点解消 |
| Plan | `/spec-mesh plan` | 実装計画作成 |
