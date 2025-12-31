# Change Workflow

Change Vision, Domain, or Screen Spec (existing M-*/API-*/BR-*/VR-*/SCR-*).

## Purpose

Handle changes to shared specifications that may impact multiple Features.

## When to Use

- Case 3: Feature requires changes to existing M-*/API-*
- Design evolution: Screen layout needs modification
- Business rule change: BR-*/VR-* update

---

## Todo Template

**IMPORTANT:** ワークフロー開始時に、以下の Todo を TodoWrite tool で作成すること。

```
TodoWrite:
  todos:
    - content: "Step 1: 変更対象特定"
      status: "pending"
      activeForm: "Identifying change target"
    - content: "Step 2: 現行 Spec 読み込み"
      status: "pending"
      activeForm: "Loading current Spec"
    - content: "Step 3: 変更スコープ特定"
      status: "pending"
      activeForm: "Identifying change scope"
    - content: "Step 4: 影響分析・[HUMAN_CHECKPOINT]"
      status: "pending"
      activeForm: "Analyzing impact"
    - content: "Step 5: Change Spec 作成"
      status: "pending"
      activeForm: "Creating Change Spec"
    - content: "Step 6: 変更適用"
      status: "pending"
      activeForm: "Applying changes"
    - content: "Step 7: Multi-Review 実行"
      status: "pending"
      activeForm: "Executing Multi-Review"
    - content: "Step 8: CLARIFY GATE チェック"
      status: "pending"
      activeForm: "Checking CLARIFY GATE"
    - content: "Step 9: Lint 実行"
      status: "pending"
      activeForm: "Running Lint"
    - content: "Step 10: サマリー・[HUMAN_CHECKPOINT]"
      status: "pending"
      activeForm: "Presenting summary"
```

---

## Steps

### Step 1: Identify Change Target

```
変更対象を選択してください:

1. Vision Spec (Project purpose, journeys)
2. Domain Spec (M-*/API-*/BR-*/VR-*)
3. Screen Spec (SCR-*/UI design)

選択 (1-3):
```

### Step 2: Load Current Spec

```
Read tool: .specify/specs/overview/{spec_type}/spec.md
```

### Step 3: Identify Change Scope

**For Domain changes:**
- Which M-*/API-* to modify?
- Which BR-*/VR-* affected?
- Impact on existing Features?

**For Screen changes:**
- Which SCR-* to modify?
- Impact on existing Features?

### Step 4: Impact Analysis (Case 3 Decision)

> **共通コンポーネント参照:** [shared/impact-analysis.md](shared/impact-analysis.md) を **FULL モード** で実行

#### 4.1 FULL モード影響分析

1. **変更対象の特定** - 変更する M-*/API-*/SCR-* を明確化
2. **上流影響分析** - この変更の影響を受ける Feature Spec を検索
3. **下流影響分析** - 変更対象が依存している要素を確認
4. **Matrix 整合性チェック** - 参照関係を確認

#### 4.2 影響度判定

| 影響度 | 条件 | 対応 |
|--------|------|------|
| **CRITICAL** | 3つ以上の Feature が影響 | 全 Feature オーナーへの事前通知必須 |
| **HIGH** | 1-2つの Feature が影響 | 影響 Spec の同時更新必須 |
| **MEDIUM** | Matrix のみ影響 | Matrix 更新で対応 |
| **LOW** | 参照なし | そのまま続行 |

#### 4.3 影響レポート出力

```
=== Impact Analysis (FULL) ===

変更対象: M-USER (属性追加: email)
影響度: HIGH

上流影響（この変更の影響を受ける Spec）:
- S-AUTH-001: ユーザー認証 (uses M-USER)
- S-PROFILE-001: プロフィール編集 (uses M-USER)

下流依存:
- API-USER-CREATE: 新規作成API (returns M-USER)
- API-USER-UPDATE: 更新API (accepts M-USER)

Matrix 参照:
- SCR-002: ユーザー登録画面

必要なアクション:
1. S-AUTH-001 の FR を更新
2. S-PROFILE-001 の UC を更新
3. Matrix の screen mappings を更新
```

