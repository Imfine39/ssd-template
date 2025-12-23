# Design Workflow

Technical design phase. Creates Screen Spec + Domain Spec + Matrix simultaneously.

## Prerequisites

- Vision Spec should exist (warning if not)

## Key Principle

> Screen と Domain を同時に作成することで、ID の相互参照が可能になり、整合性が保証される。

---

## Steps

### Step 1: Check Prerequisites

1. **Check repo state:**
   ```bash
   node .claude/skills/spec-mesh/scripts/state.cjs query --repo
   ```
   - If Vision status not "approved/clarified" → Warning

2. **Check Vision Spec exists:**
   - Look for `.specify/specs/{project}/overview/vision/spec.md`
   - If not found → Recommend `/spec-mesh vision` first

3. **Read Vision Spec (including Screen Hints):**
   ```
   Read tool: .specify/specs/{project}/overview/vision/spec.md
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

Create `.specify/specs/{project}/overview/matrix/cross-reference.json`:
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
   - 曖昧点あり → `/spec-mesh clarify` を推奨
   - Critical 未解決 → 問題をリストし対応を促す

### Step 7: Run Lint

```bash
node .claude/skills/spec-mesh/scripts/spec-lint.cjs
node .claude/skills/spec-mesh/scripts/validate-matrix.cjs
```

### Step 8: Preserve Design Input

If Vision input file was used (contains Part B screen information):
```bash
node .claude/skills/spec-mesh/scripts/preserve-input.cjs design --project {project}
```
- Saves to: `.specify/specs/{project}/overview/domain/input.md`

### Step 9: Create Foundation Issue

```bash
gh issue create --title "[Foundation] S-FOUNDATION-001: 基盤実装" --body "..."
```

Foundation includes: 認証、DB接続、基本構造

### Step 10: Summary

Display:
```
=== Design 完了 ===

Screen Spec: .specify/specs/{project}/overview/screen/spec.md
  - Screens: {N} 画面定義

Domain Spec: .specify/specs/{project}/overview/domain/spec.md
  - Masters: {N} M-* 定義
  - APIs: {N} API-* 定義
  - Rules: {N} BR-*/VR-* 定義

Matrix: .specify/specs/{project}/overview/matrix/cross-reference.json

Feature Issues: {N} 件作成
Foundation Issue: #{issue_num}

=== 曖昧点 ===
[NEEDS CLARIFICATION]: {N} 箇所

推奨: `/spec-mesh clarify` → `/spec-mesh issue` (Foundation)
```

### Step 11: Update State

```bash
node .claude/skills/spec-mesh/scripts/state.cjs repo --set-domain-status draft --set-screen-status draft --set-phase design
```

---

## Self-Check

- [ ] Vision Spec を読み込んだか
- [ ] Screen Spec を作成したか（SCR-* ID 付き）
- [ ] Domain Spec を作成したか（M-*/API-* 定義）
- [ ] Cross-Reference Matrix を作成したか
- [ ] Feature Issues を作成したか
- [ ] Foundation Issue を作成したか
- [ ] **Multi-Review を実行したか（3観点並列）**
- [ ] spec-lint + validate-matrix を実行したか
- [ ] Design Input を保存したか

---

## Next Steps

**[HUMAN_CHECKPOINT]**
- [ ] Screen Spec の画面定義が要件を網羅しているか
- [ ] Domain Spec の M-*/API-* 定義が適切か
- [ ] Cross-Reference Matrix の整合性を確認したか
- [ ] [NEEDS CLARIFICATION] マーカーの箇所を確認したか

承認後、次のステップへ進んでください。

| Condition | Command | Description |
|-----------|---------|-------------|
| 曖昧点がある場合 | `/spec-mesh clarify` | Domain の曖昧点解消 |
| Foundation を開始する場合 | `/spec-mesh issue` | Foundation Issue から開始 |
| 追加機能を提案する場合 | `/spec-mesh featureproposal` | 追加 Feature 提案 |
