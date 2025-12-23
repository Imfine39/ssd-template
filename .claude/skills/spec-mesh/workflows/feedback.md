# Feedback Workflow

Record implementation discoveries back to the spec.

## Purpose

During implementation, you may discover:
- Technical constraints not documented in spec
- Ambiguities that required decisions
- Better approaches than originally planned
- Edge cases not considered

This workflow records these discoveries for future reference.

---

## Supported Spec Types

このワークフローは以下の全 Spec タイプに対応:

| Spec Type | Path | Feedback セクション |
|-----------|------|-------------------|
| Vision | `.specify/specs/{project}/overview/vision/spec.md` | Implementation Notes |
| Domain | `.specify/specs/{project}/overview/domain/spec.md` | Implementation Notes |
| Screen | `.specify/specs/{project}/overview/screen/spec.md` | Implementation Notes |
| Feature | `.specify/specs/{project}/features/{id}/spec.md` | Clarifications |
| Fix | `.specify/specs/{project}/fixes/{id}/spec.md` | Clarifications |

---

## Steps

### Step 1: Identify Feedback Type

| Type | Description | Example |
|------|-------------|---------|
| Constraint | Technical limitation discovered | "API rate limit requires caching" |
| Decision | Ambiguity resolved during implementation | "Chose pagination over infinite scroll" |
| Improvement | Better approach found | "Used WebSocket instead of polling" |
| Edge Case | Unspecified scenario handled | "Empty state handling added" |

### Step 2: Get Human Approval

```
実装中に以下の発見がありました:

Type: {Feedback Type}
Description: {詳細}
Impact: {Spec への影響}

この内容を Spec に記録してよいですか？ (y/N)
```

### Step 3: Update Spec

1. **Read current Spec:**
   ```
   Read tool: {spec_path}
   ```

   Spec タイプに応じたパス:
   - Vision: `.specify/specs/{project}/overview/vision/spec.md`
   - Domain: `.specify/specs/{project}/overview/domain/spec.md`
   - Screen: `.specify/specs/{project}/overview/screen/spec.md`
   - Feature: `.specify/specs/{project}/features/{id}/spec.md`
   - Fix: `.specify/specs/{project}/fixes/{id}/spec.md`

2. **Add to appropriate section:**

   **For Feature/Fix Specs (Clarifications section):**
   ```markdown
   ## Clarifications

   ### Implementation Feedback (YYYY-MM-DD)

   **{Feedback Type}**: {Title}
   - Context: {背景}
   - Decision: {決定内容}
   - Rationale: {理由}
   ```

   **For Vision/Domain/Screen Specs (Implementation Notes section):**
   ```markdown
   ## Implementation Notes

   ### Feedback (YYYY-MM-DD)

   **{Feedback Type}**: {Title}
   - Context: {背景}
   - Decision: {決定内容}
   - Rationale: {理由}
   - Affected Items: {影響を受ける M-*/API-*/SCR-* ID}
   ```

3. **Update affected sections** if needed

4. **Cross-update related Specs** if the feedback affects multiple Specs:
   - Domain 変更 → Screen/Feature への影響を確認
   - Screen 変更 → Feature への影響を確認

### Step 4: Run Lint

```bash
node .claude/skills/spec-mesh/scripts/spec-lint.cjs
```

### Step 5: Summary

Display:
```
=== Feedback 記録完了 ===

Spec: {spec_path}
Spec Type: {Vision|Domain|Screen|Feature|Fix}
Section: {Clarifications|Implementation Notes}

記録内容:
- Type: {Feedback Type}
- Title: {Title}

{関連 Spec がある場合}
関連 Spec への影響:
- {related_spec_path}: {影響内容}

実装を続行してください: `/spec-mesh implement`
```

---

## Self-Check

- [ ] Feedback の種類を特定したか
- [ ] 人間の承認を得たか
- [ ] Spec の Clarifications セクションに追記したか
- [ ] spec-lint を実行したか

---

## Next Steps

**[HUMAN_CHECKPOINT]** フィードバック記録の内容を確認してから次のステップに進んでください。

| Condition | Command | Description |
|-----------|---------|-------------|
| 実装を続行する場合 | `/spec-mesh implement` | 実装続行 |
| 実装完了の場合 | `/spec-mesh pr` | PR 作成 |
