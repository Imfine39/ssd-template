# 公式 Speckit vs 現プロジェクト 比較分析レポート

**作成日**: 2025-12-12
**目的**: 公式speckitから取り込むべき点、および現プロジェクト固有の問題点・改善点の洗い出し

---

## 1. 全体構造の比較

### 公式 Speckit
```
AGENTS.md              # マルチエージェント対応ガイド（開発者向け）
templates/
  agent-file-template.md   # 動的生成されるエージェントファイルの雛形
  checklist-template.md    # 要件品質検証チェックリスト
  spec-template.md         # 単一のSpec テンプレート（フラット構造）
  plan-template.md         # 実装計画テンプレート
  tasks-template.md        # タスクテンプレート
  commands/
    specify.md             # Spec作成コマンド
    plan.md                # 計画作成コマンド
    tasks.md               # タスク分解コマンド
    implement.md           # 実装コマンド
    analyze.md             # 実装分析コマンド
    clarify.md             # 曖昧点解消コマンド
    constitution.md        # 憲章更新コマンド（動的）
    checklist.md           # チェックリスト生成コマンド
    taskstoissues.md       # タスク→Issue変換コマンド
```

### 現プロジェクト
```
CLAUDE.md              # 静的なワークフローガイド
.specify/
  memory/constitution.md     # 憲章（静的ドキュメント）
  templates/
    vision-spec-template.md    # 3層構造: Vision
    domain-spec-template.md    # 3層構造: Domain
    feature-spec-template.md   # 3層構造: Feature
    plan-template.md
    tasks-template.md
    checklist-template.md
    agent-file-template.md
  scripts/
    scaffold-spec.js
    branch.js
    spec-lint.js
    state.js              # 状態管理（独自）
.claude/commands/
  speckit.vision.md         # Vision作成（独自）
  speckit.design.md         # Domain設計（独自）
  speckit.spec.md
  speckit.plan.md
  speckit.tasks.md
  speckit.implement.md
  speckit.analyze.md
  speckit.clarify.md
  speckit.add.md            # 新機能追加（独自）
  speckit.fix.md            # バグ修正（独自）
  speckit.issue.md          # Issue選択開始（独自）
  speckit.change.md         # Spec変更（独自）
  speckit.pr.md             # PR作成（独自）
  speckit.lint.md           # Lintチェック（独自）
  speckit.feedback.md       # フィードバック記録（独自）
  speckit.featureproposal.md # Feature提案（独自）
```

---

## 2. 公式から再度取り込むべき点

### 2.1 ~~CRITICAL~~ NOT NEEDED: Agent File の動的生成

**公式の設計意図**:
```markdown
# agent-file-template.md より
- Auto-generated from all feature plans
- Active Technologies: [EXTRACTED FROM ALL PLAN.MD FILES]
- Recent Changes: [LAST 3 FEATURES AND WHAT THEY ADDED]
```

**分析結果: 目的が異なるため不要**

| 観点 | 公式の意図 | 現プロジェクト |
|------|-----------|----------------|
| 対象 | プロジェクト固有の技術情報 | フレームワーク自体のガイドライン |
| 更新頻度 | Feature/Plan ごと | フレームワーク改善時のみ |
| 動的生成 | 有用 | 不要 |

**現プロジェクトの CLAUDE.md の内容**:
- ワークフロー全体の説明（6ステップ）
- コマンド一覧（16個）
- Spec 3層構造の説明
- Git/PR ワークフロー
- 状態管理の説明

これは「フレームワークの使い方ガイド」であり、動的に変わる技術スタック情報ではない。

**結論**: 現在の CLAUDE.md は静的で問題なし。
技術スタック追跡が必要な場合は、別ファイル（例: `.specify/context/tech-stack.md`）で管理を検討。

---

### 2.2 CRITICAL: /speckit.checklist コマンド

**公式の価値**:
「Unit Tests for English」というコンセプトで、**要件の品質を検証する**チェックリストを生成。

**公式の特徴**:
- 実装テストではなく、**要件記述の品質テスト**
- 動的な質問生成（ユーザー入力に基づく）
- カテゴリ: Completeness, Clarity, Consistency, Measurability, Coverage
- ドメイン別チェックリスト（UX, API, Security, Performance等）

**公式の例**:
```markdown
❌ WRONG: "Verify the button clicks correctly"
✅ CORRECT: "Are visual hierarchy requirements defined for all card types?"
```

**現プロジェクトの状況**:
- checklist-template.md は存在するが、生成コマンドがない
- 要件品質検証の仕組みが欠落

**取り込み推奨**:
- [ ] `/speckit.checklist` コマンドを新規作成
- [ ] 動的質問生成ロジックを実装
- [ ] 「Unit Tests for English」コンセプトをドキュメント化

