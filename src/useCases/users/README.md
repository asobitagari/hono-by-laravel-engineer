# useCases/users

ユーザーに関するユースケースを配置するディレクトリ。

> 共通規約は [../README.md](../README.md) を参照。

## 配置すべきファイル一覧

| ファイル名 | 概要 |
|---|---|
| `getUsersUseCase.ts` | ユーザー一覧を取得する |
| `getUserUseCase.ts` | 指定したIDのユーザーを1件取得する |
| `createUserUseCase.ts` | 新しいユーザーを登録する |
| `updateUserUseCase.ts` | 指定したIDのユーザー情報を更新する |
| `deleteUserUseCase.ts` | 指定したIDのユーザーを削除する |

## 追加のチェック項目

- [ ] ユーザードメインのロジックである
- [ ] 他ドメインのロジックを含んでいない（→ 該当ドメインの `useCases/` へ）
- [ ] 第1引数が `UserRepository` インターフェースになっている
- [ ] Drizzle や `db` を直接importしていない
- [ ] パスワードを平文で扱っていない（ハッシュ化は `src/shared/` のヘルパーを使う）
