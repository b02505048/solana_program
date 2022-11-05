const gen_sk = (): number => {
    return Math.random();
}

const gen_pk = (sk: number): number => {
    return 1.0/sk;
}

const encrypt = (x: number, pk: number): number => {
    return x * pk;
}

const decrypt = (x: number, sk: number): number => {
    return x * sk;
}


export{
    gen_sk,
    gen_pk,
    encrypt,
    decrypt
}