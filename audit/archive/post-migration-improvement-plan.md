# Post-Migration Improvement Plan

**作成日:** 2026-01-01
**前提:** Migration Completion Plan が完了していること
**スコープ:** 移行以外の全ての品質改善

---

## Executive Summary

| 優先度 | 件数 | カテゴリ |
|--------|------|---------|
| P0 (Critical) | 8件 | セキュリティ・動作阻害 |
| P1 (High) | 12件 | 品質・保守性 |
| P2 (Medium) | 15件 | 改善・統一 |
| P3 (Low) | 10件 | 最適化・ドキュメント |

---

## P0: Critical（即時対応）

### P0-01: pr.cjs Shell Injection 修正

**ファイル:** `scripts/pr.cjs`
**問題:** `shell: true` でコマンドインジェクションの脆弱性

```javascript
// Before
const result = spawnSync('gh', [...args], { shell: true });

// After
const result = spawnSync('gh', args, { shell: false, stdio: 'inherit' });
```

### P0-02: spec-lint.cjs Incremental Mode 修正

**ファイル:** `scripts/spec-lint.cjs`
**問題:** Incremental Mode で重複ID検出漏れ

**修正:** uniqueness チェックを全ファイル対象に変更

### P0-03: scaffold-spec.cjs Feature Table 重複防止

**ファイル:** `scripts/scaffold-spec.cjs`
**問題:** Feature Table が既存の場合に重複挿入

**修正:** 挿入前に既存テーブルの存在チェック追加

### P0-04: state.cjs Boolean 検証追加

**ファイル:** `scripts/state.cjs`
**問題:** `--set-vision-clarify` 等で true/false 以外が許容

**修正:** `['true', 'false'].includes(val)` による検証追加

### P0-05: post-merge.cjs Screen Status 拡張

**ファイル:** `scripts/post-merge.cjs`
**問題:** `Planned` のみマッチ、Draft/Review 等は変更されない

**修正:** 正規表現を `Planned|Draft|In Review` に拡張

### P0-06: cli-utils.cjs エラースタックトレース

**ファイル:** `scripts/lib/cli-utils.cjs`
**問題:** execSync エラー時にスタックトレースなし

**修正:** エラーオブジェクト全体をログ出力

### P0-07: spec-parser.cjs Master ID 重複抽出

**ファイル:** `scripts/lib/spec-parser.cjs`
**問題:** M-SALES-001 形式で二重抽出

**修正:** 正規表現の修正

### P0-08: update.cjs Redirect Loop 検出

**ファイル:** `scripts/update.cjs`
**問題:** redirect loop を検出しない

**修正:** redirect カウンターと上限チェック追加

---

## P1: High（1週間以内）

### P1-01: コード重複解消（Matrix関数）

**対象ファイル:**
- `scripts/matrix-ops.cjs`
- `scripts/validate-matrix.cjs`
- `scripts/generate-matrix-view.cjs`

**修正:** 以下の関数を `lib/matrix-utils.cjs` に集約
- `extractScreenIds()`
- `extractMasterIds()`
- `extractApiIds()`
- `extractFeatureIds()`
- `findMissing()`

### P1-02: scaffold → state.cjs 連携

**問題:** scaffold-spec.cjs 実行後に specId/specPath が未設定

**修正:** scaffold-spec.cjs 末尾で state.cjs を呼び出し

### P1-03: paths.cjs Vision Legacy パス追加

**ファイル:** `scripts/lib/paths.cjs`
**修正:** LEGACY_SPEC_PATHS に vision パスを追加

### P1-04: changelog.cjs Entry ID 改善

**ファイル:** `scripts/changelog.cjs`
**修正:** Entry ID を UUID または nano-id に変更

### P1-05: Status 定義の統一

**ファイル:** `constitution/terminology.md`
**修正:** 以下を追加
- Entity Level Status (Planned, In Progress, Implemented, Deprecated)
- Test Level Status (Pending, Pass, Fail, Blocked, Skipped)
- CLARIFY GATE Results (PASSED, PASSED_WITH_DEFERRED, BLOCKED)

### P1-06: Master ID 命名統一

