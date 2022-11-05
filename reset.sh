rm ~/.config/solana/id.json
solana config set --url http://127.0.0.1:8899
solana-keygen new
solana-test-validator
