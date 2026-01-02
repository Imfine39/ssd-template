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
    - content: "Step 4: QA フォローアップ"
      status: "pending"
      activeForm: "Following up on QA"
    - content: "Step 5: Vision Spec 作成"
      status: "pending"
      activeForm: "Creating Vision Spec"
    - content: "Step 6: Screen Spec 作成"
      status: "pending"
      activeForm: "Creating Screen Spec"
    - content: "Step 7: Domain Spec 作成"
      status: "pending"
      activeForm: "Creating Domain Spec"
    - content: "Step 8: Matrix 生成"
      status: "pending"
      activeForm: "Generating Matrix"
    - content: "Step 9: Multi-Review"
      status: "pending"
      activeForm: "Running Multi-Review"
    - content: "Step 10: CLARIFY GATE"
      status: "pending"
      activeForm: "Checking CLARIFY GATE"
    - content: "Step 11: [HUMAN_CHECKPOINT]"
      status: "pending"
      activeForm: "Awaiting approval"
    - content: "Step 12: Feature Drafts 生成"
      status: "pending"
      activeForm: "Generating Feature Drafts"
    - content: "Step 13: Feature Issues 作成"
      status: "pending"
      activeForm: "Creating Feature Issues"
    - content: "Step 14: Input 保存"
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

### Step 2: ワイヤーフレーム処理

> **参照:** [shared/_wireframe-processing.md](shared/_wireframe-processing.md)

Input または wireframes ディレクトリにワイヤーフレームファイルがある場合に処理。

1. **ファイル検出:**
   ```
   Glob tool: .specify/input/wireframes/*
   ```

2. **処理実行（ファイルがある場合）:**
   - 画像/ファイルを読み込み（Read tool）
   - AI が内容を解釈（レイアウト、コンポーネント、テキストラベル）
   - 構造化ワイヤーフレームを生成（ASCII + Components table + Interactions）

3. **アセット保存:**
   ```bash
   mkdir -p .specify/assets/wireframes/
   cp {input_file} .specify/assets/wireframes/{SCR-ID}-{descriptive-name}.{ext}
   ```

4. **Screen Spec への統合準備:**
   - WF-SCR-* 形式で構造化データを準備
   - Step 6 で Screen Spec に統合

**Note:** ワイヤーフレームがない場合はスキップ。テキスト説明のみでも Screen Spec は作成可能。

### Step 3: QA ドキュメント生成

> **参照:** [shared/_qa-generation.md](shared/_qa-generation.md)

1. Input の記入状況を分析
2. 未記入・不明瞭な項目を特定
3. AI の推測を生成
4. QA ドキュメントを生成:

```
Write tool: .specify/specs/overview/qa.md
  - 質問バンクから動的に生成（_qa-generation.md 参照）
  - Input から抽出した情報を埋め込み
```

5. ユーザーに QA 回答を依頼:

```
=== QA ドキュメントを生成しました ===

.specify/specs/overview/qa.md を確認し、
各項目に回答してください。

完了したら「QA 回答完了」と伝えてください。
```

### Step 4: QA フォローアップ

> **参照:** [shared/_qa-followup.md](shared/_qa-followup.md)

QA 回答を分析し、追加質問・提案確認を行う統合ステップ。

**4.1 回答分析:**
1. QA ドキュメントの回答を読み込み
2. 未回答項目をチェック
3. 回答内容を構造化

**4.2 追加質問（AskUserQuestion）:**
1. 未回答の [必須] があれば確認
2. 回答から派生する疑問点を確認
3. 矛盾点・曖昧点の解消

**4.3 提案確認（AskUserQuestion）:**
> **参照:** [shared/_professional-proposals.md](shared/_professional-proposals.md) の観点・チェックリスト

1. 10 観点から追加提案を生成
2. 重要な提案は AskUserQuestion で確認
3. 提案の採否を記録（理由付き）

**出力:**
```
=== QA フォローアップ完了 ===

【回答状況】
- [必須]: 5/5 (100%)
- [確認]: 4/4 (100%)
- [選択]: 2/2 (100%)

【追加質問】
- 派生質問: 2 件 → 回答済み

【提案の採否】
| ID | 提案 | 採否 | 理由 |
|----|------|------|------|
| P-SETUP-001 | 検索機能追加 | 採用 | MVP に必要 |
| P-SETUP-002 | 権限管理 | 採用 | セキュリティ要件 |

Spec 作成に進みます。
```