---

### 2.3 ~~CRITICAL~~ LOW: /speckit.constitution コマンド

**公式の設計**:
```markdown
# constitution.md コマンドより
- プレースホルダートークン [PROJECT_NAME] 等を動的に置換
- セマンティックバージョニング（MAJOR/MINOR/PATCH）
- 変更時の依存テンプレート自動同期
- Sync Impact Report の自動生成
```

**分析結果: 初期セットアップ用であり、成熟した constitution には不要**

**現プロジェクトの constitution.md の状況**:
- Version 1.5.0 として成熟
- 3層 Spec 構造、6ステップワークフロー、Change Size Classification など具体的なフローが固まっている
- プレースホルダーではなく具体的な内容が入っている

**結論**: 動的生成コマンドは不要。

**ただし有用な部分**:
公式の「Consistency propagation checklist」機能:
```markdown
- Read `/templates/plan-template.md` and ensure "Constitution Check" aligns
- Read `/templates/spec-template.md` for scope/requirements alignment
- Read `/templates/tasks-template.md` and ensure task categorization reflects principles
```

**取り込み推奨（軽量）**:
- [ ] `/speckit.lint` を拡張して、constitution 更新時のテンプレート整合性チェックを追加

---

### 2.4 HIGH: /speckit.taskstoissues コマンド

**公式の機能**:
```markdown
- tasks.md の各タスクを GitHub Issue に変換
- GitHub MCP server 連携
- リモートURL検証（安全対策）
```

**現プロジェクトの状況**:
- タスク→Issue の変換は手動
- Feature Issue 一括作成は `/speckit.design` に組み込まれているが、
  Tasks からの変換機能はない

**取り込み推奨**:
- [ ] `/speckit.taskstoissues` コマンドを新規作成
- [ ] 大規模プロジェクトでのタスク分散に活用

---

### 2.5 MEDIUM: Spec テンプレートのセクション構成

**公式の spec-template.md の特徴**:
1. **優先度付きユーザーシナリオ (P1/P2/P3)**
   ```markdown
   ### 2.1 User Scenarios & Tests (by Priority)
   - P1: [CORE_SCENARIO]: [ACCEPTANCE_CRITERIA]
   - P2: [SECONDARY_SCENARIO]: [ACCEPTANCE_CRITERIA]
   - P3: [NICE_TO_HAVE_SCENARIO]: [ACCEPTANCE_CRITERIA]
   ```

2. **MVP として独立テスト可能** の明示
   ```markdown
   IMPORTANT: Each spec MUST be independently testable as an MVP slice.
   ```

3. **機能要件 ID 形式**: `FR-001`, `FR-002`...

**現プロジェクトの状況**:
- 3層構造（Vision/Domain/Feature）でより詳細
- ただし「MVP として独立テスト可能」の強調が薄い
- 優先度の概念が弱い

**取り込み推奨**:
- [ ] Feature Spec テンプレートに「MVP 独立性」チェック項目を追加
- [ ] User Scenarios に優先度（P1/P2/P3）を明示的に追加

---

### 2.6 MEDIUM: Plan テンプレートの検証項目

**公式の plan-template.md の特徴**:
```markdown
### 11. Constitution Check
Map how each spec requirement (UC/FR) flows through to implementation:

| Spec ID | Task(s) | Test(s) | PR Reference | Status |
|---------|---------|---------|--------------|--------|
```

**現プロジェクトの状況**:
- Constitution Check セクションはあるが、テンプレートでの表形式マッピングが簡略化されている

**取り込み推奨**:
- [ ] plan-template.md の Constitution Check セクションを公式形式に拡充

---

### 2.7 LOW: Prerequisites スクリプト連携

**公式の特徴**:
各コマンドに以下のようなスクリプト連携がある:
```yaml
scripts:
  sh: scripts/bash/check-prerequisites.sh --json
  ps: scripts/powershell/check-prerequisites.ps1 -Json
```

**現プロジェクトの状況**:
- 一部 scripts/ に JavaScript があるが、bash/PowerShell の前提条件チェックスクリプトがない
- Windows 環境での互換性考慮が不十分

**取り込み推奨**:
- [ ] `scripts/bash/` と `scripts/powershell/` を追加
- [ ] 各コマンドに prerequisites スクリプト連携を追加

---

## 3. 現プロジェクトの優れた点（維持すべき）

### 3.1 3層 Spec 構造 (Vision / Domain / Feature)

**公式**: 単一 spec-template.md
**現プロジェクト**: 3層構造

**利点**:
- Vision で「なぜ」を定義し、Domain で「何を共有するか」を定義
- Feature が Domain を参照するだけで整合性を保てる
- 大規模プロジェクトでの一貫性向上

