
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

    listar("listaCandidaturas", candidaturas, function (candidatura) {
        const titulo = candidatura.vaga ? candidatura.vaga.titulo : "Vaga removida";
        const projeto = candidatura.projeto ? candidatura.projeto.nome : "Projeto removido";

        // so vira card clicavel se o projeto ainda existir
        const inicioDoCard = candidatura.projeto
            ? `<div class="cardResultado cardClicavel" onclick="irPara('projeto.html?id=${candidatura.projeto.id}')">`
            : `<div class="cardResultado">`;

        // pendente pode ser cancelada; aceita e recusada nao
        const acao = candidatura.status === "pendente"
            ? `<button type="button" class="botaoCandidatar botaoRecusar" onclick="event.stopPropagation(); cancelar(${candidatura.id})">Cancelar candidatura</button>`
            : "";

        return `
            ${inicioDoCard}
                <div class="topoCardResultado">
                    <h2>${escapar(titulo)}</h2>
                    <span class="statusCandidatura ${corDoStatus(candidatura.status)}">${escapar(rotulo(candidatura.status))}</span>
                </div>
                <p class="descricaoResultado">${escapar(projeto)}</p>
                <p class="dataCandidatura">Enviada em ${dataBonita(candidatura.dataCriacao)}</p>
                ${acao}
            </div>
        `;
    }, `Você ainda não se candidatou a nenhuma vaga.
        <a class="linkMensagemVazia" href="busca.html">Procurar projetos →</a>`);
}

carregarCandidaturas();
