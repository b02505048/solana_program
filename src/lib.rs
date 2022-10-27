use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    pubkey::Pubkey,
    msg,
    program_error::ProgramError,
};

/// Define the type of state stored in accounts
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct UserData {
    /// balance of user
    pub balance: u32,
}

// Declare the entrypoint of the program
entrypoint!(process_instruction);

// Program entrypoint's implementation
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8]
) -> ProgramResult {
    msg!("Alice & Bob is communicating!");

    // Iterating accounts is safer than indexing
    let accounts_iter = &mut accounts.iter();
    
    // Get the account to modify balance
    let account = next_account_info(accounts_iter)?;

    // The account must be owned by the program in order to modify its data
    if account.owner != program_id {
        msg!("User account does not have the correct program id");
        return Err(ProgramError::IncorrectProgramId);
    }

    // Modify and store the new balance of the account
    let mut user = UserData::try_from_slice(&account.data.borrow())?;
    user.balance += 1;
    user.serialize(&mut &mut account.data.borrow_mut()[..])?;

    msg!("Account {}({}SOL) has {} in balance!", account.key, account.lamports(), user.balance);

    Ok(())
}
