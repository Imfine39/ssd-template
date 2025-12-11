# Spec-Driven Development Template

※ ニックの最強テンプレートにつき乱用注意！（使いすぎるとニックがそっと眉をひそめるとかひそめないとか…）

仕様駆動開発（Spec-Driven Development）、テスト駆動開発（TDD）、および GitHub ガバナンスを  
AI コーディングアシスタント（Claude Code 等）と組み合わせて実践するための、組織共通テンプレートリポジトリです。

---

## 特徴

- Spec-First  
  すべての機能開発は Spec Kit による仕様書（spec.md）から始まります。
- Overview + Feature Spec 方式  
  共通マスタ/API は Overview に一元管理し、Feature Spec はそれを参照するだけにします。
- Test-First / Test-Integrity  
  テストを先に考え、テストは「仕様を守るためのセーフティネット」として扱います。
- GitHub 統合  
  Issue → Spec → Plan → Tasks → 実装 → PR → Codex レビュー → 人間レビュー の明確なワークフロー。
- AI ガバナンス  
  AI が従うべき憲法（Engineering Constitution）と CLAUDE.md による行動規範を用意。

---

## ディレクトリ構成

    .
    ├── .claude/
    │   └── commands/                 # Claude Code スラッシュコマンド
    │       ├── speckit.branch.md         # ブランチ作成（採番）
    │       ├── speckit.bootstrap.md      # 目的→Overview/Feature提案・生成
    │       ├── speckit.propose-features.md # 既存OverviewからFeature提案・生成
    │       ├── speckit.specify.md        # 仕様作成/更新
    │       ├── speckit.plan.md           # 計画作成
    │       ├── speckit.tasks.md          # タスク作成
    │       ├── speckit.implement.md      # 実装実行
    │       ├── speckit.checklist.md      # チェックリスト生成
    │       ├── speckit.analyze.md        # コンテキスト収集
    │       ├── speckit.clarify.md        # 曖昧点確認
    │       ├── speckit.constitution.md   # 憲法確認
    │       ├── speckit.pr.md             # PR 作成ラッパー
    │       ├── speckit.scaffold.md       # spec scaffold ガイド
    │       └── speckit.taskstoissues.md  # タスク→Issue変換
    ├── .specify/
    │   ├── memory/
    │   │   └── constitution.md       # Engineering Constitution（憲法）
    │   ├── templates/                # 各種テンプレート
    │   │   ├── spec-template.md
    │   │   ├── plan-template.md
    │   │   ├── tasks-template.md
    │   │   ├── checklist-template.md
    │   │   └── agent-file-template.md
    │   └── scripts/                  # ユーティリティスクリプト
    │       ├── branch.js                 # ブランチ作成/採番
    │       ├── scaffold-spec.js          # Overview/Feature spec scaffold + Feature index自動追記
    │       ├── spec-lint.js              # Overview/Feature 整合性lint
    │       └── pr.js                     # PR作成ラッパー（spec-lint実行込み）
    └── CLAUDE.md                     # AI 向け開発ガイド

---

## 必要要件

- Git
- GitHub アカウント
- GitHub CLI（`gh`）
- Node.js（LTS）およびプロジェクトで利用するパッケージマネージャ
- Claude Code などの AI コーディングアシスタント
- （Python を使う場合）仮想環境（venv 等）

推奨 MCP サーバー（Claude Code 用）:

| MCP       | 用途                                   | 必須度   |
|----------|----------------------------------------|----------|
| serene   | プロジェクト探索・ファイル編集         | 必須     |
| context7 | ライブラリドキュメント検索             | 必須     |
| playwright | E2E テスト自動化                     | 推奨     |

---

## 使い方（0→1 の立ち上げ）

### 1. テンプレートからリポジトリを作成

- GitHub の「Use this template」ボタンで、本テンプレートから新規リポジトリを作成。
- `.specify/memory/constitution.md` と `CLAUDE.md` はそのまま利用し、必要に応じて微修正。

### 2. Overview Spec の作成

