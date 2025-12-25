# Add Workflow

Entry point for new features when no Issue exists. Creates Issue → Branch → Feature Spec.

## Prerequisites

**推奨フロー:**
1. Vision Spec が存在すること（必須）
2. Domain Spec + Screen Spec が存在すること（推奨）

**新規プロジェクトの場合:**
- Vision Spec がない → `vision ワークフロー` を先に実行
- Domain/Screen Spec がない → `design ワークフロー` を先に実行

**既存プロジェクトの場合:**
- Domain Spec の M-*/API-* を参照して Feature Spec を作成

**警告レベル:**
| 状態 | レベル | アクション |
|------|--------|-----------|
| Vision なし | エラー | vision ワークフロー へ誘導 |
| Domain なし | 警告 | design ワークフロー を推奨（続行可） |
| Screen なし | 情報 | design ワークフロー を推奨（続行可） |

## Quick Input

**Input file:** `.specify/input/add-input.md`

Required fields:
- 機能名 (non-empty)
- 期待する動作 (at least 1 item)

---

## Todo Template

**IMPORTANT:** ワークフロー開始時に、以下の Todo を TodoWrite tool で作成すること。

```
TodoWrite:
  todos:
    - content: "Step 1: 入力収集"
      status: "pending"
      activeForm: "Collecting input"
    - content: "Step 2: 前提条件確認"
      status: "pending"
      activeForm: "Checking prerequisites"
    - content: "Step 3: GitHub Issue 作成"
      status: "pending"
      activeForm: "Creating GitHub Issue"
    - content: "Step 4: ブランチ作成"
      status: "pending"
      activeForm: "Creating branch"
    - content: "Step 5: コードベース分析"
      status: "pending"
      activeForm: "Analyzing codebase"
    - content: "Step 6: Feature Spec 作成"
      status: "pending"
      activeForm: "Creating Feature Spec"
    - content: "Step 7: Multi-Review 実行"
      status: "pending"
      activeForm: "Executing Multi-Review"
    - content: "Step 8: CLARIFY GATE チェック"
      status: "pending"
      activeForm: "Checking CLARIFY GATE"
    - content: "Step 9: Lint 実行"
      status: "pending"
      activeForm: "Running Lint"
    - content: "Step 10: 入力保存・リセット"
      status: "pending"
      activeForm: "Preserving input"
    - content: "Step 11: サマリー・[HUMAN_CHECKPOINT]"
      status: "pending"
      activeForm: "Presenting summary"
```

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
   - Case 3: Need change → Recommend change ワークフロー

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
   - 曖昧点あり → Step 8 でブロック
   - Critical 未解決 → 問題をリストし対応を促す

### Step 8: CLARIFY GATE チェック（必須）

**★ このステップはスキップ禁止 ★**

Multi-Review 後、Grep tool で `[NEEDS CLARIFICATION]` マーカーをカウント：

```
Grep tool:
  pattern: "\[NEEDS CLARIFICATION\]"
  path: .specify/specs/features/{id}/spec.md
  output_mode: count
```

**判定ロジック:**

```
clarify_count = [NEEDS CLARIFICATION] マーカー数

if clarify_count > 0:
    ┌─────────────────────────────────────────────────────────────┐
    │ ★ CLARIFY GATE: 曖昧点が {clarify_count} 件あります         │
    │                                                             │
    │ Plan に進む前に clarify ワークフロー が必須です。            │
    │                                                             │
    │ 「clarify を実行して」と依頼してください。                   │
    └─────────────────────────────────────────────────────────────┘
    → clarify ワークフロー を実行（必須）
    → clarify 完了後、Multi-Review からやり直し

else:
    → Step 9 (Lint) へ進む
```

**重要:** clarify_count > 0 の場合、Plan への遷移は禁止。

### Step 9: Run Lint

```bash
node .claude/skills/spec-mesh/scripts/spec-lint.cjs
```

### Step 10: Preserve & Reset Input

If input file was used:
1. **Preserve input to spec directory:**
   ```bash
   node .claude/skills/spec-mesh/scripts/preserve-input.cjs add --feature {feature-dir}
   ```
   - Saves to: `.specify/specs/features/{feature-dir}/input.md`

2. **Reset input file:**
   ```bash
   node .claude/skills/spec-mesh/scripts/reset-input.cjs add
   ```

### Step 11: Summary & [HUMAN_CHECKPOINT]

1. **Display Summary:**
   ```
   === Feature Spec 作成完了 ===

   Feature: {機能名}
   Issue: #{issue_num}
   Branch: feature/{issue_num}-{slug}
   Spec: .specify/specs/features/{id}/spec.md

   === CLARIFY GATE ===
   [NEEDS CLARIFICATION]: {N} 箇所
   Status: {PASSED | BLOCKED}

   {if BLOCKED}
   ★ clarify ワークフロー を実行してください。
   {/if}
   ```

2. **CLARIFY GATE が PASSED の場合のみ:**
   ```
   === [HUMAN_CHECKPOINT] ===
   確認事項:
   - [ ] Feature Spec の User Stories が期待する動作を反映しているか
   - [ ] Functional Requirements が適切に定義されているか
   - [ ] M-*/API-* の参照/追加が正しいか

   承認後、plan ワークフロー へ進んでください。
   ```

---

## Self-Check

- [ ] **TodoWrite で全ステップを登録したか**
- [ ] Read tool で入力ファイルを読み込んだか
- [ ] gh issue create を実行したか
- [ ] branch.cjs でブランチを作成したか
- [ ] scaffold-spec.cjs で spec を作成したか
- [ ] Screen Spec を先に更新したか（Spec-First）
- [ ] M-*/API-* の Case 判定を行ったか
- [ ] **Multi-Review を実行したか（3観点並列）**
- [ ] **CLARIFY GATE をチェックしたか**
- [ ] spec-lint.cjs を実行したか
- [ ] **TodoWrite で全ステップを completed にしたか**

---

## Next Steps

| Condition | Command | Description |
|-----------|---------|-------------|
| CLARIFY GATE: BLOCKED | clarify ワークフロー | **必須** - 曖昧点を解消 |
| CLARIFY GATE: PASSED + 人間承認 | plan ワークフロー | 実装計画作成 |
