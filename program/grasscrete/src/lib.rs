use rand::Rng;
use wasm_bindgen::prelude::*;


#[wasm_bindgen]
pub struct SecretKey{
    value: f64
}

#[wasm_bindgen]
pub struct PublicKey{
    value: f64
}

#[wasm_bindgen]
pub struct KeySwitchKey{
    value: f64
}


#[wasm_bindgen]
pub fn gen_sk() -> SecretKey{
    let mut rng = rand::thread_rng();

    let rand_value = rng.gen();
    let res = SecretKey{
        value: rand_value
    };
    res
}

#[wasm_bindgen]
pub fn gen_pk(x: &SecretKey) -> PublicKey{
    let res = PublicKey{
        value: 1./x.value
    };
    res
}

#[wasm_bindgen]
pub fn gen_ksk(from_sk: &SecretKey, to_pk: &PublicKey) -> KeySwitchKey{
    let res = KeySwitchKey{
        value: from_sk.value * to_pk.value
    };
    res
}

#[wasm_bindgen]
pub fn encrypt(x: f64, pk: &PublicKey) -> f64{
    x * pk.value
}

#[wasm_bindgen]
pub fn decrypt(x: f64, sk: &SecretKey) -> f64{
    x * sk.value
}

#[wasm_bindgen]
pub fn keyswitch(x: f64, ksk: &KeySwitchKey) -> f64{
    x * ksk.value
}
