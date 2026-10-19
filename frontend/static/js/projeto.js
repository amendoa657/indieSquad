
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

    // um pedido so: aceitar ja poe na equipe, fecha a vaga e recusa as outras
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


// avaliacao da equipe

// cinco estrelas por criterio
function estrelas(criterio, idColega) {
    const nome = `${criterio}-${idColega}`;

    let html = `<div class="estrelas">`;

    for (let valor = 5; valor >= 1; valor--) {
        html += `
            <input type="radio" name="${nome}" id="${nome}-${valor}" value="${valor}" ${valor === 5 ? "" : ""} />
            <label for="${nome}-${valor}" title="${valor} de 5" aria-label="${valor} de 5">★</label>
        `;
    }

    return html + `</div>`;
}


function campoNota(rotulo, criterio, idColega) {
    return `
        <div class="campoNota">
            <span class="rotuloNota">${rotulo}</span>
            ${estrelas(criterio, idColega)}
        </div>
    `;
}


function notaEscolhida(criterio, idColega) {
    const marcado = document.querySelector(`input[name="${criterio}-${idColega}"]:checked`);

    return marcado ? Number(marcado.value) : null;
}


async function avaliar(idColega) {
    avisar("");

    const comunicacao = notaEscolhida("comunicacao", idColega);
    const prazo = notaEscolhida("prazo", idColega);
    const qualidade = notaEscolhida("qualidade", idColega);

    if (!comunicacao || !prazo || !qualidade) {
        avisar("Dê uma nota pros três critérios antes de enviar.");
        return;
    }

    const resposta = await pedir("/avaliacoes", "POST", {
        idProjeto: Number(idProjeto),
        idAvaliado: idColega,
        notaComunicacao: comunicacao,
        notaPrazo: prazo,
        notaQualidade: qualidade,
        comentario: pegar(`comentario-${idColega}`).value.trim(),
    });

    if (!resposta) return;

    avisarSucesso(resposta.mensagem);
    carregarAvaliacoes();
}


function cardColega(colega) {
    const pessoa = colega.usuario;
    const cabecalho = `
        <div class="topoCardResultado">
            <h2>
                <span class="avatarMembro">${escapar(pessoa.usuario.charAt(0).toUpperCase())}</span>
                ${escapar(pessoa.usuario)}
            </h2>
        </div>
    `;

    // ja recebi a avaliacao dela: as duas enviaram, entao as duas aparecem
    if (colega.recebida) {
        const recebida = colega.recebida;

        return `
            <div class="cardResultado">
                ${cabecalho}
                <div class="notasRecebidas">
                    <span class="notaGrande">${numero(recebida.nota, 0)}</span>
                    <div class="detalheNotas">
                        <span>Comunicação ${recebida.notaComunicacao}</span>
                        <span>Prazo ${recebida.notaPrazo}</span>
                        <span>Qualidade ${recebida.notaQualidade}</span>
                    </div>
                </div>
                ${recebida.comentario ? `<p class="descricaoResultado">“${escapar(recebida.comentario)}”</p>` : ""}
            </div>
        `;
    }

    // eu ja avaliei, mas a outra pessoa ainda nao
    if (colega.esperandoResposta) {
        return `
            <div class="cardResultado">
                ${cabecalho}
                <p class="avisoEspera">
                    Você já avaliou. A sua nota e a dela só aparecem quando ${escapar(pessoa.usuario)} também avaliar.
                </p>
            </div>
        `;
    }

    return `
        <div class="cardResultado">
            ${cabecalho}
            ${campoNota("Comunicação", "comunicacao", pessoa.id)}
            ${campoNota("Cumpriu prazos", "prazo", pessoa.id)}
            ${campoNota("Qualidade da entrega", "qualidade", pessoa.id)}

            <div class="campoFormulario">
                <label for="comentario-${pessoa.id}">Comentário</label>
                <textarea id="comentario-${pessoa.id}" placeholder="O que foi bom, o que daria pra melhorar..."></textarea>
            </div>

            <button type="button" class="botaoEnviar" onclick="avaliar(${pessoa.id})">Enviar avaliação</button>
        </div>
    `;
}


async function carregarAvaliacoes() {
    const dados = await pedir(`/projetos/${idProjeto}/avaliacoes`);
    if (!dados) return;

    pegar("blocoAvaliacoes").classList.remove("escondido");

    escrever("explicacaoDuploCego",
        `A sua avaliação fica escondida até a outra pessoa enviar a dela, ou até passar ${dados.prazoLiberacaoDias} dias. ` +
        `Assim ninguém avalia já sabendo que nota vai receber de volta.`);

    listar("listaAvaliacoes", dados.colegas, cardColega, "Você foi o único participante desse projeto.");
}


async function carregarProjeto() {
    if (!idProjeto) {
        avisar("Nenhum projeto informado no endereço.");
        return;
    }

    // a tela inteira vem em tres pedidos, nao em cinco
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

    // ficha tecnica: campos que o formulario ja pedia e eram descartados
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

        // o servidor ja diz se eu me candidatei nessa vaga
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

    // a avaliacao abre quando o projeto termina, e so pra quem esteve nele
    if (projeto.status === "concluido" && projeto.ehDaEquipe) {
        carregarAvaliacoes();
    }

    // so o dono do projeto ve e responde as candidaturas
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

        // pendente mostra os botoes; ja respondida mostra so o resultado
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
