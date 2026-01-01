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
- **CLARIFY GATE**: [NEEDS CLARIFICATION] = 0 is required before Plan
  - See [quality-gates.md](quality-gates.md) for details

**Spec Creation Flow:**
<!-- SSOT: Spec Creation Flow -->
<!-- 他のファイルはこの Flow を参照すること。完全な複製禁止。 -->
<!-- アンカー: #spec-driven-workflow -->
```
Entry (vision/add/fix/issue)
    ↓
入力検証（必須項目確認）
    ↓
Spec 作成
    ↓
深掘りインタビュー（必須）← AskUserQuestion で潜在課題を発掘
    ↓
Multi-Review（3観点並列） → AI修正
    ↓
Lint
    ↓
マーカーカウント
    │
    ├─ [NEEDS CLARIFICATION] > 0 → Clarify → Multi-Review へ戻る
    │
    └─ [NEEDS CLARIFICATION] = 0
            │
            ├─ [DEFERRED] = 0 → ★ CLARIFY GATE: PASSED ★
            │
            └─ [DEFERRED] > 0 → ★ CLARIFY GATE: PASSED_WITH_DEFERRED ★
                                        │
                                        ▼
                               [HUMAN_CHECKPOINT]
                               (リスク確認: [DEFERRED] 項目を提示)
    ↓
[HUMAN_CHECKPOINT] Spec 承認
    ↓
Plan → Tasks → Implement（[DEFERRED] 遭遇時は Clarify へ戻る） → PR
```

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
