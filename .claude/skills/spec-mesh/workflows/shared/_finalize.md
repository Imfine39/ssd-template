# Finalize（完了処理）共通コンポーネント

Cascade Update 後の完了処理。Input 保存、サマリー表示、CHECKPOINT、Issue/Branch 作成。

---

## Purpose

1. **入力情報の保存と後片付け**
2. **完了サマリーの表示**
3. **人間確認ポイントの提供**
4. **GitHub Issue とブランチの作成**

---

## 呼び出し元ワークフロー

| ワークフロー | Input 種別 | Issue/Branch |
|-------------|-----------|--------------|
| feature.md | add-input.md | 作成する |
| fix.md | fix-input.md | 作成する |
| SKILL.md Entry (issue タイプ) | なし | スキップ（作成済み） |

---

## Steps

### Step 1: Input 保存・リセット

**入力ファイルを使用した場合のみ:**

```bash
# Feature の場合
node .claude/skills/spec-mesh/scripts/preserve-input.cjs add --feature {feature-dir}
node .claude/skills/spec-mesh/scripts/reset-input.cjs add

# Fix の場合
node .claude/skills/spec-mesh/scripts/preserve-input.cjs fix --fix {fix-dir}
node .claude/skills/spec-mesh/scripts/reset-input.cjs fix
```

### Step 2: サマリー表示

```
=== {Feature | Fix} Spec 作成完了 ===

Spec: {spec_path}

【Quality Flow】
- Interview: {N} 問（{covered}/9 領域カバー）
- Review Issues: Critical {N} / Major {N}
- CLARIFY GATE: {PASSED | PASSED_WITH_DEFERRED}

【Cascade Update】
- Domain: {N} 件更新
- Screen: {N} 件更新
- Matrix: {UPDATED | NO CHANGE}

【整合性検証】
- spec-lint: PASSED

{if PASSED_WITH_DEFERRED}
【[DEFERRED] 項目】
この Spec には {D} 件の [DEFERRED] 項目があります:

| # | Section | 項目 | 理由 | 影響 |
|---|---------|------|------|------|
| 1 | {section} | {item} | {reason} | {impact} |
| 2 | ... | ... | ... | ... |

⚠️ 実装フェーズで [DEFERRED] に遭遇した場合、clarify に戻る必要があります。
{/if}
```

### Step 3: [HUMAN_CHECKPOINT]

> **参照:** [human-checkpoint-patterns.md](../../guides/human-checkpoint-patterns.md) - Pattern 1 (Spec Approval)

```
=== [HUMAN_CHECKPOINT] Spec Approval ===

確認事項:
- [ ] Spec の内容が要件を正確に反映しているか
- [ ] Cascade Update の内容が正しいか
- [ ] 次のステップに進む準備ができているか

{if PASSED_WITH_DEFERRED}
★ [DEFERRED] 項目の確認:
- [ ] 上記の [DEFERRED] 項目を確認したか
- [ ] これらのリスクを承知の上で先に進むか
- [ ] 実装フェーズで [DEFERRED] に遭遇した場合、clarify に戻ることを理解しているか
{/if}

★ 承認後、GitHub Issue とブランチを作成します。
```

### Step 3.5: Checkpoint 記録

**★ CHECKPOINT 承認後に実行 ★**

```bash
node .claude/skills/spec-mesh/scripts/state.cjs branch --add-checkpoint spec_approval
```

### Step 4: GitHub Issue 作成

**★ CHECKPOINT 承認後に実行 ★**

```bash
# Feature
gh issue create --title "[Feature] {機能名}" --body "..."

# Fix
gh issue create --title "[Bug] {概要}" --body "..." --label "bug"
```

### Step 5: ブランチ作成

```bash
# Feature
node .claude/skills/spec-mesh/scripts/branch.cjs --type feature --slug {slug} --issue {issue_num}

# Fix
node .claude/skills/spec-mesh/scripts/branch.cjs --type fix --slug {slug} --issue {issue_num}
```

---

## Output

```
=== Issue・ブランチ作成完了 ===

Issue: #{issue_num}
Branch: {feature|fix}/{issue_num}-{slug}

次のステップ:
- Feature → plan ワークフローで実装計画を作成
- Fix (Trivial) → implement ワークフローで直接修正
- Fix (Standard) → plan ワークフローで修正計画を作成
```

---

## issue タイプからの呼び出し時

issue タイプでは Issue/Branch が既に存在するため、Step 4-5 をスキップ：

```markdown
### Step N: Finalize

> **参照:** [shared/_finalize.md](shared/_finalize.md)

※ issue タイプからの場合: Step 1-3 のみ実行（Issue/Branch 作成済み）
```

---

## 呼び出し方

```markdown
### Step N: Finalize

> **参照:** [shared/_finalize.md](shared/_finalize.md)

Input 保存 → サマリー → CHECKPOINT → Issue/Branch 作成
```
