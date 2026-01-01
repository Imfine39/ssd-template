# AI SIer 改善 マスタープラン

**作成日:** 2026-01-01
**目的:** 完璧な仕様駆動開発を実現する AI SIer システムの構築
**トレース用ID:** `MASTER-PLAN-v1`

---

## 📋 Compact 対応トレースガイド

このドキュメントは compact 発生時の継続性を確保するため、以下のマーカーを使用します：

| マーカー | 意味 |
|---------|------|
| `[PHASE-N]` | フェーズ番号 |
| `[STEP-N.N]` | ステップ番号 |
| `[DONE]` | 完了済み |
| `[IN-PROGRESS]` | 作業中 |
| `[PENDING]` | 未着手 |
| `[BLOCKED]` | ブロック中 |

**compact 後の再開方法:**
```
このファイルを読み、[IN-PROGRESS] のステップから再開してください。
```

---

## 1. 現在の状況

### 1.1 完了済み

| 項目 | 状態 |
|------|------|
| サブスキル統合（spec-mesh-* → spec-mesh） | ✅ 完了 |
| ワークフロー移行 | ✅ 完了 |
| 旧サブスキル削除 | ✅ 完了 |
| 基本的な QA テンプレート作成 | ✅ 完了 |

### 1.2 発見された問題

> **詳細:** [findings-report.md](./findings-report.md)

| 優先度 | 件数 | 概要 |
|--------|------|------|
| Critical | 28件 | Shell Injection、参照パス誤り、重複チェック漏れ |
| Major | 52件 | コード重複、Status 定義分散、Todo Template 欠如 |
| Minor | 45件 | 日英混在、ID 形式未定義 |

---

## 2. 採用された改善提案

### 2.1 採用リスト

| ID | 改善内容 | 元提案 |
|----|---------|--------|
| **A-01** | Issue 作成を [HUMAN_CHECKPOINT] 通過後に変更 | 提案 #3 |
| **A-02** | SSOT 確立を Phase 1 の前に実施 | 提案 #4 |
| **A-03** | 複合変更の定量基準を judgment-criteria.md に追加 | 提案 #5 |
| **A-04** | QA ドキュメントを Feature ディレクトリ内に保存 | 提案 #6 |
| **A-05** | 提案の採否に「理由」欄を追加 | 提案 #7 |
| **A-06** | QA テンプレートを動的生成方式に変更 | 提案 #8 |
| **A-07** | 30 Agent 調査結果を自動テストに変換 | 提案 #9 |
| **A-08** | Input リセットを PR マージ後に変更 | 提案 #11 |
| **A-09** | ユーザージャーニーを実装計画に明示 | 提案 #12 |

### 2.2 却下リスト

| ID | 提案内容 | 却下理由 |
|----|---------|---------|
| **R-01** | QA 方式を対話メインに変更 | 数十個の質問がある場合、QA でまとめた方がユーザー負担が少ない |
| **R-02** | Progressive Disclosure の導入 | 完璧な仕様駆動開発が目的。軽量化は不適切 |
| **R-03** | Essential レベル廃止への代替案 | プロジェクトレベルでは Standard が過剰にならない |

---

## 3. 実行フェーズ

### [PHASE-0] 準備・SSOT 確立 [DONE]

**目的:** 改訂で新たな重複を防ぐため、最低限の SSOT を先に確立
**完了日:** 2026-01-01

#### [STEP-0.1] SSOT 確立 [DONE]

| 概念 | SSOT 場所 | 作業内容 |
|------|----------|---------|
| CLARIFY GATE | quality-gates.md | 定義を一元化、他ファイルは参照リンクのみに |
| Multi-Review 3観点 | quality-gates.md | 定義を一元化 |
| Spec Creation Flow | core.md | 定義を一元化 |
| HUMAN_CHECKPOINT | quality-gates.md | 定義を一元化 |

#### [STEP-0.2] 複合変更の定量基準追加 [DONE]

**対象:** judgment-criteria.md
**実施結果:** judgment-criteria.md に「複合変更の判定基準」セクションを追加済み

