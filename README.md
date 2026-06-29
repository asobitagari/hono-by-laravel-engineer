# Laravel エンジニアの設計手法を TypeScript バックエンドの Hono で試す

TS のバックエンドフレームワークといえば NestJS くらいしか知らなかったが、Hono を知る機会があった。Laravel で培った開発手法や設計をそのまま Hono に落とし込めるのか？を検証するための学習プロジェクトだ。

自分が PM や PL をやっていたころは、ドメイン知識であるモデル図のスケッチ（ゴリゴリというよりはラフな感じ）や、簡単な UML を描いて共有していた。ここ半年ほどで全く別の手法を試し始めた。各レイヤー・各ドメインに README という仕様書を用意し、人にも AI にも開発の起点となるドキュメントを置くというアプローチだ。それが Hono でも通用するかも、あわせて検証している。

新しい API を作る前に仕様を README に落とし込み、それを起点に実装していく。新しい仕様が加わればドキュメントを更新し、現在の実装との矛盾がないかを調査・修正する。コーディングの多くを AI に任せられるようになったことで、ドキュメントを書く時間がとれるようになった。そしてそのドキュメントを書くこと自体が開発になる——20年ほど前に理想としていた姿が、ようやく形になり始めた感がある。

Notion や Confluence に仕様書が書かれていながら最新情報はチケットに、しかも Redmine と JIRA が併用されていたり、チームごとにツールが違ったり……といった仕様書の乱立を探し回る手間もなくなる。一桁規模のチームでも回せることは確認できたし、今回は一人でも回すことができた。より大きなチームになるとまたわからないが、確かなドキュメントが残ることで得られる恩恵も少なくないだろう。

書籍・著者管理 API を題材に、Hono の基本的な使い方から JWT 認証・クリーンアーキテクチャまで一通り試した。

## 技術スタック

| | |
|---|---|
| Runtime | Node.js |
| Framework | [Hono](https://hono.dev/) |
| Validation | Zod v4 + @hono/zod-validator |
| ORM | Drizzle ORM |
| DB | SQLite（better-sqlite3） |
| Auth | JWT（hono/jwt, HS256）+ リフレッシュトークン |
| Test | Vitest |

## アーキテクチャ

DDDを意識したレイヤー構成。Laravelに例えると以下のような対応関係。

```
routes/         ← Controller
validators/     ← FormRequest
useCases/       ← Action クラス / Service
services/       ← ビジネスルールを持つ Domain Service
domain/         ← Interface（Repository パターン）
infrastructure/ ← Eloquent に相当する DB実装
shared/         ← ヘルパー
```

## セットアップ

```bash
npm install

# 環境変数
cp .env.example .env   # JWT_SECRET を設定する

# DB初期化
npm run db:migrate
npm run db:seed

# 開発サーバー起動
npm run dev
```

## 環境変数

| 変数名 | 説明 | 例 |
|---|---|---|
| `JWT_SECRET` | JWTの署名シークレット（必須） | `openssl rand -hex 32` で生成 |
| `DATABASE_URL` | SQLiteファイルパス（省略時: `sqlite.db`） | `sqlite.db` |

## API

### 認証 `/api/auth`

| メソッド | パス | 概要 |
|---|---|---|
| POST | `/login` | ログイン。`accessToken`と`refreshToken`を返す |
| POST | `/register` | ユーザー登録 |
| POST | `/logout` | リフレッシュトークンを無効化 |
| POST | `/refresh-token` | アクセストークンを再発行 |

### プロフィール `/api/profile` ※要認証

| メソッド | パス | 概要 |
|---|---|---|
| GET | `/` | 自分の情報を取得 |
| PUT | `/` | 名前を変更（メールアドレスは変更不可） |
| PUT | `/password` | パスワードを変更 |

### 著者・書籍・ユーザー

GETは公開。POST / PUT / DELETE は管理者のみ。

| パス | 備考 |
|---|---|
| `/api/authors` | 著者管理 |
| `/api/books` | 書籍管理 |
| `/api/users` | ユーザー管理 |

## テスト

```bash
npm test           # 全テスト実行
npm run test:watch # ウォッチモード
```

テストはインメモリSQLiteで実行されるため、実DBに影響しない。

## Laravel との比較でわかったこと

- Honoのミドルウェアチェーン（`authMiddleware, adminMiddleware, handler`）はLaravelのミドルウェアと発想が近い
- `zValidator` は FormRequest に相当する。ルートに直接書くこともできるが、結局 `validators/` に切り出した
- DIはフレームワーク任せではなく、UseCaseの第1引数にリポジトリを渡す形で自前で行う
- Eloquent と違い、Drizzle は SQL に近い記述で直感的に扱いやすい

## 依存性の注入（DI）

各ルートはファクトリ関数として定義し、依存するリポジトリを引数で受け取る。

```ts
// routes/books.ts
export function createBooksRoute(repo: BookRepository) {
  const app = new Hono()
  // ...
  return app
}
```

`app.ts` をコンポジションルートとし、リポジトリの生成と注入をここに集約する。

```ts
// app.ts
const bookRepo = new DrizzleBookRepository()
app.route('/api/books', createBooksRoute(bookRepo))
```

ルートファイルはドメインインターフェース（`BookRepository` など）にのみ依存する。実装クラス（`DrizzleBookRepository`）はルートが知らなくてよい。この設計により、テストでは任意のリポジトリ実装を差し込める。

```ts
// テストファイル
app.route('/api/books', createBooksRoute(new DrizzleBookRepository()))
```

各ルートのファクトリ関数名と引数は以下の通り。

| ファイル | ファクトリ関数 | 引数 |
|---|---|---|
| `routes/auth.ts` | `createAuthRoute` | `userRepo: UserRepository, refreshTokenRepo: RefreshTokenRepository` |
| `routes/profile.ts` | `createProfileRoute` | `repo: UserRepository` |
| `routes/authors.ts` | `createAuthorsRoute` | `repo: AuthorRepository` |
| `routes/books.ts` | `createBooksRoute` | `repo: BookRepository` |
| `routes/users.ts` | `createUsersRoute` | `repo: UserRepository` |
