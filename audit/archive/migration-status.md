# Migration Status Report

**作成日:** 2026-01-01

---

## 概要

spec-mesh フレームワークの統合マイグレーション状況を報告します。

---

## 1. 統合状況サマリー

| カテゴリ | 完了 | 部分完了 | 未完了 |
|---------|------|---------|-------|
| サブスキル → spec-mesh 統合 | 5/6 | 0 | 1 (guide) |
| ワークフロー移行 | 10/20 | 8 | 2 |
| 参照パス更新 | 60% | - | 40% |
| SSOT確立 | 0/4 | - | 4 |

---

## 2. サブスキル統合状況

### 2.1 完了済み

| サブスキル | 統合先 | 状況 | 備考 |
|-----------|-------|------|------|
| spec-mesh-entry | spec-mesh | ✅ 完了 | ワークフロー移行済み |
| spec-mesh-develop | spec-mesh | ✅ 完了 | ワークフロー移行済み |
| spec-mesh-quality | spec-mesh | ✅ 完了 | ワークフロー移行済み |
| spec-mesh-test | spec-mesh | ✅ 完了 | ワークフロー移行済み |
| spec-mesh-meta | spec-mesh | ✅ 完了 | ワークフロー移行済み |

### 2.2 保留

| サブスキル | 理由 | 推奨アクション |
|-----------|------|---------------|
| guide | 独自機能（ワークフロー案内）を提供 | 維持 |

---

## 3. ワークフロー移行詳細

### 3.1 完全移行済み

| 旧ワークフロー | 新ワークフロー | 確認事項 |
|--------------|--------------|---------|
| entry/vision.md | workflows/vision.md | Vision Interview参照確認 |
| entry/design.md | workflows/design.md | Matrix生成手順確認 |
| entry/add.md | workflows/add.md | Deep Interview参照確認 |
| entry/fix.md | workflows/fix.md | Quick Input処理確認 |
| entry/quick.md | workflows/quick.md | - |
| entry/issue.md | workflows/issue.md | 分類ロジック確認 |
| develop/plan.md | workflows/plan.md | - |
| develop/tasks.md | workflows/tasks.md | フェーズ分割確認 |
| develop/implement.md | workflows/implement.md | MCP Tools記載確認 |
| develop/feedback.md | workflows/feedback.md | Cascade Update確認 |

### 3.2 移行済み（内容確認必要）

| 旧ワークフロー | 新ワークフロー | 不足内容 |
|--------------|--------------|---------|
| quality/review.md | workflows/review.md | Multi-Review Agent詳細 |
| quality/clarify.md | workflows/clarify.md | 4問バッチロジック |
| quality/lint.md | workflows/lint.md | - |
| quality/analyze.md | workflows/analyze.md | - |
| quality/checklist.md | workflows/checklist.md | - |
| test/test-scenario.md | workflows/test-scenario.md | UC/FR基準記述 |
| test/e2e.md | workflows/e2e.md | Chrome Extension詳細 |
| meta/change.md | workflows/change.md | impact-analysisパス |
| meta/featureproposal.md | workflows/featureproposal.md | - |
| meta/pr.md | workflows/pr.md | - |

---

## 4. 参照パス更新状況

### 4.1 更新完了

