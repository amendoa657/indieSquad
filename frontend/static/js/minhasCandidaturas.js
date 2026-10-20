
protegerPagina();


async function cancelar(idCandidatura) {
    const resposta = await pedir(`/candidaturas/${idCandidatura}`, "DELETE");
    if (!resposta) return;

    avisarSucesso("Candidatura cancelada.");
    carregarCandidaturas();
}


async function carregarCandidaturas() {
    const candidaturas = await pedir(`/candidaturas/usuario/${meuId()}`);
    if (!candidaturas) return;

    function contar(status) {
        return candidaturas.filter((candidatura) => candidatura.status === status).length;
    }

    escrever("totalPendentes", contar("pendente"));
    escrever("totalAceitas", contar("aceita"));
    escrever("totalRecusadas", contar("recusada"));

    // a funcao da vaga diz a classe: a candidatura ganha a cor dela
    const skills = await catalogo();

    listar("listaCandidaturas", candidaturas, function (candidatura) {
        const titulo = candidatura.vaga ? candidatura.vaga.titulo : "Vaga removida";
        const projeto = candidatura.projeto ? candidatura.projeto.nome : "Projeto removido";
        const funcao = skills.find((skill) => skill.nome === titulo);

        // so vira card clicavel se o projeto ainda existir
        const clique = candidatura.projeto
            ? `class="linhaTabela linhaCandidatura cartaoClicavel ${classe(funcao && funcao.categoria)}" onclick="irPara('projeto.html?id=${candidatura.projeto.id}')"`
            : `class="linhaTabela linhaCandidatura ${classe(funcao && funcao.categoria)}"`;

        // pendente pode ser cancelada; aceita e recusada nao
        const acao = candidatura.status === "pendente"
            ? `<button type="button" class="mo-tecla mo-tecla--p mo-tecla--sutil" onclick="event.stopPropagation(); cancelar(${candidatura.id})">Cancelar</button>`
            : "";

        return `
            <article ${clique}>
                <div class="cartaoTopo">
                    <span class="iconeClasse"><mo-simbolo nome="${simboloDaClasse(funcao && funcao.categoria)}"></mo-simbolo></span>
                    <div class="cartaoTitulo">
                        <h3>${escapar(titulo)}</h3>
                        <span>em ${escapar(projeto)}</span>
                    </div>
                </div>
                <span class="celulaMono">${dataBonita(candidatura.dataCriacao)}</span>
                <span class="statusCandidatura ${corDoStatus(candidatura.status)}">${escapar(rotulo(candidatura.status))}</span>
                <span class="acaoLinha">${acao}</span>
            </article>
        `;
    }, "Você ainda não se candidatou a nenhuma vaga.");

    if (candidaturas.length === 0) {
        pegar("listaCandidaturas").insertAdjacentHTML("beforeend",
            `<a class="linkMensagemVazia" href="busca.html">Procurar projetos →</a>`);
    }
}

carregarCandidaturas();
