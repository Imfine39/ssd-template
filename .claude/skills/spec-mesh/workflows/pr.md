# PR Workflow

Verify integrity and create Pull Request.

## Prerequisites

- Implementation complete
- Tests passing
- On Issue-linked branch

---

## Todo Template

**IMPORTANT:** ワークフロー開始時に、以下の Todo を TodoWrite tool で作成すること。

```
TodoWrite:
  todos:
    - content: "Step 1: コンテキスト確認"
      status: "pending"
      activeForm: "Verifying context"
    - content: "Step 2: 整合性チェック実行"
      status: "pending"
      activeForm: "Running integrity checks"
    - content: "Step 3: ステージング・コミット"
      status: "pending"
      activeForm: "Staging and committing"
    - content: "Step 4: Push・PR 作成"
      status: "pending"
      activeForm: "Pushing and creating PR"
    - content: "Step 5: サマリー提示"
      status: "pending"
      activeForm: "Presenting summary"
    - content: "Step 6: 状態更新"
      status: "pending"
      activeForm: "Updating state"
```

---

## Steps

### Step 1: Verify Context

1. **Check branch:**
   ```bash
   git branch --show-current
   git status
   ```

2. **Get Issue number** from branch name

3. **Read Spec** for ID references

### Step 2: Run Integrity Checks

**2.1 Run spec-lint:**
```bash
node .claude/skills/spec-mesh/scripts/spec-lint.cjs
```

**2.2 Validate matrix:**
```bash
node .claude/skills/spec-mesh/scripts/validate-matrix.cjs
```

**2.3 Check Screen Status:**
- If any SCR-* are `Planned`, warn:
  ```
  WARNING: 以下の Screen は Planned 状態です。
  PR マージ後に Implemented に更新してください:
  - SCR-001: Dashboard
  - SCR-002: Settings
  ```

**2.4 Run tests:**
```bash
npm test
```

**2.5 Run lint:**
```bash
npm run lint
```

### Step 3: Stage and Commit

```bash
git add .
git status
```

Show changes and confirm with user.

```bash
git commit -m "{type}: {description}" -m "Fixes #{issue_num}" -m "Implements {Spec IDs}" -m "Generated with Claude Code"
```

### Step 4: Push and Create PR

**[HUMAN_CHECKPOINT]** (Irreversible Action)
- [ ] 変更内容が意図したものか
- [ ] 全てのチェックが pass しているか
- [ ] コミットメッセージが適切か

承認後、push と PR 作成を実行します。

```bash
git push -u origin {branch_name}
```

```bash
gh pr create --title "{PR title}" --body "## Summary
- {変更点1}
- {変更点2}

## Related
- Fixes #{issue_num}
- Implements {Spec IDs}

## Test Plan
- [ ] {テスト項目1}
- [ ] {テスト項目2}

## Screen Status Updates (post-merge)
- [ ] {SCR-* to update, if any}

🤖 Generated with Claude Code"
```

### Step 5: Summary

Display:
```
=== PR 作成完了 ===

PR: {PR URL}
Issue: #{issue_num}
Branch: {branch_name}

Integrity Checks:
- spec-lint: ✅
- validate-matrix: ✅
- tests: ✅
- lint: ✅

=== Post-Merge Checklist ===
- [ ] Screen Spec の Status 更新 (Planned → Implemented)
- [ ] Feature Index の Status 更新
- [ ] ブランチ削除

レビューをお待ちください。
```

### Step 6: Update State

```bash
node .claude/skills/spec-mesh/scripts/state.cjs branch --set-step pr
```

---

## Self-Check

- [ ] **TodoWrite で全ステップを登録したか**
- [ ] spec-lint を実行したか
- [ ] validate-matrix を実行したか
- [ ] テストが全て pass したか
- [ ] lint が全て pass したか
- [ ] commit メッセージに Issue 番号と Spec ID を含めたか
- [ ] PR を作成したか
- [ ] Post-merge checklist を提示したか
- [ ] **TodoWrite で全ステップを completed にしたか**

---

## Next Steps

PR 作成完了後、レビューを待ってください。

| Condition | Workflow | Description |
|-----------|----------|-------------|
| PR マージ後 | (Post-Merge Actions) | Screen Spec / Feature Index の Status 更新 |
| 追加修正が必要な場合 | implement | 実装を修正 |

---

## Post-Merge Actions (MANDATORY)

After PR is merged, run the post-merge script:

```bash
node .claude/skills/spec-mesh/scripts/post-merge.cjs --feature {FEATURE_ID} --delete-branch
```

**Example:**
```bash
node .claude/skills/spec-mesh/scripts/post-merge.cjs --feature S-AUTH-001 --delete-branch
```

### What it does:

1. **Update Screen Spec status**: `Planned` → `Implemented` for all SCR-* referenced
2. **Update Feature Index status**: `Status` -> `Implemented`
3. **Update Feature Spec status**: `Status` -> `Implemented`
4. **Clean up branch state**: Remove from `branch-state.cjson`
5. **Delete git branch** (if `--delete-branch` specified)

### Manual fallback:

If the script fails, perform these updates manually:

1. Open `.specify/specs/overview/screen/spec.md` and update SCR-* status
2. Open `.specify/specs/overview/domain/spec.md` and update Feature Index
3. Delete branch: `git branch -d {branch_name}`

**Note:** Failing to run post-merge creates inconsistency between specs and implementation.