**[HUMAN_CHECKPOINT]** (Case 3 Decision)
- [ ] 影響分析結果を確認したか
- [ ] 影響を受ける Feature の一覧を確認したか
- [ ] 変更による破壊的影響を理解しているか
- [ ] 影響を受ける実装の更新計画があるか

この変更を続行しますか？承認後、Step 5 へ進みます。

### Step 5: Create Change Spec

If change is significant, create a Change Spec:

```bash
gh issue create --title "[Spec Change] {変更概要}" --body "..."
node .claude/skills/spec-mesh/scripts/branch.cjs --type spec --slug {slug} --issue {issue_num}
```

### Step 6: Apply Changes

1. **Update target Spec**
2. **Update Matrix:**
   ```bash
   node .claude/skills/spec-mesh/scripts/generate-matrix-view.cjs
   ```
3. **Update affected Feature Specs** (if needed)
4. **Record Changelog:**
   ```bash
   node .claude/skills/spec-mesh/scripts/changelog.cjs record \
     --spec "{spec_path}" \
     --type update \
     --description "{変更内容の要約}"
   ```

### Step 7: Multi-Review (3観点並列レビュー)

変更後の Spec の品質を担保するため Multi-Review を実行：

1. **Read review workflow:**
   ```
   Read tool: .claude/skills/spec-mesh-quality/workflows/review.md
   ```

2. **Execute Multi-Review:**
   - 変更した Spec に対して 3 つの reviewer agent を並列実行
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
  path: .specify/specs/overview/{spec_type}/spec.md
  output_mode: count
```

**判定ロジック:**

```
clarify_count = [NEEDS CLARIFICATION] マーカー数

if clarify_count > 0:
    ┌─────────────────────────────────────────────────────────────┐
    │ ★ CLARIFY GATE: 曖昧点が {clarify_count} 件あります         │
    │                                                             │
    │ 次のステップに進む前に clarify ワークフロー が必須です。     │
    │                                                             │
    │ 「clarify を実行して」と依頼してください。                   │
    └─────────────────────────────────────────────────────────────┘
    → clarify ワークフロー を実行（必須）
    → clarify 完了後、Multi-Review からやり直し

else:
    → Step 9 (Lint) へ進む
```

**重要:** clarify_count > 0 の場合、次のステップへの遷移は禁止。

### Step 9: Run Lint

```bash
node .claude/skills/spec-mesh/scripts/spec-lint.cjs
node .claude/skills/spec-mesh/scripts/validate-matrix.cjs
```

### Step 10: Summary & [HUMAN_CHECKPOINT]

1. **Display Summary:**
   ```
   === Spec Change 完了 ===

   Changed: {target spec}
   Items modified:
   - M-USER: email 属性追加

   Affected Features updated:
   - S-AUTH-001: 参照更新
   - S-PROFILE-001: 参照更新

   Matrix: 更新済み

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
   - [ ] 変更内容が正しく反映されているか
   - [ ] 影響を受ける Feature Spec が更新されているか
   - [ ] Matrix の整合性が確認されているか

   承認後、次のステップへ進んでください。
   ```

---

## Self-Check

- [ ] **TodoWrite で全ステップを登録したか**
- [ ] 変更対象を特定したか
- [ ] Impact Analysis を実施したか
- [ ] 人間の承認を得たか
- [ ] 対象 Spec を更新したか
- [ ] Matrix を更新したか
- [ ] 影響を受ける Feature Spec を更新したか
- [ ] **Multi-Review を実行したか（3観点並列）**
- [ ] **CLARIFY GATE をチェックしたか**
- [ ] lint を実行したか
- [ ] **TodoWrite で全ステップを completed にしたか**

---

## Next Steps

| Condition | Workflow | Description |
|-----------|----------|-------------|
| CLARIFY GATE: BLOCKED | clarify | **必須** - 曖昧点を解消 |
| CLARIFY GATE: PASSED + Spec のみ | pr | PR 作成 |
| CLARIFY GATE: PASSED + 実装必要 | implement | Feature 作業を再開 |
