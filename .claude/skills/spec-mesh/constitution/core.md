# Engineering Constitution - Core

This document defines the foundational principles for Spec-Driven Development (SSD).
All development decisions, code reviews, and architectural choices MUST align with these principles.

Version: 2.2.0 | Ratified: 2025-12-31

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
[NEEDS CLARIFICATION] あり? → YES: Clarify → Multi-Review へ戻る
    ↓ NO
★ CLARIFY GATE 通過 ★
    ↓
[HUMAN_CHECKPOINT] Spec 承認
    ↓
Plan → Tasks → Implement → PR
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
