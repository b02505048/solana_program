
# スマートコントラクトの使用手順

## Create Local Chain

https://github.com/solana-labs/example-helloworld

```
$ solana config set --url http://127.0.0.1:8899
$ solana-keygen new
$ solana-test-validator
```

## Build & Deploy smart contract to chain

```  
cd solana_program/program
```

```
sh upload.sh
```

## Typescript client code to access smart contract

```
cd solana_program/client
```

```
yarn install && yarn start 
```