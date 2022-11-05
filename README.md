# Simple Solana Program
Just increase user balance in bank account

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

