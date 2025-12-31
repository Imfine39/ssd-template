# Feature Proposal Workflow

Propose additional Features based on analysis.

## Purpose

AI-assisted discovery of potential Features from:
- Vision journeys not yet implemented
- Domain capabilities not fully utilized
- User feedback patterns
- Competitive analysis

---

## Steps

### Step 1: Load Context

1. **Read Vision Spec:**
   ```
   Read tool: .specify/specs/overview/vision/spec.md
   ```

2. **Read Domain Spec** (Feature Index):
   ```
   Read tool: .specify/specs/overview/domain/spec.md
   ```

3. **Check existing Issues:**
   ```bash
   gh issue list --state all --json number,title,labels
   ```

### Step 2: Analyze Gaps

**2.1 Journey Coverage:**
- List all Journeys from Vision
- Check which have corresponding Features
- Identify gaps

**2.2 Domain Utilization:**
- List all M-*/API-* from Domain
- Check which are used by Features
- Identify unused capabilities

**2.3 Screen Coverage:**
- List all SCR-* from Screen Spec
- Check Feature coverage
- Identify orphan screens

### Step 3: Generate Proposals

Based on analysis, propose Features:

```
=== Feature Proposals ===

Based on analysis, the following Features are recommended:

## High Priority

1. **S-REPORT-001: レポート出力**
   - Gap: Journey J-003 (データ分析) 未実装
   - Uses: M-ORDER, API-ORDER-LIST
   - Screens: SCR-005 (Report Dashboard)
   - Effort: Medium

2. **S-EXPORT-001: データエクスポート**
   - Gap: API-EXPORT-* 未使用
   - Uses: M-*, API-EXPORT-*
   - Screens: None (background process)
   - Effort: Small

## Medium Priority

3. **S-NOTIF-001: 通知機能**
   - Gap: Journey J-004 (アラート受信) 未実装
   - Uses: M-USER, API-NOTIF-*
   - Screens: SCR-006 (Notification Center)
   - Effort: Large

採用する Features を選択してください（番号をカンマ区切り）:
```

### Step 4: Create Issues

For selected Features:

```bash
gh issue create --title "[Feature] {Feature名}" --body "$(cat <<'EOF'
## Summary
{概要}

## Gap Analysis
- Journey: {関連Journey}
- Domain: {使用するM-*/API-*}
- Screens: {関連SCR-*}

## Proposed by
AI analysis via Feature 提案ワークフロー
EOF
)"
```

### Step 5: Update Domain Feature Index

Add proposed Features to Domain Spec:

```markdown
| Feature ID | Title | Path | Status | Related M-*/API-* |
|------------|-------|------|--------|-------------------|
| S-REPORT-001 | レポート出力 | TBD | Proposed | M-ORDER, API-ORDER-LIST |
```

### Step 6: Summary

```
=== Feature Proposal 完了 ===

分析結果:
- Journey Coverage: {N}%
- Domain Utilization: {M}%
- Screen Coverage: {K}%

作成した Issues:
- #{num1}: S-REPORT-001 - レポート出力
- #{num2}: S-EXPORT-001 - データエクスポート

次のステップ:
- issue ワークフロー で Feature 開発を開始
- または add ワークフロー で詳細を追加
```

---

## Self-Check

- [ ] Vision Spec を読み込んだか
- [ ] Domain Spec (Feature Index) を読み込んだか
- [ ] Gap Analysis を実施したか
- [ ] Proposals を提示したか
- [ ] 選択された Features の Issues を作成したか
- [ ] Feature Index を更新したか

---

## Next Steps

**[HUMAN_CHECKPOINT]** 提案された Feature を確認してから次のステップに進んでください。

| Condition | Workflow | Description |
|-----------|----------|-------------|
| Issue から開始する場合 | issue | Feature 開発を開始 |
| 詳細を追加する場合 | add | 新機能の詳細を追加 |
