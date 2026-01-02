# Feature Workflow

Feature Spec を作成するワークフロー。Entry（SKILL.md）から呼び出される。

## Prerequisites

**新規作成モード:**
- Input ファイル（`.specify/input/add-input.md`）が読み込み済み
- Vision Spec が存在すること（必須）
- Domain Spec + Screen Spec が存在すること（推奨）

**Draft 詳細化モード:**
- Draft Spec（Status: Draft）が存在
- issue タイプから呼び出される

---

## Mode Detection

ワークフロー開始時にモードを判定：

```
Draft Spec が存在するか確認
    │
    ├─ Draft Spec あり（Status: Draft）
    │       └── **Draft 詳細化モード** → Step 0 から開始
    │
    └─ Draft Spec なし
            └── **新規作成モード** → Step 1 から開始
```

**Draft Spec の検出方法:**
```bash
# Issue body から Draft パスを抽出
# または Spec ファイルの Status を確認
grep -l "Status: Draft" .specify/specs/features/*/spec.md
```

---

## Todo Template

**IMPORTANT:** ワークフロー開始時に、以下の Todo を TodoWrite tool で作成すること。

### Draft 詳細化モード用
```
TodoWrite:
  todos:
    - content: "Step 0: Draft Spec 読み込み"
      status: "pending"
      activeForm: "Loading Draft Spec"
    - content: "Step 0.5: 空欄セクション特定・詳細 QA 生成"
      status: "pending"
      activeForm: "Generating detailed QA"
    - content: "Step 3: QA フォローアップ"
      status: "pending"
      activeForm: "Following up on QA"
    - content: "Step 4: Feature Spec 更新（Draft → Clarified）"
      status: "pending"
      activeForm: "Updating Feature Spec"
    ... (Step 5 以降は新規作成モードと同じ)
```

### 新規作成モード用
```
TodoWrite:
  todos:
    - content: "Step 1: コードベース分析"
      status: "pending"
      activeForm: "Analyzing codebase"
    - content: "Step 1.5: ワイヤーフレーム処理"
      status: "pending"
      activeForm: "Processing wireframes"
    - content: "Step 2: QA ドキュメント生成"
      status: "pending"
      activeForm: "Generating QA document"
    - content: "Step 3: QA フォローアップ"
      status: "pending"
      activeForm: "Following up on QA"
    - content: "Step 4: Feature Spec 作成"
      status: "pending"
      activeForm: "Creating Feature Spec"
    - content: "Step 5: Multi-Review 実行"
      status: "pending"
      activeForm: "Executing Multi-Review"
    - content: "Step 6: CLARIFY GATE チェック"
      status: "pending"
      activeForm: "Checking CLARIFY GATE"
    - content: "Step 7: Lint 実行"
      status: "pending"
      activeForm: "Running Lint"
    - content: "Step 8: サマリー・[HUMAN_CHECKPOINT]"
      status: "pending"
      activeForm: "Presenting summary"
    - content: "Step 9: GitHub Issue & ブランチ作成"
      status: "pending"
      activeForm: "Creating Issue and branch"
    - content: "Step 10: 入力保存"
      status: "pending"
      activeForm: "Preserving input"
```

---

## Steps

### Step 0: Draft Spec 読み込み（Draft 詳細化モードのみ）

**Draft 詳細化モードでのみ実行。新規作成モードはスキップ。**

1. **Draft Spec を読み込み:**
   ```
   Read tool: .specify/specs/features/{id}/spec.md
   ```

2. **Status が Draft であることを確認:**
   ```markdown
   Status: Draft
   ```

3. **記入済みセクションを確認:**
   - 基本情報（概要、目的、アクター）
   - Domain 参照（M-*, API-*）
   - Screen 参照（SCR-*）

4. **空欄セクションを特定:**
   - ユースケース詳細
   - 機能要件詳細
   - エラーハンドリング
   - 非機能要件

### Step 0.5: 空欄セクション特定・詳細 QA 生成（Draft 詳細化モードのみ）

Draft の空欄セクションに対応する QA を生成：

1. **空欄セクションから質問を生成:**

   | 空欄セクション | 生成する質問 |
   |---------------|-------------|
   | ユースケース詳細 | 「この機能の主要なユースケースは？」「エッジケースは？」 |
   | 機能要件詳細 | 「入力項目は？」「出力形式は？」「バリデーションは？」 |
   | エラーハンドリング | 「想定されるエラーは？」「エラー時の動作は？」 |
   | 非機能要件 | 「パフォーマンス要件は？」「同時アクセス数は？」 |

