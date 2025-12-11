# CLAUDE Development Guide

このリポジトリで開発を行う AI コーディングアシスタント（Claude Code など）の行動指針です。
`.specify/memory/constitution.md` を最上位ルールとし、仕様駆動開発（Spec-Driven Development）
と GitHub ガバナンスを守りながら安全に作業します。

---

## 1. 役割と優先順位

- Engineering Constitution が最優先。その次に Overview/Feature の各 spec、plan、tasks。
- すべての非トリビアルな変更は「Issue → `/speckit.specify` → `/speckit.plan` → `/speckit.tasks`
  → 実装 → テスト → PR」の順を守る。ショートカット禁止。
- 仕様に矛盾・不足があれば、推測せず `/speckit.clarify` や Issue でエスカレーション。

---

## 2. 前提ツールと環境

- 必須: Git / GitHub アカウント / GitHub CLI (`gh`)
- ランタイム: Node.js / パッケージマネージャ（npm/pnpm/yarn。プロジェクト方針に合わせる）
- MCP (Claude Code 例):  
  - `serene`: プロジェクト構造・ファイル操作  
  - `context7`: ライブラリ/フレームワークのドキュメント検索  
  - `playwright` (任意): ブラウザ自動化・E2E 補助
- Python を使う作業では仮想環境を必ず有効化してから変更提案する（例: `.\venv\Scripts\activate`）。

---

## 3. 仕様駆動フロー

1. Issue を作成し、作業ブランチを `spec/<issue>-...` / `feature/<issue>-...` などで切る。
   - コマンド: `node .specify/scripts/branch.js --type feature --slug <slug> --issue <num>`（/speckit.branch）
   - Issue 作成時は GitHub のテンプレ（feature/spec-change/bug）を使用。概要・何を変えたいかだけを人が書き、詳細な影響やテスト方針は spec/plan で AI が詰める。
2. `/speckit.specify` で Overview/Feature を明示して spec を作成・更新  
   - 共有マスター/共有 API の追加・変更は Overview 側で実施。Feature 側は ID 参照のみ。
   - 初期ブートストラップは `/speckit.bootstrap`、追加 Feature 提案は `/speckit.propose-features`。
   - 手動で作る場合も scaffold スクリプトを推奨：  
     `node .specify/scripts/scaffold-spec.js --kind overview ...`  
     `node .specify/scripts/scaffold-spec.js --kind feature ... --overview S-OVERVIEW-001`
   - Overview の Feature index は表形式 `| Feature ID | Title | Path | Status |` で必ず更新されるようにする（scaffold は自動追記）。
3. `/speckit.plan` で実装方針を具体化し、仕様 ID を明記。
4. `/speckit.tasks` で小さなタスクに分割（ユーザーストーリー単位で独立テスト可能に）。
5. 実装。タスク外の変更は行わない。仕様・plan とずれたら先に更新を提案。
6. テストを実行し、結果を記録。CI で落ちた場合は原因（spec / test / implementation / environment）を分類して Issue に残す。
7. PR 作成は `node .specify/scripts/pr.js --title ... --body ...`（/speckit.pr）。デフォルトで `spec-lint` を実行。

---

## 4. Git / PR ワークフロー

- `main` への直接 push は禁止。常に Issue 連動ブランチで作業。
- PR 作成時（`gh pr create` 推奨）に必ず記載:
  - 関連 Issue (`Fixes #123`)
  - 関連 Spec ID (`Implements S-001, UC-003` など)
  - 実行したテストと結果
- PR 作成後は Codex などの自動レビューコメントを読み、妥当な指摘は修正、
  却下する場合は理由をコメントに残す。

---

## 5. テストと診断の原則

- 目的は CI を「緑にする」ことではなく、仕様に沿った挙動を保証すること。
- テスト失敗時は必ず原因を分類（spec / test / implementation / environment）。推測で修正しない。
- テストを弱める・skip する・削除する場合は、Issue で理由と影響する Spec ID を記録し、
  レビュー承認を得るまで実施しない。

---

## 6. 曖昧さ・未定義事項の扱い

- 仕様が曖昧・矛盾している場合、勝手に実装しない。
- `/speckit.clarify` で論点を整理し、必要に応じて新規 Issue を起票する。

---

## 7. コードスタイルと変更粒度

- 小さくレビューしやすい差分を好む。1 Issue / 1 Feature Spec / 1 ユースケース単位が原則。
- 無関係なリファクタリングを同一 PR に混ぜない。必要なら別 Issue/PR を提案する。
- ログやエラー処理は spec/plan の方針に従う。不要な debug 出力は削除。

---

## 8. このガイドの更新

- AI 側の行動原則を変える場合は、必ず人間と合意し、PR を通して `CLAUDE.md` を更新する。
- 大きな変更は Constitution と同様にレビューと承認を経て反映する。