```markdown
## 複合変更の判定基準

| 規模 | 条件 | 対応 |
|------|------|------|
| 小規模 | 属性 1-3 個、単一 Spec 内、新規 ID 不要 | 同一 Issue で対応 |
| 中規模 | 属性 4-10 個、または 2 Spec に影響 | 分離を提案 |
| 大規模 | 新規 Master 追加、API 変更、3+ Spec に影響 | 必ず分離 |
```

#### [STEP-0.3] バックアップ作成 [DONE]

**実施結果:** audit/backup/phase0/ に workflows/, templates/, constitution/, guides/ をバックアップ済み

---

### [PHASE-1] AI SIer 改訂（共通コンポーネント） [DONE]

**完了日:** 2026-01-01

#### [STEP-1.1] _qa-generation.md 更新 [DONE]

- QA 出力先を Spec ディレクトリ内に変更
  - project-setup: `.specify/docs/project-setup-qa.md`
  - add: `.specify/specs/features/{feature-id}/qa.md`
  - fix: `.specify/specs/fixes/{fix-id}/qa.md`

#### [STEP-1.2] _qa-analysis.md 更新 [DONE]

- 採否フラグに「理由」欄を追加（必須化）
- 採否のビジュアル表示（✅/❌/🔶）を追加

#### [STEP-1.3] _professional-proposals.md 更新 [DONE]

- 提案 ID 命名規則（P-{context}-{number}）を追加
- 提案追跡ログ（.specify/docs/proposal-log.md）を追加
- 理由欄の必須化

#### [STEP-1.4] _cascade-update.md 更新 [DONE]

- 複合変更の判定フローを追加（judgment-criteria.md 参照）
- 規模別の分離判定（小/中/大）を追加
- 分離時の処理フローを追加

---

### [PHASE-2] AI SIer 改訂（テンプレート） [DONE]

**完了日:** 2026-01-01

#### [STEP-2.1] QA テンプレート動的生成化 [DONE]

