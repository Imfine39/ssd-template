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

## Execution Protocol (MUST FOLLOW)

**Before starting:**

1. Use **TodoWrite** to create todos for all main Steps:
   - "Step 1: Identify feedback type"
   - "Step 2: Locate relevant spec"
   - "Step 3: Record feedback"
   - "Step 4: Update spec"
   - "Step 5: Assess severity"
   - "Step 6: Handle major changes (if needed)"

**During execution:**

2. Before each Step: Mark the corresponding todo as `in_progress`
3. After each Step:
   - Run the **Self-Check** at the end of that Step
   - Only if Self-Check passes: Mark todo as `completed`
   - Output: `✓ Step N 完了: [1-line summary]`

**Rules:**

- **DO NOT** skip any Step
- **DO NOT** mark a Step as completed before its Self-Check passes
- If a Self-Check fails: Fix the issue before proceeding

## Steps

1. **Identify the feedback type** from `$ARGUMENTS`:
   - `constraint` - Technical limitation that affects the spec
   - `discovery` - New requirement or behavior discovered
   - `clarification` - Ambiguity that was resolved during implementation
   - `decision` - Design decision that should be documented
   - `deviation` - Intentional deviation from spec (with justification)
   - `screen` - UI/UX feedback that affects Screen Spec (layout, navigation, usability)

#### Self-Check (Step 1)

- [ ] $ARGUMENTS からフィードバックタイプを抽出したか
- [ ] 有効なタイプ（constraint/discovery/clarification/decision/deviation/screen）か確認したか

2. **Locate the relevant spec**:
   - Find the spec being implemented (from branch name or context)
   - Read the current spec content
   - Identify the affected sections (UC, FR, SC, etc.)
   - For `screen` type: Also check Screen Spec (`.specify/specs/screen/spec.md`)

#### Self-Check (Step 2)

- [ ] 関連する Spec を Read ツールで読み込んだか
- [ ] 影響を受けるセクション（UC/FR/SC 等）を特定したか
- [ ] screen タイプの場合、Screen Spec も確認したか

3. **Record the feedback**:

   For each feedback item, capture:
   - Type (from step 1)
   - Affected spec IDs (S-XXX, UC-XXX, FR-XXX)
   - Description of the feedback
   - Impact on the spec
   - Proposed resolution (if any)

#### Self-Check (Step 3)

- [ ] フィードバック項目を構造化して記録したか
- [ ] 影響を受ける Spec ID を特定したか

4. **Update the spec**:
   - Add entry to the **Changelog** section (typically near the end of spec):

     ```
     | [DATE] | [Type] | [Description] | #[Issue] |
     ```

   - Add details to the **Implementation Notes** section (last section of spec):
     ```
     - Technical constraints discovered:
       - [Constraint description and impact]
     - Design decisions made during implementation:
       - [Decision and rationale]
     - Deviations from original spec (with justification):
       - [Deviation, reason, and approval status]
     ```

#### Self-Check (Step 4)

- [ ] Changelog エントリを追加したか
- [ ] Implementation Notes セクションを更新したか

5. **Assess severity**:
   - **Minor** (no spec change needed): Just document in Implementation Notes.
   - **Moderate** (spec clarification needed): Update affected UC/FR/SC.
   - **Major** (spec change needed): Create Issue, follow spec change workflow.

#### Self-Check (Step 5)

- [ ] 深刻度（Minor/Moderate/Major）を判定したか
- [ ] 判定に基づいて次のアクションを決定したか

6. **If major change needed**:
   - Do NOT modify UC/FR/SC directly.
   - Create an Issue with label `spec-change`.
   - Reference the affected spec IDs.
   - Propose the change for review.
   - Continue implementation with current spec until change is approved.

   **If switching to `/speckit.change`**, suspend current work:

   ```bash
   # Suspend current branch before switching to spec change
   node .specify/scripts/state.cjs suspend --branch <current-branch> --reason spec-change --related <issue-num>

   # After spec change is merged, resume
   node .specify/scripts/state.cjs resume --branch <current-branch> --step implement
   ```

#### Self-Check (Step 6)

- [ ] Major 変更の場合、Issue を作成したか
- [ ] /speckit.change への切り替えが必要な場合、作業を中断したか
- [ ] 全ての Step が完了し、todo を全て `completed` にマークしたか

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

### Example 4: Screen/UI Feedback

Input: `screen: SCR-003 のフィルターパネルはモバイルでは使いづらい、アコーディオン形式に変更推奨`

Output:

- Feature Spec Implementation Notes: "UI feedback: filter panel needs mobile-friendly design"
- Screen Spec Changelog: `| 2025-01-15 | Feedback | SCR-003 filter panel mobile improvement needed | #48 |`
- If layout change required: Issue created for Screen Spec update via `/speckit.change`
- Affected SCR-\*: SCR-003

### Example 5: Screen Discovery

Input: `screen: 実装中に確認ダイアログが必要と判明、Screen Spec に未定義`

Output:

- Feature Spec Section 8.3: New modal component needed
- Issue created: "Screen addition: SCR-CONFIRM-MODAL - Delete confirmation dialog"
- Screen Spec updated via `/speckit.change`
- **Matrix update**: New screen added to `cross-reference.json`

---

## Cross-Reference Matrix Update

**`screen` タイプのフィードバックで Matrix 更新が必要な場合:**

1. **新規画面追加の場合**:
   - Screen Spec に SCR-* を追加
   - Matrix の `screens` に新エントリを追加
   ```json
   "screens": {
     "SCR-NEW": {
       "name": "[画面名]",
       "masters": ["M-XXX"],
       "apis": ["API-XXX"]
     }
   }
   ```

2. **既存画面の API/Master 変更の場合**:
   - Matrix の該当 `screens` エントリを更新

3. **Feature との関連更新**:
   - Matrix の `features` の該当エントリに新規 SCR-* を追加

4. **Regenerate Matrix view**:
   ```bash
   node .specify/scripts/generate-matrix-view.cjs
   ```

**Note:** Screen フィードバックが Major 変更（新規画面追加等）の場合は `/speckit.change` を経由するため、Matrix 更新もその中で行われる。
