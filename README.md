# Simple Solana Program
Just increase user balance in bank account

# to reproduce the code so far,

if you install solana cli, 

under solana_program

```
sh reset.sh 
```

to up the chain running,

then solana_program/program

```
sh upload.sh
```

to build and deploy your smart contract on chain,

then solana_program/client

```
yarn install && yarn start 
```

to run client main.ts client code



## Create Local Chain

https://github.com/solana-labs/example-helloworld

```
$ solana config set --url http://127.0.0.1:8899
$ solana-keygen new
$ solana-test-validator
```

### Build & Deploy

```
$ cd program
$ make build

// deploy to localnet
$ make local
```

### Test

```
$ cd program
$ cargo test
```

### Client command

```
// increase balance
$ yarn start
```


