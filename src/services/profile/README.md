# services/profile

ログインユーザー自身のプロフィールに関するドメインサービス。

> 共通規約は [../README.md](../README.md) を参照。

## 配置すべきファイル一覧

| ファイル名 | 概要 | ビジネスルール |
|---|---|---|
| `updateProfileNameService.ts` | ログインユーザーの名前を変更する | メールアドレスは変更不可 |
| `updatePasswordService.ts` | パスワードを変更する | 現在のパスワードの確認が必要 |

## 配置しないもの

- プロフィール取得（`repo.findById()` を呼ぶだけ → `routes/profile.ts` から直接呼ぶ）
