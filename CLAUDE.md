# CLAUDE Development Guide

このリポジトリで開発を行う AI コーディングアシスタント（Claude Code など）の行動指針です。
`.specify/memory/constitution.md` を最上位ルールとし、仕様駆動開発（Spec-Driven Development）
と GitHub ガバナンスを守りながら安全に作業します。

---

## 1. 役割と優先順位

- Engineering Constitution が最優先。その次に Vision/Domain/Feature の各 spec、plan、tasks。
- すべての非トリビアルな変更はワークフローを守る。ショートカット禁止。
- 仕様に矛盾・不足があれば、推測せず `/speckit.clarify` や Issue でエスカレーション。

---

## 2. 前提ツールと環境

- 必須: Git / GitHub アカウント / GitHub CLI (`gh`)
- ランタイム: Node.js / パッケージマネージャ（npm/pnpm/yarn。プロジェクト方針に合わせる）
- MCP (Claude Code 例):
  - `serena`: プロジェクト構造・ファイル操作
  - `context7`: ライブラリ/フレームワークのドキュメント検索
  - `playwright` (任意): ブラウザ自動化・E2E 補助
- serena が使えない場合は onboard か activate を実施してください。
- Python を使う作業では仮想環境を必ず有効化してから変更提案する（例: `.\venv\Scripts\activate`）。

---

## 3. ワークフロー

### 新規プロジェクト立ち上げフロー

```
Phase 1: /speckit.vision
  → Vision Spec 作成（目的、ジャーニー、スコープ）
  → clarify ループで曖昧点解消
  → 人間: Vision をレビュー・承認

Phase 2: /speckit.design
  → Feature 候補提案 → 人間が採用を選択
  → Feature Issues 一括作成
  → Domain Spec 作成（M-*/API-*、ビジネスルール）
  → clarify ループで曖昧点解消
  → Foundation Issue (S-FOUNDATION-001) 自動作成
  → 人間: Domain Spec をレビュー・承認

Phase 3: /speckit.issue (Foundation Issue を選択)
  → S-FOUNDATION-001 を選択
  → Foundation Feature Spec 作成
  → clarify ループで曖昧点解消
  → 人間: Spec をレビュー・承認

Phase 4: plan → tasks → implement → pr
  → 基盤実装（認証、DB、基本構造）
  → 人間: PR レビュー・マージ

Phase 5以降: Feature 開発（繰り返し）
  /speckit.issue → plan → tasks → implement → pr
```

### 既存プロジェクトへの機能追加フロー

```
/speckit.add (自分で決めた Feature) または /speckit.featureproposal (AI に提案させる)
  → Issue 作成
  → /speckit.issue で開始
  → Feature Spec 作成 → clarify ループ
  → 人間: Spec をレビュー・承認
  → plan → tasks → implement → pr

/speckit.fix (バグ修正)
  → Issue 作成 → Branch 作成 → 既存 Spec 更新
  → clarify ループ
  → 人間: Spec をレビュー・承認
  → plan → tasks → implement → pr
```

### コマンド一覧

**プロジェクト初期化 (2個)**
| コマンド | 用途 |
|---------|------|
| `/speckit.vision` | Vision Spec 作成（目的 + ジャーニー） |
| `/speckit.design` | Feature 提案 + Domain Spec 作成（M-*/API-*） + Foundation Issue |

**開発エントリーポイント (5個)**
| コマンド | 用途 |
|---------|------|
| `/speckit.issue` | 既存 Issue 選択 → Feature Spec 作成 → 開発開始 |
| `/speckit.add` | 新機能追加（Issue 自動作成） |
| `/speckit.fix` | バグ修正（Issue 自動作成） |
| `/speckit.featureproposal` | 追加 Feature を AI に提案させる |
| `/speckit.change` | Vision/Domain Spec 変更 |

**開発フローコマンド (5個)**
| コマンド | 用途 |
|---------|------|
| `/speckit.spec` | Spec 作成/更新 |
| `/speckit.plan` | Plan 作成（人間確認で停止） |
| `/speckit.tasks` | Tasks 作成 |
| `/speckit.implement` | 実装 |
| `/speckit.pr` | PR 作成 |

**ユーティリティ (5個)**
| コマンド | 用途 |
|---------|------|
| `/speckit.analyze` | 実装と Spec の整合性分析（PR 前の安心確認） |
| `/speckit.feedback` | Spec へのフィードバック記録 |
| `/speckit.clarify` | 要件の曖昧点を 1 問ずつ質問 → 即時 Spec 更新 |
| `/speckit.checklist` | 要件品質チェックリスト生成（Unit Tests for English） |
| `/speckit.lint` | Spec 整合性チェック |

---

## 4. Spec ドキュメント構成

### 3層構造
- **Vision Spec** (`.specify/specs/vision/`): プロジェクトの目的、ユーザージャーニー、スコープ
- **Domain Spec** (`.specify/specs/domain/`): 共有マスタ (`M-*`)、共有 API (`API-*`)、ビジネスルール、Feature Index
- **Feature Spec** (`.specify/specs/<feature-id>/`): 個別機能の詳細仕様。Domain を参照するのみ、マスタ/API を再定義しない。

