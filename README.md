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
    │   └── commands/                 # Claude Code スラッシュコマンド (13個)
    │       │
    │       │ # エントリーポイント (4個)
    │       ├── speckit.bootstrap.md      # 新規プロジェクト立ち上げ or 追加Feature提案
    │       ├── speckit.add.md            # 新機能追加（Issueなし→自動作成）
    │       ├── speckit.fix.md            # 新バグ修正（Issueなし→自動作成）
    │       ├── speckit.issue.md          # 既存Issue選択→開発開始
    │       │
    │       │ # 基本コマンド (5個) - 途中再開にも使用
    │       ├── speckit.spec.md           # Spec作成/更新
    │       ├── speckit.plan.md           # Plan作成（人間確認で停止）
    │       ├── speckit.tasks.md          # Tasks作成
    │       ├── speckit.implement.md      # 実装
    │       ├── speckit.pr.md             # PR作成
    │       │
    │       │ # ユーティリティ (4個)
    │       ├── speckit.analyze.md        # 実装とSpec/Overviewの整合性分析
    │       ├── speckit.feedback.md       # Specへのフィードバック
    │       ├── speckit.clarify.md        # 曖昧点確認
    │       └── speckit.lint.md           # Spec整合性チェック
    ├── .specify/
    │   ├── memory/
    │   │   └── constitution.md       # Engineering Constitution（憲法）
    │   ├── templates/                # 各種テンプレート
    │   │   ├── spec-template.md
    │   │   ├── plan-template.md
    │   │   ├── tasks-template.md
    │   │   ├── checklist-template.md
    │   │   └── agent-file-template.md
    │   ├── guides/                   # ガイドドキュメント
    │   │   ├── error-recovery.md         # エラーリカバリー手順
    │   │   └── parallel-development.md   # 並行開発ガイド
    │   └── scripts/                  # ユーティリティスクリプト
    │       ├── branch.js                 # ブランチ作成/採番
    │       ├── scaffold-spec.js          # Overview/Feature spec scaffold + Feature index自動追記
    │       ├── spec-lint.js              # Overview/Feature 整合性lint（品質チェック含む）
    │       ├── spec-metrics.js           # プロジェクト健全性メトリクス
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

| MCP       | 用途                                   | 必須度   |コマンド|
|----------|----------------------------------------|----------|---------
| serena   | プロジェクト探索・ファイル編集         | 必須     |claude mcp add serena -- uvx --from git+https://github.com/oraios/serena serena start-mcp-server --context claude-code --project "$(pwd)"|
| context7 | ライブラリドキュメント検索             | 必須     |claude mcp add context7 -s project -- npx -y @upstash/context7-mcp|
| playwright | E2E テスト自動化                     | 推奨     |claude mcp add playwright -s project -- npx -y @playwright/mcp@latest|

---

## 3つのユースケース

| ユースケース | 開始コマンド | 説明 |
|-------------|-------------|------|
| **1. オンボーディング** | `/speckit.bootstrap` | 新規プロジェクト立ち上げ。Overview作成、初期Feature提案・Issue一括作成 |
| **2. 機能追加** | `/speckit.add "説明"` | **Issueがない** 新機能を追加。AIがIssue/Branch/Spec自動作成 |
| **3. バグ修正** | `/speckit.fix "説明"` | **Issueがない** バグを修正。AIがIssue/Branch/Spec更新を自動作成 |

### コマンドの使い分け

| 状況 | 使うコマンド |
|-----|------------|
| **Issueが既にある**（bootstrap/手動作成） | `/speckit.issue` → 選択して直接開発開始 |
| **Issueがない** 新機能 | `/speckit.add "説明"` → Issue自動作成して開発開始 |
| **Issueがない** バグ | `/speckit.fix "説明"` → Issue自動作成して開発開始 |
| **複数Featureを一括提案** | `/speckit.bootstrap "説明"` → Issue一括作成 |

