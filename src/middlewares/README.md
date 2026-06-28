# middlewares

Honoのミドルウェアを配置するディレクトリ。

## 責務

- リクエストの前処理・横断的な関心事を担う
- 認証・認可・ロギングなど、複数のルートで共通して使う処理を切り出す
- `createMiddleware` を使って型安全に実装する

## 配置すべきファイル一覧

| ファイル名 | 概要 |
|---|---|
| `authMiddleware.ts` | Authorizationヘッダーを検証し、JWTからuserIdをcontextにセットする |
| `adminMiddleware.ts` | contextのuserIdをDBで照合し、isAdminでなければ403を返す。`authMiddleware`の後に使う |

## 使い方

ミドルウェアはルートハンドラの引数として直接渡す。

```ts
// 認証のみ
app.get('/', authMiddleware, handler)

// 認証 + 管理者チェック
app.post('/', authMiddleware, adminMiddleware, handler)
```

## contextの型

`authMiddleware`はcontextに`userId: number`をセットする。利用するルートには型を宣言する。

```ts
import type { AuthVariables } from '../middlewares/authMiddleware.js'

const app = new Hono<{ Variables: AuthVariables }>()
```

## 新規ファイル追加時のチェックリスト

- [ ] `createMiddleware` を使っている
- [ ] 単一の責務を持っている
- [ ] 依存するミドルウェアがある場合はREADMEに明記している
- [ ] エラー時は適切なHTTPステータス（401/403など）を返している
