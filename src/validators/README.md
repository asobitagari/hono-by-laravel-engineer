# validators

ルートで使用するZodスキーマを配置するディレクトリ。

## 責務

- リクエストボディ・クエリパラメータ・パスパラメータのバリデーションスキーマを定義する
- スキーマの定義のみを行い、ビジネスロジックを含まない
- `zValidator` と組み合わせて route 層で使用する

## 命名規則

ファイル名はドメイン名（route名）に合わせる。

```
{ドメイン}.ts
```

例: `auth.ts`, `authors.ts`, `books.ts`

スキーマ名は用途がわかるように命名する。

```
{動詞}{対象}Schema
```

例: `createAuthorSchema`, `updateBookSchema`, `loginSchema`

## 配置すべきファイル一覧

| ファイル名 | 概要 |
|---|---|
| `auth.ts` | 認証系エンドポイントのスキーマ |
| `authors.ts` | 著者エンドポイントのスキーマ |
| `books.ts` | 書籍エンドポイントのスキーマ |
| `profile.ts` | ログインユーザー自身のプロフィール更新・パスワード変更スキーマ |
| `users.ts` | ユーザー管理エンドポイントのスキーマ |

## 各スキーマのバリデーションルール

### `auth.ts`

| スキーマ | フィールド | ルール |
|---|---|---|
| `loginSchema` | email | メールアドレス形式 |
| `loginSchema` | password | 1文字以上 |
| `registerSchema` | email | メールアドレス形式 |
| `registerSchema` | password | 8文字以上 |
| `logoutSchema` | token | 1文字以上 |
| `refreshTokenSchema` | refreshToken | 1文字以上 |

### `authors.ts`

| スキーマ | フィールド | ルール |
|---|---|---|
| `createAuthorSchema` | name | 1〜100文字 |
| `createAuthorSchema` | email | メールアドレス形式、任意 |
| `updateAuthorSchema` | name | 1〜100文字 |
| `updateAuthorSchema` | email | メールアドレス形式、任意 |

### `books.ts`

| スキーマ | フィールド | ルール |
|---|---|---|
| `createBookSchema` | title | 1文字以上 |
| `createBookSchema` | authorId | 数値 |
| `createBookSchema` | price | 正の数値 |
| `updateBookSchema` | title | 1文字以上 |
| `updateBookSchema` | authorId | 数値 |
| `updateBookSchema` | price | 正の数値 |

### `profile.ts`

| スキーマ | フィールド | ルール |
|---|---|---|
| `updateProfileSchema` | name | 1〜100文字 |
| `updatePasswordSchema` | currentPassword | 1文字以上 |
| `updatePasswordSchema` | newPassword | 8文字以上 |

### `users.ts`

| スキーマ | フィールド | ルール |
|---|---|---|
| `updateUserSchema` | name | 1〜100文字 |
| `updateUserSchema` | email | メールアドレス形式 |
| `updateUserSchema` | isAdmin | boolean |

## 配置してはいけないもの

- ビジネスロジックや条件分岐
- DBアクセスを伴うカスタムバリデーション（→ useCase 層へ）
- Honoの `Context` や `Request` への依存

## 新規ファイル追加時のチェックリスト

- [ ] ファイル名が対応するドメイン名になっている
- [ ] スキーマ名が `{動詞}{対象}Schema` の形式になっている
- [ ] `export const` で名前付きエクスポートされている
- [ ] ビジネスロジックを含んでいない
- [ ] Zodのインポート以外の外部依存がない
