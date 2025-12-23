# Spec-Mesh Investigation Results

Comprehensive investigation of all workflows, templates, agents, guides, and scripts.

**Investigation Date:** 2025-12-23
**Status:** Complete

---

## Executive Summary

| Category | Files | Critical | Major | Minor | Total Issues |
|----------|-------|----------|-------|-------|--------------|
| Entry Point Workflows | 6 | 2 | 8 | 5 | 15 |
| Development Workflows | 4 | 3 | 4 | 3 | 10 |
| Quality Workflows | 6 | 2 | 8 | 2 | 12 |
| Test Workflows | 2 | 3 | 6 | 2 | 11 |
| Templates | 12 | 3 | 6 | 9 | 18 |
| Scripts | 10 | 2 | 6 | 7 | 15 |
| Guides & Agents | 8 | 2 | 6 | 2 | 10 |
| **TOTAL** | **48** | **17** | **44** | **30** | **91** |

---

## Priority 1: Critical Issues (17 items)

### Must Fix Before Use

| # | Category | File | Issue | Impact |
|---|----------|------|-------|--------|
| 1 | Entry Point | issue.md | **Missing Multi-Review step entirely** | Quality gate bypassed for Features created from Issues |
| 2 | Entry Point | vision.md | **References non-existent spec-author.md agent** | Users directed to non-existent documentation |
| 3 | Development | implement.md | **E2E test workflow reference missing** | Unclear when/how to run E2E tests |
| 4 | Development | plan.md, tasks.md | **Template paths use relative format** | May fail to find templates in different contexts |
| 5 | Quality | review.md | **Multi-Review parallel execution syntax undefined** | Cannot implement 3-agent review without concrete instructions |
| 6 | Quality | review.md | **Agent delegation mechanism unclear** | No clear instruction on HOW to invoke 3 parallel agents |
| 7 | Test | test-scenario.md | **scaffold-spec.cjs doesn't support test-scenario kind** | Test scenario specs cannot be created via CLI |
| 8 | Test | test-scenario.md | **Template reference mismatch** | Step 7 scaffold will fail |
| 9 | Test | e2e.md | **Missing test-scenario spec path convention** | Workflow assumes file exists without clarifying location |
| 10 | Templates | domain-spec.md | **M-* ID format inconsistent** | M-USER vs M-USER-001 unclear |
| 11 | Templates | feature-spec.md | **API ID format mismatch with id-naming.md** | API-XXX-001 vs API-USER-CREATE |
| 12 | Templates | domain-spec.md | **API section header has undocumented -001 suffix** | Inconsistent with id-naming.md |
| 13 | Scripts | reset-input.cjs | **Incorrect INPUT_DIR path** | Points to wrong directory |
| 14 | Scripts | reset-input.cjs | **Template path mismatch with preserve-input.cjs** | Input files won't be found |
| 15 | Guides | id-naming.md | **Fix Spec ID format mismatch** | F-{AREA}-{NNN} vs constitution terminology |
| 16 | Guides | constitution.md | **Multi-Review described as automatic but position unclear** | Workflow sequence confusion |
| 17 | Guides | id-naming.md | **CHK format has variant definitions** | CHK-{DOMAIN}-{NNN} vs CHK-UX-001 |

---

## Priority 2: Major Issues (44 items)

### Should Fix Soon

#### Entry Point Workflows (8)
1. design.md: Foundation Issue created before Multi-Review (illogical sequence)
2. add.md, fix.md, design.md: preserve-input.cjs parameter syntax inconsistent
3. vision.md, design.md: state.cjs parameter names inconsistent
4. issue.md: state.cjs uses branch context inconsistently
5. add.md, fix.md: Missing ambiguity marker count in summary
6. design.md: "Preserve Vision Input" mislabeled (should be "Design Input")
7. All entry points: No HUMAN_CHECKPOINT marked before next workflow
8. design.md: Example ID S-SCREEN-001 inconsistent with standard format

#### Development Workflows (4)
1. plan.md: Domain Spec path pattern not specified
2. pr.md: Post-merge Screen Status update not clearly mandatory
3. tasks.md: Test requirements specification vague
4. implement.md: Feedback approval flow unclear (reference feedback.md)

#### Quality Workflows (8)
1. review.md → lint.md: Potential circular dependency
2. clarify.md: Batch handling for >4 ambiguities not documented
3. clarify.md: Missing link from Review workflow
4. lint.md: Auto-fix execution model ambiguous
5. analyze.md: Success criteria not defined
6. checklist.md: Relationship with Review unclear (before/after?)
7. checklist.md: Quality Score thresholds seem arbitrary
8. feedback.md: Only covers Feature Spec, not Domain/Screen

#### Test Workflows (6)
1. test-scenario.md: Review workflow reference incomplete
2. test-scenario.md: Test data confirmation process not formalized
3. e2e.md: Tool references use MCP function names (not human-readable)
4. e2e.md: GIF export destination not specified
5. test-scenario.md: Next steps guidance contradicts CLAUDE.md sequence
6. e2e.md: Element reference mapping (SCR-* to DOM) not documented

#### Templates (6)
1. feature-spec.md: cross-reference.json not explained as auto-generated
2. screen-spec.md: cross-reference.json references need clarification
3. test-scenario-spec.md: TC-* IDs not defined in id-naming.md
4. checklist.md: CHK-001 without domain conflicts with id-naming.md
5. fix-spec.md: F-* pattern not officially documented
6. All templates: Status values not globally defined

