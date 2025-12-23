---
name: test-skill
description: |
  Test skill to verify routing and workflow delegation.
  Use when testing skill architecture patterns.
---

# Test Skill (Router Pattern)

This skill tests the router pattern where SKILL.md delegates to workflow files.

## Routing Table

| ARGUMENTS | Workflow File |
|-----------|---------------|
| greet | workflows/greet.md |
| calc | workflows/calc.md |
| (none) | Show help message |

## Instructions

1. Parse ARGUMENTS
2. If ARGUMENTS matches a workflow in the routing table:
   - Use Read tool to load `workflows/{ARGUMENTS}.md`
   - Follow the instructions in that workflow file
3. If no ARGUMENTS or unknown:
   - Output: "Available workflows: greet, calc"

## Important

- The workflow files contain the actual logic
- This SKILL.md is just a lightweight router
- This pattern prevents SKILL.md bloat
