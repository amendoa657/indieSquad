
protegerPagina();


const idProjeto = parametro("id");


async function candidatar(idVaga) {
    avisar("");

    const mensagem = prompt("Escreve uma mensagem pro dono do projeto (opcional):") || "";

    const resposta = await pedir("/candidaturas", "POST", {
        idVagaProjeto: idVaga,
        mensagem: mensagem,
    });

    if (!resposta) return;

    avisarSucesso("Candidatura enviada! Acompanhe em 'Minhas Candidaturas'.");
    carregarProjeto();
}


async function responder(idCandidatura, status) {
    avisar("");

    // Um pedido só. Aceitar já coloca a pessoa na equipe, fecha a vaga e
    // recusa as outras candidaturas daquela vaga, tudo junto no servidor.
    const resposta = await pedir(`/candidaturas/${idCandidatura}/responder`, "PUT", { status: status });
    if (!resposta) return;

    carregarProjeto();
}


async function concluir() {
    if (!confirm("Concluir o projeto? Isso fecha as vagas abertas e libera a avaliação entre a equipe.")) {
        return;
    }

    const resposta = await pedir(`/projetos/${idProjeto}/concluir`, "PATCH");
    if (!resposta) return;

    avisarSucesso("Projeto concluído!");
    carregarProjeto();
}


async function carregarProjeto() {
    if (!idProjeto) {
        avisar("Nenhum projeto informado no endereço.");
        return;
    }

    // A tela inteira vem em três pedidos, não em cinco. E nenhum deles baixa
    // dado de projeto alheio, como acontecia com o /vagas e o /candidaturas.
    const projeto = await pedir(`/projetos/${idProjeto}`);
    if (!projeto) return;

    const membros = (await pedir(`/projetos/${idProjeto}/membros`)) || [];
    const vagas = (await pedir(`/projetos/${idProjeto}/vagas`)) || [];

    escrever("avatarProjeto", escapar(projeto.nome.charAt(0).toUpperCase()));
    escrever("nomeProjeto", escapar(projeto.nome));
    escrever("statusProjeto", escapar(rotulo(projeto.status)));
    escrever("criadorProjeto", escapar(projeto.criador.usuario));
    escrever("descricaoProjeto", escapar(projeto.descricao) || "Sem descrição.");

    escrever("totalMembros", membros.length);
    escrever("totalVagasAbertas", vagas.filter((vaga) => vaga.status === "aberta").length);

    // Ficha técnica do projeto: campos que o formulário de publicar já pedia e
    // que antes eram jogados fora.
    if (pegar("fichaProjeto")) {
        const ficha = [
            ["Gênero", projeto.genero],
            ["Engine", projeto.engine],
            ["Parceria", TIPOS_PARCERIA[projeto.tipoParceria] || projeto.tipoParceria],
            ["Duração", projeto.duracaoEstimada],
        ].filter((item) => item[1]);

        listar("fichaProjeto", ficha, function (item) {
            return `<div class="itemFicha"><span>${escapar(item[0])}</span><strong>${escapar(item[1])}</strong></div>`;
        }, "Sem ficha técnica.");
    }

    if (pegar("marcosProjeto")) {
        listar("marcosProjeto", projeto.marcos, function (marco) {
            return `
                <div class="itemMarco ${marco.concluido ? "marcoConcluido" : ""}">
                    <span class="caixaMarco">${marco.concluido ? "✓" : ""}</span>
                    ${escapar(marco.titulo)}
                </div>
            `;
        }, "Nenhum marco definido.");
    }

    listar("listaMembros", membros, function (membro) {
        return `
            <div class="itemMembro cardClicavel" onclick="irPara('perfil.html?handle=${encodeURIComponent(membro.handle)}')">
                <span class="avatarMembro">${escapar(membro.usuario.charAt(0).toUpperCase())}</span>
                ${escapar(membro.usuario)}
                <span class="cargoMembro">${escapar(membro.cargo)}</span>
            </div>
        `;
    }, "Ninguém na equipe ainda.");

    listar("listaVagas", vagas, function (vaga) {
        const nivel = vaga.nivelMinimo ? `<span class="tagSkill">${escapar(NIVEIS[vaga.nivelMinimo])} ou mais</span>` : "";

        // O servidor já diz se eu me candidatei, então a tela não precisa
        // adivinhar nem baixar todas as candidaturas pra descobrir.
        let acao = "";

        if (vaga.minhaCandidatura) {
            acao = `<span class="statusCandidatura ${corDoStatus(vaga.minhaCandidatura.status)}">Candidatura ${escapar(rotulo(vaga.minhaCandidatura.status))}</span>`;
        } else if (vaga.status === "aberta" && !projeto.ehCriador) {
            acao = `<button type="button" class="botaoCandidatar" onclick="candidatar(${vaga.id})">Candidatar-se</button>`;
        }

        return `
            <div class="cardResultado">
                <div class="topoCardResultado">
                    <h2>${escapar(vaga.titulo)}</h2>
                    <span class="statusResultado">${escapar(rotulo(vaga.status))}</span>
                </div>
                <p class="descricaoResultado">${escapar(vaga.descricao)}</p>
                <div class="tagsResultado">
                    <span class="tagSkill">${escapar(vaga.skillNome)}</span>
                    ${nivel}
                </div>
                ${acao}
            </div>
        `;
    }, "Nenhuma vaga cadastrada pra esse projeto.");

    // Só o dono do projeto vê e responde as candidaturas.
    if (projeto.ehCriador) {
        pegar("blocoCandidaturas").classList.remove("escondido");
        mostrarCandidaturas();

        if (pegar("blocoDono")) {
            pegar("blocoDono").classList.remove("escondido");
            pegar("botaoConcluir").disabled = projeto.status === "concluido";
        }
    }
}


