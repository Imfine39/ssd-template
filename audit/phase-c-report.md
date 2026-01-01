# Phase C: QA 方式検証レポート

**実施日:** 2026-01-01
**Agent数:** 5

---

## Executive Summary

| Agent | 対象 | 状態 | Critical | Major | Minor |
|-------|------|------|----------|-------|-------|
| C-01 | _qa-generation.md | WARN | 0 | 1 | 2 |
| C-02 | _qa-analysis.md | WARN | 0 | 1 | 3 |
| C-03 | _professional-proposals.md | OK | 0 | 0 | 3 |
| C-04 | templates/qa/*.md | WARN | 0 | 1 | 5 |
| C-05 | QA↔Spec連携 | NG | 1 | 5 | 2 |
| **合計** | | | **1** | **8** | **15** |

---

## Critical 問題 (1件)

### C-05-005: 未回答必須項目と [NEEDS CLARIFICATION] の連携未定義

| 項目 | 内容 |
|------|------|
| ファイル | `_qa-analysis.md` |
| 問題内容 | AskUserQuestion でも回答が得られない場合の処理が未定義。[NEEDS CLARIFICATION] マーカーとの連携が明示されていない |
| 影響 | 未回答の必須項目が Spec に反映されず、CLARIFY GATE で検出されない可能性 |
| 推奨修正 | 未回答時に `[NEEDS CLARIFICATION: {質問内容}]` を Spec に記録するルールを追加 |

---

## Major 問題 (8件)

| ID | ファイル | 問題内容 |
|----|---------|---------|
| C-01-003 | _qa-generation.md | 動的生成の条件評価判定基準が不明確 |
| C-02-002 | _qa-analysis.md | proposal-log.md への書き込み手順が未定義 |
| C-04-003 | feature-qa.md | Feature ID 形式が Spec と不整合（F-XXX vs S-XXX） |
| C-05-001 | _qa-generation.md | 質問バンク→Spec セクションのマッピング未記載 |
| C-05-002 | _qa-analysis.md | QA→Spec マッピングが不完全（未カバーセクション多数） |
| C-05-004 | 複数ファイル | Input→QA→Spec の変換ロジックが散在 |
| C-05-007 | _qa-generation.md | 条件評価の具体的ロジック未定義 |
| C-05-008 | feature-spec.md | 必須セクションが QA で完全にカバーされていない |

---

## Minor 問題 (15件)

| ID | ファイル | 概要 |
|----|---------|------|
| C-01-001 | _qa-generation.md | 技術スタック質問欠如 |
| C-01-002 | _qa-generation.md | 既存機能差分質問欠如 |
| C-02-001 | _qa-analysis.md | 優先順位判断基準が曖昧 |
| C-02-003 | _qa-analysis.md | proposal-log 更新確認欠落 |
| C-02-004 | _qa-analysis.md | 「重要な項目」定義欠落 |
| C-03-001 | _professional-proposals.md | ワークフローからの呼び出しパターン不明確 |
| C-03-002 | _professional-proposals.md | 提案ID命名規則とFeature IDの整合性 |
| C-03-003 | _professional-proposals.md | 🔶 ステータスの意味未記載 |
| C-04-001 | project-setup-qa.md | [任意]マーカー未定義 |
| C-04-002 | _qa-generation.md | 質問ID形式不統一 |
| C-04-004 | fix-qa.md | Fix ID体系未定義 |
| C-04-005 | 各テンプレート | ステータス遷移方法不明 |
| C-04-006 | _qa-generation.md | テンプレートが参考例であることの明記欠如 |
| C-05-003 | feature-qa.md | ID形式不整合 |
| C-05-006 | _qa-analysis.md | 画面構成マッピング誤り |

---

## 良好な点

1. **質問カテゴリシステム**: [必須]/[確認]/[提案]/[選択] の4種類が明確に定義
2. **10観点の提案システム**: _professional-proposals.md に45項目以上のチェックリスト
3. **採否記録**: 理由付きの採否判定と追跡ログの仕組み
4. **出力先パス整合性**: 各ワークフローとQA生成の出力先が一致
5. **テンプレート構造**: 各QAテンプレートが適切なセクションを持つ

---

## 推奨アクション

### 即時対応（Critical）

1. **C-05-005**: `_qa-analysis.md` に未回答必須項目→[NEEDS CLARIFICATION] の連携を明記

### 短期対応（Major）

2. **C-05-002**: QA→Spec マッピング表を完成（全Specセクションカバー）
3. **C-01-003/C-05-007**: 条件評価の具体的判定ロジックを文書化
4. **C-04-003**: Feature ID 形式を S-XXX-001 に統一
5. **C-02-002**: proposal-log.md への書き込み手順を追加

### 中期対応（Minor）

- 質問バンクの拡張（技術スタック、既存機能差分等）
- ドキュメント整合性の改善

---

## QA 方式の全体評価

### 設計品質: 7/10

AI SIer の QA ドキュメント交換方式として、基本的なフレームワークは整備されています。

**強み:**
- 質問カテゴリとマーカーシステムが明確
- 提案観点が網羅的（10観点45項目以上）
- ワークフローとの連携パスが整合

**改善必要:**
- QA→Spec 変換ロジックの完成度
- 条件評価の具体的判定基準
- 未回答必須項目の取り扱い明確化

---

## 結論

Phase C QA 方式検証の結果、**Critical 1件、Major 8件** の問題が発見されました。

QA 方式は AI SIer 改訂の中核機能であり、これらの問題の解決により完成度が大幅に向上します。
特に **C-05-005**（未回答項目の処理）と **C-05-002**（マッピング完成）は、CLARIFY GATE との連携に直結するため優先的な対応が必要です。

**Phase D: 回帰テストに進むことを推奨します。**
