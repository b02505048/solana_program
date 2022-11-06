# プロダクト概要
# Tesolana Smart Contract

Tesolana は、
自分の位置情報を友達と「セキュア」に共有することのできるWeb3アプリです。
Tesolana はSolanaチェーン上にデプロイされたスマートコントラクトで作られたdAppです。
Tesolanaは、暗号技術を用いて、自分のフレンドユーザのみに安全に位置情報を共有できます。
ユーザの位置情報は暗号化され、不特定多数のユーザや、スマートコントラクト側はユーザの位置情報を知ることはできません。

各ユーザがアップロードした位置情報はSolanaのデータアカウントに保存され、
他のユーザもその情報を取得できますが、他のユーザが取得できるのは暗号化された位置情報のみです。
ユーザ１がユーザ２をフレンド登録すると、スマートコントラクトは、
ユーザ１のデータアカウントに登録されているユーザ１の位置情報（暗号）を、ユーザ２の鍵ペアで復号できる暗号に作り替え（プロキシ再暗号）、ユーザ２のデータアカウントに書き込みます。
そのようにして、サーバサイドにも、ユーザサイドにも位置情報を公開することなく
必要な人たちにのみ位置情報を公開することのできるようなdAppを今回は作成しました。

# Frontend code
https://github.com/b02505048/tesolana
# Frontend URL

https://tesolana.web.app

# Backend code
https://github.com/b02505048/solana_program


# 使用したtech stacks
フロントエンド
- vuejs (frontend)
- web3js (solana client)
- firebase (deployment)

バックエンド
- solana_program (smart contract)
- encryption (rust)

# 使用したBlockchain
**Solana**

# deployしたContract
バックエンドのコントラクト

# application codeやその他のfile
アプリケーションはフロントエンドにコードがあります。

サービスのフロー図については  

- flow_architecture.png

提出時点でのスマートコントラクトのテスト方法については  

- sc-how-to-use.md

このプロジェクトにおける暗号については、  

- explain-encryption.md

提出時の作業の進捗については  

- explain-progress.md

をご覧ください。