**維持推奨**: この3層構造は公式より優れた設計

---

### 3.2 状態管理システム (state.js)

**公式**: なし
**現プロジェクト**: `repo-state.json` + `branch-state.json`

**利点**:
- プロジェクトフェーズの追跡
- ブランチごとの作業ステップ追跡
- 中断・再開のサポート

**維持推奨**: この機能は公式にない独自の強み

---

### 3.3 M-*/API-* の Case 2/3 分岐ロジック

**公式**: なし
**現プロジェクト**: Feature Spec 作成時に自動判定

| Case | 状況 | 対応 |
|------|------|------|
| Case 1 | 既存で足りる | 参照追加 |
| Case 2 | 新規追加必要 | Domain に追加して続行 |
| Case 3 | 既存変更必要 | `/speckit.change` を実行 |

**利点**:
- Domain 変更の影響分析が組み込まれている
- 予期せぬ変更による破壊を防止

**維持推奨**: この分岐ロジックは非常に価値が高い

---

### 3.4 Clarify の1問ずつ質問形式

**公式**: 曖昧点のリストを一度に提示
**現プロジェクト**: 1問ずつ質問し、即時 Spec 更新

**利点**:
- ユーザー負担軽減
- 回答を即座に反映することで整合性維持
- 各質問に推奨オプションを提示

**維持推奨**: 公式より洗練されたアプローチ

---

### 3.5 エントリーポイントの明確化

**公式**: `/speckit.specify` のみ
**現プロジェクト**: 複数の明確なエントリーポイント

| コマンド | 用途 |
|----------|------|
| `/speckit.vision` | 新規プロジェクト開始 |
| `/speckit.design` | 技術設計フェーズ |
| `/speckit.issue` | 既存 Issue から開始 |
| `/speckit.add` | 新機能追加 |
| `/speckit.fix` | バグ修正 |

**利点**:
- ユーザーが「何から始めるか」が明確
- 各エントリーポイントに適切なワークフローが組み込まれている

**維持推奨**: 公式より使いやすい設計

---

### 3.6 /speckit.change による影響分析

**公式**: なし
**現プロジェクト**: Domain/Vision 変更時の影響分析と子Issue作成

**利点**:
- 変更の波及効果を可視化
- 親Issue + 子Issue構造で追跡可能
- 中断していた作業の再開サポート

**維持推奨**: この機能は公式にない大きな強み

---

### 3.7 /speckit.feedback による実装フィードバック

**公式**: なし（実装中の発見は未サポート）
**現プロジェクト**: 構造化されたフィードバック記録

フィードバックタイプ:
- constraint: 技術的制約
- discovery: 新規発見要件
- clarification: 曖昧点解消
- decision: 設計決定
- deviation: 仕様からの乖離

**維持推奨**: 実装中の学びをSpecに還元する仕組みとして価値が高い

---

## 4. 現プロジェクト固有の問題点・改善点

### 4.1 ~~CRITICAL~~ NOT A PROBLEM: CLAUDE.md の静的管理

**再評価結果**: 問題ではない

**理由**:
- 現在の CLAUDE.md は「フレームワークのガイドライン」であり、「プロジェクト固有の技術スタック」ではない
- 動的に変わる必要がない静的なドキュメント
- 公式の agent-file-template は異なる目的（プロジェクト固有情報の追跡）を持つ

**結論**: 現状維持で問題なし

---

### 4.2 HIGH: スクリプトの OS 互換性

**問題**:
- scripts/ 以下が JavaScript のみ
- Windows ユーザーへの配慮が不十分
- 公式の bash/PowerShell 並行サポートがない

**解決策**:
1. `scripts/bash/` と `scripts/powershell/` を追加
2. 各コマンドで `{SCRIPT}` プレースホルダーを使用
3. OS 検出による自動切り替え

---

### 4.3 HIGH: チェックリスト生成機能の欠落

**問題**:
- checklist-template.md は存在するが、生成コマンドがない
- 「要件品質検証」という重要な概念が欠落

**解決策**:
1. `/speckit.checklist` コマンドを新規作成
2. 公式の「Unit Tests for English」コンセプトを採用
3. ドメイン別チェックリスト生成をサポート

---

### 4.4 ~~MEDIUM~~ LOW: Constitution 更新時の同期確認

**再評価結果**: 動的生成は不要だが、同期チェックは有用

**現状**:
- constitution.md は成熟した静的ドキュメント
- 手動バージョニングで問題なし

**改善案（軽量）**:
- `/speckit.lint` を拡張して、constitution とテンプレートの整合性チェックを追加

---

