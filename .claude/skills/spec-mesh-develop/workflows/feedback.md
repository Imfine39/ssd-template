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
| Vision | `.specify/specs/overview/vision/spec.md` | Implementation Notes |
| Domain | `.specify/specs/overview/domain/spec.md` | Implementation Notes |
| Screen | `.specify/specs/overview/screen/spec.md` | Implementation Notes |
| Feature | `.specify/specs/features/{id}/spec.md` | Clarifications |
| Fix | `.specify/specs/fixes/{id}/spec.md` | Clarifications |

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

### Step 3: Impact Analysis（影響分析）

フィードバックを記録する前に、影響範囲を確認：

> **共通コンポーネント参照:** [shared/impact-analysis.md](shared/impact-analysis.md) を **FULL モード** で実行

#### 実行理由

フィードバックは複数の Spec に影響を与える可能性が高い：
- 技術的制約 → Domain の API 定義に影響
- 設計決定 → Screen/Feature 両方に影響
- エッジケース → Feature の UC/FR に影響

#### 影響分析の出力

```
=== Impact Analysis (FULL) ===

フィードバック: API レート制限のためキャッシュが必要
影響度: HIGH

上流影響:
- S-ORDERS-001: UC-ORDERS-002 でAPI呼び出し → キャッシュ戦略の記載必要
- S-DASHBOARD-001: リアルタイム更新仕様 → 更新間隔の見直し必要

下流依存:
- API-ORDER-LIST: レート制限の明記が必要

必要なアクション:
1. Domain Spec に API レート制限を追記
2. S-ORDERS-001, S-DASHBOARD-001 の Implementation Notes を更新
```

### Step 4: Update Spec

1. **Read current Spec:**
   ```
   Read tool: {spec_path}
   ```

   Spec タイプに応じたパス:
   - Vision: `.specify/specs/overview/vision/spec.md`
   - Domain: `.specify/specs/overview/domain/spec.md`
   - Screen: `.specify/specs/overview/screen/spec.md`
   - Feature: `.specify/specs/features/{id}/spec.md`
   - Fix: `.specify/specs/fixes/{id}/spec.md`

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

4. **Cross-update related Specs** based on Impact Analysis results:
   - Impact Analysis で特定された全 Spec を更新
   - Domain 変更 → Screen/Feature への影響を反映
   - Screen 変更 → Feature への影響を反映

### Step 5: Run Lint

```bash
node .claude/skills/spec-mesh/scripts/spec-lint.cjs
```

### Step 6: Summary

Display:
```
=== Feedback 記録完了 ===

Spec: {spec_path}
Spec Type: {Vision|Domain|Screen|Feature|Fix}
Section: {Clarifications|Implementation Notes}

記録内容:
- Type: {Feedback Type}
- Title: {Title}
- Impact: {影響度}

関連 Spec への影響（Impact Analysis 結果）:
- {related_spec_1}: {更新内容}
- {related_spec_2}: {更新内容}

実装を続行してください: implement ワークフロー
```

---

## Self-Check

- [ ] Feedback の種類を特定したか
- [ ] 人間の承認を得たか
- [ ] **Impact Analysis (FULL) を実行したか**
- [ ] Spec の Clarifications セクションに追記したか
- [ ] **影響を受ける関連 Spec も更新したか**
- [ ] spec-lint を実行したか

---

## Next Steps

**[HUMAN_CHECKPOINT]** フィードバック記録の内容を確認してから次のステップに進んでください。

| Condition | Workflow | Description |
|-----------|----------|-------------|
| 実装を続行する場合 | implement | 実装続行 |
| 実装完了の場合 | pr | PR 作成 |
