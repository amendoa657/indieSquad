// ---------- sorteio que sempre da o mesmo resultado pra mesma palavra ----------

function hash(texto) {
    let h = 2166136261;

    for (const letra of String(texto)) {
        h ^= letra.codePointAt(0);
        h = Math.imul(h, 16777619);
    }

    return h >>> 0;
}

function sorteador(semente) {
    let a = hash(semente) || 1;

    return function () {
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}


export { hash, sorteador };
