# Engineering Constitution - Core

This document defines the foundational principles for Spec-Driven Development (SSD).
All development decisions, code reviews, and architectural choices MUST align with these principles.

Version: 2.3.0 | Ratified: 2025-12-31

---

## Mission

**Spec-First Development**: Every change originates from explicit specifications.
No guessing, no ad-hoc edits, no silent deviations.

Why:
- Traceability from business intent to code
- Reduced rework through early clarification
- AI-generated changes remain aligned with requirements

---

## Design Philosophy

### User Understanding

> **Core Insight:** Users don't find writing "troublesome" — they have gaps in knowledge.

| Approach | Assumption | Result |
|----------|------------|--------|
| Old | Users avoid detailed input | Minimal input forms → AI guesses |
| New | Users don't know everything | Detailed input structure → QA fills gaps |

**Conclusion:** Provide detailed Pre-Input structures, then complement with QA/AskUserQuestion for discovery.

### Role Separation: Input / QA / AskUserQuestion

```
┌─────────────────────────────────────────────────────────────┐
│ Pre-Input（User writes in advance）                          │
├─────────────────────────────────────────────────────────────┤
│ Purpose: Extract what the user already knows                 │
│                                                              │
│ Characteristics:                                             │
│   ✅ Detailed structure for comprehensive input              │
│   ✅ Function-based (data, screens, logic)                   │
│   ✅ Clear required fields                                   │
│   ❌ No checklists (that's QA's role)                        │
│   ❌ No selection questions (that's QA's role)               │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ QA（AI generates dynamically）                               │
├─────────────────────────────────────────────────────────────┤
│ Purpose: Discover what the user doesn't know                 │
│                                                              │
│ Characteristics:                                             │
│   ✅ Identify unfilled/unclear items from Input              │
│   ✅ Checklist format OK                                     │
│   ✅ Present AI assumptions for confirmation                 │
│   ✅ Professional proposals (security, UX, performance)      │
│                                                              │
│ Categories:                                                  │
│   [必須] → Unanswered triggers [NEEDS CLARIFICATION]         │
│   [確認] → Confirm AI assumptions                            │
│   [提案] → Record adoption/rejection with reasons            │
│   [選択] → Select from multiple options                      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ AskUserQuestion（Interactive clarification）                 │
├─────────────────────────────────────────────────────────────┤
│ Purpose: Resolve remaining ambiguities immediately           │
│                                                              │
│ Use Cases:                                                   │
│   - Remaining questions after QA                             │
│   - Critical design decisions                                │
│   - Efficiency through selection-based answers               │
└─────────────────────────────────────────────────────────────┘
```

### Spec Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                    Overview Specs（What）                    │
├─────────────────────────────────────────────────────────────┤
│  Vision Spec      │ Purpose, goals, constraints, scope       │
│  Screen Spec      │ Screen list, navigation, UI patterns     │
│  Domain Spec      │ M-*, API-*, RULE-*                        │
└─────────────────────────────────────────────────────────────┘
                              ↓ Referenced by
┌─────────────────────────────────────────────────────────────┐
│                    Feature Specs（How）                      │
├─────────────────────────────────────────────────────────────┤
│  S-{PREFIX}-{NNN} │ Feature requirements, use cases,          │
│                   │ implementation details                    │
│                   │ ← References Screen/Domain                │
└─────────────────────────────────────────────────────────────┘
```

---

## Core Principles

### 1. Type Safety
All code MUST be fully typed with strict configuration.
- `strict: true` in tsconfig.json
- No `any` without documented justification
- All function parameters and return types explicitly typed

### 2. Test Coverage
Critical paths MUST have test coverage.
- API endpoints: integration tests (happy path + errors)
- Business logic: unit tests
- User features: at least one E2E test per major story
- Tests run in CI before merge

### 3. Code Quality
Code MUST be maintainable and consistent.
- ESLint + Prettier enforced via pre-commit hooks
- Functions < 50 lines, files < 300 lines (generally)
- Dead code removed, not commented out

### 4. Spec-Driven Workflow
All changes MUST be driven by specifications.
- Every non-trivial change from a GitHub Issue
- Specifications in `.specify/specs/` are the single source of truth
- Ambiguity → Escalate, never guess
- **SPEC GATE**: All markers resolved before Plan
  - `[NEEDS CLARIFICATION]` = 0 required
  - `[PENDING OVERVIEW CHANGE]` = 0 required (after Overview Change subworkflow)
  - See [quality-gates.md](quality-gates.md) for details

**Spec Creation Flow:**
<!-- SSOT: Spec Creation Flow -->
<!-- 他のファイルはこの Flow を参照すること。完全な複製禁止。 -->
<!-- アンカー: #spec-driven-workflow -->
```
Entry (add/fix/change/issue/quick/setup)
    ↓
Input 読み込み・検証（必須項目確認）
    ↓
ワイヤーフレーム処理（画像/ファイルあれば）← _wireframe-processing.md
    ↓
QA ドキュメント生成（必須）← _qa-generation.md
    ↓
