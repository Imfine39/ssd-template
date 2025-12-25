# Multi-Review Workflow

Spec 作成後に 3 つの観点から並列レビューを実行し、品質を担保する。

## Purpose

- AI による多角的品質チェック
- 人間に渡す前に AI で修正可能な問題を解消
- Lint だけでは検出できない論理的問題を発見

---

## When to Use

このワークフローは以下の workflow から呼び出される：
- vision.md (Step 6)
- design.md (Step 5)
- add.md (Step 5)
- fix.md (Step 5)
- change.md (Step 4)

直接 review ワークフロー として呼び出すことも可能。

---

## Prerequisites

- 対象 Spec ファイルが存在すること
- Spec が Draft 以上のステータスであること

---

## 3 Reviewer Perspectives

### Reviewer A: 構造・形式 (Structure & Format)

**観点:** Template 遵守、形式的正確性

**チェック項目:**
- [ ] 必須セクションがすべて存在する
- [ ] セクション番号・構成が Template に準拠
- [ ] ID が命名規則に従っている (S-*, M-*, API-*, SCR-*, F-*)
- [ ] Markdown 構文が正しい
- [ ] プレースホルダー ([PROJECT_NAME] 等) が残っていない
- [ ] 日付形式が統一されている (YYYY-MM-DD)
- [ ] ステータス値が有効 (Draft/Clarified/Approved/Implemented)

### Reviewer B: 内容・整合性 (Content & Consistency)

**観点:** 論理的整合性、入力との一致

**チェック項目:**
- [ ] 入力ファイルの内容が正確に反映されている
- [ ] セクション間で矛盾がない
- [ ] Entity 名・用語が文書内で統一されている
- [ ] 他 Spec への参照が妥当 (存在する ID を参照)
- [ ] ビジネスロジックが論理的に成立する
- [ ] ユーザー役割と権限が一貫している

### Reviewer C: 完全性・網羅性 (Completeness & Coverage)

**観点:** カバレッジ、欠落の発見

**チェック項目:**
- [ ] 入力で言及されたすべての項目が Spec に含まれる
- [ ] 明らかなスコープの欠落がない
- [ ] ユーザージャーニーが主要シナリオをカバー
- [ ] 画面リストが機能要件を網羅
- [ ] リスクと制約が適切に考慮されている
- [ ] Open Questions に重要な未決事項がリストされている

---

## Steps

### Step 1: Load Target Spec

```
Read tool: {spec_path}
Read tool: {input_path} (if exists)
```

対象 Spec と元の入力ファイルを読み込む。

### Step 2: Run 3 Reviewers in Parallel

**IMPORTANT: Parallel Execution**

To run 3 reviewers in parallel, you MUST invoke all 3 Task tools in a single response.
Each Task tool call should:
- Use `subagent_type: reviewer`
- Use the default `run_in_background: false`
- Be included in the same response message

Claude Code will automatically execute them in parallel when multiple Task calls are in one message.

---

**Task Tool Invocations (3 parallel calls):**

Below shows the format for each of the 3 parallel Task tool invocations.
Include all 3 in a single `<function_calls>` block:

```
Task tool #1 (Reviewer A):
  subagent_type: reviewer
  prompt: |
    ## Reviewer A: 構造・形式チェック

      以下の Spec を「構造・形式」の観点からレビューしてください。

      ### チェック項目
      - 必須セクションの存在
      - Template 準拠
      - ID 命名規則
      - Markdown 構文
      - プレースホルダー残留
      - 日付形式
      - ステータス値

      ### Spec 内容
      {spec_content}

      ### 出力形式
      ```
      ## 構造・形式レビュー結果

      ### Critical (必須修正)
      - [C1] {issue}: {location}

      ### Major (推奨修正)
      - [M1] {issue}: {location}

      ### Minor (軽微)
      - [m1] {issue}: {location}

      ### OK
      - {passed_item}
      ```

---

Task tool #2 (Reviewer B):
  subagent_type: reviewer
  prompt: |
    ## Reviewer B: 内容・整合性チェック

      以下の Spec を「内容・整合性」の観点からレビューしてください。

      ### チェック項目
      - 入力との一致
      - セクション間の矛盾
      - 用語の統一
      - 参照の妥当性
      - ビジネスロジックの論理性
      - 権限の一貫性

      ### Spec 内容
      {spec_content}

      ### 入力内容 (参考)
      {input_content}

      ### 出力形式
      (同上)

---

Task tool #3 (Reviewer C):
  subagent_type: reviewer
  prompt: |
    ## Reviewer C: 完全性・網羅性チェック

      以下の Spec を「完全性・網羅性」の観点からレビューしてください。

      ### チェック項目
      - 入力項目の網羅
      - スコープの欠落
      - ジャーニーのカバレッジ
      - 画面の網羅性
      - リスク考慮
      - Open Questions

      ### Spec 内容
      {spec_content}

      ### 入力内容 (参考)
      {input_content}

      ### 出力形式
      (同上)
```

