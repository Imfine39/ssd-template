---
description: Implement tasks from the plan with tests and adherence to spec (Step 4).
handoffs:
  - label: Create PR
    agent: speckit.pr
    prompt: Verify integrity and create PR
    send: true
  - label: Record Feedback
    agent: speckit.feedback
    prompt: Record implementation discoveries to spec
    send: true
---

## Purpose

Step 4 of the 6-step workflow. Implements tasks from the plan while:
- Adhering strictly to the spec
- Writing tests first or alongside code
- Requesting human permission when spec feedback is needed

## Steps

1) **Verify context**:
   - Confirm current branch is Issue-linked (feature/*, fix/*)
   - Read: spec, plan, tasks from the feature directory
   - Ensure Spec IDs (S-*, UC-*, FR-*) are clear

2) **Load tasks**:
   - Parse tasks.md for pending tasks
   - Present task list and confirm implementation order

3) **For each task**:

   a) **Read task requirements**:
      - Identify related UC/FR/SC IDs
      - Understand acceptance criteria

   b) **Write tests first** (fail-first when possible):
      - Create test file with spec annotations:
        ```typescript
        /**
         * @spec S-XXX-001
         * @uc UC-001
         */
        ```
      - Tests should fail initially (red phase)

   c) **Implement code**:
      - Small, focused changes
      - Reference spec IDs in comments where helpful
      - Follow existing code patterns (use Serena to explore)

   d) **Run tests**:
      - All tests should pass (green phase)
      - If test fails, classify:
        - Spec bug → Need feedback
        - Test bug → Fix test
        - Implementation bug → Fix code
        - Environment bug → Fix config

   e) **Check for feedback needs**:
      - Did you discover a technical constraint not in spec?
      - Did you find an ambiguity that needed a decision?
      - Did you deviate from spec for a valid reason?

      **If YES to any**:
      - **STOP and ask human for permission**:
        ```
        I discovered something that may need to be recorded in the spec:
        - Type: [constraint/discovery/decision/deviation]
        - Description: [what was found]
        - Affected: [UC-XXX, FR-XXX]

        Should I record this feedback to the spec? [Yes/No]
        ```
      - If human approves → Run `/speckit.feedback` with the details
      - If human declines → Continue without recording

4) **After all tasks**:
   - Run full test suite
   - Run spec-lint: `node .specify/scripts/spec-lint.js`
   - Summarize:
     - Tasks completed
     - Tests added/modified
     - Feedback recorded (if any)
     - Any remaining issues

5) **Recommend next step**:
   - If all tasks done and tests pass → Suggest `/speckit.pr`
   - If tasks remain → Continue with next task
   - If blocked → Suggest `/speckit.clarify`

## Output

- Completed tasks list
- Test results summary
- Code changes summary
- Feedback recorded (if any)
- Next step recommendation

## Human Checkpoints

**Feedback Permission**: When implementation discovers something that should be recorded in spec, AI MUST ask human for permission before running /speckit.feedback.

This ensures humans maintain control over spec changes.
