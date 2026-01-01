# Quality Gates

Defines the quality checkpoints and review processes in SSD workflow.

---

## CLARIFY GATE
<!-- SSOT: CLARIFY GATE 定義 -->
<!-- 他のファイルはこのセクションを参照すること。定義の複製禁止。 -->
<!-- アンカー: #clarify-gate -->

### Definition
A mandatory gate before proceeding to Plan phase.

### Pass Conditions

| 状態 | 条件 | 次のステップ |
|------|------|-------------|
| **PASSED** | `[NEEDS CLARIFICATION]` = 0 かつ `[DEFERRED]` = 0 | [HUMAN_CHECKPOINT] へ |
| **PASSED_WITH_DEFERRED** | `[NEEDS CLARIFICATION]` = 0 かつ `[DEFERRED]` ≥ 1 | [HUMAN_CHECKPOINT] へ（リスク確認） |
| **BLOCKED** | `[NEEDS CLARIFICATION]` ≥ 1 | clarify ワークフローへ |

### Purpose
- Ensure all ambiguities are resolved before implementation planning
- Prevent assumptions and guesswork from propagating to code
- Maintain spec-to-code traceability
- Allow progress with documented risks when items cannot be decided now

### PASSED_WITH_DEFERRED の扱い

1. **リスク記録**: Risks セクションに [DEFERRED] 項目の影響を記載
2. **HUMAN_CHECKPOINT**: [DEFERRED] 項目を人間に提示し、先に進むことを確認
3. **実装フェーズ**: [DEFERRED] 項目に遭遇した場合、clarify に戻る

### Flow
```
Spec作成 → Multi-Review → Lint → マーカーカウント
                                        │
            ┌───────────────────────────┤
            │                           │
            ▼                           ▼
[NEEDS CLARIFICATION] > 0    [NEEDS CLARIFICATION] = 0
            │                           │
            ▼                           ├── [DEFERRED] = 0 → PASSED
         BLOCKED                        │
            │                           └── [DEFERRED] > 0 → PASSED_WITH_DEFERRED
            ▼                                      │
         clarify                                   ▼
            │                           [HUMAN_CHECKPOINT]
            └──→ Multi-Review                (リスク確認)
                 (ループ)                        │
                                                 ▼
                                              Plan へ
```

---

## Multi-Review
<!-- SSOT: Multi-Review 3観点定義 -->
<!-- 他のファイルはこのセクションを参照すること。定義の複製禁止。 -->
<!-- アンカー: #multi-review -->

### Definition
Parallel review from 3 perspectives immediately after Spec creation.

### Three Perspectives

| Reviewer | Focus | Checks |
|----------|-------|--------|
| **A: 構造** | Template準拠、形式 | セクション構造、ID命名規則、必須項目 |
| **B: 内容** | 整合性、矛盾 | 用語統一、要件間の矛盾、依存関係 |
| **C: 完全性** | 網羅性、欠落 | スコープカバレッジ、エッジケース、未定義項目 |

### Output
- Critical/Major/Minor issues identified
- AI-fixable issues corrected automatically
- Remaining issues marked for human review

---

## HUMAN_CHECKPOINT Policy
<!-- SSOT: HUMAN_CHECKPOINT ポリシー定義 -->
<!-- 他のファイルはこのセクションを参照すること。定義の複製禁止。 -->
<!-- アンカー: #human-checkpoint-policy -->

Human checkpoints are mandatory gates that require explicit human approval.
Never proceed past a checkpoint without confirmation.

### Trigger Conditions

| Checkpoint | When | What Human Verifies |
|------------|------|---------------------|
| **Spec Approval** | After Spec + Multi-Review + Lint | Content accuracy, scope, business alignment |
| **Plan Approval** | After Plan creation | Technical approach, work breakdown, risks |
| **Feedback Recording** | Before updating Spec with discoveries | Feedback accuracy, appropriateness |
| **Case 3 Decision** | When M-*/API-* modification needed | Impact scope acceptable |
| **Irreversible Actions** | Before Push, Merge, Delete | Action is intended and safe |

### Format Patterns

> **詳細:** [human-checkpoint-patterns.md](../guides/human-checkpoint-patterns.md)

**2つのフォーマットを使い分け:**

#### 重要なCHECKPOINT（ブロック形式）

Spec Approval, Plan Approval, Decision Point, Irreversible Action 用:

```markdown
=== [HUMAN_CHECKPOINT] {Type} ===

確認事項:
- [ ] {具体的な確認項目1}
- [ ] {具体的な確認項目2}

承認後、{next_step} へ進みます。
```

#### 結果確認（インライン形式）

Workflow Completion 用:

```markdown
**[HUMAN_CHECKPOINT]** {結果}を確認してから次のステップに進んでください。
```

### Recording

**承認後に記録を実行:**

```bash
node .claude/skills/spec-mesh/scripts/state.cjs branch --add-checkpoint {type}
```

### Checkpoint Details

> **判断基準:** 曖昧表現（「適切か」「妥当か」等）の具体的判断基準は [judgment-criteria.md](../guides/judgment-criteria.md) を参照

#### 1. Spec Approval
**Triggers:** Vision/Design/Add/Fix Spec 作成後

**Human Verifies:**
- [ ] Spec の内容が入力/要件を正確に反映しているか
- [ ] スコープが適切か（過大/過小でないか）
- [ ] ビジネス要件と整合しているか
- [ ] [NEEDS CLARIFICATION] の箇所を確認したか

#### 2. Plan Approval
**Triggers:** Plan 作成完了時、CLARIFY GATE 通過後

**Human Verifies:**
- [ ] 技術的アプローチが妥当か
- [ ] Work Breakdown が適切か
- [ ] リスクが許容範囲か

#### 3. Feedback Recording
**Triggers:** 実装中に Spec にない制約を発見

**Human Verifies:**
- [ ] Feedback の内容が正確か
- [ ] Spec に記録することが適切か

#### 4. Case 3 Decision
**Triggers:** 既存の M-*/API-*/BR-*/VR-* の変更が必要

**Human Verifies:**
- [ ] 影響範囲を理解しているか
- [ ] 影響を受ける Feature の一覧を確認したか

#### 5. Irreversible Actions
**Triggers:** git push, PR merge, Branch delete

**Human Verifies:**
- [ ] 変更内容が意図したものか
- [ ] テストが全て pass しているか

### Skip Conditions
Checkpoints may ONLY be skipped when:
- Human explicitly requests skip with justification
- Emergency hotfix with documented reason
- Trivial fix (typo, formatting) with human confirmation

---

## Severity Classifications

Unified severity levels across all quality workflows.

| Severity | Definition | Action | Next Step |
|----------|------------|--------|-----------|
| **Critical** | Blocker - cannot proceed | Must fix | Stop until fixed |
| **Major** | Quality issue - fix recommended | Should fix | Fix then continue |
| **Minor** | Minor - optional fix | Info only | May continue |

### Tool Mapping

| Tool/Workflow | Critical | Major | Minor |
|---------------|----------|-------|-------|
| review.md | Critical | Major | Minor |
| spec-lint.cjs | Error | Warning | Info |
| analyze.md | Critical | Major | Minor |
| checklist.md | Score < 30 | Score 30-39 | Score 40+ |
