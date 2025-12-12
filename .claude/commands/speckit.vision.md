---
description: Create Vision Spec (Purpose + Journeys). First step for new projects.
handoffs:
  - label: Continue to Design
    agent: speckit.design
    prompt: Create Domain Spec with technical details
    send: true
---

## User Input

```text
$ARGUMENTS
```

## Purpose

**First step** for new projects. Creates Vision Spec that defines:
- Why we're building this system
- Who will use it and what problems it solves
- Main user journeys (high-level)
- Project scope

**Use this when:** Starting a new project, before any technical design.
**Next steps:** `/speckit.design` (technical design with Feature proposal)

## Prerequisites

- None (this is the starting point)

## Steps

### Step 1: Gather Initial Context

1) **Parse project description**:
   - Extract from `$ARGUMENTS`
   - If empty, ask user to describe the project

2) **Ask initial questions**:
   - What problem are you trying to solve?
   - Who are the target users?
   - What does success look like?

### Step 2: Create Vision Spec

3) **Scaffold Vision spec**:
   ```bash
   node .specify/scripts/scaffold-spec.js --kind vision --id S-VISION-001 --title "[Project Name]"
   ```

4) **Fill Vision spec sections**:
   - Section 1 (System Purpose): Problem, vision statement, success definition
   - Section 2 (Target Users): Primary/secondary users, stakeholders
   - Section 3 (User Journeys): High-level journeys (3-5 main journeys)
   - Section 4 (Scope): In-scope, out-of-scope, future considerations
   - Section 5 (Constraints): Business/technical constraints, assumptions
   - Section 6 (Risks): Key risks and mitigations
   - Mark unclear items as `[NEEDS CLARIFICATION]`

### Step 3: Clarify Loop

5) **Clarify loop** (Vision-focused taxonomy):
   - While `[NEEDS CLARIFICATION]` items exist:
     - Show **1 question at a time** with recommended option
     - Focus on:
       - System purpose and goals
       - Target users and their needs
       - User journey details
       - Scope boundaries
     - Wait for answer
     - Update spec **immediately**
   - Continue until all resolved

### Step 4: Request Human Review

6) **Show Vision summary**:
   ```
   === Vision Spec Summary ===

   Purpose: [Brief description]

   Target Users:
   - [User 1]: [Goal]
   - [User 2]: [Goal]

   Main Journeys:
   1. [Journey 1]
   2. [Journey 2]
   3. [Journey 3]

   Scope:
   - In: [Key items]
   - Out: [Key items]

   Spec: .specify/specs/vision/spec.md
   ```

7) **Request approval**:
   - Wait for human to review and approve
   - Offer to adjust based on feedback

### Step 5: Update State

8) **Update repo state** (on approval):
   ```bash
   node .specify/scripts/state.js repo --set-vision-status approved --set-vision-clarify true --set-phase vision
   ```

## Output

- Vision spec path
- Summary of purpose, users, journeys
- Next step recommendation:
  - `/speckit.design` - Define technical details (M-*/API-*) and propose Features

## Human Checkpoints

1. Answer clarification questions (in loop)
2. Review and approve Vision spec

## Clarify Taxonomy (Vision)

Focus areas for Vision clarification:

1. **System Purpose**
   - Core problem being solved
   - Business value / ROI
   - Success metrics

2. **Target Users**
   - Primary user personas
   - User goals and motivations
   - Pain points being addressed

3. **User Journeys**
   - Main workflows
   - Entry/exit points
   - Happy path scenarios

4. **Scope**
   - Must-have vs nice-to-have
   - Explicit exclusions
   - Phase boundaries

5. **Constraints**
   - Timeline constraints
   - Budget constraints
   - Technical constraints (existing systems, compliance)

6. **Risks**
   - Key uncertainties
   - Dependencies on external factors

## Example

```
Human: /speckit.vision 中小企業向けの在庫管理システム

AI: 新しいプロジェクトの Vision Spec を作成します。

    いくつか質問させてください。

    === Clarify: Vision (Q1) ===

    **質問**: このシステムで解決したい主な課題は何ですか？

    **Recommended:** Option A - 最も一般的な在庫管理の課題

    | Option | Description |
    |--------|-------------|
    | A | 在庫の過不足（欠品・過剰在庫）を防ぎたい |
    | B | 棚卸し作業を効率化したい |
    | C | 複数拠点の在庫を一元管理したい |
    | Other | 別の課題 |