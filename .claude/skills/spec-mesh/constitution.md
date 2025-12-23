# Engineering Constitution

This constitution defines the foundational principles for Spec-Driven Development (SSD).
All development decisions, code reviews, and architectural choices MUST align with these principles.

Version: 2.1.0 | Ratified: 2025-12-23

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
- Core sequence: Entry → 入力検証 → Spec作成 → Multi-Review → [Clarify] → Plan → Tasks → Implement → PR
  - 入力検証: Spec作成前に必須項目を確認（不足時は追加入力を要求）
  - Multi-Review: Spec 作成直後に自動実行
  - Clarify: [NEEDS CLARIFICATION] がある場合のみ実行
  - **CLARIFY GATE**: [NEEDS CLARIFICATION] = 0 が Plan の前提条件
- Specifications in `.specify/specs/` are the single source of truth
- Ambiguity → Escalate, never guess

### 5. Git Discipline
Version control MUST ensure traceability.
- No direct push to `main`
- Issue-linked branches: `feature/{issue}-{slug}`, `fix/{issue}-{slug}`
- PRs reference Issues and Spec IDs
- Squash merge for clean history

---

## Status Values

This section defines the canonical status values used across all specs.
All templates MUST reference these definitions.

### Spec Status

Status values for Vision, Domain, Screen, Feature, and Fix specifications.

| Status | Description |
|--------|-------------|
| `Draft` | Initial creation, not reviewed |
| `In Review` | Under Multi-Review or stakeholder review |
| `Clarified` | All [NEEDS CLARIFICATION] markers resolved |
| `Approved` | Human approved, ready for implementation |
| `Implemented` | Code complete |

**Lifecycle:** Draft -> In Review -> Clarified -> Approved -> Implemented

### Screen Status

Status values for individual screens within Screen Spec (Section 2).

| Status | Description |
|--------|-------------|
| `Planned` | In spec but not implemented |
| `In Progress` | Currently being implemented |
| `Implemented` | Code complete |
| `Deprecated` | No longer used |

**Lifecycle:** Planned -> In Progress -> Implemented (or Deprecated)

### Test Status

Status values for test cases in Test Scenario Spec.

| Status | Description |
|--------|-------------|
| `Pending` | Not yet executed |
| `Pass` | Test passed |
| `Fail` | Test failed |
| `Blocked` | Cannot run due to dependencies |
| `Skipped` | Intentionally skipped |

### Test Scenario Spec Status

Status values for the overall Test Scenario Spec document.

| Status | Description |
|--------|-------------|
| `Draft` | Initial creation |
| `In Review` | Under stakeholder review |
| `Ready` | Approved and ready for execution |
| `Executing` | Test execution in progress |
| `Completed` | All tests executed |

---

## Terminology

### Spec Types

| Spec Type | ID Format | Definition |
|-----------|-----------|------------|
| **Vision Spec** | S-VISION-001 | Project purpose, target users, user journeys |
| **Domain Spec** | S-DOMAIN-001 | Shared masters (M-*), APIs (API-*), business rules |
| **Screen Spec** | S-SCREEN-001 | Screen definitions (SCR-*), transitions, wireframes |
| **Feature Spec** | S-{AREA}-{NNN} | User stories, functional requirements per feature |
| **Fix Spec** | F-{AREA}-{NNN} | Bug analysis, root cause, fix proposal |
| **Test Scenario Spec** | TS-{AREA}-{NNN} | Test cases (TC-*), test data, expected results per feature |

See `guides/id-naming.md` for complete ID format definitions.

---

## Workflow Overview

```
1. Entry Point (/spec-mesh add, fix, issue)
   → Issue creation → Branch creation

2. 入力検証（厳格）
   → 必須項目チェック
   → 不足時はユーザーに追加入力を要求

3. Spec 作成
   → 曖昧な箇所は [NEEDS CLARIFICATION] でマーク

4. Multi-Review (/spec-mesh review) [自動実行]
   → 3観点並列レビュー（構造・内容・完全性）
   → AI修正可能な問題を修正

5. Lint 実行
   → 構造検証

6. [HUMAN_CHECKPOINT] Spec 確認
   → ユーザーが Spec 内容を確認

7. Clarify (/spec-mesh clarify) [条件付き]
   → [NEEDS CLARIFICATION] がある場合のみ実行
   → 解消後 Step 4 へ戻りループ

   ════════════════════════════════════════════════════
   ★ CLARIFY GATE: [NEEDS CLARIFICATION] = 0 必須
   ════════════════════════════════════════════════════

8. Test Scenario (/spec-mesh test-scenario) [任意]
   → Feature Spec からテストケース生成
   → テストデータ定義

9. Plan (/spec-mesh plan)
   → CLARIFY GATE 通過が前提条件
   → Implementation plan
   → HUMAN_CHECKPOINT: approval required

10. Tasks (/spec-mesh tasks)
    → Break into atomic tasks

11. Implement (/spec-mesh implement)
    → Test-first development
    → Record feedback if discoveries

12. E2E Test (/spec-mesh e2e) [任意]
    → Chrome 拡張によるブラウザテスト
    → スクリーンショット/GIF 証跡

13. PR (/spec-mesh pr)
    → Integrity checks → PR creation → Review → Merge
```

---

## Specification IDs

All specs use stable identifiers for traceability:

| ID Format | Example | Usage |
|-----------|---------|-------|
| S-{AREA}-{NNN} | S-AUTH-001 | Feature/Fix Spec |
| UC-{AREA}-{NNN} | UC-AUTH-001 | Use Case |
| FR-{AREA}-{NNN} | FR-AUTH-001 | Functional Requirement |
| M-{NAME} | M-USER | Master Data |
| API-{RESOURCE}-{ACTION} | API-USER-CREATE | API Contract |
| SCR-{NNN} | SCR-001 | Screen |

See `guides/id-naming.md` for complete definitions.

---

## HUMAN_CHECKPOINT Policy

Human checkpoints are mandatory gates in the SSD workflow that require explicit human approval before proceeding. Never proceed past a checkpoint without confirmation.

### Trigger Conditions

| Checkpoint | When | What Human Verifies |
|------------|------|---------------------|
| **Spec Approval** | After Spec creation + Multi-Review + Lint | Content accuracy, scope correctness, business alignment |
| **Plan Approval** | After Plan creation | Technical approach, work breakdown, risks acceptable |
| **Feedback Recording** | Before updating Spec with discoveries | Feedback is accurate, appropriate to record |
| **Case 3 Decision** | When M-*/API-* modification needed | Impact scope acceptable, proceed with change |
| **Irreversible Actions** | Before Push, Merge, Delete operations | Action is intended and safe |

### Standard Checkpoint Format

When reaching a checkpoint, present it in this format:

```markdown
**[HUMAN_CHECKPOINT]**
- 確認項目1: [具体的な内容]
- 確認項目2: [具体的な内容]
- 確認項目3: [具体的な内容]

承認後、次のステップ（{next_step}）へ進んでください。
```

### Checkpoint Details

#### 1. Spec Approval (After Vision/Design/Add/Fix)

**Triggers:**
- Vision Spec 作成後
- Screen Spec + Domain Spec 作成後
- Feature Spec 作成後
- Fix Spec 作成後

**Human Verifies:**
- [ ] Spec の内容が入力/要件を正確に反映しているか
- [ ] スコープが適切か（過大/過小でないか）
- [ ] ビジネス要件と整合しているか
- [ ] [NEEDS CLARIFICATION] の箇所を確認したか

**Proceed When:** Human explicitly approves OR clarify resolves all issues

#### 2. Plan Approval (Before Tasks)

**Triggers:**
- Plan 作成完了時
- CLARIFY GATE 通過後

**Human Verifies:**
- [ ] 技術的アプローチが妥当か
- [ ] Work Breakdown が適切か
- [ ] リスクが許容範囲か
- [ ] Open Questions に回答できるか

**Proceed When:** Human explicitly approves the plan

#### 3. Feedback Recording (During Implement)

**Triggers:**
- 実装中に Spec にない技術的制約を発見
- 曖昧点を解決するための判断が必要
- Spec からの逸脱が必要

**Human Verifies:**
- [ ] Feedback の内容が正確か
- [ ] Spec に記録することが適切か
- [ ] 他の Spec への影響を理解しているか

**Proceed When:** Human explicitly approves feedback recording

#### 4. Case 3 Decision (During Add/Change)

**Triggers:**
- 既存の M-*/API-*/BR-*/VR-* の変更が必要
- Feature が共有リソースに影響

**Human Verifies:**
- [ ] 影響範囲を理解しているか
- [ ] 影響を受ける Feature の一覧を確認したか
- [ ] 変更のリスクを許容できるか

**Proceed When:** Human explicitly approves the modification

#### 5. Irreversible Actions (PR/Git Operations)

**Triggers:**
- git push
- PR merge
- Branch delete
- データベースマイグレーション実行

**Human Verifies:**
- [ ] 変更内容が意図したものか
- [ ] テストが全て pass しているか
- [ ] 他に影響を与える変更がないか

**Proceed When:** Human explicitly confirms the action

### Behavior After Checkpoint

1. **Wait for explicit approval** - Do not assume approval from silence
2. **Provide next step guidance** - Tell human what command to run next
3. **Record approval** - State management で checkpoint 通過を記録

### Checkpoint Skip Conditions

Checkpoints may ONLY be skipped when:
- Human explicitly requests skip with justification
- Emergency hotfix with documented reason
- Trivial fix (typo, formatting) with human confirmation

Document any skipped checkpoint in the PR description.

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

## Detailed Guides

For detailed procedures, see:
- `guides/id-naming.md` - Complete ID format definitions
- `guides/parallel-development.md` - Working on multiple features
- `guides/error-recovery.md` - Handling errors and edge cases

For agent-specific rules, see:
- `.claude/agents/reviewer.md` - Quality verification rules (Multi-Review, Clarify, Lint, Analyze, Checklist, Test-Scenario)
- `.claude/agents/developer.md` - Implementation rules (Plan, Tasks, Implement, E2E, PR, Feedback)
