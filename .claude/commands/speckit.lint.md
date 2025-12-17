---
description: Run spec lint to check Vision/Domain/Screen/Feature consistency.
---

Run from the repo root:

```bash
node .specify/scripts/spec-lint.cjs
```

What this checks:

- Spec Type and Spec ID are present in each spec.md
- Spec IDs and UC IDs are unique across all specs
- Feature specs only reference masters/APIs defined in Domain specs
- Feature specs only reference screens (SCR-*) defined in Screen specs
- Warns when Domain masters/APIs are not referenced by any Feature
- Warns when Screen SCR-* are not referenced by any Feature
- Screen Index table validation in Screen Spec

Exit codes:

- `0` when clean (or warnings only)
- `1` when errors are found (treat as PR blocker)

## Validation Examples

**Domain validation:**
```
ERROR: Unknown master "M-INVENTORY" referenced in feature .specify/specs/s-inv-001/spec.md; update Domain spec first.
WARNING: API "API-REPORTS-EXPORT" defined in Domain is not referenced by any feature.
```

**Screen validation:**
```
ERROR: Unknown screen "SCR-005" referenced in feature .specify/specs/s-orders-001/spec.md; update Screen spec first.
WARNING: Screen "SCR-SETTINGS" defined in Screen spec is not referenced by any feature.
```
