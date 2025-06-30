# Glamping Okinawa - ランディングページ

沖縄北部の今帰仁村にある「ジャングリア」近くのグランピング施設のランディングページです。星空とジャングルに囲まれた、贅沢な休暇体験を提供します。

## 技術スタック

- HTML5
- CSS3
- JavaScript (ES6+)
- Tailwind CSS (CDN経由)
- Font Awesome (アイコン)
- Google Fonts (Noto Sans JP, Playfair Display)
- Netlify Forms (問い合わせフォーム)

## プロジェクト構成

```
glamping-lp/
├── css/
│   └── style.css      # カスタムスタイル
├── js/
│   └── main.js        # インタラクティブ機能
├── images/            # 画像ディレクトリ（必要に応じて追加）
├── index.html         # メインHTMLファイル
└── README.md          # プロジェクト説明
```

## ローカル開発手順

1. リポジトリをクローン
   ```bash
   git clone https://github.com/yourusername/glamping-lp.git
   cd glamping-lp
   ```

2. ローカルサーバーで実行（例：VS Code Live Serverプラグインや、以下のPythonコマンドを使用）
   ```bash
   # Python 3の場合
   python -m http.server 8000
   
   # Python 2の場合
   python -m SimpleHTTPServer 8000
   ```

3. ブラウザで `http://localhost:8000` にアクセス

## Netlifyへのデプロイ手順

### 方法1: Netlify Dropによるデプロイ（GitHubリポジトリなし）

1. [Netlify Drop](https://app.netlify.com/drop) にアクセス
2. プロジェクトフォルダ全体をブラウザにドラッグ＆ドロップ
3. デプロイが完了すると、一時的なURLが発行されます
4. Netlifyにサインインして、サイト名やカスタムドメインを設定可能

### 方法2: GitHubリポジトリからのデプロイ

1. GitHubにリポジトリを作成し、プロジェクトをプッシュ
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/glamping-lp.git
   git push -u origin main
   ```

2. [Netlify](https://app.netlify.com/) にログイン
3. 「New site from Git」をクリック
4. GitHubを選択し、リポジトリを選択
5. ビルド設定は以下のように設定（静的HTMLサイトのため、ビルドコマンドは不要）
   - Build command: （空欄）
   - Publish directory: `/`（ルートディレクトリ）
6. 「Deploy site」をクリック

### Netlify Formsの設定

問い合わせフォームは、Netlify Formsを使用して機能します。特別な設定は必要ありませんが、以下の点を確認してください：

1. HTMLフォームに `data-netlify="true"` 属性が設定されていること
2. フォームに `name` 属性が設定されていること
3. 送信後の処理が `main.js` に実装されていること

デプロイ後、Netlifyダッシュボードの「Forms」タブでフォーム送信を確認できます。

## カスタマイズ

- 画像：`https://images.unsplash.com/` のURLを実際の画像に置き換え
- カラー：`#1EC2C8`（ターコイズ）と`#FF9B6A`（サンセットオレンジ）を必要に応じて変更
- テキスト：各セクションのテキストを実際の情報に更新
- Google Map：ダミーのマップを実際の埋め込みコードに置き換え

## ライセンス

このプロジェクトは [MIT License](LICENSE) の下で公開されています。
