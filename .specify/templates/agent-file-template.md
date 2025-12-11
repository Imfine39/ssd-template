# [PROJECT NAME] Agent Guide

Auto-generated from specs and plans.  
Last updated: [DATE]

This document summarizes how AI coding assistants should behave in this repository,
based on the Engineering Constitution and the current set of specifications.

---

## 1. Project Overview

- Domain: [Short description of the system]
- Main Overview spec(s): [IDs or paths]
- Main Feature spec groups: [for example Sales, Assignments, Revenue, Dashboard]

---

## 2. Active Technologies

Filled automatically from plans and specs:

- Languages:
- Frameworks:
- Datastores:
- Messaging / queues:
- Testing frameworks:
- Tooling (for example `gh`, MCP servers, etc.):

---

## 3. Project Structure (High Level)

Summarize the main directories and their roles. For example:

    backend/         Backend application code
    frontend/        Frontend application code
    shared/          Shared types and utilities
    .specify/        Specs, plans, tasks, and scripts
    .claude/         Commands and AI configuration

---

## 4. Context Priority for Agents

When working on a change, read in this order:

1) Overview spec (shared masters/APIs, domain rules)  
2) Relevant Feature spec(s) for the change  
3) Plan (`plan.md`) for technical approach and file targets  
4) Tasks (`tasks.md`) for concrete steps and file paths  
5) Recent changes (last merged features) for surrounding context

---

## 5. Specification Structure

- Exactly one Overview spec per major system/bounded context.
- Feature specs are per feature slice (screen, flow, change set).
- Shared masters/APIs are defined only in the Overview spec:

  - Masters: `M-CLIENTS`, `M-PROJECT_ORDERS`, ...
  - APIs: `API-PROJECT_ORDERS-LIST`, ...

- Feature specs reference these IDs and MUST NOT redefine the models.
- If a shared master/API changes:

  1) Update the Overview spec.  
  2) Review/update dependent Feature specs.  
  3) Update implementation and tests.

---

## 6. 6-Step Workflow and Commands

### 6-Step Workflow

```
Step 1: Entry Point (add/fix/issue/bootstrap)
  → Issue → Branch → Spec → Clarify loop → Human approves spec

Step 2: /speckit.plan
  → Plan → Human approves plan

Step 3: /speckit.tasks
  → Tasks → Human confirms

Step 4: /speckit.implement
  → Implementation → Human approves feedback if any

Step 5: /speckit.pr
  → Analyze (recommended) → PR creation

Step 6: PR Review
  → Human approves and merges
```

### Available Commands

**Entry Points**: `bootstrap`, `add`, `fix`, `issue`
**Base Commands**: `spec`, `plan`, `tasks`, `implement`, `pr`
**Utilities**: `analyze`, `feedback`, `clarify`, `lint`

---

## 7. Git and Issue Workflow (for Agents)

- All non-trivial changes MUST be linked to a GitHub Issue.
- Use Issue-linked branches (for example `feature/123-short-title`, `spec/123-overview`).
- Keep changes small and focused on a single Issue/feature.
- Use `/speckit.pr` to create PRs (runs spec-lint automatically).
- PRs created by agents MUST:

  - Reference Issue(s) (for example `Fixes #123`).
  - Reference Spec ID(s) (for example `Implements S-001, UC-003`).
  - Summarize tests run and results.

---

## 8. Testing Expectations

- Before implementing: identify tests to add/update from the spec; aim for fail-first.
- Do NOT weaken, skip, or delete tests just to make CI pass without human approval and an Issue.
- On failure, classify cause (spec vs test vs implementation vs environment) and record it.
- Keep changes reviewable: prefer focused test + code pairs per user story.

---

## 9. Code Style and Patterns

Provide project-specific guidance:

- Preferred architectural patterns (for example layered, hexagonal).
- Naming conventions (files, components, APIs, tests).
- Error handling and logging expectations.
- Feature flag guidelines (if any).

---

## 10. Recent Changes (Context for Agents)

Summaries of the last few merged features:

- [FEATURE-1]: [Short description and impact]
- [FEATURE-2]: [Short description and impact]
- [FEATURE-3]: [Short description and impact]

---

## 11. Manual Notes (Human Maintained)

Use this section to record human insights that AI agents should know, for example:

- Domain nuances that are hard to infer from code or specs.
- Known technical debts and temporary workarounds.
- Preferred trade-offs for this organization.

Manual additions start below:

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
