# Clarify Workflow

Resolve ambiguous requirements with 4-question batches.

## Todo Template

```
TodoWrite:
  todos:
    - content: "Step 1: Spec 読み込み"
      status: "pending"
      activeForm: "Loading spec"
    - content: "Step 2: 曖昧点検出"
      status: "pending"
      activeForm: "Detecting ambiguities"
    - content: "Step 3: バッチ質問"
      status: "pending"
      activeForm: "Batching questions"
    - content: "Step 4: Spec 即時更新"
      status: "pending"
      activeForm: "Updating spec"
    - content: "Step 5: Lint 実行"
      status: "pending"
      activeForm: "Running lint"
    - content: "Step 6: Summary"
      status: "pending"
      activeForm: "Summarizing"
    - content: "Step 7: State 更新"
      status: "pending"
      activeForm: "Updating state"
```

---

## Purpose

Detect `[NEEDS CLARIFICATION]` markers and resolve them through structured questions.

**呼び出し元:** このワークフローは主に [review.md](review.md) の Step 6 から呼び出されます。
Multi-Review で「ユーザー確認が必要」と判断された項目を解消するために使用します。

---

## Steps

### Step 1: Load Spec

1. **Determine which Spec to clarify:**

   | Spec Type | Path | Clarification セクション |
   |-----------|------|-------------------------|
   | Vision | `.specify/specs/overview/vision/spec.md` | Implementation Notes |
   | Domain | `.specify/specs/overview/domain/spec.md` | Implementation Notes |
   | Screen | `.specify/specs/overview/screen/spec.md` | Implementation Notes |
   | Feature | `.specify/specs/features/{id}/spec.md` | Clarifications |
   | Fix | `.specify/specs/fixes/{id}/spec.md` | Clarifications |

2. **Read the Spec:**
   ```
   Read tool: {spec_path}
   ```

### Step 2: Detect Ambiguities

1. **Search for markers:**
   - `[NEEDS CLARIFICATION]`
   - `TBD`
   - `TODO`
   - Empty required sections

2. **List all found:**
   ```
   検出された曖昧点: {N} 件

   1. Section 1.2: Success definition が未定義
   2. Section 3.1: Journey の詳細が不足
   3. Section 5: Screen Hints が空
   4. Section 6: Risks が推定のみ
   ...
   ```

### Step 3: Batch Questions (4 at a time)

For each batch of 4 ambiguities:

```
=== 曖昧点の解消 (1-4 / {total}) ===

Q1: {質問}
   推奨: {Option A / Option B}
   A) {選択肢A}
   B) {選択肢B}
   C) その他

Q2: {質問}
   推奨: {Option A / Option B}
   ...

Q3: ...

Q4: ...

回答を入力してください（例: 1A 2B 3C 4D）:
```

#### 「現時点では回答できない」(D) の処理

ユーザーが「D」を選択した場合:

1. **理由を確認**:
   ```
   AskUserQuestion:
     questions:
       - question: "この項目を [DEFERRED] にする理由を選択してください"
         header: "DEFERRED理由"
         options:
           - label: "技術検証後に決定"
             description: "技術選定やPoCの結果待ち"
           - label: "外部承認待ち"
             description: "ステークホルダーの確認が必要"
           - label: "後フェーズで詳細化"
             description: "MVP以降で対応予定"
           - label: "追加調査必要"
             description: "情報が不足している"
         multiSelect: false
   ```

2. **マーカー変換**:
   ```
   [NEEDS CLARIFICATION] → [DEFERRED: {選択した理由}]
   ```

3. **リスク記録**:
   Risks セクションに影響を追記:
   ```markdown
   ### Deferred Items

   | Section | 項目 | 理由 | 影響 | 解消予定 |
   |---------|------|------|------|---------|
   | {section} | {item} | {reason} | {impact} | {when} |
   ```

4. **state.cjs 更新** (将来機能 - 現時点ではスキップ可):
   ```bash
   # [FUTURE] このコマンドは未実装。DEFERRED の記録は Spec マーカーで管理
   # node .claude/skills/nick-q/scripts/state.cjs --add-deferred-item {spec_type} {description}
   ```

#### Handling More Than 4 Ambiguities

4件を超える曖昧点がある場合:

1. **優先順位付け**: Critical/Blocking な項目を先にバッチ処理
2. **バッチ繰り返し**: 4件ずつ処理し、各バッチ後に Spec を更新
3. **進捗表示**: `(1-4 / 12)`, `(5-8 / 12)`, `(9-12 / 12)` のように表示

