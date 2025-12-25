# Issue Workflow

Entry point for existing Issues. Lists Issues → User selects → Creates Branch → Feature Spec.

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

## Use Cases

- Issues from design ワークフロー
- Human-created Issues
- Foundation Issue (S-FOUNDATION-001)

---

## Todo Template

**IMPORTANT:** ワークフロー開始時に、以下の Todo を TodoWrite tool で作成すること。

```
TodoWrite:
  todos:
    - content: "Step 1: 前提条件確認"
      status: "pending"
      activeForm: "Checking prerequisites"
    - content: "Step 2: Issue 一覧取得・選択"
      status: "pending"
      activeForm: "Fetching and selecting Issue"
    - content: "Step 3: Issue 詳細確認"
      status: "pending"
      activeForm: "Validating selection"
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
    - content: "Step 8: Lint 実行"
      status: "pending"
      activeForm: "Running Lint"
    - content: "Step 9: サマリー・状態更新"
      status: "pending"
      activeForm: "Presenting summary"
```

---

## Steps

### Step 1: Check Prerequisites

1. **Check repo state:**
   ```bash
   node .claude/skills/spec-mesh/scripts/state.cjs query --repo
   ```
   - If Domain status not "clarified" → Warning

2. **Verify Domain Spec:**
   - Check `.specify/specs/overview/domain/spec.md`
   - Must have M-* and API-* definitions
   - If scaffold only → Recommend design ワークフロー

3. **Check Screen Spec (optional):**
   - If not found → Warning (can continue)

### Step 2: Fetch and Display Issues

```bash
gh issue list --state open --json number,title,labels --limit 20
```

Display:
```
=== Open Issues ===

#1  [Foundation] S-FOUNDATION-001: 基盤実装
#2  [Feature] S-AUTH-001: ユーザー認証
#3  [Feature] S-DASH-001: ダッシュボード
#4  [Bug] ログイン時にエラー

番号を選択してください:
```

### Step 3: Validate Selection

1. Parse user input for issue number
2. Fetch issue details:
   ```bash
   gh issue view {issue_num} --json number,title,body,labels
   ```
3. Confirm with user

### Step 4: Setup Branch

```bash
node .claude/skills/spec-mesh/scripts/branch.cjs --type feature --slug {slug} --issue {issue_num}
```

Or for Foundation:
```bash
node .claude/skills/spec-mesh/scripts/branch.cjs --type feature --slug foundation --issue {issue_num}
```

### Step 5: Analyze Codebase

- Read Domain Spec for M-*/API-* context
- Read Screen Spec for SCR-* context
- Identify relevant existing code

### Step 6: Create Feature Spec

**6.1 Run scaffold:**
```bash
node .claude/skills/spec-mesh/scripts/scaffold-spec.cjs --kind feature --id {spec_id} --title "{Issue title}"
```

**6.2 Spec-First: Update Screen Spec** (if UI changes)
- Add new screens to Screen Index with `Planned`
- Add modifications to Modification Log

**6.3 Fill spec from Issue and Domain context**

**6.4 Check M-*/API-* requirements:**
- Case 1: All exist → Reference only
- Case 2: Need new → Add to Domain
- Case 3: Need change → Recommend change ワークフロー

**6.5 Update Domain Feature Index**

**6.6 Update Cross-Reference Matrix**

### Step 7: Multi-Review (3観点並列レビュー)

Spec 作成後、品質を担保するため Multi-Review を実行：

1. **Read review workflow:**
   ```
   Read tool: .claude/skills/spec-mesh/workflows/review.md
   ```

2. **Execute Multi-Review:**
   - 3 つの reviewer agent を並列で起動
   - フィードバック統合
   - AI 修正可能な問題を修正
   - Lint 実行

3. **Handle results:**
   - すべてパス → Step 8 (Summary) へ
   - 曖昧点あり → clarify ワークフロー を推奨
   - Critical 未解決 → 問題をリストし対応を促す

### Step 8: Run Lint

```bash
node .claude/skills/spec-mesh/scripts/spec-lint.cjs
```

### Step 9: Summary

Display:
```
=== Feature Spec 作成完了 ===

Issue: #{issue_num} - {title}
Branch: feature/{issue_num}-{slug}
Spec: .specify/specs/features/{id}/spec.md

Domain Dependencies:
- Masters: {M-* list}
- APIs: {API-* list}

Screen References:
- {SCR-* list}

=== 曖昧点 ===
[NEEDS CLARIFICATION]: {N} 箇所

推奨: clarify ワークフロー で曖昧点を解消してください。
```

### Step 10: Update State

```bash
node .claude/skills/spec-mesh/scripts/state.cjs branch --set-step spec --set-feature {spec_id}
```

---

## Self-Check

- [ ] **TodoWrite で全ステップを登録したか**
- [ ] gh issue list で Issues を取得したか
- [ ] ユーザーに Issue 選択を求めたか
- [ ] branch.cjs でブランチを作成したか
- [ ] Domain Spec を読み込んで M-*/API-* を確認したか
- [ ] Screen Spec を更新したか（Spec-First）
- [ ] Feature Spec を作成したか
- [ ] **Multi-Review を実行したか（3観点並列）**
- [ ] spec-lint.cjs を実行したか
- [ ] **TodoWrite で全ステップを completed にしたか**

---

## Next Steps

**[HUMAN_CHECKPOINT]** Feature Spec の内容を確認してから次のステップに進んでください。

| Condition | Command | Description |
|-----------|---------|-------------|
| 曖昧点がある場合 | clarify ワークフロー | 曖昧点解消 |
| 曖昧点が解消済み | plan ワークフロー | 実装計画作成 |
