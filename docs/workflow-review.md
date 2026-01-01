# SSD-MESH 仕様テンプレート/ワークフロー評価メモ

## 対象
- `CLAUDE.md`
- `.claude/skills/spec-mesh/templates/*`
- `.claude/skills/spec-mesh/workflows/*`
- 付随確認: `.claude/skills/spec-mesh/scripts/post-merge.cjs`, `.claude/skills/spec-mesh/constitution.md`

## 重要な問題（優先度高）
1. Design workflow のセクション指定がテンプレートと不一致
   - 影響: Screen/Domain Spec の記載場所がずれ、レビュー/lintersで欠落や誤配置が出る
   - 参照: `.claude/skills/spec-mesh/workflows/design.md:115`, `.claude/skills/spec-mesh/templates/screen-spec.md:41`, `.claude/skills/spec-mesh/templates/screen-spec.md:60`, `.claude/skills/spec-mesh/templates/screen-spec.md:97`, `.claude/skills/spec-mesh/templates/screen-spec.md:122`, `.claude/skills/spec-mesh/templates/domain-spec.md:28`, `.claude/skills/spec-mesh/templates/domain-spec.md:67`, `.claude/skills/spec-mesh/templates/domain-spec.md:121`, `.claude/skills/spec-mesh/templates/domain-spec.md:183`, `.claude/skills/spec-mesh/templates/domain-spec.md:257`
   - 対応案: workflow側の「Section番号/名称」をテンプレートに合わせて修正

2. cross-reference.json の例がスキーマ不一致（name必須/ワイルドカード不可）
   - 影響: validate-matrix/spec-lintが失敗しやすく、運用時に混乱
   - 参照: `.claude/skills/spec-mesh/workflows/design.md:138`, `.claude/skills/spec-mesh/templates/cross-reference-schema.json:63`, `.claude/skills/spec-mesh/templates/cross-reference-schema.json:83`
   - 対応案: `name` を必須記載、APIは完全IDで列挙

3. FixフローがPlan/Implementのパス前提と矛盾
   - 影響: Fix Specからplan/implementに進むとパスがfeatures前提で破綻
   - 参照: `.claude/skills/spec-mesh/workflows/fix.md:293`, `.claude/skills/spec-mesh/workflows/plan.md:53`, `.claude/skills/spec-mesh/workflows/plan.md:119`, `.claude/skills/spec-mesh/workflows/implement.md:32`
   - 対応案: fix用plan/tasksのパスを追加、またはplan/implementをSpec種別で分岐

4. Clarify/Feedback がVision/Screenの「Implementation Notes」前提
   - 影響: Clarifications欄との二重化や記録漏れが起きる
   - 参照: `.claude/skills/spec-mesh/workflows/clarify.md:18`, `.claude/skills/spec-mesh/workflows/feedback.md:21`, `.claude/skills/spec-mesh/templates/vision-spec.md:204`, `.claude/skills/spec-mesh/templates/screen-spec.md:270`
   - 対応案: Clarificationsに統一、もしくはテンプレートにImplementation Notesを追加

5. Test ScenarioのID体系がFeature Specと不一致
   - 影響: 追跡性/カバレッジマトリクスが破綻
   - 参照: `.claude/skills/spec-mesh/workflows/test-scenario.md:73`, `.claude/skills/spec-mesh/templates/test-scenario-spec.md:48`, `.claude/skills/spec-mesh/templates/feature-spec.md:103`, `.claude/skills/spec-mesh/templates/feature-spec.md:149`
   - 対応案: UC/FRに統一、またはFeature SpecにUS/AC IDを追加

6. Vision Quick Input Part D がワークフローに反映されない
   - 影響: Domain側の業務/検証/計算ルールが欠落しやすい
   - 参照: `.claude/skills/spec-mesh/templates/inputs/vision-input.md:153`, `.claude/skills/spec-mesh/workflows/vision.md:77`, `.claude/skills/spec-mesh/workflows/design.md:75`
   - 対応案: Vision生成時にDomain向けメモとして転記、またはDesignでpreserved inputを読む

