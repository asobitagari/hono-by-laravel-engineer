# shared

アプリケーション全体で共有するユーティリティを配置するディレクトリ。

## 責務

- ドメインや層に依存しない純粋なユーティリティ関数を提供する
- 暗号処理・トークン生成など、複数の層から利用される共通処理を担う

## 配置すべきファイル一覧

| ファイル名 | 概要 |
|---|---|
| `password.ts` | scryptによるパスワードのハッシュ化と検証 |
| `token.ts` | JWTの生成・検証（HS256）、リフレッシュトークンの生成 |

## 各ファイルの概要

### `password.ts`

Node.js `crypto.scrypt` を使ったパスワード処理。

```ts
hashPassword(password: string): Promise<string>        // 'salt:hash' 形式で返す
verifyPassword(password: string, stored: string): Promise<boolean>
```

### `token.ts`

`hono/jwt` を使ったJWT処理。アルゴリズムはHS256固定。シークレットは `JWT_SECRET` 環境変数から取得する。

```ts
generateAccessToken(userId: number): Promise<string>   // 有効期限15分
verifyAccessToken(token: string): Promise<number>      // userIdを返す。失敗時は例外
generateRefreshToken(): string                         // 64文字のランダムhex文字列
refreshTokenExpiresAt(): Date                          // 現在時刻から30日後
```

## 配置してはいけないもの

- ドメイン固有の型やロジック（→ `domain/` または `useCases/` へ）
- DBアクセス（→ `infrastructure/repositories/` へ）
- Honoの型への依存

## 新規ファイル追加時のチェックリスト

- [ ] 特定のドメインに依存していない
- [ ] 外部ライブラリへの依存は最小限に抑えている
- [ ] 純粋な関数として実装されている（副作用はDBアクセスなし）
