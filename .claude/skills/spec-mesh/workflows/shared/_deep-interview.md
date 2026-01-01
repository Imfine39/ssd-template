# Deep Interview（深掘りインタビュー）共通コンポーネント

Spec 作成後、Multi-Review 前に実行する**必須**ステップ。
AskUserQuestion ツールを使用して、完璧な仕様を作成するまで徹底的にインタビューを行う。

---

## Purpose

**目的: 完璧な仕様駆動開発**

1. **表面的な要件の裏にある真のニーズを発掘**
2. **想定外のユースケースや例外パターンを特定**
3. **技術的制約や運用上の考慮事項を早期に発見**
4. **トレードオフの判断を明確化**
5. **UI/UX の細部まで詰める**
6. **懸念事項を洗い出し、解決策を決定**

---

## Vision Interview との違い

| 観点 | Vision Interview | Deep Interview |
|------|-----------------|----------------|
| **対象 Spec** | Vision Spec のみ | Domain, Screen, Feature, Fix Spec |
| **目的** | プロジェクトの方向性確立 | 個別仕様の詳細化 |
| **フェーズ構成** | 3フェーズ（方向性→機能→優先順位） | 9領域のカバレッジ |
| **質問数の目安** | 25問程度 | 制限なし（完了まで継続） |
| **終了条件** | 方向性確定 + Feature Hints 確定 | 9領域カバー + Critical 曖昧点なし |

> **使い分け:** `_deep-interview.md` は Feature/Fix Spec 作成後に使用。Vision/Domain/Screen は project-setup.md で QA 形式を使用。

---

## Core Principle

> **終了条件を満たすまで継続的にインタビューを行う。**
>
> 仕様の完全性を優先しつつ、明確な終了条件でユーザー負担を管理する。

---

## 呼び出し元ワークフロー

| ワークフロー | 呼び出しタイミング | 必須/推奨 |
|-------------|-------------------|-----------|
| feature.md | Feature Spec 作成後、Multi-Review 前 | **必須** |
| fix.md | Fix Spec 作成後、Multi-Review 前 | **必須** |

> **Note:** project-setup.md は QA 形式（`_qa-generation.md`）を使用。

---

## Interview Guidelines

### 1. 質問の原則

**DO:**
- 明らかでない（non-obvious）質問をする
- 深掘りする - 表面的な回答で満足しない
- 具体例を求める
- エッジケースを探る
- トレードオフを明確にする
- 「なぜ」を繰り返す

**DON'T:**
- 明らかな質問をする（Spec を読めばわかること）
- 浅い質問で終わらせる
- ユーザーの最初の回答をそのまま受け入れる
- 質問数を気にして早く終わらせようとする

### 2. カバーすべき領域

| 領域 | 質問例 |
|-----|-------|
| **Technical Implementation** | アーキテクチャ選択、技術スタック、パフォーマンス要件、スケーラビリティ |
| **UI/UX** | 操作フロー、レスポンシブ対応、アクセシビリティ、エラー表示、ローディング状態 |
| **Business Logic** | ビジネスルール、計算ロジック、状態遷移、権限モデル |
| **Edge Cases** | 例外パターン、エラーケース、境界値、同時操作 |
| **Data** | データモデル、バリデーション、整合性、保持期間 |
| **Integration** | 外部システム連携、API 設計、認証・認可 |
| **Operations** | デプロイ、監視、ログ、バックアップ、障害復旧 |
| **Security** | 認証、認可、監査ログ、データ保護 |
| **Concerns & Tradeoffs** | 懸念事項、リスク、トレードオフの判断 |

---

## Interview Flow

```
Spec 作成完了
    ↓
★ Deep Interview 開始 ★
    ↓
Step 1: Spec 読み込み・分析
    ↓
Step 2: 初回質問バッチ（4問）
    ↓
Step 3: 回答分析・Spec 更新
    ↓
Step 4: 追加質問バッチ
    ↓
    ↑ (完了するまで繰り返し)
    ↓
Step 5: 最終確認
    ↓
Step 6: Spec 最終更新
    ↓
Multi-Review へ
```

---

## Steps

### Step 1: Spec 読み込み・分析

```
Read tool: {spec_path}
```

Spec を読み込み、以下を分析：
- 曖昧な箇所、詳細が不足している箇所
- 明示されていない前提条件
- 決定されていないトレードオフ
- エッジケースの記載漏れ
- UI/UX の詳細不足

### Step 2: 質問バッチ実行

**AskUserQuestion ツールを使用**

1回のバッチで最大4問まで質問可能。
質問は以下の観点から選択：

#### Technical Implementation

