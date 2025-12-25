# Engineering Constitution

This constitution defines the foundational principles for Spec-Driven Development (SSD).
All development decisions, code reviews, and architectural choices MUST align with these principles.

Version: 2.1.0 | Ratified: 2025-12-23

---

## Mission

**Spec-First Development**: Every change originates from explicit specifications.
No guessing, no ad-hoc edits, no silent deviations.

Why:
- Traceability from business intent to code
- Reduced rework through early clarification
- AI-generated changes remain aligned with requirements

---

## Core Principles

### 1. Type Safety
All code MUST be fully typed with strict configuration.
- `strict: true` in tsconfig.json
- No `any` without documented justification
- All function parameters and return types explicitly typed

### 2. Test Coverage
Critical paths MUST have test coverage.
- API endpoints: integration tests (happy path + errors)
- Business logic: unit tests
- User features: at least one E2E test per major story
- Tests run in CI before merge

### 3. Code Quality
Code MUST be maintainable and consistent.
- ESLint + Prettier enforced via pre-commit hooks
- Functions < 50 lines, files < 300 lines (generally)
- Dead code removed, not commented out

### 4. Spec-Driven Workflow
All changes MUST be driven by specifications.
- Every non-trivial change from a GitHub Issue
- Core sequence: Entry → 入力検証 → Spec作成 → Multi-Review → [Clarify] → Plan → Tasks → Implement → PR
  - 入力検証: Spec作成前に必須項目を確認（不足時は追加入力を要求）
  - Multi-Review: Spec 作成直後に自動実行
  - Clarify: [NEEDS CLARIFICATION] がある場合のみ実行
  - **CLARIFY GATE**: [NEEDS CLARIFICATION] = 0 が Plan の前提条件
- Specifications in `.specify/specs/` are the single source of truth
- Ambiguity → Escalate, never guess

### 5. Git Discipline
Version control MUST ensure traceability.
- No direct push to `main`
- Issue-linked branches: `feature/{issue}-{slug}`, `fix/{issue}-{slug}`
- PRs reference Issues and Spec IDs
- Squash merge for clean history

---

## Status Values

This section defines the canonical status values used across all specs.
All templates MUST reference these definitions.

### Spec Status

Status values for Vision, Domain, Screen, Feature, and Fix specifications.

| Status | Description |
|--------|-------------|
| `Draft` | Initial creation, not reviewed |
| `In Review` | Under Multi-Review or stakeholder review |
| `Clarified` | All [NEEDS CLARIFICATION] markers resolved |
| `Approved` | Human approved, ready for implementation |
| `Implemented` | Code complete |

**Lifecycle:** Draft -> In Review -> Clarified -> Approved -> Implemented

### Screen Status

Status values for individual screens within Screen Spec (Section 2).

| Status | Description |
|--------|-------------|
| `Planned` | In spec but not implemented |
| `In Progress` | Currently being implemented |
| `Implemented` | Code complete |
| `Deprecated` | No longer used |

**Lifecycle:** Planned -> In Progress -> Implemented (or Deprecated)

### Test Status

Status values for test cases in Test Scenario Spec.

| Status | Description |
|--------|-------------|
| `Pending` | Not yet executed |
| `Pass` | Test passed |
| `Fail` | Test failed |
| `Blocked` | Cannot run due to dependencies |
| `Skipped` | Intentionally skipped |

### Test Scenario Spec Status

Status values for the overall Test Scenario Spec document.

| Status | Description |
|--------|-------------|
| `Draft` | Initial creation |
| `In Review` | Under stakeholder review |
| `Ready` | Approved and ready for execution |
| `Executing` | Test execution in progress |
| `Completed` | All tests executed |

---

## Terminology

### Spec Types

| Spec Type | ID Format | Definition |
|-----------|-----------|------------|
| **Vision Spec** | S-VISION-001 | Project purpose, target users, user journeys |
| **Domain Spec** | S-DOMAIN-001 | Shared masters (M-*), APIs (API-*), business rules |
| **Screen Spec** | S-SCREEN-001 | Screen definitions (SCR-*), transitions, wireframes |
| **Feature Spec** | S-{AREA}-{NNN} | User stories, functional requirements per feature |
| **Fix Spec** | F-{AREA}-{NNN} | Bug analysis, root cause, fix proposal |
| **Test Scenario Spec** | TS-{AREA}-{NNN} | Test cases (TC-*), test data, expected results per feature |

