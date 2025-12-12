# Engineering Constitution

This constitution defines the foundational principles for projects that adopt
spec-driven development using Spec Kit, GitHub, and AI coding assistants.
These principles apply to humans and AI agents; all development decisions,
code reviews, and architectural choices MUST align with them.

---

## Terminology and Scope

- **Vision spec**: Defines the project's purpose, target users, and high-level
  user journeys. Created first for new projects.
- **Domain spec** (formerly Overview): Single source of truth for shared master
  data (`M-*`), shared API contracts (`API-*`), cross-cutting rules, and domain
  vocabulary.
- **Feature spec**: One per feature slice (screen, user flow, change set).
  Feature specs do not redefine shared masters/APIs; they reference Domain IDs.
- **Specification IDs**: Stable identifiers (for example `S-001`, `UC-001`,
  `M-CLIENTS`, `API-PROJECT_ORDERS-LIST`) used across specs, plans, tasks,
  PRs, and tests for traceability.

---

## Core Principles

### I. Type Safety

All code MUST be fully typed with strict TypeScript (and/or equivalent) configuration.
This principle ensures runtime reliability and enables confident refactoring.

Non-negotiable rules:

- `strict: true` MUST be enabled in `tsconfig.json` for TypeScript projects.
- No `any` types except when interfacing with untyped external libraries
  (MUST be documented with a short comment explaining the reason).
- All function parameters and return types MUST be explicitly typed.
- API responses and request payloads MUST have defined interfaces/types.
- Shared types MUST be centralized in a `types/` or `shared/types/` directory.

Rationale: Type systems catch errors at compile time, reduce debugging time, and
serve as living documentation for the codebase.

---

### II. Test Coverage

Critical paths MUST have test coverage. Testing strategy focuses on high-value
tests that verify business logic and user-facing functionality.

Non-negotiable rules:

- All API endpoints MUST have integration tests verifying happy path and error cases.
- Business logic services MUST have unit tests for core behavior.
- User-facing features MUST have at least one end-to-end test per major user story.
- Tests MUST run in the CI pipeline before merge to `main`.
- Test files MUST be co-located with source files or in a parallel `__tests__` directory.

Rationale: Tests provide confidence for changes, prevent regressions, and
document expected behavior.

#### Test-Specification Linkage

To ensure traceability between specifications and tests, the following
conventions SHOULD be followed:

**JSDoc/TSDoc annotations** (for TypeScript/JavaScript):

```typescript
/**
 * @spec S-ORDERS-001
 * @uc UC-001, UC-002
 */
describe('Order creation', () => {
  /**
   * @uc UC-001
   * @fr FR-001
   */
  it('should create order with valid data', () => {
    // test implementation
  });
});
```

**Python docstrings** (for pytest):

```python
class TestOrderCreation:
    """
    Spec: S-ORDERS-001
    UC: UC-001, UC-002
    """

    def test_create_order_with_valid_data(self):
        """
        UC: UC-001
        FR: FR-001
        """
        # test implementation
```

**Test file naming convention**:

- `<feature>.spec.ts` or `<feature>.test.ts` for unit/integration tests
- `<uc-id>.<feature>.e2e.ts` for E2E tests (e.g., `uc-001.order-creation.e2e.ts`)

**Benefits**:

- Enables automated coverage reports by UC/FR
- Makes it easy to find tests when a spec changes
- Documents the relationship between business requirements and test code

---

### III. Code Quality

Code MUST be maintainable, readable, and follow established patterns.
Consistency across the codebase enables efficient collaboration.

Non-negotiable rules:

- ESLint and Prettier (or equivalent) MUST be configured and enforced
  via pre-commit hooks and/or CI.
- Linting rules MUST NOT be disabled without documented justification.
- Functions SHOULD generally be under 50 lines; files SHOULD generally be
  under 300 lines (excluding tests). Larger scopes MUST be justified and well structured.
- Dead code MUST be removed, not commented out.
- Dependencies MUST be kept up to date; security vulnerabilities MUST be
  addressed within 7 days of disclosure.

Rationale: Clean code reduces cognitive load, speeds up onboarding, and
minimizes technical debt accumulation.

---

## IV. Spec-Driven Workflow

All changes MUST be driven by explicit specifications and tracked issues, not
ad-hoc code edits.

Non-negotiable rules:

- Every non-trivial change MUST originate from a GitHub Issue
  (bug, feature, refactor, or spec change).
