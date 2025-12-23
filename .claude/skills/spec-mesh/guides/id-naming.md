# ID Naming Guide

このガイドは、spec-mesh で使用するすべての ID 形式を定義します。
すべてのドキュメント、テンプレート、スクリプトはこのガイドに従います。

---

## 1. Specification IDs (S-*)

### 1.1 Vision Spec

```
S-VISION-001
```

- プロジェクトに1つのみ
- 番号は常に 001

### 1.2 Domain Spec

```
S-DOMAIN-001
```

- プロジェクトに1つのみ
- 番号は常に 001

### 1.3 Screen Spec

```
S-SCREEN-001
```

- プロジェクトに1つのみ
- 番号は常に 001

### 1.4 Feature Spec

```
S-{AREA}-{NNN}
```

**形式:**
- `AREA`: 機能領域を表す大文字の識別子（2-15文字）
- `NNN`: 3桁の連番（001, 002, ...）

**例:**
| ID | 説明 |
|----|------|
| `S-AUTH-001` | 認証機能 |
| `S-ORDERS-001` | 注文管理 |
| `S-INVENTORY-001` | 在庫管理 |
| `S-DASHBOARD-001` | ダッシュボード |
| `S-FOUNDATION-001` | 基盤機能（特殊） |

**命名規則:**
- 英大文字とハイフンのみ
- 具体的で意味のある名前
- 略語は一般的なもののみ（AUTH, API, UI など）

### 1.5 Fix Spec

```
F-{AREA}-{NNN}
```

**形式:**
- `AREA`: 機能領域を表す大文字の識別子（2-15文字）
- `NNN`: 3桁の連番（001, 002, ...）

**例:**
| ID | 説明 |
|----|------|
| `F-AUTH-001` | 認証関連のバグ修正 |
| `F-ORDERS-001` | 注文機能のバグ修正 |
| `F-UI-001` | UI関連のバグ修正 |

**命名規則:**
- Feature Spec の AREA 命名規則に準拠
- 同じ機能領域のバグは連番で管理

### 1.6 Test Scenario Spec

```
TS-{FEATURE_ID}
```

**形式:**
- `FEATURE_ID`: 対応する Feature Spec の AREA-NNN 部分

**例:**
| ID | 対応 Feature | 説明 |
|----|-------------|------|
| `TS-AUTH-001` | S-AUTH-001 | 認証機能のテストシナリオ |
| `TS-ORDERS-001` | S-ORDERS-001 | 注文機能のテストシナリオ |

---

## 2. Use Case IDs (UC-*)

```
UC-{AREA}-{NNN}
```

**形式:**
- `AREA`: Feature Spec の AREA と一致させる
- `NNN`: Feature 内での連番

**例:**
| ID | Feature | 説明 |
|----|---------|------|
| `UC-AUTH-001` | S-AUTH-001 | ログイン |
| `UC-AUTH-002` | S-AUTH-001 | ログアウト |
| `UC-AUTH-003` | S-AUTH-001 | パスワードリセット |
| `UC-ORDERS-001` | S-ORDERS-001 | 注文作成 |
| `UC-ORDERS-002` | S-ORDERS-001 | 注文キャンセル |

---

## 3. Functional Requirements IDs (FR-*)

```
FR-{AREA}-{NNN}
```

**形式:**
- `AREA`: Feature Spec の AREA と一致
- `NNN`: Feature 内での連番

**例:**
| ID | 説明 |
|----|------|
| `FR-AUTH-001` | パスワードは8文字以上 |
| `FR-AUTH-002` | ログイン試行は5回まで |
| `FR-ORDERS-001` | 注文は1000件/日まで |

---

## 4. Master Data IDs (M-*)

```
M-{NAME}
```

**形式:**
- `NAME`: エンティティ名（大文字、アンダースコア可）