### Step 5: Vision Spec 作成

```bash
node .claude/skills/nick-q/scripts/scaffold-spec.cjs --kind vision --id vision --title "{プロジェクト名}"
```

QA 回答を元に各セクションを記入：

| Vision Spec Section | 情報源 |
|--------------------|--------|
| 1. Purpose | QA Q1.1-Q1.3 |
| 2. Target Users | QA Q1.2 |
| 3. Feature Hints | QA Q2.1-Q2.2 + 採用された提案 |
| 4. Non-functional Requirements | QA Section 5 |

### Step 6: Screen Spec 作成

```bash
node .claude/skills/nick-q/scripts/scaffold-spec.cjs --kind screen --id screen --title "Screen Spec"
```

QA Q3.1-Q3.2 を元に画面を定義：

```markdown
## 3. Screen Index

| SCR-ID | 画面名 | Status | Description |
|--------|--------|--------|-------------|
| SCR-001 | {画面名} | Planned | {説明} |
```

**ワイヤーフレーム統合（Step 2 で処理した場合）:**

各画面の詳細セクションに構造化ワイヤーフレームを追加：

```markdown
### SCR-001: {画面名}

#### Wireframe: WF-SCR-001

**Source:** `.specify/assets/wireframes/SCR-001-original.png`
**Interpreted:** {date}
**Status:** Initial

**Layout Structure:**
[ASCII art layout]

**Components:**
| ID | Type | Location | Description | Behavior |
|----|------|----------|-------------|----------|
| WF-SCR-001-HDR | Header | top | ... | 固定表示 |

**Interactions:**
| Trigger | Component | Action | Target |
```

> **参照:** [templates/screen-spec.md](../templates/screen-spec.md) の Wireframe セクション

### Step 7: Domain Spec 作成

```bash
node .claude/skills/nick-q/scripts/scaffold-spec.cjs --kind domain --id domain --title "Domain Spec"
```

QA Q4.1-Q4.2 を元にエンティティを定義：

```markdown
## 3. Masters

### 3.1 M-{ENTITY}: {エンティティ名}

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | 主キー |
```

### Step 8: Cross-Reference Matrix 生成

```bash
node .claude/skills/nick-q/scripts/generate-matrix-view.cjs
```

Matrix を検証：
```bash
node .claude/skills/nick-q/scripts/matrix-ops.cjs validate
```

### Step 9: Multi-Review

> **参照:** [review.md](review.md)

3 つの reviewer agent を並列で起動：
- Reviewer A: 構造・形式
- Reviewer B: 内容・整合性
- Reviewer C: 完全性・網羅性

AI 修正可能な問題を修正。

### Step 10: CLARIFY GATE

> **参照:** [shared/_clarify-gate.md](shared/_clarify-gate.md)

```
Grep tool:
  pattern: "\[NEEDS CLARIFICATION\]"
  path: .specify/specs/overview/
  output_mode: count
```

| 結果 | 判定 | アクション |
|------|------|----------|
| > 0 | BLOCKED | clarify ワークフロー → Step 9 へ戻る |
| = 0 | PASSED | Step 11 へ |

### Step 11: [HUMAN_CHECKPOINT]

```
=== Project Setup 完了 ===

作成された Spec:
- Vision: .specify/specs/overview/vision/spec.md
- Screen: .specify/specs/overview/screen/spec.md
- Domain: .specify/specs/overview/domain/spec.md
- Matrix: .specify/specs/overview/matrix/cross-reference.md

=== [HUMAN_CHECKPOINT] ===
確認事項:
- [ ] Vision Spec の目的・スコープが適切か
- [ ] Screen Spec の画面構成が要件を満たすか
- [ ] Domain Spec のエンティティ定義が適切か
- [ ] Feature Hints の優先順位が正しいか

承認後、Feature Drafts と Issues を作成します。
```

### Step 12: Feature Drafts 生成

Vision Spec Section 3 (Feature Hints) から各機能の Draft Spec を生成。

**Draft Spec の内容:**

