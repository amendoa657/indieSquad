
protegerPagina();


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
    carregarProjeto();
}


async function responder(idCandidatura, resposta, idVaga, idUsuario) {
    avisar("");

    await pedir(`/candidaturas/${idCandidatura}`, "PUT", { status: resposta });

    // Aceitou: a pessoa vira membro do projeto e a vaga fecha.
    if (resposta === "aceita") {
        await pedir(`/projetos/${idProjeto}/membros/${idUsuario}`, "POST");
        await pedir(`/vagas/${idVaga}`, "PUT", { status: "preenchida" });
    }

    carregarProjeto();
}


async function carregarProjeto() {
    if (!idProjeto) {
        avisar("Nenhum projeto informado no endereço.");
        return;
    }

    const projeto = await pedir(`/projetos/${idProjeto}`);
    if (!projeto) return;

    const membros = (await pedir(`/projetos/${idProjeto}/membros`)) || [];
    const criador = (await pedir(`/projetos/${idProjeto}/criador`)) || {};
    const todasAsVagas = (await pedir("/vagas")) || [];
    const todasAsCandidaturas = (await pedir("/candidaturas")) || [];

    const vagas = todasAsVagas.filter(function (vaga) {
        return String(vaga.projeto_id) === String(idProjeto);
    });

    const candidaturas = todasAsCandidaturas.filter(function (candidatura) {
        return vagas.some((vaga) => vaga.id === candidatura.vagaProjeto_id);
    });

    // Cabeçalho. O avatar é a primeira letra do nome do projeto.
    escrever("avatarProjeto", projeto.nome.charAt(0).toUpperCase());
    escrever("nomeProjeto", projeto.nome);
    escrever("statusProjeto", projeto.status);
    escrever("criadorProjeto", criador.usuario || "Desconhecido");
    escrever("descricaoProjeto", projeto.descricao || "Sem descrição.");

    escrever("totalMembros", membros.length);
    escrever("totalVagasAbertas", vagas.filter((vaga) => vaga.status === "aberta").length);
    escrever("totalCandidaturas", candidaturas.length);

    listar("listaMembros", membros, function (membro) {
        return `
            <div class="itemMembro">
                <span class="avatarMembro">${membro.usuario.charAt(0).toUpperCase()}</span>
                ${membro.usuario}
            </div>
        `;
    }, "Ninguém na equipe ainda.");

    const donoProjeto = String(criador.id) === String(meuId());

    listar("listaVagas", vagas, function (vaga) {
        // Vaga aberta ganha botão, e o dono não se candidata ao próprio projeto.
        const botao = vaga.status === "aberta" && !donoProjeto
            ? `<button type="button" class="botaoCandidatar" onclick="candidatar(${vaga.id})">Candidatar-se</button>`
            : "";

        return `
            <div class="cardResultado">
                <div class="topoCardResultado">
                    <h2>${vaga.titulo}</h2>
                    <span class="statusResultado">${vaga.status}</span>
                </div>
                <p class="descricaoResultado">${vaga.descricao || ""}</p>
                ${botao}
            </div>
        `;
    }, "Nenhuma vaga cadastrada pra esse projeto.");

    // Só o dono do projeto vê e responde as candidaturas.
    if (donoProjeto) {
        pegar("blocoCandidaturas").classList.remove("escondido");
        mostrarCandidaturas(candidaturas, vagas);
    }
}


async function mostrarCandidaturas(candidaturas, vagas) {
    const usuarios = (await pedir("/usuarios")) || [];

    listar("listaCandidaturas", candidaturas, function (candidatura) {
        const pessoa = usuarios.find((usuario) => usuario.id === candidatura.usuario_id);
        const vaga = vagas.find((v) => v.id === candidatura.vagaProjeto_id);
        const nome = pessoa ? pessoa.usuario : "Usuário removido";

        // Pendente mostra os botões; já respondida mostra só o resultado.
        const acoes = candidatura.status === "pendente"
            ? `<button type="button" class="botaoCandidatar" onclick="responder(${candidatura.id}, 'aceita', ${candidatura.vagaProjeto_id}, ${candidatura.usuario_id})">Aceitar</button>
               <button type="button" class="botaoCandidatar botaoRecusar" onclick="responder(${candidatura.id}, 'recusada', ${candidatura.vagaProjeto_id}, ${candidatura.usuario_id})">Recusar</button>`
            : `<span class="statusCandidatura ${corDoStatus(candidatura.status)}">${candidatura.status}</span>`;

        return `
            <div class="cardResultado">
                <div class="topoCardResultado">
                    <h2><span class="avatarMembro">${nome.charAt(0).toUpperCase()}</span> ${nome}</h2>
                    <span class="statusResultado">${vaga ? vaga.titulo : ""}</span>
                </div>
                ${acoes}
            </div>
        `;
    }, "Ninguém se candidatou ainda.");
}

carregarProjeto();
