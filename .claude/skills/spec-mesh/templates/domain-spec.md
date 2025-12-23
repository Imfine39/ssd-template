# Domain Specification: [PROJECT_NAME]

<!--
  Template: Domain Spec

  ID Format: S-DOMAIN-001 (one per project)
  See: .claude/skills/spec-mesh/guides/id-naming.md

  Status Values (from constitution.md - Status Values section):
    Spec Status:
    - Draft: Initial creation, not reviewed
    - In Review: Under Multi-Review or stakeholder review
    - Clarified: All [NEEDS CLARIFICATION] markers resolved
    - Approved: Human approved, ready for implementation
    - Implemented: Code complete
-->

Spec Type: Domain
Spec ID: S-DOMAIN-001
Created: {date}
Status: [Draft | In Review | Clarified | Approved | Implemented]
Author: [OWNER]
Related Vision: S-VISION-001
Related Screen: S-SCREEN-001

---

## 1. Domain Overview

### 1.1 Domain Description

Brief description of the technical domain this spec covers.
Reference the Vision Spec for business context and user journeys.
Reference the Screen Spec for UI context and screen definitions.

- Vision Spec: `.specify/specs/vision/spec.md`
- Screen Spec: `.specify/specs/screen/spec.md`
- Domain boundaries:
- Core concepts:

### 1.2 System Context

```
[External System A] <---> [This System] <---> [External System B]
                              |
                              v
                        [Database/Storage]
```

- Upstream systems:
- Downstream systems:
- Integration points:

---

## 2. Actors and Roles

Reference from Vision Spec, with technical details added.

| Actor | Role | Permissions | Authentication |
|-------|------|-------------|----------------|
| [Actor 1] | [Role] | [What they can do] | [How they authenticate] |
| [Actor 2] | [Role] | [What they can do] | [How they authenticate] |

---

## 3. Master Data Definitions (M-*)

Define shared data models that are used across multiple features.
Feature specs MUST reference these by ID, not redefine them.

> **Note:** Screen ↔ Master ↔ API mappings are managed in `../matrix/cross-reference.json`.
> Run `node .claude/skills/spec-mesh/scripts/generate-matrix-view.cjs` to regenerate the view.

### M-[NAME]-001: [Entity Name]

**Purpose:** [Why this master exists]

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary identifier |
| [field] | [type] | [Yes/No] | [Description] |

**Relationships:**
- [Relationship to other masters]

**Constraints:**
- [Validation rules]
- [Invariants]

---

### M-[NAME]-002: [Entity Name]

**Purpose:** [Why this master exists]

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary identifier |

**Relationships:**
- [Relationships]

**Constraints:**
- [Constraints]

---

## 4. API Contracts (API-*)

Define shared API contracts that are used across multiple features.
Feature specs MUST reference these by ID when using them.

> **Note:** Screen ↔ API mappings and permissions are managed in `../matrix/cross-reference.json`.

### API-[RESOURCE]-[ACTION]-001: [API Name]

**Purpose:** [What this API does]

**Endpoint:**
```
[METHOD] /api/v1/[path]
```

**Request:**
```json
{
  "field": "type"
}
```

**Response (Success):**
```json
{
  "field": "type"
}
```

**Response (Error):**
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

**Error Codes:**
| Code | HTTP Status | Description |
|------|-------------|-------------|
| [CODE] | [4xx/5xx] | [When this occurs] |

**Authorization:** [Required role/permission]

---

### API-[RESOURCE]-[ACTION]-002: [API Name]

**Purpose:** [What this API does]

**Endpoint:**
```
[METHOD] /api/v1/[path]
```

[... same structure ...]

---

## 5. Business Rules

### 5.1 Domain Rules

Rules that apply across the entire domain.

| Rule ID | Description | Applies To |
|---------|-------------|------------|
| BR-001 | [Rule description] | [M-* or API-* affected] |
| BR-002 | [Rule description] | [M-* or API-* affected] |

### 5.2 Validation Rules

| Rule ID | Field/Entity | Validation | Error Message |
|---------|--------------|------------|---------------|
| VR-001 | [Field] | [Rule] | [Message] |

### 5.3 Calculation Rules

| Rule ID | Description | Formula/Logic |
|---------|-------------|---------------|
| CR-001 | [What is calculated] | [How it's calculated] |

---

## 6. Non-Functional Requirements

### 6.1 Performance

| Metric | Target | Measurement |
|--------|--------|-------------|
| API Response Time | < [X]ms (p95) | [How measured] |
| Throughput | [X] req/sec | [How measured] |

### 6.2 Security

- Authentication method:
- Authorization model:
- Data encryption:
- Audit requirements:

### 6.3 Reliability

- Availability target:
- Backup strategy:
- Disaster recovery:

### 6.4 Observability

- Logging standards:
- Metrics to collect:
- Tracing requirements:

---

## 7. Technology Decisions

### 7.1 Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Frontend | [Tech] | [Why] |
| Backend | [Tech] | [Why] |
| Database | [Tech] | [Why] |
| Infrastructure | [Tech] | [Why] |

### 7.2 External Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| [Library/Service] | [Version] | [What it's used for] |

---

## 8. Feature Index

All features that implement this domain. Updated as features are added.

| Feature ID | Title | Path | Status | Related M-*/API-* |
|------------|-------|------|--------|-------------------|
| S-{XXX}-001 | {Title} | `.specify/specs/s-xxx-001/` | {Status} | {M-*, API-*} |

**Status values (see constitution.md):** Draft | In Review | Clarified | Approved | Implemented

---

## 9. Open Questions

Technical questions that need to be resolved:

- [ ] [Question 1]
- [ ] [Question 2]

---

## 10. Clarifications

Record of clarification questions and answers during domain design.

| Date | Question | Answer | Impact |
|------|----------|--------|--------|
| {date} | {Question} | {Answer} | {How it affected the spec} |

---

## 11. Changelog

| Date | Change Type | Description | Issue |
|------|-------------|-------------|-------|
| {date} | Created | Initial domain specification | #XXX |

Change types: Created, Updated, Extended, Deprecated, Superseded

---

## 12. Implementation Notes

Notes discovered during implementation that may inform future changes.

- Technical constraints discovered:
- Design decisions made:
- Deviations from original spec (with justification):
