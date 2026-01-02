# NICK-Q 🐾🐱

ニックの天才的発想によって生まれた網目状の相互参照によって全体整合性を担保する最強SSDフレームワークです。

**NICK** は、仕様を中心に開発を統治するための思想を表す略称です。

---

### N – Norm
- 開発における規範・ルール・守るべき前提を定義する
- 仕様駆動 / GitHub 駆動 / 明確な役割分離を基盤とする
### I – Integrated
- 仕様・実装・テスト・運用を分断しない
- すべてを一つの連続した流れとして統合する
### C – Contract
- 仕様を「約束（Contract）」として扱う
- 人間・AI・コードが共有する共通言語とする
### K – Kernel
- 絶対に壊してはいけない中核
- 仕様憲法・開発ルール・構造原則を厳守する
### Q - **Q** は、NICK-Q の動作原理と構造を表す多重概念です。
- Question
  - 人間の未整理なアイデアを起点とする
  - AI が問い（QA）を投げ、仕様を段階的に具体化・確定していく
- Quality
  - 仕様の曖昧さ・矛盾・抜け漏れを構造で排除する
  - 開発品質を継続的に担保する
-  Quadrant
    - 各要素を点ではなく **マトリックス構造** として管理する
    - 一部の変更が全体の整合性を壊さない構造を作る
- Queue
  - すべての作業は管理されたキューとして流れる
  - input→Question→spec→plan→task→implement→test の一方向フローを前提とする
- Quontier
  - NICK-Q の起点となる文脈
  - NICK-Q があれば、未知の道への挑戦も怖くない

---

## Overview

NICK-Q は、Claude Code のスキルとして動作する Spec-Driven Development (SSD) フレームワークです。
人間が自然言語で依頼し、Claude が適切なワークフローを実行します。

```
人間: 「新しいプロジェクトを始めたい」
  ↓
Claude: project-setup ワークフローを実行
  ↓
Vision Spec → Domain/Screen Spec → 実装
```

---

## Features

- **3 層 Spec 構造** - Overview（Vision/Domain/Screen）→ Feature Spec → Test Scenario
- **20+ ワークフロー** - 一貫した開発フロー
- **Hybrid Discovery Model** - Pre-Input + QA + AskUserQuestion による要件発見
- **Multi-Review** - 3 観点並列レビュー（構造/内容/完全性）
- **SPEC GATE** - 曖昧点が残った状態での実装を禁止
- **Impact Guard** - スコープ判定による適切なルーティング
- **状態管理** - プロジェクトとブランチの状態追跡

---

## Documentation

| Document | Description |
|----------|-------------|
| [Getting Started](docs/Getting-Started.md) | セットアップガイド（MCP、Chrome 拡張） |
| [Development Flow](docs/Development-Flow.md) | 理想的な開発フロー |
| [Workflows Reference](docs/Workflows-Reference.md) | 全ワークフロー詳細 |

---

## Quick Start

### 1. セットアップ

詳細は [Getting Started](docs/Getting-Started.md) を参照。

```bash
# 依存関係インストール
npm install

# GitHub CLI 認証
gh auth login

# 状態初期化
node .claude/skills/nick-q/scripts/state.cjs init
```

### 2. 使い方

Claude Code に自然言語で依頼するだけです：

| やりたいこと | Claude への依頼例 |
|-------------|------------------|
| 新規プロジェクト開始 | 「新しいプロジェクトを始めたい」|
| 機能追加 | 「〇〇機能を追加したい」 |
| バグ修正 | 「このバグを修正して」 |
| 実装計画 | 「実装計画を作成して」 |
| PR 作成 | 「PR を作成して」 |

### 3. Quick Input（事前入力）

より精度の高い Spec を生成するために、事前に入力ファイルを記入できます：

```bash
# テンプレートを作業用ディレクトリにコピー
node .claude/skills/nick-q/scripts/reset-input.cjs vision

# .specify/input/project-setup-input.md を編集
# その後 Claude に「プロジェクトを始めたい」と依頼
```

---

## Spec Structure

