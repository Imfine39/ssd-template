# Design Workflow

Technical design phase. Creates Screen Spec + Domain Spec + Matrix simultaneously.

## Prerequisites

- Vision Spec should exist (warning if not)
- **★ Vision の CLARIFY GATE 通過必須**: Open Questions = 0

## Key Principle

> Screen と Domain を同時に作成することで、ID の相互参照が可能になり、整合性が保証される。

---

## Todo Template

**IMPORTANT:** ワークフロー開始時に、以下の Todo を TodoWrite tool で作成すること。

```
TodoWrite:
  todos:
    - content: "Step 1: 前提条件確認・Vision Spec 読み込み"
      status: "pending"
      activeForm: "Checking prerequisites"
    - content: "Step 2: 画面情報収集"
      status: "pending"
      activeForm: "Collecting screen information"
    - content: "Step 3: Feature 提案"
      status: "pending"
      activeForm: "Proposing features"
    - content: "Step 4: Screen + Domain Spec 同時作成"
      status: "pending"
      activeForm: "Creating Screen and Domain Specs"
    - content: "Step 5: Cross-Reference Matrix 作成"
      status: "pending"
      activeForm: "Creating Matrix"
    - content: "Step 6: Multi-Review 実行"
      status: "pending"
      activeForm: "Executing Multi-Review"
    - content: "Step 7: CLARIFY GATE チェック"
      status: "pending"
      activeForm: "Checking CLARIFY GATE"
    - content: "Step 8: Lint 実行"
      status: "pending"
      activeForm: "Running Lint"
    - content: "Step 9: Design Input 保存"
      status: "pending"
      activeForm: "Preserving Design Input"
    - content: "Step 10: Foundation Issue 作成"
      status: "pending"
      activeForm: "Creating Foundation Issue"
    - content: "Step 11: サマリー提示・状態更新"
      status: "pending"
      activeForm: "Presenting summary"
    - content: "Step 12: [HUMAN_CHECKPOINT] 提示"
      status: "pending"
      activeForm: "Presenting checkpoint"
```

---

## Steps

### Step 1: Check Prerequisites

1. **Check repo state:**
   ```bash
   node .claude/skills/spec-mesh/scripts/state.cjs query --repo
   ```
   - If Vision status not "approved/clarified" → Warning

2. **Check Vision Spec exists:**
   - Look for `.specify/specs/overview/vision/spec.md`
   - If not found → Recommend vision ワークフロー first

3. **Read Vision Spec (including Screen Hints):**
   ```
   Read tool: .specify/specs/overview/vision/spec.md
   ```

### Step 2: Screen Information Collection

1. **Check Vision Section 5 (Screen Hints)**
2. **If Screen Hints empty:**
   - Ask user for screen information
   - Required: 画面リスト、画面遷移

3. **Build Screen List with SCR-* IDs:**
   | SCR ID | Name | Description | Status |
   |--------|------|-------------|--------|
   | SCR-001 | Dashboard | メイン画面 | Planned |
   | ... | ... | ... | ... |

### Step 3: Feature Proposal

1. **Analyze Vision Journeys** → Extract Feature candidates
2. **Present to user for approval:**
   ```
   提案する Features:
   1. [x] S-AUTH-001: ユーザー認証
   2. [x] S-DASH-001: ダッシュボード表示
   3. [ ] S-REPORT-001: レポート出力（オプション）

   採用する Features を選択してください（番号をカンマ区切り）
   ```
3. **Create GitHub Issues for approved Features:**
   ```bash
   gh issue create --title "[Feature] {Feature名}" --body "..."
   ```

### Step 4: Simultaneous Screen + Domain Spec Creation

**4.1 Create Screen Spec:**
```bash
node .claude/skills/spec-mesh/scripts/scaffold-spec.cjs --kind screen --id S-SCREEN-001 --title "{Project} Screen Spec"
```

Fill:
- Section 1: Screen Index (SCR-* table)
- Section 2: Screen Transitions (遷移図)
- Section 3: Wireframes (各画面のレイアウト)
- Section 4: Design Tokens (共有スタイル)

**4.2 Create Domain Spec:**
```bash
node .claude/skills/spec-mesh/scripts/scaffold-spec.cjs --kind domain --id S-DOMAIN-001 --title "{Project} Domain Spec"
```

Fill:
- Section 1: Master Data (M-* definitions)
- Section 2: API Contracts (API-* definitions)
- Section 3: Business Rules (BR-*/VR-*/CR-*)
- Section 4: Feature Index (approved Features)

**4.3 Cross-reference:**
- Screen Spec: M-*/API-* columns in Screen Index
- Domain Spec: SCR-* references in API definitions

### Step 5: Create Cross-Reference Matrix

Create `.specify/specs/overview/matrix/cross-reference.json`:
```json
{
  "screens": {
    "SCR-001": { "masters": ["M-USER"], "apis": ["API-AUTH-*"] }
  },
  "features": {
    "S-AUTH-001": { "screens": ["SCR-001"], "masters": ["M-USER"], "apis": ["API-AUTH-*"] }
  }
}
```

Generate readable view:
```bash
node .claude/skills/spec-mesh/scripts/generate-matrix-view.cjs
```

