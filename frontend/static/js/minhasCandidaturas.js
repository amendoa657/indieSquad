const token = localStorage.getItem("token");
const idUsuario = token ? token.split("-")[1] : null;

const mensagemErro = document.getElementById("mensagemErro");
const listaCandidaturas = document.getElementById("listaCandidaturas");

function corStatus(status) {
    if (status === "aceita") return "statusAceita";
    if (status === "recusada") return "statusRecusada";
    return "statusPendente";
}

async function carregarCandidaturas() {
    try {
        const resposta = await fetch(`http://localhost:5000/candidaturas/usuario/${idUsuario}`);
        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.erro || "Erro ao carregar candidaturas");
        }

        if (dados.length === 0) {
            listaCandidaturas.innerHTML = '<p class="mensagemVazia">Você ainda não se candidatou a nenhuma vaga.</p>';
            return;
        }

        listaCandidaturas.innerHTML = "";

        dados.forEach((candidatura) => {
            const card = document.createElement("div");
            card.className = "cardResultado";
            card.innerHTML = `
                <div class="cardResultadoTopo">
                    <h2>${candidatura.vaga ? candidatura.vaga.titulo : "Vaga removida"}</h2>
                    <span class="statusCandidatura ${corStatus(candidatura.status)}">${candidatura.status}</span>
                </div>
                <p class="cardResultadoStats">Projeto: ${candidatura.projeto ? candidatura.projeto.nome : "Projeto removido"}</p>
            `;
            listaCandidaturas.appendChild(card);
        });
    } catch (erro) {
        console.error(erro);
        mensagemErro.textContent = erro.message === "Failed to fetch"
            ? "Não foi possível conectar ao servidor."
            : erro.message;
    }
}

carregarCandidaturas();
