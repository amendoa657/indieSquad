const token = localStorage.getItem("token");
const idUsuario = token ? token.split("-")[1] : null;

const params = new URLSearchParams(window.location.search);
const idProjeto = params.get("id");

const mensagemErro = document.getElementById("mensagemErro");
const mensagemSucesso = document.getElementById("mensagemSucesso");
const detalhesProjeto = document.getElementById("detalhesProjeto");

async function candidatarSe(idVaga, botao) {
    botao.disabled = true;
    botao.textContent = "Enviando...";

    try {
        const resposta = await fetch("http://localhost:5000/candidaturas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                mensagem: "",
                status: "pendente",
                idVagaProjeto: idVaga,
                idUsuario,
            }),
        });

        if (!resposta.ok) {
            const dados = await resposta.json().catch(() => ({}));
            throw new Error(dados.erro || "Erro ao enviar candidatura");
        }

        mensagemSucesso.textContent = "Candidatura enviada com sucesso!";
        botao.textContent = "Candidatura enviada ✓";
    } catch (erro) {
        console.error(erro);
        botao.disabled = false;
        botao.textContent = "Candidatar-se";
        mensagemErro.textContent = erro.message === "Failed to fetch"
            ? "Não foi possível conectar ao servidor."
            : erro.message;
    }
}

async function carregarProjeto() {
    if (!idProjeto) {
        detalhesProjeto.innerHTML = '<p class="mensagemVazia">Nenhum projeto informado na URL.</p>';
        return;
    }

    try {
        const [respProjeto, respMembros, respCriador, respVagas] = await Promise.all([
            fetch(`http://localhost:5000/projetos/${idProjeto}`),
            fetch(`http://localhost:5000/projetos/${idProjeto}/membros`),
            fetch(`http://localhost:5000/projetos/${idProjeto}/criador`),
            fetch(`http://localhost:5000/vagas`),
        ]);

        const projeto = await respProjeto.json();

        if (!respProjeto.ok) {
            throw new Error(projeto.erro || "Projeto não encontrado");
        }

        const membros = await respMembros.json();
        const criador = await respCriador.json();
        const todasVagas = await respVagas.json();
        const vagasDoProjeto = todasVagas.filter((vaga) => String(vaga.projeto_id) === String(idProjeto));

        detalhesProjeto.innerHTML = `
            <h1 class="tituloProjetoDetalhe">${projeto.nome}</h1>
            <p class="statusProjetoDetalhe">${projeto.status}</p>
            <p class="descricaoProjetoDetalhe">${projeto.descricao || "Sem descrição"}</p>
            <p class="criadorProjetoDetalhe">Criado por: <strong>${criador.usuario || "Desconhecido"}</strong></p>

            <h3>Membros (${membros.length})</h3>
            <div class="tagsResultado">
                ${membros.length > 0 ? membros.map((m) => `<span class="tagSkill">${m.usuario}</span>`).join("") : '<p class="mensagemVazia">Nenhum membro ainda.</p>'}
            </div>

            <h3 class="tituloVagasDetalhe">Vagas</h3>
            <div class="listaResultados" id="listaVagasProjeto"></div>
        `;

        const listaVagasProjeto = document.getElementById("listaVagasProjeto");

        if (vagasDoProjeto.length === 0) {
            listaVagasProjeto.innerHTML = '<p class="mensagemVazia">Nenhuma vaga cadastrada pra esse projeto.</p>';
            return;
        }

        vagasDoProjeto.forEach((vaga) => {
            const card = document.createElement("div");
            card.className = "cardResultado";

            const podeCandidatar = vaga.status === "aberta";

            card.innerHTML = `
                <div class="cardResultadoTopo">
                    <h2>${vaga.titulo}</h2>
                    <span class="statusProjetoBusca">${vaga.status}</span>
                </div>
                <p class="cardResultadoStats">${vaga.descricao || ""}</p>
                ${podeCandidatar ? '<button type="button" class="botaoCandidatar">Candidatar-se</button>' : ""}
            `;

            if (podeCandidatar) {
                const botao = card.querySelector(".botaoCandidatar");
                botao.addEventListener("click", () => candidatarSe(vaga.id, botao));
            }

            listaVagasProjeto.appendChild(card);
        });
    } catch (erro) {
        console.error(erro);
        const texto = erro.message === "Failed to fetch"
            ? "Não foi possível conectar ao servidor."
            : erro.message;
        detalhesProjeto.innerHTML = "";
        mensagemErro.textContent = texto;
    }
}

carregarProjeto();
