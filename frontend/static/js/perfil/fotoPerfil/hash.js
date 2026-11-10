// ---------- sorteio que sempre da o mesmo resultado pra mesma palavra ----------

function hash(texto) {
    // isso aqui e o hash fnv-1a ele transforma o texto num numero gigante e o mesmo texto da sempre o mesmo numero
    let h = 2166136261;

    for (const letra of String(texto)) {
        // mistura o codigo da letra no numero e depois multiplica pelo primo magico do fnv
        h ^= letra.codePointAt(0);
        // o imul multiplica cortando em 32 bits senao o js perde precisao com numero grande
        h = Math.imul(h, 16777619);
    }

    // o >>> 0 so tira o sinal pra nunca dar numero negativo
    return h >>> 0;
}

function sorteador(semente) {
    // o sorteador e o mulberry32 ele comeca no hash do apelido e cada chamada devolve um numero entre 0 e 1 sempre na mesma ordem
    // o || 1 e so pra semente nunca ser zero
    let a = hash(semente) || 1;

    return function () {
        // nao precisa entender cada conta daqui pra baixo e so embaralhamento de bits pra parecer aleatorio
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        // divide pelo maior numero de 32 bits pra cair entre 0 e 1 igual o math random
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}


export { hash, sorteador };