### Feature Index
Domain Spec で全 Feature を表形式で管理:
```markdown
| Feature ID | Title | Path | Status | Related M-*/API-* |
|------------|-------|------|--------|-------------------|
| S-AUTH-001 | 認証機能 | .specify/specs/s-auth-001/ | Completed | M-USER, API-AUTH-* |
```

### scaffold スクリプト
```bash
node .specify/scripts/scaffold-spec.js --kind vision --id S-VISION-001 --title "..."
node .specify/scripts/scaffold-spec.js --kind domain --id S-DOMAIN-001 --title "..." --vision S-VISION-001
node .specify/scripts/scaffold-spec.js --kind feature --id S-XXX-001 --title "..." --domain S-DOMAIN-001
```

---

## 5. Git / PR ワークフロー

- `main` への直接 push は禁止。常に Issue 連動ブランチで作業。
- ブランチ命名: `spec/<issue>-...` / `feature/<issue>-...` / `fix/<issue>-...`
- ブランチ作成: `node .specify/scripts/branch.js --type feature --slug <slug> --issue <num>`
- PR 作成時に必ず記載:
  - 関連 Issue (`Fixes #123`)
  - 関連 Spec ID (`Implements S-001, UC-003` など)
  - 実行したテストと結果
- PR 作成は `/speckit.pr` を使用（`spec-lint` 自動実行）。

---

## 6. テストと診断の原則

- 目的は CI を「緑にする」ことではなく、仕様に沿った挙動を保証すること。
- テスト失敗時は必ず原因を分類（spec / test / implementation / environment）。推測で修正しない。
- テストを弱める・skip する・削除する場合は、Issue で理由と影響する Spec ID を記録し、
  レビュー承認を得るまで実施しない。

---

## 7. 曖昧さ・未定義事項の扱い

- 仕様が曖昧・矛盾している場合、勝手に実装しない。
- `/speckit.clarify` で論点を整理し、必要に応じて新規 Issue を起票する。
- **Clarify は 1 問ずつ質問し、推奨オプションを提示、回答ごとに即時 Spec 更新**。
- **各コマンド（vision, design, issue, add, fix）に clarify ループが組み込まれている**。
- エントリーポイント（add/fix/issue）では、Spec 作成後に Clarify ループで曖昧点を解消してから人間レビューを依頼。

---

## 8. コードスタイルと変更粒度

- 小さくレビューしやすい差分を好む。1 Issue / 1 Feature Spec / 1 ユースケース単位が原則。
- 無関係なリファクタリングを同一 PR に混ぜない。必要なら別 Issue/PR を提案する。
- ログやエラー処理は spec/plan の方針に従う。不要な debug 出力は削除。

---

## 9. 状態管理

プロジェクトとブランチの状態を追跡するための 2 層構造:

### Repo State (`.specify/state/repo-state.json`)
- Vision/Domain Spec の完成度（none/scaffold/draft/clarified/approved）
- プロジェクトフェーズ（initialization/vision/design/foundation/development）
- Feature 進捗カウント

### Branch State (`.specify/state/branch-state.json`)
- ブランチごとの作業ステップ（spec/plan/tasks/implement/pr）
- タスク進捗（completed/total）
- 中断情報（`/speckit.change` による中断時）

### 状態管理コマンド
```bash
node .specify/scripts/state.js init                    # 初期化
node .specify/scripts/state.js query --repo            # Repo 状態確認
node .specify/scripts/state.js query --branch          # 現在のブランチ状態確認
node .specify/scripts/state.js query --suspended       # 中断中のブランチ確認
```

### 警告ベースアプローチ
- 各コマンドは前提条件をチェックし、満たさない場合は警告を表示
- **人間の判断で警告を無視して続行可能**（強制ブロックはしない）

---

## 10. Feature Spec 作成時の M-*/API-* 対応

Feature Spec 作成時（/speckit.issue, /speckit.add）に必要な M-*/API-* を特定した際の分岐:

| Case | 状況 | 対応 |
|------|------|------|
| Case 1 | 既存の M-*/API-* で足りる | そのまま参照を追加 |
| Case 2 | 新規 M-*/API-* が必要 | Feature Spec 作成中に Domain に追加 |
| Case 3 | 既存 M-*/API-* の変更が必要 | `/speckit.change` を実行 |

**Case 3 の場合**: Feature 実装を中断し、`/speckit.change` で Spec 変更を先に完了させる。

---

## 11. 補助ツールとガイド

- **整合性チェック**: `/speckit.lint` または `node .specify/scripts/spec-lint.js`
- **実装分析**: `/speckit.analyze` で PR 前の安心確認
- **プロジェクト健全性**: `node .specify/scripts/spec-metrics.js` でスコアと問題点を確認
- **状態確認**: `node .specify/scripts/state.js query --all` で全状態確認
- **エラーリカバリー**: `.specify/guides/error-recovery.md`
- **並行開発**: `.specify/guides/parallel-development.md`
- **変更サイズ分類**: Trivial/Small/Medium/Large/Emergency に応じてフローが異なる（constitution.md 参照）

---

## 12. このガイドの更新

- AI 側の行動原則を変える場合は、必ず人間と合意し、PR を通して `CLAUDE.md` を更新する。
- 大きな変更は Constitution と同様にレビューと承認を経て反映する。