QA フォローアップ（回答分析 + 追加質問 + 提案確認）← _qa-followup.md
    ↓
Spec 作成（QA 結果を反映）
    ↓
Multi-Review（3観点並列） → AI修正
    ↓
Lint
    ↓
★ SPEC GATE チェック ★
    │
    ├─ [NEEDS CLARIFICATION] > 0
    │     └─→ BLOCKED_CLARIFY → Clarify → Multi-Review へ戻る
    │
    ├─ [PENDING OVERVIEW CHANGE] > 0 (Feature/Fix Spec のみ)
    │     └─→ BLOCKED_OVERVIEW → Overview Change サブワークフロー → Multi-Review へ戻る
    │
    └─ [NEEDS CLARIFICATION] = 0 かつ [PENDING OVERVIEW CHANGE] = 0
            │
            ├─ [DEFERRED] = 0 → ★ SPEC GATE: PASSED ★
            │
            └─ [DEFERRED] > 0 → ★ SPEC GATE: PASSED_WITH_DEFERRED ★
                                        │
                                        ▼
                               [HUMAN_CHECKPOINT]
                               (リスク確認: [DEFERRED] 項目を提示)
    ↓
[HUMAN_CHECKPOINT] Spec 承認
    ↓
Plan → Tasks → Implement（[DEFERRED] 遭遇時は Clarify へ戻る） → PR
```

**Flow の重要ポイント:**
1. **QA は Spec 作成の前** - ユーザーの知識ギャップを先に発見
2. **AskUserQuestion は QA 後** - QA で発見した不明点を対話で解消
3. **ワイヤーフレームは構造化保存** - 後続の変更でユーザーに再作成させない

### 5. Git Discipline
Version control MUST ensure traceability.
- No direct push to `main`
- Issue-linked branches: `feature/{issue}-{slug}`, `fix/{issue}-{slug}`
- PRs reference Issues and Spec IDs
- Squash merge for clean history
- See [git-workflow.md](git-workflow.md) for details

---

## Governance

### Amendment Process
1. Propose via PR to this file
2. Requires approval from project owner
3. Version bump: MAJOR for principle changes, MINOR for additions, PATCH for clarifications

### Compliance
- All PRs verify compliance with these principles
- Violations flagged during code review
- Exceptions require documented justification

---

## Advanced Concepts

### Cascade Update

Feature Spec や Fix Spec の変更が Domain/Screen Spec に波及する場合の更新フロー。
Spec 間の整合性を保つための重要なメカニズム。

**トリガー条件:**
- Feature Spec で新規 Master/API を定義
- Fix Spec で既存 Master/API の仕様を修正
- Feature Spec の承認時に Domain への反映が必要

**フロー:**
```
Feature Spec 変更
    ↓
影響範囲を特定（impact-analysis.md）
    ↓
関連 Spec を更新:
  - Domain Spec (Masters, APIs, Rules)
  - Screen Spec (参照する Master/API)
  - Matrix (cross-reference.json)
    ↓
state.cjs に更新ログを記録
```

**参照:** [_cascade-update.md](../workflows/shared/_cascade-update.md)

### Pending Additions

Feature Spec Section 2.5 で使用される概念。
Feature 実装時に Domain Spec に追加が予定される要素を事前定義する。

**目的:**
- 実装前に Domain への影響を明確化
- Cascade Update の計画を事前に立てる
- レビュー時に追加予定要素を確認可能にする

**構造例:**
```markdown
### 2.5 Pending Additions

| ID | Type | Description | Status | Added Date |
|----|------|-------------|--------|------------|
| API-{AREA}-001 | API | {説明} | Pending | - |
| M-{AREA}-001 | Master | {説明} | Pending | - |
```

**ステータスライフサイクル:**
```
Pending (Feature Spec で仮定義)
    ↓ Cascade Update 実行
Added (Domain Spec に正式追加)
    ↓ Matrix 検証完了
Verified (相互参照が検証済み)
```

**ステータス値:**
- `Pending`: 仮定義、Cascade Update 待ち
- `Added`: Domain Spec に追加済み、Added Date を記入
- `Verified`: Matrix 検証完了、全参照が有効

**処理タイミング:**
1. add ワークフロー Step 4: Pending 項目を定義
2. add ワークフロー Step 6 (Cascade Update): Domain Spec に追加、Status = Added
3. Matrix 検証完了後: Status = Verified

**参照:** [_cascade-update.md](../workflows/shared/_cascade-update.md)

---

## Related Constitution Files

| File | Purpose | When to Read |
|------|---------|--------------|
| [spec-creation.md](spec-creation.md) | Spec作成ルール | Spec作成時 |
| [quality-gates.md](quality-gates.md) | 品質ゲート定義 | Review/Clarify時 |
| [git-workflow.md](git-workflow.md) | Git操作ルール | Git操作時 |
| [terminology.md](terminology.md) | ID・Status定義 | 参照時 |

## Detailed Guides

- `guides/id-naming.md` - Complete ID format definitions
- `guides/parallel-development.md` - Working on multiple features
- `guides/error-recovery.md` - Handling errors and edge cases
