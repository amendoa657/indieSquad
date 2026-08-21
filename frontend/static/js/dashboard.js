const token = localStorage.getItem("token");
const idUsuario = token ? token.split("-")[1] : null;

async function carregarDashboard() {
    try {
        const resposta = await fetch(`http://localhost:5000/dashboard/${idUsuario}`);
        const dados = await resposta.json();

        if (!resposta.ok) {
            console.error(dados.erro);
            return;
        }

        document.getElementById("nomeUsuario").textContent = dados.nome;
        document.getElementById("statProjetosAtivos").textContent = dados.projetosAtivos;
        document.getElementById("statColaboracoes").textContent = dados.colaboracoes;
        document.getElementById("statTaxaConclusao").textContent = `${dados.taxaConclusao}%`;
        document.getElementById("statTotalProjetos").textContent = dados.totalProjetos;

        const lista = document.getElementById("listaProjetosDash");
        lista.innerHTML = "";

        if (dados.projetos.length === 0) {
            lista.innerHTML = '<p class="mensagemVazia">Você ainda não tem projetos ativos.</p>';
            return;
        }

        dados.projetos.forEach((projeto) => {
            const card = document.createElement("div");
            card.className = "projetoDashCard";
            card.style.cursor = "pointer";
            card.innerHTML = `
                <div class="projetoDashInfo">
                    <h2>${projeto.nome}</h2>
                    <p>${projeto.membros} membro(s)</p>
                    <div class="barraProgresso">
                        <div class="barraProgressoPreenchida" style="width: ${projeto.progresso}%"></div>
                    </div>
                </div>
                <span class="chevronDash">›</span>
            `;
            card.addEventListener("click", () => {
                window.location.href = `projeto.html?id=${projeto.id}`;
            });
            lista.appendChild(card);
        });
    } catch (erro) {
        console.error(erro);
        document.getElementById("listaProjetosDash").innerHTML =
            '<p class="mensagemVazia">Não foi possível conectar ao servidor.</p>';
    }
}

carregarDashboard();
