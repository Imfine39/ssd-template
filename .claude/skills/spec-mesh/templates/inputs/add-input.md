# Feature Quick Input

追加したい機能の概要を入力してください。

**入力のポイント:**
- 詳細に書けば書くほど、AI との QA のやり取りが減ります
- 最低限「機能名」と「一言で説明すると」があれば開始できます
- 空欄は AI が QA ドキュメントで確認します

<!--
  設計思想（MASTER-PLAN-v2.md Section 1.1）:
  ユーザーは「書くのが面倒」ではなく「知らないことがある」
  → Pre-Input で詳細に書ける構造を提供し、QA で補完する

  Input → Spec Mapping:

  | Input Section | Feature Spec Section | Notes |
  |---------------|----------------------|-------|
  | 機能概要.機能名 | Spec Title, 1.1 | 機能名 → タイトル |
  | 機能概要.一言で説明 | 1.1 Feature Description | What this feature does |
  | なぜ必要か.解決したい課題 | 1.1 Problem it solves | ユーザー価値 |
  | なぜ必要か.誰が使うか | 3. Actors | Feature 固有のアクター |
  | なぜ必要か.どんな価値 | 1.1, 7. Success Criteria | 価値 → 成功基準 |
  | データと処理.入力データ | 5. Functional Requirements (Input) | 入力仕様 |
  | データと処理.出力データ | 5. Functional Requirements (Output) | 出力仕様 |
  | データと処理.保存するデータ | 2. Domain Reference (M-*) | エンティティ参照 |
  | データと処理.主な処理ロジック | 5. Functional Requirements (Processing) | 処理フロー |
  | 画面イメージ | 8. Screen Dependencies | SCR-* 参照 |
  | 関連する既存機能 | 2.4 Feature Dependencies | Hard/Soft 依存関係 |
  | 制約・注意点 | 9. Feature-Specific Rules | FR-RULE-* |
  | 補足情報 | 14. Original Input | 原文保存 |
-->

---

## 機能概要

- **機能名**:
- **一言で説明すると**:

---

## なぜ必要か

- **解決したい課題**:
- **誰が使うか**:
- **どんな価値があるか**:

---

## データと処理

### 入力データ
<!-- この機能に入力されるデータ（フォーム項目、パラメータ等） -->
-

### 出力データ
<!-- この機能が出力するデータ（表示内容、レスポンス等） -->
-

### 保存するデータ
<!-- この機能が永続化するデータ（DB、ファイル等） -->
-

### 主な処理ロジック
<!-- データの変換、計算、バリデーション等の処理 -->
-

---

## 画面イメージ

- **メイン画面の要素**:
- **操作フロー**:
- **参考にしたいUI**:

---

## 関連する既存機能

- **依存する機能**:
- **影響を受ける機能**:

---

## 制約・注意点

-

---

## 補足情報 (任意)

自由に追記してください:

---

## 入力完了後

1. このファイルを保存
2. Claude Code に「この機能を追加して」と依頼
3. Claude が内容を読み取り、Feature Spec を生成します
