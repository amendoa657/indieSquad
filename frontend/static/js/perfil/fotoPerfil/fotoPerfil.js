// o bonequinho de pixel da pessoa: o apelido decide o desenho, a funcao a cor
function sprite(pessoa, tamanho = 36, extra = "") {
    const principal = funcaoPrincipal(pessoa);
    const semente = pessoa.handle || pessoa.usuario || pessoa.nome || "?";

    return `<is-sprite class="${principal ? classe(principal.categoria) : ""} ${extra}" semente="${escapar(semente)}" style="--is-sprite:${tamanho}px"></is-sprite>`;
}
