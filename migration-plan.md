# SSD-MESH コンテキスト最適化 移行計画

## 概要

現在の問題：**941行が常時コンテキストを消費**（CLAUDE.md 236 + SKILL.md 228 + constitution.md 477）

目標：
- コンテキスト負荷を **大幅削減**（品質優先、行数は目安）
- コード重複を削減（スクリプト共通化）
- 保守性の大幅向上
- **ワークフローの論理的整合性を確保**

**重要:** 行数の記載は目安であり、品質を犠牲にして行数を厳守することはしない。コンテキスト削減の目的は精度向上であり、精度を下げては本末転倒。

---

## Phase 進捗状況

| Phase | 状態 | 説明 |
|-------|------|------|
| 0 | ✅ 完了 | 準備（ブランチ作成） |
| 1 | ✅ 完了 | スクリプト共通ライブラリ作成 |
| 2 | ✅ 完了 | Constitution 分割 |
| 3 | ✅ 完了 | Skill 分割 |
| 4 | ✅ 完了 | CLAUDE.md 簡略化 |
| 5 | ✅ 完了 | スクリプト統合・移行 |
| 6 | ✅ 完了 | ワークフロー最適化（Interview追加） |
| 6.5 | ✅ 完了 | ワークフロー全体再設計 |
| 7 | ⏸️ オプション | テンプレート部分化 |
| 8 | ✅ 完了 | ドキュメント整理 |
| 9 | ✅ 完了 | クリーンアップ・テスト |

---

## Phase 6: ワークフロー最適化（現在進行中）

### 6.1 完了した作業

**コミット済み (07208f1):**
- `_interview.md` 作成（Deep Interview コンポーネント）
- `_clarify-gate.md` 作成（CLARIFY GATE コンポーネント）
- `_quality-flow.md` 作成（Quality Flow コンポーネント）
- 各 Entry ワークフローに Deep Interview ステップ追加

**未コミット（修正中）:**
- パス修正: `../spec-mesh/` → `../../spec-mesh/`
- ステップ番号修正（add.md, design.md）
- _interview.md に LIGHT/FULL モード追加（途中）

### 6.2 Phase 6 で必要な追加修正

| ファイル | 修正内容 |
|---------|---------|
| `_interview.md` | LIGHT/FULL モード実装を中止し、Phase 6.5 で再設計 |
| 4つの entry ワークフロー | パス修正のみ確定、他は Phase 6.5 で再設計 |

### 6.3 Phase 6 完了条件

1. パス修正をコミット
2. 現在の _interview.md を一旦安定版としてコミット
3. Phase 6.5 への引き継ぎ

---

## Phase 6.5: ワークフロー全体再設計（新設）

### 背景

Phase 6 の実装中に以下の根本的な問題が発覚：

1. **Issue/Branch 作成タイミングが不適切**
   - 現状: Spec 作成前に Issue/Branch を作成
   - 問題: Interview で仕様が変わる可能性がある
   - 解決: Spec 確定（CLARIFY GATE + CHECKPOINT）後に Issue/Branch 作成

2. **Interview の役割が不明確**
   - Vision と Design/Feature で求められる深さが異なる
   - Vision: 方向性確認 + 機能洗い出し
   - Design/Feature/Fix: すべてを完璧に詰める

3. **Tasks ワークフローの位置付けが不明確**
   - Plan と Implement の間に Tasks がある
   - Implement は各 Task に対して実行される

### 6.5.1 ワークフロー全体フロー（最終設計）