**対象ファイル:** `templates/feature-spec.md`
**修正:** `M-{AREA}-001` → `M-{NAME}` 形式に統一

### P1-07: テンプレート相対パス統一

**対象:** 全テンプレート
**修正:** `.specify/specs/` をルートとした絶対パスに統一

### P1-08: TC-J{NN} 記法の正式化

**ファイル:** `guides/id-naming.md`
**修正:** Journey テスト ID 形式を追加

### P1-09: SSOT 確立 - CLARIFY GATE

**SSOT:** `constitution/quality-gates.md`
**参照元:** `workflows/shared/_clarify-gate.md`, `SKILL.md`
**修正:** 参照元を SSOT への参照のみに変更

### P1-10: SSOT 確立 - Multi-Review

**SSOT:** `constitution/quality-gates.md`
**参照元:** `workflows/shared/_quality-flow.md`
**修正:** 3観点定義を参照に変更

### P1-11: SSOT 確立 - Spec Creation Flow

**SSOT:** `constitution/core.md`
**参照元:** `CLAUDE.md`, `SKILL.md`, 各子スキル
**修正:** 簡略版 + 参照リンクに変更

### P1-12: SSOT 確立 - HUMAN_CHECKPOINT

**SSOT:** `constitution/quality-gates.md`
**参照元:** `guides/human-checkpoint-patterns.md`
**修正:** 明示的な参照リンク追加

---

## P2: Medium（2週間以内）

### P2-01: Todo Template 追加（9ファイル）

**対象:**
- design.md
- plan.md
- tasks.md
- implement.md
- featureproposal.md
- analyze.md
- checklist.md
- clarify.md
- feedback.md

**修正:** 各ワークフロー冒頭に Todo Template セクション追加

### P2-02: PASSED_WITH_DEFERRED 処理追加

**対象:** 複数ワークフロー
**修正:** [DEFERRED] マーカー処理の詳細定義

### P2-03: Quick type Issue routing 追加

**ファイル:** `workflows/issue.md`
**修正:** Quick type 判定時の quick.md へのルーティング追加

### P2-04: テンプレートセクション標準化

**修正:** 全テンプレートに以下を標準化
- Original Input
- Implementation Notes
- Changelog
- Clarifications
- Open Questions

### P2-05: Screen Spec Status 体系統一

**ファイル:** `templates/screen-spec.md`
**修正:** Screen Level と Modification Level の Status を統一

### P2-06: Test Scenario Status 体系統一

**ファイル:** `templates/test-scenario-spec.md`
**修正:** Scenario Level と Case Level の Status を明確分離

### P2-07: terminology.md マーカー追加

**修正:** 以下を追加
- [NEEDS CLARIFICATION]
- [DEFERRED]
- [HUMAN_CHECKPOINT]
- [PENDING_ADDITION]

### P2-08: judgment-criteria.md 具体化

**修正:** 「適切に」等の曖昧表現を具体的な基準に置換

### P2-09: 外部ドキュメント整合性

**対象:**
- docs/Development-Flow.md
- docs/Workflows-Reference.md
- docs/Getting-Started.md

**修正:** 統合後のパス構造に更新

### P2-10: constitution.md バージョン同期

**修正:** constitution.md と個別ファイルのバージョンを一致させる

### P2-11: Vision Input Part D マッピング明確化

**ファイル:** `templates/inputs/vision-input.md`
**修正:** D1-D3 と Domain Spec Section 5 の対応を明記

### P2-12: テストエビデンス保存先標準化

**修正:** `.specify/specs/features/{feature}/evidence/` を標準パスとして定義

### P2-13: parseArgs 複数値引数対応

**ファイル:** `scripts/lib/cli-utils.cjs`
**修正:** `--tags a b c` 形式に対応

### P2-14: テーブルセル | エスケープ

**ファイル:** `scripts/lib/matrix-utils.cjs`
**修正:** セル内の `|` をエスケープ

### P2-15: branch.cjs 既存ブランチ保護

**修正:** 既存ブランチの強制上書き禁止オプション追加

---

## P3: Low（1ヶ月以内）

### P3-01: 日英混在の解消

**対象:** 複数ワークフロー
**修正:** 言語ポリシーに基づいて統一