**例:**
| ID | 説明 |
|----|------|
| `M-USER` | ユーザーマスタ |
| `M-CLIENT` | 顧客マスタ |
| `M-ORDER` | 注文マスタ |
| `M-PRODUCT` | 商品マスタ |
| `M-PROJECT_ORDER` | プロジェクト注文（複合名） |

**命名規則:**
- 単数形を使用（USERS ではなく USER）
- 複合名はアンダースコアで接続

---

## 5. API Contract IDs (API-*)

```
API-{RESOURCE}-{ACTION}
```

**形式:**
- `RESOURCE`: 操作対象のリソース（Master 名と対応）
- `ACTION`: 操作の種類

**標準アクション:**
| Action | HTTP Method | 説明 |
|--------|-------------|------|
| `LIST` | GET | 一覧取得 |
| `DETAIL` | GET | 詳細取得 |
| `CREATE` | POST | 新規作成 |
| `UPDATE` | PUT/PATCH | 更新 |
| `DELETE` | DELETE | 削除 |

**例:**
| ID | エンドポイント |
|----|---------------|
| `API-USER-LIST` | GET /api/v1/users |
| `API-USER-DETAIL` | GET /api/v1/users/:id |
| `API-USER-CREATE` | POST /api/v1/users |
| `API-ORDER-LIST` | GET /api/v1/orders |
| `API-ORDER-CANCEL` | POST /api/v1/orders/:id/cancel |

**カスタムアクション:**
- 標準アクションに当てはまらない場合は動詞を使用
- 例: `API-ORDER-CANCEL`, `API-USER-VERIFY`, `API-AUTH-LOGIN`

---

## 6. Business Rule IDs

### 6.1 Business Rules (BR-*)

```
BR-{NNN}
```

ドメイン全体に適用されるビジネスルール。

**例:**
| ID | 説明 |
|----|------|
| `BR-001` | 注文は承認後のみキャンセル可能 |
| `BR-002` | 管理者のみユーザーを削除可能 |

### 6.2 Validation Rules (VR-*)

```
VR-{NNN}
```

フィールドレベルの検証ルール。

**例:**
| ID | 説明 |
|----|------|
| `VR-001` | メールアドレスは有効な形式 |
| `VR-002` | 金額は0以上 |

### 6.3 Calculation Rules (CR-*)

```
CR-{NNN}
```

計算・導出ルール。

**例:**
| ID | 説明 |
|----|------|
| `CR-001` | 合計 = 単価 × 数量 |
| `CR-002` | 税込価格 = 価格 × 1.1 |

---

## 7. Screen IDs (SCR-*)

```
SCR-{NNN}
```

**形式:**
- 3桁の連番

**例:**
| ID | 画面名 |
|----|--------|
| `SCR-001` | ログイン画面 |
| `SCR-002` | ダッシュボード |
| `SCR-003` | ユーザー一覧 |
| `SCR-004` | ユーザー詳細 |

**命名規則:**
- 連番は画面追加順
- 削除された画面の番号は再利用しない

---

## 8. Component IDs (COMP-*)

```
COMP-{NNN}
```

共通 UI コンポーネント用。

**例:**
| ID | 説明 |
|----|------|
| `COMP-001` | ヘッダーナビゲーション |
| `COMP-002` | フッター |
| `COMP-003` | データテーブル |

---

## 9. Task IDs (T-*)

```
T-{NNN}
```

実装タスク用。Feature ごとにリセット。

**例:**
| ID | 説明 |
|----|------|
| `T-001` | API エンドポイント実装 |
| `T-002` | ユニットテスト作成 |

---

## 10. Test Case IDs (TC-*)

```
TC-{NNN}       (Positive test cases)
TC-N{NN}       (Negative test cases)
TC-J{NN}       (Journey/E2E test cases)
```

Test Scenario Spec 内でのテストケース識別子。

**形式:**
- `TC-{NNN}`: 正常系テストケース（3桁連番）
- `TC-N{NN}`: 異常系テストケース（2桁連番、N = Negative）
- `TC-J{NN}`: E2E/ジャーニーテストケース（2桁連番、J = Journey）

