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

use grasscrete::{
    PublicKey,
    SecretKey,
    KeySwitchKey,
    gen_pk,
    gen_sk,
    gen_ksk
};


// program data
//#[derive(BorshSerialize, BorshDeserialize, Debug)]
//pub struct BankAccount {
//    pub balance: u32
//}

// program data
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct CoordinatesData{
    pub lat: u32,
    pub lng: u32,
    pub ksk_server_to_me: String
}

// // program data
// #[derive(BorshSerialize, BorshDeserialize, Debug)]
// pub struct FriendsData{
//     pub data: Vec<String>,
// }


// program argument
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct OptionCommand{
    pub command: u32,
    pub lat: u32,
    pub lng: u32 ,
    pub target_friend: String
}


// trying to understand
// - shared storage?? (make another sc and get it from there)
// -  

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
            //udpate coordinate
            msg!("got 0!!!");
            msg!("{:?}", &account.data);
            msg!("{:?}", &instruction);
            let mut coordnate_info= CoordinatesData::try_from_slice(&account.data.borrow())?;
            msg!("parsed!!!");
            coordnate_info.lat = instruction.lat;
            coordnate_info.lng = instruction.lng;
            coordnate_info.serialize(&mut &mut account.data.borrow_mut()[..])?;
            Ok(())
        }

        1 => {
            //reset coordinate
            let mut coordnate_info= CoordinatesData::try_from_slice(&account.data.borrow())?;
            coordnate_info.lat = 0;
            coordnate_info.lng = 0;
            coordnate_info.serialize(&mut &mut account.data.borrow_mut()[..])?;
            Ok(())
        }

        2 => {
            // add friends
            msg!("got 2!!");
            //let mut friends_info = FriendsData::try_from_slice(&account.data.borrow())?;
            //friends_info.data.push(instruction.add_friend);
            //friends_info.data.push("test".to_string());
            msg!("{}", instruction.target_friend);
            Ok(())
        }

        3 => {
            // request ksk generation
            msg!("got 3!!");
            let mut coordinate_info= CoordinatesData::try_from_slice(&account.data.borrow())?;
            //coordinate_info.ksk_server_to_me = gen_ksk(from_sk, to_pk);





            Ok(())

        }


        _ => Err(ProgramError::InvalidInstructionData)

        // _ => Err(ProgramError::InvalidInstructionData)
        // 0 => {
        //     let mut bank_account = BankAccount::try_from_slice(&account.data.borrow())?;
        //     bank_account.balance += 1;
        //     bank_account.serialize(&mut &mut account.data.borrow_mut()[..])?;
        //     Ok(())

        // }
        // 1 => {
        //     let mut bank_account = BankAccount::try_from_slice(&account.data.borrow())?;
        //     bank_account.balance -= 1;
        //     bank_account.serialize(&mut &mut account.data.borrow_mut()[..])?;
        //     Ok(())


        // }

        // 2 => {
        //     let mut coordinate_info: Coordinates = Coordinates::try_from_slice(&account.data.borrow())?;
        //     coordinate_info.lat = coordinate_info.lat;
        //     coordinate_info.lat = coordinate_info.lng;
        //     coordinate_info.serialize(&mut &mut account.data.borrow_mut()[..])?;

        //     Ok(())
        // }

        // _ => Err(ProgramError::InvalidInstructionData)
    };



    Ok(())
}

// Sanity tests
//#[cfg(test)]
//mod test {
//    use super::*;
//    use solana_program::clock::Epoch;
//    use std::mem;
//
//    #[test]
//    fn test_sanity() {
//        let program_id = Pubkey::default();
//        let key = Pubkey::default();
//        let mut lamports = 0;
//        let mut data = vec![0; mem::size_of::<u32>()];
//        let owner = Pubkey::default();
//        let account = AccountInfo::new(
//            &key,
//            false,
//            true,
//            &mut lamports,
//            &mut data,
//            &owner,
//            false,
//            Epoch::default(),
//        );
//        let instruction_data: Vec<u8> = Vec::new();
//
//        let accounts = vec![account];
//
//        assert_eq!(
//            BankAccount::try_from_slice(&accounts[0].data.borrow())
//                .unwrap()
//                .balance,
//            0
//        );
//        increase_balance(&program_id, &accounts, &instruction_data).unwrap();
//        assert_eq!(
//            BankAccount::try_from_slice(&accounts[0].data.borrow())
//                .unwrap()
//                .balance,
//            1
//        );
//        increase_balance(&program_id, &accounts, &instruction_data).unwrap();
//        assert_eq!(
//            BankAccount::try_from_slice(&accounts[0].data.borrow())
//                .unwrap()
//                .balance,
//            2
//        );
//    }
//}
//
//