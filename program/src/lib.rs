use std::collections::HashMap;
use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    pubkey::Pubkey,
    program_error::ProgramError,
    msg,
};

// use grasscrete::{
//     PublicKey,
//     SecretKey,
//     KeySwitchKey,
//     gen_pk,
//     gen_sk,
//     gen_ksk
// };


// program data
//#[derive(BorshSerialize, BorshDeserialize, Debug)]
//pub struct BankAccount {
//    pub balance: u32
//}

// program data
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct UserData{
    pub lat: u32,
    pub lng: u32,
    pub pk: u32,
    pub ksk: u32,
    pub friend1: String,
    pub friend2: String,
    pub friend3: String,
    pub friend_lat: u32,
    pub friend_lng: u32,

    //pub ksk_server_to_me: String
}


// program argument
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct OptionCommand{
    pub command: u32,
    pub lat: u32,
    pub lng: u32 ,
    pub pk: u32,
    pub friend_id: u32,
    pub friend_address: String, 
}


// trying to understand
// - shared storage?? (make another sc and get it from there)
// - vec list for frinds list
// - need to store key switch key
// - somehow need to intialize the server pk/sk when sc deployed


// TODO function to implement
// 0 => create ksk for user
// 1 => set encrypted coordinate
// 2 => set friends list
// 3 => remove friends from list
// 4 => get location

// TODO necessary impl

// - hard code sk, pk for sc side first
// - fix the struct shape

const server_sk: f64 = 1./0.2;
const server_pk: f64 = 0.2;
const multiple: f64 = 1000.0;


entrypoint!(increase_balance);

pub fn increase_balance(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    _instruction_data: &[u8],
) -> ProgramResult {

    msg!("start increase_balance");
    let accounts_iter = &mut accounts.iter();
    let account = next_account_info(accounts_iter)?;


    // client1 -> get_location(account_info)

    //let target_account

    // account must be owned by the programgetAccountInfo in order to modify its data
    if account.owner != program_id {
        return Err(ProgramError::IncorrectProgramId);
    }

    //let mut coordnate_info= CoordinatesData::try_from_slice(&account.data.borrow())?;
    let instruction: OptionCommand = OptionCommand::try_from_slice(_instruction_data)
    .map_err(|_| ProgramError::InvalidInstructionData)?;


    let result: Result<(), ProgramError> =  match instruction.command{
        0 => {
            // InitializeAccount
            Ok(())
        }

        1 => {
            // UploadLocation
            let mut user_data = UserData::try_from_slice(&account.data.borrow())?;
            user_data.lat = instruction.lat;
            user_data.lng = instruction.lng;
            user_data.serialize(&mut &mut account.data.borrow_mut()[..])?;
            Ok(())

        }

        2 => {
            // ResetLocation
            let mut user_data= UserData::try_from_slice(&account.data.borrow())?;
            user_data.lat = 0;
            user_data.lng = 0;
            user_data.serialize(&mut &mut account.data.borrow_mut()[..])?;
            Ok(())
        }

        3 => {
            // RequestLocation

            // first get ksk of client1
            let mut user_data= UserData::try_from_slice(&account.data.borrow())?;
            let ksk = user_data.ksk;

            // second get coords of client2
            let account2 = next_account_info(accounts_iter)?;
            let user_data2= UserData::try_from_slice(&account2.data.borrow())?;

            let mut user2_lat = user_data2.lat;
            let mut user2_lng = user_data2.lng;

            // third operate ksk
            user2_lat = (((user2_lat as f64 / multiple) * (ksk as f64 / multiple)) * multiple) as u32;
            user2_lng = (((user2_lng as f64 / multiple) * (ksk as f64 / multiple)) * multiple) as u32;


            // fourth write result to user1.friend_lat, user1.friend_lng
            user_data.friend_lat = user2_lat;
            user_data.friend_lng = user2_lng;
            user_data.serialize(&mut &mut account.data.borrow_mut()[..])?;

            Ok(())

        }

        4 => {
            // AddFriend

            // first get friend_id and friend_address of from instruction
            let mut user_data= UserData::try_from_slice(&account.data.borrow())?;
            msg!("got 4");
            let friend_id = instruction.friend_id;
            msg!("id {}", friend_id);
            let friend_address = instruction.friend_address;
            msg!("address {}", friend_address);

            // second update user_data
            if friend_id == 1{
                msg!("here1");
               user_data.friend1 = friend_address;
                msg!("here2");
            }
            else if friend_id == 2{
               user_data.friend2 = friend_address;

            }
            else if friend_id == 3{
               user_data.friend3 = friend_address;

            }

            user_data.serialize(&mut &mut account.data.borrow_mut()[..])?;

            Ok(())

        }

        5 => {
            // RemoveFriend

            // first get friend_id and friend_address of from instruction
            let mut user_data= UserData::try_from_slice(&account.data.borrow())?;
            let friend_id = instruction.friend_id;

            // second update user_data
            if friend_id == 1{
               user_data.friend1 = "".to_string();
            }
            else if friend_id == 2{
               user_data.friend2 = "".to_string();

            }
            else if friend_id == 3{
               user_data.friend3 = "".to_string();

            }

            user_data.serialize(&mut &mut account.data.borrow_mut()[..])?;

            Ok(())

        }

        6 => {
            // SetPk

            // first get user_data from account
            let mut user_data= UserData::try_from_slice(&account.data.borrow())?;

            // update user_data.pk with instruction.pk
            user_data.pk = instruction.pk;

            // calculate ksk for this user
            let ksk = (user_data.pk as f64 / multiple as f64) * server_sk;

            user_data.ksk = (ksk * multiple as f64) as u32;

            // update user_data
            user_data.serialize(&mut &mut account.data.borrow_mut()[..])?;

            
            Ok(())
        }

        _ => Err(ProgramError::InvalidInstructionData)

    };



    Ok(())
}
