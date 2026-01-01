# Vision Interview（ビジョンインタビュー）共通コンポーネント

Vision Spec 生成後、Multi-Review 前に実行する**必須**ステップ。
3フェーズ構成で、プロジェクトの方向性を確定してから機能を洗い出す。

---

## Purpose

**目的: プロジェクトの基盤となる方向性の確立**

1. **ターゲットユーザーと解決する課題を明確化**
2. **スコープ境界を確定（やること・やらないこと）**
3. **方向性確認後に機能を洗い出し（Feature Hints）**
4. **優先順位とリスクを早期に特定**
5. **成功指標を定義**

---

## Deep Interview との違い

| 観点 | Vision Interview | Deep Interview |
|------|-----------------|----------------|
| **対象 Spec** | Vision Spec のみ | Domain, Screen, Feature, Fix Spec |
| **目的** | プロジェクトの方向性確立 | 個別仕様の詳細化 |
| **フェーズ構成** | 3フェーズ（方向性→機能→優先順位） | 9領域のカバレッジ |
| **質問数の目安** | 25問程度 | 制限なし（完了まで継続） |
| **終了条件** | 方向性確定 + Feature Hints 確定 | 9領域カバー + Critical 曖昧点なし |

> **使い分け:** Vision ワークフローでは本ファイルを、それ以外では `_deep-interview.md` を使用。

---

## Core Principle

> **方向性確認 → 機能洗い出し の順序を厳守**
>
> 方向性が間違っていると、機能洗い出しが無駄になる。
> 必ず Phase 1 で方向性を確定してから Phase 2 に進む。

---

## 呼び出し元ワークフロー

| ワークフロー | 呼び出しタイミング | 必須/推奨 |
|-------------|-------------------|-----------|
| vision.md | Vision Spec 生成後、Multi-Review 前 | **必須** |

---

## 3-Phase Structure

```
Vision Spec 生成完了
    ↓
★ Vision Interview 開始 ★
    ↓
┌─────────────────────────────────────────┐
│ Phase 1: 方向性確認（10問程度）         │
│   ├── ターゲットユーザー確認            │
│   ├── 解決する課題の確認                │
│   └── スコープ境界の確認                │
│                                         │
│   ※ 方向性が確定するまで進まない       │
└─────────────────────────────────────────┘
    ↓ 方向性確定
┌─────────────────────────────────────────┐
│ Phase 2: 機能洗い出し（10問程度）       │
│   ├── Journey からの機能抽出            │
│   ├── 機能リスト提案（Feature Hints）   │
│   └── ユーザー確認・調整                │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ Phase 3: 優先順位・リスク確認（5問程度）│
│   ├── MVP vs 将来機能の判断             │
│   ├── 懸念・制約の確認                  │
│   └── 成功指標の確認                    │
└─────────────────────────────────────────┘
    ↓
Vision Spec 最終更新
    ↓
Multi-Review へ
```

---

## Phase 1: 方向性確認

### 目的

プロジェクトの根幹となる方向性を確定する。
ここが間違っていると、以降のすべてが無駄になる。

### カバーする領域

| 領域 | 質問例 |
|-----|-------|
| **ターゲットユーザー** | 誰が使うか、技術レベル、利用シーン |
| **解決する課題** | 何を解決するか、現状の問題点、Pain Point |
| **スコープ境界** | やること・やらないこと、システム境界 |
| **既存システム** | 置き換え/連携対象、移行要件 |
| **成功の定義** | 何をもって成功とするか |

### 質問例

```
AskUserQuestion:
  questions:
    - question: "このシステムの主要ターゲットユーザーは誰ですか？技術レベルや利用シーンを教えてください。"
      header: "ユーザー"
      options:
        - label: "開発者"
          description: "技術的な知識がある"
        - label: "ビジネスユーザー"
          description: "非技術者、業務担当"
        - label: "両方"
          description: "複数のユーザー層"
        - label: "説明が必要"
          description: "Other で詳細を入力"
      multiSelect: false
```

