# Change Workflow

Change Vision, Domain, or Screen Spec (existing M-*/API-*/BR-*/VR-*/SCR-*).

## Purpose

Handle changes to shared specifications that may impact multiple Features.

## When to Use

- Case 3: Feature requires changes to existing M-*/API-*
- Design evolution: Screen layout needs modification
- Business rule change: BR-*/VR-* update

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

1. **Find affected Features:**
   - Search for references to changed IDs
   - List all impacted Feature Specs

2. **Display impact and request approval:**
   ```
   === Impact Analysis ===

   Changing: M-USER (属性追加: email)

   Affected:
   - S-AUTH-001: ユーザー認証 (uses M-USER)
   - S-PROFILE-001: プロフィール編集 (uses M-USER)
   - API-USER-CREATE: 新規作成API (returns M-USER)
   - API-USER-UPDATE: 更新API (accepts M-USER)
   - SCR-002: ユーザー登録画面
   ```

**[HUMAN_CHECKPOINT]** (Case 3 Decision)
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

### Step 7: Multi-Review (3観点並列レビュー)

変更後の Spec の品質を担保するため Multi-Review を実行：

1. **Read review workflow:**
   ```
   Read tool: .claude/skills/spec-mesh/workflows/review.md
   ```

2. **Execute Multi-Review:**
   - 変更した Spec に対して 3 つの reviewer agent を並列実行
   - フィードバック統合
   - AI 修正可能な問題を修正

3. **Handle results:**
   - すべてパス → Step 8 へ
   - Critical 未解決 → 問題をリストし対応を促す

### Step 8: Run Lint

```bash
node .claude/skills/spec-mesh/scripts/spec-lint.cjs
node .claude/skills/spec-mesh/scripts/validate-matrix.cjs
```

### Step 9: Summary

```
=== Spec Change 完了 ===

Changed: {target spec}
Items modified:
- M-USER: email 属性追加

Affected Features updated:
- S-AUTH-001: 参照更新
- S-PROFILE-001: 参照更新

Matrix: 更新済み

次のステップ:
- 影響を受ける Feature の実装を更新
- または pr ワークフロー で Spec 変更を PR
```

---

## Self-Check

- [ ] 変更対象を特定したか
- [ ] Impact Analysis を実施したか
- [ ] 人間の承認を得たか
- [ ] 対象 Spec を更新したか
- [ ] Matrix を更新したか
- [ ] 影響を受ける Feature Spec を更新したか
- [ ] **Multi-Review を実行したか（3観点並列）**
- [ ] lint を実行したか

---

## Next Steps

**[HUMAN_CHECKPOINT]**
- [ ] 変更内容が正しく反映されているか
- [ ] 影響を受ける Feature Spec が更新されているか
- [ ] Matrix の整合性が確認されているか

承認後、次のステップへ進んでください。

| Condition | Command | Description |
|-----------|---------|-------------|
| Spec のみの変更の場合 | pr ワークフロー | PR 作成 |
| 実装が必要な場合 | implement ワークフロー | Feature 作業を再開 |
