# Spec Workflow (Internal)

Direct Spec creation/update. For advanced users.

## Purpose

Low-level Spec manipulation when standard workflows don't fit:
- Create custom Spec types
- Bulk updates
- Migration tasks

---

## Usage

```
spec ワークフロー --kind {vision|domain|screen|feature|fix} --id {ID} --title "{Title}"
```

## Steps

### Step 1: Parse Arguments

Extract from ARGUMENTS:
- `--kind`: Spec type (required)
- `--id`: Spec ID (required)
- `--title`: Spec title (required)

### Step 2: Run Scaffold

```bash
node .claude/skills/spec-mesh/scripts/scaffold-spec.cjs --kind {kind} --id {id} --title "{title}"
```

### Step 3: Open for Editing

Display created file path:
```
Spec created: .specify/specs/{path}/spec.md

Edit this file to fill in the details.
After editing, run lint ワークフロー to verify.
```

### Step 4: Update State (optional)

If creating overview specs:
```bash
node .claude/skills/spec-mesh/scripts/state.cjs repo --set-{kind}-status scaffold
```

---

## Self-Check

- [ ] Arguments を正しく解析したか
- [ ] scaffold-spec.cjs を実行したか
- [ ] ファイルパスを表示したか

---

## Next Steps

**[HUMAN_CHECKPOINT]** 作成した Spec の内容を確認してから次のステップに進んでください。

| Condition | Workflow | Description |
|-----------|----------|-------------|
| Vision Spec の場合 | clarify | 曖昧点解消 → design |
| Domain Spec の場合 | clarify | 曖昧点解消 → issue |
| Screen Spec の場合 | clarify | 曖昧点解消 → issue |
| Feature Spec の場合 | clarify | 曖昧点解消 → plan |
| Fix Spec の場合 | clarify | 曖昧点解消 → plan |
