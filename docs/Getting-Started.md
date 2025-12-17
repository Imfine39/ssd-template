# Getting Started

SSD-Template を使い始めるためのガイドです。

---

## Prerequisites

以下のツールが必要です：

| Tool | Purpose | Installation |
|------|---------|--------------|
| **Git** | バージョン管理 | [git-scm.com](https://git-scm.com/) |
| **Node.js** | スクリプト実行 | [nodejs.org](https://nodejs.org/) (LTS推奨) |
| **GitHub CLI** | Issue/PR 操作 | [cli.github.com](https://cli.github.com/) |
| **AI Assistant** | 開発支援 | Claude Code, Cursor, etc. |

### GitHub CLI のセットアップ

```bash
# インストール後、認証を実行
gh auth login
```

### MCP サーバー（Claude Code 推奨）

Claude Code を使用する場合、以下の MCP サーバーを推奨します：

| MCP | Purpose |
|-----|---------|
| **serena** | プロジェクト構造・ファイル操作 |
| **context7** | ライブラリ/フレームワークのドキュメント検索 | 
| **playwright** | ブラウザ自動化・E2E テスト |

```bash
# Claude Code での MCP サーバー追加
claude mcp add serena -- uvx --from git+https://github.com/oraios/serena serena start-mcp-server --context claude-code --project "$(pwd)"
claude mcp add --transport http context7 https://mcp.context7.com/mcp
claude mcp add playwright npx @playwright/mcp@latest

# インストール確認
claude mcp list
```

**注意:** serena が有効でない場合、Claude Code で `serena onboard` または `serena activate` を実行してプロジェクトを有効化してください。

---

## Installation

### Option 1: テンプレートとして使用（推奨）

```bash
# GitHub でこのリポジトリを template として使用
# または直接クローン
git clone https://github.com/your-org/ssd-template.git my-project
cd my-project

# 状態管理を初期化
node .specify/scripts/state.cjs init
```

### Option 2: 既存プロジェクトに追加

```bash
# .specify ディレクトリと .claude ディレクトリをコピー
cp -r ssd-template/.specify your-project/
cp -r ssd-template/.claude your-project/
cp ssd-template/CLAUDE.md your-project/

# 状態管理を初期化
cd your-project
node .specify/scripts/state.cjs init
```

---

## Directory Structure

インストール後のディレクトリ構造：

```
your-project/
├── .claude/
│   └── commands/           # speckit.* コマンド定義
│       ├── speckit.vision.md
│       ├── speckit.design.md
│       └── ...
├── .specify/
│   ├── guides/             # ガイドドキュメント
│   ├── input/              # Quick Input ファイル（ユーザー入力用）
│   │   ├── vision.md       # Vision 作成時の入力（統合: ビジョン + 画面 + デザイン）
│   │   ├── add.md          # 機能追加時の入力
│   │   └── fix.md          # バグ修正時の入力
│   ├── memory/
│   │   └── constitution.md # Engineering Constitution
│   ├── scripts/            # Node.js スクリプト
│   │   ├── state.js
│   │   ├── scaffold-spec.js
│   │   ├── spec-lint.js
│   │   ├── reset-input.js  # Quick Input リセット
│   │   └── ...
│   ├── specs/              # 仕様書（自動生成）
│   │   ├── vision/
│   │   ├── domain/
│   │   ├── screen/
│   │   └── <feature-id>/
│   ├── state/              # 状態ファイル（自動生成）
│   └── templates/          # Spec テンプレート
├── CLAUDE.md               # AI エージェント用ガイド
└── docs/                   # ドキュメント
```

---

## Quick Start

### 1. 新規プロジェクトの場合

```
# Option A: Quick Input を使用（推奨）
# 1. .specify/input/vision.md を編集
# 2. 以下を実行
/speckit.vision

# Option B: コマンドラインから直接
/speckit.vision 〇〇システムを作りたい
```

AI が Vision Spec を作成し、プロジェクトの目的を明確化します。
作成後、`/speckit.clarify` で曖昧点を解消します。

詳細: [[Workflow-New-Project]]

### 2. 既存プロジェクトへの機能追加

```
# Option A: Quick Input を使用（推奨）
# 1. .specify/input/add.md を編集
# 2. 以下を実行
/speckit.add

# Option B: コマンドラインから直接
/speckit.add ユーザー認証機能を追加したい
```

AI が Issue を作成し、Feature Spec の作成を開始します。
作成後、`/speckit.clarify` で曖昧点を解消します。

詳細: [[Workflow-Add-Feature]]

---

## Typical Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                    NEW PROJECT                               │
├─────────────────────────────────────────────────────────────┤
│  /speckit.vision     → Vision Spec 作成（Screen Hints 含む） │
│  /speckit.clarify    → 曖昧点を解消（4問ずつバッチ）          │
│         ↓                                                    │
│  /speckit.design     → Screen + Domain Spec 同時作成         │
│  /speckit.clarify    → 曖昧点を解消                          │
│         ↓                                                    │
│  /speckit.issue      → Foundation 実装開始                   │
│  /speckit.clarify    → 曖昧点を解消                          │
│         ↓                                                    │
│  /speckit.plan       → 実装計画作成                          │
│         ↓                                                    │
│  /speckit.tasks      → タスク分割                            │
│         ↓                                                    │
│  /speckit.implement  → 実装                                  │
│         ↓                                                    │
│  /speckit.pr         → PR 作成                               │
└─────────────────────────────────────────────────────────────┘
```

---

## First Steps

1. **Constitution を読む**
   ```
   .specify/memory/constitution.md
   ```
   プロジェクトの原則と規約を理解します。

2. **CLAUDE.md を確認**
   ```
   CLAUDE.md
   ```
   AI エージェントの行動指針を確認します。

3. **状態を初期化**
   ```bash
   node .specify/scripts/state.cjs init
   ```

4. **最初のコマンドを実行**
   ```
   /speckit.vision あなたのプロジェクト説明
   ```

---

## Verify Installation

インストールが正しいか確認：

```bash
# 状態管理スクリプトが動作するか確認
node .specify/scripts/state.cjs query --repo

# spec-lint が動作するか確認
node .specify/scripts/spec-lint.cjs

# GitHub CLI が認証されているか確認
gh auth status
```

---

## Next Steps

- [[Core-Concepts]] - フレームワークの主要概念を理解
- [[Workflow-New-Project]] - 新規プロジェクトの詳細フロー
- [[Commands-Reference]] - 全コマンドのリファレンス

---

## Troubleshooting

インストール時の問題は [[Troubleshooting]] を参照してください。
