# Fix Workflow

Entry point for bug fixes. Creates Issue → Branch → Fix Spec (調査報告書).

## Prerequisites

- None (bugs can happen anytime)

## Quick Mode

For urgent fixes, use `--quick` flag:
```
「ログインできないバグを直して」
```

## Quick Input

**Input file:** `.specify/input/fix-input.md`

Required fields:
- 何が起きているか (non-empty)
- 期待する動作 (non-empty)

---

## Todo Template

**IMPORTANT:** ワークフロー開始時に、以下の Todo を TodoWrite tool で作成すること。

```
TodoWrite:
  todos:
    - content: "Step 1: 入力収集"
      status: "pending"
      activeForm: "Collecting input"
    - content: "Step 2: 不明点確認"
      status: "pending"
      activeForm: "Clarifying details"
    - content: "Step 3: 原因調査"
      status: "pending"
      activeForm: "Investigating root cause"
    - content: "Step 4: Fix Spec 作成"
      status: "pending"
      activeForm: "Creating Fix Spec"
    - content: "Step 5: Multi-Review 実行"
      status: "pending"
      activeForm: "Executing Multi-Review"
    - content: "Step 6: SPEC GATE チェック"
      status: "pending"
      activeForm: "Checking SPEC GATE"
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

### Step 1: Input Collection

1. **Check Quick Mode:**
   - If ARGUMENTS contains `--quick` → Skip to Step 1.3
   - Otherwise → Read input file

2. **Read input file:**
   ```
   Read tool: .specify/input/fix-input.md
   ```

3. **Extract:**
   | Input | Target |
   |-------|--------|
   | 何が起きているか | Issue Body, Fix Spec Section 1 |
   | 期待する動作 | Issue Body, Fix Spec Section 1 |
   | 再現手順 | Issue Body, Fix Spec Section 1 |
   | 影響範囲 | Fix Spec Section 2 |
   | 緊急度 | Issue label |

### Step 2: 不明点確認（簡易 AskUserQuestion）

> **Note:** fix ワークフローは QA ドキュメントを使用せず、必要な情報を直接 AskUserQuestion で確認します。

**確認項目チェックリスト:**

| 項目 | 必須 | 確認方法 |
|------|------|---------|
| 問題の症状 | 必須 | Input から抽出、不明なら質問 |
| 再現手順 | 必須 | Input から抽出、不明なら質問 |
| 期待動作 | 必須 | Input から抽出、不明なら質問 |
| 発生頻度 | 推奨 | 常に・たまに・特定条件 |
| 緊急度 | 推奨 | 本番障害・業務支障・軽微 |

**不明点がある場合のみ AskUserQuestion:**

```
AskUserQuestion:
  questions:
    - question: "このバグはどのくらいの頻度で発生しますか？"
      header: "発生頻度"
      options:
        - label: "常に発生（100%）"
          description: "毎回必ず再現する"
        - label: "高頻度（50%以上）"
          description: "かなりの確率で発生"
        - label: "低頻度（50%未満）"
          description: "たまに発生"
        - label: "特定条件でのみ"
          description: "特定の操作・データで発生"
      multiSelect: false
    - question: "このバグの緊急度を教えてください"
      header: "緊急度"
      options:
        - label: "緊急（本番障害）"
          description: "今すぐ対応が必要"
        - label: "高（業務に支障）"
          description: "早急に対応が必要"
        - label: "中（回避策あり）"
          description: "ワークアラウンドで対応可能"
        - label: "低（軽微）"
          description: "余裕があるときに対応"
      multiSelect: false
```

**出力:**
```
=== 不明点確認完了 ===

【収集した情報】
- 症状: {抽出した症状}
- 再現手順: {抽出した手順}
- 期待動作: {抽出した期待動作}
- 発生頻度: {確認した頻度}
- 緊急度: {確認した緊急度}