**ポイント**: `/speckit.issue` は既存Issueを選んで **直接** 開発を開始します（add/fixを呼び出すのではなく、自分でBranch/Spec作成を行います）。

---

## コマンド構造（2層アーキテクチャ）

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 【エントリーポイント】（ワークフロー開始用）                                │
│   /speckit.bootstrap  - 新規プロジェクト or 追加Feature提案                 │
│   /speckit.add        - 新機能（Issue自動作成）                             │
│   /speckit.fix        - バグ修正（Issue自動作成）                           │
│   /speckit.issue      - 既存Issueから開始                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│ 【基本コマンド】（単体実行可能、途中再開にも使用）                          │
│   /speckit.spec       - Spec作成/更新                                       │
│   /speckit.plan       - Plan作成（人間確認で停止）                          │
│   /speckit.tasks      - Tasks作成                                           │
│   /speckit.implement  - 実装                                                │
│   /speckit.pr         - PR作成                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│ 【ユーティリティ】（必要時に呼び出し）                                      │
│   /speckit.analyze    - 実装とSpec/Overviewの整合性分析（PR前の安心確認）   │
│   /speckit.feedback   - Specへのフィードバック記録                          │
│   /speckit.clarify    - 要件の曖昧点確認                                    │
│   /speckit.lint       - Spec整合性チェック                                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

**途中再開の例:**
```
# Planレビュー後、Tasks作成から再開
人間: /speckit.tasks

# 実装を中断後、再開
人間: /speckit.implement
```

---

## 6ステップワークフロー（人間 vs AI）

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Step 1: /speckit.add, /speckit.fix, または /speckit.issue                  │
│   AI: Issue作成 → Branch作成 → Spec作成 → Clarifyループ                    │
│   人間: 🔔 曖昧点に回答 → Specをレビュー・承認                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ Step 2: /speckit.plan                                                      │
│   AI: コード分析 → Plan作成 → 整合性チェック                               │
│   人間: 🔔 Planをレビュー・承認                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│ Step 3: /speckit.tasks                                                     │
│   AI: Tasks作成                                                            │
│   人間: 🔔 Tasksを確認                                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ Step 4: /speckit.implement                                                 │
│   AI: タスク実装 → テスト作成・実行                                        │
│   人間: 🔔 Feedback発見時に許可を出す                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ Step 5: /speckit.pr                                                        │
│   AI: 整合性確認 → 最終feedback → PR作成                                   │
│   人間: （待機）                                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│ Step 6: PRレビュー                                                         │
│   AI: レビュー指摘を修正                                                   │
│   人間: 🔔 最終承認・マージ                                                │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 人間がやること（6箇所）

| タイミング | 人間のアクション |
|-----------|-----------------|
| Step 1 中 | 曖昧点に回答（Clarifyループ） |
| Step 1 完了後 | Specの内容をレビューし「OK」と伝える |
| Step 2 完了後 | Planをレビューし「OK」と伝える |
| Step 3 完了後 | Tasksを確認し次へ進むよう指示 |
| Step 4 中 | AIがfeedback発見を報告したら、記録するか判断 |
| Step 6 | PRをレビューし、Approve & Merge |

### AIが自動でやること

- GitHub Issue 作成
- ブランチ作成・切り替え
- Spec/Plan/Tasks ドキュメント生成
- コード実装・テスト作成
- spec-lint / テスト実行
- PR作成・本文生成
- レビュー指摘への対応

---

## 0→1 立ち上げフロー（オンボーディング）

