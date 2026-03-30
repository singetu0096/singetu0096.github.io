---
title: "Web セキュリティ検証の初動チェックリスト"
description: "アプリケーションを触り始める時に、自分用に確認している項目を整理したメモ。"
date: 2026-03-30 13:30:00 +0900
tags:
  - security
  - web
  - checklist
---

対象アプリケーションを見始めた直後に、毎回ゼロから考えないためのチェックリストを用意しておくと効率が安定します。

<!--more-->

## Confirm first

- 認証方式
- ロールの違い
- 入力経路
- ファイルアップロードの有無
- 外部連携 API
- エラーレスポンスの差分

## Why this helps

最初の 15 分で全体像を掴めると、その後のテスト観点がぶれにくくなります。特に `権限差分` と `状態遷移` は後から見直しやすい形で残しておくのが重要です。

## Reusable format

```md
## Target
- URL:
- Auth:
- Roles:

## Interesting endpoints
- /api/...

## Hypotheses
- IDOR
- SSRF
- Privilege escalation
```

ブログを Markdown ベースにしておくと、この種のテンプレートもそのまま記事化できます。