See `guides/id-naming.md` for complete ID format definitions.

---

## Workflow Overview

```
1. Entry Point (add, fix, issue ワークフロー)
   → Issue creation → Branch creation

2. 入力検証（厳格）
   → 必須項目チェック
   → 不足時はユーザーに追加入力を要求

3. Spec 作成
   → 曖昧な箇所は [NEEDS CLARIFICATION] でマーク

4. Multi-Review (review ワークフロー) [自動実行]
   → 3観点並列レビュー（構造・内容・完全性）
   → AI修正可能な問題を修正

5. Lint 実行
   → 構造検証

6. [HUMAN_CHECKPOINT] Spec 確認
   → ユーザーが Spec 内容を確認

7. Clarify (clarify ワークフロー) [条件付き]
   → [NEEDS CLARIFICATION] がある場合のみ実行
   → 解消後 Step 4 へ戻りループ

   ════════════════════════════════════════════════════
   ★ CLARIFY GATE: [NEEDS CLARIFICATION] = 0 必須
   ════════════════════════════════════════════════════

8. Test Scenario (test-scenario ワークフロー) [任意]
   → Feature Spec からテストケース生成
   → テストデータ定義

9. Plan (plan ワークフロー)
   → CLARIFY GATE 通過が前提条件
   → Implementation plan
   → HUMAN_CHECKPOINT: approval required

10. Tasks (tasks ワークフロー)
    → Break into atomic tasks

11. Implement (implement ワークフロー)
    → Test-first development
    → Record feedback if discoveries

12. E2E Test (e2e ワークフロー) [任意]
    → Chrome 拡張によるブラウザテスト
    → スクリーンショット/GIF 証跡

13. PR (pr ワークフロー)
    → Integrity checks → PR creation → Review → Merge
```

---

## Specification IDs

All specs use stable identifiers for traceability:

| ID Format | Example | Usage |
|-----------|---------|-------|
| S-{AREA}-{NNN} | S-AUTH-001 | Feature/Fix Spec |
| UC-{AREA}-{NNN} | UC-AUTH-001 | Use Case |
| FR-{AREA}-{NNN} | FR-AUTH-001 | Functional Requirement |
| M-{NAME} | M-USER | Master Data |
| API-{RESOURCE}-{ACTION} | API-USER-CREATE | API Contract |
| SCR-{NNN} | SCR-001 | Screen |

See `guides/id-naming.md` for complete definitions.

---

## HUMAN_CHECKPOINT Policy

Human checkpoints are mandatory gates in the SSD workflow that require explicit human approval before proceeding. Never proceed past a checkpoint without confirmation.

### Trigger Conditions

| Checkpoint | When | What Human Verifies |
|------------|------|---------------------|
| **Spec Approval** | After Spec creation + Multi-Review + Lint | Content accuracy, scope correctness, business alignment |
| **Plan Approval** | After Plan creation | Technical approach, work breakdown, risks acceptable |
| **Feedback Recording** | Before updating Spec with discoveries | Feedback is accurate, appropriate to record |
| **Case 3 Decision** | When M-*/API-* modification needed | Impact scope acceptable, proceed with change |
| **Irreversible Actions** | Before Push, Merge, Delete operations | Action is intended and safe |

### Standard Checkpoint Format

When reaching a checkpoint, present it in this format:

```markdown
**[HUMAN_CHECKPOINT]**
- 確認項目1: [具体的な内容]
- 確認項目2: [具体的な内容]
- 確認項目3: [具体的な内容]

承認後、次のステップ（{next_step}）へ進んでください。
```

### Checkpoint Details

#### 1. Spec Approval (After Vision/Design/Add/Fix)

**Triggers:**
- Vision Spec 作成後
- Screen Spec + Domain Spec 作成後
- Feature Spec 作成後
- Fix Spec 作成後

**Human Verifies:**
- [ ] Spec の内容が入力/要件を正確に反映しているか
- [ ] スコープが適切か（過大/過小でないか）
- [ ] ビジネス要件と整合しているか
- [ ] [NEEDS CLARIFICATION] の箇所を確認したか

