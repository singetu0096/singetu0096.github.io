# singetu0096 homepage

GitHub Pages で動かす Jekyll 製のポートフォリオ + セキュリティブログです。

## 構成

- `portfolio/`: 経歴、実績、連絡先をまとめるポートフォリオページ
- `blog/`: タグフィルタ付きのブログ一覧
- `_posts/`: Markdown で書くブログ記事
- `_data/profile.yml`: プロフィールや実績の編集用データ
- `scripts/new-post.sh`: 新規記事の雛形を作るスクリプト
- `.github/workflows/pages.yml`: GitHub Pages 自動デプロイ

## セットアップ

```bash
bundle install
bundle exec jekyll serve --livereload
```

ローカル確認は `http://127.0.0.1:4000/` です。

## 記事の追加

```bash
./scripts/new-post.sh "SECCON Beginners CTF" "ctf,writeup,web"
```

作成された `_posts/YYYY-MM-DD-slug.md` を編集して、そのままコミット・push すれば GitHub Pages に反映されます。

## 編集ポイント

- 自己紹介や連絡先は `_data/profile.yml`
- トップページ文言は `_layouts/home.html`
- ブログ一覧の絞り込み挙動は `assets/js/blog-filter.js`
- デザイン全体は `assets/css/main.css`

## GitHub Pages

1. GitHub のリポジトリ設定を開く
2. `Pages` の `Build and deployment` で `Source` を `GitHub Actions` にする
3. `main` ブランチへ push する

`_config.yml` は `baseurl: ""` にしてあります。

ただし、GitHub のデフォルトドメインでサイトを `/` に出すには、リポジトリをユーザーサイト用の `singetu0096.github.io` にするか、カスタムドメインを使う必要があります。今のまま `homepage` リポジトリで公開すると、デフォルト URL は通常 `/homepage/` です。
