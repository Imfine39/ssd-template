# Quality Gates

Defines the quality checkpoints and review processes in SSD workflow.

---

## SPEC GATE
<!-- SSOT: SPEC GATE 定義（CLARIFY GATE を拡張） -->
<!-- 他のファイルはこのセクションを参照すること。定義の複製禁止。 -->
<!-- アンカー: #spec-gate -->

> **設計ドキュメント:** [spec-gate-design.md](../guides/spec-gate-design.md)
>
> **運用手順:** [shared/_spec-gate.md](../workflows/shared/_spec-gate.md)

### Definition
A mandatory gate before proceeding to Plan phase. Extends the original CLARIFY GATE to also check for pending Overview changes.

### Check Items

| マーカー | 意味 | 優先度 |
|---------|------|--------|
| `[NEEDS CLARIFICATION]` | 曖昧点・未確定事項 | 1（最優先） |
| `[PENDING OVERVIEW CHANGE]` | Overview Spec への変更が必要 | 2 |
| `[DEFERRED]` | 後回しにした項目 | 3 |

### Pass Conditions

| 状態 | 条件 | 次のステップ |
|------|------|-------------|
| **PASSED** | 全マーカー = 0 | [HUMAN_CHECKPOINT] へ |
| **PASSED_WITH_DEFERRED** | CLARIFY = 0, OVERVIEW = 0, DEFERRED ≥ 1 | [HUMAN_CHECKPOINT] へ（リスク確認） |
| **BLOCKED_CLARIFY** | `[NEEDS CLARIFICATION]` ≥ 1 | clarify ワークフローへ |
| **BLOCKED_OVERVIEW** | CLARIFY = 0, `[PENDING OVERVIEW CHANGE]` ≥ 1 | Overview Change サブワークフローへ |

### Purpose
- Ensure all ambiguities are resolved before implementation planning
- Ensure all Overview changes are processed before implementation
- Prevent assumptions and guesswork from propagating to code
- Maintain spec-to-code traceability
- Allow progress with documented risks when items cannot be decided now

### PASSED_WITH_DEFERRED の扱い

1. **リスク記録**: Risks セクションに [DEFERRED] 項目の影響を記載
2. **HUMAN_CHECKPOINT**: [DEFERRED] 項目を人間に提示し、先に進むことを確認
3. **実装フェーズ**: [DEFERRED] 項目に遭遇した場合、clarify に戻る

### BLOCKED_OVERVIEW の扱い

1. **マーカー収集**: Feature/Fix Spec から全 [PENDING OVERVIEW CHANGE] を抽出
2. **重複チェック**: 他 Feature で既に適用済みかを確認
3. **Impact Analysis**: 変更の影響範囲を分析
4. **[HUMAN_CHECKPOINT]**: 変更内容と影響を提示し、承認を取得
5. **Overview Spec 更新**: Domain/Screen Spec を更新
6. **マーカー削除**: Feature/Fix Spec からマーカーを削除
7. **Multi-Review へ戻る**: 変更後の Spec を再レビュー

### Flow
```
Spec作成 → Multi-Review → Lint → マーカーカウント
                                        │
     ┌──────────────────────────────────┼──────────────────────────┐
     │                                  │                          │
     ▼                                  ▼                          ▼
[NEEDS CLARIFICATION] > 0    [PENDING OVERVIEW CHANGE] > 0    両方 = 0
     │                                  │                          │
     ▼                                  ▼                          │
BLOCKED_CLARIFY                  BLOCKED_OVERVIEW                  │
     │                                  │                          │
     ▼                                  ▼                          │
  clarify                        Overview Change                   │
     │                           サブワークフロー                   │
     │                                  │                          │
     └──────────────┬───────────────────┘                          │
                    │                                              │
                    ▼                                              │
              Multi-Review                                         │
                (ループ)                                            │
                                                                   │
                    ┌──────────────────────────────────────────────┘
                    │
                    ├── [DEFERRED] = 0 → PASSED
                    │
                    └── [DEFERRED] > 0 → PASSED_WITH_DEFERRED
                                               │
                                               ▼
                                    [HUMAN_CHECKPOINT]
                                         (リスク確認)
                                               │
                                               ▼
                                            Plan へ
```

### Legacy: CLARIFY GATE

CLARIFY GATE は SPEC GATE に統合されました。従来の CLARIFY GATE の機能は SPEC GATE の BLOCKED_CLARIFY 状態として保持されています。

<!-- アンカー: #clarify-gate（後方互換性のため） -->

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

### Recording（将来機能）

**承認後に記録を実行:**

> **Note:** このコマンドは将来機能として設計されており、現時点では未実装です。承認の記録は会話履歴で管理されます。

```bash
# [FUTURE] このコマンドは未実装
# node .claude/skills/nick-q/scripts/state.cjs branch --add-checkpoint {type}
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
**Triggers:** Plan 作成完了時、SPEC GATE 通過後

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