- 最初の Issue を作成（例: “System Overview Spec を定義する”）。
- ブランチを作成: `node .specify/scripts/branch.js --type spec --slug overview --issue <num>`
- Claude Code に `.claude/commands/speckit.bootstrap.md` を使って Overview と Feature 候補を作成させる
  （もしくは `node .specify/scripts/scaffold-spec.js --kind overview ...` で手動作成）。
  - Overview には以下を記述する。
    - ドメイン全体の概要
    - 共通マスタ定義（`M-CLIENTS` 等）
    - 共通 API 定義（`API-PROJECT_ORDERS-LIST` 等）
    - 共通ビジネスルール・ステータス定義
    - 非機能要件（性能・セキュリティ等）
  - Feature を scaffold した場合、Overview の Feature index 表
    `| Feature ID | Title | Path | Status |` が自動追記される。
  - `node .specify/scripts/spec-lint.js` を実行して整合性チェック。

ここで定義した Overview Spec が、全 Feature Spec から参照される「唯一の真実」となります。

### 3. Feature Spec ごとの開発サイクル

新しい機能を追加するたびに、次の流れを取ります。

1. Issue 作成  
   - 例: “#10 Basic Sales Recording 機能を追加”
2. `/speckit.specify`  
   - ブランチ: `node .specify/scripts/branch.js --type feature --slug <slug> --issue <num>`
   - Feature Spec を作成（`/speckit.propose-features` で提案＋scaffold も可）。
   - 対象ユースケース（UC-...）と Overview の依存マスタ/API（M-..., API-...）を明記。
3. `/speckit.plan`  
   - Spec を元に実装計画（plan.md）を生成。
4. `/speckit.tasks`  
   - Plan からタスク（tasks.md）を生成。テスト用タスクも必ず含める。
5. 実装  
   - `/speckit.implement` もしくは通常のコーディングでタスクを順に消化。
6. テスト  
   - 単体・結合・E2E テストを実行し、結果を記録。
7. PR 作成  
   - `node .specify/scripts/pr.js --title "feat: ..." --body "Fixes #..\\nImplements S-...\\nTests: ..."`（デフォルトで spec-lint 実行）
   - 必要ならテストコマンドを別途実行し、その結果を PR body に記載。
   - PR には以下を含める。
     - 関連 Issue（`Fixes #10` 等）
     - 関連 Spec ID（`Implements S-ORDERS-001, UC-001` 等）
     - 実施したテストと結果の要約

---

## PR レビューの流れ（Claude + Codex + 人間）

1. Claude が実装・テストを行い、PR を作成。
2. Codex（または類似ボット）が自動レビューを実行し、改善提案や注意点をコメント。
3. 人間レビュアーは：
   - Codex コメントと diff を確認
   - 問題があれば、Claude に「この PR とコメントを踏まえて修正して」と指示
4. Claude は PR のコンテキストと Codex コメントを読み取り、必要な修正コミットを追加。
5. CI / Codex / 人間レビューがすべてグリーンになったら、レビュアーが squash merge で `main` にマージ。
6. マージ後、対応ブランチは削除（GitHub の自動削除設定推奨）。

---

## ブランチ戦略

- `main` への直接 push は禁止。
- 作業ブランチ命名規則（推奨）:

  - `spec/<issue>-<desc>` 仕様変更
  - `feature/<issue>-<desc>` 機能追加
  - `fix/<issue>-<desc>` バグ修正
  - `hotfix/<issue>-<desc>` 緊急修正

- すべてのブランチは対応 Issue と紐づける。
- マージ後はブランチを削除する（履歴は PR で追跡）。

---

## テストポリシー

- テストは「仕様に沿った振る舞いを守るための最後の砦」。  
  単に CI をグリーンにするためのものではありません。
- 次のような行為は禁止です。
  - 本来の仕様と矛盾する挙動にコードを合わせる形で、テストを通すだけの修正を行うこと。
  - 誤った実装に合わせるためだけにテストの期待値を弱めたり、テスト自体を削除すること。
- テスト失敗時には必ず：
  - 仕様が誤っているのか
  - テストが誤っているのか
  - 実装が誤っているのか
  - 環境・データが誤っているのか  
  を切り分け、その結果を Issue か PR コメントに残します。

---

## このテンプレートの使い回し

- 組織内で新しいシステムを 0→1 で立ち上げる際は、  
  原則としてこのテンプレートリポジトリをベースにフォーク／複製して利用してください。
- 憲法（constitution）や CLAUDE.md に共通の思想が入っているため、  
  AI・人間ともに「同じ作法」で開発できるようになります。

---

## ライセンス（という名の注意書き）

このテンプレートは、組織内での利用を前提としています。  
勝手に使うなよ！！！ …と言いたいところですが、  
中身の思想自体はどこで使っても困らないように設計してあります。

使うならせめて、テストを削らず、仕様を大事にしてください。
