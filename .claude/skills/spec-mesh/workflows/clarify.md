# Clarify Workflow

Resolve ambiguous requirements with 4-question batches.

## Purpose

Detect `[NEEDS CLARIFICATION]` markers and resolve them through structured questions.

**呼び出し元:** このワークフローは主に [review.md](review.md) の Step 6 から呼び出されます。
Multi-Review で「ユーザー確認が必要」と判断された項目を解消するために使用します。

---

## Steps

### Step 1: Load Spec

1. **Determine which Spec to clarify:**
   - Vision Spec: `.specify/specs/{project}/overview/vision/spec.md`
   - Domain Spec: `.specify/specs/{project}/overview/domain/spec.md`
   - Feature Spec: `.specify/specs/{project}/features/{id}/spec.md`
   - Fix Spec: `.specify/specs/{project}/fixes/{id}/spec.md`

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

回答を入力してください（例: 1A 2B 3C 4A）:
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
   - Add to Clarifications section:
     ```markdown
     ### Clarification (YYYY-MM-DD)
     - Q: {質問}
     - A: {回答}
     - Section updated: {セクション番号}
     ```

3. **Save Spec:**
   ```
   Edit tool: {spec_path}
   ```

4. **Proceed to next batch** if more ambiguities remain

### Step 5: Run Lint

```bash
node .claude/skills/spec-mesh/scripts/spec-lint.cjs
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
まだ曖昧点が残っています。再度 `/spec-mesh clarify` を実行してください。

{M = 0 の場合}
全ての曖昧点が解消されました。
次のステップ: `/spec-mesh {next_command}`
```

### Step 7: Update State

```bash
node .claude/skills/spec-mesh/scripts/state.cjs repo --set-{spec_type}-status clarified
```

---

## Self-Check

- [ ] Spec を読み込んだか
- [ ] 曖昧点を全て検出したか
- [ ] 4問ずつバッチで質問したか
- [ ] 各回答後に即座に Spec を更新したか
- [ ] Clarifications セクションに記録したか
- [ ] spec-lint を実行したか

---

## Next Steps

| Spec Type | Next Command |
|-----------|--------------|
| Vision | `/spec-mesh design` |
| Domain | `/spec-mesh issue` |
| Feature | `/spec-mesh plan` |
| Fix | `/spec-mesh plan` |
