# SSD-Template 最終レビュー

**Generated:** 2025-12-12
**Scope:** Templates, Commands, CLAUDE.md, Constitution, Scripts

---

## Executive Summary

全体的に非常に高品質なフレームワークです。3層 Spec 構造（Vision → Domain → Feature）、
状態管理、clarify ループ、Case 2/3 分岐など、公式 speckit を大幅に超える機能を実現しています。

**総合評価: A** (いくつかの小さな改善点あり)

---

## 1. 発見した整合性の問題

### 1.1 CRITICAL - なし

すべての重大な問題は前回のセッションで解決済み:
- ✅ Feature Index 自動更新 (issue.md, add.md に追加済み)
- ✅ checklist コマンド (追加済み)

### 1.2 HIGH - 修正済み ✅

| # | 問題 | 影響 | 対処 | 状態 |
|---|------|------|------|------|
| H-1 | spec-metrics.js が OVERVIEW のみ認識、DOMAIN 未対応 | Domain Spec が検出されない | normalizeSpecType に DOMAIN/VISION を追加 | ✅ Fixed |
| H-2 | speckit.clarify.md の Section 番号参照が古い | clarify 時のセクション更新が誤る可能性 | Domain/Feature 両方のテンプレートに合わせて更新 | ✅ Fixed |
| H-3 | speckit.bootstrap.md が DEPRECATED だが handoffs にまだアクション定義 | 混乱を招く | handoffs を削除 | ✅ Fixed |

### 1.3 MEDIUM - 修正済み ✅

| # | 問題 | 影響 | 対処 | 状態 |
|---|------|------|------|------|
| M-1 | speckit.vision.md の Output に `/speckit.features` 記載 | コマンドは存在しない | `/speckit.design` に統一 | ✅ Fixed |
| M-2 | Feature Spec template の Section 14 (Changelog) の Change types に "Bug Fix" あり | Fix は別フローなので混乱の可能性 | ドキュメント整理のみ（実害なし） | Deferred |
| M-3 | tasks-template.md の Phase 0 で "target spec(s)" と複数形 | 1 Feature = 1 Spec が原則 | 微細な問題のため保留 | Deferred |

### 1.4 LOW - 対応完了 ✅

| # | 問題 | 影響 | 対処 | 状態 |
|---|------|------|------|------|
| L-1 | bash scripts (setup-plan.sh 等) が存在するが未使用 | デッドコード | `.specify/scripts/bash/` ディレクトリ全体を削除 | ✅ Deleted |
| L-2 | agent-file-template.md が未使用 | CLAUDE.md は静的ファイル | agent-file-template.md を削除 | ✅ Deleted |
| L-3 | spec-lint.js の Domain freshness check が 7 日固定 | プロジェクトによって適切な期間が異なる | 将来的に設定ファイル化検討 | Deferred |

---

## 2. 改善提案

### 2.1 Scripts

#### spec-metrics.js の Domain 対応
```javascript
// Line 51-55: normalizeSpecType を修正
function normalizeSpecType(raw) {
  if (!raw) return null;
  const cleaned = raw.replace(/[\[\]]/g, '').split('|')[0].trim().toUpperCase();
  if (cleaned.startsWith('VISION')) return 'VISION';
  if (cleaned.startsWith('OVERVIEW') || cleaned.startsWith('DOMAIN')) return 'DOMAIN';  // DOMAIN追加
  if (cleaned.startsWith('FEATURE')) return 'FEATURE';
  return cleaned || null;
}

// Line 136-137: overviewSpecs → domainSpecs に変数名変更も検討
const domainSpecs = specs.filter((s) => s.specType === 'DOMAIN' || s.specType === 'OVERVIEW');
```

#### branch.js のエラーハンドリング強化
```javascript
// Line 139: 失敗時の詳細情報追加
try {
  run(`git checkout -b ${branch}`);
} catch (e) {
  console.error(`Failed to create branch: ${branch}`);
  console.error(`  Ensure you have a clean working directory and are in a git repository.`);
  process.exit(1);
}
```