```
AskUserQuestion:
  questions:
    - question: "このプロジェクトで解決したい最も重要な課題は何ですか？現状の問題点を教えてください。"
      header: "課題"
      options:
        - label: "効率化"
          description: "既存作業の自動化・高速化"
        - label: "新機能"
          description: "今までできなかったことを実現"
        - label: "置き換え"
          description: "既存システムの刷新"
        - label: "説明が必要"
          description: "Other で詳細を入力"
      multiSelect: false
```

```
AskUserQuestion:
  questions:
    - question: "このプロジェクトのスコープ外として明確に除外したいものはありますか？"
      header: "スコープ外"
      options:
        - label: "特にない"
          description: "現時点では制限なし"
        - label: "外部連携"
          description: "特定の外部システム連携は除外"
        - label: "モバイル対応"
          description: "デスクトップのみ"
        - label: "説明が必要"
          description: "Other で詳細を入力"
      multiSelect: true
```

### Phase 1 終了条件

以下がすべて明確になったら Phase 2 へ進む：

- [ ] ターゲットユーザーが特定された
- [ ] 解決する課題が明確になった
- [ ] スコープ境界が定義された
- [ ] 成功の定義がある程度見えた

**不明確な場合は追加質問を続ける。**

---

## Phase 2: 機能洗い出し

### 目的

Phase 1 で確定した方向性に基づいて、必要な機能を洗い出す。
Vision Spec の User Journeys から Feature Hints を抽出・整理する。

### 機能粒度の定義

**Feature（機能）の定義:**
> 「独立したユーザー目標を達成する最小単位」

**判定基準:**

| 基準 | 説明 | 例 |
|-----|------|-----|
| 独立性 | 他機能なしで価値を提供 | ○ 認証、× パスワードリセット（認証に依存） |
| 完結性 | 単体で動作確認可能 | ○ ユーザー一覧、× API単体 |
| テスト可能 | E2E テストを書ける | ○ 検索機能、× バリデーション |
| 1PR 規模 | 独立してマージ可能な変更単位 | ○ フィルター機能、× 全画面実装 |

### カバーする領域

| 領域 | 質問例 |
|-----|-------|
| **Journey 確認** | Vision Spec の Journey は正確か |
| **機能抽出** | Journey から抽出した機能リストの確認 |
| **機能追加** | 記載されていない機能はないか |
| **機能統合/分割** | 粒度は適切か |

### 質問例

```
AskUserQuestion:
  questions:
    - question: "Vision Spec の User Journeys から以下の機能を抽出しました。追加・削除・修正はありますか？\n\n1. ユーザー認証\n2. ダッシュボード表示\n3. データ検索・フィルタリング\n4. レポート出力"
      header: "機能確認"
      options:
        - label: "このままでOK"
          description: "追加・修正なし"
        - label: "追加あり"
          description: "機能を追加したい"
        - label: "削除あり"
          description: "不要な機能がある"
        - label: "修正が必要"
          description: "Other で詳細を入力"
      multiSelect: true
```

```
AskUserQuestion:
  questions:
    - question: "「{機能名}」の詳細を教えてください。具体的にどのような操作を想定していますか？"
      header: "機能詳細"
      options:
        - label: "シンプル"
          description: "基本的な操作のみ"
        - label: "標準"
          description: "一般的な機能セット"
        - label: "高機能"
          description: "詳細なカスタマイズ可能"
        - label: "説明が必要"
          description: "Other で詳細を入力"
      multiSelect: false
```

### Phase 2 終了条件

以下がすべて明確になったら Phase 3 へ進む：

- [ ] 機能リスト（Feature Hints）が確定した
- [ ] 各機能の概要が明確になった
- [ ] 機能の粒度が適切（1PR 規模）

---

## Phase 3: 優先順位・リスク確認

### 目的

MVP（最小限の実用製品）の範囲を決め、リスクと成功指標を確認する。

### カバーする領域

| 領域 | 質問例 |
|-----|-------|
| **MVP 範囲** | 初期リリースに必要な最小限の機能 |
| **将来機能** | 後回しにできる機能 |
| **技術リスク** | 実現可能性に懸念がある機能 |
| **外部依存** | 外部システム・サービスへの依存 |
| **成功指標** | KPI、達成目標 |

### 質問例