```
┌─────────────────────────────────────────┐
│     Overview Specs (WHAT)               │
├─────────────────────────────────────────┤
│ S-VISION-001  │ Project vision, goals   │
│ S-DOMAIN-001  │ Masters, APIs, Rules    │
│ S-SCREEN-001  │ Screen definitions      │
└─────────────────────────────────────────┘
        ↓ Referenced by
┌─────────────────────────────────────────┐
│    Feature Specs (HOW)                  │
├─────────────────────────────────────────┤
│ S-{AREA}-{NNN}  │ Feature requirements  │
│ F-{AREA}-{NNN}  │ Bug fix specs         │
└─────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────┐
│    Test Scenario Specs                  │
├─────────────────────────────────────────┤
│ TS-{AREA}-{NNN} │ Test cases            │
└─────────────────────────────────────────┘
```

---

## Cat Status Legend 🐱

| 絵文字 | 状態 | 意味 |
|--------|------|------|
| 🐱 | QA | 質問中・情報収集中 |
| 😼 | Review | 厳しくチェック中 |
| 🙀 | GATE/曖昧 | 関門・要確認 |
| 😿 | DEFERRED | 後回し（リスクあり） |
| 😸 | PASSED | 成功・通過 |
| 😻 | CHECKPOINT | 人間の愛が必要 |
| 🐈 | Implement | 忙しく実装中 |
| 😽 | PR | レビューお願い |
| 😾 | BLOCKED | 通過できない |

---

## Core Flow

```
Entry (add/fix/change/issue/quick/setup)
    ↓
入力検証（必須項目確認）
    ↓
ワイヤーフレーム処理（画像/ファイルあれば）
    ↓
🐱 QA ドキュメント生成（必須）
    ↓
🐱 QA 回答分析 + AskUserQuestion（残り不明点を対話解消）
    ↓
Spec 作成（QA 結果を反映）
    ↓
😼 Multi-Review（3観点並列） → AI修正
    ↓
Lint
    ↓
🙀 [NEEDS CLARIFICATION] あり? → YES: Clarify → Multi-Review へ戻る
    ↓ NO
🙀 ★ SPEC GATE ★
    │
    ├─ 😿 [DEFERRED] = 0 → 😸 PASSED → 😻 [HUMAN_CHECKPOINT]
    │
    └─ 😿 [DEFERRED] ≥ 1 → 😼 PASSED_WITH_DEFERRED → 😻 [HUMAN_CHECKPOINT]（リスク確認）
    ↓
Plan → 😻 [HUMAN_CHECKPOINT]
    ↓
🐈 Tasks → Implement → E2E → 😽 PR
```

---

## Typical Workflows

### 新規プロジェクト

```
project-setup → Vision Spec → Domain/Screen Spec → Foundation Issue → 実装
```

### 機能追加

```
「〇〇機能を追加」→ Feature Spec → Plan → Tasks → Implement → PR
```

### バグ修正

```
「このバグを修正」→ [Impact Guard] → Fix Spec or 直接実装 → PR
```

---

## Directory Structure

```
.claude/
├── skills/
│   └── nick-q/
│       ├── SKILL.md              # スキル定義・エントリーポイント
│       ├── constitution/         # Engineering Constitution
│       │   ├── core.md           # コアルール
│       │   ├── quality-gates.md  # 品質ゲート定義
│       │   ├── spec-creation.md  # Spec 作成プロセス
│       │   ├── git-workflow.md   # Git ルール
│       │   └── terminology.md    # 用語定義
│       ├── workflows/            # ワークフロー定義
│       │   ├── feature.md        # 機能追加
│       │   ├── fix.md            # バグ修正
│       │   ├── project-setup.md  # プロジェクト初期化
│       │   ├── plan.md           # 実装計画
│       │   ├── implement.md      # 実装
│       │   └── shared/           # 共通コンポーネント
│       ├── templates/            # Spec テンプレート
│       │   ├── inputs/           # Quick Input テンプレート
│       │   └── qa/               # QA テンプレート
│       ├── guides/               # ガイドドキュメント
│       └── scripts/              # Node.js ユーティリティ
├── agents/                       # Agent 定義
└── settings.json                 # Claude Code 設定

.specify/
├── input/                        # Quick Input 作業用ファイル
├── specs/                        # 生成された Spec
├── state/                        # プロジェクト状態
├── matrix/                       # Cross-Reference Matrix
└── memory/                       # 永続化情報
```

---

## Available Workflows

Claude が内部で使用するワークフロー一覧です。
人間は自然言語で依頼するだけで、Claude が適切なワークフローを選択します。

### プロジェクト初期化

| Workflow | Description |
|----------|-------------|
| project-setup | Vision + Domain + Screen Spec 作成 |

### 開発エントリーポイント