```
人間: /speckit.bootstrap 在庫管理システムを作りたい

AI: Overview Issue #1 を作成しました
    Branch spec/1-overview を作成しました
    Overview Spec を作成しました

    Feature候補:
    1. S-INVENTORY-001: 在庫一覧・検索
    2. S-RECEIVING-001: 入荷処理
    3. S-SHIPPING-001: 出荷処理
    4. S-STOCKTAKE-001: 棚卸し

    どのFeatureを採用しますか？ [全部/番号指定/なし]

人間: 全部

AI: 4つのFeature Issueを作成しました:
    #2 [feature][backlog] S-INVENTORY-001: 在庫一覧・検索
    #3 [feature][backlog] S-RECEIVING-001: 入荷処理
    #4 [feature][backlog] S-SHIPPING-001: 出荷処理
    #5 [feature][backlog] S-STOCKTAKE-001: 棚卸し

    Spec をscaffoldしました（Feature index も更新済み）

    どのFeatureから始めますか？

人間: #2

AI: Issue #2 を選択しました
    ラベルを backlog → in-progress に更新
    Branch feature/2-inventory を作成
    Spec を詳細化中...

    [Spec詳細化完了]

    Specをレビューしてください。
    問題なければ「OK」と伝えてください。

人間: OK

AI: /speckit.plan を実行します...
```

**ポイント:**
- 採用したFeatureは **一括でGitHub Issue化** される（`backlog`ラベル付き）
- プロジェクト全体のバックログがGitHub上で可視化
- `/speckit.issue` で後からbacklogのFeatureを選んで開発開始可能

※ Overview が「唯一の真実」。すべての Feature はここに定義されたマスタ/APIを参照し、Feature index表 `| Feature ID | Title | Path | Status |` に必ず登録される。

---

## Feature 追加の具体例

### 方法1: 複数Feature を一括提案・Issue化

`/speckit.bootstrap` はOverviewが既に存在する場合、追加Feature提案モードで動作します。

```
人間: /speckit.bootstrap レポート機能とエクスポート機能を追加したい

AI: Overview S-OVERVIEW-001 が見つかりました。追加Feature提案モードで実行します。

    Feature候補:
    1. S-REPORTS-001: レポート出力
    2. S-EXPORT-001: データエクスポート

    どのFeatureを採用しますか？ [全部/番号指定/なし]

人間: 全部

AI: 2つのFeature Issueを作成しました:
    #10 [feature][backlog] S-REPORTS-001: レポート出力
    #11 [feature][backlog] S-EXPORT-001: データエクスポート

    どのFeatureから始めますか？ (後で /speckit.issue でも選択可能)

人間: #10

AI: Issue #10 を選択しました
    ラベルを backlog → in-progress に更新
    Branch feature/10-reports を作成
    Spec を詳細化中...

    Specをレビューしてください。
```

### 方法2: 単一Feature を直接追加（Issueがない場合）

```
人間: /speckit.add PDFエクスポート機能

AI: Issue #45 を作成しました
    Branch feature/45-pdf-export を作成しました
    Spec を作成しました
    ...（6ステップフローへ）
```

### 方法3: 既存Issueから選択して開始（backlog等）

```
人間: /speckit.issue

AI: === Open Issues ===

    Backlog Features:
      #2 [backlog] S-INVENTORY-001: 在庫一覧・検索
      #3 [backlog] S-RECEIVING-001: 入荷処理

    Backlog Bugs:
      (なし)

    In Progress:
      #5 [in-progress] S-STOCKTAKE-001: 棚卸し

    どのIssueを選択しますか？

人間: 2

AI: Issue #2 "S-INVENTORY-001: 在庫一覧・検索" を選択しました
    種類: Feature

    ラベルを backlog → in-progress に更新しました
    Branch feature/2-inventory を作成しました
    既存のSpec scaffoldを拡張します...

    [Spec詳細化中...]

    Spec概要:
    - UC: 3個
    - FR: 5個
    - SC: 2個

    Specをレビューしてください。
    問題なければ「OK」と伝えてください。

人間: OK

AI: /speckit.plan を実行します...
```

**ポイント**: `/speckit.issue` は add/fix を呼び出さず、直接 Branch 作成・Spec 詳細化を行います。