- Issues SHOULD use the provided templates (feature/spec-change/bug) with
  concise summaries; detailed impact and test plans are elaborated in specs/plans.
- For new or changed behavior, the following 6-step sequence MUST be followed:

  1. **Entry Point** (`/speckit.add`, `/speckit.fix`, or `/speckit.issue`):
     - Issue creation (if not exists) → Branch creation → Spec creation
     - Clarify loop until all ambiguities resolved
     - Human reviews and approves spec
  2. `/speckit.plan` to derive a technical implementation plan aligned with the spec.
     - Human reviews and approves plan
  3. `/speckit.tasks` to break work into concrete, reviewable tasks.
     - Human confirms tasks
  4. `/speckit.implement` for implementation work based on tasks.
     - Human approves feedback recording if discovered
  5. `/speckit.pr` to create pull request with integrity check.
  6. PR review and merge.

- Each specification MUST have stable identifiers (for example):

  - Specification IDs: `S-001`, `S-002`
  - Use case IDs: `UC-001`, `UC-002`
  - Domain objects and master data IDs: `M-CLIENTS`, `M-PROJECT_ORDERS`
  - API contracts: `API-PROJECT_ORDERS-LIST`, `API-PROJECT_ORDERS-DETAIL`

  These IDs MUST be referenced from:

  - Plans
  - Tasks
  - Implementation pull requests
  - Relevant tests and documentation (where feasible)

- Specifications are stored under `.specify/specs/` and treated as the single
  source of truth for behavior and contracts.

- When a requirement is ambiguous, contradictory, or missing, AI agents and
  humans MUST NOT guess. They MUST raise an Issue (or comment on an existing one)
  to request clarification.

- Implementations that knowingly diverge from the specification are prohibited
  and considered constitutional violations.

Rationale: Spec-first development creates traceability from business intent
to code, reduces rework, and ensures that AI-generated changes remain aligned
with real requirements.

### Change Size Classification

To balance rigor with agility, changes are classified by size. The required
workflow varies accordingly:

**Trivial** (Spec not required):

- Typo fixes in comments, documentation, or UI text
- Single-line bug fixes with obvious correctness
- Dependency patch version updates (no breaking changes)
- Code formatting or linting fixes

For trivial changes: Issue recommended but not required; direct PR with clear
description is acceptable.

**Small** (Lightweight Spec):

- Bug fixes affecting a single UC or FR
- Minor enhancements within one existing feature
- Adding validation or error handling to existing flows
- Performance optimizations with no behavior change

For small changes: Issue required; update the existing Spec's changelog section
or add a brief note. Full Plan/Tasks optional but recommended for clarity.

**Medium** (Standard Workflow):

- New user stories (UC) or functional requirements (FR)
- Changes spanning multiple files or components
- New API endpoints or modifications to existing contracts
- UI changes affecting user workflows

For medium changes: Full Spec → Plan → Tasks workflow required.

**Large** (Extended Workflow):

- Changes to Domain spec (shared masters, APIs, domain rules)
- Architectural changes affecting multiple features
- Breaking changes to existing APIs or data models
- Changes requiring coordination across teams

For large changes: Impact analysis required; review meeting recommended;
full Spec → Plan → Tasks workflow with explicit approval gates.

**Emergency** (Post-hoc Spec):

- Critical security patches
- Production incident hotfixes
- Time-sensitive regulatory compliance fixes

For emergency changes: Immediate fix allowed on `hotfix/*` branch;
Spec and documentation MUST be created within 48 hours of deployment;
Issue MUST be created before or immediately after the fix.

---

## V. Git & GitHub Workflow

Version control practices MUST ensure traceability from specification to implementation.

Non-negotiable rules:

- Direct pushes to `main` are strictly prohibited.
- All work MUST be performed on an Issue-linked branch. Recommended patterns:

  - `spec/<issue-number>-<short-description>` for specification changes
  - `feature/<issue-number>-<short-description>` for new features
  - `fix/<issue-number>-<short-description>` for bug fixes
  - `hotfix/<issue-number>-<short-description>` for urgent production fixes

- Every change MUST be merged via a pull request using squash merge
  (or an equivalently traceable strategy defined by the project).

- Each pull request MUST:

  - Reference at least one Issue (for example `Fixes #123`).
  - Reference the relevant specification IDs
    (for example `Implements S-001, S-002`).

- Branch names, commit messages, and PR descriptions MUST make it easy to trace:

  - Which specification(s) are being implemented or changed.
  - Which Issue(s) are being addressed.

