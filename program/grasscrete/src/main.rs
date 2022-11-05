
use rand::Rng;

mod lib;
use lib::{
    PublicKey,
    SecretKey,
    KeySwitchKey,
    gen_sk,
    gen_pk,
    gen_ksk,
    encrypt,
    decrypt,
    keyswitch
};

fn test_enc_dec(){
    let server_sk = gen_sk();
    let server_pk = gen_pk(&server_sk);

    for i in 0..10{
        let mut rng = rand::thread_rng();
        let p1 = rng.gen();


        let c1 = encrypt(p1, &server_pk);
        let d1 = decrypt(c1, &server_sk);
        println!("{}, {}", p1, d1);
        assert!(p1 as f32 == d1 as f32);

    }
}

fn test_keyswitch(){
    for i in 0..10{
        let server_sk = gen_sk();
        let server_pk = gen_pk(&server_sk);

        let client1_sk = gen_sk();
        let client1_pk = gen_pk(&client1_sk);

        let ksk = gen_ksk(&server_sk, &client1_pk);

        let mut rng = rand::thread_rng();
        let p1 = rng.gen();
        let c1 = encrypt(p1, &server_pk);
        let c_switched = keyswitch(c1, &ksk);
        let d = decrypt(c_switched, &client1_sk);

        println!("{}, {}", p1, d);

        assert!(p1 as f32 == d as f32);

    }
}


fn main() {
    println!("Hello, world!");

    test_enc_dec();
    test_keyswitch();


}
