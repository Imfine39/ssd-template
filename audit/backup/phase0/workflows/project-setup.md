# Project Setup Workflow

新規プロジェクト開始のエントリーポイント。Vision + Screen + Domain Spec を一括作成。

## Prerequisites

- 新規プロジェクト（既存の Vision Spec がない）
- `.specify/input/project-setup-input.md` が記入済み（推奨）

---

## Todo Template

**IMPORTANT:** ワークフロー開始時に、以下の Todo を TodoWrite tool で作成すること。

```
TodoWrite:
  todos:
    - content: "Step 1: Input 読み込み"
      status: "pending"
      activeForm: "Reading input"
    - content: "Step 2: ワイヤーフレーム分析"
      status: "pending"
      activeForm: "Analyzing wireframes"
    - content: "Step 3: QA ドキュメント生成"
      status: "pending"
      activeForm: "Generating QA document"
    - content: "Step 4: QA 回答分析"
      status: "pending"
      activeForm: "Analyzing QA responses"
    - content: "Step 5: AI SIer 提案"
      status: "pending"
      activeForm: "Making professional proposals"
    - content: "Step 6: Vision Spec 作成"
      status: "pending"
      activeForm: "Creating Vision Spec"
    - content: "Step 7: Screen Spec 作成"
      status: "pending"
      activeForm: "Creating Screen Spec"
    - content: "Step 8: Domain Spec 作成"
      status: "pending"
      activeForm: "Creating Domain Spec"
    - content: "Step 9: Matrix 生成"
      status: "pending"
      activeForm: "Generating Matrix"
    - content: "Step 10: Multi-Review"
      status: "pending"
      activeForm: "Running Multi-Review"
    - content: "Step 11: CLARIFY GATE"
      status: "pending"
      activeForm: "Checking CLARIFY GATE"
    - content: "Step 12: [HUMAN_CHECKPOINT]"
      status: "pending"
      activeForm: "Awaiting approval"
    - content: "Step 13: Feature Issues 作成"
      status: "pending"
      activeForm: "Creating Feature Issues"
    - content: "Step 14: Input 保存・リセット"
      status: "pending"
      activeForm: "Preserving input"
```

---

## Steps

### Step 1: Input 読み込み

```
Read tool: .specify/input/project-setup-input.md
```

**抽出する情報:**
| Input セクション | 抽出先 |
|-----------------|--------|
| Part A: プロジェクト概要 | Vision Spec Section 1-2 |
| Part B: 主要機能 | Vision Spec Section 3 (Feature Hints) |
| Part C: 画面イメージ | Screen Spec |
| Part D: データ項目 | Domain Spec |
| Part E: 非機能要件 | Vision Spec Section 4 |

### Step 2: ワイヤーフレーム分析

```
Glob tool: .specify/assets/wireframes/*
```

ファイルがあれば：
1. 画像を読み込み（Read tool）
2. 画面構成を抽出
3. UI 要素を特定
4. Screen Spec の参考情報として記録

### Step 3: QA ドキュメント生成

> **参照:** [shared/_qa-generation.md](shared/_qa-generation.md)

1. Input の記入状況を分析
2. 未記入・不明瞭な項目を特定
3. AI の推測を生成
4. 提案事項を生成（_professional-proposals.md 参照）
5. QA ドキュメントを生成:

```
Write tool: .specify/qa/project-setup-qa.md
  - 基づくテンプレート: templates/qa/project-setup-qa.md
  - Input から抽出した情報を埋め込み
```

6. ユーザーに QA 回答を依頼:

```
=== QA ドキュメントを生成しました ===

.specify/qa/project-setup-qa.md を確認し、
各項目に回答してください。

完了したら「QA 回答完了」と伝えてください。
```

### Step 4: QA 回答分析

> **参照:** [shared/_qa-analysis.md](shared/_qa-analysis.md)

1. QA ドキュメントの回答を読み込み
2. 未回答項目をチェック
3. 未回答の [必須] があれば AskUserQuestion で確認
4. [確認] で「いいえ」の項目を修正
5. [提案] の採否を記録

### Step 5: AI SIer 提案

> **参照:** [shared/_professional-proposals.md](shared/_professional-proposals.md)

QA 回答を踏まえた追加提案：
- 機能の過不足
- セキュリティ考慮
- UX 改善
- スケーラビリティ

重要な提案は AskUserQuestion で確認。

### Step 6: Vision Spec 作成