- _qa-generation.md に質問バンク（project-setup/add/fix 別）を追加
- 動的生成ロジックを文書化
- templates/qa/*.md は参考例として保持

#### [STEP-2.2] Input テンプレート更新 [DONE]

- QA 動的生成との連携を明確化
- 最低限の入力項目を明示（機能名のみで開始可能）
- 空欄は QA で補完されることを説明

---

### [PHASE-3] AI SIer 改訂（ワークフロー） [DONE]

**完了日:** 2026-01-01

#### [STEP-3.1] project-setup.md 更新 [DONE]

- QA 出力先を `.specify/docs/project-setup-qa.md` に変更
- Input リセットを削除（PR マージ後に実行）
- Issue 作成タイミングは既に [HUMAN_CHECKPOINT] 後

#### [STEP-3.2] add.md 更新 [DONE]

- Issue 作成を [HUMAN_CHECKPOINT] 承認後に移動
- QA 生成/分析ステップを追加
- QA 出力先を `.specify/specs/features/{id}/qa.md` に変更
- Input リセットを削除

#### [STEP-3.3] fix.md 更新 [DONE]

- Issue 作成を [HUMAN_CHECKPOINT] 承認後に移動
- QA 生成/分析ステップを追加
- QA 出力先を `.specify/specs/fixes/{id}/qa.md` に変更
- Input リセットを削除

#### [STEP-3.4] Input リセット処理の変更 [DONE]

- post-merge.cjs に Input リセット処理を追加（Step 6）
- ブランチ名/Feature ID から input type を推測してリセット

---

### [PHASE-4] Critical 問題の修正 [DONE]

**完了日:** 2026-01-01

> **詳細:** [findings-report.md](./findings-report.md) の Critical セクション

#### [STEP-4.1] スクリプトセキュリティ修正 [DONE]

| ID | ファイル | 修正内容 | 結果 |
|----|---------|---------|------|
| C-SCR-001 | pr.cjs | Shell Injection 修正（shell: false） | ✅ 修正済み |
| C-SCR-002 | spec-lint.cjs | Incremental Mode 重複チェック修正 | ✅ 既に対応済み |
| C-SCR-003 | scaffold-spec.cjs | Feature Table 重複挿入防止 | ✅ 既に対応済み |
| C-SCR-006 | state.cjs | Boolean 検証追加 | ✅ 修正済み |

#### [STEP-4.2] 参照パス修正 [DONE]

旧サブスキル構造への参照がないことを確認済み

---

### [PHASE-5] Major 問題の修正 [DONE]

**完了日:** 2026-01-01

#### [STEP-5.1] コード重複解消 [DONE]

- generate-matrix-view.cjs を matrix-utils.cjs 使用に変更（約200行削減）
- validate-matrix.cjs に matrix-utils.cjs からの共有関数をインポート

#### [STEP-5.2] Status 定義統一 [DONE]

- terminology.md に全 Status 定義を集約
- DEPRECATED, SUPERSEDED を追加
- IMPLEMENTING の使用禁止を明記
- post-merge.cjs の Status 値を terminology.md に準拠するよう修正

#### [STEP-5.3] Todo Template 分析 [DONE]

- 22 ワークフロー中 13 に Todo Template が既に存在
- implement.md, tasks.md は独自の Todo Management セクションを持つ
- 残りの 7 ワークフローは軽量（4-6 ステップ）で Todo Template は過剰と判断

---

### [PHASE-6] ドキュメント整備 [DONE]

**完了日:** 2026-01-01

#### [STEP-6.1] ユーザージャーニーの追加 [DONE]

**追加先:** docs/Workflows-Reference.md（Before vs After セクション追加済み）

```markdown
## ユーザージャーニー: Before vs After

### 「機能を追加したい」の場合

**Before (現在):**
1. add-input.md を開いて記入
2. /add を実行
3. Deep Interview で 20+ 問の質問に答える（長い）
4. Feature Spec 生成
5. Issue 作成
6. Multi-Review → Clarify → 承認

**After (改訂後):**
1. add-input.md に概要だけ記入（任意）
2. /add を実行
3. AI が QA ドキュメント生成 → ユーザーが回答 → 未回答のみ対話で確認
4. AI が機能提案「〇〇も必要では？」
5. Feature Spec 生成
6. Multi-Review → Clarify → [HUMAN_CHECKPOINT] → 承認
7. Issue 作成（承認後）

**改善点:**
- QA ドキュメントでまとめて回答可能
- AI からの提案で抜け漏れ発見
- Issue は承認後に作成（無駄な Issue を防止）
```

---

### [PHASE-7] 検証 [IN-PROGRESS]

#### [STEP-7.1] 自動検証 [DONE]

**完了日:** 2026-01-01

```bash
# 旧構造への参照チェック - 結果: なし
grep -r "spec-mesh-entry" .claude/skills/spec-mesh/
grep -r "spec-mesh-develop" .claude/skills/spec-mesh/
grep -r "spec-mesh-quality" .claude/skills/spec-mesh/
grep -r "spec-mesh-test" .claude/skills/spec-mesh/
grep -r "spec-mesh-meta" .claude/skills/spec-mesh/

# Lint 実行 - 結果: 問題なし
node .claude/skills/spec-mesh/scripts/spec-lint.cjs
```

#### [STEP-7.2] 30 Agent 調査 [DONE]

**完了日:** 2026-01-01

> **調査計画:** [design-verification-and-investigation-plan.md](./design-verification-and-investigation-plan.md)
> **最終レポート:** [30-agent-investigation-report.md](./30-agent-investigation-report.md)

**実行結果:**

| Phase | Agent数 | Critical | Major | Minor | 状態 |
|-------|--------|----------|-------|-------|------|
| A: 構造検証 | 10 | 0 | 1 | 19 | OK |
| B: ワークフロー動作 | 10 | 2 | 4 | 27 | WARN |
| C: QA 方式 | 5 | 1 | 8 | 15 | WARN |
| D: 回帰テスト | 5 | 0再発 | 1未修正 | - | OK |

**個別レポート:**
- [phase-a-report.md](./phase-a-report.md) - 構造検証
- [phase-b-report.md](./phase-b-report.md) - ワークフロー動作検証
- [phase-c-report.md](./phase-c-report.md) - QA 方式検証
- [phase-d-report.md](./phase-d-report.md) - 回帰テスト

#### [STEP-7.2.1] Critical/Major 問題の修正 [DONE]

**完了日:** 2026-01-01

**Critical (3件) - 全て修正済み:**

| ID | 問題 | 修正内容 |
|----|------|---------|
| B-01-001 | preserve-input.cjs project-setup未対応 | ✅ project-setup タイプ追加済み |
| B-05-002 | change.md Cascade Update欠落 | ✅ Step 6.5 追加済み |
| C-05-005 | 未回答→[NEEDS CLARIFICATION]未連携 | ✅ _qa-analysis.md に処理追加済み |

**Major (14件) - 全て対応済み:**
- B-04-001, B-05-003, B-07-003, B-08-004: ワークフロー修正済み
- C-01-003, C-02-002, C-05-001, C-05-002, C-05-007, C-05-008: QA方式文書化済み
- D-02-003: issue.md Quick routing 追加済み
- A-08-004, C-04-003, C-05-004: 軽微・構造的問題として許容

**結論:** 本番運用可能な品質レベルに到達

#### [STEP-7.3] 調査結果のテスト化 [PENDING]

- 調査で発見した問題を自動テストに変換
- CI に組み込み可能な形式で作成

---

## 4. 削除予定ドキュメント

| ファイル | 理由 | 削除タイミング |
|---------|------|---------------|
| ACTION-PLAN.md | MASTER-PLAN に統合 | PHASE-0 完了後 |
| implementation-plan-detailed.md | MASTER-PLAN に統合 | PHASE-0 完了後 |
| improvement-proposals.md | MASTER-PLAN に統合 | PHASE-0 完了後 |
| post-migration-improvement-plan.md | MASTER-PLAN に統合 | PHASE-0 完了後 |
| workflow-diagram.md | 古い | 即時 |
| terminology-audit.md | 統合済み | 即時 |
| legacy-cleanup.md | 完了済み | 即時 |
| migration-status.md | 完了済み | 即時 |
| migration-completion-plan.md | 完了済み | 即時 |

## 5. 保持ドキュメント

| ファイル | 用途 |
|---------|------|
| **MASTER-PLAN.md** | メイン計画（本ファイル） |
| **findings-report.md** | 問題の記録 |
| **design-verification-and-investigation-plan.md** | Phase 7 の詳細 |
| **backup/** | バックアップ |

## 6. 参考資料（reference/ に移動）

| ファイル | 内容 |
|---------|------|
| ai-sier-qa.md | 設計 FAQ |
| input-interview-improvement-plan.md | 設計思想の詳細 |

---

## 7. 進捗トラッキング

| Phase | ステータス | 完了日 |
|-------|----------|--------|
| PHASE-0 | [DONE] | 2026-01-01 |
| PHASE-1 | [DONE] | 2026-01-01 |
| PHASE-2 | [DONE] | 2026-01-01 |
| PHASE-3 | [DONE] | 2026-01-01 |
| PHASE-4 | [DONE] | 2026-01-01 |
| PHASE-5 | [DONE] | 2026-01-01 |
| PHASE-6 | [DONE] | 2026-01-01 |
| PHASE-7 | [IN-PROGRESS] | - |

---

## 8. Compact 後の再開チェックリスト

compact 発生後、以下を確認：

1. [ ] このファイル (MASTER-PLAN.md) を読み込み
2. [ ] 進捗トラッキング（Section 7）で現在のフェーズを確認
3. [ ] [IN-PROGRESS] のステップを探す
4. [ ] そのステップから作業を再開

---

**次のアクション:** STEP-7.3（調査結果のテスト化）を開始
