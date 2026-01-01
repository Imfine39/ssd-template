# Terminology Audit

**作成日:** 2026-01-01

---

## 1. 定義済み用語の使用状況

### 1.1 constitution/terminology.md で定義された用語

| 用語 | 定義 | 使用状況 | 問題 |
|------|------|---------|------|
| **Spec** | 仕様文書 | 全ファイルで使用 | 良好 |
| **Vision Spec** | プロジェクト目的・ゴール定義 | 一貫して使用 | 良好 |
| **Domain Spec** | データモデル・API・ルール定義 | 一貫して使用 | 良好 |
| **Screen Spec** | 画面設計定義 | 一貫して使用 | 良好 |
| **Feature Spec** | 個別機能仕様 | 一貫して使用 | 良好 |
| **Fix Spec** | バグ修正仕様 | 一貫して使用 | 良好 |
| **Test Scenario Spec** | テスト仕様 | 一貫して使用 | 良好 |

### 1.2 Status 用語

| Status | 定義場所 | 使用状況 | 問題 |
|--------|---------|---------|------|
| **Draft** | terminology.md | 全Spec共通 | 良好 |
| **In Review** | terminology.md | 全Spec共通 | 良好 |
| **Clarified** | terminology.md | 全Spec共通 | 良好 |
| **Approved** | terminology.md | 全Spec共通 | 良好 |
| **Implemented** | terminology.md | Feature/Fix | 良好 |
| **Planned** | screen-spec.md | Screen Entity | ⚠️ terminology.md未定義 |
| **In Progress** | screen-spec.md | Screen Entity | ⚠️ terminology.md未定義 |
| **Deprecated** | screen-spec.md | Screen Entity | ⚠️ terminology.md未定義 |
| **Pending** | test-scenario-spec.md | Test Case | ⚠️ terminology.md未定義 |
| **Pass** | test-scenario-spec.md | Test Case | ⚠️ terminology.md未定義 |
| **Fail** | test-scenario-spec.md | Test Case | ⚠️ terminology.md未定義 |
| **Blocked** | test-scenario-spec.md | Test Case | ⚠️ terminology.md未定義 |
| **Skipped** | test-scenario-spec.md | Test Case | ⚠️ terminology.md未定義 |
| **COMPLETED** | post-merge.cjs | Feature | ⚠️ Implementedと不整合 |

---

## 2. ID 命名規則の使用状況

### 2.1 定義済みID形式（guides/id-naming.md）

| ID形式 | 説明 | 使用状況 | 問題 |
|--------|------|---------|------|
| **S-VISION-001** | Vision Spec | 一貫 | 良好 |
| **S-DOMAIN-001** | Domain Spec | 一貫 | 良好 |
| **S-SCREEN-001** | Screen Spec | 一貫 | 良好 |
| **S-{AREA}-{NNN}** | Feature Spec | 一貫 | 良好 |
| **F-{AREA}-{NNN}** | Fix Spec | 一貫 | 良好 |
| **TS-{FEATURE_ID}** | Test Scenario | 一貫 | 良好 |
| **SCR-{NNN}** | 個別画面 | 一貫 | 良好 |
| **COMP-{NNN}** | 共有コンポーネント | 一貫 | 良好 |
| **M-{NAME}** | マスター | ⚠️ 不整合 | Feature SpecでM-{AREA}-001 |
| **API-{RESOURCE}-{ACTION}-{NNN}** | API | 一貫 | 良好 |
| **BR-{NNN}** | ビジネスルール | 一貫 | 良好 |
| **VR-{NNN}** | 検証ルール | 一貫 | 良好 |
| **UC-{NNN}** | ユースケース | 一貫 | 良好 |
| **FR-{NNN}** | 機能要件 | 一貫 | 良好 |
| **SC-{NNN}** | 成功基準 | 一貫 | 良好 |
| **TC-{NNN}** | テストケース（正常系） | 一貫 | 良好 |
| **TC-N{NN}** | テストケース（異常系） | 一貫 | 良好 |
| **TC-J{NN}** | テストケース（ジャーニー） | ⚠️ 未定義 | 使用されているが定義なし |
| **T-{NNN}** | タスク | 一貫 | 良好 |
| **T-{NNN}.{N}** | サブタスク | ⚠️ 不整合 | T-002.5形式が使用 |

---

## 3. 未定義用語の検出

### 3.1 ワークフロー関連

| 用語 | 使用箇所 | 推奨定義 |
|------|---------|---------|
| **CLARIFY GATE** | 複数ワークフロー | quality-gates.mdで定義済み、terminology.mdに参照追加推奨 |
| **PASSED** | CLARIFY GATE | 曖昧点0の状態 |
| **PASSED_WITH_DEFERRED** | CLARIFY GATE | 曖昧点0だが保留項目あり |
| **BLOCKED** | CLARIFY GATE | 曖昧点ありで進行不可 |
| **Multi-Review** | quality-gates.md | 3観点並列レビュー |
| **Deep Interview** | _deep-interview.md | 機能追加時の深掘りインタビュー |
| **Vision Interview** | _vision-interview.md | Vision作成時の3フェーズインタビュー |
| **Cascade Update** | _cascade-update.md | 関連Spec連鎖更新 |
| **Pending Additions** | 複数 | SSOT外での追加予定項目 |

### 3.2 マーカー関連

