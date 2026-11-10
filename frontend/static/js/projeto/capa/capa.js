// o tom do projeto sai do nome (o mesmo calculo do cartucho): 0 a 4
function tomDoNome(nome) {
    let h = 2166136261;

    for (const letra of String(nome)) {
        h ^= letra.codePointAt(0);
        h = Math.imul(h, 16777619);
    }

    return (h >>> 0) % 5;
}

function cartucho(nome, tamanho = 44) {
    return `<is-cartucho nome="${escapar(nome)}" style="--is-cartucho:${tamanho}px"></is-cartucho>`;
}
