# db

DBの接続・スキーマ・シードを配置するディレクトリ。

## ファイル構成

| ファイル名 | 概要 |
|---|---|
| `index.ts` | DB接続。`DATABASE_URL` 環境変数のパスに SQLite を作成する |
| `schema.ts` | テーブル定義 |
| `seed.ts` | 開発用初期データ投入スクリプト |

## テーブル定義

### `authors`

| カラム | 型 | 制約 |
|---|---|---|
| `id` | integer | PK, AUTO INCREMENT |
| `name` | text | NOT NULL |
| `email` | text | nullable |

### `books`

| カラム | 型 | 制約 |
|---|---|---|
| `id` | integer | PK, AUTO INCREMENT |
| `title` | text | NOT NULL |
| `authorId` | integer | NOT NULL, FK → `authors.id` |
| `price` | integer | NOT NULL |

### `users`

| カラム | 型 | 制約 |
|---|---|---|
| `id` | integer | PK, AUTO INCREMENT |
| `name` | text | NOT NULL |
| `email` | text | NOT NULL, UNIQUE |
| `password` | text | NOT NULL（scrypt ハッシュ） |
| `isAdmin` | integer(boolean) | NOT NULL, DEFAULT false |

### `refresh_tokens`

| カラム | 型 | 制約 |
|---|---|---|
| `id` | integer | PK, AUTO INCREMENT |
| `userId` | integer | NOT NULL, FK → `users.id` ON DELETE CASCADE |
| `token` | text | NOT NULL, UNIQUE |
| `expiresAt` | integer(timestamp) | NOT NULL |
| `createdAt` | integer(timestamp) | NOT NULL, DEFAULT 現在時刻 |

## マイグレーション・シード

```bash
npm run db:generate   # マイグレーションファイル生成
npm run db:migrate    # マイグレーション実行
npm run db:seed       # 初期データ投入
npm run db:studio     # Drizzle Studio（GUI）
```

## テスト時のDB

`DATABASE_URL=:memory:` を設定するとインメモリSQLiteで動作する。vitest.config.ts で自動設定済み。
