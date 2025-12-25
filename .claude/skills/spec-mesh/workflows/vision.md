# Vision Workflow

First step for new projects. Creates Vision Spec defining purpose, users, journeys, and scope.

## Prerequisites

- None (this is the starting point)

## Quick Input

**Input file:** `.specify/input/vision-input.md`

Unified Quick Input with 4 parts:
- **Part A** (Required): ビジョン - プロジェクト名、課題、ユーザー、やりたいこと
- **Part B** (Recommended): 画面イメージ - 画面リスト、遷移、主な要素
- **Part C** (Optional): デザイン希望 - スタイル、レスポンシブ
- **Part D** (Recommended): ビジネスルール - 業務ルール、バリデーション

---

## Steps

### Step 1: Input Collection

1. **Read input file:**
   ```
   Read tool: .specify/input/vision-input.md
   ```

2. **Determine input source:**
   - If input file has content → Use it
   - If ARGUMENTS has content → Use it
   - If both empty → Prompt user for input

3. **Required fields check:**
   - プロジェクト名 (non-empty)
   - やりたいこと (at least 1 item)
   - If missing → Request from user

### Step 2: Vision Spec Generation

1. **Run scaffold:**
   ```bash
   node .claude/skills/spec-mesh/scripts/scaffold-spec.cjs --kind vision --id S-VISION-001 --title "[Project Name]"
   ```

2. **Fill sections from input:**

   | Input Field | Target Section |
   |-------------|----------------|
   | 課題/問題 | Section 1 (System Purpose) |
   | ユーザー | Section 2 (Target Users) |
   | やりたいこと | Section 3 (User Journeys) |
   | やらないこと | Section 4 (Scope - Out of Scope) |
   | 制約 | Section 6 (Constraints) |
   | 画面リスト | Section 5.1 (Screen List) |
   | 画面遷移 | Section 5.2 (Screen Transitions) |
   | デザイン希望 | Section 5.3 (Design Preferences) |

3. **Mark ambiguities:**
   - Add `[NEEDS CLARIFICATION]` to unclear items
   - Mark estimated sections

### Step 3: Output Summary

Display:
```
=== Vision Spec 作成完了 ===

Purpose: [簡潔な説明]

Target Users:
- [User 1]: [Goal]
- [User 2]: [Goal]

Main Journeys:
1. [Journey 1]: [概要]
2. [Journey 2]: [概要]

Spec: .specify/specs/overview/vision/spec.md

=== 曖昧点 ===
[NEEDS CLARIFICATION] マーク: {N} 箇所
- [List of ambiguous items]

推奨: `/spec-mesh clarify` で曖昧点を解消してください。
```

### Step 4: Preserve & Reset Input

If input file was used:
1. **Preserve input to spec directory:**
   ```bash
   node .claude/skills/spec-mesh/scripts/preserve-input.cjs vision
   ```
   - Saves to: `.specify/specs/overview/vision/input.md`

2. **Reset input file:**
   ```bash
   node .claude/skills/spec-mesh/scripts/reset-input.cjs vision
   ```

### Step 5: Update State

```bash
node .claude/skills/spec-mesh/scripts/state.cjs repo --set-vision-status draft --set-phase vision
```

### Step 6: Multi-Review (3観点並列レビュー)

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
   - すべてパス → Step 7 (Output Summary) へ
   - 曖昧点あり → `/spec-mesh clarify` を推奨
   - Critical 未解決 → 問題をリストし対応を促す

---

## Self-Check

- [ ] Read tool で入力ファイルを読み込んだか
- [ ] Bash tool で scaffold-spec.cjs を実行したか
- [ ] Write/Edit tool で spec を作成したか
- [ ] Example データ（社内在庫管理システム等）を使用していないか
- [ ] 曖昧点に `[NEEDS CLARIFICATION]` をマークしたか
- [ ] **Multi-Review を実行したか（3観点並列）**
- [ ] **Lint を実行したか**
- [ ] 次のステップを提示したか

---

## Output

- Vision spec: `.specify/specs/overview/vision/spec.md`
- 曖昧点レポート
- Next step: `/spec-mesh clarify` → `/spec-mesh design`

---

## Next Steps

**[HUMAN_CHECKPOINT]**
- [ ] Vision Spec の Purpose が課題/問題を正確に反映しているか
- [ ] Target Users と User Journeys が適切に定義されているか
- [ ] Scope (In/Out) が要件と一致しているか
- [ ] [NEEDS CLARIFICATION] マーカーの箇所を確認したか

承認後、次のステップへ進んでください。

| Condition | Command | Description |
|-----------|---------|-------------|
| 曖昧点がある場合 | `/spec-mesh clarify` | 曖昧点を 4問バッチで解消 |
| 曖昧点が解消済み | `/spec-mesh design` | Screen + Domain + Matrix 同時作成 |