7. post-merge.cjs のステータス値がConstitution/テンプレと不一致
   - 影響: `COMPLETED`/`IMPLEMENTING` が正規値と混在し、lint/レビュー判断が曖昧化
   - 参照: `.claude/skills/spec-mesh/scripts/post-merge.cjs:147`, `.claude/skills/spec-mesh/templates/domain-spec.md:261`, `.claude/skills/spec-mesh/templates/feature-spec.md:29`, `.claude/skills/spec-mesh/constitution.md:68`
   - 対応案: `Implemented`へ統一、またはConstitution/テンプレ側に語彙を追加

8. Quick Mode 設定変更がCLAUDE.md追記前提だが、同ファイルは自動更新領域
   - 影響: 追記が更新で消える/運用が不安定
   - 参照: `CLAUDE.md:1`, `.claude/skills/spec-mesh/workflows/quick.md:268`
   - 対応案: `Project-Specific Rules` に追記する運用へ誘導、もしくは別設定ファイルへ分離

## 中〜軽微な問題（改善候補）
1. TodoWrite の例がYAMLとして壊れている（contentの閉じクォート欠落）
   - 参照: `.claude/skills/spec-mesh/workflows/vision.md:38`, `.claude/skills/spec-mesh/workflows/design.md:27`, `.claude/skills/spec-mesh/workflows/add.md:37`, `.claude/skills/spec-mesh/workflows/fix.md:31`, `.claude/skills/spec-mesh/workflows/plan.md:19`, `.claude/skills/spec-mesh/workflows/test-scenario.md:51`, `.claude/skills/spec-mesh/workflows/pr.md:19`

2. 例示コマンドがシェル上でそのまま通らない（複数行のクォート問題）
   - 参照: `.claude/skills/spec-mesh/workflows/pr.md:95`, `.claude/skills/spec-mesh/workflows/featureproposal.md:87`, `.claude/skills/spec-mesh/workflows/quick.md:181`

3. CLAUDE.template.md と CLAUDE.md のルーティングが差分あり
   - 参照: `CLAUDE.md:33`, `.claude/skills/spec-mesh/templates/CLAUDE.template.md:24`
   - 影響: update実行後に `quick` ルーティングが消える可能性

4. preserve-input の案内が実際の引数要件と一致しない
   - 参照: `.claude/skills/spec-mesh/templates/CLAUDE.template.md:167`, `.claude/skills/spec-mesh/scripts/preserve-input.cjs:39`

5. CLARIFY GATE の流れがCore Flowと各workflowで順序が不一致
   - 参照: `CLAUDE.md:56`, `.claude/skills/spec-mesh/workflows/vision.md:129`

6. Fix Quick Input の緊急度表現がFix SpecのSeverityと不一致
   - 参照: `.claude/skills/spec-mesh/templates/inputs/fix-input.md:49`, `.claude/skills/spec-mesh/templates/fix-spec.md:52`

7. cross-reference.json を「自動生成して手編集禁止」としつつ、Designでは手作成を指示
   - 参照: `.claude/skills/spec-mesh/templates/feature-spec.md:20`, `.claude/skills/spec-mesh/templates/screen-spec.md:25`, `.claude/skills/spec-mesh/workflows/design.md:138`

8. issue ワークフローに明示的なCLARIFY GATE判定がない
   - 影響: `[NEEDS CLARIFICATION]`残存のままplanへ進むリスク
   - 参照: `.claude/skills/spec-mesh/workflows/issue.md:148`, `.claude/skills/spec-mesh/workflows/issue.md:164`

9. 文字化けが含まれるドキュメントがある（可読性の低下）
   - 参照: `.claude/skills/spec-mesh/workflows/tasks.md:12`, `.claude/skills/spec-mesh/templates/test-scenario-spec.md:60`

- Fixは plan/tasks を通す運用か、Trivialは implement 直行にするか
- Test ScenarioのID体系をUC/FRに寄せるか、Feature SpecにUS/ACを追加するか
- Vision Input Part D（業務/検証/計算ルール）をどの段階でDomainに反映させるか
- Feature Indexのステータス語彙（Implemented vs Completed）の正規化方針