```
┌─────────────────────────────────────────────────────────────────┐
│                           VISION                                 │
├─────────────────────────────────────────────────────────────────┤
│ 1. Vision Spec 生成                                             │
│ 2. ★ Vision Interview ★                                         │
│    ├── Phase 1: 方向性確認（ユーザー、課題、スコープ）          │
│    ├── Phase 2: 機能洗い出し（Feature Hints）                   │
│    └── Phase 3: 優先順位・リスク確認                            │
│ 3. Multi-Review → CLARIFY GATE → [HUMAN_CHECKPOINT]             │
│                                                                  │
│ Output: Vision Spec（Feature Hints 含む、Issue 化しない）       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                           DESIGN                                 │
├─────────────────────────────────────────────────────────────────┤
│ 1. Screen Spec 作成                                             │
│ 2. Domain Spec 作成                                             │
│ 3. Matrix 作成                                                  │
│ 4. ★ Deep Interview ★（制限なし、すべて詰める）                 │
│ 5. Multi-Review → CLARIFY GATE → [HUMAN_CHECKPOINT]             │
│                                                                  │
│ ── 機能確定 ──                                                   │
│                                                                  │
│ 6. Feature Issues 一括作成                                       │
│ 7. Foundation Issue 作成                                         │
│                                                                  │
│ Output: Screen/Domain/Matrix Spec, Feature Issues               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                            ISSUE                                 │
├─────────────────────────────────────────────────────────────────┤
│ 1. Issue 読み込み                                               │
│ 2. Branch 作成                                                   │
│ 3. Feature Spec 作成                                             │
│ 4. ★ Deep Interview ★                                           │
│ 5. Multi-Review → CLARIFY GATE → [HUMAN_CHECKPOINT]             │
│                                                                  │
│ Output: Feature Spec（確定）                                     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                             PLAN                                 │
├─────────────────────────────────────────────────────────────────┤
│ 1. コードベース探索                                             │
│ 2. 実装計画作成（Work Breakdown）                               │
│ 3. [HUMAN_CHECKPOINT]                                            │
│                                                                  │
│ Output: plan.md                                                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                            TASKS                                 │
├─────────────────────────────────────────────────────────────────┤
│ 1. Work Breakdown を atomic tasks に分割                        │
│ 2. tasks.md 作成                                                │
│ 3. TodoWrite に全タスク登録                                      │
│ 4. [HUMAN_CHECKPOINT]                                            │
│                                                                  │
│ Output: tasks.md                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                          IMPLEMENT                               │
├─────────────────────────────────────────────────────────────────┤
│ For each task:                                                   │
│   1. タスクを in_progress に                                    │
│   2. テスト作成（fail-first）                                   │
│   3. 実装                                                       │
│   4. テスト実行                                                 │
│   5. タスクを completed に                                      │
│                                                                  │
│ 全タスク完了後: 全体テスト + Lint                               │
│                                                                  │
│ Output: 実装コード                                               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                             PR                                   │
└─────────────────────────────────────────────────────────────────┘
```

### 6.5.2 Add / Fix ワークフロー（Spec確定後にIssue作成）

```
┌─────────────────────────────────────────────────────────────────┐
│                             ADD                                  │
├─────────────────────────────────────────────────────────────────┤
│ 1. 入力収集（add-input.md または直接）                          │
│ 2. Feature Spec 作成                                             │
│ 3. ★ Deep Interview ★                                           │
│ 4. Multi-Review → CLARIFY GATE → [HUMAN_CHECKPOINT]             │
│                                                                  │
│ ── Spec 確定 ──                                                  │
│                                                                  │
│ 5. Issue 作成                                                    │
│ 6. Branch 作成                                                   │
│                                                                  │
│ Next: Plan                                                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                             FIX                                  │
├─────────────────────────────────────────────────────────────────┤
│ 1. 入力収集（fix-input.md または直接）                          │
│ 2. 原因調査                                                     │
│ 3. Fix Spec 作成                                                 │
│ 4. ★ Deep Interview ★                                           │
│ 5. Multi-Review → CLARIFY GATE                                  │
│ 6. Severity 判定 → [HUMAN_CHECKPOINT]                           │
│                                                                  │
│ ── Spec 確定 ──                                                  │
│                                                                  │
│ 7. Issue 作成                                                    │
│ 8. Branch 作成                                                   │
│                                                                  │
│ Next: Trivial → Implement / Standard → Plan                     │
└─────────────────────────────────────────────────────────────────┘
```

### 6.5.3 Interview ファイル分割

現在の `_interview.md` を以下に分割：

```
.claude/skills/spec-mesh/workflows/shared/
├── _vision-interview.md    # Vision 専用（3フェーズ構成）
├── _deep-interview.md      # Design/Issue/Add/Fix 用（完璧化）
├── _clarify-gate.md        # CLARIFY GATE（現状維持）
└── _quality-flow.md        # Quality Flow（参照先更新）
```

**_vision-interview.md の構成:**

```
Phase 1: 方向性確認（10問程度）
├── ターゲットユーザー確認
├── 解決する課題の確認
└── スコープ境界の確認

Phase 2: 機能洗い出し（10問程度）
├── Journey からの機能抽出
├── 機能リスト提案
└── ユーザー確認・調整

Phase 3: 優先順位・リスク確認（5問程度）
├── MVP vs 将来機能の判断
├── 懸念・制約の確認
└── 成功指標の確認
```

**_deep-interview.md の構成:**