### P3-02: 言語ポリシー明文化

**ファイル:** `constitution/terminology.md`
**修正:** ワークフロー/テンプレート/スクリプトの言語ポリシー追加

### P3-03: Task ID 形式統一

**ファイル:** `templates/tasks.md`
**修正:** T-002.5 → T-002a 等の標準形式に

### P3-04: 引数パーサのルート解決統一

**対象:** 複数スクリプト
**修正:** __dirname vs process.cwd() を統一

### P3-05: エラーメッセージ改善

**対象:** 複数スクリプト
**修正:** より具体的なエラーメッセージに

### P3-06: spec-lint.cjs DFS 最適化

**修正:** 循環依存検出の計算量最適化

### P3-07: Feature Spec Section 8.3 具体化

**ファイル:** `templates/feature-spec.md`
**修正:** Screen Modifications の説明例を充実

### P3-08: Domain Spec API 例追加

**ファイル:** `templates/domain-spec.md`
**修正:** API-* の2番目以降の例を完全記述

### P3-09: Checklist ドメイン例充実

**ファイル:** `templates/checklist.md`
**修正:** Domain-Specific チェック項目の実装例追加

### P3-10: ワークフロー検証日時設定可能化

**ファイル:** `scripts/spec-lint.cjs`
**修正:** 警告閾値（7日以上）を設定可能に

---

## 実行スケジュール

```
Week 1: P0 (Critical)
├── Day 1: P0-01〜P0-04（スクリプトセキュリティ修正）
├── Day 2: P0-05〜P0-08（スクリプト品質修正）
└── Day 3: 検証

Week 2: P1 (High) - Part 1
├── Day 1-2: P1-01〜P1-04（スクリプト改善）
├── Day 3-4: P1-05〜P1-08（定義統一）
└── Day 5: 検証

Week 3: P1 (High) - Part 2
├── Day 1-3: P1-09〜P1-12（SSOT確立）
└── Day 4-5: 検証

Week 4: P2 (Medium) - Part 1
├── Day 1-2: P2-01〜P2-05（ワークフロー改善）
├── Day 3-4: P2-06〜P2-10（テンプレート・ドキュメント）
└── Day 5: 検証

Week 5: P2 (Medium) - Part 2
├── Day 1-3: P2-11〜P2-15（残り）
└── Day 4-5: 検証

Week 6+: P3 (Low)
└── 順次対応
```

---

## 検証チェックリスト

### P0 完了後
- [ ] `node scripts/pr.cjs` が安全に動作
- [ ] `node scripts/spec-lint.cjs --incremental` が重複検出
- [ ] `node scripts/scaffold-spec.cjs` が重複挿入しない
- [ ] `node scripts/state.cjs branch --set-vision-clarify invalid` がエラー

### P1 完了後
- [ ] Matrix 関数が lib/matrix-utils.cjs に集約
- [ ] scaffold → state 連携が動作
- [ ] terminology.md に全 Status 定義が存在
- [ ] SSOT が確立（4概念）

### P2 完了後
- [ ] 全ワークフローに Todo Template 存在
- [ ] 外部ドキュメントが統合後構造を反映
- [ ] テンプレートセクションが標準化

### P3 完了後
- [ ] 日英混在が解消
- [ ] 言語ポリシーが明文化
- [ ] エラーメッセージが改善

---

## 依存関係

```
Migration Completion Plan
         ↓
    P0 (Critical)
         ↓
    P1 (High)
    ├── P1-01〜P1-04: スクリプト（独立）
    ├── P1-05〜P1-08: 定義統一（独立）
    └── P1-09〜P1-12: SSOT（P1-05に依存）
         ↓
    P2 (Medium)
    ├── P2-01〜P2-08: ワークフロー（P1-05に依存）
    └── P2-09〜P2-15: その他（独立）
         ↓
    P3 (Low)
```

---

## 完了条件

1. 全 P0 項目が完了
2. 全 P1 項目が完了
3. P2 項目の 80% 以上が完了
4. P3 項目の 50% 以上が完了
5. spec-lint.cjs がエラーなしで完了
6. 主要ワークフローの動作確認完了