**例:**
| ID | タイプ | 説明 |
|----|--------|------|
| `TC-001` | Positive | 正常なログイン |
| `TC-002` | Positive | パスワード変更 |
| `TC-N01` | Negative | 無効なパスワードでログイン失敗 |
| `TC-N02` | Negative | 存在しないユーザーでエラー |
| `TC-J01` | Journey | ユーザー登録〜ログイン〜設定変更の一連フロー |

**命名規則:**
- 各 Test Scenario Spec 内で連番をリセット
- Positive/Negative/Journey を明確に区別

---

## 11. Checklist IDs (CHK-*)

```
CHK-{NNN}              (General)
CHK-{DOMAIN}-{NNN}     (Domain-specific)
```

要件品質チェックリスト用。

**形式:**
- `CHK-{NNN}`: 一般的なチェック項目（3桁連番）
- `CHK-{DOMAIN}-{NNN}`: ドメイン固有チェック項目

**有効なドメイン:**
| Domain | 説明 |
|--------|------|
| `UX` | UX/UI 関連 |
| `API` | API 関連 |
| `SEC` | セキュリティ関連 |
| `PERF` | パフォーマンス関連 |
| `DATA` | データ関連 |

**例:**
| ID | 説明 |
|----|------|
| `CHK-001` | 一般チェック項目 |
| `CHK-UX-001` | UX 関連チェック |
| `CHK-API-001` | API 関連チェック |
| `CHK-SEC-001` | セキュリティ関連チェック |

---

## 12. Success Criteria IDs (SC-*)

```
SC-{AREA}-{NNN}
```

Feature の成功基準。

**例:**
| ID | 説明 |
|----|------|
| `SC-AUTH-001` | ログイン成功率 99% 以上 |
| `SC-ORDERS-001` | 注文処理時間 3 秒以内 |

---

## 13. Image Reference IDs (IMG-*)

```
IMG-{NNN}
```

参考画像用。

**例:**
| ID | 説明 |
|----|------|
| `IMG-001` | ダッシュボード参考デザイン |
| `IMG-002` | ログイン画面スケッチ |

---

## クイックリファレンス

| カテゴリ | 形式 | 例 |
|----------|------|-----|
| Vision Spec | `S-VISION-001` | S-VISION-001 |
| Domain Spec | `S-DOMAIN-001` | S-DOMAIN-001 |
| Screen Spec | `S-SCREEN-001` | S-SCREEN-001 |
| Feature Spec | `S-{AREA}-{NNN}` | S-AUTH-001 |
| Fix Spec | `F-{AREA}-{NNN}` | F-AUTH-001 |
| Test Scenario | `TS-{FEATURE_ID}` | TS-AUTH-001 |
| Test Case (Positive) | `TC-{NNN}` | TC-001 |
| Test Case (Negative) | `TC-N{NN}` | TC-N01 |
| Test Case (Journey) | `TC-J{NN}` | TC-J01 |
| Use Case | `UC-{AREA}-{NNN}` | UC-AUTH-001 |
| Functional Req | `FR-{AREA}-{NNN}` | FR-AUTH-001 |
| Master Data | `M-{NAME}` | M-USER |
| API Contract | `API-{RESOURCE}-{ACTION}` | API-USER-CREATE |
| Business Rule | `BR-{NNN}` | BR-001 |
| Validation Rule | `VR-{NNN}` | VR-001 |
| Calculation Rule | `CR-{NNN}` | CR-001 |
| Screen | `SCR-{NNN}` | SCR-001 |
| Component | `COMP-{NNN}` | COMP-001 |
| Task | `T-{NNN}` | T-001 |
| Checklist (General) | `CHK-{NNN}` | CHK-001 |
| Checklist (Domain) | `CHK-{DOMAIN}-{NNN}` | CHK-UX-001 |
| Success Criteria | `SC-{AREA}-{NNN}` | SC-AUTH-001 |
| Image | `IMG-{NNN}` | IMG-001 |
