# useCases/books

書籍に関するユースケースを配置するディレクトリ。

> 共通規約は [../README.md](../README.md) を参照。

## 配置すべきファイル一覧

| ファイル名 | 概要 |
|---|---|
| `getBooksUseCase.ts` | 書籍一覧を取得する |
| `getBookUseCase.ts` | 指定したIDの書籍を1件取得する |
| `createBookUseCase.ts` | 新しい書籍を登録する |
| `updateBookUseCase.ts` | 指定したIDの書籍情報を更新する |
| `deleteBookUseCase.ts` | 指定したIDの書籍を削除する |

## 追加のチェック項目

- [ ] 書籍ドメインのロジックである
- [ ] 他ドメインのロジックを含んでいない（→ 該当ドメインの `useCases/` へ）
- [ ] 第1引数が `BookRepository` インターフェースになっている
- [ ] Drizzle や `db` を直接importしていない
