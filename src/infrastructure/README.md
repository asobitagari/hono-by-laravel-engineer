# infrastructure

インフラ層。`domain/` で定義したリポジトリインターフェースの具体的な実装を配置する。

## 責務

- `domain/` のリポジトリインターフェースを実装する
- DBアクセス（Drizzle）や外部サービス呼び出しはこの層で行う
- `useCases/` や `domain/` はこの層を知らない（依存の方向は infrastructure → domain）

## 構成

```
infrastructure/
  repositories/
    DrizzleAuthorRepository.ts
    DrizzleBookRepository.ts
    DrizzleRefreshTokenRepository.ts
    DrizzleUserRepository.ts
```

## 命名規則

```
{実装技術}{対象}Repository.ts
```

例: `DrizzleAuthorRepository.ts`

## 新規ファイル追加時のチェックリスト

- [ ] ファイル名が `{実装技術}{対象}Repository.ts` の形式になっている
- [ ] `domain/` のリポジトリインターフェースを `implements` している
- [ ] インターフェースで定義された全メソッドを実装している
- [ ] 対象が見つからない場合は例外をスローしている
- [ ] ビジネスロジックを含んでいない（→ `useCases/` へ）