async function mostrarCandidaturas() {
    const candidaturas = await pedir(`/projetos/${idProjeto}/candidaturas`);
    if (!candidaturas) return;

    escrever("totalCandidaturas", candidaturas.length);

    listar("listaCandidaturas", candidaturas, function (candidatura) {
        const pessoa = candidatura.candidato;
        const nota = pessoa.reputacao.total > 0
            ? `<span class="metricaResultado">${ICONES.estrela} ${numero(pessoa.reputacao.media)} · ${plural(pessoa.reputacao.total, "avaliação", "avaliações")}</span>`
            : `<span class="metricaResultado">Sem avaliação ainda</span>`;

        // Pendente mostra os botões; já respondida mostra só o resultado.
        const acoes = candidatura.status === "pendente"
            ? `<button type="button" class="botaoCandidatar" onclick="responder(${candidatura.id}, 'aceita')">Aceitar</button>
               <button type="button" class="botaoCandidatar botaoRecusar" onclick="responder(${candidatura.id}, 'recusada')">Recusar</button>`
            : `<span class="statusCandidatura ${corDoStatus(candidatura.status)}">${escapar(rotulo(candidatura.status))}</span>`;

        const mensagem = candidatura.mensagem
            ? `<p class="descricaoResultado">“${escapar(candidatura.mensagem)}”</p>`
            : "";

        return `
            <div class="cardResultado">
                <div class="topoCardResultado">
                    <h2>
                        <span class="avatarMembro">${escapar(pessoa.usuario.charAt(0).toUpperCase())}</span>
                        ${escapar(pessoa.usuario)}
                    </h2>
                    <span class="statusResultado">${escapar(candidatura.vaga.titulo)}</span>
                </div>
                <div class="metricasResultado">${nota}</div>
                <div class="tagsResultado">
                    ${pessoa.skills.map((skill) => `<span class="tagSkill">${escapar(skill.nome)} · ${escapar(NIVEIS[skill.nivel])}</span>`).join("")}
                </div>
                ${mensagem}
                ${acoes}
            </div>
        `;
    }, "Ninguém se candidatou ainda.");
}

carregarProjeto();