| セクション | 状態 | 説明 |
|-----------|------|------|
| 基本情報 | 記入済み | 概要、目的、アクター |
| Domain 参照 | 記入済み | M-*, API-* への参照（Domain Spec から抽出） |
| Screen 参照 | 記入済み | SCR-* への参照（Screen Spec から抽出） |
| ユースケース詳細 | 空欄 | issue タイプで詳細化 |
| 機能要件詳細 | 空欄 | issue タイプで詳細化 |
| エラーハンドリング | 空欄 | issue タイプで詳細化 |
| 非機能要件 | 空欄 | issue タイプで詳細化 |

**生成処理:**

```bash
# 各機能について Draft を生成
node .claude/skills/nick-q/scripts/scaffold-spec.cjs --kind feature --id "{S-PREFIX-NNN}" --title "{機能名}" --status Draft
```

**Draft 生成後の構造:**

```
.specify/specs/features/
├── S-FEAT-001/
│   └── spec.md  (Status: Draft)
├── S-FEAT-002/
│   └── spec.md  (Status: Draft)
└── ...
```

**Draft Spec のテンプレート補完:**

Draft 生成後、以下の情報を Input と Overview Specs から補完：

1. **基本情報:** Input の機能概要から
2. **Domain 参照:** Domain Spec の関連 M-*/API-* を参照として記入
3. **Screen 参照:** Screen Spec の関連 SCR-* を参照として記入
4. **空欄セクション:** プレースホルダーを配置し、issue ワークフローで詳細化することを明記

```markdown
## 4. Use Cases

[この機能の詳細なユースケースは issue ワークフローで詳細化されます]

### UC-{ID}-001: {ユースケース名}
<!-- issue ワークフローで記入 -->
```

### Step 13: Feature Issues 作成

Vision Spec Section 3 (Feature Hints) から GitHub Issues を作成。
**重要:** Issue body に Draft Spec のパスを記載する。

```bash
gh issue create \
  --title "[Feature] {機能名}" \
  --body "$(cat <<'EOF'
## 概要
{機能の説明}

## Draft Spec
Draft Spec: .specify/specs/features/{S-PREFIX-NNN}/spec.md

## Status
- [ ] Draft Spec 詳細化（issue ワークフロー）
- [ ] Plan 作成
- [ ] 実装
- [ ] テスト
- [ ] PR マージ
EOF
)" \
  --label "feature"
```

**Issue 作成後の確認:**

```
=== Feature Issues 作成完了 ===

| Issue # | 機能名 | Draft Spec |
|---------|--------|------------|
| #1 | {機能名1} | .specify/specs/features/S-FEAT-001/spec.md |
| #2 | {機能名2} | .specify/specs/features/S-FEAT-002/spec.md |
| ... | ... | ... |

各 Issue から開発を開始できます。
「Issue #N を実装して」と依頼してください。
```

### Step 14: Input 保存

```bash
node .claude/skills/nick-q/scripts/preserve-input.cjs project-setup
```

> **Note:** Input のリセットは PR マージ後に post-merge.cjs で自動実行されます。
> ワークフロー完了時点ではリセットしません。

---

## Self-Check

- [ ] **TodoWrite で全ステップを登録したか**
- [ ] Input ファイルを読み込んだか
- [ ] ワイヤーフレームを処理したか（ある場合）
- [ ] QA ドキュメントを生成したか
- [ ] QA フォローアップを実施したか（回答分析 + 追加質問 + 提案確認）
- [ ] Vision Spec を作成したか
- [ ] Screen Spec を作成したか
- [ ] Domain Spec を作成したか
- [ ] Matrix を生成・検証したか
- [ ] Multi-Review を実行したか
- [ ] CLARIFY GATE をチェックしたか
- [ ] [HUMAN_CHECKPOINT] で承認を得たか
- [ ] **Feature Drafts を生成したか（Status: Draft）**
- [ ] **Feature Issues を作成したか（Draft パスを記載）**
- [ ] Input を保存したか（リセットは PR マージ後）
- [ ] **TodoWrite で全ステップを completed にしたか**

---

## Next Steps

| Condition | Workflow | Description |
|-----------|----------|-------------|
| Feature 実装開始 | issue タイプ（SKILL.md Entry） | Draft Spec の詳細化 → Plan → 実装 |
| Spec 変更が必要 | change タイプ（SKILL.md Entry） | Vision/Screen/Domain 変更 |

> **Note:** 「Issue #N を実装して」と依頼すると、SKILL.md の issue タイプ処理が開始されます。
> Draft Spec がある場合は詳細化、Clarified Spec がある場合は Plan に進みます。
