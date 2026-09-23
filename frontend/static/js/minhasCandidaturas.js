
protegerPagina();


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
        const data = new Date(candidatura.dataCriacao).toLocaleDateString("pt-BR");

        // Só vira card clicável se o projeto ainda existir.
        const inicioDoCard = candidatura.projeto
            ? `<div class="cardResultado cardClicavel" onclick="irPara('projeto.html?id=${candidatura.projeto.id}')">`
            : `<div class="cardResultado">`;

        return `
            ${inicioDoCard}
                <div class="topoCardResultado">
                    <h2>${titulo}</h2>
                    <span class="statusCandidatura ${corDoStatus(candidatura.status)}">${candidatura.status}</span>
                </div>
                <p class="descricaoResultado">${projeto}</p>
                <p class="dataCandidatura">Enviada em ${data}</p>
            </div>
        `;
    }, `Você ainda não se candidatou a nenhuma vaga.
        <a class="linkMensagemVazia" href="busca.html">Procurar projetos →</a>`);
}

carregarCandidaturas();