2. **QA ドキュメントを生成:**
   ```
   Write tool: .specify/specs/features/{id}/qa.md
   ```

3. **ユーザーに QA 回答を依頼:**
   ```
   === Draft 詳細化 QA ===

   Draft Spec の空欄セクションについて質問があります。
   .specify/specs/features/{id}/qa.md を確認し、回答してください。

   完了したら「QA 回答完了」と伝えてください。
   ```

---

**以下は新規作成モードで使用（Draft 詳細化モードは Step 3 へスキップ）**

---

### Step 1: Analyze Codebase（新規作成モードのみ）

- Identify existing patterns
- Find related components
- Note reusable code

### Step 1.5: ワイヤーフレーム処理（新規作成モードのみ）

> **参照:** [shared/_wireframe-processing.md](shared/_wireframe-processing.md)

Input にワイヤーフレームファイルが添付されている場合：

1. **ファイル検出:**
   ```
   Glob tool: .specify/input/wireframes/*
   ```

2. **処理実行:**
   - 画像/ファイルを読み込み（Read tool）
   - AI が内容を解釈
   - 構造化ワイヤーフレームを生成（ASCII + Components table）

3. **Screen Spec に統合:**
   - WF-SCR-* 形式で保存
   - 元ファイルを `.specify/assets/wireframes/` に保存

**Note:** ワイヤーフレームがない場合はスキップ。

### Step 2: QA ドキュメント生成（新規作成モードのみ）

> **参照:** [shared/_qa-generation.md](shared/_qa-generation.md)

1. Input の記入状況を分析
2. 未記入・不明瞭な項目を特定
3. AI の推測を生成
4. QA ドキュメントを生成:

```
Write tool: .specify/specs/features/{feature-id}/qa.md
  - 質問バンクから動的に生成（_qa-generation.md 参照）
  - Input から抽出した情報を埋め込み
```

5. ユーザーに QA 回答を依頼

### Step 3: QA フォローアップ

> **参照:** [shared/_qa-followup.md](shared/_qa-followup.md)

QA 回答を分析し、追加質問・提案確認を行う統合ステップ。

**3.1 回答分析:**
1. QA ドキュメントの回答を読み込み
2. 未回答項目をチェック
3. 回答内容を構造化

**3.2 追加質問（AskUserQuestion）:**
1. 未回答の [必須] があれば確認
2. 回答から派生する疑問点を確認
3. 矛盾点・曖昧点の解消

**3.3 提案確認（AskUserQuestion）:**
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
| P-FEAT-001 | バリデーション強化 | 採用 | セキュリティ要件 |

Spec 作成に進みます。
```

### Step 4: Create/Update Feature Spec

**新規作成モード:**

1. **Run scaffold:**
   ```bash
   node .claude/skills/nick-q/scripts/scaffold-spec.cjs --kind feature --id S-XXX-001 --title "{機能名}"
   ```

**Draft 詳細化モード:**

1. **Draft Spec を更新:**
   - 空欄セクションを QA 回答で埋める
   - Status を Draft → Clarified に変更
   ```markdown
   Status: Clarified
   ```

---

**両モード共通:**

2. **Spec-First: Overview Specs の先行更新**

   > **原則:** Feature Spec を書く前に、Screen/Domain Spec を先に更新する

   **2.1 Screen Spec の更新** (UI 変更がある場合)
   - Screen Index に status `Planned` で追加
   - または Modification Log に記録

   **2.2 Domain Spec の更新** (M-*/API-* 変更がある場合)
   - Case 1: 全て存在 → 参照のみ（更新不要）
   - Case 2: 新規必要 → Domain Spec に追加（status: `Planned`）
   - Case 3: 変更必要 → change ワークフローを推奨

3. **Fill spec sections from input**

4. **Impact Analysis (Case 2/3 の場合)**

   > **共通コンポーネント参照:** [shared/impact-analysis.md](shared/impact-analysis.md) を **STANDARD モード** で実行

5. **Update Domain Spec Feature Index**

6. **Update Cross-Reference Matrix**

7. **Record Changelog:**
   ```bash
   node .claude/skills/nick-q/scripts/changelog.cjs record \
     --feature S-XXX-001 \
     --type create \
     --description "Feature Spec 作成: {機能名}"
   ```

### Step 5: Multi-Review

Feature Spec の品質を担保するため Multi-Review を実行：

1. **Read review workflow:**
   ```
   Read tool: .claude/skills/nick-q/workflows/review.md
   ```

2. **Execute Multi-Review:**
   - 3 つの reviewer agent を並列で起動
   - フィードバック統合
   - AI 修正可能な問題を修正

3. **Handle results:**
   - すべてパス → Step 6 へ
   - 曖昧点あり → Step 6 でブロック
   - Critical 未解決 → 問題をリストし対応を促す

### Step 6: CLARIFY GATE チェック（必須）

**★ このステップはスキップ禁止 ★**

Multi-Review 後、Grep tool で `[NEEDS CLARIFICATION]` マーカーをカウント：

```
Grep tool:
  pattern: "\[NEEDS CLARIFICATION\]"
  path: .specify/specs/features/{id}/spec.md
  output_mode: count
