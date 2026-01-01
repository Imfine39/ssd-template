# Getting Started

SSD-MESH を使い始めるためのセットアップガイドです。

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

SSD-MESH は以下の MCP（Model Context Protocol）サーバーを使用します。

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
cd ssd-template
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
node .claude/skills/spec-mesh/scripts/state.cjs init
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
node .claude/skills/spec-mesh/scripts/reset-input.cjs vision

# エディタで編集
# .specify/input/vision-input.md
```

### 2. Claude Code に依頼

```
Claude への依頼例:
「新しいプロジェクトを始めたい。顧客管理システムを作りたいんだけど。」
```

Claude が以下を実行します：

1. **Vision Spec 作成** - プロジェクトの目的・ゴールを定義
2. **Multi-Review** - 3 観点から自動レビュー
3. **Clarify** - 曖昧点があれば対話で解消

### 3. Design フェーズ

Vision Spec 承認後：

```
「画面設計と Domain 設計を進めて」
```

Claude が以下を実行：

1. **Screen Spec 作成** - 画面一覧・遷移・ワイヤーフレーム
2. **Domain Spec 作成** - データモデル・API・ビジネスルール
3. **Cross-Reference Matrix** - 画面と Domain の関連付け

### 4. 実装開始

```
「Foundation の実装を始めて」
```

---

## Directory Structure

セットアップ後のディレクトリ構造：

```
your-project/
├── .claude/
│   ├── skills/
│   │   └── spec-mesh/         # SSD フレームワーク
│   │       ├── SKILL.md       # スキル定義
│   │       ├── constitution/  # Engineering Constitution
│   │       │   ├── core.md    # 最上位ルール
│   │       │   └── quality-gates.md # 品質ゲート定義
│   │       ├── workflows/     # ワークフロー定義
│   │       ├── templates/     # Spec テンプレート
│   │       ├── guides/        # ガイド
│   │       └── scripts/       # ユーティリティ
│   └── agents/                # Agent 定義
├── .specify/
│   ├── input/                 # Quick Input 作業用
│   ├── specs/                 # 生成された Spec
│   ├── state/                 # プロジェクト状態
│   └── matrix/                # Cross-Reference Matrix
├── .mcp.json                  # MCP 設定
├── CLAUDE.md                  # Claude 向けガイド
└── README.md                  # プロジェクト説明
```

---

## Verification

セットアップが正しく完了したか確認：

```bash
# 状態確認
node .claude/skills/spec-mesh/scripts/state.cjs query --all

# Lint 実行
node .claude/skills/spec-mesh/scripts/spec-lint.cjs
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
