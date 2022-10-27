# Tesolana - A Solana Program for Encryption(Testing)

Once you're ready to deploy your Solana program to the Solana cluster, you may execute the following commands under the root of the project.

```
// Build the Solana program .so
cargo build-bpf

// Check the current Solana cluster
solana config get

// Deploy the Solana program to Solana cluster
solana program deploy ./target/deploy/tesolana.so
```