```
検出された曖昧点: 12 件

優先順位:
- Critical (実装ブロック): 5 件 → Batch 1-2 で処理
- Major (品質影響): 4 件 → Batch 3 で処理
- Minor (任意): 3 件 → Batch 4 で処理

Batch 1/4 を開始します...
```

**注意:** 各バッチ完了後に必ず Spec を保存し、次のバッチに進む前に状態を確定させること。

### Step 4: Immediate Spec Update

After each batch response:

1. **Parse answers**
2. **Update Spec immediately:**
   - Replace `[NEEDS CLARIFICATION]` with resolved content
   - Add to appropriate section based on Spec type:

   **For Feature/Fix Specs → Clarifications section:**
   ```markdown
   ## Clarifications

   ### Clarification (YYYY-MM-DD)
   - Q: {質問}
   - A: {回答}
   - Section updated: {セクション番号}
   ```

   **For Vision/Domain/Screen Specs → Implementation Notes section:**
   ```markdown
   ## Implementation Notes

   ### Clarification (YYYY-MM-DD)
   - Q: {質問}
   - A: {回答}
   - Section updated: {セクション番号}
   - Affected Items: {影響を受ける M-*/API-*/SCR-* ID}
   ```

3. **Save Spec:**
   ```
   Edit tool: {spec_path}
   ```

4. **Proceed to next batch** if more ambiguities remain

### Step 5: Run Lint

```bash
node .claude/skills/nick-q/scripts/spec-lint.cjs
```

### Step 6: Summary

Display:
```
=== Clarify 完了 ===

Spec: {spec_path}
解消した曖昧点: {N} 件
残り: {M} 件

更新されたセクション:
- Section 1.2: Success definition
- Section 3.1: Journey details
- ...

{M > 0 の場合}
まだ曖昧点が残っています。再度 clarify ワークフロー を実行してください。

{M = 0 の場合}
全ての曖昧点が解消されました。
次のステップ: {next_command} ワークフロー
```

### Step 7: Update State

```bash
node .claude/skills/nick-q/scripts/state.cjs repo --set-{spec_type}-status clarified
```

---

## [DEFERRED] 解消時の処理

既存の [DEFERRED] 項目を解消する場合:

1. **clarify ワークフローで回答を得る**
2. **マーカー変換**:
   - `[DEFERRED: {理由}]` → 通常の記述（回答内容に置換）
   - 周辺のコンテキストも必要に応じて更新
3. **Deferred Items テーブルから該当行を削除**
4. **Risks セクションの該当記述を削除または「解消済み」に更新**
5. **spec-lint を実行して整合性確認**

---

## [DEFERRED] の逆変換

[DEFERRED] を [NEEDS CLARIFICATION] に戻す場合:

1. **理由を確認**: なぜ戻す必要があるか
2. **AskUserQuestion で確認**
3. **マーカー変換**: `[DEFERRED: xxx]` → `[NEEDS CLARIFICATION]`
4. **Deferred Items テーブルから削除**
5. **clarify ワークフローを続行**

---

## Self-Check

- [ ] Spec を読み込んだか
- [ ] 曖昧点を全て検出したか
- [ ] 4問ずつバッチで質問したか
- [ ] 各回答後に即座に Spec を更新したか
- [ ] Clarifications セクションに記録したか
- [ ] **「現時点では回答できない」を選んだ場合、[DEFERRED] に変換したか**
- [ ] **[DEFERRED] の理由と影響を Risks セクションに記録したか**
- [ ] spec-lint を実行したか

---

## Clarify 完了後のフロー

```
clarify 完了
    ↓
Multi-Review へ戻る（対象 Spec の review.md を再実行）
    ↓
SPEC GATE 再チェック
    ↓
PASSED → [HUMAN_CHECKPOINT] → 次のワークフローへ
```

**重要:** clarify 完了後は必ず Multi-Review に戻り、SPEC GATE を再度通過する必要があります。

---

## Next Steps

**[HUMAN_CHECKPOINT]** 曖昧点の解消結果を確認してから次のステップに進んでください。

### Spec 別の次ステップ

| Spec Type | Multi-Review 後の遷移先 | Description |
|-----------|------------------------|-------------|
| Vision Spec | design | Screen + Domain + Matrix 作成 |
| Domain Spec | issue | Issue から開発開始 |
| Screen Spec | issue | Issue から開発開始 |
| Feature Spec | plan | 実装計画作成 |
| Fix Spec | plan | 修正計画作成 |