原因調査に進みます。
```

### Step 3: Investigate Root Cause

Use codebase exploration to:
- Identify affected files
- Trace error path
- Find root cause
- Assess impact scope

Document findings in Fix Spec.

### Step 4: Create Fix Spec

1. **Run scaffold:**
   ```bash
   node .claude/skills/nick-q/scripts/scaffold-spec.cjs --kind fix --id F-XXX-001 --title "{バグ概要}"
   ```

2. **Fill sections:**
   - Section 1: Problem Description (症状、再現手順、期待動作)
   - Section 2: Root Cause Analysis (原因、影響範囲)
   - Section 3: Proposed Fix (修正方針、影響するファイル)
   - Section 4: Verification Plan (テスト方法)

3. **Spec-First: Overview Specs の先行更新**

   > **原則:** Fix Spec を書く前に、影響のある Screen/Domain Spec を先に更新する

   **3.1 Screen Spec の更新** (UI に影響がある場合)
   - Screen Modification Log に status `Planned` で追加

   **3.2 Domain Spec の更新** (M-*/API-* に影響がある場合)
   - Case 1: 既存のまま使用 → 参照のみ
   - Case 2: 新規 API/Master が必要 → Domain Spec に追加（status: `Planned`）
   - Case 3: 既存の変更が必要 → **[PENDING OVERVIEW CHANGE] マーカーを追加**

   **Case 3 の詳細手順:**
   ```markdown
   <!-- Fix Spec 内 -->
   - {対象ID}: {既存の説明}
     - [PENDING OVERVIEW CHANGE: {対象ID}]
       - 変更: {変更内容の概要}
       - 理由: {このバグ修正で必要な理由}
   ```

   > **Note:** 実際の Overview 変更は SPEC GATE で処理。ここでは発見と記録のみ。
   > 詳細は [spec-gate-design.md](../guides/spec-gate-design.md) 参照。

### Step 5: Multi-Review (3観点並列レビュー)

Fix Spec の品質を担保するため Multi-Review を実行：

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

### Step 6: SPEC GATE チェック（必須）

**★ このステップはスキップ禁止 ★**

> **共通コンポーネント参照:** [shared/_spec-gate.md](shared/_spec-gate.md) を実行

Multi-Review 後、以下のマーカーをカウント：

```
Grep tool (並列実行):
  1. pattern: "\[NEEDS CLARIFICATION\]"
     path: .specify/specs/fixes/{id}/spec.md
     output_mode: count

  2. pattern: "\[PENDING OVERVIEW CHANGE: [^\]]+\]"
     path: .specify/specs/fixes/{id}/spec.md
     output_mode: count

  3. pattern: "\[DEFERRED:[^\]]+\]"
     path: .specify/specs/fixes/{id}/spec.md
     output_mode: count
```

**判定ロジック:**

```
clarify_count = [NEEDS CLARIFICATION] マーカー数
overview_count = [PENDING OVERVIEW CHANGE] マーカー数
deferred_count = [DEFERRED] マーカー数

if clarify_count > 0:
    ┌─────────────────────────────────────────────────────────────┐
    │ ★ SPEC GATE: BLOCKED_CLARIFY                                │
    │                                                             │
    │ [NEEDS CLARIFICATION]: {clarify_count} 件                   │
    │                                                             │
    │ 実装に進む前に clarify ワークフロー が必須です。             │
    └─────────────────────────────────────────────────────────────┘
    → clarify ワークフロー を実行（必須）
    → clarify 完了後、Multi-Review からやり直し

elif overview_count > 0:
    ┌─────────────────────────────────────────────────────────────┐
    │ ★ SPEC GATE: BLOCKED_OVERVIEW                               │
    │                                                             │
    │ [PENDING OVERVIEW CHANGE]: {overview_count} 件              │
    │                                                             │
    │ Overview Spec への変更が必要です。                          │
    └─────────────────────────────────────────────────────────────┘
    → Overview Change サブワークフロー を実行
    → 参照: shared/_overview-change.md
    → 完了後、Multi-Review からやり直し

elif deferred_count > 0:
    → PASSED_WITH_DEFERRED
    → [HUMAN_CHECKPOINT] でリスク確認後、Step 7 へ

else:
    → PASSED
    → Step 7 (Lint) へ進む