---

## 整合性チェック（Lint）

`/speckit.lint` で Spec の整合性をチェックできます。

```bash
# コマンドラインから直接実行も可能
node .specify/scripts/spec-lint.js
```

チェック内容：
- **Spec存在確認**: Spec Type, Spec ID の存在
- **一意性**: Spec ID, UC ID の重複チェック
- **マスタ整合性**: Feature が参照する M-*, API-* が Overview に定義済みか
- **Feature Index**: Overview の Feature index 表との整合
- **Plan/Tasks整合性**: Plan/Tasks が Spec ID を参照しているか
- **品質チェック**: UC の存在、必須セクション、Deprecated の理由記載

このチェックは `/speckit.spec`, `/speckit.plan`, `/speckit.pr` で自動実行されます。

---

## 実装分析（PR前の安心確認）

`/speckit.analyze` で実装が Spec/Overview の要件を満たしているか総合分析できます。

```
人間: /speckit.analyze

AI: === 分析結果 ===

    ✅ 充足している要件:
      - UC-001: ログイン処理 → src/auth/login.ts
      - FR-001〜FR-005: 全て実装済み

    ⚠️ 要確認:
      - FR-006: パスワードリセット → テストが不足

    📊 カバレッジ:
      - UC: 2/2 (100%)
      - FR: 6/6 (100%)
      - SC: 2/3 (66.7%)
```

**使いどころ:**
- `/speckit.pr` の前に不安がある時
- 大きな Feature を実装した後
- 複数人で並行開発している時
- レビュー前の自己チェック

---

## 実装フィードバック

実装中に発見した技術的制約や新しい要件を Spec に反映するには `/speckit.feedback` を使用します。

```bash
# 技術的制約を記録
/speckit.feedback constraint: APIレート制限により100件以上のバッチ更新は不可

# 発見した要件を記録
/speckit.feedback discovery: 削除前に確認ダイアログが必要（Specに未記載）

# 設計判断を記録
/speckit.feedback decision: 並行編集には楽観的ロックを採用
```

記録された内容は Spec の「Implementation Notes」セクションと Changelog に反映されます。
重大な変更が必要な場合は Issue が作成されます。

---

## プロジェクト健全性メトリクス

`spec-metrics.js` でプロジェクトの健全性を確認できます。

```bash
# 通常出力
node .specify/scripts/spec-metrics.js

# 詳細出力
node .specify/scripts/spec-metrics.js --verbose

# JSON出力（ツール連携用）
node .specify/scripts/spec-metrics.js --json
```

出力内容：
- **Overview**: マスタ/API数、最終更新日
- **Features**: ステータス別の数、Plan/Tasks の有無
- **Coverage**: UC/FR/SC の総数
- **Health Score**: 0-100 のスコアと問題点

---

## 変更サイズ分類

変更の規模に応じてワークフローが異なります（constitution.md 参照）：

| サイズ | 例 | 必要なフロー |
|--------|-----|-------------|
| Trivial | タイポ修正、1行バグ修正 | PR のみ（Issue 推奨） |
| Small | 単一UC内のバグ修正 | Issue + Spec Changelog 更新 |
| Medium | 新規UC追加、複数ファイル変更 | Issue → Spec → Plan → Tasks |
| Large | Overview 変更、アーキテクチャ変更 | 影響分析 + 完全フロー |
| Emergency | セキュリティパッチ、本番障害対応 | 即時修正 → 48時間以内にSpec作成 |

---

## ガイドドキュメント

`.specify/guides/` に運用ガイドがあります：

- **error-recovery.md**: エラー発生時のリカバリー手順
  - Spec の誤り、Plan の技術的制約、テスト失敗、PR リジェクト時の対応
- **parallel-development.md**: 並行開発のベストプラクティス
  - Feature 間依存関係の管理、Overview 変更の調整、マージ戦略

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