```

**判定ロジック:**

```
clarify_count = [NEEDS CLARIFICATION] マーカー数

if clarify_count > 0:
    ┌─────────────────────────────────────────────────────────────┐
    │ ★ CLARIFY GATE: 曖昧点が {clarify_count} 件あります         │
    │                                                             │
    │ Plan に進む前に clarify ワークフロー が必須です。            │
    │                                                             │
    │ 「clarify を実行して」と依頼してください。                   │
    └─────────────────────────────────────────────────────────────┘
    → clarify ワークフロー を実行（必須）
    → clarify 完了後、Multi-Review からやり直し

else:
    → Step 7 (Lint) へ進む
```

**重要:** clarify_count > 0 の場合、Plan への遷移は禁止。

### Step 7: Run Lint

```bash
node .claude/skills/nick-q/scripts/spec-lint.cjs
```

### Step 8: Summary & [HUMAN_CHECKPOINT]

1. **Display Summary:**
   ```
   === Feature Spec 作成完了 ===

   Feature: {機能名}
   Spec: .specify/specs/features/{id}/spec.md

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
   - [ ] Feature Spec の User Stories が期待する動作を反映しているか
   - [ ] Functional Requirements が適切に定義されているか
   - [ ] M-*/API-* の参照/追加が正しいか

   承認後、GitHub Issue とブランチを作成します。
   ```

### Step 9: Create GitHub Issue & Branch

**[HUMAN_CHECKPOINT] 承認後に実行:**

1. **Create GitHub Issue:**
   ```bash
   gh issue create --title "[Feature] {機能名}" --body "..."
   ```

2. **Create Branch:**
   ```bash
   node .claude/skills/nick-q/scripts/branch.cjs --type feature --slug {slug} --issue {issue_num}
   ```

3. **Display result:**
   ```
   === Issue & Branch 作成完了 ===

   Issue: #{issue_num}
   Branch: feature/{issue_num}-{slug}

   次のステップ: plan ワークフロー へ進んでください。
   ```

### Step 10: Preserve Input

If input file was used:
```bash
node .claude/skills/nick-q/scripts/preserve-input.cjs add --feature {feature-dir}
```
- Saves to: `.specify/specs/features/{feature-dir}/input.md`

> **Note:** Input のリセットは PR マージ後に post-merge.cjs で自動実行されます。

---

## Self-Check

### 共通
- [ ] **TodoWrite で全ステップを登録したか**
- [ ] **モード判定を行ったか（Draft 詳細化 or 新規作成）**
- [ ] ワイヤーフレームを処理したか（ある場合）
- [ ] QA ドキュメントを生成したか
- [ ] QA フォローアップを実施したか（回答分析 + 追加質問 + 提案確認）
- [ ] Screen Spec を先に更新したか（Spec-First）
- [ ] M-*/API-* の Case 判定を行ったか
- [ ] **Impact Analysis を実行したか（Case 2/3 の場合）**
- [ ] **Multi-Review を実行したか（3観点並列）**
- [ ] **CLARIFY GATE をチェックしたか**
- [ ] spec-lint.cjs を実行したか
- [ ] **[HUMAN_CHECKPOINT] で承認を得たか**
- [ ] **TodoWrite で全ステップを completed にしたか**

### 新規作成モード
- [ ] scaffold-spec.cjs で spec を作成したか
- [ ] gh issue create を実行したか（承認後）
- [ ] branch.cjs でブランチを作成したか（承認後）
- [ ] Input を保存したか（リセットは PR マージ後）

### Draft 詳細化モード
- [ ] Draft Spec を読み込んだか
- [ ] 空欄セクションを特定したか
- [ ] 詳細 QA を生成したか
- [ ] Status を Draft → Clarified に更新したか

---

## Next Steps

| Condition | Workflow | Description |
|-----------|----------|-------------|
| CLARIFY GATE: BLOCKED | clarify | **必須** - 曖昧点を解消 |
| CLARIFY GATE: PASSED + 人間承認 | plan | 実装計画作成 |
