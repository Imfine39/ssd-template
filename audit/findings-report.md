# Spec-Mesh Workflow System - Findings Report

**調査実施日:** 2026-01-01
**調査範囲:** 114ファイル（9フェーズ）
**調査方法:** 全文精読 + 14 Agent並列調査

---

## Executive Summary

| 優先度 | 件数 | 説明 |
|--------|------|------|
| **Critical** | 28件 | 動作を妨げる・セキュリティリスク |
| **Major** | 52件 | 品質を損なう・混乱を招く |
| **Minor** | 45件 | 改善すればより良くなる |

---

## Critical Issues

### 1. 構造・参照問題

#### [C-REF-001] constitution.md と個別ファイルのSSOT競合
- **ファイル:** `constitution.md` vs `constitution/*.md`
- **問題:** バージョン不一致（2.1.0 vs 2.3.0）
- **影響:** どちらが正しいか不明確

#### [C-REF-002] _quality-flow.md の参照パス誤り
- **ファイル:** `workflows/shared/_quality-flow.md:108`
- **現状:** `../../spec-mesh-quality/workflows/review.md`
- **正しい:** `../review.md`

#### [C-REF-003] _vision-interview.md の旧構造参照
- **ファイル:** `workflows/shared/_vision-interview.md:396-406`
- **問題:** `spec-mesh-entry/workflows/` への参照が残存

#### [C-REF-004] 6ファイルの相対パス問題
- **ファイル:**
  - `spec-mesh-develop/workflows/feedback.md:74`
  - `spec-mesh-meta/workflows/change.md:91`
  - `spec-mesh-entry/workflows/quick.md:114`
  - `human-checkpoint-patterns.md:291-293`
  - `_finalize.md:34-39`
  - `_cascade-update.md:多数`
- **問題:** `shared/impact-analysis.md` への相対パスが解決不能

#### [C-REF-005] guide/workflow-map.md の重複
- **ファイル:** `.claude/skills/guide/workflow-map.md`
- **問題:** `spec-mesh/guides/workflow-map.md` と完全重複
- **対応:** 一方を削除

### 2. ID・命名問題

#### [C-ID-001] Master ID命名の矛盾
- **Feature Spec:** `M-{AREA}-001`
- **Domain Spec:** `M-NAME`（番号接尾辞なし）
- **影響:** 仕様参照・検索困難

#### [C-ID-002] Status定義の分散
- **Screen Spec:** Planned/In Progress/Implemented/Deprecated
- **Modification Log:** Planned/Implemented
- **Test Scenario:** Pending/Pass/Fail/Blocked/Skipped
- **問題:** terminology.md との整合性なし

### 3. スクリプト問題

#### [C-SCR-001] pr.cjs Shell Injection
- **ファイル:** `scripts/pr.cjs:106-109`
- **問題:** `shell: true` でtitle/bodyがインジェクション対象

#### [C-SCR-002] spec-lint.cjs Incremental Mode重複チェック漏れ
- **ファイル:** `scripts/spec-lint.cjs:268-298`
- **問題:** 新規Specの重複IDが検出されない可能性

#### [C-SCR-003] scaffold-spec.cjs Feature Table重複挿入
- **ファイル:** `scripts/scaffold-spec.cjs:212-234`
- **問題:** テンプレート内に既存のTable有無チェックなし

#### [C-SCR-004] post-merge.cjs Screen Status更新不完全
- **ファイル:** `scripts/post-merge.cjs`
- **問題:** `Planned`のみマッチ、Draft/Review等は変更されない

#### [C-SCR-005] update.cjs Redirect Loop未検出
- **ファイル:** `scripts/update.cjs`
- **問題:** httpsGet/httpsGetBufferでredirect loopを検出しない

#### [C-SCR-006] state.cjs Boolean検証欠落
- **ファイル:** `scripts/state.cjs:276-282, 329-336`
- **問題:** `--set-vision-clarify` 等でtrue/false以外の値が許容

#### [C-SCR-007] cli-utils.cjs エラースタックトレース欠落
- **ファイル:** `scripts/lib/cli-utils.cjs`
- **問題:** execSyncエラー時にスタックトレースが出力されない

#### [C-SCR-008] spec-parser.cjs Master ID重複抽出
- **ファイル:** `scripts/lib/spec-parser.cjs`
- **問題:** `M-SALES-001`形式で数字部分を二重抽出

### 4. テンプレート問題

#### [C-TPL-001] Screen Status体系の複数定義
- **ファイル:** `templates/screen-spec.md`
- **問題:** Screen Level + Modification Level で2つのStatus体系

#### [C-TPL-002] Test Scenario Status分散
- **ファイル:** `templates/test-scenario-spec.md`
- **問題:** Scenario Level + Case Level で異なるStatus体系

---

## Major Issues

### 1. ワークフロー問題

#### [M-WFL-001] 9ファイルにTodo Template欠如
- **ファイル:** design.md, plan.md, tasks.md, implement.md, featureproposal.md, analyze.md, checklist.md, clarify.md, feedback.md

#### [M-WFL-002] PASSED_WITH_DEFERRED処理欠落
- **ファイル:** 複数のワークフロー
- **問題:** [DEFERRED]マーカー処理の詳細定義なし

#### [M-WFL-003] Quick type Issue routing未定義
- **ファイル:** `workflows/issue.md:75-76`
- **問題:** Quick type判定時のquick.mdへのルーティングなし

### 2. スクリプト品質問題

#### [M-SCR-001] コード複製（DRY違反）
- **ファイル:** matrix-ops.cjs, validate-matrix.cjs, generate-matrix-view.cjs
- **問題:** extractScreenIds等の関数が3ファイルで重複

#### [M-SCR-002] scaffold-spec.cjs後のbranch-state.cjson未更新
- **問題:** Spec生成後にspecId/specPathが自動登録されない

#### [M-SCR-003] changelog.cjs Entry ID衝突可能性
- **ファイル:** `scripts/changelog.cjs:131-138`
- **問題:** 4文字ランダムで高頻度実行時に衝突

#### [M-SCR-004] paths.cjs Vision Legacyパス欠落
- **ファイル:** `scripts/lib/paths.cjs`
- **問題:** LEGACY_SPEC_PATHSにvisionパスがない

### 3. テンプレート問題

#### [M-TPL-001] 相対パス基準の不統一
- **問題:** `.specify/specs/` vs `../matrix/...` vs パスなし

#### [M-TPL-002] セクション欠落パターン
- **問題:** Original Input, Implementation Notes等が一部テンプレートにない

#### [M-TPL-003] Vision Input Part D → Domain対応不明確
- **問題:** D1-D3とDomain Spec Section 5のマッピングが記述に基づく推定のみ

### 4. 外部ドキュメント問題

#### [M-DOC-001] Development-Flow.mdとワークフロー乖離
- **問題:** 統合後のパス構造が反映されていない

#### [M-DOC-002] Workflows-Reference.md spec.md参照
- **問題:** 削除されたspec-mesh-meta/workflows/spec.mdへの参照

---

## Minor Issues

### 1. 表現・言い回し

#### [m-EXP-001] 日英混在
- **影響ファイル:** 複数のワークフロー
- **問題:** 一貫性のない言語使用

#### [m-EXP-002] 曖昧表現「適切に」
- **問題:** judgment-criteria.mdで具体化されていない

### 2. テンプレート詳細

#### [m-TPL-001] T-002.5形式のTask ID
- **ファイル:** templates/tasks.md:69
- **問題:** 半整数IDが標準化されていない

#### [m-TPL-002] TC-J{NN}記法の未正式化
- **ファイル:** templates/test-scenario-spec.md
- **問題:** guides/id-naming.mdで定義されていない

### 3. スクリプト詳細

#### [m-SCR-001] parseArgsの複数値引数非対応
- **ファイル:** scripts/lib/cli-utils.cjs

#### [m-SCR-002] テーブルセル内|エスケープなし
- **ファイル:** scripts/lib/matrix-utils.cjs

#### [m-SCR-003] 引数パーサのリポジトリルート解決不統一
- **問題:** __dirname vs process.cwd()

---

## カテゴリ別サマリー

| カテゴリ | Critical | Major | Minor |
|---------|----------|-------|-------|
| 構造・参照 | 5 | 8 | 6 |
| ID・命名 | 2 | 4 | 5 |
| ワークフロー | 0 | 6 | 10 |
| スクリプト | 8 | 12 | 15 |
| テンプレート | 2 | 8 | 6 |
| 外部ドキュメント | 0 | 2 | 3 |
| **合計** | **28** | **52** | **45** |

---

## 次のアクション

1. **即時対応（Critical）:** セキュリティ・動作阻害問題の修正
2. **短期対応（Major）:** 品質改善・コード重複解消
3. **中期対応（Minor）:** 表現統一・ドキュメント整備