### 4.5 MEDIUM: Handoffs の未活用

**公式の設計**:
```yaml
handoffs:
  - label: Build Specification
    agent: speckit.specify
    prompt: Implement the feature specification...
```

**現プロジェクトの状況**:
- handoffs は定義されているが、実際の遷移が手動依存
- 「次は何をすべきか」のガイダンスはあるが、自動遷移がない

**改善案**:
- handoffs の自動実行オプションを検討
- または UI/UX 上での遷移をより明確に

---

### 4.6 LOW: 優先度（P1/P2/P3）の概念不足

**問題**:
- Feature Spec で優先度の概念が弱い
- 「何が MVP で、何がオプションか」が不明確

**解決策**:
1. Feature Spec テンプレートに優先度セクション追加
2. UC/FR に P1/P2/P3 タグを付与可能に

---

### 4.7 LOW: テストとSpecの紐付け検証

**問題**:
- テストに `@spec`, `@uc` アノテーションを書く規約はあるが、
  実際の検証ツールがない

**解決策**:
1. `scripts/spec-test-coverage.js` を新規作成
2. テストファイルをパースしてアノテーションを抽出
3. Spec の UC/FR との照合レポートを生成

---

## 5. 推奨アクションサマリー（再評価後）

### 即時対応（CRITICAL）- **完了**

| # | 項目 | 概要 | 状態 |
|---|------|------|------|
| 1 | `/speckit.checklist` | 要件品質検証コマンドを新規作成（Unit Tests for English） | ✅ 実装済み |

### 短期対応（HIGH）

| # | 項目 | 概要 |
|---|------|------|
| 2 | `/speckit.taskstoissues` | タスク→Issue 変換コマンドを新規作成 |
| 3 | OS 互換スクリプト | bash/PowerShell スクリプトを追加 |

### 中期対応（MEDIUM）

| # | 項目 | 概要 |
|---|------|------|
| 4 | Plan テンプレート拡充 | Constitution Check の表形式を公式準拠に |
| 5 | Feature Spec に優先度 | P1/P2/P3 概念の追加 |
| 6 | MVP 独立性チェック | 「独立テスト可能」の明示 |

### 長期対応（LOW）

| # | 項目 | 概要 |
|---|------|------|
| 7 | Spec-Test カバレッジ | アノテーション検証ツール作成 |
| 8 | Prerequisites スクリプト | 前提条件チェックの標準化 |
| 9 | Lint 拡張 | Constitution とテンプレートの整合性チェック |

### 対応不要（再評価で除外）

| # | 項目 | 理由 |
|---|------|------|
| - | Agent File 動的生成 | CLAUDE.md はフレームワークガイドであり、技術スタック追跡用ではない |
| - | `/speckit.constitution` | 既に成熟した constitution に動的生成は不要 |

---

## 6. 結論

### 現プロジェクトの優位性

現プロジェクトは公式 Speckit から大幅に進化しており、特に以下の点で優れている:

1. **3層 Spec 構造** - 大規模プロジェクトに適した設計
2. **状態管理システム** - 作業の追跡と再開をサポート
3. **M-*/API-* 分岐ロジック** - Domain 変更の影響を自動検出
4. **1問ずつの Clarify** - ユーザー体験の向上
5. **明確なエントリーポイント** - 「何から始めるか」が明確
6. **/speckit.change** - 変更影響分析
7. **/speckit.feedback** - 実装フィードバックの構造化
8. **成熟した Constitution** - フローが固まった静的ガイドライン
9. **フレームワークガイドとしての CLAUDE.md** - 包括的なワークフロー説明

### 公式から取り込むべき機能（再評価後）

| 優先度 | 機能 | 理由 |
|--------|------|------|
| CRITICAL | `/speckit.checklist` | 「Unit Tests for English」- 要件品質検証の欠落 |
| HIGH | `/speckit.taskstoissues` | タスク分散の効率化 |
| MEDIUM | 優先度(P1/P2/P3) | MVP の明確化 |

### 対応不要と判断した機能

| 機能 | 理由 |
|------|------|
| Agent File 動的生成 | CLAUDE.md は「フレームワークガイド」であり、「技術スタック追跡」ではない。目的が異なる。 |
| `/speckit.constitution` | 既に成熟した constitution に初期セットアップ用コマンドは不要 |

### 最終評価

現プロジェクトは公式 Speckit の本質的な価値を維持しつつ、独自の改良を加えている。
「公式と違う」ことが必ずしも問題ではなく、**目的に応じた適切な設計判断** がなされている。

唯一の重要な欠落は **`/speckit.checklist`（要件品質検証）** であり、これを取り込むことで
フレームワークの完成度がさらに高まると考えられる。