```
AskUserQuestion:
  questions:
    - question: "{機能}の実装で、{選択肢A}と{選択肢B}のどちらを採用しますか？それぞれのトレードオフは..."
      header: "技術選択"
      options:
        - label: "{選択肢A}"
          description: "{メリット/デメリット}"
        - label: "{選択肢B}"
          description: "{メリット/デメリット}"
      multiSelect: false
```

#### UI/UX

```
AskUserQuestion:
  questions:
    - question: "{画面}で{操作}が失敗した場合、ユーザーにどのようにフィードバックしますか？"
      header: "エラーUX"
      options:
        - label: "トースト通知"
          description: "非侵入的、自動消去"
        - label: "インラインエラー"
          description: "フィールド横に表示"
        - label: "モーダルダイアログ"
          description: "確認が必要な重要エラー"
        - label: "説明が必要"
          description: "Other で詳細を入力"
      multiSelect: false
```

#### Edge Cases

```
AskUserQuestion:
  questions:
    - question: "{状況}で{操作A}と{操作B}が同時に発生した場合、どちらを優先しますか？"
      header: "競合解決"
      options:
        - label: "{操作A}優先"
          description: "{理由}"
        - label: "{操作B}優先"
          description: "{理由}"
        - label: "両方拒否"
          description: "排他制御で先着優先"
      multiSelect: false
```

#### Concerns & Tradeoffs

```
AskUserQuestion:
  questions:
    - question: "{懸念事項}について、許容できるレベルはどの程度ですか？"
      header: "リスク許容"
      options:
        - label: "厳格に対応"
          description: "コスト高だが安全"
        - label: "バランス重視"
          description: "中間的なアプローチ"
        - label: "最小限の対応"
          description: "コスト優先、リスク許容"
      multiSelect: false
```

### Step 3: 回答分析・Spec 更新

各回答後、即座に Spec を更新：

```
Edit tool: {spec_path}
  - Section X に回答内容を反映
  - 新たな要件を追加
  - トレードオフの決定を記録
```

**更新ルール:**
- 明確になった要件 → 該当セクションに追記
- 新たな例外ケース → Use Cases / User Journeys に追記
- 技術的決定 → Technical Decisions / Implementation Notes に追記
- トレードオフ → Decisions セクションに理由とともに記録
- まだ曖昧な点 → `[NEEDS CLARIFICATION]` マーカーを付与

### Step 4: 追加質問バッチ

前の回答から派生する質問、まだカバーできていない領域の質問を続行。

---

## Completion Criteria（終了条件）

**すべての条件を満たすまでインタビューを継続する。**

### 1. 領域カバレッジ

9領域すべてについて最低1問以上質問したこと（該当しない領域は理由を記録してスキップ可）:

- [ ] Technical Implementation
- [ ] UI/UX
- [ ] Business Logic
- [ ] Edge Cases
- [ ] Data
- [ ] Integration
- [ ] Operations
- [ ] Security
- [ ] Concerns & Tradeoffs

### 2. Critical 曖昧点なし

実装をブロックする曖昧点がないこと。
- `[NEEDS CLARIFICATION]` が残っている場合 → 継続または `[DEFERRED]` に変換
- `[DEFERRED]` は許容（リスク記録後に先へ進める）

### 3. 終了判断

以下のいずれかを満たすこと：
- ユーザーが「十分です」と明示
- AI が「追加質問なし」と判断（根拠を提示）
- 連続2バッチで新しい発見がなかった

---

## Interview Log Template

**インタビュー中、以下のログを維持する：**

```markdown
## Deep Interview Log

| # | カテゴリ | 質問 | 回答要約 | Spec 更新 |
|---|---------|------|---------|----------|
| 1 | Technical | アーキテクチャはどうしますか？ | モノリス | §3.1 追記 |
| 2 | Edge Cases | API失敗時の挙動は？ | リトライ3回 | §5.2 追記 |
| ... | ... | ... | ... | ... |

### Coverage Summary

| カテゴリ | 質問数 | 状態 |
|---------|-------|------|
| Technical Implementation | 4 | ✅ |
| UI/UX | 3 | ✅ |
| Business Logic | 2 | ✅ |
| Edge Cases | 5 | ✅ |
| Data | 2 | ✅ |
| Integration | 1 | ✅ |
| Operations | 1 | ✅ |
| Security | 1 | ✅ |
| Concerns & Tradeoffs | 2 | ✅ |

**Total: 21 questions ✅ COMPLETE**
```

> **Note:** このログは Spec の Implementation Notes セクションに残すか、セッション終了時に削除してもよい。

---

**ユーザーへの進捗表示（各バッチ後）:**

