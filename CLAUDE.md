# CLAUDE Development Guide

このリポジトリで開発を行う AI コーディングアシスタント（Claude Code など）の行動指針です。
`.specify/memory/constitution.md` を最上位ルールとし、仕様駆動開発（Spec-Driven Development）
と GitHub ガバナンスを守りながら安全に作業します。

---

## 1. 役割と優先順位

- Engineering Constitution が最優先。その次に Overview/Feature の各 spec、plan、tasks。
- すべての非トリビアルな変更は 6 ステップワークフローを守る。ショートカット禁止。
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

## 3. 6 ステップワークフロー

```
Step 1: エントリーポイント
  /speckit.add      - 新機能（Issueなし）
  /speckit.fix      - バグ修正（Issueなし）
  /speckit.issue    - 既存Issueから開始
  /speckit.bootstrap - 新規プロジェクト or 追加Feature提案

  → Issue作成 → Branch作成 → Spec作成 → Clarifyループ
  → 人間: Specをレビュー・承認

Step 2: /speckit.plan
  → Plan作成 → 整合性チェック
  → 人間: Planをレビュー・承認

Step 3: /speckit.tasks
  → Tasks作成
  → 人間: Tasksを確認

Step 4: /speckit.implement
  → タスク実装 → テスト作成・実行
  → 人間: Feedback発見時に許可

Step 5: /speckit.pr
  → 整合性確認（/speckit.analyze推奨）→ PR作成

Step 6: PRレビュー
  → 人間: 最終承認・マージ
```

### コマンド一覧

**エントリーポイント (4個)**
| コマンド | 用途 |
|---------|------|
| `/speckit.bootstrap` | 新規プロジェクト立ち上げ or 追加Feature提案 |
| `/speckit.add` | 新機能追加（Issueなし→自動作成） |
| `/speckit.fix` | バグ修正（Issueなし→自動作成） |
| `/speckit.issue` | 既存Issue選択→開発開始 |

**基本コマンド (5個)** - 途中再開にも使用
| コマンド | 用途 |
|---------|------|
| `/speckit.spec` | Spec作成/更新 |
| `/speckit.plan` | Plan作成（人間確認で停止） |
| `/speckit.tasks` | Tasks作成 |
| `/speckit.implement` | 実装 |
| `/speckit.pr` | PR作成 |

**ユーティリティ (4個)**
| コマンド | 用途 |
|---------|------|
| `/speckit.analyze` | 実装とSpec/Overviewの整合性分析（PR前の安心確認） |
| `/speckit.feedback` | Specへのフィードバック記録 |
| `/speckit.clarify` | 要件の曖昧点確認 |
| `/speckit.lint` | Spec整合性チェック |

---

## 4. Spec/Overview ルール

- **Overview spec**: 共有マスタ (`M-*`)、共有API (`API-*`)、ドメインルールの唯一の真実。
- **Feature spec**: Overview を参照するのみ。マスタ/API を再定義しない。
- Overview の Feature index は表形式 `| Feature ID | Title | Path | Status |` で管理。
- scaffold スクリプトで作成推奨:
  ```bash
  node .specify/scripts/scaffold-spec.js --kind overview --id S-OVERVIEW-001 --title "..."
  node .specify/scripts/scaffold-spec.js --kind feature --id S-XXX-001 --title "..." --overview S-OVERVIEW-001
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
- エントリーポイント（add/fix/issue）では、Spec作成後に Clarify ループで曖昧点を解消してから人間レビューを依頼。

---

## 8. コードスタイルと変更粒度

- 小さくレビューしやすい差分を好む。1 Issue / 1 Feature Spec / 1 ユースケース単位が原則。
- 無関係なリファクタリングを同一 PR に混ぜない。必要なら別 Issue/PR を提案する。
- ログやエラー処理は spec/plan の方針に従う。不要な debug 出力は削除。

---

## 9. 補助ツールとガイド

- **整合性チェック**: `/speckit.lint` または `node .specify/scripts/spec-lint.js`
- **実装分析**: `/speckit.analyze` で PR 前の安心確認
- **プロジェクト健全性**: `node .specify/scripts/spec-metrics.js` でスコアと問題点を確認
- **エラーリカバリー**: `.specify/guides/error-recovery.md`
- **並行開発**: `.specify/guides/parallel-development.md`
- **変更サイズ分類**: Trivial/Small/Medium/Large/Emergency に応じてフローが異なる（constitution.md 参照）

---

## 10. このガイドの更新

- AI 側の行動原則を変える場合は、必ず人間と合意し、PR を通して `CLAUDE.md` を更新する。
- 大きな変更は Constitution と同様にレビューと承認を経て反映する。
