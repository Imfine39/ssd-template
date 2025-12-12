---
description: Run spec lint to check Vision/Domain/Feature consistency.
---

Run from the repo root:

```bash
node .specify/scripts/spec-lint.js
```

What this checks:

- Spec Type and Spec ID are present in each spec.md
- Spec IDs and UC IDs are unique across all specs
- Feature specs only reference masters/APIs defined in Domain specs
- Warns when Domain masters/APIs are not referenced by any Feature

Exit codes:

- `0` when clean (or warnings only)
- `1` when errors are found (treat as PR blocker)
