---
title: "basic-stack writeup"
description: "basic-stack を題材に、問題概要、着眼点、解法を整理した CTF writeup。"
date: 2026-03-30 11:00:00 +0900
tags:
  - ctf
  - writeup
  - pwn
---

今回は、スタック操作がテーマのウォームアップ問題を扱います。

<!--more-->

## Summary

- 32-bit ELF
- Canary なし
- NX 有効
- 関数ポインタ上書きで制御を奪う構成

## Approach

調査の流れは次の通りです。

1. `checksec` で基本保護機構を確認する
2. `main` から各関数の呼び出し順を追う
3. 入力サイズとローカル変数の配置を比較する
4. どの値を壊すと制御フローが変わるかを確認する

## Notes

```c
char buf[64];
void (*hook)(void) = safe;
read(0, buf, 128);
hook();
```

このような構造なら、リターンアドレスまで届かなくても `hook` を壊して別関数へ飛ばせます。

## Takeaway

writeup は最終的な exploit だけでなく、途中で切り捨てた仮説や確認手順も残しておくと、後で自分の再利用性がかなり上がります。
