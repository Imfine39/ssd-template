# ワークフロー再設計案

> **実装完了:** このワークフローは採用・実装されました（2025-12-17）

## 解決した問題

### 1. Vision と Screen の分離による重複入力
- **解決策:** Vision Quick Input を統合し、Part A (ビジョン) + Part B (画面イメージ) + Part C (デザイン) を一括入力
- **結果:** Vision Spec の Screen Hints セクションに画面情報を保存

### 2. Screen → Domain の順序問題
- **解決策:** `/speckit.design` で Screen + Domain を同時作成
- **結果:** 画面要素から M-*/API-* を導出し、相互参照が可能に

### 3. Screen ↔ Domain の相互参照
- **解決策:** 同時作成により ID の相互参照を保証
- **結果:** Screen Index に M-*/API-* 列、Domain 定義に "Used by screens" を記載

---

## 採用されたワークフロー

```
Phase 1: /speckit.vision（統合 Quick Input）
    ├─ 入力: Part A (ビジョン) + Part B (画面イメージ) + Part C (デザイン)
    ├─ 出力: Vision Spec のみ
    └─ 画面情報は Vision Spec の「Screen Hints」セクションに一時保存

Phase 2: /speckit.design（Screen + Domain 同時作成）
    ├─ 入力: Vision Spec（Screen Hints を含む）
    ├─ 処理:
    │   1. 画面リストから SCR-* ID を仮割り当て
    │   2. 各画面の要素から必要な M-*/API-* を導出
    │   3. Screen Spec と Domain Spec を同時に生成
    │   4. 対応表（SCR ↔ M ↔ API）を両方に記載
    ├─ 出力: Screen Spec + Domain Spec + Feature Issues
    └─ 整合性: 同時作成なので ID の相互参照が可能

Phase 3: /speckit.clarify
    ├─ 対象: Vision / Screen / Domain いずれか
    └─ 曖昧点の解消

Phase 4: /speckit.issue または /speckit.add
    ├─ 入力: Domain Spec + Screen Spec
    ├─ 処理: Feature Spec 作成（両方を参照）
    └─ 出力: Feature Spec

Phase 5: /speckit.plan → /speckit.tasks → /speckit.implement → /speckit.pr
```

---

## Screen ↔ Domain 整合性ルール

### 1. ID 命名規則

| Spec | ID Format | Example |
|------|-----------|---------|
| Screen | SCR-XXX | SCR-001 (ログイン), SCR-002 (ダッシュボード) |
| Master | M-XXX | M-USER, M-LEAD, M-PROJECT |
| API | API-XXX-YYY | API-LEAD-LIST, API-LEAD-CREATE |

### 2. 対応表（両 Spec に記載）

**Screen Spec Section 2 (Screen Index):**
```markdown
| Screen ID | Name | Purpose | Uses M-* | Uses API-* |
|-----------|------|---------|----------|------------|
| SCR-001 | ログイン | 認証 | M-USER | API-AUTH-* |
| SCR-002 | ダッシュボード | サマリー表示 | M-LEAD, M-PROJECT | API-SUMMARY-* |
| SCR-003 | リード案件一覧 | 案件管理 | M-LEAD | API-LEAD-LIST |
```

**Domain Spec Section 3 (Master Data):**
```markdown
### M-LEAD
- **Used by screens**: SCR-002, SCR-003, SCR-004
- **Fields**: ...
```

**Domain Spec Section 4 (API Contracts):**
```markdown
### API-LEAD-LIST
- **Screen**: SCR-003 (リード案件一覧)
- **Request**: ...
- **Response**: ...
```

### 3. 導出ルール（/speckit.design での処理）

```
画面要素 → Master/API 導出

「リード案件一覧画面でリード情報を表示」
  → M-LEAD (master data)
  → API-LEAD-LIST (read API)

「リード案件詳細画面で編集可能」
  → API-LEAD-UPDATE (write API)

「リード案件詳細画面で受注へ移行」
  → API-LEAD-CONVERT (action API)
  → M-PROJECT (移行先 master)
```

### 4. 検証（/speckit.lint での追加チェック）

- [ ] 全ての SCR-* が少なくとも 1 つの M-* を参照している
- [ ] 全ての M-* が少なくとも 1 つの SCR-* から参照されている
- [ ] Screen Spec の対応表と Domain Spec の参照が一致している
- [ ] 孤立した API-* がない（どの画面からも使われない API）

---

## 完了した変更

### テンプレート
- [x] `.specify/templates/vision-input.md` - 統合 Quick Input（Part A/B/C）
- [x] `.specify/templates/vision-spec-template.md` - Screen Hints セクション追加
- [x] `.specify/templates/screen-spec-template.md` - 対応表を必須化
- [x] `.specify/templates/domain-spec-template.md` - Screen 参照を追加

### コマンド
- [x] `.claude/commands/speckit.vision.md` - 統合 Quick Input 対応
- [x] `.claude/commands/speckit.design.md` - Screen + Domain 同時作成
- [x] `/speckit.screen` は廃止（削除済み）

### スクリプト
- [x] `.specify/scripts/spec-lint.cjs` - Screen ↔ Domain 整合性チェック追加

### ドキュメント
- [x] `CLAUDE.md` - ワークフロー説明を更新
- [x] `README.md` - 4層構造に更新
- [x] `docs/` 配下のドキュメント - 整合性を更新

---

## 採用された決定

1. **Screen Spec を単独で作成する `/speckit.screen` は残すか？**
   - **採用: 案A** - `/speckit.design` に統合し、単独コマンドは廃止

2. **Vision Spec に画面情報を含めるか？**
   - **採用: 案B** - Vision Spec に「Screen Hints」セクションを追加（/speckit.design への引き継ぎ用）

3. **Domain → Screen の順番でも作れるようにするか？**
   - **採用: 同時作成** - `/speckit.design` で Screen + Domain を同時に作成し、順序問題を解消

