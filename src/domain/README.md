# domain

ドメイン層。ビジネスの概念とリポジトリのインターフェースを定義する。

## 責務

- リポジトリインターフェース（抽象）を定義する
- ドメイン固有の型（エンティティ型・入力型）を定義する
- DB・Hono・外部サービスなど、いかなる実装にも依存しない

## 構成

ドメインごとにサブディレクトリを切る。

```
domain/
  authors/
    AuthorRepository.ts
  books/
    BookRepository.ts
  refreshTokens/
    RefreshTokenRepository.ts
  users/
    UserRepository.ts
```

## 各ファイルに含めるもの

- エンティティ型（`Author`, `Book`, `User` など）
- 入力型（`CreateAuthorInput`, `UpdateAuthorInput` など）
- リポジトリインターフェース（`AuthorRepository` など）

## エンティティ型・リポジトリ定義

### Author (`authors/AuthorRepository.ts`)

```ts
type Author = { id: number; name: string; email: string | null }
type CreateAuthorInput = { name: string; email?: string }
type UpdateAuthorInput = { name: string; email?: string }

interface AuthorRepository {
  findAll(): Promise<Author[]>
  findById(id: number): Promise<Author>
  create(input: CreateAuthorInput): Promise<Author>
  update(id: number, input: UpdateAuthorInput): Promise<Author>
  delete(id: number): Promise<void>
}
```

### Book (`books/BookRepository.ts`)

```ts
type Book = { id: number; title: string; authorId: number; price: number }
type CreateBookInput = { title: string; authorId: number; price: number }
type UpdateBookInput = { title: string; authorId: number; price: number }

interface BookRepository {
  findAll(): Promise<Book[]>
  findById(id: number): Promise<Book>
  create(input: CreateBookInput): Promise<Book>
  update(id: number, input: UpdateBookInput): Promise<Book>
  delete(id: number): Promise<void>
}
```

### User (`users/UserRepository.ts`)

```ts
type User = { id: number; name: string; email: string; isAdmin: boolean }
type UserWithPassword = User & { password: string }
type CreateUserInput = { name: string; email: string; password: string; isAdmin: boolean }
type UpdateUserInput = { name: string; email: string; isAdmin: boolean }

interface UserRepository {
  findAll(): Promise<User[]>
  findById(id: number): Promise<User>
  findByEmail(email: string): Promise<UserWithPassword>
  create(input: CreateUserInput): Promise<User>
  update(id: number, input: UpdateUserInput): Promise<User>
  updatePassword(id: number, hashedPassword: string): Promise<void>
  delete(id: number): Promise<void>
}
```

### RefreshToken (`refreshTokens/RefreshTokenRepository.ts`)

```ts
interface RefreshTokenRepository {
  create(userId: number, token: string, expiresAt: Date): Promise<void>
  findByToken(token: string): Promise<{ userId: number; expiresAt: Date } | null>
  deleteByToken(token: string): Promise<void>
  deleteByUserId(userId: number): Promise<void>
}
```

## 配置してはいけないもの

- Drizzle・better-sqlite3 などDB実装への依存（→ `infrastructure/repositories/` へ）
- Honoの型への依存
- ビジネスロジックの実装（→ `useCases/` へ）

## 新規ファイル追加時のチェックリスト

- [ ] `import` に外部ライブラリが含まれていない
- [ ] インターフェースと型定義のみで、実装コードがない
- [ ] ドメイン名に対応するサブディレクトリに配置されている