| Workflow | Description |
|----------|-------------|
| feature | 新機能追加（Feature Spec 作成） |
| fix | バグ修正（Fix Spec 作成） |
| change | Spec 変更（Vision/Domain/Screen） |

### 開発フロー

| Workflow | Description |
|----------|-------------|
| plan | 実装計画作成 |
| tasks | タスク分割 |
| implement | 実装実行 |
| pr | PR 作成 |

### 品質管理

| Workflow | Description |
|----------|-------------|
| review | Multi-Review（3観点並列レビュー） |
| clarify | 曖昧点解消（対話的） |
| lint | Spec 整合性チェック |
| analyze | 実装 vs Spec 分析 |
| checklist | 品質チェックリスト生成 |
| feedback | Spec へのフィードバック記録 |

### テスト

| Workflow | Description |
|----------|-------------|
| test-scenario | Test Scenario Spec 作成 |
| e2e | E2E テスト実行（Chrome 拡張連携） |

---

## Core Principles

1. **Spec-First** - すべての変更は仕様から始まる
2. **Multi-Review 必須** - Spec 作成後は必ず 3 観点レビュー
3. **SPEC GATE** - 曖昧点がある状態で実装に進むことは禁止
4. **HUMAN_CHECKPOINT** - 重要な判断は人間が確認
5. **推測禁止** - 不明点は Clarify で解消

詳細は [Engineering Constitution](.claude/skills/nick-q/constitution/core.md) を参照。

---

## Scripts

```bash
# 状態管理
node .claude/skills/nick-q/scripts/state.cjs query --all
node .claude/skills/nick-q/scripts/state.cjs init

# Quick Input
node .claude/skills/nick-q/scripts/reset-input.cjs vision|add|fix
node .claude/skills/nick-q/scripts/preserve-input.cjs <type>

# Lint・検証
node .claude/skills/nick-q/scripts/spec-lint.cjs
node .claude/skills/nick-q/scripts/validate-matrix.cjs
node .claude/skills/nick-q/scripts/spec-metrics.cjs

# Spec・Matrix 生成
node .claude/skills/nick-q/scripts/scaffold-spec.cjs --kind <type> --id <id> --title <title>
node .claude/skills/nick-q/scripts/generate-matrix-view.cjs

# Git・PR
node .claude/skills/nick-q/scripts/branch.cjs --type <type> --slug <slug> --issue <num>
node .claude/skills/nick-q/scripts/pr.cjs

# テンプレート更新
node .claude/skills/nick-q/scripts/update.cjs --check  # 更新確認
node .claude/skills/nick-q/scripts/update.cjs          # 更新実行
```

---

## Template Update

このプロジェクトが ssd-template から作成された場合、以下のコマンドでテンプレートを更新できます。

```bash
# 更新があるか確認
node .claude/skills/nick-q/scripts/update.cjs --check

# 更新を実行
node .claude/skills/nick-q/scripts/update.cjs
```

### 更新対象

| ファイル/ディレクトリ | 説明 |
|---------------------|------|
| `.claude/skills/nick-q/` | フレームワーク本体 |
| `.claude/agents/reviewer.md` | Reviewer Agent |
| `.claude/agents/developer.md` | Developer Agent |
| `.github/workflows/` | CI/CD |
| `docs/` | ドキュメント |
| `CLAUDE.md` | テンプレートセクションのみ |

### 保護対象（更新されない）

| ファイル/ディレクトリ | 説明 |
|---------------------|------|
| `.specify/specs/` | プロジェクトの仕様書 |
| `.specify/input/` | ユーザー入力 |
| `.specify/state/` | プロジェクト状態 |
| `CLAUDE.md` | Project-Specific セクション |
| プロジェクト独自のスキル/Agent | `.claude/skills/` 内の他フォルダ |

---

## Reference

| Document | Description |
|----------|-------------|
| [SKILL.md](.claude/skills/nick-q/SKILL.md) | スキル定義・ルーティング |
| [constitution/](.claude/skills/nick-q/constitution/) | Engineering Constitution（core.md, quality-gates.md 等） |
| [id-naming.md](.claude/skills/nick-q/guides/id-naming.md) | ID 命名規則 |
| [error-recovery.md](.claude/skills/nick-q/guides/error-recovery.md) | エラー回復ガイド |
| [parallel-development.md](.claude/skills/nick-q/guides/parallel-development.md) | 並行開発ガイド |
| [scripts-errors.md](.claude/skills/nick-q/guides/scripts-errors.md) | スクリプトエラーガイド |

---

## License

MIT
