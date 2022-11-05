
use std::collections::HashMap;
use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    pubkey::Pubkey,
    msg,
    program_error::ProgramError,
};

/// Data account for each registered user
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct UserData{
    pub lat: u32,
    pub lng: u32,
    pub pk: u32,
    pub ksk: u32,
    pub friend: String,
    pub friend_lat: u32,
    pub friend_lng: u32
}

// Option for the interaction with program account
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct Params{
    pub command: u32,
    pub lat: u32,
    pub lng: u32 ,
    pub pk: u32,
    pub ksk: u32,
    pub friend_address: String, 
}

const server_pk: f64 = 0.2;
const multiple: f64 = 1000.0;

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

    // Load the data account into UserData
    let mut user_data = UserData::try_from_slice(&account.data.borrow())?;

    // Retrieve the option
    let instruction: Params = Params::try_from_slice(instruction_data)
    .map_err(|_| ProgramError::InvalidInstructionData)?;

    let result: Result<(), ProgramError> =  match instruction.command{
        0 => {
            // Initialize account?
            Ok(())
        }

        1 => {
            // Share & upload the location
            user_data.lat = instruction.lat;
            user_data.lng = instruction.lng;

            // Also add friend's address into friend
            let friend_address = instruction.friend_address;
            msg!("address {}", friend_address);
            user_data.friend = friend_address;

            user_data.serialize(&mut &mut account.data.borrow_mut()[..])?;
            Ok(())

        }

        2 => {
            // Reset & clear the location
            user_data.lat = 0;
            user_data.lng = 0;
            user_data.serialize(&mut &mut account.data.borrow_mut()[..])?;
            Ok(())
        }

        3 => {
            // Track friend's location

            // First, get ksk of caller
            let ksk = user_data.ksk;

            // Second, get lng & lat of target
            let target = next_account_info(accounts_iter)?;
            let target_data = UserData::try_from_slice(&target.data.borrow())?;

            if target_data.friend != instruction.friend_address {
                // Raise Error
            }

            let mut target_lat = target_data.lat;
            let mut target_lng = target_data.lng;

            // third operate ksk
            target_lat = (((target_lat as f64 / multiple) * (ksk as f64 / multiple)) * multiple) as u32;
            target_lng = (((target_lng as f64 / multiple) * (ksk as f64 / multiple)) * multiple) as u32;


            // fourth write result to user1.friend_lat, user1.friend_lng
            user_data.friend_lat = target_lat;
            user_data.friend_lng = target_lng;
            user_data.serialize(&mut &mut account.data.borrow_mut()[..])?;
            Ok(())

        }

        4 => {
            // Revoke the location sharing
            user_data.friend = "".to_string();

            user_data.serialize(&mut &mut account.data.borrow_mut()[..])?;
            Ok(())

        }

        5 => {
            // Set the pubKey of the user
            // This step should be done with the user registration

            // Update user_data.pk with instruction.pk
            user_data.pk = instruction.pk;

            // calculate ksk for this user
            // let ksk = (user_data.pk as f64 / multiple as f64) * server_sk;
            // user_data.ksk = (ksk * multiple as f64) as u32;
            
            // ksk should be calculated on client side
            user_data.ksk = instruction.ksk;

            user_data.serialize(&mut &mut account.data.borrow_mut()[..])?;
            Ok(())

        }
        _ => Err(ProgramError::InvalidInstructionData)

    };

    // // Modify and store the new balance of the account
    // let mut user = UserData::try_from_slice(&account.data.borrow())?;
    // user.balance += 1;
    // user.serialize(&mut &mut account.data.borrow_mut()[..])?;

    // msg!("Account {}({}SOL) has {} in balance!", account.key, account.lamports(), user.balance);

    Ok(())
}
