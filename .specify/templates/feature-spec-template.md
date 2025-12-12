# Feature Specification: [TITLE]

Spec Type: Feature
Spec ID: S-[XXX]-001
Created: [DATE]
Status: [Draft | In Review | Approved | Implementing | Completed | Deprecated]
Author: [OWNER]
Related Issue(s): [#123]
Related Vision: S-VISION-001
Related Domain: S-DOMAIN-001

---

## 1. Purpose and Scope

### 1.1 Feature Description

- What this feature does:
- What problem does it solve for the user:

### 1.2 Scope

- In-scope:
- Out-of-scope:
- How this feature delivers value independently:

---

## 2. Domain Dependencies

This feature depends on the following elements from the Domain Spec.
**DO NOT redefine these here. Reference by ID only.**

### 2.1 Master Data Dependencies

| Master ID | Name | Usage in this Feature |
|-----------|------|----------------------|
| M-[XXX]-001 | [Name] | [How this feature uses it] |

### 2.2 API Dependencies

| API ID | Name | Usage |
|--------|------|-------|
| API-[XXX]-001 | [Name] | [Calls/Implements] |

### 2.3 Business Rules Dependencies

| Rule ID | Description | How it applies |
|---------|-------------|----------------|
| BR-001 | [Rule] | [How this feature is affected] |

**Note:** If this feature requires new M-*/API-*/BR-*, update the Domain Spec first.

---

## 3. Actors

Reference from Domain Spec, filtered to actors relevant to this feature.

| Actor | Role in this Feature |
|-------|---------------------|
| [Actor] | [What they do in this feature] |

---

## 4. User Stories / Use Cases

Each use case should be independently testable.

### UC-[XXX]-001: [Title]

**Priority:** [P1 | P2 | P3]
**Actor:** [Actor]

**Pre-conditions:**
- [Condition 1]

**Main Flow:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Alternate Flows:**
- [Alternative scenario]

**Post-conditions:**
- [Expected state after completion]

**Acceptance Criteria:**
- [ ] [Criterion 1]
- [ ] [Criterion 2]

---

### UC-[XXX]-002: [Title]

**Priority:** [P1 | P2 | P3]
**Actor:** [Actor]

**Pre-conditions:**
- [Condition]

**Main Flow:**
1. [Step 1]
2. [Step 2]

**Acceptance Criteria:**
- [ ] [Criterion]

---

## 5. Functional Requirements (FR)

| FR ID | Description | Related UC | Priority |
|-------|-------------|------------|----------|
| FR-[XXX]-001 | [Requirement] | UC-[XXX]-001 | P1 |
| FR-[XXX]-002 | [Requirement] | UC-[XXX]-001 | P2 |

Mark unclear requirements with `[NEEDS CLARIFICATION]`.

---

## 6. Edge Cases and Error Handling

| Case | Trigger | Expected Behavior |
|------|---------|-------------------|
| [Case 1] | [When this happens] | [System should...] |
| [Case 2] | [When this happens] | [System should...] |

---

## 7. Success Criteria (SC)

| SC ID | Description | Measurement |
|-------|-------------|-------------|
| SC-[XXX]-001 | [Outcome] | [How to measure] |
| SC-[XXX]-002 | [Outcome] | [How to measure] |

---

## 8. UI / UX Behavior

### 8.1 Screens

| Screen | Purpose | Entry Point |
|--------|---------|-------------|
| [Screen 1] | [What user does here] | [How to get here] |

### 8.2 States

- Default state:
- Loading state:
- Empty state:
- Error state:

### 8.3 Wireframes

- [Link to wireframe or describe layout]

---

## 9. Feature-Specific Rules

Rules that apply only to this feature (not shared across domain).

| Rule ID | Description |
|---------|-------------|
| FR-RULE-001 | [Rule specific to this feature] |

---

## 10. Testing Strategy

### 10.1 Test Coverage

| UC/FR | Test Type | Test Description |
|-------|-----------|------------------|
| UC-[XXX]-001 | Unit | [What to test] |
| UC-[XXX]-001 | Integration | [What to test] |
| FR-[XXX]-001 | E2E | [What to test] |

### 10.2 Critical Edge Cases

- [ ] [Edge case that MUST be tested]
- [ ] [Edge case that MUST be tested]

---

## 11. Open Questions

- [ ] [Question 1]
- [ ] [Question 2]

---

## 12. Clarifications

| Date | Question | Answer | Impact |
|------|----------|--------|--------|
| [DATE] | [Question] | [Answer] | [Spec section affected] |

---

## 13. Traceability

- Vision Spec: S-VISION-001
- Domain Spec: S-DOMAIN-001
- Related Issues: #[XXX]
- Related Plan: [plan path]
- Related Tasks: [tasks path]

---

## 14. Changelog

| Date | Change Type | Description | Issue |
|------|-------------|-------------|-------|
| [DATE] | Created | Initial feature specification | #XXX |

Change types: Created, Updated, Clarified, Extended, Deprecated, Superseded, Bug Fix

---

## 15. Implementation Notes

Notes discovered during implementation.

- Technical constraints discovered:
- Design decisions made:
- Deviations from spec (with justification):
- Feedback for Domain Spec updates:
