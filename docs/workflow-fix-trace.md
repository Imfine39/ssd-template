# SSD-MESH 修正トレース

## 目的
ドキュメント/テンプレート/ワークフロー間の不整合を段階的に修正し、途中でコンテキストが切れても追跡できるようにする。

## 進め方
- ステップごとに修正範囲と変更理由を記録する
- 変更後にこのファイルを更新して履歴を残す

## 方針（暫定）
- ステータス語彙は constitution/terminology.md の定義に合わせる
- Test Scenario は UC/FR を基準にする（AC/US IDは新設しない）
- Clarify は全 Spec で Clarifications に記録、Feedback は Vision/Domain/Screen=Implementation Notes、Feature/Fix=Clarifications

## 作業ログ
### Step 1: トレース用ドキュメント作成
- 追加: `docs/workflow-fix-trace.md`

### Step 2: Design ワークフロー整合（Screen/Domain/Matrix）
- 更新: `.claude/skills/spec-mesh/workflows/design.md`
- Step 2 に Vision input の読込（`overview/vision/input.md` 優先、`input/vision-input.md` fallback）を追加
- Screen/Domain Spec の充填セクションをテンプレート構成に合わせて修正
- Business Rules に Vision input Part D を反映する旨を明記
- Cross-Reference Matrix の例に name/title/permissions を追加し、ワイルドカード使用を削除

### Step 3: Clarify/Feedback/Test Scenario 整合
- 更新: `.claude/skills/spec-mesh/workflows/clarify.md`（Clarifications へ統一）
- 追加: `.claude/skills/spec-mesh/templates/vision-spec.md` に Implementation Notes セクション
- 追加: `.claude/skills/spec-mesh/templates/screen-spec.md` に Implementation Notes セクション
- 追加: `.claude/skills/spec-mesh/templates/fix-spec.md` に Clarifications セクション
- 更新: `.claude/skills/spec-mesh/workflows/test-scenario.md` を UC/FR 基準へ変更
- 更新: `.claude/skills/spec-mesh/templates/test-scenario-spec.md` を UC/FR 基準へ変更、例・表のASCII化

### Step 4: Plan/Tasks/Implement の Fix 対応
- 更新: `.claude/skills/spec-mesh/workflows/plan.md`（Fix の spec/plan パス対応、サマリーの汎用化）
- 更新: `.claude/skills/spec-mesh/workflows/tasks.md`（Fix の plan/tasks パス対応、サマリーの汎用化）
- 更新: `.claude/skills/spec-mesh/workflows/implement.md`（Fix の spec/plan/tasks パス対応）
- 更新: `.claude/skills/spec-mesh/templates/plan.md`（Feature/Fix 共通テンプレ化）
- 更新: `.claude/skills/spec-mesh/templates/tasks.md`（Feature/Fix 共通テンプレ化）

### Step 5: ステータス/Quick/CLAUDE/周辺整合
- 更新: `.claude/skills/spec-mesh/scripts/spec-lint.cjs` / `spec-metrics.cjs`（Status を constitution 準拠へ）
- 更新: `.claude/skills/spec-mesh/scripts/post-merge.cjs` / `workflows/pr.md`（Implemented への更新に統一、commit 例修正）
- 更新: `.claude/skills/spec-mesh/workflows/quick.md`（コミット例修正、revert 指示削除、設定追記位置）
- 更新: `.claude/skills/spec-mesh/workflows/issue.md`（Lint に CLARIFY GATE を追加）
- 更新: `.claude/skills/spec-mesh/templates/feature-spec.md` / `screen-spec.md`（Matrix 手動更新を許容）
- 更新: `.specify/input/fix-input.md`（Severity に Critical 追加）
- 更新: `.claude/skills/spec-mesh/templates/CLAUDE.template.md` / `CLAUDE.md`（Quick 追加、preserve-input の使い方修正）
- 更新: `.claude/skills/spec-mesh/guides/scripts-errors.md`（Status 記載修正）