```
=== Interview 進捗 ===
完了領域: 6/9
質問数: 18問
残り領域: Operations, Security, Concerns

続けますか？ [続行 / 十分です]
```

> **Note:** 「十分です」を選択した場合でも、Critical 曖昧点が残っている場合は
> `[NEEDS CLARIFICATION]` または `[DEFERRED]` マーカーを付与して先に進む。

### Step 5: 最終確認

```
=== Deep Interview 最終確認 ===

以下の内容で Spec を確定します：

【主要な決定事項】
1. {決定1}: {内容}
2. {決定2}: {内容}
...

【トレードオフ判断】
1. {トレードオフ1}: {選択と理由}
2. {トレードオフ2}: {選択と理由}

【エッジケース対応】
1. {ケース1}: {対応方針}
2. {ケース2}: {対応方針}

問題ありませんか？追加で確認したいことはありますか？
```

### Step 6: Spec 最終更新

すべての回答を反映した最終版の Spec を保存。

---

## 質問の深掘りテクニック

### 1. Why Chain（なぜの連鎖）

```
Q1: なぜ{選択A}を選びましたか？
A1: {理由}
Q2: その{理由}は、{別の観点}から見ても成り立ちますか？
A2: {回答}
Q3: もし{前提}が変わったら、この選択は変わりますか？
```

### 2. What-If Scenarios

```
- もし{データ量}が10倍になったら？
- もし{ユーザー数}が急増したら？
- もし{外部API}が落ちたら？
- もし{要件}が後から変わったら？
```

### 3. Edge Case Exploration

```
- {値}が空/null/undefined の場合は？
- {操作}が途中で中断された場合は？
- {ユーザー}が権限のない操作をしようとしたら？
- {時間}が非常に長い/短い場合は？
```

### 4. User Perspective

```
- 初めて使うユーザーはこの操作を理解できますか？
- エラーメッセージはユーザーにとって actionable ですか？
- この画面の目的はユーザーに明確ですか？
```

---

## Spec Type 別の重点領域

| Spec Type | 重点領域 | 深掘りポイント |
|-----------|---------|--------------|
| Domain | Data, Integration | データモデル、API 設計、整合性ルール、権限モデル |
| Screen | UI/UX, Edge Cases | 操作フロー、エラー表示、レスポンシブ、アクセシビリティ |
| Feature | All | ユーザーストーリー、受け入れ条件、技術実装、テスト観点 |
| Fix | Technical, Testing | 根本原因、再発防止、副作用、回帰テスト |

> **Note:** project-setup.md は `_qa-generation.md` を使用。

---

## Output Format

インタビュー完了後の出力：

```
=== Deep Interview 完了 ===

質問数: {N} 問
セッション数: {M} バッチ

【カバーした領域】
- [x] Technical Implementation
- [x] UI/UX
- [x] Business Logic
- [x] Edge Cases
- [x] Data
- [x] Integration
- [x] Operations
- [x] Security
- [x] Concerns & Tradeoffs

【主要な決定事項】
1. {決定1}
2. {決定2}
...

【Spec 更新箇所】
- Section X: {更新内容}
- Section Y: {追加内容}
...

【残りの曖昧点】
- {あれば記載、なければ「なし」}

Next: Multi-Review を実行
```

---

## Self-Check（呼び出し元で確認）

- [ ] Spec を読み込み、曖昧な箇所を特定したか
- [ ] すべての重点領域（9領域）をカバーしたか
- [ ] 明らかでない（non-obvious）質問をしたか
- [ ] 回答を深掘りしたか
- [ ] AskUserQuestion ツールを使用したか
- [ ] 回答を即座に Spec に反映したか
- [ ] トレードオフの決定を記録したか
- [ ] 最終確認を行ったか
- [ ] **終了条件（領域カバレッジ + Critical曖昧点なし + 終了判断）を満たしたか**
- [ ] ユーザーへの進捗表示を行ったか

---

## 呼び出し方

各ワークフローから以下のように呼び出す：

```markdown
### Step N: Deep Interview（深掘りインタビュー）

**★ このステップは必須 ★**

> **コンポーネント参照:** [shared/_deep-interview.md](shared/_deep-interview.md)

Spec について徹底的にインタビューを行う：
- Technical implementation
- UI/UX
- Concerns
- Tradeoffs
- Edge cases
- その他すべての曖昧な点

**終了条件を満たすまで継続:**
1. 9領域すべてカバー
2. Critical 曖昧点なし
3. 終了判断（ユーザー明示 or AI判断 or 2バッチ連続で新発見なし）

完了後: Multi-Review へ進む
```
