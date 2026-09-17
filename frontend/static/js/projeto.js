
iniciarPagina("busca.html");


const idProjeto = new URLSearchParams(window.location.search).get("id");


async function candidatar(idVaga) {
    avisar("");

    const resposta = await pedir("/candidaturas", "POST", {
        mensagem: "",
        status: "pendente",
        idVagaProjeto: idVaga,
        idUsuario: meuId(),
    });

    if (!resposta) return;

    avisarSucesso("Candidatura enviada! Acompanhe em 'Minhas Candidaturas'.");
}

async function carregarProjeto() {
    if (!idProjeto) {
        escrever("detalhesProjeto", '<p class="mensagemVazia">Nenhum projeto informado no endereço.</p>');
        return;
    }

    const projeto = await pedir(`/projetos/${idProjeto}`);
    if (!projeto) return;

  
    const membros = (await pedir(`/projetos/${idProjeto}/membros`)) || [];
    const criador = (await pedir(`/projetos/${idProjeto}/criador`)) || {};
    const todasAsVagas = (await pedir("/vagas")) || [];

    const vagas = todasAsVagas.filter(function (vaga) {
        return String(vaga.projeto_id) === String(idProjeto);
    });

    escrever("detalhesProjeto", `
        <h1 class="tituloProjetoDetalhe">${projeto.nome}</h1>
        <p class="statusProjetoDetalhe">${projeto.status}</p>
        <p class="descricaoProjetoDetalhe">${projeto.descricao || "Sem descrição"}</p>
        <p class="criadorProjetoDetalhe">Criado por: <strong>${criador.usuario || "Desconhecido"}</strong></p>

        <h3>Membros (${membros.length})</h3>
        <div class="tagsResultado" id="listaMembros"></div>

        <h3 class="tituloVagasDetalhe">Vagas</h3>
        <div class="listaResultados" id="listaVagas"></div>
    `);

    listar("listaMembros", membros, function (membro) {
        return `<span class="tagSkill">${membro.usuario}</span>`;
    }, "Nenhum membro ainda.");

    listar("listaVagas", vagas, function (vaga) {
        // Só dá pra se candidatar em vaga aberta.
        const botao = vaga.status === "aberta"
            ? `<button type="button" class="botaoCandidatar" onclick="candidatar(${vaga.id})">Candidatar-se</button>`
            : "";

        return `
            <div class="cardResultado">
                <div class="cardResultadoTopo">
                    <h2>${vaga.titulo}</h2>
                    <span class="statusProjetoBusca">${vaga.status}</span>
                </div>
                <p class="cardResultadoStats">${vaga.descricao || ""}</p>
                ${botao}
            </div>
        `;
    }, "Nenhuma vaga cadastrada pra esse projeto.");
}

carregarProjeto();