### Step 3: Consolidate Feedback

3 つの結果を統合：

1. **重複排除:** 同じ問題を指摘している場合はマージ
2. **重要度でソート:** Critical → Major → Minor
3. **修正可能性を判断:**
   - AI で修正可能: 形式エラー、用語不統一、明らかな欠落
   - ユーザー確認必要: 曖昧な要件、ビジネス判断

```
=== Multi-Review 結果 ===

Critical ({count}):
- [C1] {issue} (Reviewer {A/B/C})
- [C2] ...

Major ({count}):
- [M1] {issue} (Reviewer {A/B/C})
- [M2] ...

Minor ({count}):
- [m1] {issue} (Reviewer {A/B/C})

AI 修正可能: {count}
ユーザー確認必要: {count}
```

### Step 4: Fix AI-Correctable Issues

Critical と Major のうち AI で修正可能なものを修正：

```
Edit tool: {spec_path}
  - Fix issue C1: ...
  - Fix issue M1: ...
```

修正内容をログ：
```
=== 修正完了 ===
- [C1] {issue}: {修正内容}
- [M1] {issue}: {修正内容}
```

### Step 5: Run Lint Verification

```bash
node .claude/skills/spec-mesh/scripts/spec-lint.cjs
node .claude/skills/spec-mesh/scripts/validate-matrix.cjs (if Matrix exists)
```

### Step 6: Determine Next Action

```
if has_critical_unresolved:
    // ユーザー確認が必要な Critical がある
    suggest: "clarify ワークフローで解消してください"

elif has_ambiguity_markers:
    // [NEEDS CLARIFICATION] が残っている
    suggest: "clarify ワークフローで曖昧点を解消してください"

elif lint_failed:
    // Lint エラーがある
    fix lint errors and re-run

else:
    // すべてパス
    report: "Multi-Review 完了。[HUMAN_CHECKPOINT] 承認待ち"
    suggest: "次のステップへ進んでください"
```

---

## Output Format

```
=== Multi-Review 完了 ===

Spec: {spec_path}
Review Iterations: {count}

Issues Found:
- Critical: {count} (Fixed: {fixed}, Remaining: {remaining})
- Major: {count} (Fixed: {fixed}, Remaining: {remaining})
- Minor: {count} (Info only)

Lint: {PASSED|FAILED}

Status: {PASSED|NEEDS_CLARIFY|NEEDS_FIX}

{if PASSED}
[HUMAN_CHECKPOINT] Spec を確認し、問題なければ次へ進んでください。
Next: {next_workflow} ワークフロー

{if NEEDS_CLARIFY}
ユーザー確認が必要な項目があります。
Next: clarify ワークフロー

{if NEEDS_FIX}
修正が必要な項目があります。
Issues:
- {issue_list}
```

---

## Configuration

### Review Iterations

デフォルト: 最大 2 回のレビューループ

```
MAX_REVIEW_ITERATIONS = 2
```

2 回のレビュー後も Critical が残る場合はユーザーにエスカレート。

### Severity Definitions

| Severity | Definition | Action |
|----------|------------|--------|
| Critical | Spec として不完全、次に進めない | 必須修正 |
| Major | 品質上の問題、修正推奨 | 推奨修正 |
| Minor | 軽微な問題、任意修正 | 情報のみ |

---

## Self-Check

- [ ] 3 つの Reviewer を並列で起動したか
- [ ] フィードバックを統合したか
- [ ] AI 修正可能な問題を修正したか
- [ ] Lint を実行したか
- [ ] 次のアクションを明確に提示したか

---

## Related Tools

| Tool | Relationship |
|------|--------------|
| Clarify | Review 後、ユーザー確認が必要な場合に使用。[workflows/clarify.md](clarify.md) を参照 |
| Lint | Review 後の自動検証として実行 |
| Checklist | Review 前の入力品質チェックに使用可能 |
| Analyze | 実装後の差分分析（Review とは別フロー） |

---

## Next Steps

**[HUMAN_CHECKPOINT]** Multi-Review の結果を確認してから次のステップに進んでください。

| Condition | Command | Description |
|-----------|---------|-------------|
| すべてパスした場合 | (呼び出し元へ戻る) | 次のワークフローステップへ |
| 曖昧点がある場合 | clarify ワークフロー | 曖昧点解消 |
| 修正が必要な場合 | review ワークフロー | 修正後に再レビュー |

---

## Dependency Note

**重要:** このワークフローは Step 5 で `lint.md` を呼び出します。

- Review (this) --> calls --> Lint
- Lint は Review を呼び出しません（循環依存なし）

Lint は単純な構造検証のみを行い、Review が行う論理的レビューは行いません。
