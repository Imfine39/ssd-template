# Vision Specification: [PROJECT_NAME]

<!--
  Template: Vision Spec

  ID Format: S-VISION-001 (one per project)
  See: .claude/skills/spec-mesh/guides/id-naming.md

  Status Values (from constitution.md - Status Values section):
    Spec Status:
    - Draft: Initial creation, not reviewed
    - In Review: Under Multi-Review or stakeholder review
    - Clarified: All [NEEDS CLARIFICATION] markers resolved
    - Approved: Human approved, ready for implementation
    - Implemented: Code complete
-->

Spec Type: Vision
Spec ID: S-VISION-001
Created: {date}
Status: [Draft | In Review | Clarified | Approved | Implemented]
Author: [OWNER]

---

## 1. System Purpose

### 1.1 Why are we building this?

- Problem statement:
- Current pain points:
- Opportunity:

### 1.2 Vision Statement

> [1-2 sentences describing the desired future state]

### 1.3 Success Definition

- What does success look like?
- Key outcomes we want to achieve:
- How will we measure success?

---

## 2. Target Users and Stakeholders

### 2.1 Primary Users

| Actor | Description | Primary Goals |
|-------|-------------|---------------|
| [Actor 1] | [Who they are] | [What they want to achieve] |
| [Actor 2] | [Who they are] | [What they want to achieve] |

### 2.2 Secondary Users

| Actor | Description | Interaction |
|-------|-------------|-------------|
| [Actor] | [Who they are] | [How they interact with the system] |

### 2.3 Stakeholders

- Business stakeholders:
- Technical stakeholders:
- External parties:

---

## 3. User Journeys

Describe the main ways users will interact with the system at a high level.
Each journey should tell a story of how a user achieves their goal.

### Journey 1: [Journey Title]

**Actor:** [Primary actor]
**Goal:** [What they want to achieve]

**Story:**
> [Narrative description of the journey in 3-5 sentences]

**Key Steps:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Success Outcome:**
- [What success looks like for this journey]

---

### Journey 2: [Journey Title]

**Actor:** [Primary actor]
**Goal:** [What they want to achieve]

**Story:**
> [Narrative description]

**Key Steps:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Success Outcome:**
- [What success looks like]

---

## 4. Scope

### 4.1 In Scope

High-level capabilities this system will provide:

- [ ] [Capability 1]
- [ ] [Capability 2]
- [ ] [Capability 3]

### 4.2 Out of Scope

What this system will NOT do (at least in initial release):

- [Exclusion 1]
- [Exclusion 2]

### 4.3 Future Considerations

Items that may be considered for future phases:

- [Future item 1]
- [Future item 2]

---

## 5. Screen Hints

> **Note**: This section captures screen-level information from the unified Quick Input.
> These hints are used by `/spec-mesh design` to create Screen Spec and Domain Spec simultaneously.
> If empty, `/spec-mesh design` will prompt for screen information.

### 5.1 Screen List (Provisional)

User-provided screen list. Final SCR-* IDs will be assigned in Screen Spec.

| # | Screen Name | Purpose | Key Elements |
|---|-------------|---------|--------------|
| 1 | [画面名] | [目的] | [主な要素] |
| 2 | [画面名] | [目的] | [主な要素] |

### 5.2 Screen Transitions (Provisional)

Known navigation flows between screens.

- [画面A] → [画面B]: [トリガー/条件]
- [画面B] → [画面C]: [トリガー/条件]

### 5.3 Design Preferences

- **Style**: [モダン/シンプル/企業システム風 etc.]
- **Responsive**: [PC のみ / PC + タブレット / フル対応]
- **Reference Images**: [パスまたはURL]

---

## 6. Constraints and Assumptions

### 6.1 Business Constraints

- Organizational:
- Compliance requirements:

### 6.2 Technical Constraints

- Must integrate with:
- Must comply with:
- Platform/environment restrictions:

### 6.3 Assumptions

- [Assumption 1]
- [Assumption 2]

---

## 7. Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| [Risk 1] | High/Med/Low | High/Med/Low | [How to address] |
| [Risk 2] | High/Med/Low | High/Med/Low | [How to address] |

---

## 8. Open Questions

Questions that need to be resolved before proceeding:

- [ ] [Question 1]
- [ ] [Question 2]

---

## 9. Clarifications

Record of clarification questions and answers during the vision refinement process.

| Date | Question | Answer | Impact |
|------|----------|--------|--------|
| {date} | {Question asked} | {Answer received} | {How it affected the spec} |

---

## 10. Related Documents

- Screen Spec: `.specify/specs/overview/screen/spec.md` (to be created by /spec-mesh design)
- Domain Spec: `.specify/specs/overview/domain/spec.md` (to be created by /spec-mesh design)
- Feature Specs: (to be created after Screen + Domain Specs)

---

## 11. Original Input

User-provided input that was used to generate this spec.
This section preserves the original context for future reference.

```
[ORIGINAL_INPUT_CONTENT]
```

---

## 12. Changelog

| Date | Change Type | Description | Author |
|------|-------------|-------------|--------|
| {date} | Created | Initial vision specification | {Author} |

Change types: Created, Updated, Clarified, Approved
