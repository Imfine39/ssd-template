# Tasks: [FEATURE NAME]

<!--
  Template: Task Breakdown

  Purpose: Break implementation plan into atomic, trackable tasks.
  Used by: tasks ワークフロー

  Task ID Format: T-{NNN} (e.g., T-001, T-002)
  See: .claude/skills/spec-mesh/guides/id-naming.md for ID formats
  See: .claude/skills/spec-mesh/constitution.md for workflow rules

  Prerequisites:
    - Implementation Plan must exist and be approved
    - Feature Spec must be approved
    - CLARIFY GATE must be passed ([NEEDS CLARIFICATION] = 0)

  Task Guidelines:
    - Each task: 1-2 hours of work
    - Include file path for clarity
    - Link to UC/FR IDs for traceability
-->

Feature Spec: S-{AREA}-{NNN}
Plan: PLAN-{AREA}-{NNN}
Created: {date}
Total Tasks: [COUNT]
Estimated Hours: [HOURS]

Input: Feature Spec and Domain Spec for shared masters/APIs.
Prerequisites: `plan.md` must be created and approved.

Notes:

- Tasks should be small, reviewable units of work.
- Each user story (`UC-...`) should be independently implementable and testable.
- Tests MUST be added or updated before or together with implementation.

---

## 1. Conventions

Format for each task line:

- `[ID] [P?] [Story?] [Spec?] Description (include primary file path)`

Examples:

- `[T-001] [P1] [UC-001] [S-LEADS-001] Add API endpoint for basic sales recording in backend/src/api/sales.ts`
- `[T-002] [P1] [UC-001] [S-LEADS-001] Add unit tests for sales recording service in backend/tests/unit/sales.spec.ts`
- `[T-003] [P2] [UC-002] [S-LEADS-002] Implement UI for filtering customer list in frontend/src/pages/clients.tsx`

Where:

- `ID` is a unique task ID (for example `T-001`).
- `[P?]` is optional priority label (for example `P1`, `P2`).
- `[Story?]` is the user story ID (`UC-...`).
- `[Spec?]` is the relevant spec ID (`S-...`) when applicable.
- Include at least one primary file path to reduce conflicts and improve clarity.

---

## 2. Phase 0: Alignment and Setup

- `[T-000] [P0] Confirm target spec(s) and plan are approved`
- `[T-001] [P0] Confirm branch and Issue linkage (feature/<issue>-...)`
- `[T-002] [P0] Read Domain spec and Feature spec; list dependencies: masters (M-...), APIs (API-...), cross-cutting rules`
- `[T-002.5] [P0] [Spec-First] Verify Screen Spec is updated for all affected screens (SCR-*); confirm status is Planned`
- `[T-003] [P0] Use Serena to map relevant directories/files for this change`
- `[T-004] [P0] Use context7 (or equivalent) to fetch needed library/framework docs`

---

## 3. Phase 1: Backend / Contracts and Data

- `[T-010] [P1] Update or add domain models for this feature`
- `[T-011] [P1] Apply schema changes (migrations) for referenced masters or entities`
- `[T-012] [P1] Implement or update APIs as defined in the spec`
- `[T-013] [P1] Write unit tests for core domain logic`
- `[T-014] [P1] Write integration tests for API endpoints`

---

## 4. Phase 2: Frontend / UI (if applicable)

- `[T-020] [P1] Implement UI components for the main flow`
- `[T-021] [P1] Integrate UI with backend APIs`
- `[T-022] [P1] Handle error, empty, and loading states`
- `[T-023] [P1] Write component tests and/or UI integration tests`

---

## 5. Phase 3: Cross-cutting Concerns

- `[T-030] [P1] Add logging for critical paths`
- `[T-031] [P1] Add or update metrics related to this feature`
- `[T-032] [P1] Ensure feature respects access control and permissions`
- `[T-033] [P2] Update documentation or agent file (if needed)`

---

## 6. Phase 4: Test Integrity and Cleanup

- `[T-040] [P1] Run all tests (unit, integration, E2E) and capture results`
- `[T-041] [P1] Investigate any failing tests; classify failure (spec, tests, implementation, environment)`
- `[T-042] [P1] Ensure no tests were weakened or removed solely to pass CI; if weakening is necessary, record Issue and approval path`
- `[T-043] [P2] Remove dead code and temporary instrumentation`
- `[T-044] [P2] Verify code style and linting (for example npm run lint)`

---

## 7. Phase 5: PR Preparation and Review

- `[T-050] [P1] Prepare PR: link Issues, reference Spec ID(s), summarize changes and test coverage`
- `[T-051] [P1] Ensure PR is small enough for effective review`
- `[T-052] [P1] Address Codex (or other bot) comments: apply valid suggestions or explain rejected ones`
- `[T-053] [P1] Respond to human reviewer comments`
- `[T-054] [P2] After merge, verify that the feature behaves as specified in a staging or equivalent environment`
- `[T-055] [P1] [Spec-First] After merge, update Screen Spec status to Implemented for affected SCR-* IDs`

---

## 8. Story-Based Grouping (Recommended)

Group tasks by user story so each slice is independently implementable/testable:

- `User Story UC-001: [Title]`
  - `[T-101] [P1] Implement domain logic for UC-001`
  - `[T-102] [P1] Implement API(s) for UC-001`
  - `[T-103] [P1] Implement UI for UC-001`
  - `[T-104] [P1] Write tests for UC-001`

- `User Story UC-002: [Title]`
  - `[T-201] [P2] ...`

---

## 9. Notes

- Tasks should minimize cross-file conflicts between developers and AI agents.
- Each task should have a clear "definition of done" aligned with the spec.
- Prefer more tasks with smaller scope over fewer tasks with vague scope.
- When shared masters or APIs are impacted, ensure the Domain spec and
  dependent Feature specs are updated and tasks reflect this.
- Verify tests fail before implementing, commit after each logical group,
  and stop at checkpoints to validate each story independently.