### Step 6: Multi-Review (3観点並列レビュー)

Screen Spec と Domain Spec の品質を担保するため Multi-Review を実行：

1. **Read review workflow:**
   ```
   Read tool: .claude/skills/spec-mesh/workflows/review.md
   ```

2. **Execute Multi-Review for each spec:**
   - Screen Spec に対して 3 つの reviewer agent を並列実行
   - Domain Spec に対して 3 つの reviewer agent を並列実行
   - フィードバック統合
   - AI 修正可能な問題を修正

3. **Handle results:**
   - すべてパス → Step 7 へ
   - 曖昧点あり → Step 7 でブロック
   - Critical 未解決 → 問題をリストし対応を促す

### Step 7: CLARIFY GATE チェック（必須）

**★ このステップはスキップ禁止 ★**

Multi-Review 後、Grep tool で以下をカウント：

```
Grep tool (1): Screen Spec
  pattern: "\[NEEDS CLARIFICATION\]"
  path: .specify/specs/overview/screen/spec.md
  output_mode: count

Grep tool (2): Domain Spec
  pattern: "\[NEEDS CLARIFICATION\]"
  path: .specify/specs/overview/domain/spec.md
  output_mode: count
```

**判定ロジック:**

```
clarify_count = Screen Spec の [NEEDS CLARIFICATION] 数 + Domain Spec の [NEEDS CLARIFICATION] 数

if clarify_count > 0:
    ┌─────────────────────────────────────────────────────────────┐
    │ ★ CLARIFY GATE: 曖昧点が {clarify_count} 件あります         │
    │                                                             │
    │ 次のステップに進む前に clarify ワークフロー が必須です。     │
    │                                                             │
    │ 「clarify を実行して」と依頼してください。                   │
    └─────────────────────────────────────────────────────────────┘
    → clarify ワークフロー を実行（必須）
    → clarify 完了後、Multi-Review からやり直し

else:
    → Step 8 (Lint) へ進む
```

**重要:** clarify_count > 0 の場合、次のステップへの遷移は禁止。

### Step 8: Run Lint

```bash
node .claude/skills/spec-mesh/scripts/spec-lint.cjs
node .claude/skills/spec-mesh/scripts/validate-matrix.cjs
```

### Step 9: Preserve Design Input

If Vision input file was used (contains Part B screen information):
```bash
node .claude/skills/spec-mesh/scripts/preserve-input.cjs design
```
- Saves to: `.specify/specs/overview/domain/input.md`

### Step 10: Create Foundation Issue

```bash
gh issue create --title "[Foundation] S-FOUNDATION-001: 基盤実装" --body "..."
```

Foundation includes: 認証、DB接続、基本構造

### Step 11: Summary & Update State

1. **Update State:**
   ```bash
   node .claude/skills/spec-mesh/scripts/state.cjs repo --set-domain-status draft --set-screen-status draft --set-phase design
   ```

2. **Display Summary:**
   ```
   === Design 完了 ===

   Screen Spec: .specify/specs/overview/screen/spec.md
     - Screens: {N} 画面定義

   Domain Spec: .specify/specs/overview/domain/spec.md
     - Masters: {N} M-* 定義
     - APIs: {N} API-* 定義
     - Rules: {N} BR-*/VR-* 定義

   Matrix: .specify/specs/overview/matrix/cross-reference.json

   Feature Issues: {N} 件作成
   Foundation Issue: #{issue_num}

   === CLARIFY GATE ===
   [NEEDS CLARIFICATION]: {N} 箇所
   Status: {PASSED | BLOCKED}

   {if BLOCKED}
   ★ clarify ワークフロー を実行してください。
   {/if}
   ```

### Step 12: [HUMAN_CHECKPOINT]

**CLARIFY GATE が PASSED の場合のみ表示:**

```
=== [HUMAN_CHECKPOINT] ===
確認事項:
- [ ] Screen Spec の画面定義が要件を網羅しているか
- [ ] Domain Spec の M-*/API-* 定義が適切か
- [ ] Cross-Reference Matrix の整合性を確認したか

承認後、次のステップへ進んでください。
```

---

## Self-Check

- [ ] **TodoWrite で全ステップを登録したか**
- [ ] Vision Spec を読み込んだか
- [ ] Screen Spec を作成したか（SCR-* ID 付き）
- [ ] Domain Spec を作成したか（M-*/API-* 定義）
- [ ] Cross-Reference Matrix を作成したか
- [ ] Feature Issues を作成したか
- [ ] Foundation Issue を作成したか
- [ ] **Multi-Review を実行したか（3観点並列）**
- [ ] **CLARIFY GATE をチェックしたか**
- [ ] spec-lint + validate-matrix を実行したか
- [ ] Design Input を保存したか
- [ ] **TodoWrite で全ステップを completed にしたか**

---

## Next Steps

| Condition | Command | Description |
|-----------|---------|-------------|
| CLARIFY GATE: BLOCKED | clarify ワークフロー | **必須** - 曖昧点を解消 |
| CLARIFY GATE: PASSED + 人間承認 | issue ワークフロー | Foundation Issue から開始 |
| 追加機能を提案する場合 | featureproposal ワークフロー | 追加 Feature 提案 |
