  |-----|---------------------------------------------------------------------------------------------------------------------------------|-------------------------------|------------|
  | M1  | Prerequisites の矛盾 - add.md で「Domain Spec should exist」だが初期プロジェクトでは存在しない                                  | add.md, issue.md              | Agent A    |
  | M2  | Quick Input ファイル構成が未定義 - vision-input.md は Part A-D、add/fix-input.md の構成が不明                                   | 全 Input テンプレート         | Agent A, F |
  | M3  | Spec 型による Feedback セクション名の不統一 - Vision/Domain/Screen は「Implementation Notes」、Feature/Fix は「Clarifications」 | clarify.md, feedback.md       | Agent C, D |
  | M4  | state.cjs の責任分界が不明確 - どのワークフローで step/task-progress を更新すべきか未定義                                       | plan/tasks/implement/pr.md    | Agent B    |
  | M5  | HUMAN_CHECKPOINT 後の動作が不統一 - 自動進行 vs 待機状態がワークフローで異なる                 
                                 | 全ワークフロー                | Agent B    |
  | M6  | Severity 分類の不統一 - review.md: Critical/Major/Minor、lint.md: Error/Warning/Info、analyze.md: 別形式                        | quality ワークフロー群        | Agent C    |
  | M7  | プレースホルダー表記の混在 - 日本語 [画面名] と英語 [Screen Name] が混在                       
                                 | 全テンプレート                | Agent E    |
  | M8  | Input → Spec マッピングが未記載 - Quick Input のどの項目が Spec のどのセクションに対応するか不 明                                | input テンプレート群          | Agent F    |
  | M9  | checklist.md が Feature Spec 専用か不明 - 他の Spec タイプへの適用方法が未定義                 
                                 | checklist.md                  | Agent C, F |
  | M10 | design ワークフローの Feature Proposal フローが不完全 - 選択した Feature をどう追跡するか曖昧                                   | design.md                     | Agent A    |
  | M11 | Scripts の exit code 不統一 - 0/1/2/3 の意味がスクリプトで異なる                               
                                 | 全スクリプト                  | Agent H    |
  | M12 | preserve-input.cjs の design タイプが未文書化 - CLAUDE.md に記載なし                           
                                 | preserve-input.cjs, CLAUDE.md | Agent H    |
  | M13 | plan.md テンプレートで Task ID を参照するが未作成 - 順序矛盾（Plan → Tasks だが Plan 内で Task ID 使用）                        | plan.md テンプレート          | Agent F    |

  ---
  Minor Issues（中優先 - 改善推奨）

  | #   | 問題                                                  | 影響範囲                            |  
  |-----|-------------------------------------------------------|-------------------------------------|  
  | m1  | Self-Check リストの冗長性（Todo と重複）              | 全ワークフロー                      |  
  | m2  | --help フラグの欠落                                   | branch.cjs, pr.cjs, reset-input.cjs |  
  | m3  | Mermaid 図の記法指示不足                              | screen-spec.md                      |  
  | m4  | Test Case ID 形式混在（TC-NNN vs TC-N{NN}）           | id-naming.md                        |  
  | m5  | 色付き出力の実装が不完全                              | spec-metrics.cjs                    |  
  | m6  | Multi-Review 回数上限（2回）超過時の対応が曖昧        | review.md                           |  
  | m7  | Vision Spec セクション9「Clarifications」の役割が曖昧 | vision-spec.md                      |  
  | m8  | 重複実装（featureDirFromId と fixDirFromId）          | scaffold-spec.cjs                   |  
  | m9  | Node.js バージョン要件が未記載                        | 全スクリプト                        |  
  | m10 | E2E テストのスクリーンショット保存方法が未定義        | e2e.md                              |  

  ---
  横断的テーマ（複数領域に影響）

  1. CLARIFY GATE 統一化

  影響: 7ワークフロー + constitution.md + SKILL.md
  - 検出方法の統一（grep → Node.js or Grep tool）
  - マーカー形式の明確化（[NEEDS CLARIFICATION: {question}]）
  - ループバック条件の明示

  2. ワークフロー間の依存関係明確化

  影響: 20ワークフロー + CLAUDE.md
  - 入出力インターフェースの定義
  - 次ステップへの遷移条件
  - エラー時のリカバリーパス

  3. ID 命名規則の完全統一

  影響: id-naming.md + 全テンプレート + スクリプト群
  - テンプレート例とガイドの一致
  - スクリプト検証ロジックとの整合性

  4. TodoWrite 使用パターンの文書化

  影響: 4ワークフロー + constitution.md
  - ワークフローステップ管理 vs タスク管理の区分明記

  ---
  推奨対応順序

  Phase 1: 実装ブロッカー解消（1-2日）
  ├── C1: CLARIFY GATE 統一
  ├── C2: Multi-Review 実装方式確定
  ├── C3: Windows 対応（grep → Node.js）
  └── C5: TodoWrite パターン文書化

  Phase 2: 一貫性確保（2-3日）
  ├── C4, M7: ID/プレースホルダー統一
  ├── M3, M6: 用語・分類統一
  ├── M4, M5: state.cjs / HUMAN_CHECKPOINT 整理
  └── M8: Input→Spec マッピング追加

  Phase 3: 品質向上（1-2日）
  ├── M11, M12: スクリプト整備
  ├── Minor issues 対応
  └── ドキュメント cross-reference 追加