#### Scripts (6)
1. scaffold-spec.cjs: Missing test-scenario support
2. validate-matrix.cjs: Hardcoded path conflicts with new structure
3. reset-input.cjs vs preserve-input.cjs: Different base paths
4. state.cjs: Vision Spec path hardcoded (not project-aware)
5. state.cjs: Domain legacy path support incomplete
6. generate-matrix-view.cjs: Hardcoded legacy matrix path

#### Guides & Agents (6)
1. constitution.md: Spec Terminology gaps (Fix Spec, Test Scenario)
2. developer.md: E2E section ordering ambiguity
3. error-recovery.md: Overlap with parallel-development.md
4. id-naming.md: Missing Fix Spec ID section
5. reviewer.md: Output format generic (no concrete examples)
6. parallel-development.md: Feature Index update procedure missing

---

## Priority 3: Minor Issues (30 items)

### Nice to Have

- Next Steps table format inconsistent across workflows
- Missing error handling documentation for scripts
- ~~Placeholder syntax inconsistent (`[PLACEHOLDER]` vs `[PATH]` vs `[DATE]`)~~ **FIXED: Standardized to `{placeholder}` format**
- HUMAN_CHECKPOINT trigger conditions not defined
- Various documentation gaps and redundancies

---

## Cross-Reference Integrity Issues

### Critical Misalignments

| Connection | Status | Issue |
|------------|--------|-------|
| issue.md → review.md | **BROKEN** | issue.md doesn't call Multi-Review |
| scaffold-spec.cjs → test-scenario template | **BROKEN** | Script doesn't support test-scenario kind |
| reset-input.cjs → preserve-input.cjs | **BROKEN** | Different INPUT_DIR paths |
| vision.md → spec-author.md | **BROKEN** | Agent file doesn't exist |
| validate-matrix.cjs → spec-lint.cjs | **MISALIGNED** | Different matrix path discovery |

### Workflow Sequence Issues

```
Constitution Workflow:
1. Entry → 2. Multi-Review → 3. Clarify → 4. Test-Scenario → 5. Plan → 6. Tasks → 7. Implement → 8. E2E → 9. PR

Actual Implementation:
- issue.md: Missing step 2 (Multi-Review)
- test-scenario.md: Suggests E2E as next step (skips Plan/Tasks/Implement)
- design.md: Creates Issue before Multi-Review (wrong order)
```

---

## Recommended Fix Order

### Phase 1: Blockers (Week 1)
1. Add Multi-Review to issue.md
2. Add test-scenario support to scaffold-spec.cjs
3. Fix reset-input.cjs path mismatch
4. Remove spec-author.md reference from vision.md
5. Define Multi-Review parallel execution syntax in review.md

### Phase 2: Consistency (Week 2)
1. Standardize ID formats across templates and id-naming.md
2. Fix all hardcoded paths in scripts
3. Add HUMAN_CHECKPOINT to all entry point summaries
4. Clarify cross-reference.json as auto-generated

### Phase 3: Documentation (Week 3)
1. Add concrete examples to reviewer.md output format
2. Document Review → Clarify → Lint sequence clearly
3. Standardize status values across all templates
4. Add Feature Index maintenance procedure

### Phase 4: Polish (Week 4)
1. Standardize placeholder syntax
2. Add error handling documentation
3. Remove redundancy between guides
4. Add missing templates (cross-reference schema, etc.)

---

## Files Requiring Immediate Attention

| Priority | File | Action Required |
|----------|------|-----------------|
| P1 | workflows/issue.md | Add Multi-Review step (Step 7) |
| P1 | scripts/scaffold-spec.cjs | Add test-scenario to VALID_KINDS |
| P1 | scripts/reset-input.cjs | Fix INPUT_DIR path |
| P1 | workflows/vision.md | Remove spec-author.md reference |
| P1 | workflows/review.md | Define 3-agent parallel execution syntax |
| P2 | templates/domain-spec.md | Clarify M-* and API-* ID formats |
| P2 | guides/id-naming.md | Add Fix Spec and Test Scenario ID sections |
| P2 | workflows/design.md | Move Foundation Issue after Multi-Review |
| P2 | all entry workflows | Add [HUMAN_CHECKPOINT] to summaries |

---

## Appendix: Investigation Agents Summary

| Agent | Target | Files Read | Issues Found |
|-------|--------|------------|--------------|
| Entry Point Workflows | 6 workflows | 15+ files | 15 issues |
| Development Workflows | 4 workflows | 20+ files | 10 issues |
| Quality Workflows | 6 workflows | 18+ files | 12 issues |
| Test Workflows | 2 workflows | 15+ files | 11 issues |
| Templates | 12 templates | 20+ files | 18 issues |
| Scripts | 10 scripts | 25+ files | 15 issues |
| Guides & Agents | 8 files | 15+ files | 10 issues |

**Total Files Analyzed:** 48 primary + 128 cross-references
**Total Issues Identified:** 91
**Investigation Duration:** Parallel execution across 7 agents

---

## Next Steps

1. Review this report with stakeholders
2. Prioritize fixes based on team capacity
3. Create GitHub Issues for Phase 1 items
4. Execute fixes in recommended order
5. Re-run investigation after Phase 2 to verify improvements
