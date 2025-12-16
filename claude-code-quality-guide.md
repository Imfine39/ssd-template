# Claude Code で実現する最高のコード品質

## 概要

Claude Code を活用して最高品質のコードを生成・維持するための方法論と具体的なツール群をまとめたガイドです。

---

## 1. 基盤となる設定

### 1.1 CLAUDE.md によるプロジェクト固有の指示

プロジェクトルートに `CLAUDE.md` を配置することで、Claude Code にプロジェクト固有のルールを伝達できます。

```markdown
# CLAUDE.md の例

## コーディング規約
- TypeScript strict mode 必須
- 関数は 50 行以内
- 必ず JSDoc コメントを記述

## テスト方針
- 単体テストカバレッジ 80% 以上
- E2E テストは主要フローのみ

## 禁止事項
- any 型の使用禁止
- console.log のコミット禁止
```

### 1.2 .claude/settings.local.json

ローカル設定でプロジェクト固有の動作をカスタマイズできます。

```json
{
  "permissions": {
    "allow": ["Bash(npm test:*)", "Bash(npm run lint:*)"],
    "deny": ["Bash(rm -rf:*)"]
  },
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit",
        "hooks": [{ "type": "command", "command": "npm run lint --silent" }]
      }
    ]
  }
}
```

---

## 2. コード品質を高めるツール群

### 2.1 静的解析ツール

| ツール | 用途 | Claude Code との連携 |
|--------|------|---------------------|
| **ESLint** | JavaScript/TypeScript リンター | 編集後の自動実行 |
| **Prettier** | コードフォーマッター | 保存時自動フォーマット |
| **TypeScript** | 型チェック | strict mode で型安全性確保 |
| **Biome** | 高速な Lint + Format | ESLint/Prettier の代替 |

```bash
# 推奨設定例
npm install -D eslint prettier typescript @typescript-eslint/eslint-plugin
```

### 2.2 テストツール

| ツール | 用途 | 特徴 |
|--------|------|------|
| **Vitest** | 単体テスト | 高速、ESM ネイティブ |
| **Jest** | 単体テスト | 豊富なエコシステム |
| **Playwright** | E2E テスト | クロスブラウザ対応 |
| **Testing Library** | コンポーネントテスト | ユーザー視点のテスト |

### 2.3 MCP (Model Context Protocol) サーバー

Claude Code の能力を拡張する MCP サーバー群:

| サーバー | 機能 |
|----------|------|
| **serena** | プロジェクト構造解析、シンボリック編集 |
| **context7** | ライブラリドキュメント検索 |
| **playwright** | ブラウザ自動化、スクリーンショット |
| **github** | GitHub API 連携 |
| **filesystem** | ファイルシステム操作 |

---

## 3. 効果的なプロンプト戦略

### 3.1 明確な指示の原則

```
悪い例: 「このコードを良くして」

良い例: 「この関数を以下の観点でリファクタリングしてください:
1. 単一責任の原則に従う
2. エラーハンドリングを追加
3. TypeScript の型を厳密に定義
4. テストを追加」
```

### 3.2 段階的なアプローチ

1. **計画モード** (`/plan`) で設計を確認
2. **実装** は小さな単位で
3. **レビュー** を依頼して品質確認
4. **テスト** を書いて動作確認

### 3.3 コンテキストの活用

```bash
# 関連ファイルを明示的に読み込ませる
「src/utils/validation.ts と src/types/user.ts を読んでから、
新しいバリデーション関数を追加してください」
```

---

## 4. 品質保証のワークフロー

### 4.1 Pre-commit フック

```json
// package.json
{
  "scripts": {
    "prepare": "husky install"
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

### 4.2 CI/CD パイプライン

```yaml
# .github/workflows/quality.yml
name: Code Quality
on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test -- --coverage
      - run: npm run build
```

### 4.3 Claude Code による PR レビュー

```bash
# PR のレビューを依頼
gh pr view 123 --json body,diff | claude "このPRをレビューしてください"
```

---

## 5. アーキテクチャ品質

### 5.1 依存関係の管理

| ツール | 用途 |
|--------|------|
| **madge** | 循環依存の検出 |
| **dependency-cruiser** | 依存関係ルールの強制 |
| **knip** | 未使用コード・依存の検出 |

```bash
# 循環依存チェック
npx madge --circular src/

# 未使用エクスポートの検出
npx knip
```

### 5.2 コード複雑度の監視

```bash
# 複雑度レポート
npx plato -r -d report src/
```

---

## 6. Claude Code 固有のベストプラクティス

### 6.1 TodoWrite ツールの活用

複雑なタスクは必ず Todo リストに分解:

```
1. 既存コードの分析
2. インターフェース設計
3. 実装
4. テスト作成
5. ドキュメント更新
```

### 6.2 段階的な編集

- 一度に大きな変更をしない
- 各編集後に動作確認
- エラーが出たら即座に対応

### 6.3 コンテキスト管理

- 長い会話では `/compact` でコンテキストを整理
- 関連ファイルは明示的に読み込む
- 不要な情報は含めない

---

## 7. セキュリティ品質

### 7.1 脆弱性スキャン

```bash
# 依存関係の脆弱性チェック
npm audit
npx snyk test

# シークレットの検出
npx gitleaks detect
```

### 7.2 OWASP Top 10 への対応

Claude Code は以下を自動的に考慮:
- SQL インジェクション防止
- XSS 対策
- CSRF 対策
- 認証・認可の適切な実装

---

## 8. パフォーマンス品質

### 8.1 バンドルサイズ分析

```bash
# Webpack
npx webpack-bundle-analyzer

# Vite
npx vite-bundle-visualizer
```

### 8.2 Lighthouse CI

```yaml
# lighthouserc.js
module.exports = {
  ci: {
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }]
      }
    }
  }
}
```

---

## 9. チェックリスト

### コード作成時

- [ ] TypeScript strict mode でエラーなし
- [ ] ESLint 警告なし
- [ ] 単体テストカバレッジ 80% 以上
- [ ] 関数は単一責任を持つ
- [ ] エラーハンドリングが適切
- [ ] 型定義が明確

### PR 作成時

- [ ] CI が全て通過
- [ ] セルフレビュー完了
- [ ] 不要な console.log 削除
- [ ] コミットメッセージが明確
- [ ] 関連 Issue がリンク済み

---

## 10. 推奨ツールスタック 2025

### フロントエンド

```json
{
  "framework": "Next.js 15 / Nuxt 4 / SvelteKit 2",
  "language": "TypeScript 5.x (strict)",
  "styling": "Tailwind CSS 4 / CSS Modules",
  "state": "Zustand / Jotai / Pinia",
  "testing": "Vitest + Playwright + Testing Library",
  "linting": "Biome / ESLint 9 flat config"
}
```

### バックエンド

```json
{
  "runtime": "Node.js 22 LTS / Bun 1.x",
  "framework": "Hono / Fastify / NestJS",
  "database": "PostgreSQL + Drizzle ORM / Prisma",
  "validation": "Zod / Valibot",
  "testing": "Vitest + Supertest"
}
```

---

## まとめ

Claude Code で最高のコード品質を実現するには:

1. **CLAUDE.md** でプロジェクトルールを明文化
2. **静的解析ツール** で自動チェック
3. **テスト** で動作を保証
4. **MCP サーバー** で能力を拡張
5. **CI/CD** で継続的な品質維持
6. **明確なプロンプト** で意図を伝達

これらを組み合わせることで、一貫して高品質なコードを生成・維持できます。