```
制限なし（40問以上あり得る）

カバー領域:
├── Technical Implementation
├── UI/UX
├── Business Logic
├── Edge Cases
├── Data
├── Integration
├── Operations
├── Security
└── Concerns & Tradeoffs
```

### 6.5.4 機能粒度の定義（Constitution 追加）

`constitution/terminology.md` に追加：

```markdown
## Feature Granularity（機能粒度）

**Feature（機能）の定義:**
> 「独立したユーザー目標を達成する最小単位」

**判定基準:**
| 基準 | 説明 |
|------|------|
| 独立性 | 他の機能なしでも意味を持つか |
| 完結性 | 1つのユーザーストーリーとして成立するか |
| テスト可能 | 独立して E2E テストできるか |
| 1PR規模 | 1つの PR で実装できる規模か |

**例:**
| 候補 | 判定 | 理由 |
|------|------|------|
| ユーザー認証 | ✓ Feature | 独立した目標「ログインできる」 |
| ログイン | △ | 認証の一部（統合推奨） |
| 保存ボタン | ✗ | UI要素（機能ではない） |
| タスク管理 | ✓ Feature | 独立した目標「タスクを管理できる」 |
```

### 6.5.5 修正対象ワークフロー

| ワークフロー | 修正内容 |
|-------------|---------|
| vision.md | Vision Interview（3フェーズ）に変更 |
| design.md | Issue作成をCHECKPOINT後に移動 |
| add.md | Issue/Branch作成をSpec確定後に移動 |
| fix.md | Issue/Branch作成をSpec確定後に移動 |
| issue.md | Branch作成後にSpec作成の順序を確認 |
| plan.md | Interview不要を明記（Spec確定後） |

### 6.5.6 Interview vs Clarify の関係明確化

```
Spec 作成
    ↓
★ Interview ★
│ 目的: 未知の要件を発見・詰める
│ 形式: 探索的、深掘り、Why の連鎖
│ 終了条件: すべての領域がカバーされた
    ↓
Multi-Review
    ↓
[NEEDS CLARIFICATION] マーカーあり?
    ├── YES → ★ Clarify ★
    │         │ 目的: 既知のマーカーを解消
    │         │ 形式: 確認的、選択式、4問バッチ
    │         │ 終了条件: マーカー = 0
    │         └── Multi-Review に戻る
    │
    └── NO → CLARIFY GATE 通過
```

---

## Phase 7: テンプレート部分化（オプション）

Phase 9 完了後に再評価。

---

## Phase 8: ドキュメント整理

Phase 6.5 完了後に実施。

---

## Phase 9: クリーンアップ・テスト

### 9.1 追加クリーンアップ項目

| 対象 | 作業 |
|------|------|
| 親ワークフロー重複 | spec-mesh/workflows/ 内の旧ファイル削除 |
| 旧スクリプト | preserve-input.cjs, reset-input.cjs 等削除 |
| 旧 constitution.md | 分割済みのため削除 |

### 9.2 動作テスト

全ワークフローで以下を確認：
- Interview が適切なタイミングで実行されるか
- Issue/Branch 作成が Spec 確定後か
- CLARIFY GATE が正しく機能するか
- Tasks → Implement の流れが正しいか

---

## 実行順序（更新版）

```
Phase 0-5: ✅ 完了
    │
    ▼
Phase 6: ワークフロー最適化（パス修正のみコミット）
    │
    ▼
Phase 6.5: ワークフロー全体再設計 ←── 新設
    │  ├── _interview.md 分割
    │  ├── Issue/Branch タイミング修正
    │  ├── 機能粒度定義追加
    │  └── 全ワークフロー更新
    │
    ├──────────────────────────────┐
    ▼                              ▼
Phase 7: テンプレート部分化    Phase 8: ドキュメント整理
(オプション)
    │                              │
    ├──────────────────────────────┘
    ▼
Phase 9: クリーンアップ・テスト
```

---

## 成功基準（更新版）

### コンテキスト削減
- [ ] コンテキスト負荷 60%以上削減

### ワークフロー論理整合性
- [ ] Issue/Branch 作成が Spec 確定後になっている
- [ ] Vision Interview が3フェーズ構成になっている
- [ ] Deep Interview が制限なしで完璧化を目指している
- [ ] Tasks → Implement の流れが明確

### 動作確認
- [ ] 全ワークフローが動作
- [ ] Interview → Review → CLARIFY GATE の流れが機能
- [ ] 共有リソースへの参照が機能