```
AskUserQuestion:
  questions:
    - question: "以下の機能のうち、MVP（初期リリース）に必須なものはどれですか？"
      header: "MVP範囲"
      options:
        - label: "認証機能"
          description: "ユーザー管理の基盤"
        - label: "ダッシュボード"
          description: "メイン画面"
        - label: "検索機能"
          description: "データ検索"
        - label: "レポート出力"
          description: "データエクスポート"
      multiSelect: true
```

```
AskUserQuestion:
  questions:
    - question: "このプロジェクトで最も懸念していることは何ですか？"
      header: "懸念事項"
      options:
        - label: "技術的な実現性"
          description: "実装が難しい部分がある"
        - label: "スケジュール"
          description: "期限内に間に合うか"
        - label: "要件の不確実性"
          description: "要件が変わる可能性"
        - label: "特にない"
          description: "現時点では懸念なし"
      multiSelect: true
```

```
AskUserQuestion:
  questions:
    - question: "このプロジェクトの成功をどのように測定しますか？"
      header: "成功指標"
      options:
        - label: "ユーザー数"
          description: "利用者数の増加"
        - label: "効率化"
          description: "作業時間の削減"
        - label: "エラー削減"
          description: "問題発生頻度の低下"
        - label: "説明が必要"
          description: "Other で詳細を入力"
      multiSelect: true
```

### Phase 3 終了条件

以下がすべて明確になったらインタビュー完了：

- [ ] MVP 範囲が決まった
- [ ] 将来機能が特定された
- [ ] 懸念事項・リスクが洗い出された
- [ ] 成功指標が定義された

---

## Spec 更新ルール

各 Phase の回答後、即座に Vision Spec を更新：

| 回答内容 | 更新先 |
|---------|--------|
| ターゲットユーザー | Section 2: Target Users |
| 解決する課題 | Section 1: Overview |
| スコープ境界 | Section 3: Scope |
| Feature Hints | Section 4: User Journeys → Section 5: Feature Hints |
| MVP 範囲 | Section 5: Feature Hints（priority 付与）|
| 懸念事項 | Section 6: Open Questions / Risks |
| 成功指標 | Section 1: Overview / Success Metrics |

**まだ曖昧な点は `[NEEDS CLARIFICATION]` マーカーを付与**

---

## Output Format

インタビュー完了後の出力：

```
=== Vision Interview 完了 ===

【Phase 1: 方向性確認】
- ターゲットユーザー: {概要}
- 解決する課題: {概要}
- スコープ境界: {やること / やらないこと}

【Phase 2: 機能洗い出し】
Feature Hints ({N}件):
1. {機能1} - {概要} [MVP/将来]
2. {機能2} - {概要} [MVP/将来]
...

【Phase 3: 優先順位・リスク】
- MVP 範囲: {機能リスト}
- 将来機能: {機能リスト}
- 懸念事項: {リスト}
- 成功指標: {KPI}

【Spec 更新箇所】
- Section X: {更新内容}
- Section Y: {追加内容}

【残りの曖昧点】
- {あれば記載、なければ「なし」}

【次のステップ】
→ Multi-Review（3観点並列）を実行
   参照: _quality-flow.md
```

---

## Self-Check（呼び出し元で確認）

- [ ] Phase 1 で方向性を確定したか（順序厳守）
- [ ] Phase 2 で Feature Hints を洗い出したか
- [ ] Phase 3 で MVP 範囲とリスクを確認したか
- [ ] AskUserQuestion ツールを使用したか
- [ ] 回答を即座に Spec に反映したか
- [ ] Feature Hints の粒度が適切か（1PR 規模）

---

## 呼び出し方

vision.md（`workflows/vision.md`）から以下のように呼び出す：

```markdown
### Step N: Vision Interview（ビジョンインタビュー）

**★ このステップは必須・3フェーズ構成 ★**

> **コンポーネント参照:** [shared/_vision-interview.md](shared/_vision-interview.md)

3フェーズでインタビューを行う：
1. **Phase 1: 方向性確認** - ユーザー、課題、スコープ
2. **Phase 2: 機能洗い出し** - Feature Hints 抽出
3. **Phase 3: 優先順位・リスク** - MVP、懸念、成功指標

**方向性確認 → 機能洗い出し の順序を厳守。**

完了後: Multi-Review へ進む
```
