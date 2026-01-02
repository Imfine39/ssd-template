# Multi-Review Workflow

Spec 作成後に 3 つの観点から並列レビューを実行し、品質を担保する。

## Todo Template

```
TodoWrite:
  todos:
    - content: "Step 1: Spec 読み込み"
      status: "pending"
      activeForm: "Loading spec"
    - content: "Step 2: 3 Reviewers 並列実行"
      status: "pending"
      activeForm: "Running parallel reviewers"
    - content: "Step 3: フィードバック統合"
      status: "pending"
      activeForm: "Consolidating feedback"
    - content: "Step 4: AI修正可能な問題の修正"
      status: "pending"
      activeForm: "Fixing AI-correctable issues"
    - content: "Step 5: Lint 実行"
      status: "pending"
      activeForm: "Running lint"
    - content: "Step 6: 次アクション判定"
      status: "pending"
      activeForm: "Determining next action"
```

---

## Purpose

- AI による多角的品質チェック
- 人間に渡す前に AI で修正可能な問題を解消
- Lint だけでは検出できない論理的問題を発見

---

## When to Use

このワークフローは以下の workflow から呼び出される：
- project-setup.md (Step 10)
- feature.md (Step 5)
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
- [ ] `[PENDING OVERVIEW CHANGE]` の内容が明確で実行可能 (Feature/Fix Spec のみ)

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

**IMPORTANT: 並列実行の方法**

3 つの Reviewer を並列で実行するには、**1 つのレスポンス内で 3 つの Task tool を同時に呼び出す**。

```
Task tool を 3 回呼び出す（すべて同一メッセージ内）:
- subagent_type: "reviewer" (reviewer エージェントを使用)
- description: "Reviewer A: 構造レビュー" 等
- prompt: 各 Reviewer 用のプロンプト
```

**注意:**
- 3 つの Task tool 呼び出しを別々のメッセージに分けると順次実行になる
- 必ず 1 つのメッセージで 3 つ同時に呼び出すこと

---

**Task Tool 呼び出しテンプレート:**

以下に各 Reviewer のプロンプトテンプレートを示す：

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
node .claude/skills/nick-q/scripts/spec-lint.cjs
node .claude/skills/nick-q/scripts/validate-matrix.cjs (if Matrix exists)
```

### Step 6: Determine Next Action

```
if has_critical_unresolved:
    // ユーザー確認が必要な Critical がある
    suggest: "clarify ワークフローで解消してください"

elif has_ambiguity_markers:
    // [NEEDS CLARIFICATION] が残っている
    suggest: "clarify ワークフローで曖昧点を解消してください"

elif has_pending_overview_change:
    // [PENDING OVERVIEW CHANGE] が残っている (Feature/Fix Spec のみ)
    report: "[PENDING OVERVIEW CHANGE] が検出されました"
    suggest: "SPEC GATE で Overview Change サブワークフローを実行してください"

elif lint_failed:
    // Lint エラーがある
    fix lint errors and re-run

else:
    // すべてパス
    report: "Multi-Review 完了。[HUMAN_CHECKPOINT] 承認待ち"
    suggest: "次のステップへ進んでください"
```

> **Note:** `[PENDING OVERVIEW CHANGE]` のチェックは Feature/Fix Spec でのみ実行。
> Overview Spec ではこのマーカーは使用しないため、チェックをスキップする。

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

**上限超過時の対応:**

2 回のレビュー後も Critical が残る場合：

1. **エスカレーション表示:**
   ```
   ⚠️ Multi-Review 上限 (2回) に達しました

   未解決の Critical Issues:
   - [C1] {issue}
   - [C2] {issue}

   これらは AI では修正できない問題です。
   以下のいずれかを選択してください:
   1. clarify ワークフロー で人間が判断
   2. Spec を手動で修正後、review ワークフロー を再実行
   3. 現状のまま続行（非推奨）
   ```

2. **自動続行禁止:** Critical 未解決のまま Plan に進むことは禁止
3. **記録:** 未解決 Critical は Spec の Open Questions に追記

### Severity Definitions

| Severity | Definition | Action |
|----------|------------|--------|
| Critical | Spec として不完全、次に進めない | 必須修正 |
| Major | 品質上の問題、修正推奨 | 推奨修正 |
| Minor | 軽微な問題、任意修正 | 情報のみ |

### [DEFERRED] 項目の評価基準

Multi-Review で [DEFERRED] を発見・評価する場合:

| 状況 | 評価 | アクション |
|------|------|----------|
| すでに clarify で [DEFERRED] 化済み | **INFO** | 確認のみ（問題なし） |
| 新規発見の曖昧点 | **Major** | clarify へ戻すか [DEFERRED] 化を判断 |
| [DEFERRED] の影響範囲が広い（3+ Spec） | **Warning** | Risks セクションの記載を詳細に確認 |
| [DEFERRED] がブロッキング（実装不可能） | **Critical** | 即座に clarify 必須 |

#### [DEFERRED] 評価の観点

1. **影響範囲**: 何 Spec に影響するか
2. **実装可能性**: [DEFERRED] のまま実装を進められるか
3. **リスク記載**: Risks セクションに適切に記載されているか
4. **解消見込み**: いつ解消される見込みか明記されているか

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

| Condition | Workflow | Description |
|-----------|----------|-------------|
| すべてパスした場合 | (呼び出し元へ) | 次のワークフローステップへ |
| 曖昧点がある場合 | clarify | 曖昧点解消 |
| 修正が必要な場合 | review | 修正後に再レビュー |

---

## Dependency Note

**重要:** このワークフローは Step 5 で `lint.md` を呼び出します。

- Review (this) --> calls --> Lint
- Lint は Review を呼び出しません（循環依存なし）

Lint は単純な構造検証のみを行い、Review が行う論理的レビューは行いません。