**Proceed When:** Human explicitly approves OR clarify resolves all issues

#### 2. Plan Approval (Before Tasks)

**Triggers:**
- Plan 作成完了時
- CLARIFY GATE 通過後

**Human Verifies:**
- [ ] 技術的アプローチが妥当か
- [ ] Work Breakdown が適切か
- [ ] リスクが許容範囲か
- [ ] Open Questions に回答できるか

**Proceed When:** Human explicitly approves the plan

#### 3. Feedback Recording (During Implement)

**Triggers:**
- 実装中に Spec にない技術的制約を発見
- 曖昧点を解決するための判断が必要
- Spec からの逸脱が必要

**Human Verifies:**
- [ ] Feedback の内容が正確か
- [ ] Spec に記録することが適切か
- [ ] 他の Spec への影響を理解しているか

**Proceed When:** Human explicitly approves feedback recording

#### 4. Case 3 Decision (During Add/Change)

**Triggers:**
- 既存の M-*/API-*/BR-*/VR-* の変更が必要
- Feature が共有リソースに影響

**Human Verifies:**
- [ ] 影響範囲を理解しているか
- [ ] 影響を受ける Feature の一覧を確認したか
- [ ] 変更のリスクを許容できるか

**Proceed When:** Human explicitly approves the modification

#### 5. Irreversible Actions (PR/Git Operations)

**Triggers:**
- git push
- PR merge
- Branch delete
- データベースマイグレーション実行

**Human Verifies:**
- [ ] 変更内容が意図したものか
- [ ] テストが全て pass しているか
- [ ] 他に影響を与える変更がないか

**Proceed When:** Human explicitly confirms the action

### Behavior After Checkpoint

1. **Wait for explicit approval** - Do not assume approval from silence
2. **Provide next step guidance** - Tell human what command to run next
3. **Record approval** - State management で checkpoint 通過を記録

### Checkpoint Skip Conditions

Checkpoints may ONLY be skipped when:
- Human explicitly requests skip with justification
- Emergency hotfix with documented reason
- Trivial fix (typo, formatting) with human confirmation

Document any skipped checkpoint in the PR description.

---

## TodoWrite Usage Patterns

ワークフローでの TodoWrite tool の使い分けを明確化する。

### Pattern 1: Workflow Step Tracking

**対象ワークフロー:** vision, design, add, fix, issue, change, pr, test-scenario, e2e

ワークフロー開始時に**ワークフローのステップ自体**を Todo として登録し、各ステップ完了時に `completed` に更新する。

```
例: vision.md
- Step 1: 入力検証 → in_progress → completed
- Step 2: Scaffold 実行 → in_progress → completed
- Step 3: Spec 作成 → in_progress → completed
...
```

**目的:** ワークフローの進捗を可視化し、中断からの復帰を容易にする。

### Pattern 2: Task Management

**対象ワークフロー:** tasks, implement

**tasks.md:** tasks.md ファイルで定義したタスク（T-001, T-002...）を TodoWrite に登録する。ワークフローステップ自体の Todo 化は不要。

**implement.md:** tasks.md から読み込んだタスクを TodoWrite で管理する。各タスクの実装前に `in_progress`、完了時に `completed` に更新。

```
例: implement.md
- T-001: API エンドポイント実装 → in_progress → completed
- T-002: バリデーション追加 → in_progress → completed
- T-003: テスト作成 → in_progress → completed
...
```

**目的:** 実装作業の進捗を正確に追跡し、state.cjs の task-progress と同期する。

### Pattern 3: No TodoWrite

**対象ワークフロー:** review, clarify, lint, analyze, checklist, feedback, spec, featureproposal

これらはサポート的なワークフローであり、TodoWrite は不要。

---

## Severity Classifications

すべてのワークフロー（review, lint, analyze 等）で統一された重要度分類を使用する。

| Severity | 定義 | アクション | 次ステップ |
|----------|------|-----------|-----------|
| **Critical** | ブロッカー - このままでは次に進めない | 必須修正 | 修正完了まで停止 |
| **Major** | 品質問題 - 修正推奨 | 推奨修正 | 修正後に続行 |
| **Minor** | 軽微 - 任意修正 | 情報のみ | そのまま続行可 |

