# useCases/authors

著者に関するユースケースを配置するディレクトリ。

> 共通規約は [../README.md](../README.md) を参照。

## 配置すべきファイル一覧

| ファイル名 | 概要 |
|---|---|
| `getAuthorsUseCase.ts` | 著者一覧を取得する |
| `getAuthorUseCase.ts` | 指定したIDの著者を1件取得する |
| `createAuthorUseCase.ts` | 新しい著者を登録する |
| `updateAuthorUseCase.ts` | 指定したIDの著者情報を更新する |
| `deleteAuthorUseCase.ts` | 指定したIDの著者を削除する |

## 追加のチェック項目

- [ ] 著者ドメインのロジックである
- [ ] 他ドメインのロジックを含んでいない（→ 該当ドメインの `useCases/` へ）
- [ ] 第1引数が `AuthorRepository` インターフェースになっている
- [ ] Drizzle や `db` を直接importしていない
