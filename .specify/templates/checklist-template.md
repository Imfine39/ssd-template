# Requirements Quality Checklist: [SPEC_ID]

Spec Type: [Vision | Domain | Feature]
Spec Title: [SPEC_TITLE]
Focus: [General | UX | API | Security | Performance | Data]
Generated: [DATE]
Spec Path: [PATH_TO_SPEC]

---

## Checklist Purpose: "Unit Tests for English"

This checklist validates the **quality of requirements writing**, not implementation correctness.

- ✅ "Are visual hierarchy requirements defined for all card types?" [Completeness]
- ✅ "Is 'fast loading' quantified with specific timing thresholds?" [Clarity]
- ❌ NOT "Verify the button clicks correctly" (that's an implementation test)

---

## Quality Summary

| Dimension | Items | Issues | Notes |
|-----------|-------|--------|-------|
| Completeness | [X] | [Y] | |
| Clarity | [X] | [Y] | |
| Consistency | [X] | [Y] | |
| Measurability | [X] | [Y] | |
| Coverage | [X] | [Y] | |

**Total Items:** [COUNT]
**Issues Found:** [COUNT]

---

## 1. Completeness

Are all necessary requirements present?

- [ ] CHK-001: [Question about missing requirements] [Gap]
- [ ] CHK-002: [Question about missing requirements] [Spec §X.Y]

---

## 2. Clarity

Are requirements unambiguous and specific?

- [ ] CHK-010: [Question about vague terms] [Ambiguity, Spec §X.Y]
- [ ] CHK-011: [Question about undefined terms] [Clarity]

---

## 3. Consistency

Do requirements align with each other?

- [ ] CHK-020: [Question about conflicting requirements] [Conflict, Spec §X vs §Y]
- [ ] CHK-021: [Question about alignment with Domain] [Consistency]

---

## 4. Measurability

Can requirements be objectively verified?

- [ ] CHK-030: [Question about unmeasurable criteria] [Measurability, Spec §X.Y]
- [ ] CHK-031: [Question about subjective terms] [Ambiguity]

---

## 5. Coverage

Are all scenarios and edge cases addressed?

- [ ] CHK-040: [Question about missing scenarios] [Gap, Edge Case]
- [ ] CHK-041: [Question about exception flows] [Coverage]

---

## 6. Domain-Specific: [DOMAIN]

[Only included if domain-specific focus selected]

### UX Focus
- [ ] CHK-UX-001: Are visual hierarchy requirements defined with measurable criteria?
- [ ] CHK-UX-002: Are interaction states (hover, focus, active, disabled) consistently defined?
- [ ] CHK-UX-003: Are responsive/adaptive breakpoint requirements specified?
- [ ] CHK-UX-004: Are accessibility requirements (WCAG level) defined?
- [ ] CHK-UX-005: Are error, empty, and loading state requirements specified?

### API Focus
- [ ] CHK-API-001: Are request/response shapes completely defined?
- [ ] CHK-API-002: Are all error codes and messages documented?
- [ ] CHK-API-003: Are authentication/authorization requirements clear?
- [ ] CHK-API-004: Are rate limiting thresholds specified?
- [ ] CHK-API-005: Is pagination/filtering behavior defined?

### Security Focus
- [ ] CHK-SEC-001: Is the authentication mechanism fully specified?
- [ ] CHK-SEC-002: Is the authorization model (roles, permissions) defined?
- [ ] CHK-SEC-003: Are data protection requirements (encryption, masking) specified?
- [ ] CHK-SEC-004: Are input validation requirements comprehensive?
- [ ] CHK-SEC-005: Are audit logging requirements defined?

### Performance Focus
- [ ] CHK-PERF-001: Are latency targets quantified (p50, p95, p99)?
- [ ] CHK-PERF-002: Are throughput requirements specified?
- [ ] CHK-PERF-003: Are resource limits defined?
- [ ] CHK-PERF-004: Is degradation behavior under load specified?
- [ ] CHK-PERF-005: Is caching strategy documented?

### Data Focus
- [ ] CHK-DATA-001: Are data integrity constraints defined?
- [ ] CHK-DATA-002: Are validation rules comprehensive?
- [ ] CHK-DATA-003: Is data migration strategy documented?
- [ ] CHK-DATA-004: Are retention/archival requirements specified?
- [ ] CHK-DATA-005: Is cross-entity consistency addressed?

---

## Action Items

Issues that should be addressed before proceeding:

| Priority | Item ID | Issue | Recommended Action |
|----------|---------|-------|--------------------|
| High | CHK-XXX | [Issue description] | [Recommended fix] |
| Medium | CHK-XXX | [Issue description] | [Recommended fix] |
| Low | CHK-XXX | [Issue description] | [Recommended fix or accept as-is] |

---

## Resolution Log

Record how issues were addressed:

| Item ID | Resolution | Date | Notes |
|---------|------------|------|-------|
| CHK-XXX | Addressed via clarify | [DATE] | [Brief note] |
| CHK-XXX | Accepted as-is | [DATE] | [Justification] |
| CHK-XXX | Deferred to implementation | [DATE] | [Reason] |

---

## Notes

- Use `[x]` to mark items as verified/addressed
- Items marked `[Gap]` indicate missing requirements
- Items marked `[Ambiguity]` indicate unclear requirements
- Items marked `[Conflict]` indicate inconsistent requirements
- Reference `[Spec §X.Y]` to link to specific spec sections
- High priority issues should be addressed before `/speckit.plan`
