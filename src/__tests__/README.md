# __tests__

Vitestによるテストを配置するディレクトリ。`src/` の構造に合わせてサブディレクトリを切る。

## 構成

```
__tests__/
  middlewares/   # ミドルウェアの単体テスト
  routes/        # ルートハンドラの統合テスト
  validators/    # バリデーションスキーマの単体テスト
```

## 実行

```bash
npx vitest run        # 全テスト
npx vitest            # ウォッチモード
```

## テスト環境

- DBはインメモリSQLite（`DATABASE_URL=:memory:`）
- `setup.ts` がマイグレーションを自動実行する
- 各テストは `beforeEach` / `afterEach` でDBの状態をリセットする