### 2.2 Commands

#### speckit.spec.md のセクション番号更新
現在の参照:
```markdown
| 回答の種類 | 更新先セクション |
|-----------|-----------------|
| マスターデータ | Section 4 (Data Model) |
```

Feature Spec template に合わせた修正:
```markdown
| 回答の種類 | 更新先セクション |
|-----------|-----------------|
| Domain依存 | Section 2 (Domain Dependencies) |
| UC/ストーリー | Section 4 (User Stories / Use Cases) |
| 機能要件 | Section 5 (Functional Requirements) |
```

### 2.3 Templates

#### vision-spec-template.md への Related Domain 追加
Vision → Domain の明示的な関連付け:
```markdown
## 9. Related Documents

- Domain Spec: `.specify/specs/domain/spec.md` (to be created)
- Domain ID: S-DOMAIN-001 (予定)
```

---

## 3. 整合性確認結果

### 3.1 コマンド間の一貫性 ✅

| 確認項目 | 結果 |
|---------|------|
| clarify ループの実装 | ✅ 全エントリーポイント (vision, design, issue, add, fix) で一貫 |
| 1問ずつ質問 | ✅ 全コマンドで統一 |
| 推奨オプション提示 | ✅ 全コマンドで統一 |
| 即時 Spec 更新 | ✅ 全コマンドで統一 |
| lint 実行タイミング | ✅ clarify 後、PR 前で統一 |
| state.js 更新タイミング | ✅ 各ステップ完了時で統一 |

### 3.2 Template 間の一貫性 ✅

| 確認項目 | 結果 |
|---------|------|
| 3層構造 (Vision/Domain/Feature) | ✅ 明確に分離 |
| M-*/API-* 参照ルール | ✅ Domain で定義、Feature で参照 |
| Changelog セクション | ✅ 全 template に存在 |
| Clarifications セクション | ✅ 全 template に存在 |
| Status 値 | ✅ Draft/In Review/Approved/Implementing/Completed で統一 |

### 3.3 CLAUDE.md と Constitution の整合性 ✅

| 確認項目 | 結果 |
|---------|------|
| 6-step workflow | ✅ 両方で同じ定義 |
| Git workflow | ✅ 両方で同じルール |
| テスト原則 | ✅ fail-first、spec-driven で統一 |
| AI Agent conduct | ✅ Constitution で定義、CLAUDE.md で参照 |

### 3.4 Scripts と Commands の整合性 ✅

| 確認項目 | 結果 |
|---------|------|
| scaffold-spec.js | ✅ vision/domain/feature 全対応 |
| branch.js | ✅ feature/fix/spec/spec-change 全対応 |
| state.js | ✅ 全コマンドから参照される状態管理 |
| spec-lint.js | ✅ Vision/Domain/Feature 全チェック |

---

## 4. 品質評価

### 4.1 Documentation Quality

| 項目 | 評価 | コメント |
|------|------|---------|
| CLAUDE.md | A | 完璧なワークフローガイド |
| Constitution | A | 包括的で明確な原則 |
| Commands | A | 詳細な例と手順 |
| Templates | A | 構造化されたセクション |

### 4.2 Script Quality

| Script | 評価 | コメント |
|--------|------|---------|
| state.js | A | 完全な状態管理、ヘルプ充実 |
| scaffold-spec.js | A | レガシー対応も含む |
| spec-lint.js | A | 拡張チェック、Plan/Tasks 整合性確認 |
| branch.js | B+ | 基本機能OK、エラーハンドリング改善余地 |
| pr.js | B+ | 基本機能OK |
| spec-metrics.js | A | Vision/Domain/Feature 全対応（修正済み） |

### 4.3 Template Quality

