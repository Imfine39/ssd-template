# Plan Workflow

Create implementation plan from spec. **Human must review and approve before proceeding.**

## Prerequisites

- Feature Spec or Fix Spec must exist
- On Issue-linked branch
- **★ CLARIFY GATE 通過必須**: `[NEEDS CLARIFICATION]` マーカーが 0 件であること

---

## Steps

### Step 0: Verify CLARIFY GATE

**Plan 開始前に必ず確認:**

```bash
# Spec 内の [NEEDS CLARIFICATION] をカウント
grep -c "\[NEEDS CLARIFICATION\]" .specify/specs/{project}/features/{id}/spec.md
```

- **0 件**: CLARIFY GATE 通過 → Step 1 へ進む
- **1 件以上**: GATE 未通過 → `/spec-mesh clarify` を実行してから再度 Plan を開始

```
⚠️ CLARIFY GATE 未通過

[NEEDS CLARIFICATION] が {N} 件残っています。
曖昧点を解消してから Plan に進んでください。

推奨: /spec-mesh clarify
```

---

### Step 1: Load Context

1. **Read Feature/Fix Spec:**
   ```
   Read tool: .specify/specs/{project}/features/{id}/spec.md
   ```

2. **Read Domain Spec** for M-*/API-* context:
   ```
   Read tool: .specify/specs/{project}/overview/domain/spec.md
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
.specify/specs/{project}/features/{id}/plan.md
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
Plan: .specify/specs/{project}/features/{id}/plan.md

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
🛑 HUMAN_CHECKPOINT: Plan の承認を待っています。
承認後、`/spec-mesh tasks` でタスク分割に進んでください。
```

### Step 7: Update State (on approval)

```bash
node .claude/skills/spec-mesh/scripts/state.cjs branch --set-step plan
```

---

## Self-Check

- [ ] Feature Spec を読み込んだか
- [ ] Domain Spec を読み込んだか
- [ ] Plan template を使用したか
- [ ] コードベースを探索したか
- [ ] plan.md を保存したか
- [ ] spec-lint を実行したか
- [ ] 人間レビューを依頼したか

---

## Next Steps

**[HUMAN_CHECKPOINT]**
- [ ] High-Level Design が技術的に妥当か
- [ ] Work Breakdown が適切な粒度か
- [ ] Risks/Trade-offs が許容範囲か
- [ ] Open Questions に回答できるか（回答が必要）

承認後、`/spec-mesh tasks` でタスク分割に進んでください。

| Condition | Command | Description |
|-----------|---------|-------------|
| Plan 承認後 | `/spec-mesh tasks` | タスク分割 |
| 不明点がある場合 | `/spec-mesh clarify` | 不明点確認 |
