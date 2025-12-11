---
description: Record implementation feedback and discoveries back to the spec.
handoffs:
  - label: Update Spec
    agent: speckit.spec
    prompt: Update the spec with the recorded feedback
    send: true
---

## User Input

```text
$ARGUMENTS
```

## Purpose

During implementation, discoveries are made that should be fed back to the
specification. This command provides a structured way to record:

- Technical constraints that affect the spec
- Discovered requirements not in the original spec
- Ambiguities that needed resolution
- Design decisions made during implementation

## Steps

1) **Identify the feedback type** from `$ARGUMENTS`:

   - `constraint` - Technical limitation that affects the spec
   - `discovery` - New requirement or behavior discovered
   - `clarification` - Ambiguity that was resolved during implementation
   - `decision` - Design decision that should be documented
   - `deviation` - Intentional deviation from spec (with justification)

2) **Locate the relevant spec**:

   - Find the spec being implemented (from branch name or context)
   - Read the current spec content
   - Identify the affected sections (UC, FR, SC, etc.)

3) **Record the feedback**:

   For each feedback item, capture:
   - Type (from step 1)
   - Affected spec IDs (S-XXX, UC-XXX, FR-XXX)
   - Description of the feedback
   - Impact on the spec
   - Proposed resolution (if any)

4) **Update the spec**:

   - Add entry to "## 17. Changelog" section:
     ```
     | [DATE] | [Type] | [Description] | #[Issue] |
     ```

   - Add details to "## 18. Implementation Notes" section:
     ```
     - Technical constraints discovered:
       - [Constraint description and impact]
     - Design decisions made during implementation:
       - [Decision and rationale]
     - Deviations from original spec (with justification):
       - [Deviation, reason, and approval status]
     ```

5) **Assess severity**:

   - **Minor** (no spec change needed): Just document in Implementation Notes.
   - **Moderate** (spec clarification needed): Update affected UC/FR/SC.
   - **Major** (spec change needed): Create Issue, follow spec change workflow.

6) **If major change needed**:

   - Do NOT modify UC/FR/SC directly.
   - Create an Issue with label `spec-change`.
   - Reference the affected spec IDs.
   - Propose the change for review.
   - Continue implementation with current spec until change is approved.

## Output

- Updated spec file with Implementation Notes
- Changelog entry added
- (If major) Issue number for spec change
- Summary of feedback recorded

## Examples

### Example 1: Technical Constraint

Input: `constraint: API rate limiting prevents batch updates larger than 100 items`

Output:
- Implementation Notes updated with constraint
- Changelog: `| 2025-01-15 | Clarified | Added batch size limit to FR-003 | #45 |`
- If this changes behavior: Issue created for spec update

### Example 2: Discovered Requirement

Input: `discovery: Users expect confirmation dialog before delete, not in spec`

Output:
- Implementation Notes: "Discovered requirement: delete confirmation needed"
- Issue created: "Spec addition: S-ORDERS-001 - Add delete confirmation (UC-003)"
- Spec not modified until Issue is reviewed

### Example 3: Design Decision

Input: `decision: Using optimistic locking for concurrent edits (spec silent on this)`

Output:
- Implementation Notes: "Design decision: optimistic locking for concurrency"
- Changelog: `| 2025-01-15 | Clarified | Documented concurrency strategy | - |`
- No Issue needed (spec was silent, implementation made reasonable choice)
