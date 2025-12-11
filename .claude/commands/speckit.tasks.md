---
description: Break the plan into tasks using the tasks template (Step 3).
handoffs:
  - label: Start Implementation
    agent: speckit.implement
    prompt: Implement the tasks
    send: true
---

## Purpose

Step 3 of the 6-step workflow. Breaks down the plan into concrete, reviewable tasks.
**Human confirms tasks before proceeding to implementation.**

## Steps

1) **Load context**:
   - Spec from feature directory
   - Plan (`plan.md`)
   - Tasks template (`.specify/templates/tasks-template.md`)

2) **Create tasks by UC**:
   - Group by User Story (UC-XXX)
   - Assign priority (P0/P1/P2)
   - Include Spec/UC references and primary file paths
   - Format: `[T-XXX] [P?] [UC-XXX] [S-XXX] Description (file path)`

3) **Include test tasks**:
   - Test tasks before or alongside implementation (fail-first)
   - Spec annotations in test files

4) **Include tool usage**:
   - Serena for codebase exploration
   - context7 for library documentation

5) **Keep tasks small**:
   - Independently reviewable
   - Avoid cross-story coupling

6) **Save tasks**:
   - Write to `tasks.md` in the feature directory

## Output

- Tasks file path
- Task count by phase/UC
- Next step: `/speckit.implement`

## Human Checkpoint

Human confirms tasks are appropriate before implementation begins.
