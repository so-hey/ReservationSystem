# 予約システム

モダンな React アプリケーション構成でリファクタリングされた予約システムです。

## ディレクトリ構成

```
src/
├── app/                         # アプリケーションレベルの設定
│   ├── providers/               # グローバルプロバイダー
│   │   └── AppProviders.tsx     # ChakraUI + AuthProvider
│   ├── router/                  # ルーティング設定
│   │   └── AppRoutes.tsx        # ルート定義
│   ├── layout/                  # レイアウトコンポーネント
│   │   └── PageLayout.tsx       # ページレイアウト
│   └── App.tsx                  # メインアプリコンポーネント
├── features/                    # 機能別ディレクトリ
│   ├── auth/                    # 認証機能
│   │   ├── components/          # 認証関連コンポーネント
│   │   ├── hooks/               # 認証関連フック
│   │   └── index.ts             # 機能のエクスポート
│   ├── reservation/             # 予約機能
│   │   ├── pages/               # 予約関連ページ
│   │   ├── components/          # 予約関連コンポーネント
│   │   ├── api/                 # 予約API
│   │   └── index.ts             # 機能のエクスポート
│   └── admin/                   # 管理機能
│       ├── pages/               # 管理画面ページ
│       ├── components/          # 管理画面コンポーネント
│       └── index.ts             # 機能のエクスポート
├── shared/                      # 共有リソース
│   ├── components/              # 共有コンポーネント
│   │   ├── ui/                  # 基本UIコンポーネント
│   │   └── form/                # フォーム関連コンポーネント
│   ├── hooks/                   # 共有フック
│   ├── utils/                   # ユーティリティ関数
│   ├── api/                     # 共有API設定
│   ├── types/                   # 型定義
│   └── constants/               # 定数
├── hooks/                       # 互換レイヤー（旧コード用）
└── lib/                         # レガシー（削除予定）
```

## 機能

### 認証システム

- JWT トークンベースの認証
- ローカルストレージでのセッション管理
- 保護されたルートのサポート

### 予約システム

- 予約の作成、確認、完了
- 利用可能時間の表示
- 返却処理

### 管理システム

- 予約一覧の表示
- ページネーション
- 予約の承認/却下/削除

## 技術スタック

- **React 18** with TypeScript
- **Chakra UI v3** for UI components
- **React Router v7** for routing
- **React Hook Form** for form management
- **Vite** for build tooling

## 開発

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# プレビュー
npm run preview

# 型チェック
npm run type-check
```

## パスエイリアス

```typescript
@/*          -> ./src/*
@/features/* -> ./src/features/*
@/shared/*   -> ./src/shared/*
@/app/*      -> ./src/app/*
@/hooks/*    -> ./src/hooks/*
```

## 設計原則

1. **Feature-based Architecture**: 機能ごとの独立性
2. **関心の分離**: ビジネスロジック、UI、API の分離
3. **再利用性**: 共有コンポーネントとユーティリティ
4. **型安全性**: TypeScript による厳密な型チェック
