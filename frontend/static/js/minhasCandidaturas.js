
iniciarPagina("perfil.html");


function corDoStatus(status) {
    if (status === "aceita") return "statusAceita";
    if (status === "recusada") return "statusRecusada";
    return "statusPendente";
}

async function carregarCandidaturas() {
    const candidaturas = await pedir(`/candidaturas/usuario/${meuId()}`);
    if (!candidaturas) return;

    listar("listaCandidaturas", candidaturas, function (candidatura) {
        const titulo = candidatura.vaga ? candidatura.vaga.titulo : "Vaga removida";
        const projeto = candidatura.projeto ? candidatura.projeto.nome : "Projeto removido";

        return `
            <div class="cardResultado">
                <div class="cardResultadoTopo">
                    <h2>${titulo}</h2>
                    <span class="statusCandidatura ${corDoStatus(candidatura.status)}">${candidatura.status}</span>
                </div>
                <p class="cardResultadoStats">Projeto: ${projeto}</p>
            </div>
        `;
    }, "Você ainda não se candidatou a nenhuma vaga.");
}

carregarCandidaturas();