| ファイル | 旧パス | 新パス |
|---------|-------|-------|
| SKILL.md | 各サブスキル参照 | workflows/* |
| CLAUDE.md | 各サブスキル参照 | workflows/* |

### 4.2 更新必要

| ファイル | 旧パス | 新パス | 優先度 |
|---------|-------|-------|-------|
| _vision-interview.md | spec-mesh-entry/workflows/vision.md | ../vision.md | High |
| _quality-flow.md | ../../spec-mesh-quality/workflows/review.md | ../review.md | Critical |
| _cascade-update.md | spec-mesh-meta/workflows/* | ../*.md | High |
| _finalize.md | spec-mesh-entry/workflows/* | ../*.md | High |
| human-checkpoint-patterns.md | spec-mesh-*/workflows/* | ../workflows/*.md | High |
| feedback.md | shared/impact-analysis.md | ../../spec-mesh/workflows/shared/impact-analysis.md | High |
| change.md | shared/impact-analysis.md | ../../spec-mesh/workflows/shared/impact-analysis.md | High |
| quick.md | shared/impact-analysis.md | ../../spec-mesh/workflows/shared/impact-analysis.md | High |

---

## 5. SSOT確立状況

### 5.1 計画済み（未実施）

| 概念 | SSOT候補 | 現在の重複箇所 | 対応状況 |
|------|---------|--------------|---------|
| CLARIFY GATE | constitution/quality-gates.md | 3箇所 | ⏸️ 後回し |
| Multi-Review 3観点 | constitution/quality-gates.md | 3箇所 | ⏸️ 後回し |
| Spec Creation Flow | constitution/core.md | 5箇所 | ⏸️ 後回し |
| HUMAN_CHECKPOINT | constitution/quality-gates.md | 2箇所 | ⏸️ 後回し |

### 5.2 推奨実施順序

1. **Phase 0:** SSOT宣言・アンカー整備
2. **Phase 1:** Spec Creation Flow統一
3. **Phase 2:** CLARIFY GATE参照整理
4. **Phase 3:** Multi-Review参照整理
5. **Phase 4:** HUMAN_CHECKPOINT参照確認

詳細は `.specify/docs/ssot-plan.md` 参照

---

## 6. 残存する参照問題

### 6.1 Critical

| 問題 | ファイル | 行 | 対応 |
|------|---------|-----|------|
| 旧構造パス | _quality-flow.md | 108 | 即時修正 |
| 旧構造パス | _vision-interview.md | 396-406 | 即時修正 |
| 旧構造パス | human-checkpoint-patterns.md | 291-293 | 即時修正 |

### 6.2 Major

| 問題 | ファイル | 対応 |
|------|---------|------|
| 相対パス解決不能 | feedback.md:74 | パス修正 |
| 相対パス解決不能 | change.md:91 | パス修正 |
| 相対パス解決不能 | quick.md:114 | パス修正 |
| 重複ファイル | guide/workflow-map.md | 削除 |

---

## 7. 推奨アクション

### 即時対応（今日中）

1. **Critical参照パス修正**
   ```bash
   # _quality-flow.md の修正
   sed -i 's|../../spec-mesh-quality/workflows/review.md|../review.md|g' \
     .claude/skills/spec-mesh/workflows/shared/_quality-flow.md
   ```

2. **重複ファイル削除**
   ```bash
   rm .claude/skills/guide/workflow-map.md
   ```

### 短期対応（1週間以内）

1. 全旧構造参照の更新
2. 相対パス問題の解決
3. 旧ワークフローの固有内容移行

### 中期対応（1ヶ月以内）

1. SSOT確立（Phase 0-4）
2. 旧サブスキルディレクトリ削除
3. ドキュメント整合性確認

---

## 8. 検証コマンド

```bash
# 旧構造参照の検出
grep -r "spec-mesh-entry/" .claude/skills/spec-mesh/
grep -r "spec-mesh-develop/" .claude/skills/spec-mesh/
grep -r "spec-mesh-quality/" .claude/skills/spec-mesh/
grep -r "spec-mesh-test/" .claude/skills/spec-mesh/
grep -r "spec-mesh-meta/" .claude/skills/spec-mesh/

# 相対パス問題の検出
grep -rn "shared/impact-analysis.md" .claude/skills/spec-mesh-*/

# 重複ファイルの確認
diff .claude/skills/guide/workflow-map.md .claude/skills/spec-mesh/guides/workflow-map.md

# SSOT重複の確認
grep -l "CLARIFY GATE" .claude/skills/spec-mesh/**/*.md
grep -l "Multi-Review" .claude/skills/spec-mesh/**/*.md
```

---

## 9. マイグレーション完了条件

### 必須条件
- [ ] 旧サブスキルへの参照が0件
- [ ] 全ワークフローがspec-mesh/workflows/に存在
- [ ] 相対パスが正しく解決される
- [ ] guide/workflow-map.md が削除済み

### 推奨条件
- [ ] SSOT確立（4概念すべて）
- [ ] 旧サブスキルディレクトリ削除
- [ ] 用語定義の統一完了
- [ ] 外部ドキュメントの更新完了

---

## 10. 進捗トラッキング

| 日付 | 完了項目 | 残課題 |
|------|---------|-------|
| 2025-12-31 | Phase 9 cleanup完了 | 参照パス問題残存 |
| 2026-01-01 | 調査レポート作成 | 修正実施待ち |
| - | - | - |

**次のマイルストーン:** Critical参照パス修正（即時）
