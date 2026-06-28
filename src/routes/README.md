# routes

HTTPルートハンドラを配置するディレクトリ。

## 責務

- HTTPリクエストの受け取りとレスポンスの返却
- バリデーション（`zValidator`）とミドルウェアの適用
- useCaseを呼び出してビジネスロジックを委譲する

## 配置すべきファイル一覧

| ファイル名 | マウントパス | 認証 |
|---|---|---|
| `auth.ts` | `/api/auth` | 不要 |
| `profile.ts` | `/api/profile` | 全ルート（`authMiddleware`） |
| `authors.ts` | `/api/authors` | GET不要 / POST・PUT・DELETE は `authMiddleware` + `adminMiddleware` |
| `books.ts` | `/api/books` | GET不要 / POST・PUT・DELETE は `authMiddleware` + `adminMiddleware` |
| `users.ts` | `/api/users` | GET不要 / POST・PUT・DELETE は `authMiddleware` + `adminMiddleware` |

## エンドポイント一覧

### `/api/auth`
| メソッド | パス | 概要 |
|---|---|---|
| POST | `/login` | ログイン。アクセストークンとリフレッシュトークンを返す |
| POST | `/register` | 新規ユーザー登録 |
| POST | `/logout` | リフレッシュトークンを無効化 |
| POST | `/refresh-token` | リフレッシュトークンで新しいアクセストークンを発行 |
| POST | `/reset-password` | パスワードリセット |

### `/api/profile`
| メソッド | パス | 概要 |
|---|---|---|
| GET | `/` | ログインユーザー自身の情報取得 |
| PUT | `/` | プロフィール（name, email）更新 |
| PUT | `/password` | パスワード変更 |

### `/api/authors` / `/api/books` / `/api/users`
| メソッド | パス | 概要 |
|---|---|---|
| GET | `/` | 一覧取得（公開） |
| GET | `/:id` | 個別取得（公開） |
| POST | `/` | 作成（管理者のみ） |
| PUT | `/:id` | 更新（管理者のみ） |
| DELETE | `/:id` | 削除（管理者のみ） |

## 規約

- ルートハンドラにビジネスロジックを書かない（→ `useCases/` へ委譲）
- バリデーションは `zValidator` と `validators/` のスキーマを使う
- エラーハンドリングは try/catch でルートレベルで行い、適切なステータスコードを返す

## 新規ファイル追加時のチェックリスト

- [ ] `app.ts` に `app.route(...)` でマウントされている
- [ ] バリデーションに `zValidator` を使っている
- [ ] ビジネスロジックをuseCaseに委譲している
- [ ] 認証・認可が必要なルートにミドルウェアを適用している
