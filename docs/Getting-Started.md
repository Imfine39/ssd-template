# Getting Started

NICK-Q を使い始めるためのセットアップガイドです。

---

## Prerequisites

### 必須ツール

| ツール | 用途 | インストール |
|--------|------|-------------|
| Node.js (18+) | ランタイム | https://nodejs.org/ |
| Git | バージョン管理 | https://git-scm.com/ |
| GitHub CLI | GitHub 操作 | https://cli.github.com/ |
| Claude Code | AI アシスタント | https://claude.ai/claude-code |

### 必須 MCP サーバー

NICK-Q は以下の MCP（Model Context Protocol）サーバーを使用します。

| MCP Server | 用途 | 必要な場面 |
|------------|------|-----------|
| **Context7** | ライブラリドキュメント参照 | 実装時の最新ドキュメント取得 |
| **Serena** | LSP 連携 | コード解析、定義ジャンプ |

### Chrome 拡張（E2E テスト用）

E2E テストを実行するには、Chrome 拡張「Claude in Chrome」が必要です。

---

## Installation

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd nick-q
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. GitHub CLI 認証

```bash
gh auth login
```

### 4. 状態の初期化

```bash
node .claude/skills/nick-q/scripts/state.cjs init
```

---

## MCP Server Setup

### Context7

Context7 は、ライブラリの最新ドキュメントを取得するための MCP サーバーです。

**設定方法:**
/plugin のmarketplaceからcontext7を選択

**用途:**
- 実装時にライブラリの最新 API を参照
- フレームワークのベストプラクティスを確認

### Serena（LSP 連携）

Serena は LSP（Language Server Protocol）を通じてコード解析を行う MCP サーバーです。

**設定方法:**

1. uvをinstall
  - https://docs.astral.sh/uv/getting-started/installation/
2.コマンドを実行
  - `claude mcp add serena -- uvx --from git+https://github.com/oraios/serena serena start-mcp-server --context claude-code --project "$(pwd)"`

**用途:**
- 関数・クラスの定義ジャンプ
- リファレンス検索
- シンボル検索

### Claude in Chrome（E2E テスト用）

ブラウザ操作による E2E テストに必要です。

**インストール:**

公式サイトを参照
- `https://code.claude.com/docs/en/chrome`


**用途:**
- ブラウザでの自動操作
- スクリーンショット取得
- GIF 記録
- フォーム入力・クリック操作

---

## First Project

### 1. Quick Input を準備（オプション）

より精度の高い Spec を生成するために、事前に入力ファイルを記入できます：

```bash
# テンプレートをコピー
node .claude/skills/nick-q/scripts/reset-input.cjs vision

# エディタで編集
# .specify/input/project-setup-input.md
```

### 2. Claude Code に依頼

```
Claude への依頼例:
「新しいプロジェクトを始めたい。顧客管理システムを作りたいんだけど。」
```

Claude が以下を実行します：

1. **project-setup ワークフロー開始**
2. **QA 生成** - 不足情報を確認するための質問を生成
3. **QA 分析 + 対話** - 回答を分析し、残りの曖昧点を AskUserQuestion で解消
4. **Vision Spec 作成** - プロジェクトの目的・ゴールを定義
5. **Multi-Review** - 3 観点から自動レビュー
6. **SPEC GATE** - 曖昧点が解消されていることを確認
7. **Domain/Screen Spec 作成** - データモデル・API・画面定義

### 3. 機能追加

Vision Spec 承認後：

```
「ユーザー登録機能を追加して」
```

Claude が以下を実行：

1. **feature ワークフロー開始**
2. **Impact Guard** - スコープ判定（小規模→直接実装 / 大規模→Spec 作成）
3. **Feature Spec 作成** - 詳細な機能要件を定義
4. **Multi-Review → Lint → SPEC GATE**
5. **Plan → Tasks → Implement → PR**

---

## Directory Structure

セットアップ後のディレクトリ構造：

```
your-project/
├── .claude/
│   ├── skills/
│   │   └── nick-q/               # NICK-Q フレームワーク
│   │       ├── SKILL.md          # スキル定義・エントリーポイント
│   │       ├── constitution/     # Engineering Constitution
│   │       │   ├── core.md       # コアルール
│   │       │   ├── quality-gates.md  # 品質ゲート
│   │       │   ├── spec-creation.md  # Spec 作成プロセス
│   │       │   ├── git-workflow.md   # Git ルール
│   │       │   └── terminology.md    # 用語定義
│   │       ├── workflows/        # ワークフロー定義
│   │       │   ├── feature.md
│   │       │   ├── fix.md
│   │       │   ├── project-setup.md
│   │       │   └── shared/       # 共通コンポーネント
│   │       ├── templates/        # Spec テンプレート
│   │       │   ├── inputs/       # Quick Input テンプレート
│   │       │   └── qa/           # QA テンプレート
│   │       ├── guides/           # ガイド
│   │       └── scripts/          # ユーティリティ
│   └── agents/                   # Agent 定義
├── .specify/
│   ├── input/                    # Quick Input 作業用
│   ├── specs/                    # 生成された Spec
│   ├── state/                    # プロジェクト状態
│   ├── matrix/                   # Cross-Reference Matrix
│   └── memory/                   # 永続化情報
├── .mcp.json                     # MCP 設定
├── CLAUDE.md                     # Claude 向けガイド
└── README.md                     # プロジェクト説明
```

---

## Verification

セットアップが正しく完了したか確認：

```bash
# 状態確認
node .claude/skills/nick-q/scripts/state.cjs query --all

# Lint 実行
node .claude/skills/nick-q/scripts/spec-lint.cjs
```

---

## Troubleshooting

### MCP 接続エラー

```
エラー: MCP server not responding

対処:
1. MCP サーバーがインストールされているか確認
2. .mcp.json の設定を確認
3. Claude Code を再起動
```

### Chrome 拡張接続エラー

```
エラー: tabs_context_mcp でエラー

対処:
1. Chrome が起動しているか確認
2. Claude in Chrome 拡張がインストールされているか確認
3. 拡張が有効になっているか確認
4. 拡張をリロード
```

### GitHub CLI 認証エラー

```
エラー: gh: authentication required

対処:
gh auth login
```

---

## Next Steps

- [Development Flow](Development-Flow.md) - 理想の開発フロー
- [Workflows Reference](Workflows-Reference.md) - 全ワークフロー詳細