```bash
node .claude/skills/spec-mesh/scripts/scaffold-spec.cjs --kind vision --id vision --title "{プロジェクト名}"
```

QA 回答を元に各セクションを記入：

| Vision Spec Section | 情報源 |
|--------------------|--------|
| 1. Purpose | QA Q1.1-Q1.3 |
| 2. Target Users | QA Q1.2 |
| 3. Feature Hints | QA Q2.1-Q2.2 + 採用された提案 |
| 4. Non-functional Requirements | QA Section 5 |

### Step 7: Screen Spec 作成

```bash
node .claude/skills/spec-mesh/scripts/scaffold-spec.cjs --kind screen --id screen --title "Screen Spec"
```

QA Q3.1-Q3.2 を元に画面を定義：

```markdown
## 3. Screen Index

| SCR-ID | 画面名 | Status | Description |
|--------|--------|--------|-------------|
| SCR-001 | {画面名} | Planned | {説明} |
```

### Step 8: Domain Spec 作成

```bash
node .claude/skills/spec-mesh/scripts/scaffold-spec.cjs --kind domain --id domain --title "Domain Spec"
```

QA Q4.1-Q4.2 を元にエンティティを定義：

```markdown
## 3. Masters

### 3.1 M-{ENTITY}: {エンティティ名}

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | 主キー |
```

### Step 9: Cross-Reference Matrix 生成

```bash
node .claude/skills/spec-mesh/scripts/generate-matrix-view.cjs
```

Matrix を検証：
```bash
node .claude/skills/spec-mesh/scripts/matrix-ops.cjs validate
```

### Step 10: Multi-Review

> **参照:** [review.md](review.md)

3 つの reviewer agent を並列で起動：
- Reviewer A: 構造・形式
- Reviewer B: 内容・整合性
- Reviewer C: 完全性・網羅性

AI 修正可能な問題を修正。

### Step 11: CLARIFY GATE

> **参照:** [shared/_clarify-gate.md](shared/_clarify-gate.md)

```
Grep tool:
  pattern: "\[NEEDS CLARIFICATION\]"
  path: .specify/specs/overview/
  output_mode: count
```

| 結果 | 判定 | アクション |
|------|------|----------|
| > 0 | BLOCKED | clarify ワークフロー → Step 10 へ戻る |
| = 0 | PASSED | Step 12 へ |

### Step 12: [HUMAN_CHECKPOINT]

```
=== Project Setup 完了 ===

作成された Spec:
- Vision: .specify/specs/overview/vision/spec.md
- Screen: .specify/specs/overview/screen/spec.md
- Domain: .specify/specs/overview/domain/spec.md
- Matrix: .specify/matrix/cross-reference.md

=== [HUMAN_CHECKPOINT] ===
確認事項:
- [ ] Vision Spec の目的・スコープが適切か
- [ ] Screen Spec の画面構成が要件を満たすか
- [ ] Domain Spec のエンティティ定義が適切か
- [ ] Feature Hints の優先順位が正しいか

承認後、Feature Issues を作成します。
```

### Step 13: Feature Issues 作成

Vision Spec Section 3 (Feature Hints) から GitHub Issues を作成：

```bash
gh issue create --title "[Feature] {機能名}" --body "{説明}" --label "feature"
```

Issue 作成後、ユーザーに一覧を表示。

### Step 14: Input 保存・リセット

```bash
node .claude/skills/spec-mesh/scripts/preserve-input.cjs project-setup
node .claude/skills/spec-mesh/scripts/reset-input.cjs project-setup
```

---

## Self-Check

- [ ] **TodoWrite で全ステップを登録したか**
- [ ] Input ファイルを読み込んだか
- [ ] QA ドキュメントを生成したか
- [ ] QA 回答を分析したか
- [ ] AI SIer 提案を行ったか
- [ ] Vision Spec を作成したか
- [ ] Screen Spec を作成したか
- [ ] Domain Spec を作成したか
- [ ] Matrix を生成・検証したか
- [ ] Multi-Review を実行したか
- [ ] CLARIFY GATE をチェックしたか
- [ ] [HUMAN_CHECKPOINT] で承認を得たか
- [ ] Feature Issues を作成したか
- [ ] Input を保存・リセットしたか
- [ ] **TodoWrite で全ステップを completed にしたか**

---

## Next Steps

| Condition | Workflow | Description |
|-----------|----------|-------------|
| Feature 実装開始 | issue | Issue から Feature Spec 作成 |
| Spec 変更が必要 | change | Vision/Screen/Domain 変更 |