| マーカー | 使用箇所 | 推奨定義 |
|---------|---------|---------|
| **[NEEDS CLARIFICATION]** | Spec内 | 要確認項目 |
| **[DEFERRED]** | Spec内 | 保留項目 |
| **[HUMAN_CHECKPOINT]** | ワークフロー | 人間確認必須ポイント |
| **[PENDING_ADDITION]** | Domain/Feature | 追加予定項目 |

---

## 4. 用語の不整合

### 4.1 Master ID形式

**問題:** 2つの異なる形式が使用されている

| ファイル | 形式 | 例 |
|---------|------|-----|
| domain-spec.md | M-{NAME} | M-USER, M-ORDER |
| feature-spec.md | M-{AREA}-001 | M-AUTH-001 |

**推奨:** `M-{NAME}` 形式に統一（Domain Specが正）

### 4.2 Implemented vs COMPLETED

**問題:** Feature Specの完了ステータスが不統一

| ファイル | 使用ステータス |
|---------|--------------|
| terminology.md | Implemented |
| post-merge.cjs | COMPLETED |

**推奨:** `Implemented` に統一

### 4.3 Test Case ID

**問題:** Journey テストのID形式が未定義

| 形式 | 使用状況 | 定義状況 |
|------|---------|---------|
| TC-{NNN} | 正常系 | 定義済み |
| TC-N{NN} | 異常系 | 定義済み |
| TC-J{NN} | ジャーニー | ⚠️ 未定義 |

**推奨:** `TC-J{NN}` を guides/id-naming.md に追加

---

## 5. 日英混在の検出

### 5.1 ファイル別検出結果

| ファイル | 日本語割合 | 英語割合 | 推奨 |
|---------|-----------|---------|------|
| vision.md | 40% | 60% | 日本語統一 |
| design.md | 50% | 50% | 日本語統一 |
| add.md | 35% | 65% | 日本語統一 |
| fix.md | 45% | 55% | 日本語統一 |
| plan.md | 30% | 70% | 日本語統一 |
| implement.md | 20% | 80% | 日本語統一 |
| テンプレート | 60% | 40% | 英語統一（国際対応） |

### 5.2 混在パターン

```markdown
# 問題パターン1: 見出しが英語、本文が日本語
## Prerequisites
以下の条件を満たしていること

# 問題パターン2: 同一段落で混在
実行結果を confirm してください

# 問題パターン3: 技術用語の不統一
「Spec」と「仕様」が混在
```

---

## 6. 推奨アクション

### 6.1 terminology.md への追加

```markdown
## 追加すべき定義

### Entity Level Status
| Status | 説明 |
|--------|------|
| Planned | 計画中（未着手） |
| In Progress | 実装中 |
| Implemented | 実装完了 |
| Deprecated | 廃止予定 |

### Test Level Status
| Status | 説明 |
|--------|------|
| Pending | 未実行 |
| Pass | テスト成功 |
| Fail | テスト失敗 |
| Blocked | 前提条件未達成 |
| Skipped | 意図的にスキップ |

### CLARIFY GATE Results
| Result | 説明 |
|--------|------|
| PASSED | [NEEDS CLARIFICATION] = 0, [DEFERRED] = 0 |
| PASSED_WITH_DEFERRED | [NEEDS CLARIFICATION] = 0, [DEFERRED] > 0 |
| BLOCKED | [NEEDS CLARIFICATION] > 0 |

### Markers
| Marker | 説明 |
|--------|------|
| [NEEDS CLARIFICATION] | 要確認項目（CLARIFY GATE ブロック） |
| [DEFERRED] | 保留項目（後続フェーズで解決予定） |
| [HUMAN_CHECKPOINT] | 人間確認必須ポイント |
| [PENDING_ADDITION] | SSOT外での追加予定 |
```

### 6.2 guides/id-naming.md への追加

```markdown
### Test Case ID（追加）

| ID形式 | 用途 | 例 |
|--------|------|-----|
| TC-J{NN} | ジャーニーテスト | TC-J01, TC-J02 |
```

### 6.3 言語ポリシーの明確化

```markdown
## 言語ポリシー（constitution/terminology.md に追加）

### ワークフロー・ドキュメント
- **主言語:** 日本語
- **技術用語:** 英語のまま使用（Spec, Feature, Domain等）
- **混在禁止:** 同一文内での日英混在を避ける

### テンプレート
- **主言語:** 英語（国際対応のため）
- **セクション見出し:** 英語
- **説明・コメント:** 英語

### スクリプト
- **コード:** 英語
- **コメント:** 日本語可（チーム方針による）
- **エラーメッセージ:** 英語
```

---

## 7. 検証コマンド

```bash
# Status用語の使用状況確認
grep -r "Status:" .claude/skills/spec-mesh/

# COMPLETED vs Implemented の検出
grep -r "COMPLETED" .claude/skills/spec-mesh/
grep -r "Implemented" .claude/skills/spec-mesh/

# 未定義マーカーの検出
grep -r "\[NEEDS CLARIFICATION\]" .claude/skills/spec-mesh/
grep -r "\[DEFERRED\]" .claude/skills/spec-mesh/
grep -r "\[PENDING_ADDITION\]" .claude/skills/spec-mesh/

# Master ID形式の検出
grep -r "M-[A-Z]*-[0-9]" .claude/skills/spec-mesh/templates/
grep -r "M-[A-Z_]*[^-0-9]" .claude/skills/spec-mesh/templates/
```