| Template | 評価 | コメント |
|----------|------|---------|
| vision-spec-template | A | 明確な目的・ジャーニー構造 |
| domain-spec-template | A | M-*/API-*/Feature Index 完備 |
| feature-spec-template | A | Domain 参照構造明確 |
| plan-template | A | Constitution Check 含む |
| tasks-template | A | UC ベースのタスク分割 |
| checklist-template | A | Unit Tests for English 明確 |

---

## 5. 推奨アクション

### 即時対応 (H-1, H-2) - ✅ 完了

1. **spec-metrics.js の Domain 対応** ✅
   - `normalizeSpecType` 関数に VISION, DOMAIN を追加
   - 変数名を `overviewSpecs` → `domainSpecs` に変更
   - Vision Spec のメトリクスも追加

2. **speckit.clarify.md のセクション番号修正** ✅
   - Domain Spec と Feature Spec の両方に対応したマッピング表に更新
   - 例の Section 番号も修正

### 短期対応 (M-1, H-3) - ✅ 完了

3. **speckit.vision.md の出力例修正** ✅
   - `/speckit.features` を `/speckit.design` に変更

4. **speckit.bootstrap.md の整理** ✅
   - handoffs を削除

### 長期対応 (L-1, L-2) - ✅ 完了

5. **未使用ファイルの削除** ✅
   - `.specify/scripts/bash/` ディレクトリ全体を削除（5ファイル）
   - `agent-file-template.md` を削除

### 将来検討 (L-3)

6. **設定ファイルの導入**
   - lint の閾値（7日など）を設定ファイル化

---

## 6. 特筆すべき優れた点

### 6.1 アーキテクチャ

- **3層 Spec 構造**: Vision → Domain → Feature の明確な分離は、公式 speckit の Overview 単層より優れている
- **状態管理**: repo-state.json + branch-state.json の2層構造で、並行開発と中断/再開をサポート
- **Case 2/3 分岐**: Feature Spec 作成時の Domain 変更検出と適切なリダイレクト

### 6.2 ワークフロー

- **clarify ループ**: 1問ずつ、推奨オプション、即時更新の徹底
- **警告ベースアプローチ**: 強制ブロックせず人間の判断を尊重
- **Feature Index**: Domain Spec での Feature 一覧管理

### 6.3 品質保証

- **checklist コマンド**: "Unit Tests for English" の概念は斬新
- **spec-lint の拡張**: Plan/Tasks 整合性、Domain freshness チェック
- **spec-metrics**: プロジェクト健全性の定量評価

---

## 7. まとめ

このフレームワークは、公式 speckit を基盤としながら、実際のプロジェクト運用に必要な
多くの機能を追加しています。特に以下の点で優れています：

1. **明確な責務分離** (Vision/Domain/Feature)
2. **堅牢な状態管理** (並行開発、中断/再開対応)
3. **徹底した clarify ループ** (曖昧さの排除)
4. **警告ベースの柔軟性** (人間の判断を尊重)

上記の HIGH/MEDIUM 優先度の修正を適用することで、さらに完成度の高いフレームワークになります。

---

## Appendix: ファイル一覧

### Templates (6 files)
- vision-spec-template.md
- domain-spec-template.md
- feature-spec-template.md
- plan-template.md
- tasks-template.md
- checklist-template.md

### Commands (18 files)
- speckit.vision.md
- speckit.design.md
- speckit.issue.md
- speckit.add.md
- speckit.fix.md
- speckit.featureproposal.md
- speckit.change.md
- speckit.spec.md
- speckit.plan.md
- speckit.tasks.md
- speckit.implement.md
- speckit.pr.md
- speckit.analyze.md
- speckit.feedback.md
- speckit.clarify.md
- speckit.checklist.md
- speckit.lint.md
- speckit.bootstrap.md (DEPRECATED)

### Scripts (6 JS files)
- state.js
- scaffold-spec.js
- spec-lint.js
- branch.js
- pr.js
- spec-metrics.js

### Core Documents (2 files)
- CLAUDE.md
- .specify/memory/constitution.md
