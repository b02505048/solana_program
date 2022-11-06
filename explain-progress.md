# 提出時点での進捗についての説明

# バックエンド

今回提出したスマートコントラクトは

client/src/data.ts 
にもあるように

```
enum InstructionVariant {
  InitializeAccount = 0,
  UploadLocation = 1,
  ResetLocation = 2,
  RequestLocation = 3,
  AddFriend = 4,
  RemoveFriend = 5,
  SetPk = 6,
}
```

この７つのAPIを持っています。

それぞれ、

0. InitializeAccount (デバッグ用のAPI)
1. UploadLocation (クライアント側で暗号化した位置情報を送信するAPI)
2. ResetLocation (クライアント側で送信した位置情報を削除するAPI)
3. RequestLocation (他のユーザの位置情報を取得するAPI)
4. AddFriend (自分が位置情報の共有を許可するユーザ、フレンドを登録するAPI)
5. RemoveFriend (フレンドを削除するAPI)
6. SetPk(ユーザ登録するときに、自分の公開鍵をスマートコントラクトへと送信するAPI)

を用意しています。

このうち、４にバグがあり、解消し切れていません。
したがって、フロントエンドからの繋ぎ込みも、友達の追加のところはハードコードで行っており、
プロダクトとしてのつなぎ込みまで終了できませんでした。
この箇所は、提出の後にバグ解消をし、リリースまで持っていきたいと考えています。

# フロントエンド

https://tesolana.web.app/

こちらから確認できるUIは、上記の理由から、実際のスマートコントラクトにはクエリを送信できていない状態のものとなっています。

# クライアントコード

solana_program/client/src/main.ts

には、スマートコントラクトへのクライアントコードを実装しています。

```
import {
    command_add_friend,
    command_remove_friend,
    command_request_location,
    command_send_location,
    command_reset_location,
    command_set_pk,
} from "./commands";

```

そこで、以上のような関数を用意しており、それぞれ、

1. command_add_friend フレンドを追加するときに使用する関数
2. command_remove_friend フレンドを削除するときに使用する関数
3. command_request_location フレンドの位置情報を取得するときに使用する関数
4. command_send_location 自分の位置情報をアップロードするときに使用する関数
5. command_reset_location 自分の位置情報を初期化（削除）するときに使用する関数
6. command_set_pk ユーザ登録時に自分の公開鍵をスマートコントラクトにアップロードする関数

となっています。
これらはテスト中であり、これらが実行可能になると、
それらをフロントエンドのUIに実際に載せ、プロダクト化するところまで実装したかったのですが、
それは間に合わず、提出時点以降で追加で開発しリリースまで持っていきたいと考えています。

