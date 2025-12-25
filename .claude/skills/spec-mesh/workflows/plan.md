# Plan Workflow

Create implementation plan from spec. **Human must review and approve before proceeding.**

## Prerequisites

- Feature Spec or Fix Spec must exist
- On Issue-linked branch
- **★ CLARIFY GATE 通過必須**: `[NEEDS CLARIFICATION]` マーカーが 0 件であること

---

## Todo Template

**IMPORTANT:** ワークフロー開始時に、以下の Todo を TodoWrite tool で作成すること。

```
TodoWrite:
  todos:
    - content: "Step 0: CLARIFY GATE 確認"
      status: "pending"
      activeForm: "Verifying CLARIFY GATE"
    - content: "Step 1: コンテキスト読み込み"
      status: "pending"
      activeForm: "Loading context"
    - content: "Step 2: コードベース探索"
      status: "pending"
      activeForm: "Exploring codebase"
    - content: "Step 3: Plan セクション記入"
      status: "pending"
      activeForm: "Filling Plan sections"
    - content: "Step 4: Plan 保存"
      status: "pending"
      activeForm: "Saving Plan"
    - content: "Step 5: Lint 実行"
      status: "pending"
      activeForm: "Running Lint"
    - content: "Step 6: 人間レビュー依頼・[HUMAN_CHECKPOINT]"
      status: "pending"
      activeForm: "Requesting human review"
    - content: "Step 7: 状態更新"
      status: "pending"
      activeForm: "Updating state"
```

---

## Steps

### Step 0: Verify CLARIFY GATE

**Plan 開始前に必ず確認:**

Grep tool で `[NEEDS CLARIFICATION]` マーカーをカウント：

```
Grep tool:
  pattern: "\[NEEDS CLARIFICATION\]"
  path: .specify/specs/features/{id}/spec.md
  output_mode: count
```

- **0 件**: CLARIFY GATE 通過 → Step 1 へ進む
- **1 件以上**: GATE 未通過 → clarify ワークフロー を実行してから再度 Plan を開始

**GATE 未通過時の表示:**
```
⚠️ CLARIFY GATE 未通過

[NEEDS CLARIFICATION] が {N} 件残っています。
曖昧点を解消してから Plan に進んでください。

推奨: clarify ワークフロー
```

---

### Step 1: Load Context

1. **Read Feature/Fix Spec:**
   ```
   Read tool: .specify/specs/features/{id}/spec.md
   ```

2. **Read Domain Spec** for M-*/API-* context:
   ```
   Read tool: .specify/specs/overview/domain/spec.md
   ```

3. **Read Constitution:**
   ```
   Read tool: constitution.md (in skill directory)
   ```

4. **Read Plan Template:**
   ```
   Read tool: templates/plan.md
   ```

### Step 2: Explore Codebase

- Use Serena/Glob/Grep to understand existing structure
- Identify relevant files and patterns
- Note reusable components

### Step 3: Fill Plan Sections

| Section | Content |
|---------|---------|
| Summary | Spec IDs, target UCs |
| In/Out of Scope | What's included/excluded |
| High-Level Design | Architecture decisions |
| Data/Schema | Database changes |
| APIs | Endpoint changes |
| Dependencies | Other Features, external systems |
| Testing Strategy | Fail-first approach |
| Risks/Trade-offs | Technical risks |
| Open Questions | Needs human decision |
| Work Breakdown | High-level tasks |
| Constitution Check | Spec/UC → tasks/PR/tests mapping |

### Step 4: Save Plan

Save to feature directory:
```
.specify/specs/features/{id}/plan.md
```

### Step 5: Run Lint

```bash
node .claude/skills/spec-mesh/scripts/spec-lint.cjs
```

### Step 6: Request Human Review

Display:
```
=== Plan 作成完了 ===

Feature: {Feature名}
Plan: .specify/specs/features/{id}/plan.md

Work Breakdown:
1. {Task 1}
2. {Task 2}
3. {Task 3}
...

Open Questions:
- {質問がある場合}

Risks:
- {リスクがある場合}

---
**[HUMAN_CHECKPOINT]** Plan の承認を待っています。
承認後、tasks ワークフロー でタスク分割に進んでください。
```

### Step 7: Update State (on approval)

```bash
node .claude/skills/spec-mesh/scripts/state.cjs branch --set-step plan
```

---

## Self-Check

- [ ] **TodoWrite で全ステップを登録したか**
- [ ] **CLARIFY GATE を確認したか（Step 0）**
- [ ] Feature Spec を読み込んだか
- [ ] Domain Spec を読み込んだか
- [ ] Plan template を使用したか
- [ ] コードベースを探索したか
- [ ] plan.md を保存したか
- [ ] spec-lint を実行したか
- [ ] 人間レビューを依頼したか
- [ ] **TodoWrite で全ステップを completed にしたか**

---

## Next Steps

**[HUMAN_CHECKPOINT]**
- [ ] High-Level Design が技術的に妥当か
- [ ] Work Breakdown が適切な粒度か
- [ ] Risks/Trade-offs が許容範囲か
- [ ] Open Questions に回答できるか（回答が必要）

承認後、tasks ワークフロー でタスク分割に進んでください。

| Condition | Command | Description |
|-----------|---------|-------------|
| Plan 承認後 | tasks ワークフロー | タスク分割 |
| 不明点がある場合 | clarify ワークフロー | 不明点確認 |