- These rules apply equally to human and AI-driven workflows.
  AI agents MUST NOT create branches, commits, or pushes that violate this workflow.

- After a PR is merged, the corresponding feature branch SHOULD be deleted
  (GitHub's automatic branch deletion is recommended).

Rationale: A disciplined Git workflow ensures that every change is reviewable,
auditable, and traceable back to its underlying requirements.

---

## VI. AI Agent Conduct

AI agents (such as Claude Code and other coding assistants) are first-class
contributors bound by this constitution.

Non-negotiable rules:

- AI agents MUST treat this constitution as the highest-priority guideline
  for their behavior.

- AI agents MUST NOT propose or execute workflows that violate:

  - Spec-driven development principles.
  - Git and GitHub workflow rules.
  - Testing and quality standards defined in this constitution.

- When AI agents detect ambiguity, conflict, or missing information, they MUST:

  - Explicitly highlight the issue, and
  - Escalate to humans via Issues or comments instead of silently guessing.

- Before implementing changes, AI agents MUST ensure:

  - There is a corresponding specification (or an explicit decision to create or update one).
  - There is an agreed plan and task breakdown (where applicable).
  - There is a valid Issue and branch context for the work.

- AI agents MUST prefer small, reviewable changes with clear diffs over
  large, monolithic edits.

Rationale: AI assistance must increase, not decrease, the predictability,
traceability, and quality of the codebase.

---

## VII. Test Integrity and Problem Diagnosis

Tests exist to enforce specified behavior, not to merely satisfy tooling or
achieve a "green" CI state.

Non-negotiable rules:

- When a test fails, contributors (including AI agents) MUST first determine
  what is wrong before making changes:

  - Is the specification incorrect or incomplete?
  - Is the test incorrect (it encodes the wrong behavior or assumptions)?
  - Is the implementation incorrect relative to the specification?
  - Is the environment or test data misconfigured?

- It is strictly prohibited to:

  - Change implementation code solely to "make a test pass" when that behavior conflicts with the specification.
  - Change, relax, or delete tests solely to achieve a green CI
    without documenting the underlying reasoning.

- For any non-trivial failure, contributors MUST:

  - Create or update an Issue describing:

    - The failing test(s).
    - The expected behavior according to the specification.
    - The identified root cause (spec bug, test bug, implementation bug,
      or environment issue).

  - Link the Issue to the relevant specification IDs.

- When the specification is wrong:

  - The specification MUST be corrected first
    (via `/speckit.spec` on a `spec/*` branch),
  - Then tests and implementation MUST be updated to match the corrected spec.

- When tests are wrong but the specification is correct:

  - Tests MUST be updated to match the specification, with a clear explanation
    in the commit message and/or PR description.

- AI agents MUST NOT:

  - Mark tests as "skipped" or "expected to fail" or remove them,

  without explicit human approval and corresponding Issue documentation.

- Any intentional weakening of tests (loosening assertions, lowering coverage,
  skipping execution) requires:

  - An Issue capturing the rationale and impacted spec IDs.
  - Reviewer approval recorded in the PR.
  - A follow-up task if behavior is temporarily allowed to drift.

Rationale: High test coverage without integrity leads to false confidence.
Aligning tests, specs, and implementation ensures that green builds truly
represent correct behavior.

---

## VIII. Specification Structure and Domain Model

Specifications are organized in a three-tier structure:

- Vision spec (project purpose and journeys)
- Domain spec (shared masters, APIs, business rules)
- Feature specs (one per feature slice)

Non-negotiable rules:

- Domain spec:

  - Defines shared master data (for example `M-CLIENTS`, `M-MEMBERS`,
    `M-PROJECT_ORDERS`).
  - Defines shared API contracts (for example `API-PROJECT_ORDERS-LIST`).
  - Defines shared business rules, status models, and cross-cutting constraints.
  - Serves as the single source of truth for these definitions.

- Feature specs:

  - MUST NOT re-define shared master data or shared API contracts.
  - MUST declare which masters and APIs they depend on by referencing IDs
    from the Domain spec (for example "Depends on `M-CLIENTS` and
    `API-PROJECT_ORDERS-LIST`").
  - Focus on specific user stories, flows, UI behavior, and how they use
    the shared domain model.
  - MUST be listed in a Domain Feature index table with columns
    `| Feature ID | Title | Path | Status | Related M-*/API-* |`.

- When a shared master or API contract changes:

  - The Domain spec MUST be updated first.
  - All Feature specs that reference the changed IDs MUST be reviewed and
    updated as needed.
  - Implementation and tests MUST then be updated accordingly.

Rationale: Centralizing domain and contract definitions in a single Domain
spec prevents divergence across feature specs and keeps the system coherent.

### Specification Lifecycle

Each specification progresses through defined states. The `Status` field in
the spec header MUST reflect the current state:

| Status | Description | Allowed Actions |
|--------|-------------|-----------------|
| Draft | Initial creation, incomplete | Edit freely, request review |
| In Review | Under review by stakeholders | Minor edits, address feedback |
| Approved | Reviewed and approved for implementation | Implementation may begin |
| Implementing | Active implementation in progress | Update with implementation notes |
| Completed | Implementation finished and deployed | Reference only, no functional changes |
| Deprecated | Superseded or no longer applicable | Reference only, document reason |
| Superseded | Replaced by a newer spec | Must reference successor spec ID |

State transitions:

```
Draft → In Review → Approved → Implementing → Completed
                                    ↓
                              Deprecated / Superseded
```

Rules for state transitions:

- `Draft → In Review`: Author requests review; all required sections filled.
- `In Review → Approved`: At least one reviewer approves; no blocking issues.
- `Approved → Implementing`: Implementation branch created; tasks assigned.
- `Implementing → Completed`: All tasks done; tests pass; PR merged to main.
- `Any → Deprecated`: Document reason in spec; update Feature index.
- `Any → Superseded`: Reference successor spec ID; update Feature index.

Reopening a completed spec:

- If changes are needed to a Completed spec, create a new Issue.
- For minor updates: change status back to `In Review`, make changes, re-approve.
- For significant changes: consider creating a new Feature spec instead.

Archiving specs:

- Deprecated and Superseded specs MAY be moved to `.specify/specs/_archive/`
  after 6 months of inactivity.
- Archived specs remain searchable for historical reference.

---

## Development Standards

Technology stack (example baseline; may be adapted per project):

- Runtime: Node.js (LTS version) and/or other approved runtimes.
- Language: TypeScript 5.x with strict mode; Python with type hints where used.
- Package Manager: npm or pnpm (consistent within each project).
- Frontend Framework: determined by project requirements (for example React).
- Testing: Vitest or Jest for unit/integration; Playwright or Cypress for E2E.
- CLI: GitHub CLI (`gh`) MUST be available for automated GitHub operations.

Code organization:

- Web application structure with `frontend/` and `backend/` separation,
  where applicable.
- Shared types in `shared/types/` accessible to both frontend and backend.
- Environment configuration via `.env` files (never committed to version control).
- Secrets MUST use environment variables or secret managers, never hardcoded.

---

## Quality Gates

Before Code Review:

- All linting checks pass (for example `npm run lint`).
- Specification lint (`node .specify/scripts/spec-lint.js`) passes
  (enforced in CI).
- All tests pass (for example `npm run test`).
- TypeScript (and other typed languages) compile without errors
  (for example `npm run build`).
- No stray debug output (for example `console.log`) in production code.

Before Merge to `main`:

- At least one approval from a code owner or designated reviewer.
- CI pipeline passes all checks.
- No unresolved review comments.
- Branch is up to date with `main` (rebased or merged as per project policy).
- Automatic or semi-automatic reviewers (for example Codex or other bots)
  have been considered:

  - Valid comments are addressed with code changes.
  - Comments that are intentionally not applied MUST have a clear explanation
    in the PR discussion.

Before Deployment:

- All quality gates above are satisfied.
- Staging or pre-production environment validation is complete.
- A rollback procedure is documented for significant changes.

---

## Governance

This constitution establishes the foundational principles for projects adopting
spec-driven development with Spec Kit and AI assistants.

Amendment Process:

1. Propose changes via pull request to `.specify/memory/constitution.md`.
2. Changes require approval from at least two core contributors (or
   an equivalent governance body defined by the organization).
3. MAJOR version bump for principle changes or removals.
4. MINOR version bump for new sections or significant expansions.
5. PATCH version bump for clarifications and typo fixes.

Compliance:

- All pull requests MUST verify compliance with constitutional principles.
- Violations MUST be flagged during code review.
- Exceptions require documented justification and explicit team approval
  (for example via PR comments or architectural decision records).

Version: 1.5.0 | Ratified: 2025-12-10 | Last Amended: 2025-12-12
