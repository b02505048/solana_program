build:
	cargo build-bpf
clean:
	cargo clean
local:
	solana program deploy ./target/deploy/bank.so --url localhost
devnet:
	solana program deploy ./target/deploy/bank.so --url devnet

SOLANA_TOOLS = $(shell dirname $(shell which cargo-build-bpf))
include $(SOLANA_TOOLS)/sdk/bpf/c/bpf.mk
