
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
            ? `class="cartao linhaCandidatura cartaoClicavel mira ${classe(funcao && funcao.categoria)}" onclick="irPara('projeto.html?id=${candidatura.projeto.id}')"`
            : `class="cartao linhaCandidatura ${classe(funcao && funcao.categoria)}"`;

        // pendente pode ser cancelada; aceita e recusada nao
        const acao = candidatura.status === "pendente"
            ? `<button type="button" class="mo-tecla mo-tecla--p mo-tecla--sutil" onclick="event.stopPropagation(); cancelar(${candidatura.id})">Cancelar</button>`
            : "";

        return `
            <article ${clique}>
                ${cartucho(projeto, 44)}
                <div class="cartaoTitulo">
                    <h3>${escapar(titulo)}</h3>
                    <span>em <strong>${escapar(projeto)}</strong> · enviada em ${dataBonita(candidatura.dataCriacao)}</span>
                </div>
                <span class="statusCandidatura ${corDoStatus(candidatura.status)}">${escapar(rotulo(candidatura.status))}</span>
                ${acao}
            </article>
        `;
    }, "Você ainda não se candidatou a nenhuma vaga.");

    if (candidaturas.length === 0) {
        pegar("listaCandidaturas").insertAdjacentHTML("beforeend",
            `<a class="linkMensagemVazia" href="busca.html">Procurar projetos →</a>`);
    }
}

carregarCandidaturas();