```

**重要:** BLOCKED の場合、実装への遷移は禁止。

### Step 7: Run Lint

```bash
node .claude/skills/nick-q/scripts/spec-lint.cjs
```

### Step 8: Summary & [HUMAN_CHECKPOINT]

1. **Display Summary:**
   ```
   === Fix Spec 作成完了 ===

   Bug: {概要}
   Spec: .specify/specs/fixes/{id}/spec.md

   Root Cause: {原因の要約}
   Impact: {影響範囲}

   === SPEC GATE ===
   [NEEDS CLARIFICATION]: {N} 箇所
   [PENDING OVERVIEW CHANGE]: {M} 箇所
   [DEFERRED]: {D} 箇所
   Status: {PASSED | PASSED_WITH_DEFERRED | BLOCKED_CLARIFY | BLOCKED_OVERVIEW}

   {if BLOCKED_CLARIFY}
   ★ clarify ワークフロー を実行してください。
   {/if}

   {if BLOCKED_OVERVIEW}
   ★ Overview Change サブワークフローを実行します。
   {/if}
   ```

2. **SPEC GATE が PASSED/PASSED_WITH_DEFERRED の場合のみ:**
   ```
   === [HUMAN_CHECKPOINT] ===
   確認事項:
   - [ ] Root Cause Analysis が正確か
   - [ ] Proposed Fix が問題を解決するか
   - [ ] 影響範囲が適切に評価されているか
   - [ ] Verification Plan が十分か

   承認後、GitHub Issue とブランチを作成します。
   ```

### Step 9: Create GitHub Issue & Branch

**[HUMAN_CHECKPOINT] 承認後に実行:**

1. **Create GitHub Issue:**
   ```bash
   gh issue create --title "[Bug] {概要}" --body "..." --label "bug"
   ```

2. **Create Branch:**
   ```bash
   node .claude/skills/nick-q/scripts/branch.cjs --type fix --slug {slug} --issue {issue_num}
   ```

3. **Display result:**
   ```
   === Issue & Branch 作成完了 ===

   Issue: #{issue_num}
   Branch: fix/{issue_num}-{slug}

   次のステップ: Severity に応じて plan または implement へ進んでください。
   ```

### Step 10: Preserve Input

If input file was used:
```bash
node .claude/skills/nick-q/scripts/preserve-input.cjs fix --fix {fix-dir}
```
- Saves to: `.specify/specs/fixes/{fix-dir}/input.md`

> **Note:** Input のリセットは PR マージ後に post-merge.cjs で自動実行されます。

---

## Severity Classification（修正規模の判定）

Fix Spec 作成後、以下の基準で修正規模を判定する：

### Trivial（軽微）

以下の **すべて** を満たす場合：

| 条件 | チェック |
|------|----------|
| 変更ファイル数 | ≤ 3 ファイル |
| 変更行数 | ≤ 30 行 |
| Root Cause | 明確（typo、null チェック漏れ、設定ミス等） |
| 影響範囲 | 局所的（単一機能内） |
| テスト | 既存テストで検証可能 or テスト追加不要 |
| ロールバックリスク | 低（簡単に戻せる） |

**例:**
- null チェック漏れによる例外
- 設定値の typo
- CSS の表示崩れ
- 単純な条件分岐ミス

### Standard（標準）

Trivial の条件を **いずれか** 満たさない場合：

| 条件 | 例 |
|------|-----|
| 変更ファイル数 | > 3 ファイル |
| 変更行数 | > 30 行 |
| Root Cause | 複雑（設計問題、競合状態、データ不整合等） |
| 影響範囲 | 広域（複数機能、共有コンポーネント） |
| テスト | 新規テスト作成が必要 |
| ロールバックリスク | 高（データ影響、依存関係） |

**例:**
- データ競合による不整合
- 複数コンポーネントに跨るバグ
- パフォーマンス問題
- セキュリティ脆弱性

### 判定出力

```
=== Severity Classification ===

Root Cause: {概要}

チェック結果:
- [x] 変更ファイル数: 2 (≤ 3)
- [x] 変更行数: 15 (≤ 30)
- [x] Root Cause: 明確（null チェック漏れ）
- [x] 影響範囲: 局所的
- [x] テスト: 既存テストで検証可能
- [x] ロールバックリスク: 低

判定: Trivial → implement ワークフロー へ直接進む
```

```
=== Severity Classification ===

Root Cause: {概要}

チェック結果:
- [x] 変更ファイル数: 5 (> 3)
- [ ] 変更行数: 80 (> 30)
- [ ] Root Cause: 複雑（データ競合）
- [ ] 影響範囲: 広域
- [x] テスト: 新規テスト必要
- [ ] ロールバックリスク: 高

判定: Standard → plan ワークフロー で計画を作成
```

---

## Self-Check

- [ ] **TodoWrite で全ステップを登録したか**
- [ ] Read tool で入力ファイルを読み込んだか（--quick 以外）
- [ ] 不明点を AskUserQuestion で確認したか
- [ ] 原因調査を実施したか
- [ ] Fix Spec に Root Cause を記載したか
- [ ] **Impact Analysis を実行したか（Screen/Domain 変更時）** → [shared/impact-analysis.md](shared/impact-analysis.md)
- [ ] **Severity Classification を実行したか（Trivial/Standard）**
- [ ] **Multi-Review を実行したか（3観点並列）**
- [ ] **SPEC GATE をチェックしたか（CLARIFY + OVERVIEW）**
- [ ] **BLOCKED_OVERVIEW の場合、Overview Change を実行したか**
- [ ] spec-lint.cjs を実行したか
- [ ] **[HUMAN_CHECKPOINT] で承認を得たか**
- [ ] gh issue create を実行したか（承認後）
- [ ] branch.cjs でブランチを作成したか（承認後）
- [ ] Input を保存したか（リセットは PR マージ後）
- [ ] **TodoWrite で全ステップを completed にしたか**

---

## Next Steps

| Condition | Workflow | Description |
|-----------|----------|-------------|
| SPEC GATE: BLOCKED_CLARIFY | clarify | **必須** - 曖昧点を解消 |
| SPEC GATE: BLOCKED_OVERVIEW | _overview-change.md | **必須** - Overview 変更を処理 |
| SPEC GATE: PASSED + Trivial | implement | 直接修正 |
| SPEC GATE: PASSED + Standard | plan | 修正計画作成 |