### Severity とツール出力のマッピング

| ツール/ワークフロー | Critical | Major | Minor |
|--------------------|----------|-------|-------|
| review.md | Critical | Major | Minor |
| lint (spec-lint.cjs) | Error | Warning | Info |
| analyze.md | Critical | Major | Minor |
| checklist.md | スコア < 30 | スコア 30-39 | スコア 40+ |

---

## State Management Responsibility

`state.cjs` のブランチ状態（step, task-progress）をどのワークフローで更新するかを定義する。

### Branch Step 値

| Step | 意味 | 設定するワークフロー |
|------|------|---------------------|
| `idle` | 作業なし | 初期値 / ブランチ削除時 |
| `spec` | Spec 作成中/完了 | issue, add, fix, change |
| `spec_review` | Spec レビュー待ち | (オプション) HUMAN_CHECKPOINT 待ち時 |
| `plan` | Plan 作成完了 | plan |
| `plan_review` | Plan レビュー待ち | (オプション) HUMAN_CHECKPOINT 待ち時 |
| `tasks` | Tasks 作成完了 | tasks |
| `implement` | 実装完了 | implement |
| `pr` | PR 作成済み | pr |
| `suspended` | 中断中 | suspend コマンド |

### State 更新タイミング

| ワークフロー | 更新フィールド | タイミング |
|-------------|---------------|-----------|
| **issue.md** | `--set-step spec`, `--set-feature {id}` | Step 10: Feature Spec 作成後 |
| **add.md** | `--set-step spec`, `--set-feature {id}` | Step 7: Feature Spec 作成後 |
| **fix.md** | `--set-step spec` | Step 7: Fix Spec 作成後 |
| **change.md** | `--set-step spec` | Step 6: Domain/Screen Spec 更新後 |
| **plan.md** | `--set-step plan` | Step 7: Plan 作成・承認後 |
| **tasks.md** | `--set-step tasks`, `--set-task-progress 0/N` | Step 6: Tasks 作成後 |
| **implement.md** | `--set-task-progress M/N` | Step 3.1: 各タスク完了時 |
| **implement.md** | `--set-step implement`, `--set-task-progress N/N` | Step 6: 全タスク完了後 |
| **pr.md** | `--set-step pr` | Step 6: PR 作成後 |

### Task Progress

`--set-task-progress` は `{completed}/{total}` 形式で指定。

```bash
# Tasks 作成時（0/5 タスク完了）
node .claude/skills/spec-mesh/scripts/state.cjs branch --set-step tasks --set-task-progress 0/5

# タスク完了ごとに更新
node .claude/skills/spec-mesh/scripts/state.cjs branch --set-task-progress 1/5
node .claude/skills/spec-mesh/scripts/state.cjs branch --set-task-progress 2/5

# 全タスク完了時
node .claude/skills/spec-mesh/scripts/state.cjs branch --set-step implement --set-task-progress 5/5
```

### 注意事項

1. **`_review` 系 step はオプション**: より詳細な進捗追跡が必要な場合のみ使用
2. **HUMAN_CHECKPOINT 待ち時**: 明示的に `_review` step に設定することで、レビュー待ち状態を記録可能
3. **サポートワークフローは state 更新なし**: review, clarify, lint, analyze, feedback 等は state を更新しない

---

## Governance

### Amendment Process
1. Propose via PR to this file
2. Requires approval from project owner
3. Version bump: MAJOR for principle changes, MINOR for additions, PATCH for clarifications

### Compliance
- All PRs verify compliance with these principles
- Violations flagged during code review
- Exceptions require documented justification

---

## Detailed Guides

For detailed procedures, see:
- `guides/id-naming.md` - Complete ID format definitions
- `guides/parallel-development.md` - Working on multiple features
- `guides/error-recovery.md` - Handling errors and edge cases
- `guides/scripts-errors.md` - Script error codes and troubleshooting

For agent-specific rules, see:
- `.claude/agents/reviewer.md` - Quality verification rules (Multi-Review, Clarify, Lint, Analyze, Checklist, Test-Scenario)
- `.claude/agents/developer.md` - Implementation rules (Plan, Tasks, Implement, E2E, PR, Feedback)
